import express from "express";
import { authenticateUser, authorizeUser } from "../middlewares";
import { checkout } from "../controllers";

const router = express.Router();

router.post("/", authenticateUser, authorizeUser, checkout);

export default router;
