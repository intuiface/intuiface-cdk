import fs from 'fs-extra';
import path from 'path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import { cliRoot } from '../helpers/test-utils.js';

/** Modules a source file imports statically (`import ... from`, `export ... from`). */
const getStaticImports = (relativePath: string): string[] =>
{
    const filePath = path.join(cliRoot, 'src', relativePath);
    const sourceFile = ts.createSourceFile(filePath, fs.readFileSync(filePath, 'utf8'), ts.ScriptTarget.Latest);
    return sourceFile.statements
        .filter((statement): statement is ts.ImportDeclaration | ts.ExportDeclaration =>
            ts.isImportDeclaration(statement) || ts.isExportDeclaration(statement))
        .map((statement) => statement.moduleSpecifier)
        .filter((specifier): specifier is ts.StringLiteral => specifier != null && ts.isStringLiteral(specifier))
        .map((specifier) => specifier.text);
};

describe('cli.ts (entry point)', () =>
{
    it('loads nothing but the minimum Node.js version before checking it (review R10)', () =>
    {
        expect(getStaticImports('cli.ts')).toEqual(['./utils/node-version.js']);
        expect(getStaticImports(path.join('utils', 'node-version.ts'))).toEqual([]);
    });

    it('loads the CLI dynamically', () =>
    {
        expect(fs.readFileSync(path.join(cliRoot, 'src', 'cli.ts'), 'utf8')).toContain(`import('./main.js')`);
    });
});
