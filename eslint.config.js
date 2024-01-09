import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default [
  { ignores: ["dist", "coverage", "node_modules"] },
  js.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  reactHooks.configs.flat.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    files: ["**/*.{js,jsx,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
    settings: { react: { version: "detect" } },
    rules: {
      "react/prop-types": "off",
    },
  },
  {
    files: ["vite.config.js", "eslint.config.js"],
    languageOptions: { globals: globals.node },
  },
  {
    // Playwright scripts: Node, plus callbacks that run inside the page.
    files: ["scripts/**/*.mjs"],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
];
