import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItemQuantity,
} from "../controllers";
import { authenticateUser, authorizeUser } from "../middlewares";

const router = express.Router();

router.get("/", authenticateUser, authorizeUser, getCart);
router.post("/:productId", authenticateUser, authorizeUser, addToCart);
router.delete("/:productId", authenticateUser, authorizeUser, removeFromCart);
router.patch(
  "/:productId",
  authenticateUser,
  authorizeUser,
  updateCartItemQuantity
);

export default router;
