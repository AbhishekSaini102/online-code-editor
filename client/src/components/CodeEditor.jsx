/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Play, Loader2, ChevronDown } from "lucide-react";
import { runCode } from "../api/execute.js";

const Button = ({ children, className, onClick, disabled }) => (
  <button
    className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

const Select = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block w-60 ml-2" ref={selectRef}>
      <div
        className="block appearance-none w-full bg-gray-100 border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-md shadow leading-tight focus:outline-none focus:shadow-outline cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {options.find((option) => option.value === value)?.label}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <ChevronDown size={16} />
        </div>
      </div>
      {isOpen && (
        <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CodeEditor = () => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vs-light");
  const [isLoading, setIsLoading] = useState(false);
  const [fontSize, setFontSize] = useState(14);

  const editorRef = useRef(null);

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleRunCode = async () => {
    setIsLoading(true);
    try {
      const result = await runCode(language, code);
      setOutput(result.result || result.error);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
    setIsLoading(false);
  };

  const handleLanguageChange = (value) => {
    setLanguage(value);
    if (window.monaco) {
      window.monaco.editor.setModelLanguage(
        window.monaco.editor.getModels()[0],
        value
      );
    }
  };

  const handleScrollZoom = (event) => {
    if (event.ctrlKey) {
      event.preventDefault();
      if (event.deltaY < 0) {
        handleZoomIn();
      } else {
        handleZoomOut();
      }
    }
  };

  const handleZoomIn = () => setFontSize((prev) => Math.min(prev + 1, 24));
  const handleZoomOut = () => setFontSize((prev) => Math.max(prev - 1, 8));

  useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener("wheel", handleScrollZoom, { passive: true });
    }
    return () => {
      if (editor) {
        editor.removeEventListener("wheel", handleScrollZoom);
      }
    };
  }, []);

  useEffect(() => {
    if (window.monaco) {
      window.monaco.editor.setModelLanguage(
        window.monaco.editor.getModels()[0],
        language
      );
    }
  }, [language]);

  const languageOptions = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "typescript", label: "TypeScript" },
    { value: "csharp", label: "C#" },
    { value: "go", label: "Go" },
    { value: "ruby", label: "Ruby" },
    { value: "rust", label: "Rust" },
    { value: "swift", label: "Swift" },
    { value: "php", label: "PHP" },
    { value: "kotlin", label: "Kotlin" },
    { value: "scala", label: "Scala" },
    { value: "perl", label: "Perl" },
    { value: "r", label: "R" },
    { value: "shell", label: "Shell" },
    { value: "sql", label: "SQL" },
    { value: "plaintext", label: "Plain Text" },
    { value: "markdown", label: "Markdown" },
    { value: "json", label: "JSON" },
    { value: "yaml", label: "YAML" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "less", label: "Less" },
    { value: "scss", label: "SCSS" },
    { value: "xml", label: "XML" },
    { value: "vue", label: "Vue" },
    { value: "jsx", label: "JSX" },
    { value: "tsx", label: "TSX" },
    { value: "graphql", label: "GraphQL" },
    { value: "dockerfile", label: "Dockerfile" },
    { value: "plaintext", label: "Plain Text" },
    { value: "powershell", label: "PowerShell" },
    { value: "shell", label: "Shell" },
  ];

  const themeOptions = [
    { value: "vs-light", label: "Light" },
    { value: "vs-dark", label: "Dark" },
    { value: "hc-black", label: "High Contrast" },
  ];

  return (
    <div className="flex h-screen bg-gray-100 ml-1">
      <div className="w-4/6  mt-2 flex flex-col">
        <div className="mb-2 flex justify-between items-center">
          <div className="flex space-x-2">
            <Select
              value={language}
              onChange={handleLanguageChange}
              options={languageOptions}
            />
            <Select value={theme} onChange={setTheme} options={themeOptions} />
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleZoomOut}>-</Button>
            <Button onClick={handleZoomIn}>+</Button>
          </div>
        </div>
        <div className="flex-grow border overflow-hidden">
          <div ref={editorRef} className="h-full">
            <Editor
              height="100%"
              defaultLanguage={language}
              language={language}
              value={code}
              theme={theme}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: true },
                fontSize: fontSize,
                lineNumbers: "on",
                roundedSelection: false,
                scrollBeyondLastLine: false,
                readOnly: false,
                automaticLayout: true,
                scrollbar: {
                  vertical: "visible",
                  horizontal: "visible",
                },
                wordWrap: "on",
                wrappingIndent: "same",
                quickSuggestions: true,
                quickSuggestionsDelay: 100,
                parameterHints: true,
                folding: true,
                mouseWheelZoom: true,
                suggestOnTriggerCharacters: true,
                acceptSuggestionOnEnter: "on",
                acceptSuggestionOnCommitCharacter: true,
                snippetSuggestions: "inline",
                tabCompletion: "on",
                dragAndDrop: true,
                suggest: {
                  snippetsPreventQuickSuggestions: false,
                  snippetsAcceptOnEnter: true,
                  filterGraceful: true,
                  localityBonus: true,
                  shareSuggestSelections: true,
                  showIcons: true,
                },
                fixedOverflowWidgets: true,
                contextmenu: true,
              }}
            />
          </div>
        </div>
      </div>
      <div className="w-2/6 p-0 flex flex-col">
        <Button
          className="mb-2 ml-10 mt-2 px-4 py-2 text-sm self-start flex items-center bg-pink-600 hover:bg-pink-700"
          onClick={handleRunCode}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-6 w-4 animate-spin " />
          ) : (
            <Play className="mr-2 h-6 w-5 " />
          )}
          Run
        </Button>
        {/* <div
          className={`flex-grow p-2 ml-1 border relative ${
            theme === "vs-dark"
              ? "text-white bg-gray-800"
              : "text-black bg-white"
          } overflow-auto`}
        >
          {isLoading && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-green-600 animate-pulse"></div>
          )}
          <pre className="h-full ml-1 mt-1">{output}</pre>
        </div> */}

        <div
          className={`flex-grow p-2 border relative ${
            theme === "vs-dark"
              ? "text-white bg-gray-800"
              : "text-black bg-white"
          } overflow-auto `}
        >
          {isLoading && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-green-600 animate-pulse"></div>
          )}
          <pre className="h-full ml-1 mt-1 text-wrap">{output}</pre>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
