function updateToLastVersion() {
	var versionError = false;
	while (!versionError && stage.version !== VERSION) {
		switch (stage.version) {
		case 20151115:
			console.log("Updating from 20151115 to 20160114...");
			versionError = !updateFrom20151115To20160114();
			break;
		case 20160114:
			console.log("Updating from 20160114 to 20160302...");
			versionError = !updateFrom20160114To20160302();
			break;
		case 20160302:
			console.log("Updating from 20160302 to 20160313...");
			versionError = !updateFrom20160302To20160313();
			break;
		case 20160313:
			console.log("Updating from 20160313 to 20160410...");
			versionError = !updateFrom20160313To20160410();
			break;
		case 20160410:
			console.log("Updating from 20160410 to 20160808...");
			versionError = !updateFrom20160410To20160808();
			break;
		case 20160808:
			console.log("Updating from 20160808 to 20160810...");
			versionError = !updateFrom20160808To20160810();
			break;
		case 20160810:
			console.log("Updating from 20160810 to 20160817...");
			versionError = !updateFrom20160810To20160817();
			break;
		case 20160817:
			console.log("Updating from 20160817 to 20200902...");
			versionError = !updateFrom20160817To20200902();
			break;	
		default:
			console.log("Error: Version not Found.");
			versionError = true;
			break;
		}
	}
}

// The mixtures structure changes to accept more than 1 interaction
// So we can delete the description in case of failure and add it to a general interaction with no conditions
function updateFrom20151115To20160114() {
	for (var obj1 in stage.mixtures) {
		if (stage.mixtures.hasOwnProperty(obj1) && obj1 !== "description") {
			var mixture1 = stage.mixtures[obj1];
			for (var obj2 in mixture1) {
				if (mixture1.hasOwnProperty(obj2) && obj2 !== "description") {
					var mixture2 = mixture1[obj2];
					mixture2.interactions = [];
					if (mixture2.actions || mixture2.conditions) {
						mixture2.interactions.push({
							conditions: mixture2.conditions,
							actions: mixture2.actions
						});
					}
					delete mixture2.conditions;
					delete mixture2.actions;
					
					if (mixture2.description) {
						mixture2.interactions.push({
							conditions: [],
							actions: [{
								"typeId": ACTIONS.SHOW_TEXT,
								"text": mixture2.description
							}]
						});
						delete mixture2.description;
					}
				}
			}
		}
	}
	stage.version = 20160114;
	return true;
}

// Now screens have more than image. Change the img parameter for a list of images and add a default image
function updateFrom20160114To20160302() {
	for (var key in stage.screens) {
		if (stage.screens.hasOwnProperty(key)) {
			var screen = stage.screens[key];
			var img = screen.img;
			var imgName = img.substring(0,img.indexOf("."));
			screen.images = {};
			var imageId = randomString(8);
			screen.images[imageId] = {};
			screen.images[imageId].img = img;
			screen.images[imageId].name = imgName;
			screen.defaultImage = imageId;
			delete screen.img;
		}
	}
	stage.version = 20160302;
	return true;
}

// Move all default properties of an area to the state default (If already exists a state named default
// throw an error an solve it manually. Also fill the values for those who had it empty (i.e.:onLoad)
function updateFrom20160302To20160313() {
	for (var key in stage.screens) {
		if (stage.screens.hasOwnProperty(key)) {
			var screen = stage.screens[key];
			for (var key2 in screen.areas) {
				if (screen.areas.hasOwnProperty(key2)) {
					var area = screen.areas[key2];
					if (area.states["default"]) {
						throw new Error("unbelievable odd probability error!");
					} else {
						area.states["default"] = {
							name: "default",
							img: area.img,
							description: area.description,
							cursor: area.cursor,
							top: area.top || 0,
							left: area.left || 0,
							width: area.width || 50,
							height: area.height || 50,
							zindex: area.zindex || 1,
							alpha: area.alpha || 1,
							hidden: area.hidden
						};
						delete area.img;
						delete area.description;
						delete area.cursor;
						delete area.top;
						delete area.left;
						delete area.width;
						delete area.height;
						delete area.zindex;
						delete area.alpha;
						delete area.hidden;
					}
				}
			}
		}
	}
	stage.version = 20160313;
	return true;
}

