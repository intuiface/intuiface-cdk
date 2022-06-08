# Interface Asset Schematics 
Allows you to create an interface asset, build it and generate an IFD to get ready to use it in Composer

## Table of contents

- [Install](#install)
- [Prerequisite](#prerequisite)
- [Usage](#usage)
- [Development](#development)

## Install
Install the interface asset schematics : 
    `npm install @intuiface/interface-asset`
    
## Prerequisite
Install `@angular-devkit/schematics-cli` with `npm install -g @angular-devkit/schematics-cli`

## Usage
Use it with : `schematics @intuiface/interface-asset:create`
    it will prompt you about the interface-asset name and create all files

Develop your interface asset using the squeleton or read the documentation of `@intuiface/core`

Then run `npm run build` to build in production or `npm run build:debug` to be able to debug your interface asset.

## Development

About decorators or types please read the [Intuiface Core Documentation](../../../core/README.md)