import express from "express";
import homeController from "../controllers/home";
import loginController from "../controllers/login";
import multer from "multer";

const homeRouter = express.Router();
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

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
