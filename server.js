const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// 🔌 Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// 📦 Order Schema
const Order = mongoose.model("Order", new mongoose.Schema({
  patient: String,
  doctor: String,
  amount: Number,
  status: String,
  created_at: { type: Date, default: Date.now }
}));

// 🔐 Fake token
let auth_token = "demo_token";

// 🔁 Endpoints
app.post("/auth/token", (req, res) => {
  res.json({ success: true, token: auth_token });
});

app.post("/order/create", async (req, res) => {
  const { patient, doctor, amount } = req.body;

  const order = new Order({
    patient,
    doctor,
    amount,
    status: "pending"
  });

  await order.save();
  res.json({ success: true, order_id: order._id });
});

app.get("/orders", async (req, res) => {
  const orders = await Order.find().sort({ created_at: -1 });
  res.json(orders);
});

app.listen(PORT, () => {
  console.log(`API with MongoDB running on port ${PORT}`);
});