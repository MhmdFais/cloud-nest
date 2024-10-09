import { Request, Response } from "express";
import loginController from "../controllers/login";
import db from "../models/dbQuery";

const authenticate = loginController.isAuthenticated;

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}

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

  const foldersWithFormattedDates = folders.data
    ? folders.data.map((folder) => ({
        ...folder,
        createdAtAgo: formatTimeAgo(new Date(folder.createdAt)),
        updatedAtAgo: formatTimeAgo(new Date(folder.updatedAt)),
      }))
    : [];

  const filesWithFormattedDates = files.data
    ? files.data.map((file) => ({
        ...file,
        createdAtAgo: formatTimeAgo(new Date(file.createdAt)),
        updatedAtAgo: formatTimeAgo(new Date(file.updatedAt)),
      }))
    : [];

  res.render("home", {
    user: req.user,
    folders: foldersWithFormattedDates,
    files: filesWithFormattedDates,
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

const deleteFile = async (req: Request, res: Response) => {
  const userId = (req.user as any).id;
  const fileId = parseInt(req.params.id);
  const name = req.params.name;

  const delFile = await db.deleteFile(userId, fileId, name);

  if (!delFile.success) {
    return res.redirect(
      "/?error=" + encodeURIComponent("Failed to create folder")
    );
  }

  res.redirect("/");
};

const deleteFolder = async (req: Request, res: Response) => {
  const userId = (req.user as any).id;
  const folderId = parseInt(req.params.id);

  const delFolder = await db.deleteFolder(userId, folderId);

  if (!delFolder.success) {
    return res.redirect(
      "/?error=" + encodeURIComponent("Failed to create folder")
    );
  }

  res.redirect("/");
};

const folderView = async (req: Request, res: Response) => {
  const userId = (req.user as any).id;
  const folderId = parseInt(req.params.folderId);

  const files = await db.getFilesInAFolder(userId, folderId);

  if (!files.success) {
    return res.render("home", {
      user: req.user,
      error: "Failed to fetch your files and folders",
      folders: [],
      files: [],
    });
  }

  const filesWithFormattedDates = files.data
    ? (await files.data).map((file) => ({
        ...file,
        createdAtAgo: formatTimeAgo(new Date(file.createdAt)),
        updatedAtAgo: formatTimeAgo(new Date(file.updatedAt)),
      }))
    : [];

  res.render("folder", {
    user: req.user,
    folderId: folderId,
    files: filesWithFormattedDates,
  });
};

const uploadFileToAFolder = async (req: Request, res: Response) => {
  const userId = (req.user as any).id;
  const folderId = parseInt(req.params.id);

  if (!req.file) {
    return res.redirect(
      `/${folderId}?error=` + encodeURIComponent("No file uploaded")
    );
  }

  const addFile = await db.uploadToAFolder(req.file, userId, folderId);

  if (!addFile.success) {
    return res.redirect(
      `/${folderId}?error=` + encodeURIComponent("Failed to upload file")
    );
  }

  res.redirect(`/${folderId}`);
};

const deleteAFileInTheFolder = async (req: Request, res: Response) => {
  const userId = (req.user as any).id;
  const fileId = parseInt(req.params.fileId);
  const folderId = parseInt(req.params.folderId);
  const name = req.params.name;

  const delFile = await db.deleteAFileInTheFolder(
    userId,
    folderId,
    fileId,
    name
  );

  if (!delFile.success) {
    return res.redirect(
      `/${folderId}?error=` + encodeURIComponent("Failed to create folder")
    );
  }

  res.redirect(`/${folderId}`);
};

const serveFiles = async (req: Request, res: Response) => {
  const fileId = parseInt(req.params.fileId);
  const userId = (req.user as any).id;

  const result = await db.serveFile(userId, fileId);

  if (!result.success || !result.data) {
    return res.redirect(
      `/?error=` + encodeURIComponent("Failed to create folder")
    );
  }

  const url = result.data.signedUrl;

  res.redirect(url);
};

export default {
  authenticate,
  home,
  addFolder,
  addFile,
  deleteFile,
  deleteFolder,
  folderView,
  uploadFileToAFolder,
  deleteAFileInTheFolder,
  serveFiles,
};
