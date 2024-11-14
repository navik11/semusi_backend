import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiErrorRes.js";
import dotenv from "dotenv";
import axios from "axios";

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

const getAllMassages = asyncHandler(async (req, res) => {
    
});

export { checkHealth, callQuotesAPI, dropAllQoutes };
