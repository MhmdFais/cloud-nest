import express from "express";
import registerController from "../controllers/register";

const registerRouter = express.Router();

registerRouter.get("/", registerController.getRegister);
registerRouter.post("/", registerController.createUser);

export default registerRouter;
