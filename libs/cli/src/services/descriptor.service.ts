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

/** Globals the member decorators fill: the members of each class, under the name of the class that declares them. */
const MEMBER_REGISTRIES = ['intuiface_ifd_properties', 'intuiface_ifd_actions', 'intuiface_ifd_triggers'] as const;

type MemberRegistry = Record<string, Record<string, unknown> | undefined>;

/**
 * Add to each element (`@Asset`, `@Collection`) the properties, actions and triggers declared by its parent classes,
 * which the Player gives it too: `@Property`, `@Action` and `@Trigger` file a member under the class that declares it,
 * and the descriptor of an element only listed the members of its own class.
 *
 * A member declared by the class wins over a member of the same name in a parent class, and a parent over a farther
 * one. The own members come first, then those of each parent, nearest first.
 *
 * Needs the classes @intuiface/core records in `intuiface_ifd_element_classes` (from the version released with this
 * CLI): with an older core, nothing changes.
 * Behaviors (`behaviors` of `@Asset`) are not exposed in the CDK: their members are not added.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function addInheritedMembers(): void
{
    const globalThisAny = globalThis as any;
    const elementClasses: Record<string, unknown> = globalThisAny.intuiface_ifd_element_classes ?? {};

    for (const registryName of MEMBER_REGISTRIES)
    {
        const registry: MemberRegistry = globalThisAny[registryName] ?? {};
        // Computed for every element before any is replaced: a parent class may itself be an element
        const resolved = Object.entries(elementClasses)
            .filter((entry): entry is [string, Function] => typeof entry[1] === 'function')
            .map(([name, ctor]) => [name, collectMembers(registry, ctor, name)] as const);
        for (const [name, members] of resolved)
        {
            registry[name] = members;
        }
        globalThisAny[registryName] = registry;
    }
}

/**
 * @param registry members of each class, by class name
 * @param ctor class to collect the members of
 * @param elementName name the element is registered with (`options.name` of `@Asset`), which should be the class name
 * @returns the members of the class, then those of its parents not declared by the class
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function collectMembers(registry: MemberRegistry, ctor: Function, elementName?: string): Record<string, unknown>
{
    const members: Record<string, unknown> = {};
    const names = elementName != null && elementName !== ctor.name ? [elementName, ctor.name] : [ctor.name];

    let current: unknown = ctor;
    while (typeof current === 'function' && current !== Function.prototype)
    {
        for (const name of current === ctor ? names : [current.name])
        {
            for (const [key, member] of Object.entries(registry[name] ?? {}))
            {
                if (!Object.prototype.hasOwnProperty.call(members, key))
                {
                    members[key] = member;
                }
            }
        }
        current = Object.getPrototypeOf(current);
    }

    return members;
}

/**
 * Describe the classes the properties use as `type` (`extends: { $ref }`) or `itemType` (`items: { $ref }`), when they
 * extend `Watchable`, with or without `@Asset`: a schema and a resource named after the class, with its properties,
 * actions and triggers and those of its parent classes. They are the entries `@Asset` gives a class, which was needed
 * before for the class to be described: the Player itself only needs the class to extend `Watchable`.
 *
 * The classes are followed from the classes already described (`intuiface_ifd_classes`, with their inherited
 * members: call {@link addInheritedMembers} first) to the classes their properties reference, and so on. A class is
 * described once; a class with `@Asset` is already described, and unchanged. A class no described class references is not.
 *
 * Needs the classes @intuiface/core records in `intuiface_ifd_referenced_classes` (from the version released with this
 * CLI): with an older core, nothing changes.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function addReferencedClasses(): void
{
    const globalThisAny = globalThis as any;
    const referencedClasses: Record<string, unknown> = globalThisAny.intuiface_ifd_referenced_classes ?? {};
    const classNames: string[] | undefined = globalThisAny.intuiface_ifd_classes;
    if (classNames == null)
    {
        return;
    }

    const described = new Set(classNames);
    const toFollow = [...classNames];
    for (let className = toFollow.shift(); className != null; className = toFollow.shift())
    {
        const properties: Record<string, unknown> = globalThisAny.intuiface_ifd_properties?.[className] ?? {};
        for (const referencedName of Object.values(properties).flatMap(getReferencedClassNames))
        {
            const ctor = referencedClasses[referencedName];
            if (typeof ctor !== 'function' || described.has(referencedName))
            {
                continue;
            }

            for (const registryName of MEMBER_REGISTRIES)
            {
                const registry: MemberRegistry = globalThisAny[registryName] ?? {};
                registry[referencedName] = collectMembers(registry, ctor);
                globalThisAny[registryName] = registry;
            }
            described.add(referencedName);
            classNames.push(referencedName);
            toFollow.push(referencedName);
        }
    }
}

/**
 * @returns the names of the classes a property of the descriptor references: `extends: { $ref }` (`type`) and
 * `items: { $ref }` (`itemType`)
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function getReferencedClassNames(property: unknown): string[]
{
    const fields = property as { extends?: { $ref?: unknown }; items?: { $ref?: unknown } } | undefined;
    return [fields?.extends?.$ref, fields?.items?.$ref].filter((name): name is string => typeof name === 'string' && name !== '');
}

/**
 * Take the title, description and category of the descriptor from the class of the item, as `@Asset` (or `@Collection`)
 * declares them. `@Asset` also sets them on globals, where the last decorator to run wins: a class with `@Asset`
 * declared after the interface asset, in the same file, replaced its title and category.
 *
 * Needs the details @intuiface/core records in `intuiface_ifd_element_details` (from the version released with this
 * CLI): with an older core, the globals are kept.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function useItemClassDetails(): void
{
    const globalThisAny = globalThis as any;
    const itemClassName = getItemClassName(globalThisAny.intuiface_ifd_classes ?? []);
    const details = itemClassName != null ? globalThisAny.intuiface_ifd_element_details?.[itemClassName] : undefined;
    if (details == null)
    {
        return;
    }

    globalThisAny.iaTitle = details.displayName;
    globalThisAny.iaDescription = details.description;
    globalThisAny.iaCategory = details.category;
}

/**
 * @returns the class of the item, marked `if.interfaceAsset` in the descriptor: the class named after the item, or else
 * the first described class
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function getItemClassName(classNames: string[]): string | undefined
{
    const itemName = (globalThis as any).intuiface_ifd_name;
    return classNames.includes(itemName) ? itemName : classNames[0];
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

    const primaryResourceName = getItemClassName(classNames);
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
    resources: Record<string, any>
): Record<string, unknown>
{
    const globalThisAny = globalThis as any;
    // Binding converters declare their category in `@Converter({ category })`; package.json `intuiface.category`
    // (written by the 2.x schematic, kept by `migrate`) is only a fallback for converters declared without one.
    const category = buildType === 'binding-converter'
        ? globalThisAny.iaCategory ?? getWorkspaceCategory()
        : globalThisAny.iaCategory;

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
