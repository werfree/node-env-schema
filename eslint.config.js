import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Import necessary packages
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
  // General configuration
  {
    languageOptions: {
      globals: {
        process: 'readonly', // Define process as a global variable
        __dirname: 'readonly', // Define __dirname as a global variable
      },
      parser: typescriptParser, // Use TypeScript parser for the entire project
      parserOptions: {
        ecmaVersion: 2021, // ECMAScript version 2021 (ES12)
        sourceType: 'module', // Use ES modules
        project: './tsconfig.json', // Point to tsconfig.json for type checking
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin, // TypeScript plugin
    },
    rules: {
      'semi': ['error', 'always'], // Enforce semicolons
      'quotes': ['error', 'single'], // Enforce single quotes
      '@typescript-eslint/explicit-module-boundary-types': 'off', // Disable explicit return type rule
    },
  },

  // TypeScript-specific configuration for .ts and .tsx files
  {
    files: ['*.ts', '*.tsx'], // Apply these rules to .ts and .tsx files
    rules: {
      // TypeScript plugin recommended rules
      '@typescript-eslint/explicit-module-boundary-types': 'off', // Disable explicit return type rule
      '@typescript-eslint/no-unused-vars': 'error', // Error for unused variables
    },
  },
];
