# WORK IN PROGESS : NOT AVAILABLE RIGHT NOW

<p align="center">
  <a href="https://www.intuiface.com//">
    <img src="https://assets-global.website-files.com/6090f790a8effe00c12b39d0/6090f790a8effef0002b3c56_Intuiface%20logo%20animated.gif" alt="Intuiface logo" width="200" height="86">
  </a>
</p>

# Custom Asset Schematics

Allows you to create an asset or a collection, build it and get ready to use it in Composer

## Install
Install the custom asset schematics : `npm install @intuiface/custom-asset`
    
## Prerequisite
Install `@angular-devkit/schematics-cli` with `npm install -g @angular-devkit/schematics-cli`

## Usage

Use it with : `schematics @intuiface/custom-asset:create`
    it will prompt you about the custom asset name, if it's a collection and create all files

Develop your asset / collection using the skeleton or read the documentation of `@intuiface/core` and `@intuiface/components`

Then run `npm run build`