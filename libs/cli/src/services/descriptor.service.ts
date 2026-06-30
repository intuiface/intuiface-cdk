import fs from 'fs-extra';
import path from 'path';
import { BuildType } from '../types.js';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function getWorkspaceCategory(): string | undefined
{
    const packageJsonPath = `${process.cwd()}/package.json`;
    if (!fs.existsSync(packageJsonPath))
    {
        return undefined;
    }

    const packageJson = fs.readJsonSync(packageJsonPath, { throws: false });
    const category = packageJson?.intuiface?.category;

    return typeof category === 'string' && category !== ''
        ? category
        : undefined;
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function buildSchemas(classNames: string[], buildType: BuildType): Record<string, unknown>
{
    const schemas: Record<string, unknown> = {};
    const globalThisAny = globalThis as any;

    for (const name of classNames)
    {
        const schema: Record<string, unknown> = {
            id: name,
            type: 'object',
            description: name
        };

        if (buildType === 'interface-asset')
        {
            schema.properties = globalThisAny.intuiface_ifd_properties[name];
        }

        schemas[name] = schema;
    }

    return schemas;
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function buildResources(classNames: string[], buildType: BuildType): Record<string, any>
{
    const resources: Record<string, any> = {};
    const globalThisAny = globalThis as any;

    for (const name of classNames)
    {
        const methods = globalThisAny.intuiface_ifd_actions[name] ?? {};
        if (buildType === 'binding-converter')
        {
            for (const methodName of Object.keys(methods))
            {
                methods[methodName].id = `${name}.${methodName}`;
            }
        }

        const resource: Record<string, unknown> = {
            id: name,
            methods: methods
        };

        if (buildType === 'interface-asset')
        {
            resource.events = globalThisAny.intuiface_ifd_triggers[name];
        }

        resources[name] = resource;
    }

    const primaryResourceName = resources[globalThisAny.intuiface_ifd_name]
        ? globalThisAny.intuiface_ifd_name
        : classNames[0];
    const primaryResource = primaryResourceName ? resources[primaryResourceName] : undefined;

    if (primaryResource)
    {
        primaryResource['if.interfaceAsset'] = true;
        if (buildType === 'interface-asset')
        {
            primaryResource.title = globalThisAny.iaTitle;
            primaryResource.description = globalThisAny.iaDescription;
        }
    }

    return resources;
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function buildIFDFile(
    iaName: string,
    buildType: BuildType,
    schemas: Record<string, unknown>,
    resources: Record<string, any>,
    categoryOverride?: string
): Record<string, unknown>
{
    const globalThisAny = globalThis as any;
    const category = categoryOverride ?? (buildType === 'binding-converter'
        ? getWorkspaceCategory() ?? globalThisAny.iaCategory
        : globalThisAny.iaCategory);

    return {
        'version': `v1.0.${Date.now()}`,
        'name': iaName,
        'title': globalThisAny.iaTitle,
        'if.category': category,
        'protocol': 'ts',
        'basePath': iaName,
        'if.dependencies': [
            `${iaName}.js`,
            `${iaName}.module.js`
        ],
        'schemas': schemas,
        'resources': resources
    };
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export async function writeIFDFile(iaName: string, outputDir: string, ifd: unknown, spinner: any): Promise<void>
{
    return new Promise((resolve, reject) =>
    {
        fs.outputFile(path.join(outputDir, `${iaName}.ifd`), JSON.stringify(ifd, null, 2), 'utf8', (err: unknown) =>
        {
            if (err)
            {
                spinner.fail(`An error occurred while writing JSON Object to File.\n${String(err)}`);
                reject(err);
                return;
            }

            spinner.succeed('Descriptor file (.ifd) has been saved.');
            resolve();
        });
    });
}
