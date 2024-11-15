import { Router } from "express";
import { checkUserHealth, getMessages, postMessage } from "../controllers/user.controller.js";

const router = Router();

router.route("/health").get(checkUserHealth);
router.route("/message").post(postMessage);
router.route("/messages").get(getMessages);

export default router;
