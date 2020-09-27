# Editor Manual
- [How to Install](#how-to-install)
- [Folder structure](#folder-structure)
- [Images](#images)
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
    - [Interactions](#interactions)

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

## Images
Each element of the game that has images has its own folder. as explained in [folder structure](#folder-structure). But there are 3 ways of adding images in the game. In the input where you have to enter the image you can:
1. Add the image name and put the image into the folder (`/public/stages/folder_name/img/image_folder`)
2. Add the http url of the image (in case the image is from the internet)
3. Add the base64 string of the image (data:image/...)

The recommended method is (1). (2) has the problem that the image can be removed from internet and (3) will make the stage.json file to grow bigger and bigger with each image (but it's interesting if you want a unique file to contain all the game),

## URL structure
Being `http://localhost:3000` the base url you can type directly right after:
- /editor (to go to the editor)
- /editor/*folder-name* (to go to the editor and load the game inside public/stage/*folder-name*)
- /game/*folder-name* (to go to the game saved inside public/stage/*folder-name*)

## Main window
The editor window is divided in 3 zones

<kbd>![main-window](./img/main-window.png)</kbd>

- The [canvas](#canvas)
- a [menu](#down-menu) on its bottom 
- a [menu](#right-menu) on its right

### Canvas
The canvas is where you can see how you screen will look like. Basically you can see the background of the [Screen](#screens) and the different[areas](#areas):

<kbd>![canvas](./img/canvas.png)</kbd>

As you can see the areas had a sorrounding box. With line:
- yellow for normal areas
- red for the selected area
- orange for not visible areas (explained in the [areas](#areas) section)
- dark red for a selected not visible area

These lines can be hidden from the [down menu](#down-menu). Moreover if you click an area it will automatically be selected in the [areas](#areas) menu.

### Down menu
The menu in the bottom is where the general game properties are:

<kbd>![down-menu](./img/down-menu.png)</kbd>

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
7. Try it! Button: Opens a new window to try quickly the game you are editing<sup>*</sup>
8. Get json Button: Opens a dialog with the json containing all the game. From here you can:
    - copy and paste it in the `stage.json` file inside your game [folder](#folder-structure)
    - click save and it will download a `stage.json` file for you to copy inside your game [folder](#folder-structure)
9. Load json Button: From here you can load a `stage.json` file
10. Restore json Button: 

*: You can use it to quickly check your changes but once validated it is recommended to get the json and save it to the folder of your game. You can always visit the most updated version of the game going to `http://localhost:3000/game/folder-name` as described in [urls](#url-structure) section

### Right menu
The menu in the right is where all the *magic* happens. You can do a lot of things here. For easier use it is divided in these submenus:

<kbd>![right-menu](./img/right-menu.png)</kbd>

1. [Screens](#screens)
2. [Areas](#areas)
3. [Objects](#objects)
4. [Objectives](#objectives)
5. [Mixtures](#mixtures)
6. [Triggers](#triggers)
7. [Characters and Talks](#characters-and-talks)
8. [Languages](#languages)

#### Screens
Here you can add screens(zones/locations) to your game.

<kbd>![screens](./img/screens.png)</kbd>

1. From here you manage the list of screens. Each one has a name and an [image](#images)
2. Mark this to mark your initial screen (the one where you have the game to start). Last one marked will prevail
3. A screen can have various images. Imagine a room with a door: you can have one image with the room open and another with the room closed. Or one image if later in the game the night falls. Here you can manage the list of images and mark one as default. Later you could change the image in the game via [interactions](#interactions)

#### Areas
Here you can add areas (boxes/squares) to your screens. Areas are zone where the user can click (or will be able to click further in the game). Areas can contain images.

<kbd>![areas](./img/areas.png)</kbd>

1. From here you manage the list of areas
2. From here you manage the list of states of each area. A state contains these parameters:
    - image
    - description
    - coordinates (x, y)
    - size (height, width)
    - z-index parameter
    - alpha parameter
    - cursor
    - is hidden parameter

All areas have a default state and you can add as many as you want. For each non-default state, the default state parameters are taken as defaults (forgive the redundancy)

. Each one has a name and an [image](#images)


#### Objects
#### Objectives
#### Mixtures
#### Triggers
#### Characters and Talks
#### Languages
#### Interactions