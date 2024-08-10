import { Router } from "express";
import { compileAndRunCpp } from "../Controllers/cpp.controller.js";

const router = Router();

router.post("/", compileAndRunCpp);

export default router;

// import { Router } from "express";
// import multer from "multer";
// import { compileAndRun } from "../services/cppService.js";

// const router = Router();
// const upload = multer({ dest: "uploads/" });

// router.post("/", upload.single("file"), async (req, res) => {
//   console.log(req.file); // Debugging line
//   const file = req.file;

//   if (!file || path.extname(file.originalname) !== ".cpp") {
//     return res.status(400).json({ error: "Please upload a .cpp file" });
//   }

//   try {
//     const result = await compileAndRun(file);
//     res.json({ result });
//   } catch (error) {
//     res.status(500).json({ error: `Error: ${error.message}` });
//   }
// });

// export default router;
