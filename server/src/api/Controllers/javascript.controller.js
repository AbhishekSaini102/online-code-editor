import javascriptService from "../../services/javascriptServices.js";

export const runJavascript = async (req, res) => {
  try {
    const result = await javascriptService.runJavascript(req.file);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: `${error.message}` });
  }
};
