import fs from 'fs-extra';
import path from 'path';
import ts from 'typescript';
import { readWorkspaceTemplateFile } from './generator.service.js';
import { getWorkspaceWebpackConfigFileName } from './workspace.service.js';

/**
 * Moving the webpack configuration of a 2.x project (webpack.config.js and webpack-debug.config.js, created by the schematics)
 * to the customisation function of a workspace (webpack.config.cjs).
 *
 * The CLI now generates what the schematics wrote in webpack.config.js (entry, output, ts-loader rule, ModuleFederationPlugin):
 * that part is dropped. Anything else, typically `externals` so that Node.js, Electron or BrightSign modules are not bundled,
 * is copied as is (source text, comments included) into the function of webpack.config.cjs.
 * The legacy files are only read and parsed, never run.
 */

const LEGACY_CONFIG_FILE = 'webpack.config.js';
const LEGACY_DEBUG_CONFIG_FILE = 'webpack-debug.config.js';

/** Line of the webpack.config.cjs template before which the migrated customisations are inserted. */
const TEMPLATE_RETURN_LINE = '    return config;';
const FUNCTION_BODY_INDENT = '    ';

/** Parameters of the customisation function: a top-level declaration with one of these names would be hidden inside it. */
const FUNCTION_PARAMETER_NAMES = ['config', 'item', 'debug'];

export interface WebpackConfigMigration
{
    /** webpack.config.cjs was written (false when the workspace already had one, which is kept). */
    isWebpackConfigCreated: boolean;
    /** Customisations moved to webpack.config.cjs, e.g. `externals`, `resolve.fallback`, `devtool (debug)`. */
    migrated: string[];
    /** Legacy files deleted: their customisations are all in webpack.config.cjs. */
    removedFiles: string[];
    /** Legacy files kept: what they change could not be moved and must be moved by hand. */
    keptFiles: { file: string; reasons: string[] }[];
}

/** Builds a customisation applies to, as in 2.x projects where webpack-debug.config.js extended webpack.config.js. */
export type BuildCondition = 'always' | 'production' | 'debug';

export type LegacyConfigKind = 'base' | 'debug';

export interface Customization
{
    /** Shown in the migration summary. */
    name: string;
    /** Statement applying the customisation to `config`, its first line not indented. */
    code: string;
    /** Comments written above the customisation in the legacy file. */
    comments: string[];
    /** Indentation of the customisation in the legacy file. */
    sourceIndent: string;
    condition: BuildCondition;
    /** Copied node, to find the top-level declarations it uses. */
    node: ts.Node;
}

export interface TopLevelStatement
{
    text: string;
    /** Text without spaces, to find the statements written in both files. */
    normalized: string;
    declaredNames: string[];
    /** `const x = require('...')`: dropped when the copied code does not use it. */
    isRequire: boolean;
    node: ts.Node;
}

export interface LegacyConfigAnalysis
{
    file: string;
    statements: TopLevelStatement[];
    customizations: Customization[];
    /** Changes that cannot be moved automatically. */
    unsupported: string[];
}

