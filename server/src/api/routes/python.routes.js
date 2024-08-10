import { Router } from "express";
import { runPython } from "../Controllers/python.controller.js";

const router = Router();

router.post("/", runPython);

export default router;
