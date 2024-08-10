import { Router } from "express";
import multer from "multer";
import { compileAndRunRust } from "../services/rustService.js";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  console.log(req.file); // Debugging line
  const file = req.file;

  if (!file || path.extname(file.originalname) !== ".rs") {
    return res.status(400).json({ error: "Please upload a .rs file" });
  }

  try {
    const result = await compileAndRunRust(file);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: `Error: ${error.message}` });
  }
});

export default router;
