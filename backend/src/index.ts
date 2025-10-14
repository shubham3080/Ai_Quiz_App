import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
console.log("MongoDB URI:", process.env.MONGO_DB_URI);
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

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

    const hashedPassword = await bcrypt.hash(password, 10);

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

app.post("/categories", async (req, res) => {
  const { categoriesTitles } = req.body;
  console.log(categoriesTitles);
  const newCatogories = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
    Generate exactly 30 diverse and popular quiz categories for an educational quiz app.
    Each category should be a broad field of knowledge (e.g., "Information Technology", "Art History").
    Each object must have: "name", "description", "trending" (boolean), "color" (string like "bg-blue-50").
    Return them as a JSON array of strings in the below format:
   [{"name": "Information Technology","description": "Master the digital world - from coding and cybersecurity to cloud computing and AI systems that power modern society.","trending": true},...]
   Do NOT repeat any of the following categorie names: ${
     categoriesTitles.length ? categoriesTitles.join(", ") : "none"
   }.
   give categories other than the above ones
    Do NOT wrap the response in markdown code blocks.
    Do NOT add any explanation, prefix, or suffix.
  `,
  });
  const JsonResponse = newCatogories.text;
  let response = [];
  if (JsonResponse) {
    response = JSON.parse(JsonResponse);
    console.log(1, typeof response);
  }
  console.log(response);
  res.json({ response });
});

app.post("/categoriesBySearch", async (req, res) => {
  const { search } = req.body();
  const catogories = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
    Generate exactly 10 diverse and popular quiz categories for an educational quiz app.
    Each category should be a broad field of knowledge (e.g., "Information Technology", "Art History").
    Return them as a JSON array of strings, nothing else.
    Example: ["Information Technology", "World Geography", "Classical Music"]
    Do NOT wrap the response in markdown code blocks.
    Do NOT add any explanation, prefix, or suffix.
    Categories should start with ${search} or should be catogories related with ${search}
  `,
  });
  const JsonResponse = catogories.text;
  let response = [];
  if (JsonResponse) {
    response = JSON.parse(JsonResponse);
    console.log(1, typeof response);
  }
  // console.log(response);
  res.json({ response });
});

app.post("/subcategory", async (req, res) => {
  const { category,existingSubcategories } = req.body;
  const newSubCategories = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
  Generate exactly 10 diverse and relevant subcategories for the main quiz category: "${category}".
  
  Each subcategory should be a specific, well-defined topic within "${category}" 
  (e.g., if parent is "Information Technology", valid subcategories include "React.js", "Node.js", "Cybersecurity", "Cloud Architecture").
  
  Each object must have:
    - "name": short, clear title (e.g., "Machine Learning")
    - "description": 1-sentence engaging explanation of what the subcategory covers
    - "trending": boolean (true if currently popular or high-demand)
    - "new" : boolean (true if the topic is recently introduced)
    - "color": a Tailwind-compatible background color class like "bg-blue-50", "bg-green-50", etc. (use varied soft colors)

  Return them as a JSON array of objects in this exact format:
  [{"name":"...","description":"...","trending":true,,"new":true,"color":"..."}, ...]

  Do NOT include any of the following subcategory names (avoid duplicates):
  ${existingSubcategories.length ? existingSubcategories.join(", ") : "none"}

  Do NOT wrap the response in markdown code blocks (no \`\`\`json).
  Do NOT add any introduction, explanation, prefix, or suffix.
  Return ONLY valid JSON.
`,
  });
  const JsonResponse = newSubCategories.text;
  let response = [];
  if (JsonResponse) {
    response = JSON.parse(JsonResponse);
    console.log(1, typeof response);
  }
  console.log(response);
  res.json({ response });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
