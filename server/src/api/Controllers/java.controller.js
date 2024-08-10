import javaService from "../../services/javaServices.js";
export const compileAndRunJava = async (req, res) => {
  try {
    const result = await javaService.compileAndRunJava(req.file);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: `Error: ${error.message}` });
  }
};
