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
- [Move an existing project to the CLI](#move-an-existing-project-to-the-cli)
- [Help](#help)

## Prerequisites

- [NodeJS](https://nodejs.org/) so you can use NPM to manage your project's dependencies
- [Visual Studio Code](https://code.visualstudio.com/) to code, build, and test your project

## CLI replacement

Create new projects with the Intuiface CLI (`@intuiface/cli`). In a terminal, run these commands one at a time:

```bash
mkdir my-intuiface-workspace
cd my-intuiface-workspace
npm install @intuiface/cli
npx intuiface-cli init
```

- `mkdir` and `cd` create an empty folder for your project and go into it.
- `npm install @intuiface/cli` installs the CLI in this folder. Do not skip it: `npx intuiface-cli` only works in a folder where the CLI is installed.
- `init` asks for a name for the workspace and for your first item: choose `binding-converter` (or `2`) as its type, then give its name, category and optional icon. It creates the files and installs what the project needs.

Write your binding converter in the `.ts` file `init` created, then build it with `npm run build`: the result goes to the `dist/` folder.

To create the workspace without questions (for example in a script), replace `npx intuiface-cli init` with:

```bash
npx intuiface-cli init -n my-intuiface-workspace
npm install
npx intuiface-cli add binding-converter -n MyBindingConverter -c Custom
npm run build
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

## Move an existing project to the CLI

A project created with these schematics can be turned into a CLI workspace: it keeps building as before, and you can add more binding converters or interface assets to it. Save a copy of the project (or commit it), then run in its folder:

```bash
npm install @intuiface/cli@latest
npx intuiface-cli migrate
npm install
npm run build
```

Your code stays where it is. For what `migrate` changes, see [Migrate an existing project](/libs/cli/README.md#migrate-an-existing-project).

## Help

Found a problem, a bug? Or need some help?
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/
