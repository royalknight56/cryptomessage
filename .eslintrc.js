module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  overrides: [
    // Vue 客户端配置
    // {
    //   files: ["packages/client/**/*.{js,ts,vue}"],
    //   env: {
    //     browser: true,
    //     node: false,
    //   },
    //   extends: [
    //     "eslint:recommended",
    //     "plugin:@typescript-eslint/recommended",
    //     "plugin:vue/vue3-essential",
    //     "plugin:vue/vue3-strongly-recommended",
    //     "plugin:vue/vue3-recommended",
    //   ],
    //   plugins: ["@typescript-eslint", "vue"],
    //   parser: "vue-eslint-parser",
    //   parserOptions: {
    //     parser: "@typescript-eslint/parser",
    //     ecmaVersion: 2022,
    //     sourceType: "module",
    //   },
    //   rules: {
    //     // Vue 特定规则
    //     "vue/multi-word-component-names": "off",
    //     "vue/component-definition-name-casing": ["error", "PascalCase"],
    //     "vue/component-name-in-template-casing": ["error", "PascalCase"],
    //     "vue/prop-name-casing": ["error", "camelCase"],
    //     "vue/attribute-hyphenation": ["error", "never"],
    //     "vue/v-on-event-hyphenation": ["error", "never"],

    //     // TypeScript 在 Vue 中的配置
    //     "@typescript-eslint/no-unused-vars": [
    //       "error",
    //       { argsIgnorePattern: "^_" },
    //     ],
    //     "@typescript-eslint/no-explicit-any": "warn",
    //   },
    // },

    // Server 端配置
    {
      files: ["packages/server/**/*.{js,ts}"],
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
      rules: {
        // Node.js 特定规则
        "no-process-exit": "error",
        "no-sync": "warn",

        // 允许 require() 在某些文件中
        "@typescript-eslint/no-var-requires": "off",
      },
    },

    // Types 包配置
    {
      files: ["packages/types/**/*.{js,ts}"],
      env: {
        node: true,
        browser: false,
      },
      extends: ["plugin:prettier/recommended"],

      rules: {
        // 类型定义包的特殊规则
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/no-namespace": "off",
      },
    },

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
