import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");

import User, { UserModel } from "../models/user.model";

import { config } from "dotenv";
config();
const { JWT_SECRET } = process.env;

interface UserType {
  userId: string;
  username: string;
}

export interface AuthType extends Request {
  user?: UserType;
  currentUser?: UserModel;
}

export const authenticateUser = (
  req: AuthType,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET) as UserType;

    req.user = decodedToken;
    next();
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "internal error", error: error.message });
  }
};

export const authorizeUser = async (
  req: AuthType,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }

    const user: UserModel | null = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.currentUser = user;

    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
