const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const jwtSecret = "ikmFccWJ9OBqOGEEVkgtdMcDQ5S4CgdI";

// Route to create a new user
router.post(
  "/createuser",
  [
    body("email").isEmail(),
    body("name").isLength({ min: 5 }),
    body("password", "Password must be at least 5 characters").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      await User.create({
        name: req.body.name,
        password: hashedPassword,
        email: req.body.email,
        location: req.body.location,
      });

      const userData = await User.findOne({ email: req.body.email });
      if (!userData) {
        return res.status(400).json({ errors: "User creation failed" });
      }

      const data = {
        user: {
          id: userData.id,
        },
      };

      const authToken = jwt.sign(data, jwtSecret);
      res.json({ success: true, authToken });
    } catch (error) {
      console.error("Error during user creation:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
);

// Route for user login
router.post(
  "/loginuser",
  [
    body("email").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const userData = await User.findOne({ email });
      if (!userData) {
        return res.status(400).json({ errors: "Invalid credentials" });
      }

      const isPasswordCorrect = await bcrypt.compare(password, userData.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ errors: "Invalid credentials" });
      }

      const data = {
        user: {
          id: userData.id,
        },
      };

      const authToken = jwt.sign(data, jwtSecret);
      res.json({ success: true, authToken });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
);

module.exports = router;
