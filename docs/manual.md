# Editor Manual
- [How to Install](#how-to-install)
- [Folder structure](#folder-structure)
- [Main window](#main-window)
- [Canvas](canvas)
- [Down menu](down-menu)
- [Left menu](left-menu)

## How to Install
To install the engine in your local computer you only need to have [nodeJS](https://nodejs.org/en/) installed on your computer. Download the project in a Zip file or clone the repo and run:
```
npm install
npm start
```
And visit `http://localhost:3000` on your browser.

From there you can go and play the example game (Safari) or edit it. For the purposes of this manual go to Edit the Safari game: `http://localhost:3000/editor/safari`

## Folder structure
Before we start let's talk about the folder structure for the game.

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

## Main window
![canvas](./img/canvas.png)

## Canvas
## Down menu
## Left menu
... WIP ...