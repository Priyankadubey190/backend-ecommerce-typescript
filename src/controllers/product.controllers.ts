import { Request, Response } from "express";
import Product, { ProductModel } from "../models/product.model";
import { ProductFilterType } from "../types";

const ITEMS_PER_PAGE = 5;

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { page = 1 } = req.query;
    const totalProducts = await Product.countDocuments();
    const products: ProductModel[] = await Product.find()
      .limit(ITEMS_PER_PAGE)
      .skip((+page - 1) * ITEMS_PER_PAGE);

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / ITEMS_PER_PAGE),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getFilterProducts = async (req: Request, res: Response) => {
  try {
    let query: any = {};
    const { color, brand, minPrice, maxPrice, page = 1 } = req.query;

    if (color) {
      query["color"] = color;
    }
    if (brand) {
      query["brand"] = brand;
    }
    if (minPrice && maxPrice) {
      query["price"] = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    }

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .limit(ITEMS_PER_PAGE)
      .skip((+page - 1) * ITEMS_PER_PAGE);

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / ITEMS_PER_PAGE),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, description, color, brand } = req.body;
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { name, price, description, color, brand } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, price, description, color, brand },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
