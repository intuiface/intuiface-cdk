<p align="center">
  <a href="https://www.intuiface.com//">
    <img src="https://assets-global.website-files.com/6090f790a8effe00c12b39d0/6090f790a8effef0002b3c56_Intuiface%20logo%20animated.gif" alt="Intuiface logo" width="200" height="86">
  </a>
</p>

# Interface Asset Schematics 
Allows you to create an interface asset, build it and generate an IFD to get ready to use it in Composer

## Table of contents

- [Install](#install)
- [Prerequisite](#prerequisite)
- [Usage](#usage)
- [Help](#help)

## Install
Install the interface asset schematics : 
    `npm install @intuiface/interface-asset`
    
## Prerequisite
Install `@angular-devkit/schematics-cli` with `npm install -g @angular-devkit/schematics-cli`

## Usage
Use it with : `schematics @intuiface/interface-asset:create`
    it will prompt you about the interface-asset name and create all files

After installation done, please restart VSCode if you want the code analyzer running.

Develop your interface asset using the squeleton or read the documentation of [@intuiface/core](https://github.com/intuiface/intuiface-cdk/blob/master/libs/core/README.md)

Then run `npm run build` to build in production or `npm run build:debug` to be able to debug your interface asset.

## Help

Found a problem, a bug ? Or need some help ? 
Please do not create an issue in Github, ask us on our support page : https://support.intuiface.com/