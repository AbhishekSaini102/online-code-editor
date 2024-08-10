console.log("ESLint config loaded");
import prettier from "eslint-plugin-prettier";
import configPrettier from "eslint-config-prettier";

export default [
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: 12,
      sourceType: "module",
    },
    plugins: {
      prettier,
    },
    rules: {
      ...configPrettier.rules,
      "prettier/prettier": "error",
      "no-unused-vars": "error",
    },
    ignores: ["node_modules", "dist", "build", "*.log", ".env", "temp"],
    settings: {
      extends: ["eslint:recommended", "plugin:prettier/recommended"],
    },
  },
];
