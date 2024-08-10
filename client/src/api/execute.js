import axios from "axios";

const API_BASE_URL = "http://localhost:5000/execute"; // Replace with your actual API URL

export const runCode = async (language, code) => {
  const formData = new FormData();
  formData.append(
    "file",
    new Blob([code], { type: getMimeType(language) }),
    `code.${getFileExtension(language)}`
  );

  try {
    const response = await axios.post(`${API_BASE_URL}/${language}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "An error occurred");
  }
};

const getMimeType = (language) => {
  switch (language) {
    case "cpp":
      return "text/x-c++";
    case "rust":
      return "text/x-rust";
    case "python":
      return "text/x-python";
    case "java":
      return "text/x-java";
    case "javascript":
      return "text/x-javascript";
    default:
      return "text/plain";
  }
};

const getFileExtension = (language) => {
  switch (language) {
    case "cpp":
      return "cpp";
    case "rust":
      return "rs";
    case "python":
      return "py";
    case "java":
      return "java";
    case "javascript":
      return "js";
    default:
      return "txt";
  }
};
