module.exports = {
  env: {
    node: true,
    es2021: true,
    commonjs: true,
    browser: true,
  },
  extends: ["prettier", "eslint-config-prettier", "eslint:recommended"],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  rules: {
    "no-console": "off",
  },
  settings: {},
};
