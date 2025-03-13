# cli

Command line to Generate Intuiface Descriptor (ifd) file and build the Interface Asset (IA) to be able to add it in an Intuiface Experience.

# Usage: 
```sh 
npx intuiface-cli build -n IA_File_Name
```
Options:
- -n, --name <name>  The name of the IA file.
- -i, --icon [icon]  The path to the icon of the IA displayed in Composer Interface Asset panel.
- -d, --debug        Build in debug mode.
- -h, --help         display help for command


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

# Migration:
For existing project created before the v2 of the intuiface-cdk, you can migrate your project.
To achieve it you have to install the command line with :
```sh
npm install @intuiface/cli
```
then you can call 
```sh
npm intuiface-cli migrate
```
to automatically migrate your project to be compatible with CLI.