/**
 * Create webpack.config.cjs from the legacy webpack config files of a project, and delete the legacy files that are fully moved.
 * A legacy file that changes something the migration cannot move (e.g. the ModuleFederationPlugin options) is kept.
 * @param dir project folder
 * @param itemName name of the item built by the project (the schematics used it in entry, output and ModuleFederationPlugin)
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function migrateWebpackConfigFiles(dir: string, itemName: string): WebpackConfigMigration
{
    const analyses: LegacyConfigAnalysis[] = [];
    for (const [file, kind] of [[LEGACY_CONFIG_FILE, 'base'], [LEGACY_DEBUG_CONFIG_FILE, 'debug']] as [string, LegacyConfigKind][])
    {
        const filePath = path.join(dir, file);
        if (fs.existsSync(filePath))
        {
            analyses.push(analyzeLegacyWebpackConfig(file, fs.readFileSync(filePath, 'utf8'), itemName, kind));
        }
    }

    const webpackConfigPath = path.join(dir, getWorkspaceWebpackConfigFileName());
    const isWebpackConfigExisting = fs.existsSync(webpackConfigPath);
    if (isWebpackConfigExisting)
    {
        // Never overwrite the customisation of the developer: the legacy changes are left to move by hand
        for (const analysis of analyses.filter((candidate) => candidate.customizations.length > 0))
        {
            analysis.unsupported.unshift(`${getWorkspaceWebpackConfigFileName()} already exists: ${formatNames(analysis.customizations)} not moved`);
        }
    }
    else
    {
        fs.writeFileSync(webpackConfigPath, renderWebpackConfig(readWorkspaceTemplateFile(getWorkspaceWebpackConfigFileName()), analyses), 'utf8');
    }

    const migration: WebpackConfigMigration = {
        isWebpackConfigCreated: !isWebpackConfigExisting,
        migrated: isWebpackConfigExisting ? [] : analyses.flatMap((analysis) => analysis.customizations.map((customization) => customization.name)),
        removedFiles: [],
        keptFiles: []
    };
    for (const analysis of analyses)
    {
        if (analysis.unsupported.length > 0)
        {
            migration.keptFiles.push({ file: analysis.file, reasons: analysis.unsupported });
        }
        else
        {
            fs.removeSync(path.join(dir, analysis.file));
            migration.removedFiles.push(analysis.file);
        }
    }

    return migration;
}

/**
 * Find what a legacy webpack config file changes compared with the files generated by the schematics.
 * @param file file name, for the messages
 * @param text content of the file
 * @param itemName name of the item
 * @param kind `base` for webpack.config.js, `debug` for webpack-debug.config.js (which extends webpack.config.js)
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function analyzeLegacyWebpackConfig(file: string, text: string, itemName: string, kind: LegacyConfigKind): LegacyConfigAnalysis
{
    const analysis: LegacyConfigAnalysis = { file: file, statements: [], customizations: [], unsupported: [] };
    const sourceText = text.replace(/\r\n/g, '\n');

    const syntaxError = findSyntaxError(file, sourceText);
    if (syntaxError)
    {
        analysis.unsupported.push(`it cannot be parsed (${syntaxError})`);
        return analysis;
    }

    const sourceFile = ts.createSourceFile(file, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
    const exportedObjects = sourceFile.statements.filter(isModuleExportsAssignment);
    const exported = exportedObjects.length === 1 ? (exportedObjects[0].expression as ts.BinaryExpression).right : undefined;
    if (exported == null || !ts.isObjectLiteralExpression(exported))
    {
        analysis.unsupported.push('`module.exports` is not assigned a configuration object');
        return analysis;
    }

    const context = new LegacyConfigContext(analysis, sourceFile, itemName, kind);
    for (const statement of sourceFile.statements)
    {
        if (statement !== exportedObjects[0])
        {
            context.addTopLevelStatement(statement);
        }
    }

    if (kind === 'base')
    {
        context.addBaseConfigProperties(exported);
    }
    else
    {
        context.addDebugConfigProperties(exported);
    }

    context.dropUnusedRequires();
    return analysis;
}

/**
 * Write the migrated customisations in the webpack.config.cjs template:
 * the top-level statements (require calls, constants) first, then the customisations in the function, before `return config;`.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function renderWebpackConfig(template: string, analyses: LegacyConfigAnalysis[]): string
{
    const statements: string[] = [];
    const declaredNames = new Map<string, string>();
    for (const analysis of analyses)
    {
        for (const statement of analysis.statements)
        {
            if (statements.some((existing) => normalizeCode(existing) === statement.normalized))
            {
                continue;
            }

            const conflict = statement.declaredNames.find((name) => declaredNames.has(name));
            if (conflict)
            {
                analysis.unsupported.push(`'${conflict}' is also declared in ${declaredNames.get(conflict)}`);
                continue;
            }

            statement.declaredNames.forEach((name) => declaredNames.set(name, analysis.file));
            statements.push(statement.text);
        }
    }

    const body: string[] = [];
    for (const analysis of analyses.filter((candidate) => candidate.customizations.length > 0))
    {
        body.push(`${FUNCTION_BODY_INDENT}// Moved from ${analysis.file} by intuiface-cli migrate`);
        body.push(...renderCustomizations(analysis.customizations.filter((customization) => customization.condition === 'always'), FUNCTION_BODY_INDENT));
        for (const [condition, test] of [['production', '!debug'], ['debug', 'debug']] as [BuildCondition, string][])
        {
            const conditional = analysis.customizations.filter((customization) => customization.condition === condition);
            if (conditional.length > 0)
            {
                body.push(`${FUNCTION_BODY_INDENT}if (${test})`, `${FUNCTION_BODY_INDENT}{`);
                body.push(...renderCustomizations(conditional, `${FUNCTION_BODY_INDENT}${FUNCTION_BODY_INDENT}`));
                body.push(`${FUNCTION_BODY_INDENT}}`);
            }
        }
        body.push('');
    }

    const lines = template.replace(/\r\n/g, '\n').split('\n');
    const returnIndex = lines.lastIndexOf(TEMPLATE_RETURN_LINE);
    if (body.length > 0)
    {
        if (returnIndex < 0)
        {
            throw new Error(`The ${getWorkspaceWebpackConfigFileName()} template has no '${TEMPLATE_RETURN_LINE.trim()}' line.`);
        }
        lines.splice(returnIndex, 0, ...body);
    }

    const prefix = statements.length > 0 ? `${statements.join('\n')}\n\n` : '';
    // Same line endings as the template (CRLF in a Windows checkout), as the file created by `init`
    const endOfLine = template.includes('\r\n') ? '\r\n' : '\n';
    return `${prefix}${lines.join('\n')}`.replace(/\r?\n/g, endOfLine);
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function renderCustomizations(customizations: Customization[], indent: string): string[]
{
    return customizations.flatMap((customization) => [
        ...customization.comments.map((comment) => `${indent}${reindent(comment, customization.sourceIndent, indent)}`),
        `${indent}${reindent(customization.code, customization.sourceIndent, indent)}`
    ]);
}

/**
 * Collects the top-level statements and the customisations of one legacy file.
 */
