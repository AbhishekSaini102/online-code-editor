import { Router } from "express";
import { runJavascript } from "../Controllers/javascript.controller.js";

const router = Router();

router.post("/", runJavascript);

export default router;
