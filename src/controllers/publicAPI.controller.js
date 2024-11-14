import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiErrorRes.js";
import dotenv from "dotenv";
import axios from "axios";
import { createObjectCsvWriter } from "csv-writer";
import { deleteAllQoutes, storeQuoteDataInPostgres } from "../db/index.js";

dotenv.config({ path: "././.env" });

const checkHealth = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .send(
            new ApiResponse(
                200,
                { "publicapi route status": "Healthy" },
                "publicapi route is working fine"
            )
        );
});

const fetchQuotes = async () => {
    const url = "https://dummyjson.com/quotes";
    const maxRetries = 3;
    let retries = 0;

    const fetchData = async () => {
        try {
            const response = await axios.get(url, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            });
            return response.data; // Return data when successful
        } catch (error) {
            if (error.response && error.response.status === 429 && retries < maxRetries) {
                retries++;
                console.log(`Rate-limited. Retrying... Attempt ${retries}/${maxRetries}`);
                await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
                return await fetchData(); // Retry the request
            } else {
                throw new Error("Failed to fetch data after multiple retries.");
            }
        }
    };

    // Fetch data and return it
    const data = await fetchData();
    return data;
};

// // Function to export data to CSV
const exportDataToCSV = (data) => {
    const csvPath = "./public/quotes.csv";
    const writer = createObjectCsvWriter({
        path: csvPath,
        header: [
            { id: "id", title: "Id" },
            { id: "quote", title: "Quote" },
            { id: "author", title: "Author" },
        ],
    });

    writer.writeRecords(data)
        .then(() => console.log("Data exported to CSV successfully. Please check ./public/quotes.csv"));
};

const callQuotesAPI = asyncHandler(async (req, res) => {
    try {
        // Fetch data from the public API
        const quotes = await fetchQuotes();

        // Store the data in PostgreSQL
        await storeQuoteDataInPostgres(quotes.quotes);

        // Export the data to CSV
        exportDataToCSV(quotes.quotes);

        // Send response
        return res
            .status(200)
            .send(new ApiResponse(200, { quotes }, "Quotes fetched successfully"));
    } catch (error) {
        return res
            .status(500)
            .send(new ApiResponse(500, null, error.message));
    }
});

const dropAllQoutes = asyncHandler(async (req, res) => {
    try {
        await deleteAllQoutes();
        // Send response
        return res
            .status(200)
            .send(new ApiResponse(200, { }, "Quotes deleted successfully"));
    } catch (error) {
        return res
            .status(500)
            .send(new ApiResponse(500, null, error.message));
    }
});

export { checkHealth, callQuotesAPI, dropAllQoutes };