function updateFrom20160313To20160410() {
	stage.triggers = [];
	stage.version = 20160410;
	return true;
}

// All the interactions includes the variable onlyOnce
function updateFrom20160410To20160808() {
	// Areas
	for (var key in stage.screens) {
		if (stage.screens.hasOwnProperty(key)) {
			var screen = stage.screens[key];
			for (var key2 in screen.areas) {
				if (screen.areas.hasOwnProperty(key2)) {
					var area = screen.areas[key2];
					for (var i=0; i<area.interactions.length; i++) {
						area.interactions[i].onlyOnce = false;
					}
				}
			}
		}
	}
	
	// Mixtures
	for (var obj1 in stage.mixtures) {
		if (stage.mixtures.hasOwnProperty(obj1) && obj1 !== "description") {
			var mixture1 = stage.mixtures[obj1];
			for (var obj2 in mixture1) {
				if (mixture1.hasOwnProperty(obj2) && obj2 !== "description") {
					var mixture2 = mixture1[obj2];
					for (var i=0; i<mixture2.interactions.length; i++) {
						mixture2.interactions[i].onlyOnce = false;
					}
				}
			}
		}
	}
	stage.version = 20160808;
	return true;
}

// Added languages and translations
function updateFrom20160808To20160810() {
	stage.texts = {};
	defaultLanguage = "en_US";
	stage.defaultLanguage = defaultLanguage;
	stage.languages = {
		"en_US": "English"
	};
	
	// Areas description
	for (var key in stage.screens) {
		if (stage.screens.hasOwnProperty(key)) {
			var screen = stage.screens[key];
			for (var key2 in screen.areas) {
				if (screen.areas.hasOwnProperty(key2)) {
					var area = screen.areas[key2];
					for (var key3 in area.states) {
						if (area.states.hasOwnProperty(key3) && area.states[key3].description) {
							area.states[key3].description = internationalize(area.states[key3].description);
						}
					}
				}
			}
		}
	}
	
	// Objects description
	for (var key in stage.objects) {
		if (stage.objects.hasOwnProperty(key)) {
			var object = stage.objects[key];
			object.description = internationalize(object.description);
			
			// Object stacks
			for (var i=0; i<object.stacks.length; i++) {
				object.stacks[i].description = internationalize(object.stacks[i].description);
			}
		}
	}
	
	// Mixtures description
	if (stage.mixtures.description) {
		stage.mixtures.description = internationalize(stage.mixtures.description);
	}
	for (var obj1 in stage.mixtures) {
		if (stage.mixtures.hasOwnProperty(obj1) && obj1 !== "description") {
			var mixture1 = stage.mixtures[obj1];
			mixture1.description = internationalize(mixture1.description);
		}
	}
	
	
	// Interactions and Triggers
	internationalizeInteractions(getAllInteractions());
	
	stage.version = 20160810;
	return true;
}

// Make a text multilanguage
function internationalize(text) {
	var idText = createText(text);
	if (idText) {
		return idText;
	} else {
		throw new Error("unbelievable odd probability error!");
	}
}

// Make an interaction multilanguage
function internationalizeInteractions(interactions) {
	for (var i=0; i<interactions.length; i++) {
		for (var j=0; j<interactions[i].actions.length; j++) {
			var action = interactions[i].actions[j];
			if (action.typeId === ACTIONS.SHOW_TEXT) {
				action.text = internationalize(action.text);
			}
		}
	}
}

// Remove onLoad descriptions
function updateFrom20160810To20160817() {
	for (var key in stage.screens) {
		if (stage.screens.hasOwnProperty(key)) {
			var screen = stage.screens[key];
			if (screen.areas["onLoad"].description) {
				delete stage.texts[screen.areas["onLoad"].description];
				delete screen.areas["onLoad"].description;
			}
		}
	}
	
	stage.version = 20160817;
	return true;
}

// Add stage name
function updateFrom20160817To20200902() {
	stage.name = stage.folderName
	stage.version = 20200902;
	return true;
}