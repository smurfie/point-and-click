// This file defines some common functions that can be used in the editor and in the game and doesn't belong anywhere else

// Returns a list of all interactions and triggers
function getAllInteractions() {
	var all = [];
	
	// Areas interactions
	for (var key in stage.screens) {
		if (stage.screens.hasOwnProperty(key)) {
			var screen = stage.screens[key];
			for (var key2 in screen.areas) {
				if (screen.areas.hasOwnProperty(key2)) {
					var area = screen.areas[key2];
					all = all.concat(area.interactions);
				}
			}
		}
	}
	
	// Mixtures interactions
	for (var obj1 in stage.mixtures) {
		if (stage.mixtures.hasOwnProperty(obj1) && obj1 !== "description") {
			var mixture1 = stage.mixtures[obj1];
			for (var obj2 in mixture1) {
				if (mixture1.hasOwnProperty(obj2) && obj2 !== "description") {
					all = all.concat(mixture1[obj2].interactions);
				}
			}
		}
	}
	
	// Triggers
	all = all.concat(stage.triggers);
	
	return all;
}

// Returns the property of an area in the passed stateId.
// If it doesn't exists returns that property for the default stateId
function getAreaStateProperty(areaId, stateId, property) {
	if (areaId === "onLoad") {
		return "";
	}
	
	var screen = typeof savegame === "undefined" ? currentScreen : stage.screens[savegame.screenId];
	var value = screen.areas[areaId].states[stateId][property];
	
	// When consulting the description we have to get it from the texts object
	if (value && property === "description") {
		value = getText(value);
	}
	
	if (typeof value === "undefined" || value === "") {
		value = screen.areas[areaId].states["default"][property];
		if (value && property === "description") {
			value = getText(value);
		}
	}
	
	return value;
}

function isAbsolutePath(url) {
	return typeof url === "undefined" || url.startsWith("http://") ||
			url.startsWith("https://") || url.startsWith("data:image/");
}

function unescapeNewLinesHTML(text) {
	return text.replace(/\n/g, '<br>');
}

// Creates the screen and the area if needed in the savegame
function createScreenArea(screen, area) {
	if (!savegame.screens[screen]) {
		savegame.screens[screen] = {
			areas: {}
		};
	}
	if (area && !savegame.screens[screen].areas[area]) {
		savegame.screens[screen].areas[area] = {};
	}
}