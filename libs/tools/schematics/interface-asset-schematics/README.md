<p align="center">
  <a href="https://www.intuiface.com//">
    <img src="https://assets-global.website-files.com/6090f790a8effe00c12b39d0/6090f790a8effef0002b3c56_Intuiface%20logo%20animated.gif" alt="Intuiface logo" width="200" height="86">
  </a>
</p>

# Interface Asset Schematics 
This article describes how to design an interface asset, build it, and generate an IFD for use in Intuiface Composer

## Table of contents

- [Prerequisites](#prerequisites)
- [Install](#install)
- [Usage](#usage)
- [Help](#help)

## Prerequisites

- [NodeJS](https://nodejs.org/) so you can use NPM to manage your project’s dependencies
- [Visual Studio Code](https://code.visualstudio.com/) to code, build, and test your project
- [Angular Schematics CLI](https://www.npmjs.com/package/@angular-devkit/schematics-cli). Install it using NPM:  
`npm install -g @angular-devkit/schematics-cli`

## Install
Install the interface asset schematics: 
    `npm install @intuiface/interface-asset`

## Usage
First, inside a new folder, install the `interface-asset` schematics:
```
npm install @intuiface/interface-asset
```

Then initialize your interface asset workspace by using the schematics:  
```
schematics @intuiface/interface-asset:create
``` 
It will prompt you for the interface-asset name and then will create all files.

⚠️ Please use only alphanumeric characters in the name of your interface-asset (no "-", no special characters, etc). The schematics will accept it but may fail when you try to build your project.

After installation is complete, restart VSCode if you want the code analyzer running. You can use the command `npm run lint` if you want to run the code analyzer manually. We provide automatic linting (code analyzing) in VSCode through the `settings.json` file in the `.vscode` folder.

Develop your interface asset using the skeleton or read the documentation for [Intuiface Core](/docs/core/README.md)

Then run `npm run build` to build for production or `npm run build:debug` to debug your interface asset. You can use the [Command Line](/libs/cli/README.md).

## Migrate project (<2.x) to use `intuiface-cli`
Intuiface CDK v2.0.0 introduce a new command line tool [`intuiface-cli`](/libs/cli/README.md) to better handle building interface asset and generating descriptor file. You can migrate your old project to use the new CLI by following the [migration guide](/libs/cli/README.md#migration-to-v2)

## Help

Found a problem, a bug? Or need some help? 
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/