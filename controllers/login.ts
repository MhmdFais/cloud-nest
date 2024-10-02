import passport from "passport";
import LocalStrategy from "passport-local";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();

passport.use(
  new LocalStrategy.Strategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done: Function) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return done(null, false, { message: "Wrong credentials!" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
          return done(null, false, { message: "Wrong credentials!" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, firstName: true, lastName: true },
    });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

const logOut = (req: Request, res: Response) => {
  req.logout(() => {
    res.json({ message: "Logged out successfully" });
  });
};

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

const getLogin = (req: Request, res: Response) => {
  res.render("login");
};

const postLogin = (req: Request, res: Response) => {
  passport.authenticate(
    "local",
    (err: any, user: Express.User, info: { message: any }) => {
      if (err) {
        return res.redirect("/login");
      }

      if (!user) {
        return res.redirect("/login");
      }

      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "An error occurred." });
        }

        return res.redirect("/");
      });
    }
  )(req, res);
};

export default { getLogin, postLogin, logOut, isAuthenticated };
