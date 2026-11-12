import { PrismaClient } from "@prisma/client";
import { CreateUserInput } from "../types/user.types";

const prisma = new PrismaClient();

export const createUser = async (user: CreateUserInput) => {
  const { username, password, role } = user;

  return await prisma.user.create({
    data: {
      username,
      password,
      role,
    },
  });
};
