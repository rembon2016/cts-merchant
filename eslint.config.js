import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";

export default [
  // JavaScript recommended rules
  js.configs.recommended,

  // React recommended flat config
  pluginReact.configs.flat.recommended,

  // Global settings
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: { globals: globals.browser },
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
