import Cart from "../models/cart.model";
import { AuthType } from "../middlewares";
import { Response } from "express";
import mongoose from "mongoose";

export const checkout = async (req: AuthType, res: Response) => {
  try {
    const userId = req.currentUser?._id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID not found" });
    }

    const castedUserId = mongoose.Types.ObjectId(userId.toString());
    const cart = await Cart.findOne({ userId: castedUserId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();
    res.json({ message: "Checkout successful" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
