function saveSavegame(slot) {
    savegame.timestamp = new Date().getTime();
    savegame.stageVersion = stage.version;
    savegame.engineVersion = stage.engineVersion;
    localStorage.setItem(stage.folderName + "_savegame_" + slot, JSON.stringify(savegame));
}

// returns the savegame in case it exists
function existsSavegame(slot) {
    var json = localStorage.getItem(stage.folderName + "_savegame_" + slot);
    if (json) {
        json = JSON.parse(json);
        // Check that the major version is the same (if not the savegame don't exists for that version)
        return stage.version.split(".")[0] === json.stageVersion.split(".")[0] ? json : false;
    }
    return false;
}

function loadSavegame(slot) {
    savegame = JSON.parse(localStorage.getItem(stage.folderName + "_savegame_" + slot));
    if (savegame.engineVersion < VERSION) {
        updateSavegame();
    }
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

function updateSavegame() {
    console.log("Updating savegame from " + savegame.version + " to " + VERSION + "...");
    savegame.version = VERSION;
}