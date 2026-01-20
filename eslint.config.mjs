import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  // Add any essential ESLint rules here, but keep it minimal for now.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
  ]),
]);

export default eslintConfig;
