import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import nxPlugin from '@nx/eslint-plugin';
import preferArrow from 'eslint-plugin-prefer-arrow';
import stylistic from '@stylistic/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import typescriptEslint from '@typescript-eslint/eslint-plugin';

const typescriptFiles = ['**/*.ts', '**/*.tsx'];
const javascriptFiles = ['**/*.js', '**/*.jsx'];

const namingConvention = [
    'error',
    {
        selector: 'variable',
        format: ['camelCase']
    },
    {
        selector: 'function',
        format: ['camelCase']
    },
    {
        selector: 'parameter',
        format: ['camelCase']
    },
    {
        selector: 'classProperty',
        modifiers: ['static', 'readonly'],
        format: ['camelCase', 'UPPER_CASE']
    },
    {
        selector: 'classProperty',
        format: ['camelCase'],
        leadingUnderscore: 'allow'
    },
    {
        selector: 'classMethod',
        format: ['camelCase']
    },
    {
        selector: 'enumMember',
        format: ['PascalCase']
    }
];

const decoratorNamingConvention = [
    'error',
    {
        selector: 'variable',
        format: ['camelCase']
    },
    {
        selector: 'function',
        format: ['camelCase', 'PascalCase']
    },
    {
        selector: 'parameter',
        format: ['camelCase'],
        leadingUnderscore: 'allow'
    },
    {
        selector: 'classProperty',
        format: ['camelCase'],
        leadingUnderscore: 'allow'
    },
    {
        selector: 'classMethod',
        format: ['camelCase']
    },
    {
        selector: 'enumMember',
        format: ['PascalCase']
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
            '**/*.mjs',
            'libs/tools/schematics/**/src/*/files/**'
        ]
    },
    {
        files: [...typescriptFiles, ...javascriptFiles],
        plugins: {
            '@nx': nxPlugin,
            'prefer-arrow': preferArrow,
            import: importPlugin
        },
        rules: {
            '@nx/enforce-module-boundaries': [
                'error',
                {
                    enforceBuildableLibDependency: true,
                    allow: [],
                    depConstraints: [
                        {
                            sourceTag: '*',
                            onlyDependOnLibsWithTags: ['*']
                        }
                    ]
                }
            ],
            'prefer-arrow/prefer-arrow-functions': [
                'warn',
                {
                    disallowPrototype: true,
                    singleReturnOnly: false,
                    classPropertiesAllowed: false
                }
            ],
            'import/order': 'off'
        }
    },
    {
        files: typescriptFiles,
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.jest
            },
            parser: tsParser,
            parserOptions: {
                sourceType: 'module',
                tsconfigRootDir: import.meta.dirname
            }
        },
        plugins: {
            '@stylistic': stylistic,
            '@typescript-eslint': typescriptEslint,
            import: importPlugin
        },
        rules: {
            ...typescriptEslint.configs.recommended.rules,
            '@typescript-eslint/member-ordering': 'off',
            '@typescript-eslint/no-empty-function': 'error',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/parameter-properties': 'off',
            '@typescript-eslint/no-use-before-define': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'none',
                    caughtErrorsIgnorePattern: '^_',
                    varsIgnorePattern: '^_'
                }
            ],
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/restrict-plus-operands': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/adjacent-overload-signatures': 'error',
            '@typescript-eslint/array-type': 'error',
            '@typescript-eslint/ban-types': 'off',
            '@typescript-eslint/naming-convention': namingConvention,
            '@typescript-eslint/consistent-type-assertions': 'error',
            '@typescript-eslint/consistent-type-definitions': 'error',
            '@typescript-eslint/explicit-member-accessibility': [
                'error',
                {
                    accessibility: 'explicit'
                }
            ],
            '@typescript-eslint/explicit-module-boundary-types': 'error',
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
            '@typescript-eslint/no-misused-new': 'error',
            '@typescript-eslint/no-non-null-assertion': 'warn',
            '@typescript-eslint/no-unsafe-function-type': 'off',
            '@typescript-eslint/no-namespace': 'error',
            '@typescript-eslint/no-require-imports': 'error',
            '@typescript-eslint/prefer-for-of': 'error',
            '@typescript-eslint/prefer-function-type': 'error',
            '@typescript-eslint/prefer-namespace-keyword': 'error',
            '@typescript-eslint/triple-slash-reference': 'error',
            '@stylistic/type-annotation-spacing': 'error',
            '@typescript-eslint/unified-signatures': 'error',
            '@typescript-eslint/no-shadow': ['error'],
            '@typescript-eslint/no-inferrable-types': [
                'error',
                {
                    ignoreParameters: true,
                    ignoreProperties: true
                }
            ],
            '@typescript-eslint/no-unsafe-declaration-merging': 'off',
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
            '@stylistic/indent': [
                'error',
                4,
                {
                    SwitchCase: 1,
                    VariableDeclarator: 2,
                    ImportDeclaration: 'first',
                    FunctionDeclaration: {
                        parameters: 'first'
                    },
                    FunctionExpression: {
                        parameters: 'first'
                    }
                }
            ],
            'import/order': 'off',
            'max-classes-per-file': [
                'error',
                1
            ],
            '@stylistic/max-len': [
                'error',
                {
                    code: 150,
                    ignoreStrings: true,
                    ignoreRegExpLiterals: true,
                    ignoreTemplateLiterals: true,
                    ignoreUrls: true,
                    ignoreComments: true
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
            'no-throw-literal': 'error',
            '@stylistic/no-trailing-spaces': [
                'error',
                {
                    ignoreComments: true
                }
            ],
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
            'prefer-const': 'error',
            '@stylistic/quote-props': [
                'error',
                'consistent-as-needed'
            ],
            '@stylistic/quotes': [
                'error',
                'single',
                {
                    avoidEscape: true,
                    allowTemplateLiterals: 'always'
                }
            ],
            radix: [
                'error',
                'as-needed'
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
            'use-isnan': 'error',
            'valid-typeof': 'off',
            'prefer-template': 'error',
            'no-useless-concat': 'error'
        }
    },
    {
        files: javascriptFiles,
        languageOptions: {
            globals: {
                ...globals.node
            }
        },
        rules: {}
    },
    {
        files: ['**/decorators/*.ts'],
        rules: {
            '@typescript-eslint/naming-convention': decoratorNamingConvention
        }
    },
    {
        files: [
            '*.spec.ts',
            '*.spec.tsx',
            '*.spec.js',
            '*.spec.jsx'
        ],
        languageOptions: {
            globals: {
                ...globals.jest
            }
        },
        rules: {}
    },
    {
        files: [
            'libs/cli/src/cli.ts',
            'libs/components/src/lib/base/collection.component.ts',
            'libs/components/src/lib/base/element.component.ts',
            'libs/components/src/lib/behaviors/**/*.ts',
            'libs/components/src/lib/decorators/intuiface-component.decorator.ts',
            'libs/components/src/lib/services/sharing.service.ts',
            'libs/core/src/lib/base/watchable.ts',
            'libs/core/src/lib/decorators/**/*.ts',
            'libs/core/src/lib/elements/**/*.ts',
            'libs/core/src/lib/services/cache.service.ts',
            'libs/core/src/lib/services/hcms/hcms.group.ts',
            'libs/core/src/lib/services/hcms/hcms.service.ts',
            'libs/core/src/lib/services/usb.serial.service.ts',
            'libs/core/src/lib/types/**/*.ts',
            'libs/tools/schematics/*/src/create/index.ts'
        ],
        rules: {
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-explicit-any': 'off'
        }
    }
];
