import { Request, Response } from "express";
import * as userService from "../services/users.service";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getUsersAll();

    return res.status(200).json(users);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch users, Error, ", error });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newUser = await userService.createUser({
      username,
      password,
      role,
    });

    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create user",
      error,
    });
  }
};
