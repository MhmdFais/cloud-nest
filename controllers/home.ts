import { Request, Response } from "express";
import loginController from "../controllers/login";
import db from "../models/dbQuery";

const authenticate = loginController.isAuthenticated;

const home = (req: Request, res: Response) => {
  res.render("home", { user: req.user });
};

const addFolder = async (req: Request, res: Response) => {
  const name = req.body.name;
  const userId = (req.user as any).id;

  const result = await db.createFolder(name, userId);

  if (!result.success) {
    // Redirect back with error
    return res.redirect(
      "/?error=" + encodeURIComponent("Failed to create folder")
    );
  }

  // Redirect back to home page
  res.redirect("/");
};

export default { authenticate, home, addFolder };
