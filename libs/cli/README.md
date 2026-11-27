# intuiface-cli

Intuiface CLI is the recommended workflow to create, manage, and build Intuiface interface assets and binding converters.

It can:
- initialize a workspace,
- add new workspace items,
- build one or all items,
- generate Intuiface Descriptor (`*.ifd`) files,
- migrate projects created with the schematics or an older CDK ([Migrate an existing project](#migrate-an-existing-project)).

## Quick Start

Create and enter a workspace folder:

```bash
mkdir my-intuiface-workspace
cd my-intuiface-workspace
```

Install the CLI in this folder:

```bash
npm install @intuiface/cli
```

Do not skip this step: `npx intuiface-cli` only works in a folder where `@intuiface/cli` is installed.

Initialize interactively:

```bash
npx intuiface-cli init
```

Or initialize non-interactively, then install the workspace dependencies:

```bash
npx intuiface-cli init -n my-intuiface-workspace
npm install
```

Add items:

```bash
npx intuiface-cli add interface-asset -n MyInterfaceAsset -c Custom -i icon.png
npx intuiface-cli add binding-converter -n MyBindingConverter -c Custom
```

Build all configured items:

```bash
npm run build
```

## What's in a workspace

After `init` and the two `add` commands above, the folder looks like this:

```text
my-intuiface-workspace/
├── intuiface.workspace.json       the list of your items (see below)
├── package.json                   the build, build:debug and lint scripts
├── webpack.config.cjs             optional build changes (see Customising webpack)
├── tsconfig.json, eslint.config.mjs, .nvmrc, .gitignore, .vscode/
├── src/
│   ├── interface-assets/
│   │   └── MyInterfaceAsset/
│   │       └── MyInterfaceAsset.ts           the code of your interface asset
│   └── binding-converters/
│       └── MyBindingConverter/
│           ├── MyBindingConverter.ts         the code of your binding converter
│           └── icon_converter_32.png
└── dist/                          created by the build
    ├── MyInterfaceAsset/
    └── MyBindingConverter/
```

You write your code in the `.ts` files of `src/`. The build puts each item in its own folder of `dist/`, with its descriptor (`.ifd`) file.

### The workspace file: `intuiface.workspace.json`

`init` creates this file and `add` adds each new item to it. `build` reads it to know what to build. You do not need to edit it, but you can, for example to change an icon.

```json
{
  "version": 1,
  "name": "my-intuiface-workspace",
  "items": [
    {
      "name": "MyBindingConverter",
      "type": "binding-converter",
      "entry": "src/binding-converters/MyBindingConverter/MyBindingConverter.ts",
      "icon": "src/binding-converters/MyBindingConverter/icon_converter_32.png"
    },
    {
      "name": "MyInterfaceAsset",
      "type": "interface-asset",
      "entry": "src/interface-assets/MyInterfaceAsset/MyInterfaceAsset.ts",
      "icon": "icon.png"
    }
  ]
}
```

| Field | What it is |
|---|---|
| `version` | Version of the file format. Always `1`: do not change it. |
| `name` | Name of the workspace, given to `init`. |
| `items` | One entry per interface asset or binding converter. |
| `items[].name` | Name of the item. Use it to build this item only (`build -n MyInterfaceAsset`). It is also the name of its folder in `dist/`. |
| `items[].type` | `interface-asset` or `binding-converter`. |
| `items[].entry` | The main `.ts` file of the item, relative to the workspace folder. |
| `items[].icon` | Optional. The image displayed for the item in Composer, relative to the workspace folder. |

Paths are relative to the workspace folder (the folder of `intuiface.workspace.json`) and use `/`.

Common changes:

- **Change or add an icon**: set `icon` to the path of the image. `build` stops with an error if there is no file at that path.
- **Remove an item**: delete its entry from `items`, then delete its folder in `src/` (and in `dist/`).
- **Change the category shown in Composer**: it is not in this file. Change `category` in the `@Asset` (interface asset) or `@Converter` (binding converter) part of the item's `.ts` file.

## Commands

### `init`
Initialize a CLI-managed workspace in the current folder.

Interactive:

```bash
npx intuiface-cli init
```

In a terminal, `init` asks for the workspace name and the first item (type, name, category and optional icon), creates it and runs `npm install`. An invalid answer is asked again, and the icon must be an existing file.

Non-interactive:

```bash
npx intuiface-cli init -n my-intuiface-workspace
```

When it is not run in a terminal (in a script or CI), `init` only writes the workspace files: it creates no item and does not run `npm install`. It ends by printing the next steps: `npm install`, `add` an item, then `npm run build`.

`init` can run in a folder that already has files (for example a cloned repository): it completes them instead of overwriting them.

- `package.json` keeps its values and scripts and gets the missing workspace ones. Dependencies are added, or raised when their version is lower than the workspace one, and never downgraded. If it already has a different `build` script, `init` keeps it and prints a warning.
- JSON files (`tsconfig.json`, `.vscode/settings.json`, `.vscode/extensions.json`) get the settings they do not have. Their own values win, and files with comments are left unchanged.
- `.gitignore` gets the entries it does not have.
- Other existing files (`eslint.config.mjs`, `webpack.config.cjs`, `.nvmrc`) are kept.

### `add`
Add items to the current workspace.

```bash
npx intuiface-cli add interface-asset -n MyInterfaceAsset -c Custom
npx intuiface-cli add binding-converter -n MyBindingConverter -c Custom
```

Tip: `init` includes an interactive first-item creation flow. For additional items, use explicit `add` commands as shown above.

You can also provide an icon for either item type, and it will be saved in the workspace config:

```bash
npx intuiface-cli add interface-asset -n MyInterfaceAsset -c Custom -i ./icons/asset.png
npx intuiface-cli add binding-converter -n MyBindingConverter -c Custom -i ./icons/converter.png
```

The icon path is relative to the workspace folder. `add` fails, and writes nothing, when there is no file at that path.

### `build`
Build a single item or all workspace items.

```bash
npx intuiface-cli build --all
npx intuiface-cli build --name MyInterfaceAsset
npx intuiface-cli build --name MyBindingConverter --type binding-converter
```

In a CLI-generated workspace, `npm run build` builds every item. To build a single item through the same script, pass its name after `--`:

```bash
npm run build -- -n MyInterfaceAsset
```

The script runs `build --all`, and `--name` takes priority over `--all`.

Options:

| Option | Description |
|---|---|
| `-n, --name <name>` | Name of the workspace item to build. Takes priority over `--all`. |
| `-a, --all` | Build all items from `intuiface.workspace.json`. |
| `-t, --type <type>` | **(deprecated)** Asset type. Ignored in workspace mode — the type is read from `intuiface.workspace.json`. Kept for retro-compatibility only. |
| `-i, --icon <icon>` | **(deprecated)** Relative path to an icon, for the item built with `--name`. Cannot be used to build every item. Prefer setting the icon in workspace config with `add` or `init`. |
| `-d, --debug` | Build in debug mode. |
| `-h, --help` | Show command help. |

`build` checks that the icons exist before compiling anything.

#### Debug builds

Use debug mode with flag `--debug` when you want unminified output and easier troubleshooting. Then in the Composer Play Mode, you can use key combination `Ctrl+Shift+I` to debug.

```bash
npx intuiface-cli build --all --debug
npx intuiface-cli build --name MyInterfaceAsset --debug
```

In a CLI-generated workspace, this is also available through:

```bash
npm run build:debug
npm run build:debug -- -n MyInterfaceAsset
```

If you still have older projects that expect an icon override during build, `--icon` remains available for retro-compatibility. New projects should rely on the workspace icon saved by `add` or `init`.

#### Customising webpack

In a workspace, `build` generates the webpack configuration of each item (entry, output in `dist/<name>`, TypeScript loader, Module Federation). To change it, edit `webpack.config.cjs`, created by `init` at the root of the workspace. Its function gets the generated configuration of each item and returns the configuration to build it with:

```js
module.exports = (config, { item, debug }) =>
{
    // Modules provided at runtime by the player (Node.js, Electron, BrightSign) must not be bundled
    config.externals = {
        'fs': 'commonjs fs',
        '@brightsign/deviceinfo': 'commonjs @brightsign/deviceinfo'
    };

    return config;
};
```

- `item` is the item being built, as declared in `intuiface.workspace.json` (`name`, `type`, `entry`): use it to change a single item.
- `debug` is `true` for a debug build (`--debug`, `npm run build:debug`).
- The function can also change `config` in place and return nothing, or be `async`.

To import Node.js modules (`fs`, `path`, ...) in TypeScript, the workspace `tsconfig.json` loads the Node.js types with `"types": ["node"]`: TypeScript 6 no longer loads the `@types` packages by default.

A workspace does not use `webpack.config.js` or `webpack-debug.config.js`: `build` warns when it finds one. `migrate` moves their changes to `webpack.config.cjs`.

### `migrate`
Turn an existing project, created with the schematics or with an older CDK, into a workspace. Run it in the project folder:

```bash
npx intuiface-cli migrate
```

See [Migrate an existing project](#migrate-an-existing-project) for the steps and what it changes.

## Migrate an existing project

Before the CLI workspaces, each project held a single interface asset or binding converter. `migrate` turns such a project into a workspace: you can then build it with the CLI, as before, and add more items to it.

It works with:

- a project created with the CDK 2.x schematics (`@intuiface/interface-asset` or `@intuiface/binding-converter`). Its `package.json` has a `build` script such as `npx intuiface-cli build -n MyInterfaceAsset`.
- a project created with the CDK 1.x. It has a `src/index_ifd.ts` file.

A project with an `intuiface.workspace.json` file is already a workspace: there is nothing to migrate.

### Steps

1. Save a copy of your project, or commit it if you use Git: `migrate` changes several files.
2. Open a terminal in the project folder.
3. CDK 1.x project only: update `@intuiface/core`, then check that the project still builds, and fix the breaking changes if it does not:
   ```bash
   npm install @intuiface/core@latest
   npm run build
   ```
4. Install the latest CLI. An older version already in the project does not know how to migrate it:
   ```bash
   npm install @intuiface/cli@latest
   ```
5. Migrate, install the updated dependencies, and build:
   ```bash
   npx intuiface-cli migrate
   npm install
   npm run build
   ```

Your project is now a workspace. Add items with [`add`](#add), and `npm run build` builds all of them.

### What `migrate` changes

- **`intuiface.workspace.json`** is created with your item and its icon, if it has one (see [The workspace file](#the-workspace-file-intuifaceworkspacejson)). Your code is not moved: the item's `entry` is its current file, for example `src/MyInterfaceAsset.ts`. Items you add later go to `src/interface-assets/` and `src/binding-converters/`.
- **`package.json`**: the `build` and `build:debug` scripts now build every item of the workspace. The build tools (`typescript`, `webpack`, `webpack-cli`, `ts-loader`), `@intuiface/cli` and `@intuiface/core` are raised to the versions the workspace needs. A newer version you already use is kept.
- **`tsconfig.json`** is updated for TypeScript 6, the version the CLI uses. For example, `"types": ["node"]` is added when the project uses the Node.js types (`@types/node`), as TypeScript 6 no longer loads them by default.
- **`webpack.config.js` and `webpack-debug.config.js`** are replaced with `webpack.config.cjs` (see [Customising webpack](#customising-webpack)):
  - What the schematics generated (entry, output, TypeScript loader, Module Federation) is dropped: the workspace generates it.
  - Every other change, such as `externals`, `target`, `resolve.fallback`, other plugins or loader rules, is copied with its comments into the function of `webpack.config.cjs`. The changes of `webpack-debug.config.js` only apply to debug builds (`if (debug)`).
  - The files are only read, never run. A file with a change that cannot be moved automatically (for example different `ModuleFederationPlugin` options, another `entry`, or a configuration exported as a function) is kept, and `migrate` lists what to move by hand. Delete it once done: until then, `build` warns that it is not used.
- **CDK 1.x projects only**: the files the 1.x build needed (`src/index_ifd.ts`, `src/index.js`, `tsconfig.ifd.json`) and the `dist/` folder are deleted.

### If `migrate` fails

`Could not detect project type for migration` means `migrate` did not recognise the project, usually because the `build` script of `package.json` was changed. Set it back to `npx intuiface-cli build -n MyInterfaceAsset` (with the name of your item, and `-t binding-converter` at the end for a binding converter), then run `migrate` again.

### Not ready to migrate?

A CDK 2.x project still builds without migrating, with `npm run build`. If `build` warns about TypeScript 6, it lists the changes to make in `tsconfig.json` to keep the project as it is, and the commands to migrate it instead.

## Help

```bash
npx intuiface-cli help
npx intuiface-cli help <command>
```
