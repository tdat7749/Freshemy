// {
//     "env": {
//         "browser": true,
//         "es2021": true
//     },
//     "extends": [
//         "standard-with-typescript",
//         "plugin:react/recommended"
//     ],
//     "parserOptions": {
//         "ecmaVersion": "latest",
//         "sourceType": "module"
//     },
//     "plugins": [
//         "react"
//     ],
//     "rules": {
//         "@typescript-eslint/no-unused-vars": "error",
//         "@typescript-eslint/consistent-type-definitions": ["error", "type"]
//     }
// }



module.exports = {
    extends: ['react-app','react-app/jest','plugin:import/typescript'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint','react','react-hooks'],
    root: true,
    rules: {
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/consistent-type-definitions": ["error", "type"],

        //https://blog.logrocket.com/12-essential-eslint-rules-react/ đọc thêm ở đây
        
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn"
    }
  };