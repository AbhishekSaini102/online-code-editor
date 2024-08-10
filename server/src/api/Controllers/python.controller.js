import pythonService from "../../services/pythonServices.js";

export const runPython = async (req, res) => {
  try {
    const result = await pythonService.runPython(req.file);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: `Error: ${error.message}` });
  }
};
