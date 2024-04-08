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
exports.checkout = void 0;
const cart_model_1 = __importDefault(require("../models/cart.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const checkout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.currentUser) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            return res
                .status(401)
                .json({ message: "Unauthorized: User ID not found" });
        }
        const castedUserId = mongoose_1.default.Types.ObjectId(userId.toString());
        const cart = yield cart_model_1.default.findOne({ userId: castedUserId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        cart.items = [];
        yield cart.save();
        res.json({ message: "Checkout successful" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.checkout = checkout;
