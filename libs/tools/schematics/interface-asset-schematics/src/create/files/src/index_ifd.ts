const fs = require('fs');

// create object to store metadatas
const globalThisAny = globalThis as any;
globalThisAny.intuiface_ifd_name = '<%= IAName %>';
globalThisAny.intuiface_ifd_properties = {};
globalThisAny.intuiface_ifd_actions = {};
globalThisAny.intuiface_ifd_params = {};
globalThisAny.intuiface_ifd_triggers = {};

// import the IA
import { <%= IAName %> } from './<%= IAName %>';
const ia = new <%= IAName %>();

// create the ifd as json object 
// and add metadatas filled from decorators
globalThisAny.intuiface_ifd_file = {
    name: '<%= IAName %>',
    protocol: 'ts',
    basePath: '<%= IAName %>',
    'if.dependencies': [
        '<%= IAName %>.js',
        '<%= IAName %>.module.js'
    ],
    schemas: {
        '<%= IAName %>': {
            id: '<%= IAName %>',
            type: 'object',
            description: '<%= IAName %>',
            properties: globalThisAny.intuiface_ifd_properties
        }
    },
    resources: {
        '<%= IAName %>': {
            id: '<%= IAName %>',
            "if.interfaceAsset": true,
            methods: globalThisAny.intuiface_ifd_actions
        }
    },
    events: globalThisAny.intuiface_ifd_triggers
};


// write the ifd file
fs.writeFile("dist/<%= IAName %>.ifd", JSON.stringify(globalThisAny.intuiface_ifd_file), 'utf8', (err: any) => {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }

    console.log("IFD file has been saved.");
});