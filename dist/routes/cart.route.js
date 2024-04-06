"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
router.get("/", middlewares_1.authenticateUser, middlewares_1.authorizeUser, controllers_1.getCart);
router.get("/productdetails/:id", middlewares_1.authenticateUser, middlewares_1.authorizeUser, controllers_1.getCartProductById);
router.post("/:productId", middlewares_1.authenticateUser, middlewares_1.authorizeUser, controllers_1.addToCart);
router.delete("/:productId", middlewares_1.authenticateUser, middlewares_1.authorizeUser, controllers_1.removeFromCart);
router.patch("/:productId", middlewares_1.authenticateUser, middlewares_1.authorizeUser, controllers_1.updateCartItemQuantity);
exports.default = router;
