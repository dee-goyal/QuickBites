const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

router.post(
  "/createuser",
  [
    body("email").isEmail(),
    body("name").isLength({ min: 5 }),
    body("password", "Incorrect Password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      await User.create({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        location: req.body.location,
      });
      res.json({ success: true });
    } catch (error) {
      console.log("error occured");
      res.json({ success: false });
    }
  }
);

router.post(
    "/loginuser",
    [
      body("email").isEmail(),
      body("password", "Incorrect Password").isLength({ min: 5 }),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Return the response here
      }
  
      const { email, password } = req.body;
  
      try {
        // Find user by email
        let userData = await User.findOne({ email: email });
        
        // Check if user exists
        if (!userData) {
          return res.status(400).json({ errors: "User not found, please check your credentials" }); // Return here
        }
  
        // Compare the passwords
        if (password !== userData.password) {
          return res.status(400).json({ errors: "Incorrect password, please try again" }); // Return here
        }
  
        // Successful login
        return res.json({ success: true }); // Return here
      } catch (error) {
        console.log("An error occurred during login:", error);
        return res.status(500).json({ success: false, message: "Server error" }); // Return here
      }
    }
  );
  

module.exports = router;
