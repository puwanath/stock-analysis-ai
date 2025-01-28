import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import { Linter } from 'eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = /** @type {Linter.Config} */ ({
  // ...compat.extends("next/core-web-vitals", "next/typescript"),
  extends: [
    'next/core-web-vitals',
    'next/typescript',
    // 'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest', // ใช้ ECMAScript รุ่นล่าสุด
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off', // ปิดการแจ้งเตือน error ของ any
    'react/react-in-jsx-scope': 'off', // ตัวอย่างกฎอื่นสำหรับ Next.js
  },
})

export default eslintConfig;
