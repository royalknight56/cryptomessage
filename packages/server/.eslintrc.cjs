module.exports = {
  root: false,
  env: {
    node: true,
    browser: false,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["@typescript-eslint", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  rules: {
    // Node.js 特定规则
    "no-process-exit": "error",
    "no-sync": "warn",

    // 允许 require() 在某些文件中
    "@typescript-eslint/no-var-requires": "off",
  },

  overrides: [
    // 配置文件
    {
      files: ["*.config.{js,ts}", ".eslintrc.{js,ts}", "scripts/**/*.{js,ts}"],
      env: {
        node: true,
        browser: false,
      },
      extends: ["plugin:prettier/recommended"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
        "no-console": "off",
      },
    },
  ],
  ignorePatterns: [
    "node_modules/",
    "dist/",
    "build/",
    ".output/",
    ".nuxt/",
    ".vscode/",
    "*.min.js",
    "packages/*/dist/",
    "packages/*/build/",
  ],
};
