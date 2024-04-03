import mongoose, { Document, Schema } from "mongoose";
import { ProductModel } from "./product.model";

export interface CartItem {
  product: string | ProductModel;
  quantity: number;
}

export interface CartModel extends Document {
  userId: Schema.Types.ObjectId;
  items: CartItem[];
}

const cartItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, default: 1 },
});

const CartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [cartItemSchema],
});

export default mongoose.model<CartModel>("Cart", CartSchema);
