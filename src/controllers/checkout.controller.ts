import Cart from "../models/cart.model";
import { AuthType } from "../middlewares";
import { Response } from "express";

export const checkout = async (req: AuthType, res: Response) => {
  try {
    const userId = req.currentUser?._id;

    const cart = await Cart.findOne({ userId });
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
