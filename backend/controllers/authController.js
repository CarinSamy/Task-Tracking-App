const bcrypt = require("bcrypt");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const config = require('../config/config');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hash });
    res.status(201).json({ message: "User registered", user: newUser });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      res.status(400).json({ error: "Email already exists" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user.id }, config.jwtSecret, {
            expiresIn: config.jwtExpiresIn,
        });

      

    
        return res.status(200).json({
            message: "Login successful", token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            
            }
            });
      
      
      
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

