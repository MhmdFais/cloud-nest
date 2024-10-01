// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();
// use `prisma` in your application to read and write data in your DB

require("dotenv").config();
import express from "express";
import session from "express-session";
import path from "path";

const loginRoute = require("./routes/login");
const registerRoute = require("./routes/register");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.urlencoded({ extended: false }));

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// app.use("/", loginRoute);
// app.use("/register", registerRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
