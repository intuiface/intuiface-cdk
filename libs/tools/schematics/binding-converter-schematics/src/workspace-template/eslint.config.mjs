import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import preferArrow from 'eslint-plugin-prefer-arrow';
import stylistic from '@stylistic/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import typescriptEslint from '@typescript-eslint/eslint-plugin';

const typescriptFiles = ['**/*.ts'];

const namingConvention = [
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
];

export default [
    {
        ignores: [
            '**/config/*.js',
            '**/.lighthouse/*.js',
            'node_modules/*',
            '**/node_modules/*',
            '**/dist/*',
            '**/*.mjs'
        ]
    },
    {
        files: typescriptFiles,
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            },
            parser: tsParser,
            parserOptions: {
                allowAutomaticSingleRunInference: true,
                project: ['./tsconfig.json'],
                sourceType: 'module',
                tsconfigRootDir: import.meta.dirname
            }
        },
        plugins: {
            '@stylistic': stylistic,
            '@typescript-eslint': typescriptEslint,
            import: importPlugin,
            'prefer-arrow': preferArrow
        },
        rules: {
            ...typescriptEslint.configs.recommended.rules,
            ...typescriptEslint.configs['recommended-type-checked'].rules,
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'none',
                    caughtErrorsIgnorePattern: '^_',
                    varsIgnorePattern: '^_'
                }
            ],
            '@typescript-eslint/adjacent-overload-signatures': 'error',
            '@typescript-eslint/array-type': 'error',
            '@typescript-eslint/naming-convention': namingConvention,
            '@typescript-eslint/consistent-type-assertions': 'error',
            '@typescript-eslint/consistent-type-definitions': 'error',
            '@typescript-eslint/explicit-member-accessibility': [
                'error',
                {
                    accessibility: 'explicit'
                }
            ],
            '@typescript-eslint/member-ordering': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-inferrable-types': [
                'error',
                {
                    ignoreParameters: true,
                    ignoreProperties: true
                }
            ],
            '@typescript-eslint/no-misused-new': 'error',
            '@typescript-eslint/no-namespace': 'error',
            '@typescript-eslint/no-shadow': ['error'],
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/no-use-before-define': 'off',
            '@typescript-eslint/no-require-imports': 'error',
            '@typescript-eslint/prefer-for-of': 'error',
            '@typescript-eslint/prefer-function-type': 'error',
            '@typescript-eslint/prefer-namespace-keyword': 'error',
            '@typescript-eslint/restrict-plus-operands': 'off',
            '@typescript-eslint/triple-slash-reference': 'error',
            '@typescript-eslint/unbound-method': [
                'error',
                {
                    ignoreStatic: true
                }
            ],
            '@typescript-eslint/unified-signatures': 'error',
            '@stylistic/comma-dangle': 'off',
            '@stylistic/eol-last': 'error',
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
            '@stylistic/new-parens': 'error',
            '@stylistic/no-multiple-empty-lines': 'error',
            '@stylistic/no-trailing-spaces': 'error',
            '@stylistic/quote-props': [
                'error',
                'consistent-as-needed'
            ],
            '@stylistic/quotes': [
                'error',
                'single'
            ],
            '@stylistic/semi': [
                'error',
                'always'
            ],
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
            '@stylistic/type-annotation-spacing': 'error',
            'arrow-body-style': 'error',
            camelcase: 'error',
            complexity: 'off',
            'constructor-super': 'error',
            curly: 'error',
            'dot-notation': 'error',
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
            'max-lines': [
                'error',
                1000
            ],
            'no-bitwise': 'off',
            'no-caller': 'error',
            'no-cond-assign': 'error',
            'no-console': 'off',
            'no-debugger': 'error',
            'no-empty': 'off',
            'no-eval': 'error',
            'no-fallthrough': 'off',
            'no-invalid-this': 'off',
            'no-new-wrappers': 'error',
            'no-restricted-imports': [
                'error',
                {
                    patterns: ['**/core/src/*', '**/components/src/*']
                }
            ],
            'no-shadow': 'off',
            'no-throw-literal': 'error',
            'no-undef-init': 'error',
            'no-underscore-dangle': [
                'error',
                {
                    allowAfterThis: true
                }
            ],
            'no-unsafe-finally': 'error',
            'no-unused-expressions': 'error',
            'no-unused-labels': 'error',
            'no-unused-vars': 'off',
            'no-var': 'error',
            'object-shorthand': [
                'warn',
                'consistent-as-needed'
            ],
            'one-var': [
                'error',
                'never'
            ],
            'prefer-arrow/prefer-arrow-functions': [
                'warn',
                {
                    disallowPrototype: true,
                    singleReturnOnly: false,
                    classPropertiesAllowed: false
                }
            ],
            'prefer-const': 'error',
            'prefer-template': 'error',
            radix: [
                'error',
                'as-needed'
            ],
            'use-isnan': 'error',
            'valid-typeof': 'off',
            'no-useless-concat': 'error'
        }
    }
];
