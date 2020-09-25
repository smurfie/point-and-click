# Editor Manual
- [How to Install](#how-to-install)
- [Folder structure](#folder-structure)
- [URL structure](#url-structure)
- [Main window](#main-window)
  - [Canvas](#canvas)
  - [Down menu](#down-menu)
  - [Right menu](#right-menu)
    - [Screens](#screens)
    - [Areas](#areas)
    - [Objects](#objects)
    - [Objectives](#objectives)
    - [Mixtures](#mixtures)
    - [Triggers](#triggers)
    - [Characters and Talks](#characters-and-talks)
    - [Languages](#languages)

## How to Install
To install the engine in your local computer you only need to have [nodeJS](https://nodejs.org/en/) installed on your computer. Download the project in a Zip file or clone the repo and run:
```
npm install
npm start
```
And visit `http://localhost:3000` on your browser.

From there you can go and play the example game (Safari) or edit it. For the purposes of this manual go to Edit the Safari game: `http://localhost:3000/editor/safari`

## Folder structure
Before we start let's talk about the folder structure of the project.

The games are called also stages and stored inside the `public/stage` folder. Each subfolder is a different game. Git will ignore the games starting with `p_` (i.e: p_my-game) as they are supposed to be personal games.

Inside each game the structure is as follows:
```
├── stage.json
└── img
    ├── areas
    ├── characters
    ├── objects
    └── screens
```
The `stage.json` file contains the structure of all the game in JSON format.

The `img` folder contains the images for each element of the game.

## URL structure
Being `http://localhost:3000` the base url you can type directly right after:
- /editor (to go to the editor)
- /editor/*folder-name* (to go to the editor and load the game inside public/stage/*folder-name*)
- /game/*folder-name* (to go to the game saved inside public/stage/*folder-name*)

## Main window
The editor window is divided in 3 zones

![main-window](./img/main-window.png)

- The [canvas](#canvas)
- a [menu](#down-menu) on its bottom 
- a [menu](#right-menu) on its right

### Canvas
The canvas is where you can see how you screen will look like. Basically you can see the background of the [Screen](#screens) and the different[areas](#areas):

![canvas](./img/canvas.png)

As you can see the areas had a sorrounding box. With line:
- yellow for normal areas
- red for the selected area
- orange for not visible areas (explained in the [areas](#areas) section)
- dark red for a selected not visible area

These lines can be hidden from the [down menu](#down-menu). Moreover if you click an area it will automatically be selected in the [areas](#areas) menu.

### Down menu
The menu in the bottom is where the general game properties are:

![down-menu](./img/down-menu.png)

1. Folder name of your game: (i.e: if your game resides in `public/stage/safari` then your folder name is `safari`)
2. Stage name: This is what will appear as the title of the game
3. Stage version: This is the version of your game in a format major.minor (i.e: 4.7 where the 4 is the major and 7 is the minor). Before you deploy your game for the first time it is recommended to put version 1.0 in this field and if you find things to change in the future and want to deploy another version you can:
    - increment the major (2.0) in case you want to invalidate the savegames of the players (i.e: adding an object to the game)
    - increment the minor (1.1) in case you don't want to invalidate the savegames (i.e: typo fixes)
4. Screen width in pixels: The screen has a fixed height of 544px so depending on your background images you can calculate the correspondent widht and put it here. It is not recommended to change it later (at least not decrease it because some areas could land outside the screen)
5. Default language (flag): currently there are 3 different languages (english, catalan, spanish) and you can select the default one in the [languages](languages) menu.
6. Areas to show: This options refers to the outlined boxes of the areas (which colors are explained in the [canvas](#canvas) section). You can choose between:
    - All: shows all areas with sorrounding boxes
    - Visible: shows only the visible areas
    - No lines: shows all areas without sorrounding boxes
    - No lines-visible: shows only the visible areas without sorrounding boxes
7. Try it! Button: Opens a new window to try quickly the game you are editing [^1]
8. Get json Button: Opens a dialog with the json containing all the game. From here you can:
    - copy and paste it in the `stage.json` file inside your game [folder](#folder-structure)
    - click save and it will download a `stage.json` file for you to copy inside your game [folder](#folder-structure)
9. Load json Button: From here you can load a `stage.json` file
10. Restore json Button: 

[^1]: You can use it to quickly check your changes but once validated it is recommended to get the json and save it to the folder of your game. You can always visit your most updated version of your game going to `http://localhost:3000/game/folder-name` as described in [urls](#url-structur)) section

### Right menu
#### Screens
#### Areas
#### Objects
#### Objectives
#### Mixtures
#### Triggers
#### Characters and Talks
#### Languages