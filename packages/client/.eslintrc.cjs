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
    // Vue 客户端配置
    {
      files: ["packages/client/**/*.{js,ts,vue}"],
      env: {
        browser: true,
        node: false,
      },
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:vue/vue3-essential",
        "plugin:vue/vue3-strongly-recommended",
        "plugin:vue/vue3-recommended",
      ],
      plugins: ["@typescript-eslint", "vue"],
      parser: "vue-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
        ecmaVersion: 2022,
        sourceType: "module",
      },
      rules: {
        // Vue 特定规则
        "vue/multi-word-component-names": "off",
        "vue/component-definition-name-casing": ["error", "PascalCase"],
        "vue/component-name-in-template-casing": ["error", "PascalCase"],
        "vue/prop-name-casing": ["error", "camelCase"],
        "vue/attribute-hyphenation": ["error", "never"],
        "vue/v-on-event-hyphenation": ["error", "never"],

        // TypeScript 在 Vue 中的配置
        "@typescript-eslint/no-unused-vars": [
          "error",
          { argsIgnorePattern: "^_" },
        ],
        "@typescript-eslint/no-explicit-any": "warn",
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
