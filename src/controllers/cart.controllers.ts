import { Request, Response } from "express";
import Cart, { CartModel } from "../models/cart.model";
import { AuthType } from "../middlewares";

const ITEMS_PER_PAGE = 5;

export const getCart = async (req: AuthType, res: Response) => {
  try {
    const { page = 1 } = req.query;
    const userId = req.currentUser?._id;
    const cart = await Cart.findOne({ userId })
      .populate("items.product")
      .limit(ITEMS_PER_PAGE)
      .skip((+page - 1) * ITEMS_PER_PAGE);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.json(cart);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addToCart = async (req: AuthType, res: Response) => {
  try {
    const { productId } = req.params;

    const userId = req.currentUser?._id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID not found" });
    }

    let cart: CartModel | null = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [{ product: productId, quantity: 1 }] });
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );
      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.items.push({ product: productId, quantity: 1 });
      }
    }

    await cart.save();

    res.json(cart);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req: AuthType, res: Response) => {
  try {
    const { productId } = req.params;
    const userId = req.currentUser?._id;

    let cart: CartModel | null = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.items.splice(itemIndex, 1);

    await cart.save();

    res.json(cart);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCartItemQuantity = async (req: AuthType, res: Response) => {
  try {
    const { productId } = req.params;
    const { action } = req.body;
    const userId = req.currentUser?._id;

    let cart: CartModel | null = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    if (action === "increase") {
      item.quantity++;
    } else if (action === "decrease") {
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        cart.items = cart.items.filter(
          (cartItem) => cartItem.product.toString() !== productId
        );
      }
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await cart.save();

    res.json(cart);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
