import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("SESSION_SECRET is not configured");
}

// LOGIN
export const signIn = async (username: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    throw new Error("Username doesn't exist");
  }

  if (user.password !== password) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    JWT_SECRET!,
    {
      expiresIn: "8h",
    }
  );

  return {
    message: "Login successful",
    token,
  };
};

// VERIFY TOKEN
export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET!);
};
