# intuiface-cli

Intuiface CLI is the recommended workflow to create, manage, and build Intuiface interface assets and binding converters.

It can:
- initialize a workspace,
- add new workspace items,
- build one or all items,
- generate Intuiface Descriptor (`*.ifd`) files,
- migrate older (<2.x) projects.

## Quick Start

Create and enter a workspace folder:

```bash
mkdir my-intuiface-workspace
cd my-intuiface-workspace
```

Install [`intuiface-cli`](./libs/cli/README.md):

```bash
npm install @intuiface/cli
```

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
- Other existing files (`eslint.config.mjs`, `.nvmrc`) are kept.

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

### `migrate`
Migrate older projects to the CLI-based workflow.

```bash
npx intuiface-cli migrate
```

`migrate` raises the build dependencies (`typescript`, `webpack`, `webpack-cli`, `ts-loader`) and `@intuiface/cli`/`@intuiface/core` when their version is lower than the one the workspace needs. A newer version is kept.

#### Migration from v1.x
For existing project created before the v2.x of the `intuiface-cdk`, you can migrate your project using this recommended migration flow:

First, update `@intuiface/core` to use the latest version:
```bash
npm install @intuiface/core@latest
```
Then checks that your project still build or fix the breaking changes.

Now, you can migrate your project to use the new `intuiface-cli`. Install it with the command:
```bash
npm install @intuiface/cli
```
then use the `migrate` command to automatically upgrade your project to be compatible with CLI:
```bash
npx intuiface-cli migrate
```

After migration, validate with:

```bash
npm run build
```

## Help

```bash
npx intuiface-cli help
npx intuiface-cli help <command>
```
