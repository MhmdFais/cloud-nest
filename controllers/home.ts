import { Request, Response } from "express";
import loginController from "../controllers/login";

const authenticate = loginController.isAuthenticated;

const home = (req: Request, res: Response) => {
  res.render("home", { user: req.user });
};

export default { authenticate, home };
