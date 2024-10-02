import { Request, Response } from "express";

const getRegister = (req: Request, res: Response) => {
  res.render("register");
};

export default { getRegister };
