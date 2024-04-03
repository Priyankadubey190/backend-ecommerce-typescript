// src/models/Product.ts
import mongoose, { Document, Schema } from "mongoose";

export interface ProductModel extends Document {
  image: string;
  name: string;
  color: string;
  price: number;
  description: string;
  review: number;
}

const ProductSchema = new Schema({
  image: { type: String, required: true },
  name: { type: String, required: true },
  color: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  review: { type: Number, required: true },
});

export default mongoose.model<ProductModel>("Product", ProductSchema);
