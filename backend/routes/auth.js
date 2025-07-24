const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { body, validationResult } = require("express-validator");
const authenticateToken = require("../middleware/auth");


const validateRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email address"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
];


router.post("/register", validateRegister, (req, res, next) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(err => err.msg)
    });
  }
  
  authController.register(req, res, next);
});

const validateLogin = [
  body("email").trim().isEmail().withMessage("Invalid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];

router.post("/login", validateLogin, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map((err) => err.msg),
    });
  }

  authController.login(req, res, next);
});




router.get("/dashboard", authenticateToken, (req, res) => {
  res.json({ message: "Welcome to your dashboard", user: req.user });
});



module.exports = router;


