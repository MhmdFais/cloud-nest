import express from "express";
import homeController from "../controllers/home";
import loginController from "../controllers/login";
import multer from "multer";

const homeRouter = express.Router();
const upload = multer({ dest: "uploads/" });

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
  upload.single("file"),
  homeController.addFile
);

export default homeRouter;
