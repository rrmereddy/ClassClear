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
import OpenAI from "openai";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import { log } from "console";


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

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const getGPTResponse = async (syllabusFile, syllabusText) => {
    // Prepare data to send to GPT endpoint
    let contentToProcess = "";
    if (syllabusText) {
      contentToProcess = syllabusText;
    } else if (syllabusFile) {
      const formData = new FormData();
      formData.append("file", fs.createReadStream(syllabusFile));
      contentToProcess = formData;
    }
  
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            "role": "system",
            "content": [
              {
                "type": "text",
                "text": "Extract important information from a syllabus, focusing on deadlines, grading policy, attendance, and any other relevant details.\n\n# Steps\n\n1. **Identify Main Categories:** Look for the sections in the syllabus that address different aspects, such as Homework, Exams, and Projects.\n2. **Extract Deadlines:** Within each category, identify any stated deadlines and ensure they are recorded accurately.\n3. **Grading Policy:** Locate the section that outlines how the course will be graded, and summarize the key points, including weightings for different components.\n4. **Attendance Policy:** Note any rules or guidelines regarding attendance, such as required presence, penalties for absences, or participation expectations.\n5. **Additional Important Information:** Look for any other details that might be important, such as office hours, course materials, or special instructions, and include them.\n\n# Output Format\n\nProvide the extracted information in a structured format similar to the following JSON example:\n```json\n{\n  \"Course Name\": String, #This is Required and shorten the name as much as possible, get the course and the number\n  \"Instructor Name: String, \n  \"Categories\": {\n    \"Homework\": {\n      \"Due Dates\": [\"YYYY-MM-DD\", ...]\n    },\n    \"Exams\": {\n      \"Due Dates\": [\"YYYY-MM-DD\", ...]\n    },\n    \"Projects\": {\n      \"Due Dates\": [\"YYYY-MM-DD\", ...]\n    }\n  },\n  \"Grading Policy\": {\n    \"Description\": \"Summary of grading criteria and weightings.\"\n  },\n  \"Attendance Policy\": {\n    \"Description\": \"Summary of attendance requirements.\"\n  },\n  \"Additional Information\": {\n    \"Office Hours\": \"Details of when and where office hours will be held.\",\n    \"Course Materials\": \"Required or suggested materials.\",\n    \"Other Instructions\": \"Any other relevant information.\"\n  }\n}\n```\n\n# Examples\n\n**Input:** A syllabus document containing multiple sections with details on course structure, deadlines, and policies.\n\n**Output Example:**\n```json\n{\n  \"Course Name\": \"CSCE-221\", \n  \"Instructor Name\": \"Dr/ Leyk, \n  \"Categories\": {\n    \"Homework\": {\n      \"Due Dates\": [\"2024-02-01\", \"2024-03-15\"]\n    },\n    \"Exams\": {\n      \"Due Dates\": [\"2024-05-10\"]\n    },\n    \"Projects\": {\n      \"Due Dates\": [\"2024-04-20\"]\n    }\n  },\n  \"Grading Policy\": {\n    \"Description\": \"Grades consist of 40% homework, 30% exams, and 30% projects.\"\n  },\n  \"Attendance Policy\": {\n    \"Description\": \"Attendance is mandatory with a minimum of 80% attendance required.\"\n  },\n  \"Additional Information\": {\n    \"Office Hours\": \"MWF 1-2 PM at Room 203\",\n    \"Course Materials\": \"Textbook: Intermediate Algebra, 3rd Edition.\",\n    \"Other Instructions\": \"Submit assignments on the course portal.\"\n  }\n}\n```\n\n(Ensure that actual details in the JSON output are obtained from the given syllabus document. Make sure that fpr duedates only the date is being recorded as individual entries and no text is being shown)"
              }
            ]
          },
          {
            "role": "user",
            content: contentToProcess
          }
        ],
        temperature: 1,
        max_tokens: 2048,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        response_format: {
          type: "json_object"
        },
      });
  
      return response.choices[0].message; // Assuming response is in message.content
    } catch (err) {
      console.error("Error processing syllabus: ", err);
      throw new Error("Failed to get GPT response.");
    }
}

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

async function getCourseDatesAndInsertSQL(syllabusData, userId) {
  // Extract the course name
  const courseName = syllabusData["Course Name"];
  
  // Extract relevant dates from the "Exams" category
  const examDates = syllabusData["Categories"]["Exams"]["Due Dates"];
  
  // Loop through each date and insert into the PostgreSQL table
  for (let date of examDates) {
    const dueDate = `${date}`; // Adjust the time and timezone if needed
    const category = 'Exam'; // In this case, it's an exam category

    await db.query(
      "INSERT INTO deadlines (course_name, category, due_date, user_id) VALUES ($1, $2, $3, $4)",
      [courseName, category, dueDate, userId]
    );
  }

  return `Inserted ${examDates.length} records into the database.`;
}

