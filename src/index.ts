// src/index.ts

export type BaseEnvType = 'string' | 'number' | 'boolean' | 'url' | 'uri' | 'port';
export type EnvType = BaseEnvType | string[];

export type EnvSchema = {
  [key: string]: EnvType | { type: EnvType; default?: any };
};
export type EnvResult<S extends EnvSchema> = {
  [K in keyof S]: 
    S[K] extends { type: infer T }
      ? T extends 'string' ? string
      : T extends 'number' ? number
      : T extends 'boolean' ? boolean
      : T extends 'url' ? string
      : T extends 'uri' ? string
      : T extends 'port' ? number
      : T extends string[] ? T[number]
      : never
      : S[K] extends 'string' ? string
      : S[K] extends 'number' ? number
      : S[K] extends 'boolean' ? boolean
      : S[K] extends 'url' ? string
      : S[K] extends 'uri' ? string
      : S[K] extends 'port' ? number
      : S[K] extends string[] ? S[K][number]
      : never;
};

export function defineEnv<S extends EnvSchema>(schema: S): S {
  return schema;
}

export function validateEnv<S extends EnvSchema>(schema: S): EnvResult<S> {
  const env: Partial<Record<string, any>> = {};

  for (const key in schema) {
    const rule = schema[key];
    const value = process.env[key];

    let expectedType: EnvType;
    let defaultValue: any;

    if (typeof rule === 'object' && rule !== null && 'type' in rule) {
      expectedType = rule.type;
      defaultValue = rule.default;
    } else {
      expectedType = rule as EnvType;
    }

    if (value === undefined || value === '') {
      if (defaultValue !== undefined) {
        env[key] = defaultValue;
        continue;
      }
      throw new Error(`Missing required environment variable: ${key}`);
    }

    if (expectedType === 'string') {
      env[key] = value;
    } else if (expectedType === 'number') {
      const num = Number(value);
      if (isNaN(num)) {
        throw new Error(`Expected environment variable ${key} to be a number, but got "${value}"`);
      }
      env[key] = num;
    } else if (expectedType === 'boolean') {
      if (value === 'true') env[key] = true;
      else if (value === 'false') env[key] = false;
      else throw new Error(`Expected environment variable ${key} to be boolean (true/false), but got "${value}"`);
    } else if (expectedType === 'url') {
      try {
        const url = new URL(value);
        env[key] = url.toString();
      } catch {
        throw new Error(`Expected environment variable ${key} to be a valid URL, but got "${value}"`);
      }
    } else if (expectedType === 'uri') {
      // Slightly looser validation than URL
      const uriPattern = /^[a-zA-Z][a-zA-Z\d+\-.]*:.+/;
      if (!uriPattern.test(value)) {
        throw new Error(`Expected environment variable ${key} to be a valid URI, but got "${value}"`);
      }
      env[key] = value;
    } else if (expectedType === 'port') {
      const port = Number(value);
      if (isNaN(port) || port < 0 || port > 65535 || !Number.isInteger(port)) {
        throw new Error(`Expected environment variable ${key} to be a valid port number (0-65535), but got "${value}"`);
      }
      env[key] = port;
    } else if (Array.isArray(expectedType)) {
      if (!expectedType.includes(value)) {
        throw new Error(`Expected environment variable ${key} to be one of [${expectedType.join(', ')}], but got "${value}"`);
      }
      env[key] = value;
    } else {
      throw new Error(`Invalid schema type for ${key}`);
    }
  }

  return env as EnvResult<S>;
}
