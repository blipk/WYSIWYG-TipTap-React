import eslint from "@eslint/js"
import tseslint from "typescript-eslint"
import reactPlugin from "eslint-plugin-react"
import reactRefresh from "eslint-plugin-react-refresh"
import * as globals from "globals"


export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...tseslint.configs.stylistic,
    ...[
        {
            ignores: ["**/dist/"],
        },
        {
            files   : ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
            ...reactPlugin.configs.flat.recommended,
            plugins : {
                "react"         : reactPlugin,
                "react-refresh" : reactRefresh,
                // '@typescript-eslint': tseslint
            },
            languageOptions: {
                parserOptions: {
                    ecmaFeatures: {
                        jsx: true,
                    },
                },
                globals: {
                    ...globals.browser,
                },
            },
            rules: {

                "semi"                 : ["error", "never"],
                "space-in-parens"      : ["error", "always"],
                "no-underscore-dangle" : ["warn"],
                "key-spacing"          : ["error", {
                    align: {
                        beforeColon : true,
                        afterColon  : true,
                        on          : "colon",
                    },
                }],
                "no-multi-spaces" : ["error", { exceptions: { VariableDeclarator: true } }],
                "func-names"      : ["error", "as-needed"],
                "quotes"          : ["error", "double"],
                "max-len"         : ["error", { code: 150 }],
                "camelcase"       : ["error", {
                    ignoreImports: true, ignoreDestructuring: true, properties: "never", allow: ["__"],
                }],

                // typescript-eslint
                "@/semi"                            : ["error", "never"],
                "@/quotes"                          : ["error", "double"],
                "@typescript-eslint/no-unused-vars" : [
                    "error",
                    {
                        "args"                           : "all",
                        "argsIgnorePattern"              : "^_",
                        "caughtErrors"                   : "all",
                        "caughtErrorsIgnorePattern"      : "^_",
                        "destructuredArrayIgnorePattern" : "^_",
                        "varsIgnorePattern"              : "^_",
                    },
                ],
                "@typescript-eslint/no-explicit-any"                : 0,
                "@typescript-eslint/explicit-module-boundary-types" : 0,
                "@typescript-eslint/no-non-null-assertion"          : 0,
                "@typescript-eslint/no-empty-function"              : 0,

                // Indent with 4 spaces
                "indent": ["error", 4],

                // eslint-plugin-react
                "react/jsx-indent"       : ["error", 4],
                "react/jsx-indent-props" : ["error", 4],

                //eslint-plugin-react-refresh
                "react-refresh/only-export-components": [
                    "warn",
                    { allowConstantExport: true },
                ],
            },


        }
    ] )