class LegacyConfigContext
{
    /** Identifiers of `require('./webpack.config')` in webpack-debug.config.js. */
    private readonly baseConfigNames = new Set<string>();

    public constructor(
        private readonly analysis: LegacyConfigAnalysis,
        private readonly sourceFile: ts.SourceFile,
        private readonly itemName: string,
        private readonly kind: LegacyConfigKind
    )
    {
    }

    public addTopLevelStatement(statement: ts.Statement): void
    {
        if (ts.isExpressionStatement(statement) && ts.isStringLiteral(statement.expression))
        {
            // 'use strict'
            return;
        }

        if (ts.isImportDeclaration(statement) || ts.isExportAssignment(statement) || ts.isExportDeclaration(statement))
        {
            this.analysis.unsupported.push(`it uses ES module syntax (${this.firstLine(statement)}), ${getWorkspaceWebpackConfigFileName()} is a CommonJS module`);
            return;
        }

        if (/\bmodule\.exports\b|(?:^|[^.\w$])exports\s*\./.test(statement.getText(this.sourceFile)))
        {
            this.analysis.unsupported.push(`it changes module.exports outside the configuration object (${this.firstLine(statement)})`);
            return;
        }

        const requiredModule = getRequiredModule(statement);
        if (requiredModule != null && this.kind === 'debug' && /^\.\/webpack\.config(\.js)?$/.test(requiredModule))
        {
            getDeclaredNames(statement).forEach((name) => this.baseConfigNames.add(name));
            return;
        }

        const declaredNames = getDeclaredNames(statement);
        const hiddenName = declaredNames.find((name) => FUNCTION_PARAMETER_NAMES.includes(name));
        if (hiddenName)
        {
            this.analysis.unsupported.push(`'${hiddenName}' is declared at the top of the file and is also a parameter of the ${getWorkspaceWebpackConfigFileName()} function`);
        }

        this.analysis.statements.push({
            text: statement.getFullText(this.sourceFile).trim(),
            normalized: normalizeCode(statement.getFullText(this.sourceFile).trim()),
            declaredNames: declaredNames,
            isRequire: requiredModule != null,
            node: statement
        });
    }

    /**
     * webpack.config.js: drop what the CLI generates, keep the rest.
     */
    public addBaseConfigProperties(config: ts.ObjectLiteralExpression): void
    {
        for (const property of config.properties)
        {
            const key = this.getKey(property, '');
            if (key == null)
            {
                continue;
            }

            const value = getPropertyValue(property as ts.PropertyAssignment | ts.ShorthandPropertyAssignment);
            switch (key)
            {
                case 'entry':
                    this.checkEntry(value);
                    break;
                case 'output':
                    this.addNestedProperties(value, 'output', (subKey, subValue) => this.isGeneratedOutput(subKey, subValue));
                    break;
                case 'resolve':
                    this.addNestedProperties(value, 'resolve', (subKey, subValue) => subKey === 'extensions' && normalizeCode(subValue.getText(this.sourceFile)) === normalizeCode(`['.tsx', '.ts', '.js']`));
                    break;
                case 'module':
                    this.addModuleProperties(value);
                    break;
                case 'plugins':
                    this.addPlugins(value);
                    break;
                case 'mode':
                case 'devtool':
                    // webpack-debug.config.js overrode them: they only applied to production builds
                    if (!(key === 'mode' && isStringLiteralWithText(value, 'production')))
                    {
                        this.addAssignment(property, key, `config.${key}`, value, 'production');
                    }
                    break;
                default:
                    this.addAssignment(property, key, `config${toPropertyAccess(key)}`, value, 'always');
                    break;
            }
        }
    }

