<p align="center">
  <a href="https://www.intuiface.com//">
    <img src="https://assets-global.website-files.com/6090f790a8effe00c12b39d0/6090f790a8effef0002b3c56_Intuiface%20logo%20animated.gif" alt="Intuiface logo" width="200" height="86">
  </a>
</p>

# Intuiface CDK

This CDK enables you to create TypeScript-based interface assets and binding converters for Intuiface experiences. For more about Intuiface, visit https://www.intuiface.com/

## Table of contents

- [Prerequisites](#prerequisites)
- [Documentation](#documentation)
- [For CDK developers](#for-cdk-developers)
- [Help](#help)

## Prerequisites

To develop your own interface assets or binding converters, please make sure you have installed:
- [NodeJS](https://nodejs.org/) so you can use npm to manage your project dependencies. We recommend version 22 LTS.
- [Visual Studio Code](https://code.visualstudio.com/) to code, build, and test your project.

## Documentation

### Initialize a workspace

Create and enter a new folder:

```bash
mkdir my-intuiface-workspace
cd my-intuiface-workspace
```
Install [`intuiface-cli`](./libs/cli/README.md):

```bash
npm install @intuiface/cli
```

Run interactive initialization:

```bash
npx intuiface-cli init
```

The CLI will prompt for:
- workspace name,
- first item type,
- first item name,
- category,
- icon (optional)

### Add new items

The interactive `init` flow creates the first item for you.

Then you can add other interface assets or binding converters in your workspace:

```bash
npx intuiface-cli add interface-asset -n MyInterfaceAsset -c Custom
npx intuiface-cli add binding-converter -n MyBindingConverter -c Custom
```

Build everything in the workspace:

```bash
npx intuiface-cli build --all
```

or a single item:

```bash
npx intuiface-cli build -n MyInterfaceAsset
```

### Existing projects

A project created with the schematics or with an older CDK can be turned into a workspace with `npx intuiface-cli migrate`: see [Migrate an existing project](./libs/cli/README.md#migrate-an-existing-project).

### Additional references

- More information about specific development syntax, API/decorator reference: [Intuiface Core](./libs/core/README.md)
- Main CLI workflow and commands: [intuiface-cli](./libs/cli/README.md)
- Legacy schematics (deprecated):
  - [Interface Asset Schematics](./libs/tools/schematics/interface-asset-schematics/README.md)
  - [Binding Converter Schematics](./libs/tools/schematics/binding-converter-schematics/README.md)

## For CDK developers 

Internal developers only: 
- [Download the latest release](https://github.com/intuiface/intuiface-cdk/releases/latest)
- Clone the repo: `git clone https://github.com/intuiface/intuiface-cdk.git`
- Install with [npm](https://www.npmjs.com/): `npm install @intuiface/intuiface-cdk`

Install dependencies:

```bash
npm ci
```
To build the CDK, just run:

```bash
npm run build
```

To test the CLI:

```bash
# unit tests (TypeScript sources, a few seconds)
npm test
# end-to-end tests: build core and cli, then run init/add/build/migrate in workspaces under tmp/cli-e2e (a few minutes)
npm run test:e2e
```

## Help

Found a problem, a bug? Or need some help? 
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/
