import express from "express";
import multer from "multer"
import crypto from "crypto"
import dotenv from "dotenv"
import { generatePreSignedUrl } from "../controllers/generatePreSignedUrl.js";
import { signInUsers } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createTask } from "../controllers/taskCreation.js";
import { getTask } from "../controllers/getTask.js";

dotenv.config();

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post("/signinusers", signInUsers)

// this must be sent to the frontend and then the user should be able to upload their data
// authMiddleware to be added 
router.post("/generatepresignedurl", authMiddleware, upload.array("files", 10), generatePreSignedUrl);

router.post("/task", authMiddleware, createTask)

router.get("/task", authMiddleware, getTask)

export default router;  