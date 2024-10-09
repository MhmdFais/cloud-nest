import { PrismaClient } from "@prisma/client";
import { supabase } from "./supabaseClient";
import fs from "fs";

const prisma = new PrismaClient();

const createFolder = async (name: string, userId: number) => {
  try {
    const folder = await prisma.folder.create({
      data: {
        name: name || "New Folder",
        ownerId: userId,
      },
    });
    return { success: true, data: folder };
  } catch (error) {
    console.error("Database error creating folder:", error);
    return { success: false, error: "Failed to create folder in database" };
  }
};

const createFile = async (file: Express.Multer.File, userId: number) => {
  try {
    const fileBuffer = fs.readFileSync(file.path);
    //const fileKey = `files/${userId}/${file.originalname}`;
    const fileKey = `${userId}/${file.originalname}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("files")
      .upload(fileKey, fileBuffer, {
        contentType: file.mimetype,
        upsert: true, // overwrite if exits
      });

    if (uploadError) {
      throw new Error(`Failed to upload to Supabase: ${uploadError.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("files").getPublicUrl(fileKey);

    fs.unlinkSync(file.path); // clean temporary file

    const newFile = await prisma.file.create({
      data: {
        name: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        url: publicUrl,
        ownerId: userId,
      },
    });

    return { success: true, data: newFile };
  } catch (error) {
    console.error("Error creating file:", error);
    try {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path); // Clean up even on failure
      }
    } catch (error) {
      console.error("Error cleaning up temp file:", error);
    }
    return { success: false, error: "Failed to create file" };
  }
};

const getSavedFolders = async (userId: number) => {
  try {
    const folders = await prisma.folder.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: folders };
  } catch (error) {
    console.error("Database error fetching folders:", error);
    return { success: false, error: "Failed to fetch folders" };
  }
};

const getSavedFiles = async (userId: number) => {
  try {
    const files = await prisma.file.findMany({
      where: {
        ownerId: userId,
        folderId: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: files };
  } catch (error) {
    console.error("Database error fetching files:", error);
    return { success: false, error: "Failed to fetch folders" };
  }
};

const deleteFile = async (userId: number, fileId: number, name: string) => {
  try {
    const file = await prisma.file.findUnique({
      where: {
        id: fileId,
      },
    });

    if (!file) {
      throw new Error("File not found");
    }

    const { error: deleteError } = await supabase.storage
      .from("files")
      .remove([`${userId}/${name}`]);

    if (deleteError) {
      throw new Error(
        `Failed to remove file from Supabase: ${deleteError.message}`
      );
    }

    // Delete from database
    await prisma.file.delete({
      where: {
        id: fileId,
        ownerId: userId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting file:", error);
    return { success: false, error: "Failed to delete file" };
  }
};

const deleteFolder = async (userId: number, folderId: number) => {
  try {
    await prisma.folder.delete({
      where: {
        id: folderId,
        ownerId: userId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting folder:", error);
    return { success: false, error: "Failed to delete folder" };
  }
};

const uploadToAFolder = async (
  file: Express.Multer.File,
  userId: number,
  folderId: number
) => {
  try {
    const fileBuffer = fs.readFileSync(file.path);
    const fileKey = `${userId}/${folderId}/${file.originalname}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("files")
      .upload(fileKey, fileBuffer, {
        contentType: file.mimetype,
        upsert: true, // overwrite if exits
      });

    if (uploadError) {
      throw new Error(`Failed to upload to Supabase: ${uploadError.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("files").getPublicUrl(fileKey);

    fs.unlinkSync(file.path); // clean temporary file

    const newFile = await prisma.file.create({
      data: {
        name: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        url: publicUrl,
        folderId: folderId,
        ownerId: userId,
      },
    });

    return { success: true, data: newFile };
  } catch (error) {
    console.error("Error creating file:", error);
    try {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path); // Clean up even on failure
      }
    } catch (error) {
      console.error("Error cleaning up temp file:", error);
    }
    return { success: false, error: "Failed to create file" };
  }
};

const getFilesInAFolder = async (userId: number, folderId: number) => {
  try {
    const files = prisma.file.findMany({
      where: {
        ownerId: userId,
        folderId: folderId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: files };
  } catch (error) {
    console.error("Database error fetching files:", error);
    return { success: false, error: "Failed to fetch folders" };
  }
};

const deleteAFileInTheFolder = async (
  userId: number,
  folderId: number,
  fileId: number,
  name: string
) => {
  try {
    const file = await prisma.file.findUnique({
      where: {
        id: fileId,
      },
    });

    if (!file) {
      throw new Error("File not found");
    }

    const { error: deleteError } = await supabase.storage
      .from("files")
      .remove([`${userId}/${folderId}/${name}`]);

    if (deleteError) {
      throw new Error(
        `Failed to remove file from Supabase: ${deleteError.message}`
      );
    }

    await prisma.file.delete({
      where: {
        id: fileId,
        ownerId: userId,
        folderId: folderId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting file:", error);
    return { success: false, error: "Failed to delete file" };
  }
};

const serveFile = async (userId: number, fileId: number) => {
  try {
    const file = await prisma.file.findUnique({
      where: {
        id: fileId,
        ownerId: userId,
      },
    });

    if (!file) {
      return { success: false, error: "File not found" };
    }

    // Extract the file key from the URL
    const urlParts = file.url.split("/");
    const fileKey = urlParts.slice(-2).join("/");

    // Get a temporary URL that expires in 1 hour
    const { data, error } = await supabase.storage
      .from("files")
      .createSignedUrl(fileKey, 3600); // 3600 seconds = 1 hour

    if (error || !data) {
      throw new Error(`Failed to generate signed URL: ${error?.message}`);
    }

    const { signedUrl } = data;

    if (error) {
      throw new Error(
        `Failed to generate signed URL: ${(error as Error).message}`
      );
    }

    return {
      success: true,
      data: {
        signedUrl,
        fileName: file.name,
        mimeType: file.mimeType,
      },
    };
  } catch (error) {
    console.error("Error serving file:", error);
    return { success: false, error: "Failed to serve file" };
  }
};

export default {
  createFolder,
  createFile,
  getSavedFolders,
  getSavedFiles,
  deleteFile,
  deleteFolder,
  uploadToAFolder,
  getFilesInAFolder,
  deleteAFileInTheFolder,
  serveFile,
};
