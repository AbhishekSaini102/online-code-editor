import fs from "fs";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const runJavascript = (file) => {
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

      // Check if the file is empty
      // const fileStats = fs.statSync(tempFilePath);
      // if (fileStats.size === 0) {
      //   // console.warn(`Warning: The file is empty: ${tempFilePath}`);
      //   return reject(new Error(`The file is empty`));
      // }

      const fileStats = fs.statSync(tempFilePath);
      if (fileStats.size === 0) {
        // console.warn(`Warning: The file is empty: ${tempFilePath}`);
        throw new Error(`The file is empty`);
      }

      // Check if the file has a .js extension
      if (!file.originalname.endsWith(".js")) {
        throw new Error(`File is not a JavaScript file: ${file.originalname}`);
      }

      // Rename the temporary file to the original filename
      fs.renameSync(tempFilePath, originalFilePath);
      console.log(`Renamed file from ${tempFilePath} to ${originalFilePath}`);

      // Delete the temporary file after renaming
      // fs.unlinkSync(tempFilePath);
      // console.log(`Deleted temp file: ${tempFilePath}`);

      // Run JavaScript code
      const outputBuffer = execSync(`node "${originalFilePath}"`);
      console.log(`JavaScript buffer  : ${outputBuffer}`);
      const outputString = outputBuffer.toString();
      console.log(`JavaScript toString : ${outputString}`);

      // Clean up files
      fs.unlinkSync(originalFilePath); // Delete the .js file
      console.log(`Deleted file: ${originalFilePath}`);

      resolve(outputString);
    } catch (error) {
      console.error(`Error: ${error.message}`); // Log error message for debugging
      reject(error);
    } finally {
      // Clean up files
      try {
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath); // Delete the temp file
          console.log(`Deleted temp file: ${tempFilePath}`);
        }
        if (fs.existsSync(originalFilePath)) {
          fs.unlinkSync(originalFilePath); // Delete the .js file
          console.log(`Deleted file: ${originalFilePath}`);
        }
      } catch (cleanupError) {
        console.error(`Cleanup Error: ${cleanupError.message}`);
      }
    }
  });
};

export default { runJavascript };
