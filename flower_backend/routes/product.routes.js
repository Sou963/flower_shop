const express = require("express");
const connectDB = require("../db");

const router = express.Router();

// 👉 Place an Order
router.post("/", async (req, res) => {
  try {
    const { productName, quantity, buyerName, buyerEmail, buyerAddress, paymentMethod } = req.body;

    if (!productName || !quantity || !buyerName || !buyerEmail || !buyerAddress || !paymentMethod) {
      return res.status(400).json({ error: "সব ফিল্ড আবশ্যক" });
    }

    const db = await connectDB();

    const order = {
      productName,
      quantity: parseInt(quantity),
      buyerName,
      buyerEmail,
      buyerAddress,
      paymentMethod,
      createdAt: new Date(),
      status: "Pending"
    };

    const result = await db.collection("orders").insertOne(order);

    res.json({ message: "Order placed successfully 🌸", orderId: result.insertedId });

  } catch (error) {
    console.error("ORDER ERROR:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// 👉 Get All Orders (optional, for admin)
router.get("/", async (req, res) => {
  try {
    const db = await connectDB();
    const orders = await db.collection("orders").find().toArray();
    res.json(orders);
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
