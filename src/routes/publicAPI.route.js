import { Router } from "express";
import { callQuotesAPI, checkHealth, dropAllQoutes } from "../controllers/publicAPI.controller.js";

const router = Router();

router.route("/health").get(checkHealth);
router.route("/getQuotes").get(callQuotesAPI);
router.route("/dropAllQuotes").get(dropAllQoutes);

export default router;
