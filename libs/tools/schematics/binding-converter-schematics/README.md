<p align="center">
  <a href="https://www.intuiface.com//">
    <img src="https://assets-global.website-files.com/6090f790a8effe00c12b39d0/6090f790a8effef0002b3c56_Intuiface%20logo%20animated.gif" alt="Intuiface logo" width="200" height="86">
  </a>
</p>

# Binding Converter Schematics
This package is deprecated. Please use the CLI workflow (`@intuiface/cli`) for new projects.

This article explains the deprecation status and points to the CLI replacement for creating and building binding converters.

## Table of contents

- [Prerequisites](#prerequisites)
- [CLI replacement](#cli-replacement)
- [Legacy usage (deprecated)](#legacy-usage-deprecated)
- [Help](#help)

## Prerequisites

- [NodeJS](https://nodejs.org/) so you can use NPM to manage your project's dependencies
- [Visual Studio Code](https://code.visualstudio.com/) to code, build, and test your project

## CLI replacement

Use `intuiface-cli` to initialize and manage a workspace:

```bash
mkdir my-intuiface-workspace
cd my-intuiface-workspace
npx intuiface-cli init -n my-intuiface-workspace
npx intuiface-cli add binding-converter -n MyBindingConverter -c Custom
npx intuiface-cli build --all
```

CLI documentation: [/libs/cli/README.md](/libs/cli/README.md)

## Legacy usage (deprecated)

If you still maintain existing schematics-based projects, the old flow remains:

```
npm install @intuiface/binding-converter
schematics @intuiface/binding-converter:create
```
It prompts for the binding converter name and category, then creates files.

Please use only alphanumeric characters in the name of your binding converter (no "-", no special characters, etc). The schematics will accept it but may fail when you try to build your project.

After installation is complete, restart VSCode if you want the code analyzer running. You can use the command `npm run lint` if you want to run the code analyzer manually.

You can modify the name of the converter function,
**⚠️ Be careful when changing the name. Within an Intuiface experience, each binding converter must have a unique name**

Develop your binding converter using the generated skeleton or read the documentation for [Intuiface Core](/docs/core/README.md), especially the [`@Converter`](/docs/core/functions/Converter.md) and [`@Parameter`](/docs/core/functions/Parameter.md) decorators.

Then run `npm run build` to build for production or `npm run build:debug` to debug your binding converter.

## Migrate project (<2.x) to use `intuiface-cli`
Intuiface CDK v2.0.0 introduced [`intuiface-cli`](/libs/cli/README.md) to handle workspace initialization, item creation, and descriptor generation. You can migrate old projects with:

```bash
npx intuiface-cli migrate
```

## Help

Found a problem, a bug? Or need some help?
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/
