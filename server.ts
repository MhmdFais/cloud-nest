// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();
// use `prisma` in your application to read and write data in your DB

require("dotenv").config();
import express from "express";
import session from "express-session";
import path from "path";
import passport from "passport";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";

import loginRoute from "./routes/login";
import registerRoute from "./routes/register";
import homeRoute from "./routes/home";

const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    store: new PrismaSessionStore(prisma as any, {
      checkPeriod: 2 * 60 * 1000, // Clean up expired sessions every 2 minutes
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/", homeRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