    /**
     * webpack-debug.config.js: `{ ...baseConfig, mode: 'development', devtool: 'inline-source-map' }` plus the debug customisations.
     */
    public addDebugConfigProperties(config: ts.ObjectLiteralExpression): void
    {
        const extendsBaseConfig = config.properties.some((property) => ts.isSpreadAssignment(property)
            && ts.isIdentifier(property.expression) && this.baseConfigNames.has(property.expression.text));
        if (!extendsBaseConfig && config.properties.length > 0)
        {
            this.analysis.unsupported.push(`it does not extend ${LEGACY_CONFIG_FILE} (\`...require('./webpack.config')\`)`);
            return;
        }

        for (const property of config.properties)
        {
            if (ts.isSpreadAssignment(property) && ts.isIdentifier(property.expression) && this.baseConfigNames.has(property.expression.text))
            {
                continue;
            }

            const key = this.getKey(property, '');
            if (key == null)
            {
                continue;
            }

            const value = getPropertyValue(property as ts.PropertyAssignment | ts.ShorthandPropertyAssignment);
            if ((key === 'mode' && isStringLiteralWithText(value, 'development')) || (key === 'devtool' && isStringLiteralWithText(value, 'inline-source-map')))
            {
                continue;
            }

            if (['entry', 'output', 'resolve', 'module', 'plugins'].includes(key))
            {
                this.analysis.unsupported.push(`\`${key}\` is replaced for debug builds`);
                continue;
            }

            this.addAssignment(property, `${key} (debug)`, `config${toPropertyAccess(key)}`, value, 'debug');
        }
    }

    /**
     * Drop the `require` statements that the copied code does not use, e.g. `const path = require('path')`
     * when only `output.path` used it.
     */
    public dropUnusedRequires(): void
    {
        const usedNames = new Set<string>();
        this.analysis.customizations.forEach((customization) => collectIdentifiers(customization.node, usedNames));
        this.analysis.statements.filter((statement) => !statement.isRequire).forEach((statement) => collectIdentifiers(statement.node, usedNames));
        this.analysis.statements = this.analysis.statements
            .filter((statement) => !statement.isRequire || statement.declaredNames.some((name) => usedNames.has(name)));
    }

    private checkEntry(value: ts.Expression): void
    {
        const generatedEntries = [`./src/${this.itemName}.ts`, `src/${this.itemName}.ts`, './src/index.js'];
        if (!(ts.isStringLiteral(value) && generatedEntries.includes(value.text)))
        {
            this.analysis.unsupported.push(`\`entry: ${this.firstLine(value)}\`: the workspace builds src/${this.itemName}.ts (set the item "entry" in intuiface.workspace.json)`);
        }
    }

    private isGeneratedOutput(key: string, value: ts.Expression): boolean
    {
        if (key === 'publicPath')
        {
            return isStringLiteralWithText(value, 'auto');
        }

        if (key === 'path')
        {
            if (normalizeCode(value.getText(this.sourceFile)) !== normalizeCode(`path.resolve(__dirname, 'dist/${this.itemName}')`))
            {
                this.analysis.unsupported.push(`\`output.path: ${this.firstLine(value)}\`: the workspace builds each item in dist/<item name>`);
            }
            return true;
        }

        return false;
    }

    /**
     * `output: {...}` or `resolve: {...}`: the properties the CLI does not generate are set one by one.
     */
    private addNestedProperties(value: ts.Expression, key: string, isGenerated: (subKey: string, subValue: ts.Expression) => boolean): void
    {
        if (!ts.isObjectLiteralExpression(value))
        {
            this.analysis.unsupported.push(`\`${key}\` is not an object literal`);
            return;
        }

        for (const subProperty of value.properties)
        {
            const subKey = this.getKey(subProperty, `${key}.`);
            if (subKey == null)
            {
                continue;
            }

            const subValue = getPropertyValue(subProperty as ts.PropertyAssignment | ts.ShorthandPropertyAssignment);
            if (!isGenerated(subKey, subValue))
            {
                this.addAssignment(subProperty, `${key}.${subKey}`, `config.${key}${toPropertyAccess(subKey)}`, subValue, 'always');
            }
        }
    }

