import fs from "fs";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const compileAndRun = (file) => {
  return new Promise((resolve, reject) => {
    const tempFilePath = path.join(__dirname, "../../uploads", file.filename);
    const originalFileName = file.originalname;
    const originalFilePath = path.join(
      __dirname,
      "../../uploads",
      originalFileName
    );
    const execFileName = path.basename(originalFileName, ".cpp");
    const execFilePath = path.join(__dirname, "../../uploads", execFileName);

    // Debugging
    console.log(`Temp File Path: ${tempFilePath}`);
    console.log(`Original File Path: ${originalFilePath}`);

    try {
      // Check if the temp file exists
      if (!fs.existsSync(tempFilePath)) {
        throw new Error(`Temporary file does not exist: ${tempFilePath}`);
      }

      fs.renameSync(tempFilePath, originalFilePath);

      // Compile C++ code
      execSync(`g++ "${originalFilePath}" -o "${execFilePath}"`, {
        stdio: "pipe",
      });

      // Run compiled code
      const output = execSync(`"${execFilePath}"`, {
        stdio: "pipe",
      }).toString();

      // Clean up files
      if (fs.existsSync(originalFilePath)) fs.unlinkSync(originalFilePath);
      if (fs.existsSync(`${execFilePath}.exe`))
        fs.unlinkSync(`${execFilePath}.exe`);

      resolve(output);
    } catch (error) {
      console.error(error); // Log full error details for debugging
      reject(error);
    }
  });
};

export default { compileAndRun };
