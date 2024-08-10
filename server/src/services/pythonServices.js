import fs from "fs";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const runPython = (file) => {
  return new Promise((resolve, reject) => {
    const tempFilePath = path.join(__dirname, "../../uploads", file.filename);
    const originalFilePath = path.join(
      __dirname,
      "../../uploads",
      file.originalname
    );

    console.log(`Temp File Path: ${tempFilePath}`);
    console.log(`Original File Path: ${originalFilePath}`);

    try {
      // Check if the temp file exists
      if (!fs.existsSync(tempFilePath)) {
        throw new Error(`Temporary file does not exist: ${tempFilePath}`);
      }

      // Rename the temporary file to the original filename
      fs.renameSync(tempFilePath, originalFilePath);

      // Run Python code
      const output = execSync(`python "${originalFilePath}"`).toString();

      // Clean up files
      fs.unlinkSync(originalFilePath); // Delete the .py file

      resolve(output);
    } catch (error) {
      console.error(error); // Log full error details for debugging
      reject(error);
    }
  });
};

export default { runPython };
