import express from "express";
import homeController from "../controllers/home";
import loginController from "../controllers/login";

const homeRouter = express.Router();

homeRouter.get("/", homeController.authenticate, homeController.home);
homeRouter.get("/logout", loginController.logOut);

export default homeRouter;
