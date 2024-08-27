/* eslint-disable camelcase */
/* eslint-disable dot-notation */
// const fs = require('fs-extra');
import fs from 'fs-extra';
import { JSDOM } from 'jsdom';

// create object to store metadatas
const globalThisAny = globalThis as any;
globalThisAny.intuiface_ifd_name = '<%= IAName %>';
globalThisAny.intuiface_ifd_classes = [];
globalThisAny.intuiface_ifd_properties = {};
globalThisAny.intuiface_ifd_actions = {};
globalThisAny.intuiface_ifd_params = {};
globalThisAny.intuiface_ifd_triggers = {};

// Initialize dom feature
globalThisAny.window = new JSDOM('', {url: 'https://web.intuiface.com/'}).window;
// Inject everything from `window` into global scope
for (const key in globalThisAny.window) {
    if (Object.prototype.hasOwnProperty.call(globalThisAny.window, key) && globalThisAny[key] === undefined) {
        globalThisAny[key] = globalThisAny.window[key];
    }
}

/**
 * import the IA
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
async function loadIA()
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const ia = await import('./<%= IAName %>.js');

    const schemas: any = {};
    const resources: any = {};
    for (const name of globalThisAny.intuiface_ifd_classes)
    {
        schemas[name] =  {
            id: name,
            type: 'object',
            description: name,
            properties: globalThisAny.intuiface_ifd_properties[name]
        };

        resources[name] = {
            id: name,
            methods: globalThisAny.intuiface_ifd_actions[name],
            events: globalThisAny.intuiface_ifd_triggers[name]
        };
    }

    // set interface asset to import in composer
    resources['<%= IAName %>']['if.interfaceAsset'] = true;
    resources['<%= IAName %>']['title'] = globalThisAny.iaTitle;
    resources['<%= IAName %>']['description'] = globalThisAny.iaDescription;

    // create the ifd as json object
    // and add metadatas filled from decorators
    globalThisAny.intuiface_ifd_file = {
        'version': `v1.0.${Date.now()}`,
        'name': '<%= IAName %>',
        'title': globalThisAny.iaTitle,
        'if.category': globalThisAny.iaCategory,
        'protocol': 'ts',
        'basePath': '<%= IAName %>',
        'if.dependencies': [
            '<%= IAName %>.js',
            '<%= IAName %>.module.js'
        ],
        'schemas': schemas,
        'resources': resources
    };


    // write the ifd file
    fs.outputFile('dist/<%= IAName %>.ifd', JSON.stringify(globalThisAny.intuiface_ifd_file), 'utf8', (err: any) => {
        if (err) {
            console.log('An error occured while writing JSON Object to File.');
            return console.log(err);
        }

        console.log('IFD file has been saved.');
    });
}

void loadIA();
