import { Request, Response } from "express";

import { signIn as signInService, verifyToken } from "../services/auth.service";

// LOGIN
export const signIn = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const result = await signInService(username, password);

    return res.json(result);
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "Username doesn't exist" ||
        error.message === "Invalid password")
    ) {
      return res.status(401).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error: "Login failed",
    });
  }
};

// GET CURRENT USER
export const getMe = (req: Request, res: Response) => {
  return res.status(200).json({
    user: (req as any).user,
  });
};

// LOGOUT
export const logout = (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Logout successful (client should remove the token)",
  });
};

// AUTHENTICATE TOKEN
export const authenticateToken = (
  req: Request,
  res: Response,
  next: Function
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "Unauthorized, token missing",
    });
  }

  try {
    const user = verifyToken(token);

    // Attach decoded user data to request
    (req as any).user = user;

    next();
  } catch (error) {
    return res.status(403).json({
      error: "Invalid token",
    });
  }
};
