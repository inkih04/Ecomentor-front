import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import plugin from "eslint-plugin-jest";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
    js.configs.recommended,
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: "./tsconfig.json",
            },
            globals: {
                process: 'readonly',
            },
        },
        plugins: {
            "@typescript-eslint": ts,
            "react": react,
        },
        rules: {
            ...ts.configs.recommended.rules, // TS DEFAULT RULES
            "@typescript-eslint/no-unused-vars": "warn",
            "@typescript-eslint/no-explicit-any": "off", // Todo -> back to on after generics
            "no-useless-catch": "off",
            // TODO: ADD MORE RULES
        },
    },
    {
        // Apply this configuration only to files in the __tests__ folder
        files: ["**/__tests__/**/*.js", "**/__tests__/**/*.ts", "**/__tests__/**/*.tsx",
            "**/__mocks__/**/*.js", "**/__mocks__/**/*.ts", "**/__mocks__/**/*.tsx"],
        plugins: { jest: plugin },
        languageOptions: {
            globals: plugin.environments.globals.globals,
        },
        rules: {
            "jest/no-disabled-tests": "warn",
            "jest/no-focused-tests": "error",
            "jest/no-identical-title": "error",
            "jest/prefer-to-have-length": "warn",
            "jest/valid-expect": "error",
        },
    },
];