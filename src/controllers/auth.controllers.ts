import { Request, Response } from "express";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

import User, { UserModel } from "../models/user.model";

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, userEmail, password } = req.body;

    const existingUser = await User.findOne({ userEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User email already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, userEmail, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { userEmail, password } = req.body;

    const user: UserModel | null = await User.findOne({ userEmail });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid user email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Invalid user email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, userEmail: user.userEmail },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ username: user.username, token });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
