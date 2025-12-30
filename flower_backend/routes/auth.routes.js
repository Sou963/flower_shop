const express = require("express");
const bcrypt = require("bcryptjs");
const connectDB = require("../db");

const router = express.Router();

/* ========== REGISTER ========== */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "সব ফিল্ড আবশ্যক" });
    }

    const db = await connectDB();

    const userExist = await db.collection("users").findOne({ email });
    if (userExist) {
      return res.status(400).json({ error: "Email আগে থেকেই আছে" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date()
    });

    res.json({ message: "রেজিস্ট্রেশন সফল 🌸" });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/* ========== LOGIN ========== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email ও password প্রয়োজন" });
    }

    const db = await connectDB();
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User পাওয়া যায়নি" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Password ভুল" });
    }

    // ✅ Token ছাড়া শুধু user info পাঠানো হচ্ছে
    res.json({
      message: "Login সফল 🌸",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
