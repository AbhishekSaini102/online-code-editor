// import fs from "fs";
// import { execSync } from "child_process";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export const compileAndRunJava = (file) => {
//   return new Promise((resolve, reject) => {
//     const tempFilePath = path.join(__dirname, "../../uploads", file.filename);
//     const originalFileName = file.originalname;
//     const originalFilePath = path.join(
//       __dirname,
//       "../../uploads",
//       originalFileName
//     );
//     const execFileName = path.basename(originalFileName, ".java");

//     // Debugging
//     console.log(`Temp File Path: ${tempFilePath}`);
//     console.log(`Original File Path: ${originalFilePath}`);

//     try {
//       // Check if the temp file exists
//       if (!fs.existsSync(tempFilePath)) {
//         throw new Error(`Temporary file does not exist: ${tempFilePath}`);
//       }

//       // Rename the temporary file to the original filename
//       fs.renameSync(tempFilePath, originalFilePath);

//       // Compile Java code
//       execSync(`javac "${originalFilePath}"`, { stdio: "pipe" });

//       // Run compiled code
//       const output = execSync(
//         `java -cp "${path.dirname(originalFilePath)}" ${execFileName}`,
//         { stdio: "pipe" }
//       ).toString();

//       // Clean up files
//       fs.unlinkSync(originalFilePath); // Delete the .java file
//       fs.unlinkSync(
//         path.join(path.dirname(originalFilePath), `${execFileName}.class`)
//       ); // Delete the .class file

//       resolve(output);
//     } catch (error) {
//       console.error(error); // Log full error details for debugging
//       reject(error);
//     }
//   });
// };

// export default { compileAndRunJava };

// services/javaService.js

import fs from "fs";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compileAndRunJava = (file) => {
  return new Promise((resolve, reject) => {
    const tempFilePath = path.join(__dirname, "../../uploads", file.filename);
    const originalFileName = file.originalname;
    const originalFilePath = path.join(
      __dirname,
      "../../uploads",
      originalFileName
    );
    // eslint-disable-next-line no-unused-vars
    const execFileName = path.basename(originalFileName, ".java");

    try {
      if (!fs.existsSync(tempFilePath)) {
        throw new Error(`Temporary file does not exist: ${tempFilePath}`);
      }

      fs.renameSync(tempFilePath, originalFilePath);

      const fileContent = fs.readFileSync(originalFilePath, "utf8");
      const classNameMatch = fileContent.match(/public\s+class\s+(\w+)/);
      if (!classNameMatch) {
        throw new Error("No public class found in the file");
      }
      const className = classNameMatch[1];
      const renamedFilePath = path.join(
        __dirname,
        "../../uploads",
        `${className}.java`
      );

      if (originalFileName !== `${className}.java`) {
        fs.renameSync(originalFilePath, renamedFilePath);
      }

      execSync(`javac "${renamedFilePath}"`, { stdio: "inherit" });

      const output = execSync(
        `java -cp "${path.dirname(renamedFilePath)}" ${className}`,
        { stdio: "pipe" }
      ).toString();

      fs.unlinkSync(renamedFilePath);
      fs.unlinkSync(
        path.join(path.dirname(renamedFilePath), `${className}.class`)
      );

      resolve(output);
    } catch (error) {
      reject(error);
    }
  });
};

export default { compileAndRunJava };
