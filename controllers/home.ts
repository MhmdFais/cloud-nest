import { Request, Response } from "express";
import loginController from "../controllers/login";
import db from "../models/dbQuery";

const authenticate = loginController.isAuthenticated;

const home = (req: Request, res: Response) => {
  res.render("home", { user: req.user });
};

const addFolder = async (req: Request, res: Response) => {
  const { name } = req.body;
  const userId = (req.user as any).id;

  const result = await db.createFolder(name, userId);

  if (!result.success) {
    res.status(500).json({ error: result.error });
    return;
  }

  res.json(result.data);
};

export default { authenticate, home, addFolder };
