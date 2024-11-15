import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiErrorRes.js";
import dotenv from "dotenv";
import { sql_pool } from "../db/index.js";
import moment from "moment";
dotenv.config({ path: "././.env" });

const checkUserHealth = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .send(
            new ApiResponse(
                200,
                { "user route status": "Healthy" },
                "user route is working fine"
            )
        );
});

const getMessages = asyncHandler(async (req, res) => {
    const { lat, long, page = 1 } = req.query;
    const pageSize = 10;

    if (!lat || !long) {
        return res.status(400).json({ message: "Latitude and longitude are required." });
    }

    try {
        const offset = (page - 1) * pageSize;

        const query = `
            SELECT id, message, latitude, longitude, createdAt,
            (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance
            FROM messages
            HAVING distance < 60
            ORDER BY createdAt DESC
            LIMIT ? OFFSET ?
        `;

        const [rows] = await sql_pool.query(query, [lat, long, lat, pageSize, offset]);

        // Format the timestamp for each message
        const messages = rows.map((row) => ({
            id: row.id,
            message: row.message,
            latitude: row.latitude,
            longitude: row.longitude,
            createdAt: moment(row.createdAt).fromNow(), // e.g., "2 minutes ago"
            distance: row.distance.toFixed(2) + " km"
        }));

        return res.status(200).send(new ApiResponse(200, messages, "Messages retrieved successfully"));
    } catch (error) {
        console.error("Error retrieving messages:", error);
        return res.status(500).send(new ApiResponse(500, error, "Error retrieving messages"));
    }
});

const postMessage = asyncHandler(async (req, res) => {

    const { message, longitude, latitude } = req.body;
    if (!message || !longitude || !latitude) {
        return res.status(400).send(new ApiResponse(400, null, "Please provide all the required fields"));
    }

    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            message TEXT NOT NULL,
            longitude DECIMAL(9,6) NOT NULL,
            latitude DECIMAL(9,6) NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    const insertMessageQuery = `
        INSERT INTO messages (message, longitude, latitude)
        VALUES (?, ?, ?);
    `;

    try {
        // Ensure the table exists
        await sql_pool.query(createTableQuery);

        // Insert the new message
        const [result] = await sql_pool.query(insertMessageQuery, [message, longitude, latitude]);
        console.log("Message posted successfully");
        return res.status(201).send(new ApiResponse(201, result, "Message posted successfully"));
    } catch (error) {
        console.error("Error posting message:", error);
        return res.status(500).send(new ApiResponse(500, error, "Error posting message"));
    }
});

export { checkUserHealth, postMessage, getMessages };
