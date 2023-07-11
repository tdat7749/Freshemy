/* eslint-env node */
module.exports = {
    extends: ["prettier"],
    rules: {
        "prettier/prettier": ["error", { endOfLine: "auto" }],
        // 'arrow-body-style': 'off',
        // 'prefer-arrow-callback': 'off'
    },
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "prettier"],
    root: true,
};
