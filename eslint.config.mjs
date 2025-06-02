import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // TypeScript ESLint rules
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",

      // Next.js specific rules
      "@next/next/no-img-element": "off",

      // React hooks rules
      "react-hooks/exhaustive-deps": "off",

      // JSX accessibility rules
      "jsx-a11y/alt-text": "off",

      // General ESLint rules
      "prefer-const": "off",
      "no-unused-vars": "off"
    },
  },
];

export default eslintConfig;
