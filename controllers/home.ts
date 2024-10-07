import { Request, Response } from "express";
import loginController from "../controllers/login";
import db from "../models/dbQuery";

const authenticate = loginController.isAuthenticated;

const home = async (req: Request, res: Response) => {
  const userId = (req.user as any).id;

  const folders = await db.getSavedFolders(userId);
  const files = await db.getSavedFiles(userId);

  if (!folders.success && !files.success) {
    return res.render("home", {
      user: req.user,
      error: "Failed to fetch your files and folders",
      folders: [],
      files: [],
    });
  }

  res.render("home", {
    user: req.user,
    folders: folders.data,
    files: files.data,
  });
};

const addFolder = async (req: Request, res: Response) => {
  const name = req.body.name;
  const userId = (req.user as any).id;

  const result = await db.createFolder(name, userId);

  if (!result.success) {
    return res.redirect(
      "/?error=" + encodeURIComponent("Failed to create folder")
    );
  }

  res.redirect("/");
};

const addFile = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.redirect("/?error=" + encodeURIComponent("No file uploaded"));
  }

  const userId = (req.user as any).id;
  const name = req.body.name;

  const result = await db.createFile(req.file, userId);
  console.log("Upload result:", result);

  if (!result.success) {
    return res.redirect(
      "/?error=" + encodeURIComponent("Failed to upload file")
    );
  }

  res.redirect("/");
};

export default { authenticate, home, addFolder, addFile };
