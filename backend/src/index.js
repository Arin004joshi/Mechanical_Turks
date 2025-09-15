import express from "express"
import labellerRoutes from "./routes/labeller.route.js"
import userRoutes from "./routes/user.route.js"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());
dotenv.config();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5001;

app.use("/api/user", userRoutes)
app.use("/api/labeller", labellerRoutes)

app.listen(port, () => {
    console.log("your server is on : " + port);
})