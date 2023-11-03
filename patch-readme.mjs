import fs from 'fs';
import path from 'path';

const patchFile = (filePath) => {
    const content = fs.readFileSync(filePath, 'utf8');

    let newContent = content;
    // Insert header for main readme files
    if(filePath.endsWith('README.md'))
    {
        newContent = `<p align="center">
    <a href="https://www.intuiface.com">
        <img src="https://assets-global.website-files.com/6090f790a8effe00c12b39d0/6090f790a8effef0002b3c56_Intuiface%20logo%20animated.gif" alt="Intuiface logo" width="200" height="86">
    </a>
</p>

${newContent}`;
    }

    // Removes returns part of decorator that are detected as functions
    newContent = newContent.replaceAll(/#### returns\n\n`fn`[\w\W\s]+?##### Returns\n\n`(void|any)`/gmi, '');

    // Insert help footer
    newContent += `\n\n## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/`

    fs.writeFileSync(filePath, newContent);

    return content !== newContent;
};

const processDirectory = (dirPath) => {
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
        const filePath = path.join(dirPath, file);

        if (fs.statSync(filePath).isDirectory()) {
            // Recurse into subdirectories
            processDirectory(filePath);
        } else if (filePath.endsWith('.md')) {
            // Process .md files
            const patched = patchFile(filePath);
            if (patched) {
                console.log(`\x1b[32m✔\x1b[0m Patched file ${filePath}`);
            }
        }
    }
};

const args = process.argv.slice(2);
if (args.length !== 1) {
    console.error('Usage: node patch-readme.mjs <directory-path>');
    process.exit(1);
}

const directoryPath = args[0];

if (!fs.existsSync(directoryPath)) {
    console.error('Directory not found.');
    process.exit(1);
}

console.log('\nPatching documentation files...');
processDirectory(directoryPath);
