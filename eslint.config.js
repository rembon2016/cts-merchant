import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";

export default [
  { settings: { react: { version: "detect" } } },
  { ignores: ["node_modules/**", "dist/**"] },
  // JavaScript recommended rules
  js.configs.recommended,

  // React recommended flat config
  pluginReact.configs.flat.recommended,

  // Global settings
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: { globals: globals.browser },
    plugins: { "react-hooks": pluginReactHooks },
    settings: { react: { version: "detect" } },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",
      "no-unused-vars": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "off",
    },
  },

  // Test files (Jest) globals
  {
    files: ["test/**/*.{js,jsx}", "**/*.test.{js,jsx}"],
    languageOptions: {
      globals: { ...globals.jest, ...globals.node, global: true },
    },
  },

  // Node-based config files
  {
    files: ["vite.config.js", "jest.config.cjs", "babel.config.cjs"],
    languageOptions: { globals: globals.node },
  },
];
