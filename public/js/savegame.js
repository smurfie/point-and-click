function saveGame() {
    localStorage.setItem(stage.folderName, JSON.stringify(savegame));
}

function loadGame() {
    savegame = JSON.parse(localStorage.getItem(stage.folderName));
    reloadFromSavegame();
}

function reloadFromSavegame() {
    updateStageName();

    drawInventory();
    loadScreen(savegame.screenId, false);
}