import express from "express";
import loginController from "../controllers/login";

const loginRouter = express.Router();

loginRouter.get("/", loginController.getLogin);
loginRouter.post("/", loginController.postLogin);

module.exports = loginRouter;
