import express from "express";
import homeController from "../controllers/home";
import loginController from "../controllers/login";

const homeRouter = express.Router();

homeRouter.get("/", homeController.authenticate, homeController.home);
homeRouter.get("/logout", loginController.logOut);
homeRouter.post(
  "/add-folder",
  homeController.authenticate,
  homeController.addFolder
);
homeRouter.post(
  "/upload-file",
  homeController.authenticate,
  homeController.addFile
);

export default homeRouter;