    /**
     * `module: { rules: [...] }`: the ts-loader rule is generated, other rules are added to it.
     */
    private addModuleProperties(value: ts.Expression): void
    {
        this.addNestedProperties(value, 'module', (subKey, subValue) =>
        {
            if (subKey !== 'rules')
            {
                return false;
            }

            if (!ts.isArrayLiteralExpression(subValue))
            {
                this.analysis.unsupported.push('`module.rules` is not an array literal');
                return true;
            }

            const generatedRule = normalizeCode(`{ test: /\\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ }`);
            for (const rule of subValue.elements)
            {
                if (normalizeCode(rule.getText(this.sourceFile)) !== generatedRule)
                {
                    this.addPush(rule, 'module.rules', 'config.module.rules');
                }
            }
            return true;
        });
    }

    /**
     * `plugins: [...]`: the ModuleFederationPlugin is generated, other plugins are added to it.
     */
    private addPlugins(value: ts.Expression): void
    {
        if (!ts.isArrayLiteralExpression(value))
        {
            this.analysis.unsupported.push('`plugins` is not an array literal');
            return;
        }

        const generatedPlugin = normalizeCode(`new ModuleFederationPlugin({
            name: '${this.itemName}',
            filename: '${this.itemName}.js',
            exposes: { './${this.itemName}': { import: './src/${this.itemName}.ts', name: '${this.itemName}.module' } },
            shared: { '@intuiface/core': { singleton: true, strictVersion: false } }
        })`);
        for (const plugin of value.elements)
        {
            if (ts.isNewExpression(plugin) && /(^|\.)ModuleFederationPlugin$/.test(plugin.expression.getText(this.sourceFile)))
            {
                if (normalizeCode(plugin.getText(this.sourceFile)) !== generatedPlugin)
                {
                    this.analysis.unsupported.push('the ModuleFederationPlugin options are changed (the workspace generates this plugin for each item)');
                }
                continue;
            }

            this.addPush(plugin, 'plugins', 'config.plugins');
        }
    }

    private addAssignment(property: ts.Node, name: string, target: string, value: ts.Expression, condition: BuildCondition): void
    {
        this.addCustomization(property, value, name, `${target} = ${value.getText(this.sourceFile)};`, condition);
    }

    private addPush(element: ts.Expression, name: string, target: string): void
    {
        const code = ts.isSpreadElement(element)
            ? `${target}.push(...${element.expression.getText(this.sourceFile)});`
            : `${target}.push(${element.getText(this.sourceFile)});`;
        this.addCustomization(element, element, name, code, 'always');
    }

    private addCustomization(commentedNode: ts.Node, value: ts.Node, name: string, code: string, condition: BuildCondition): void
    {
        const usedBaseConfig = [...this.baseConfigNames].find((baseName) => containsIdentifier(value, baseName));
        if (usedBaseConfig)
        {
            this.analysis.unsupported.push(`\`${name}\` uses ${usedBaseConfig}`);
            return;
        }

        const comments = (ts.getLeadingCommentRanges(this.sourceFile.text, commentedNode.getFullStart()) ?? [])
            .map((range) => this.sourceFile.text.slice(range.pos, range.end));
        this.analysis.customizations.push({
            name: name,
            code: code,
            comments: comments,
            sourceIndent: getLineIndent(this.sourceFile.text, commentedNode.getStart(this.sourceFile)),
            condition: condition,
            node: value
        });
    }

    /**
     * @returns the key of a `key: value` or `key` property, undefined (and the property reported) for spreads, methods and computed keys
     */
    private getKey(property: ts.ObjectLiteralElementLike, prefix: string): string | undefined
    {
        if ((ts.isPropertyAssignment(property) || ts.isShorthandPropertyAssignment(property))
            && (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name) || ts.isNumericLiteral(property.name)))
        {
            return property.name.text;
        }

