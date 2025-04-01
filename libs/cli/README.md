# intuiface-cli

Intuiface CLI is a command line tool that helps you build interface assets for Intuiface.  
This CLI will generate Intuiface Descriptor (*.ifd) file and build the Interface Asset (IA) to be able to add it in an Intuiface Experience.

## Usage: 
Command to build an Interface Asset:
```sh 
npx intuiface-cli build -n IA_File_Name
```


| Option            | Description                                                                                     |
|--------------------|-------------------------------------------------------------------------------------------------|
| `-n, --name <name>` | Name of the interface asset's main file in the `src/*` folder (without extension).             |
| `-i, --icon [icon]` | Path to the icon of the IA displayed in Composer Interface Asset panel.                        |
| `-d, --debug`       | Build in debug mode.                                                                          |
| `-h, --help`        | Display help for the command.                                                                 |

To see more usage information, use the `help` command:
```
npx intuiface-cli help
npx intuiface-cli help <command>
```

### Adding an icon
If you want to add an icon to your IA, add an image in your project and reference its path in the `package.json` file editing the `build` script.

`"build": "npx intuiface-cli build -n IA_File_Name -i MyIcon.png` 

or

`"build": "npx intuiface-cli build -n IA_File_Name -i ./icons/MyIcon.png`

then run command 
```sh
npm run build
```

### Build for debug
You can run the command 
```sh
npm run build:debug
```
directly in your project. This command will not minimize the output file in order to be easier for debug. Then in the Composer Play Mode, you can use key combination `Ctrl+Shift+I`
to debug.

## Migration to v2
For existing project created before the v2 of the `intuiface-cdk`, you can migrate your project.
First, update `@intuiface/core` to use the latest version:
```
npm install @intuiface/core@latest
```
Then checks that your project still build or fix the breaking changes.

Now, you can migrate your project to use the new `intuiface-cli`. Install it with the command:
```sh
npm install @intuiface/cli
```
then use the `migrate` command to automatically upgrade your project to be compatible with CLI:
```sh
npx intuiface-cli migrate
```