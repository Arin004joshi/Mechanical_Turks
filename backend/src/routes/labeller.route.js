import express from "express";
import { signInLabellers } from "../controllers/authController.js";
import { getNextTask } from "../controllers/nextTask.js";
import { getSubmissions } from "../controllers/submissions.js";
import { getBalance } from "../controllers/getBalance.js";
import { getPayout } from "../controllers/getPayout.js";
import { labellerMiddleware } from "../middlewares/labellerMiddleware.js"
import { } from "../controllers/nextTask.js";
const router = express.Router();

router.post("/signinlabellers", signInLabellers)

router.get("/nextTask", labellerMiddleware, getNextTask)

router.post("/submission", labellerMiddleware, getSubmissions)

router.get("/balance", labellerMiddleware, getBalance)

// to send the money from user address to the labeller address 
router.post("/payout", labellerMiddleware, getPayout)

export default router;