import { Router } from "express";

const router = Router();

router.route("/health").get(checkHealth);

export default router;
