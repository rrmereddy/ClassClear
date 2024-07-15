import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import GoogleStrategy from "passport-google-oauth2";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const port = 5001;
const saltRounds = process.env.SALT_ROUNDS;

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());

app.post("/login", (req, res) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "An error occurred during login" });
    }
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to log in" });
      }
      return res.status(200).json({ message: "Login successful" });
    });
  })(req, res);
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password: ", err);
          return res.status(500).json({ message: "Error creating user" });
        }
        try {
          const user = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [email, hash]
          );
          req.login(user.rows[0], (err) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: "Error logging in" });
            } else {
              return res.status(200).json({ message: "Signup successful" });
            }
          });
        } catch (err) {
          console.error(err);
          return res.status(500).json({ message: "Error creating user" });
        }
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

passport.use(
  "local",
  new Strategy({ usernameField: "email" }, async (username, password, cb) => {
    try {
      let db_user = await db.query("SELECT * from users WHERE email=$1", [
        username,
      ]);
      db_user = db_user.rows;

      if (db_user.length > 0) {
        const hashed_pswd = db_user[0].password;
        bcrypt.compare(password, hashed_pswd, (err, valid) => {
          if (err) {
            console.error("Error comparing passwords:", err);
            return cb(err);
          } else {
            if (valid) {
              return cb(null, db_user[0]);
            } else {
              return cb(null, false);
            }
          }
        });
      } else {
        return cb("User not found");
      }
    } catch (err) {
      cb(err);
    }
  })
);

passport.serializeUser((user, cb) => {
  return cb(null, user);
});

passport.deserializeUser((user, cb) => {
  return cb(null, user);
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
