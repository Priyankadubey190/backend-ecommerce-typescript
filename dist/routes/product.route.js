"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
router.get("/", controllers_1.getAllProducts);
router.post("/create", middlewares_1.authenticateUser, controllers_1.createProduct);
router.get("/filter", controllers_1.getFilterProducts);
exports.default = router;
