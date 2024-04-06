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
exports.login = exports.signup = void 0;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user_model_1 = __importDefault(require("../models/user.model"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, userEmail, password } = req.body;
        const existingUser = yield user_model_1.default.findOne({ userEmail });
        if (existingUser) {
            return res.status(400).json({ message: "User email already taken" });
        }
        const hashedPassword = yield bcrypt.hash(password, 10);
        const user = new user_model_1.default({ username, userEmail, password: hashedPassword });
        yield user.save();
        res.status(201).json({ message: "User created successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userEmail, password } = req.body;
        const user = yield user_model_1.default.findOne({ userEmail });
        if (!user) {
            return res
                .status(401)
                .json({ message: "Invalid user email or password" });
        }
        const passwordMatch = yield bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res
                .status(401)
                .json({ message: "Invalid user email or password" });
        }
        const token = jwt.sign({ userId: user._id, userEmail: user.userEmail }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ username: user.username, token });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.login = login;
