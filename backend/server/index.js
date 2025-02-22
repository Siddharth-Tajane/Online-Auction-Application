require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET; // Change this to a secure secret key

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1]; // Fix token format
    if (!token) return res.status(401).json({ message: "Access Denied" });
  
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ message: "Invalid or expired token" });
      req.user = decoded;
      next();
    });
  };
  
  // Protected Dashboard Route
  app.get("/dashboard", verifyToken, (req, res) => {
    res.json({ email: req.user.email, message: "Welcome to your dashboard!" });
  });
  



// MongoDB Connection
mongoose.connect("mongodb+srv://Siddharth:Sidd1242_@cluster.6x3ac.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema~
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model("User", UserSchema);

// Signup Route
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword });

  await user.save();
  res.json({ message: "User registered successfully!" });
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
});



app.listen(5000, () => console.log("Server running on port 5000"));
