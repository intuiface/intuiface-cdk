import { isPlainObject } from './merge.js';

/**
 * package.json sections where a workspace dependency can be declared.
 */
export type DependencySection = 'dependencies' | 'devDependencies';

const DEPENDENCY_SECTIONS: readonly DependencySection[] = ['dependencies', 'devDependencies'];

/**
 * A dependency added to a package.json or raised to a workspace version.
 */
export interface DependencyUpdate
{
    name: string;
    /** Previous version range, undefined when the dependency was added. */
    from?: string;
    to: string;
}

interface MinimumVersion
{
    numbers: [number, number, number];
    isPrerelease: boolean;
}

/**
 * A simple npm range: an optional `^`, `~`, `>=` or `=`, then `1`, `1.2`, `1.2.3`, `1.2.x` or `1.2.3-beta.1`.
 */
const SIMPLE_RANGE = /^(?:\^|~|>=|=)?\s*v?(\d+)(?:\.(\d+|[xX*]))?(?:\.(\d+|[xX*]))?(-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

/**
 * Lowest version accepted by a simple npm range (`^5.8.0` → 5.8.0, `~4.9` → 4.9.0, `6.x` → 6.0.0).
 * @returns undefined for a range this check does not understand (`*`, `latest`, `>=1 <3`, `a || b`, a git or file URL...)
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function getMinimumVersion(range: string): MinimumVersion | undefined
{
    const match = SIMPLE_RANGE.exec(range.trim());
    if (!match)
    {
        return undefined;
    }

    const toNumber = (value: string | undefined): number => value != null && /^\d+$/.test(value) ? Number(value) : 0;
    return {
        numbers: [Number(match[1]), toNumber(match[2]), toNumber(match[3])],
        isPrerelease: match[4] != null
    };
}

/**
 * Tell whether a version range accepts lower versions than the required one (`~5.4.0` is lower than `6.0.3`).
 * Ranges that cannot be compared (`latest`, a git URL...) are never lower: they are left to the developer.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function isLowerVersionRange(range: string, requiredRange: string): boolean
{
    const current = getMinimumVersion(range);
    const required = getMinimumVersion(requiredRange);
    if (!current || !required)
    {
        return false;
    }

    for (let index = 0; index < current.numbers.length; index++)
    {
        if (current.numbers[index] !== required.numbers[index])
        {
            return current.numbers[index] < required.numbers[index];
        }
    }

    // 6.0.3-beta.1 comes before 6.0.3
    return current.isPrerelease && !required.isPrerelease;
}

/**
 * Make a package.json declare at least the required versions, without downgrading anything:
 * - a missing dependency is added to `section`,
 * - a lower version is raised, where the dependency is declared (dependencies or devDependencies),
 * - an equal, newer or unrecognized version (`latest`, a git URL...) is kept.
 * @param packageJson parsed package.json, modified in place
 * @param section section of the missing dependencies
 * @param requiredVersions minimum version range of each dependency
 * @returns the dependencies added or raised
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function ensureMinimumDependencies(
    packageJson: Record<string, unknown>,
    section: DependencySection,
    requiredVersions: Readonly<Record<string, string>>
): DependencyUpdate[]
{
    const updates: DependencyUpdate[] = [];

    for (const [name, requiredVersion] of Object.entries(requiredVersions))
    {
        const declaredSection = DEPENDENCY_SECTIONS.find((candidate) => typeof getDependencies(packageJson, candidate)?.[name] === 'string') ?? section;
        const dependencies = getDependencies(packageJson, declaredSection) ?? {};
        const currentVersion = dependencies[name];

        if (typeof currentVersion === 'string' && !isLowerVersionRange(currentVersion, requiredVersion))
        {
            continue;
        }

        dependencies[name] = requiredVersion;
        packageJson[declaredSection] = dependencies;
        updates.push({
            name: name,
            from: typeof currentVersion === 'string' ? currentVersion : undefined,
            to: requiredVersion
        });
    }

    return updates;
}

/**
 * Describe dependency updates for the console, e.g. `typescript ~5.4.0 → 6.0.3, webpack-cli (added)`.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function formatDependencyUpdates(updates: readonly DependencyUpdate[]): string
{
    return updates
        .map((update) => update.from == null ? `${update.name} ${update.to} (added)` : `${update.name} ${update.from} → ${update.to}`)
        .join(', ');
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function getDependencies(packageJson: Record<string, unknown>, section: DependencySection): Record<string, unknown> | undefined
{
    const dependencies = packageJson[section];
    return isPlainObject(dependencies) ? dependencies : undefined;
}
