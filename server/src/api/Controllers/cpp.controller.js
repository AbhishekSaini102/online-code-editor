import cppService from "../../services/cppServices.js";

export const compileAndRunCpp = async (req, res) => {
  try {
    const result = await cppService.compileAndRun(req.file);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: `Error: ${error.message}` });
  }
};
