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

Or initialize non-interactively:

```bash
npx intuiface-cli init -n my-intuiface-workspace
```

Add items:

```bash
npx intuiface-cli add interface-asset -n MyInterfaceAsset -c Custom
npx intuiface-cli add binding-converter -n MyBindingConverter -c Custom
```

Build all configured items:

```bash
npx intuiface-cli build --all
```

## Commands

### `init`
Initialize a CLI-managed workspace in the current folder.

Interactive:

```bash
npx intuiface-cli init
```

Non-interactive:

```bash
npx intuiface-cli init -n my-intuiface-workspace
```

### `add`
Add items to the current workspace.

Non-interactive examples:

```bash
npx intuiface-cli add interface-asset -n MyInterfaceAsset -c Custom
npx intuiface-cli add binding-converter -n MyBindingConverter -c Custom
```

Tip: `init` includes an interactive first-item creation flow. For additional items, use explicit `add` commands as shown above.

For binding converters, you can optionally provide an icon:

```bash
npx intuiface-cli add binding-converter -n MyBindingConverter -c Custom -i ./icons/converter.png
```

### `build`
Build a single item or all workspace items.

```bash
npx intuiface-cli build --all
npx intuiface-cli build --name MyInterfaceAsset
npx intuiface-cli build --name MyBindingConverter --type binding-converter
```

Options:

| Option | Description |
|---|---|
| `-n, --name <name>` | Name of the workspace item to build. |
| `-a, --all` | Build all items from `intuiface.workspace.json`. |
| `-t, --type <type>` | Build type: `interface-asset` or `binding-converter`. |
| `-i, --icon [icon]` | Override icon path for build output. |
| `-d, --debug` | Build in debug mode. |
| `-h, --help` | Show command help. |

#### Debug builds

Use debug mode with flag `--debug` when you want unminified output and easier troubleshooting. Then in the Composer Play Mode, you can use key combination `Ctrl+Shift+I` to debug.

```bash
npx intuiface-cli build --all --debug
npx intuiface-cli build --name MyInterfaceAsset --debug
```

In a CLI-generated workspace, this is also available through:

```bash
npm run build:debug
```

### `migrate`
Migrate older projects to the CLI-based workflow.

```bash
npx intuiface-cli migrate
```

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
