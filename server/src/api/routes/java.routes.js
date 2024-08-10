import { Router } from "express";
import { compileAndRunJava } from "../Controllers/java.controller.js";
const router = Router();

router.post("/", compileAndRunJava);

export default router;
