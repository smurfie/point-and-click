function saveGame() { // TODO: Name of the file
    localStorage.setItem(stage.folderName, JSON.stringify(savegame));
}

function loadGame() { // TODO: Name of the file / Check compatibility
    savegame = JSON.parse(localStorage.getItem(stage.folderName));
    reloadFromSavegame();
}

function reloadFromSavegame() {
    updateStageName();

    drawInventory();
    loadScreen(savegame.screenId, false);
    if (savegame.talkId) {
        loadTalk(savegame.talkId);
    }
}