"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getFilterProducts = exports.getAllProducts = void 0;
const product_model_1 = __importDefault(require("../models/product.model"));
const ITEMS_PER_PAGE = 5;
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1 } = req.query;
        const totalProducts = yield product_model_1.default.countDocuments();
        const products = yield product_model_1.default.find()
            .limit(ITEMS_PER_PAGE)
            .skip((+page - 1) * ITEMS_PER_PAGE);
        res.json({
            products,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / ITEMS_PER_PAGE),
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getAllProducts = getAllProducts;
const getFilterProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = {};
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
        const totalProducts = yield product_model_1.default.countDocuments(query);
        const products = yield product_model_1.default.find(query)
            .limit(ITEMS_PER_PAGE)
            .skip((+page - 1) * ITEMS_PER_PAGE);
        res.json({
            products,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / ITEMS_PER_PAGE),
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getFilterProducts = getFilterProducts;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, description, color, brand } = req.body;
        const product = new product_model_1.default(req.body);
        yield product.save();
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const { name, price, description, color, brand } = req.body;
        const updatedProduct = yield product_model_1.default.findByIdAndUpdate(productId, { name, price, description, color, brand }, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(updatedProduct);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const deletedProduct = yield product_model_1.default.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ message: "Product deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteProduct = deleteProduct;
