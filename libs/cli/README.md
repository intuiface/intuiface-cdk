# ifd

Command line to Generate ifd file and build the IA to be able to add it in an Intuiface Experience.

# Usage: 
```sh 
npx ifd -n IA_File_Name
```

Options:
- -n, --name the file name of the IA to build
- -i, --icon the path to the icon of the IA displayed in Composer Interface Asset panel
- -d, --debug option to build the IA in debug mode
- -h, --help display help


### Adding an icon
If you want to add an icon to your IA, add an image in your project and reference its path in the `package.json` file editing the `build` script.

`"build": "npx ifd -n IA_File_Name -i MyIcon.png` 

or

`"build": "npx ifd -n IA_File_Name -i ./icons/MyIcon.png`

then run command 
```sh
npm run build
```

or directly 
```sh
npx ifd -n IA_File_Name -i ./icons/MyIcon.png
```

### Build for debug
You can run the command 
```sh
npm run build:debug
```
directly in your project. This command will not minimize the output file in order to be easier for debug. Then in the Composer Play Mode, you can use key combination `Ctrl+Shift+I`
to debug.
You can also use the command line if you prefer with
```sh
npx ifd -n IA_File_Name -d
```

# Migration:
For existing project, installing the command line with 
```sh
npm install @intuiface/ifd
```
then you can call 
```sh
npm ifd migrate
```
to automatically migrate your project to be compatible with CLI.