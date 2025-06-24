const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

// Route to create a new user
router.post(
  "/createuser",
  [
    body("email").isEmail().normalizeEmail(),
    body("name").isLength({ min: 5 }).trim().escape(),
    body("password", "Password must be at least 8 characters").isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({ 
          success: false,
          message: "User already exists" 
        });
      }

      // Hash password with stronger salt rounds
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const newUser = await User.create({
        name: req.body.name,
        password: hashedPassword,
        email: req.body.email,
        location: req.body.location,
      });

      const authToken = jwt.sign(
        { 
          userId: newUser._id,
          iat: Math.floor(Date.now() / 1000) // issued at
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.json({ 
        success: true, 
        authToken,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email
        }
      });
    } catch (error) {
      console.error("Error during user creation:", error);
      res.status(500).json({ 
        success: false, 
        message: "Internal Server Error",
        error: error.message 
      });
    }
  }
);

// Route for user login
router.post(
  "/loginuser",
  [
    body("email").isEmail().normalizeEmail(),
    body("password", "Password must be at least 8 characters").isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: "Invalid credentials" 
        });
      }

      const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ 
          success: false,
          message: "Invalid credentials" 
        });
      }

      const authToken = jwt.sign(
        { 
          userId: user._id,
          iat: Math.floor(Date.now() / 1000)
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.json({
        success: true,
        authToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ 
        success: false, 
        message: "Internal Server Error",
        error: error.message 
      });
    }
  }
);

module.exports = router;