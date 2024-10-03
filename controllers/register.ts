import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const getRegister = (req: Request, res: Response) => {
  res.render("register");
};

const isEmailAlreadyExist = async (userEmail: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });
  return !!user;
};

const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: req.body.email },
    });

    if (existingUser) {
      return res.render("register", {
        error: "User with this email already exists!",
        formData: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
        },
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
      },
    });

    res.redirect("/login");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error while registering user!" });
  }
};

export default { getRegister, createUser };
