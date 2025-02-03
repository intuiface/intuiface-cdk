# ifd

Command line to Generate ifd file and build the IA to be able to add it in an Intuiface Experience.

Usage: 
```sh 
npx ifd -n IA_File_Name
```

Options:
- -n, --name the file name of the IA to build
- -i, --icon the path to the icon of the IA displayed in Composer Interface Asset panel
- -d, --debug option to build the IA in debug mode
- -h, --help display help


Examples : 
if you want to add an icon to your IA, add an image in your project and reference its path in the `package.json` file editing the `build` script.
"build": "npx ifd -n IA_File_Name -i MyIcon.png
or 
"build": "npx ifd -n IA_File_Name -i ./icons/MyIcon.png

then run command 
```sh
npm run build
```

or directly 
```sh
npx ifd -n IA_File_Name -i ./icons/MyIcon.png
```