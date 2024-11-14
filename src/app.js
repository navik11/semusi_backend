import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
    })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// Import routes here
import userRoutes from "./routes/publicAPI.route.js";

// Routes use declaration
app.use("/api/v1/publicapi", userRoutes);

export { app };
