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
exports.updateCartItemQuantity = exports.removeFromCart = exports.addToCart = exports.getCartProductById = exports.getCart = void 0;
const cart_model_1 = __importDefault(require("../models/cart.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const ITEMS_PER_PAGE = 5;
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { page = 1 } = req.query;
        const userId = (_a = req.currentUser) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            return res
                .status(401)
                .json({ message: "Unauthorized: User ID not found" });
        }
        const castedUserId = mongoose_1.default.Types.ObjectId(userId.toString());
        const cart = yield cart_model_1.default.findOne({ userId: castedUserId })
            .populate("items.product")
            .limit(ITEMS_PER_PAGE)
            .skip((+page - 1) * ITEMS_PER_PAGE);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        res.json(cart);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getCart = getCart;
const getCartProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const productId = req.params.productId;
        const userId = (_b = req.currentUser) === null || _b === void 0 ? void 0 : _b._id;
        if (!userId) {
            return res
                .status(401)
                .json({ message: "Unauthorized: User ID not found" });
        }
        const castedUserId = mongoose_1.default.Types.ObjectId(userId.toString());
        const cartProduct = yield cart_model_1.default.findOne({ userId: castedUserId, "items.product._id": productId }, { "items.$": 1 }).populate("items.product");
        if (!cartProduct) {
            return res.status(404).json({ message: "Cart product not found" });
        }
        res.status(200).json({ cartProduct });
    }
    catch (error) {
        console.error("Error getting cart product by ID:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getCartProductById = getCartProductById;
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const { productId } = req.params;
        const userId = (_c = req.currentUser) === null || _c === void 0 ? void 0 : _c._id;
        if (!userId) {
            return res
                .status(401)
                .json({ message: "Unauthorized: User ID not found" });
        }
        const castedUserId = mongoose_1.default.Types.ObjectId(userId.toString());
        let cart = yield cart_model_1.default.findOne({ userId: castedUserId });
        if (!cart) {
            cart = new cart_model_1.default({ userId, items: [{ product: productId, quantity: 1 }] });
        }
        else {
            const existingItem = cart.items.find((item) => item.product.toString() === productId);
            if (existingItem) {
                existingItem.quantity++;
            }
            else {
                cart.items.push({ product: productId, quantity: 1 });
            }
        }
        yield cart.save();
        res.json(cart);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.addToCart = addToCart;
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const { productId } = req.params;
        const userId = (_d = req.currentUser) === null || _d === void 0 ? void 0 : _d._id;
        if (!userId) {
            return res
                .status(401)
                .json({ message: "Unauthorized: User ID not found" });
        }
        const castedUserId = mongoose_1.default.Types.ObjectId(userId.toString());
        let cart = yield cart_model_1.default.findOne({ userId: castedUserId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart" });
        }
        cart.items.splice(itemIndex, 1);
        yield cart.save();
        res.json(cart);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.removeFromCart = removeFromCart;
const updateCartItemQuantity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const { productId } = req.params;
        const { action } = req.body;
        const userId = (_e = req.currentUser) === null || _e === void 0 ? void 0 : _e._id;
        if (!userId) {
            return res
                .status(401)
                .json({ message: "Unauthorized: User ID not found" });
        }
        const castedUserId = mongoose_1.default.Types.ObjectId(userId.toString());
        let cart = yield cart_model_1.default.findOne({ userId: castedUserId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        const item = cart.items.find((item) => item.product.toString() === productId);
        if (!item) {
            return res.status(404).json({ message: "Product not found in cart" });
        }
        if (action === "increase") {
            item.quantity++;
        }
        else if (action === "decrease") {
            if (item.quantity > 1) {
                item.quantity--;
            }
            else {
                cart.items = cart.items.filter((cartItem) => cartItem.product.toString() !== productId);
            }
        }
        else {
            return res.status(400).json({ message: "Invalid action" });
        }
        yield cart.save();
        res.json(cart);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateCartItemQuantity = updateCartItemQuantity;
