import fs from 'fs';

/**
 * Updates a value at the given JSONPath in a JSON file.
 * Supports paths like "$.version" or "$.dependencies['@intuiface/core']".
 */
const updateJson = (filePath, jsonPath, value) => {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const parts = jsonPath.replace(/^\$\./, '').split(/[.\[\]']+/).filter(Boolean);
    let obj = content;
    for (let i = 0; i < parts.length - 1; i++) {
        obj = obj[parts[i]];
    }
    obj[parts[parts.length - 1]] = value;
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n');
};

const args = process.argv.slice(2);
if (args.length !== 1) {
    console.error('Usage: node set-prerelease-version.mjs <pre-release-version>');
    process.exit(1);
}

const preReleaseVersion = args[0];

// Update root package.json version
updateJson('package.json', '$.version', preReleaseVersion);
console.log('Updated package.json $.version');

// Read release-please config and update all extra-files entries
const config = JSON.parse(fs.readFileSync('release-please-config.json', 'utf8'));
for (const entry of config.packages['.']['extra-files']) {
    const filePath = entry.path.replace(/^\//, '');
    updateJson(filePath, entry.jsonpath, preReleaseVersion);
    console.log(`Updated ${filePath} ${entry.jsonpath}`);
}