        this.analysis.unsupported.push(`\`${prefix}${this.firstLine(property)}\` cannot be moved automatically`);
        return undefined;
    }

    private firstLine(node: ts.Node): string
    {
        const text = node.getText(this.sourceFile);
        const newLineIndex = text.indexOf('\n');
        return newLineIndex < 0 ? text : `${text.slice(0, newLineIndex).trimEnd()} ...`;
    }
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function findSyntaxError(file: string, sourceText: string): string | undefined
{
    const { diagnostics } = ts.transpileModule(sourceText, {
        fileName: file,
        reportDiagnostics: true,
        compilerOptions: { allowJs: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ESNext }
    });
    const error = diagnostics?.find((diagnostic) => diagnostic.file != null && diagnostic.category === ts.DiagnosticCategory.Error);
    return error ? ts.flattenDiagnosticMessageText(error.messageText, ' ') : undefined;
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function isModuleExportsAssignment(statement: ts.Statement): statement is ts.ExpressionStatement
{
    if (!ts.isExpressionStatement(statement) || !ts.isBinaryExpression(statement.expression)
        || statement.expression.operatorToken.kind !== ts.SyntaxKind.EqualsToken)
    {
        return false;
    }

    const left = statement.expression.left;
    return ts.isPropertyAccessExpression(left) && ts.isIdentifier(left.expression) && left.expression.text === 'module' && left.name.text === 'exports';
}

/**
 * @returns the module of `const x = require('module')` or `const x = require('module').a.b`, undefined for any other statement
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function getRequiredModule(statement: ts.Statement): string | undefined
{
    if (!ts.isVariableStatement(statement) || statement.declarationList.declarations.length !== 1)
    {
        return undefined;
    }

    let initializer = statement.declarationList.declarations[0].initializer;
    while (initializer != null && ts.isPropertyAccessExpression(initializer))
    {
        initializer = initializer.expression;
    }

    if (initializer != null && ts.isCallExpression(initializer) && ts.isIdentifier(initializer.expression) && initializer.expression.text === 'require'
        && initializer.arguments.length === 1 && ts.isStringLiteral(initializer.arguments[0]))
    {
        return initializer.arguments[0].text;
    }

    return undefined;
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function getDeclaredNames(statement: ts.Statement): string[]
{
    if (ts.isVariableStatement(statement))
    {
        const names = new Set<string>();
        statement.declarationList.declarations.forEach((declaration) => collectIdentifiers(declaration.name, names));
        return [...names];
    }

    if ((ts.isFunctionDeclaration(statement) || ts.isClassDeclaration(statement)) && statement.name)
    {
        return [statement.name.text];
    }

    return [];
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function getPropertyValue(property: ts.PropertyAssignment | ts.ShorthandPropertyAssignment): ts.Expression
{
    return ts.isPropertyAssignment(property) ? property.initializer : property.name;
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function isStringLiteralWithText(node: ts.Expression, text: string): boolean
{
    return (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && node.text === text;
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function collectIdentifiers(node: ts.Node, names: Set<string>): void
{
    if (ts.isIdentifier(node))
    {
        names.add(node.text);
    }
    ts.forEachChild(node, (child) => collectIdentifiers(child, names));
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function containsIdentifier(node: ts.Node, name: string): boolean
{
    const names = new Set<string>();
    collectIdentifiers(node, names);
    return names.has(name);
}

/**
 * `.key`, or `['key']` when the key is not a valid identifier.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function toPropertyAccess(key: string): string
{
    return /^[A-Za-z_$][\w$]*$/.test(key) ? `.${key}` : `[${JSON.stringify(key)}]`;
}

/**
 * Code without spaces and with single quotes, to compare it with what the schematics generated whatever the formatting.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function normalizeCode(code: string): string
{
    return code
        .replace(/\s+/g, '')
        .replace(/"/g, '\'')
        .replace(/,(?=[}\])])/g, '')
        .replace(/;$/, '');
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function getLineIndent(text: string, position: number): string
{
    const lineStart = text.lastIndexOf('\n', position - 1) + 1;
    return /^[ \t]*/.exec(text.slice(lineStart))?.[0] ?? '';
}

/**
 * Move the lines of copied code from their indentation in the legacy file to their indentation in webpack.config.cjs.
 * The first line is written after the new indentation. Code with template literals is left unchanged (their text includes the spaces).
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function reindent(code: string, sourceIndent: string, targetIndent: string): string
{
    if (code.includes('`') || sourceIndent === targetIndent)
    {
        return code;
    }

    return code
        .split('\n')
        .map((line, index) => index > 0 && line.startsWith(sourceIndent) ? `${targetIndent}${line.slice(sourceIndent.length)}` : line)
        .join('\n');
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function formatNames(customizations: Customization[]): string
{
    return customizations.map((customization) => `\`${customization.name}\``).join(', ');
}
