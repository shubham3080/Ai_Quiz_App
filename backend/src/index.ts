import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors";
 
dotenv.config();
 
const app = express();
app.use(cors());
app.use(express.json());
mongoose
  .connect(process.env.MONGO_DB_URI!)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("DB Connection Error:", err.message);
    process.exit(1);
  });
 
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
 
const User = mongoose.model("User", userSchema);
 
const generateToken = (user: { id: string; name: string }) => {
  return jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
};
 
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
 
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
 
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
 
    const hashedPassword = await bcrypt.hash(password,10);
 
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
 
    const token = generateToken({ id: user._id.toString(), name: name });
 
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
 
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
 
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
 
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
 
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
 
    const token = generateToken({ id: user._id.toString(), name: user.name });
 
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
 