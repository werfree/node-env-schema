# typedenv

**Type-safe Environment Variable Validator for Node.js, Serverless, and other `process.env` based platforms**

[![npm version](https://img.shields.io/npm/v/typedenv.svg)](https://www.npmjs.com/package/typedenv)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## ✨ Introduction

`typedenv` helps you **validate, parse, and type your environment variables at runtime** with **TypeScript** support.

It ensures that your environment variables are:

- Present (or use sensible defaults)
- Correctly typed (`string`, `number`, `boolean`, `url`, `uri`, `port`, or enum-like arrays)
- Type-safe and autocompleted in your IDE
- Ready for production and fail early if misconfigured

⚡ It **works only in environments where `process.env` is available** — like Node.js, Serverless, backend services, etc.

> 🛑 It does **NOT** work directly inside the browser (e.g., pure Vite frontends) unless you expose environment variables at build time.

---

## 📦 Installation

```bash
npm install typedenv
```

or

```bash
yarn add typedenv
```

---

## 🚀 Quick Start

```ts
// env.ts
import { defineEnv, validateEnv } from 'typedenv';

const schema = defineEnv({
  NODE_ENV: ['development', 'production', 'test'],
  PORT: { type: 'port', default: 3000 },
  DATABASE_URL: 'url',
  ENABLE_FEATURE: { type: 'boolean', default: false },
});

export const env = validateEnv(schema);
```

✅ `env` will now be a fully **typed** and **validated** object.

---

## 🛠 Usage Example

```ts
import { env } from './env';

console.log(env.NODE_ENV); // 'development' | 'production' | 'test'
console.log(env.PORT); // number
console.log(env.DATABASE_URL); // string (validated URL)
console.log(env.ENABLE_FEATURE); // boolean
```

If any environment variable is missing, incorrectly typed, or invalid, `typedenv` will **throw an error at runtime**, helping you catch configuration issues early.

---

## 📑 API Reference

### `defineEnv(schema)`

Defines the environment schema.

- Accepts a schema object.
- Each key can either be:
  - A **base type** (`string`, `number`, `boolean`, `url`, `uri`, `port`)
  - An **array** of allowed strings (enum-like behavior)
  - An object `{ type: EnvType, default?: any }` to specify default values

---

### `validateEnv(schema)`

- Reads environment variables from `process.env`.
- Validates types.
- Applies default values where needed.
- Throws detailed errors if anything is missing or invalid.
- Returns a **fully typed** object.

---

## 📚 Supported Types

| Type       | Validation Details                                         |
| ---------- | ---------------------------------------------------------- |
| `string`   | Any non-empty string                                       |
| `number`   | Parsed as a number, throws if invalid                      |
| `boolean`  | Only accepts `'true'` or `'false'`                         |
| `url`      | Validated using `URL` constructor                          |
| `uri`      | Loosely validated URI format (`scheme:rest`)               |
| `port`     | Integer between 0 and 65535                                |
| `string[]` | Restricts value to one of the given allowed strings (enum) |

---

## ⚙️ Advanced Example

```ts
import { defineEnv, validateEnv } from 'typedenv';

const schema = defineEnv({
  API_URL: 'url',
  NODE_ENV: ['development', 'production', 'test'],
  DEBUG_MODE: { type: 'boolean', default: false },
  TIMEOUT: { type: 'number', default: 5000 },
  SERVICE_PORT: 'port',
});

export const env = validateEnv(schema);

console.log(env.API_URL); // Valid URL string
console.log(env.NODE_ENV); // 'development' | 'production' | 'test'
console.log(env.DEBUG_MODE); // true or false
console.log(env.TIMEOUT); // number
console.log(env.SERVICE_PORT); // number (valid port)
```

If `process.env.API_URL` is invalid or missing, your application will immediately fail with a clear error like:

```
Expected environment variable API_URL to be a valid URL, but got "invalid-url"
```

---

## 🧠 Important Notes

- **This package expects `process.env` to be available.**
- Works perfectly with:
  - Node.js applications
  - Serverless functions (AWS Lambda, Vercel, Netlify, etc.)
  - Backend APIs
- ❗ It does **NOT** work automatically inside browser environments (like Vite client-side apps) unless you expose env variables at build time.

Example for Vite (build-time):

```ts
// vite.config.ts
define: {
  'process.env': process.env, // manually inject environment variables
}
```

---

## 🛡️ Error Handling Best Practices

You should **call `validateEnv` at the very beginning** of your app (before connecting to databases, starting servers, etc.).

Example:

```ts
import { env } from './env';

// Safe to continue after validation
startServer(env.PORT);
```

---

## 🔥 Error Examples

**Missing variable**

```
Error: Missing required environment variable: DATABASE_URL
```

**Invalid number**

```
Error: Expected environment variable PORT to be a number, but got "abc"
```

**Invalid URL**

```
Error: Expected environment variable API_URL to be a valid URL, but got "not_a_url"
```

**Invalid enum value**

```
Error: Expected environment variable NODE_ENV to be one of [development, production, test], but got "staging"
```

---

## 📜 License

[MIT License](./LICENSE) © 2025 [Sayantan Ghosh](mailto:gsayantan01@gmail.com)

---

## 🌟 Support the project

If you like `typedenv`, consider giving it a ⭐ on [GitHub](https://github.com/werfree/typedenv)!
