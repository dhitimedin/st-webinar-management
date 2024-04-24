import globals from "globals";

import path from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import pluginJs from "@eslint/js";

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({baseDirectory: __dirname, recommendedConfig: pluginJs.configs.recommended});

export default [
  ...compat.extends("airbnb"),
  {
    files: ["src/**/*.jsx"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        "ecmaVersion": 2020,
        "ecmaFeatures": {
          "jsx": true
        },
        "sourceType": "module"
      },
    },
    rules: {
      semi: "error",
      "no-unused-vars": "warn",
      "prefer-const": "error",
      "indent": [2, "tab", { "SwitchCase": 1, "VariableDeclarator": 1 }],
      "no-tabs": 0,
      "react/prop-types": 0,
      "react/jsx-indent": [2, "tab"],
      "react/jsx-indent-props": [2, "tab"],
      "no-unsafe-optional-chaining": "error",
    },
    settings: {
      'import/ignore': ['node_modules/react-native/index\\.jsx$'],
    },
  },
];