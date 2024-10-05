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
    const fileKey = `files/${userId}/${Date.now()}-${file.originalname}`;

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

export default { createFolder, createFile };
