module.exports = {
    root: true,
    env: {
        browser: true,
        es6: true,
        node: true
    },
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:import/typescript'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        allowAutomaticSingleRunInference: true,
        project: [
            './tsconfig.json'
        ],
        sourceType: 'module'
    },
    plugins: [
        '@typescript-eslint',
        '@typescript-eslint/tslint',
        '@stylistic',
        'import',
        'prefer-arrow'
    ],
    ignorePatterns: ['**/config/*.js', '**/.lighthouse/*.js', 'node_modules/*', '**/node_modules/*', '**/dist/*', '**/*.mjs'],
    rules: {
        '@typescript-eslint/adjacent-overload-signatures': 'error',
        '@typescript-eslint/array-type': 'error',
        '@typescript-eslint/ban-types': [
            'error',
            {
                extendDefaults: true,
                types: {
                    Function: false
                }
            }
        ],
        '@typescript-eslint/naming-convention': [
            'error',
            {
                selector: 'default',
                format: ['camelCase']
            },
            {
                selector: 'memberLike',
                format: ['camelCase'],
                leadingUnderscore: 'allow'
            },
            {
                selector: 'parameter',
                format: ['camelCase'],
                leadingUnderscore: 'allow'
            },
            {
                selector: ['enumMember', 'interface', 'class', 'typeLike'],
                format: ['PascalCase']
            },
            {
                selector: ['enum'],
                format: ['PascalCase', 'UPPER_CASE']
            },
            {
                selector: ['typeProperty'],
                format: ['camelCase', 'PascalCase']
            },
            {
                selector: [
                    'classProperty',
                    'objectLiteralProperty',
                    'typeProperty',
                    'classMethod',
                    'objectLiteralMethod',
                    'typeMethod',
                    'accessor',
                    'enumMember'
                ],
                format: null,
                modifiers: ['requiresQuotes']
            }
        ],
        '@typescript-eslint/consistent-type-assertions': 'error',
        '@typescript-eslint/consistent-type-definitions': 'error',
        '@typescript-eslint/explicit-member-accessibility': [
            'error',
            {
                accessibility: 'explicit'
            }
        ],
        '@stylistic/indent': [
            'error',
            4,
            {
                FunctionDeclaration: {
                    parameters: 'first'
                },
                FunctionExpression: {
                    parameters: 'first'
                },
                SwitchCase: 1,
                VariableDeclarator: 2,
                ImportDeclaration: 'first'
            }
        ],
        '@stylistic/member-delimiter-style': [
            'error',
            {
                multiline: {
                    delimiter: 'semi',
                    requireLast: true
                },
                singleline: {
                    delimiter: 'semi',
                    requireLast: false
                }
            }
        ],
        '@typescript-eslint/member-ordering': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                args: 'none'
            }
        ],
        '@typescript-eslint/no-misused-new': 'error',
        '@typescript-eslint/no-namespace': 'error',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-var-requires': 'error',
        '@typescript-eslint/prefer-for-of': 'error',
        '@typescript-eslint/prefer-function-type': 'error',
        '@typescript-eslint/prefer-namespace-keyword': 'error',
        '@stylistic/quotes': [
            'error',
            'single'
        ],
        '@stylistic/semi': [
            'error',
            'always'
        ],
        '@typescript-eslint/triple-slash-reference': 'error',
        '@stylistic/type-annotation-spacing': 'error',
        '@typescript-eslint/unified-signatures': 'error',
        'arrow-body-style': 'error',
        camelcase: 'error',
        '@stylistic/comma-dangle': 'off',
        complexity: 'off',
        'constructor-super': 'error',
        curly: 'error',
        'dot-notation': 'error',
        '@stylistic/eol-last': 'error',
        eqeqeq: [
            'error',
            'smart'
        ],
        'guard-for-in': 'error',
        'id-denylist': [
            'error',
            'any',
            'number',
            'String',
            'string',
            'Boolean',
            'boolean',
            'Undefined'
        ],
        'id-match': 'error',
        'import/order': 'off',
        'max-classes-per-file': [
            'error',
            1
        ],
        '@stylistic/max-len': [
            'error',
            {
                code: 120,
                ignoreStrings: true,
                ignoreRegExpLiterals: true,
                ignoreTemplateLiterals: true,
                ignoreUrls: true
            }
        ],
        'max-lines': [
            'error',
            1000
        ],
        '@stylistic/new-parens': 'error',
        'no-bitwise': 'off',
        'no-caller': 'error',
        'no-cond-assign': 'error',
        'no-console': 'off',
        'no-debugger': 'error',
        'no-empty': 'off',
        'no-eval': 'error',
        'no-fallthrough': 'off',
        'no-invalid-this': 'off',
        '@stylistic/no-multiple-empty-lines': 'error',
        'no-new-wrappers': 'error',
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': ['error'],
        'no-throw-literal': 'error',
        '@stylistic/no-trailing-spaces': 'error',
        'no-undef-init': 'error',
        'no-underscore-dangle': ['error', {
            allowAfterThis: true
        }],
        'no-unsafe-finally': 'error',
        'no-unused-expressions': 'error',
        'no-unused-labels': 'error',
        'no-var': 'error',
        'object-shorthand': ['warn', 'consistent-as-needed'],
        'one-var': [
            'error',
            'never'
        ],
        'prefer-const': 'error',
        '@stylistic/quote-props': [
            'error',
            'consistent-as-needed'
        ],
        radix: ['error', 'as-needed'],
        '@stylistic/space-before-function-paren': [
            'error',
            {
                anonymous: 'never',
                asyncArrow: 'always',
                named: 'never'
            }
        ],
        '@stylistic/space-in-parens': [
            'error',
            'never'
        ],
        'use-isnan': 'error',
        'valid-typeof': 'off',
        '@typescript-eslint/tslint/config': [
            'error',
            {
                rules: {
                    'completed-docs': [true, 'classes', 'enums', 'functions', 'methods', 'namespaces'],
                    'jsdoc-format': [
                        true,
                        'check-multiline-start'
                    ],
                    'no-reference-import': true,
                    whitespace: [
                        true,
                        'check-branch',
                        'check-decl',
                        'check-operator',
                        'check-separator',
                        'check-typecast'
                    ]
                }
            }
        ]
    }
};