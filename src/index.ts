import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.route";
import productRoutes from "./routes/product.route";
import cartRoutes from "./routes/cart.route";
import checkoutRoutes from "./routes/checkout.route";
// import dotenv from "dotenv";

// dotenv.config();
const { connection } = require("./config/db");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log(`server is running on port ${PORT}`);
  } catch (err) {
    console.log("err", err);
  }
});
