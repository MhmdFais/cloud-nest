import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const getRegister = (req: Request, res: Response) => {
  res.render("register");
};

const isEmailAlreadyExist = async (userEmail: string) => {
  await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });
  return true;
};

const createUser = async (req: Request, res: Response) => {
  if (await isEmailAlreadyExist(req.body.email)) {
    return res.json({ message: "Email already exist" });
  }

  const encyptPass = await bcrypt.hash(req.body.password, 10);

  try {
    await prisma.user.create({
      data: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: encyptPass,
      },
    });

    return res.json({ message: "User created successfullt!" });
  } catch (error) {
    return res.json({ message: "Error while registering user!" });
  }
};

export default { getRegister, createUser };
