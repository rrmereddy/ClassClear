import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import GoogleStrategy from "passport-google-oauth2";
import { jwtDecode } from "jwt-decode";
import DiscordStrategy from "passport-discord";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import axios from "axios";

dotenv.config();
const app = express();
const port = 5001;
const saltRounds = 12;

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
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());

const generateAccessToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "5m",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.REFRESH_TOKEN_SECRET);
};

app.post("/api/refresh", async (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) {
    return res.status(401).json({ message: "You are not authenticated" });
  }

  try {
    const data = await db.query(
      "SELECT * FROM users WHERE refresh_token = $1",
      [refreshToken]
    );

    if (data.rows.length === 0) {
      return res.status(403).json("Refresh token is not valid!");
    }

    const user = data.rows[0];

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, user) => {
        if (err) {
          console.log(err);
          return res.status(403).json("Refresh token is not valid!");
        }

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        await db.query("UPDATE users SET refresh_token = $1 WHERE email = $2", [
          newRefreshToken,
          user.email,
        ]);

        res.status(200).json({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });
      }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

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
    req.logIn(user, async (err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to log in" });
      }
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      await db.query("UPDATE users SET refresh_token = $1 WHERE email = $2", [
        refreshToken,
        user.email,
      ]);
      return res
        .status(200)
        .json({ accessToken: accessToken, message: "Login successful" });
    });
  })(req, res);
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

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
          const refreshToken = generateRefreshToken({ email });
          const accessToken = generateAccessToken({ email });
          const user = await db.query(
            "INSERT INTO users (email, password, refresh_token) VALUES ($1, $2, $3) RETURNING *",
            [email, hash, refreshToken]
          );
          req.login(user.rows[0], (err) => {
            if (err) {
              console.error(err);
              return res
                .status(500)
                .json({ accessToken, message: "Error logging in" });
            } else {
              return res
                .status(200)
                .json({ accessToken, message: "Signup successful" });
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

const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Token is invalid! You are not authenticated!" });
      }

      req.user = user;
      next();
    });
  }
};

app.post("/logout", verify, async (req, res) => {
  await db.query("UPDATE users SET refreshToken = $1 WHERE email = $2", [
    null,
    req.user.email,
  ]);
});

app.post("/getcourses", verify, async (req, res) => {
  const { accessToken } = req.body;
  const decodedPayload = jwtDecode(accessToken);
  const email = decodedPayload.email;
  try {
    let user_id = await db.query("SELECT * FROM users WHERE email=$1", [email]);
    user_id = user_id.rows[0].id;
    let course_info = await db.query(
      "SELECT name,university_name,course_description,course_instructor FROM syllabus_metadata WHERE user_id=$1",
      [user_id]
    );

    course_info = course_info.rows;
    res.status(200).send({ courses: course_info });
  } catch (err) {
    console.error(err);
    res.status(400).send({ error: err });
  }
});

app.get("/universitynames", async (req, res) => {
  const { search } = req.body;
  try {
    const response = await axios.get(
      `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/us-colleges-and-universities/records`,
      {
        params: {
          select: "name",
          where: `startswith(name, "${search}")`,
          limit: 10,
        },
      }
    );

    const universityNames = response.data.results.map((result) => result);
    res.status(200).json({ universityNames });
  } catch (err) {
    res.status(400).json({ error: err });
    console.error(err);
  }
});

app.get("/auth/discord", passport.authenticate("discord"));

app.get("/auth/discord/redirect", (req, res, next) => {
  passport.authenticate("discord", (err, user, info) => {
    if (err || !user) {
      res.send(`
        <script>
          window.opener.postMessage({ type: 'AUTH_FAILURE' }, 'http://localhost:5173');
          window.close();
        </script>
      `);
    } else {
      req.logIn(user, (err) => {
        if (err) {
          res.send(`
            <script>
              window.opener.postMessage({ type: 'AUTH_FAILURE' }, 'http://localhost:5173');
              window.close();
            </script>
          `);
        } else {
          res.send(`
            <script>
              window.opener.postMessage({ type: 'AUTH_SUCCESS', user: ${JSON.stringify(
                user
              )} }, 'http://localhost:5173');
              window.close();
            </script>
          `);
        }
      });
    }
  })(req, res, next);
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email"],
  })
);

