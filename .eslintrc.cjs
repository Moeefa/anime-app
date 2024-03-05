module.exports = {
  rules: {
    "react/prop-types": 0,
    "@typescript-eslint/explicit-function-return-type": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "prettier/prettier": [
      "warn",
      {
        endOfLine: "auto",
        trailingComma: "es5",
      },
    ],
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "@electron-toolkit/eslint-config-ts/recommended",
    "@electron-toolkit/eslint-config-prettier",
  ],
};
