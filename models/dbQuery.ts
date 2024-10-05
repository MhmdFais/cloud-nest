import { PrismaClient } from "@prisma/client";
import { supabase } from "./supabaseClient";
import fs from "fs";

const prisma = new PrismaClient();

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_MIME_TYPES = [
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

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("files")
      .upload(`files/${userId}/${file.originalname}`, fileBuffer, {
        contentType: file.mimetype,
        upsert: true, // This will overwrite if file exists
      });

    if (uploadError) {
      throw new Error(`Failed to upload to Supabase: ${uploadError.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("files")
      .getPublicUrl(`files/${userId}/${file.originalname}`);

    fs.unlinkSync(file.path);

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
        fs.unlinkSync(file.path);
      }
    } catch (cleanupError) {
      console.error("Error cleaning up temporary file:", cleanupError);
    }
    return { success: false, error: "Failed to create file" };
  }
};

export default { createFolder, createFile };
