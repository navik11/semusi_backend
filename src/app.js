import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import serveIndex from "serve-index";
import path from "path";
import fs from "fs";
import { marked } from "marked";

dotenv.config();

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
    })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use('/public', express.static('public'), serveIndex('public', { icons: true }));

// app.get('/', (req, res) => {
//     res.send('<h1>Welcome to the Semusi Backend server</h1><p>Visit <a href="/public">Public Folder</a> to view files</p>');
// });

app.get('/', (req, res) => {
    const mdFilePath = path.join('apidoc.md'); // Change path as needed

    // Read the .md file
    fs.readFile(mdFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading markdown file');
        }

        // Convert the markdown to HTML
        const htmlContent = marked(data);

        // Render the HTML inside a basic template
        res.send(`
            <html>
                <head>
                    <title>API Documentation</title>
                    <style>
                        body {
                            item-align: center;
                            font-family: Arial, sans-serif;
                            color: #333;
                            margin: 0;
                            padding: 20px;
                        }
                        header {
                            background-color: #333;
                            color: white;
                            padding: 10px 0;
                            text-align: center;
                        }
                        main {
                            padding: 20px;
                            margin: 20px;
                            background-color: white;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            border-radius: 5px;
                        }
                        h1, h2, h3 {
                            color: #2c3e50;
                        }
                        code {
                            color: #212f3d;
                            padding: 5px 10px;
                            border-radius: 5px;
                        }
                        pre {
                            background-color: #e2e2e2;
                            color: white;
                            padding: 20px;
                            border-radius: 5px;
                            overflow-x: auto;
                        }
                        a {
                            color: #3498db;
                            text-decoration: none;
                        }
                        ul {
                            list-style-type: disc;
                            margin-left: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div>${htmlContent}</div>
                </body>
            </html>
        `);
    });
});

// Import routes here
import publicRoutes from "./routes/publicAPI.route.js";
import userRoutes from "./routes/user.route.js";
import { asyncHandler } from "./utils/asyncHandler.js";
import { queryPG, querySQL } from "./db/index.js";
import { ApiResponse } from "./utils/ApiErrorRes.js";

// Routes use declaration
app.use("/api/v1/publicapi", publicRoutes);
app.use("/api/v1/user", userRoutes);

app.post("/api/v1/sql", asyncHandler( async (req, res) => {
    const { query } = req.body;
    if(!query) {
        return res.status(400).send(new ApiResponse(400, null, "Query is required"));
    }
    try {
        const dbRes = await querySQL(query);
        return res.status(200).send(new ApiResponse(200, dbRes, "Query executed successfully"));
    } catch (err) {
        return res.status(500).send(new ApiResponse(500, err, "Error executing query"));
    }
}));

app.post("/api/v1/pg", asyncHandler( async (req, res) => {
    const { query } = req.body;
    if(!query) {
        return res.status(400).send(new ApiResponse(400, null, "Query is required"));
    }
    try {
        const dbRes = await queryPG(query);
        return res.status(200).send(new ApiResponse(200, dbRes, "Query executed successfully"));
    } catch (err) {
        return res.status(500).send(new ApiResponse(500, err, "Error executing query"));
    }
}));

export { app };
