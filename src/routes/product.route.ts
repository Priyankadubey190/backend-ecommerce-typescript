import express from "express";

import { authenticateUser } from "../middlewares";
import {
  createProduct,
  getAllProducts,
  getFilterProducts,
} from "../controllers";

const router = express.Router();

router.get("/", getAllProducts);

router.post("/create", authenticateUser, createProduct);

router.get("/filter", getFilterProducts);

export default router;
