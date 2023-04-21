import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postsRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";

// CONFIGURATIONS

// when using es modules we need to do this configuration to use __filename & __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// FILE STORAGE

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* 
Routes:

1- Auth routes
  a- /auth/register --> to register user
  b- /auth/login --> to login user

2- Users routes
  a- /users/:id --> to find user by id
  b- /users/:id/friends --> to find user friends
  c- /users/:id/:friendId --> to add a friend to a user

3- Posts routes
  a- /posts --> to get all feed posts
  b- /posts/:userId/posts --> to get user posts
  c- /posts/:id/like [ send user id in body ]  --> to like a post 

*/

// ROUTES WITH FILES

app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

// ROUTES

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postsRoutes);

// MONGOOSE SETUP

const port = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => console.log(`Server Port: ${port}`));
  })
  .catch((err) => console.error(`${err} did not connect `));
