import fs from 'fs';

const patchFile = (filePath, basePath) => {
    const content = fs.readFileSync(filePath, 'utf8');
    // regex to capture all files with () not starting with README.md and which is not already relative
    const regex = /\((?!README\.md)(?![.\/])[^\s)]+\.md\)/gmi;

    let newContent = content;
    newContent = newContent.replace(regex, (match) => {
        const filename = match.substring(1, match.length - 1); // Extract filename within parentheses
        return `(${basePath}${filename})`;
    });

    fs.writeFileSync(filePath, newContent);

    return content !== newContent;
};

const args = process.argv.slice(2);
if (args.length !== 2) {
    console.error('Usage: node fix-links-readme.mjs <file-path> <base-path>');
    process.exit(1);
}

const filePath = args[0];
const basePath = args[1];

if (!fs.existsSync(filePath)) {
    console.error('File not found.');
    process.exit(1);
}

console.log('\nPatching links in main README library entrypoint...');
const patched = patchFile(filePath, basePath);

if (patched) {
   console.log(`\x1b[32m✔\x1b[0m README.md patched`);
}