app.get("/auth/google/redirect", (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err || !user) {
      res.send(`
        <script>
          window.opener.postMessage({ type: 'AUTH_FAILURE' }, 'http://localhost:5173');
          window.close();
        </script>
      `);
    } else {
      req.logIn(user, (err) => {
        if (err) {
          res.send(`
            <script>
              window.opener.postMessage({ type: 'AUTH_FAILURE' }, 'http://localhost:5173');
              window.close();
            </script>
          `);
        } else {
          res.send(`
            <script>
              window.opener.postMessage({ type: 'AUTH_SUCCESS', user: ${JSON.stringify(
                user
              )} }, 'http://localhost:5173');
              window.close();
            </script>
          `);
        }
      });
    }
  })(req, res, next);
});

app.post("/courses", verify, async (req, res) => {
  const { courseName, universityName, courseInstructor, courseDescription } =
    req.body;
  try {
    const user_id = await db.query("SELECT * FROM users where email=$1", [
      req.user.email,
    ]);

    await db.query(
      "INSERT INTO syllabus_metadata (name, university_name, user_id, course_instructor, course_description) VALUES ($1, $2, $3, $4, $5)",
      [
        courseName,
        universityName,
        user_id.rows[0].id,
        courseInstructor,
        courseDescription,
      ]
    );

    res.status(200).send({ message: "Successfully added course!" });
  } catch (err) {
    res.status(400).send({ error: "Error ocurred" });
    console.error(err);
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

passport.use(
  "discord",
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_SECRET,
      callbackURL: "http://localhost:5001/auth/discord/redirect",
      scope: ["identify", "email"],
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        const db_profile = await db.query(
          "SELECT * FROM users WHERE email=$1",
          [profile.email]
        );

        if (db_profile.rows.length == 0) {
          const accessToken = generateAccessToken({ email: profile.email });
          const refreshToken = generateRefreshToken({ email: profile.email });

          try {
            let user = await db.query(
              "INSERT INTO users (email, password, refresh_token) VALUES ($1, $2, $3) RETURNING *",
              [profile.email, process.env.DISCORD_FILLER_PASSWORD, refreshToken]
            );
            user = user.rows[0];
            user = { ...user, accessToken, refreshToken };

            return cb(null, user);
          } catch (err) {
            return cb(null, err);
          }
        } else {
          let user = db_profile.rows[0];
          const accessToken = generateAccessToken(user);
          const refreshToken = generateRefreshToken(user);
          user = { ...user, accessToken, refreshToken };

          await db.query(
            "UPDATE users SET refresh_token = $1 WHERE email = $2",
            [refreshToken, user.email]
          );
          cb(null, user);
        }
      } catch (err) {
        return cb(null, err);
      }
    }
  )
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "http://localhost:5001/auth/google/redirect",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
      scope: ["email"],
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const result = await db.query("SELECT * FROM users where email=$1", [
          profile.email,
        ]);
        if (result.rows.length == 0) {
          const accessToken = generateAccessToken({ email: profile.email });
          const refreshToken = generateRefreshToken({ email: profile.email });

          const newUser = await db.query(
            "INSERT INTO users (email, password, refresh_token) VALUES ($1, $2, $3) RETURNING *",
            [profile.email, process.env.GOOGLE_FILLER_PASSWORD, refreshToken]
          );

          newUser = newUser.rows[0];
          newUser = { ...newUser, accessToken, refreshToken };

          return cb(null, newUser);
        } else {
          let user = result.rows[0];
          const accessToken = generateAccessToken(user);
          const refreshToken = generateRefreshToken(user);
          user = { ...user, accessToken, refreshToken };

          await db.query(
            "UPDATE users SET refresh_token = $1 WHERE email = $2",
            [refreshToken, user.email]
          );
          return cb(null, user);
        }
      } catch (err) {
        cb(null, err);
      }
    }
  )
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
