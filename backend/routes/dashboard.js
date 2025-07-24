const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");

router.get("/", authenticateToken, (req, res) => {
  res.status(200).json({
    message: "Welcome to your dashboard",
    user: req.user,
  });
});

module.exports = router;
