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
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const product_route_1 = __importDefault(require("./routes/product.route"));
const cart_route_1 = __importDefault(require("./routes/cart.route"));
const checkout_route_1 = __importDefault(require("./routes/checkout.route"));
const cors = require("cors");
// dotenv.config();
const { connection } = require("./config/db");
const app = (0, express_1.default)();
app.use(cors());
const PORT = process.env.PORT || 8080;
app.use(express_1.default.json());
app.use("/api/auth", auth_route_1.default);
app.use("/api/products", product_route_1.default);
app.use("/api/cart", cart_route_1.default);
app.use("/api/checkout", checkout_route_1.default);
app.listen(process.env.port, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connection;
        console.log(`server is running on port ${PORT}`);
    }
    catch (err) {
        console.log("err", err);
    }
}));