/*const extractedData = {
  role: 'assistant',
  content: '{\n' +
    '  "Course Name": "CSCE-221", \n' +
    '  "Instructor Name": "Dr. Teresa Leyk", \n' +
    '  "Categories": {\n' +
    '    "Homework": {\n' +
    '      "Due Dates": []\n' +
    '    },\n' +
    '    "Exams": {\n' +
    '      "Due Dates": ["2024-09-16", "2024-10-14", "2024-12-05", "2024-12-06", "2024-12-09"]\n' +
    '    },\n' +
    '    "Projects": {\n' +
    '      "Due Dates": []\n' +
    '    }\n' +
    '  },\n' +
    '  "Grading Policy": {\n' +
    '    "Description": "Grades consist of 9% homework assignments, 27% programming assignments, 4% culture assignment, 15% quizzes, and 15% each for three exams."\n' +
    '  },\n' +
    '  "Attendance Policy": {\n' +
    '    "Description": "Lecture attendance is required with participation through pop quizzes. Lab attendance is also required, with bonus points for perfect attendance."\n' +
    '  },\n' +
    '  "Additional Information": {\n' +
    '    "Office Hours": "See course resources on Canvas for details.",\n' +     
    '    "Course Materials": "Required Textbook: \'Data Structures and Algorithm Analysis in C++,\', 4th Edition, Mark A. Weiss.",\n' +
    '    "Other Instructions": "Late homework accepted up to 1 day with a 5% penalty. Make-up exams/quizzes only with documented University-approved excuses."\n' +
    '  }\n' +
    '}',
  refusal: null
};
 
// Insert Dates into SQL
const parsed = JSON.parse(extractedData.content);
console.log(parsed["Categories"]["Exams"]["Due Dates"]);*/


app.post("/courses", verify, async (req, res) => {
  const { course_name, university_name, instructor_name, syllabus_file, syllabus_text } =
    req.body;
  try {
    const user_id = await db.query("SELECT * FROM users where email=$1", [
      req.user.email,
    ]);

    // Get GPT Response
    let extractedData = await getGPTResponse(syllabus_file, syllabus_text);
    extractedData = JSON.parse(extractedData.content);
    getCourseDatesAndInsertSQL(extractedData, user_id.rows[0].id)
      .then(result => console.log(result))
      .catch(error => console.error("Error inserting into database: ", error));


    await db.query(
      "INSERT INTO syllabus_metadata (course_name, university_name, instructor_name, syllabus_file, user_id, syllabus_text) VALUES ($1, $2, $3, $4, $5, $6)",
      [
        course_name,
        university_name,
        instructor_name,
        syllabus_file,
        user_id.rows[0].id,
        syllabus_text,
      ]
    );

    res.status(200).send({ 
      message: "Successfully added course!",
      gptExtractedData: extractedData
    });
  } catch (err) {
    res.status(400).send({ error: "Error ocurred" });
    console.error(err);
  }
});

app.post("/getcourses", verify, async (req, res) => {
  const { accessToken } = req.body;
  const decodedPayload = jwtDecode(accessToken);
  const email = decodedPayload.email;
  try {
    let user_id = await db.query("SELECT * FROM users WHERE email=$1", [email]);
    user_id = user_id.rows[0].id;
    let course_info = await db.query(
      "SELECT course_name, university_name, instructor_name, syllabus_file, syllabus_text FROM syllabus_metadata WHERE user_id=$1",
      [user_id]
    );

    course_info = course_info.rows;
    res.status(200).send({ courses: course_info });
  } catch (err) {
    console.error(err);
    res.status(400).send({ error: err });
  }
});

app.delete("/deletecourse", verify, async (req, res) => {
  const { course_name, university_name, instructor_name, } = req.body;
  
  try {
    const user_id = await db.query("SELECT * FROM users WHERE email=$1", [
      req.user.email,
    ]);

    await db.query(
      "DELETE FROM syllabus_metadata WHERE course_name=$1 AND university_name=$2 AND instructor_name=$3 AND user_id=$4",
      [
        course_name,
        university_name,
        instructor_name,
        user_id.rows[0].id,
      ]
    );

    res.status(200).send({ message: "Successfully deleted course!" });
  } catch (err) {
    res.status(400).send({ error: "Error occurred while deleting the course" });
    console.error(err);
  }
});

app.post("/getdeadlines", verify, async (req, res) => {
  const { accessToken } = req.body;
  const decodedPayload = jwtDecode(accessToken);
  const email = decodedPayload.email;
  try {
    let user_id = await db.query("SELECT * FROM users WHERE email=$1", [email]);
    user_id = user_id.rows[0].id;
    let deadline_info = await db.query(
      "SELECT course_name,category,due_date FROM deadlines WHERE user_id=$1",
      [user_id]
    );

    deadline_info = deadline_info.rows;
    res.status(200).send({ deadlines: deadline_info });
  } catch (err) {
    console.error(err);
    res.status(400).send({ error: err });
  }
});

app.post("/deadlines", verify, async (req, res) => {
  const { category, courseName, dueDate } = req.body;
  try {
    const user_id = await db.query("SELECT * FROM users WHERE email=$1", [
      req.user.email,
    ]);

    await db.query(
      "INSERT INTO deadlines (course_name, category, due_date, user_id) VALUES ($1, $2, $3, $4)",
      [
        courseName,
        category,
        dueDate,
        user_id.rows[0].id
      ]
    )

    res.status(200).send({ message: "Successfully added deadline!" });
  } catch (err) {
    res.status(400).send({ error: "Error ocurred" });
    console.error(err);
  }
});

app.delete("/deletedeadline", verify, async (req, res) => {
  const { category, course_name, due_date } = req.body;
  const date = new Date(due_date).toISOString().split('T')[0];
  
  try {
    const user_id = await db.query("SELECT * FROM users WHERE email=$1", [
      req.user.email,
    ]);

    await db.query(
      "DELETE FROM deadlines WHERE course_name=$1 AND category=$2 AND due_date::date=$3 AND user_id=$4",
      [
        course_name,
        category,
        date,
        user_id.rows[0].id,
      ]
    );

    res.status(200).send({ message: "Successfully deleted deadline!" });
  } catch (err) {
    res.status(400).send({ error: "Error occurred while deleting the deadline" });
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
