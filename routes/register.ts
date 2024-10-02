import express from "express";
import registerController from "../controllers/register";

const registerRouter = express.Router();

registerRouter.get("/", registerController.getRegister);

export default registerRouter;
