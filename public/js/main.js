"use strict";

$(document).ready(function() {

	// Dialog polyfill: dialog acts like a native <dialog> in all browsers
	var dialog = document.querySelector('dialog');
	dialogPolyfill.registerDialog(dialog);
	
	$("#modalText").click(function() {
		if ($("#modalText:visible").length > 0) {
			$("#modalText:visible")[0].close();
			if (textMessages.length > 0) {
				showNextText();
			}
		}
	});
	
	$("#inventory").on("mouseenter", "img", function(){
		if (!savegame.objectSelected) {
			$("#text").html($(this).data("object-description"));
		} else if (savegame.objectSelected != $(this).data("object")) {
			$("#text").html($("#text").html() + "<span>" + $(this).data("object-description") + "</span>")
		}
	});
	
	$("#inventory").on("mouseleave", "img", function(){
		if (!savegame.objectSelected) {
			$("#text").html("");
		} else if (savegame.objectSelected != $(this).data("object")) {
			$("#text span").remove();
		}
	});
	
	$("#inventory").on("click", "img", function(){
		if (!savegame.objectSelected) { // Select object
			selectObject($(this));
		} else if (savegame.objectSelected == $(this).data("object")) { // Unselect object
			unselectObject();
		} else {
			useObjectObject(savegame.objectSelected, $(this).data("object"));
		}
	});
	
	$("#languageOptions").on("click", "a" ,function() {
		$("#languageOptions a").removeClass("active");
		$(this).addClass("active");
	});

	$(".slot").on("click", ".save" ,function() {
		var slot = $(this).parent(".slot").data("slot");
		saveSavegame(slot);
		hideOptions();
	});

	$(".slot").on("click", ".load" ,function() {
		var slot = $(this).parent(".slot").data("slot");
		loadSavegame(slot);
		hideOptions();
	});
	
	$("#optionsImg").click(function() {
		showOptions();
	});

	$("#okOption").click(function() {
		savegame.language = $("#languageOptions a.active").data("lang");
		reloadFromSavegame();
		
		hideOptions();
	});
	
	$("#cancelOption").click(function() {
		hideOptions();
	});
	
	// If not object is selected, unselect the savegame.objectSelected
	$("#canvas").click(function(){
		if (savegame.objectSelected) {
			unselectObject();
		}
	});
	
	// On hover an answer show in the upper box
	$("#conversationOptions").on("mouseenter", "li", function(){
		$("#conversationText > p").html(unescapeNewLinesHTML($(this).text()));
	});
	
	$("#conversationOptions").on("mouseleave", "li", function(){
		if ($(this).is(":visible")) { // To avoid triggering the event once the option is clicked
			$("#conversationText > p").text("");
		}
	});
	
	// Load stage file
	if (filename != ""){
		$.getJSON(filename)
		.done(function(data){
			stage = data;
			init();
		})
		.fail(function(data){
			init();
		});
	} else {
		if (localStorage.getItem("stage")) {
			stage = JSON.parse(localStorage.getItem("stage"));
		}
		init();
	}
});

var stage = {};
var savegame = {
	screens: {},
	onlyOnceInteractionsExecuted: [],
	onlyOnceTriggersExecuted: [],
	inventory: [],
	objectivesCompleted: {}
};
var imagePath, cursorPath;
var stagePath, stageImagePath, stageScreenPath, stageObjectPath, stageAreaPath, stageCharacterPath;
var numImages = 0, loadedImages = 0;
var textMessages = [];

function init() {
	updateToLastVersion();
	
	savegame.language = stage.defaultLanguage;
	
	imagePath = "/img/";
	cursorPath = imagePath + "cursor/";
	
	stagePath = "/stage/" + stage.folderName + "/";
	stageImagePath = stagePath + "img/";
	stageScreenPath = stageImagePath + "screens/";
	stageObjectPath = stageImagePath + "objects/";
	stageAreaPath = stageImagePath + "areas/";
	stageCharacterPath = stageImagePath + "characters/";
	
	updateStageName()
	scaleCanvas();
	drawInventory();
	loadStage();

	// If more than one language, show the options menu
	if (Object.keys(stage.languages).length > 1) {
		showOptions();
	}
}

// Update the stage name (iframe title , parent title and #gameTitle)
function updateStageName() {
	document.title = getText(stage.stageName);
	parent.document.title = getText(stage.stageName);
	$("#gameTitle", window.parent.document).html(getText(stage.stageName));
}

function scaleCanvas() {
	if (stage.width) {
		$("#canvas, #conversation, #loadingCanvas").css("width", (stage.width + 4) + "px");
		$("#inventory").css("left", (stage.width + 2) + "px");
		$("#text").css("width", (stage.width + 143) + "px");
		$("#optionsImg").css("left", (stage.width + 143) + "px");
		$("#options").css("width", (stage.width + 186) + "px");
		
		$("#conversationText").css("width", (stage.width - 300) + "px");
		$("#conversationOptions").css("width", (stage.width - 80) + "px");
	}
}

function loadStage() {
	loadScreen(stage.initialScreen, true);
}

function loadScreen(screenId, onLoadActions) {
	$("#loadingCanvas").css("background-image", "url('" + imagePath + "loading.gif')");
	$("#loadingCanvas").show();
	savegame.screenId = screenId;
	var currentScreen = stage.screens[screenId];
	
	$("#canvas").empty();

	// If the savegame image for that screen is empty select the defaultImage from stage
	var imageId = savegame.screens[screenId] && 
			savegame.screens[screenId].imageId ? savegame.screens[screenId].imageId :
			currentScreen.defaultImage;
	
	// Choose between absolute or relative image
	var screenPath = currentScreen.images[imageId].img;
	screenPath = isAbsolutePath(screenPath) ? screenPath : stageScreenPath + screenPath;
	loadAsynchronousImage($('#canvas'), screenPath, true);
	
	$("#text").empty();
	for (var areaId in currentScreen.areas) {
		if (currentScreen.areas.hasOwnProperty(areaId)) {
			loadArea(areaId);
		}
	}
	if (onLoadActions) {
		findAndExecuteActions(currentScreen.areas.onLoad.interactions);
	}
}

// Loads all the images and when completed fades out the loading div
function loadAsynchronousImage(container, imgPath, isBackground){
	numImages++;
	$('<img/>').attr("src", imgPath).load(function() {
		$(this).remove();
		if (isBackground) {
			container.css("background-image", "url(" + imgPath + ")");
		} else {
			container.prop("src", imgPath);
		}
		if (++loadedImages == numImages) {
			$("#canvas img").css("display", ""); // To remove the attribute
			$("#loadingCanvas").css("background-image", "none");
			$("#loadingCanvas").fadeOut();
		}
	});
}

function loadArea(areaId) {
	if (areaId != "onLoad") {
		var stateId = savegame.screens[savegame.screenId] && 
				savegame.screens[savegame.screenId].areas[areaId] &&
				savegame.screens[savegame.screenId].areas[areaId].stateId ?
				savegame.screens[savegame.screenId].areas[areaId].stateId : "default";
		var isHidden = savegame.screens[savegame.screenId] && 
				savegame.screens[savegame.screenId].areas[areaId] &&
				typeof savegame.screens[savegame.screenId].areas[areaId].hidden !== "undefined" ?
				savegame.screens[savegame.screenId].areas[areaId].hidden :
				getAreaStateProperty(areaId, stateId, "hidden");
		var area = stage.screens[savegame.screenId].areas[areaId];
		
		// Load all areas, even the hidden ones
		var img = $("<img id='object_" + areaId + "' class='area" + 
				(isHidden ? " hidden" : "") + "'>");
		var imgPath = getAreaStateProperty(areaId, stateId, "img");
		imgPath = isAbsolutePath(imgPath) ? imgPath : stageAreaPath + imgPath;
		loadAsynchronousImage(img, imgPath, false);
		
		img.css({
			"top": getAreaStateProperty(areaId, stateId, "top") + "px",
			"left": getAreaStateProperty(areaId, stateId, "left") + "px",
			"width": getAreaStateProperty(areaId, stateId, "width") + "px",
			"height": getAreaStateProperty(areaId, stateId, "height") + "px",
			"opacity": getAreaStateProperty(areaId, stateId, "alpha"),
			"z-index": getAreaStateProperty(areaId, stateId, "zindex"),
			"position": "absolute",
			"display": "none"
		});
		loadCursor(img, getAreaStateProperty(areaId, stateId, "cursor"));
		
		img.mouseenter(function(){
			var description = getAreaStateProperty(areaId, stateId, "description");
			if (!savegame.objectSelected) {
				$("#text").html(description);
			} else if (savegame.objectSelected != $(this).data("object")) {
				$("#text").html($("#text").html() + "<span>" + description + "</span>")
			}		
		});
		
		img.mouseleave(function(){
			if (!savegame.objectSelected) {
				$("#text").html("");
			} else {
				$("#text span").remove();
			}
		});
		
		img.click(function(e){
			e.preventDefault();
			e.stopPropagation();
			if (!savegame.objectSelected) {
				findAndExecuteActions(area.interactions);
			} else {
				useObjectArea(savegame.objectSelected, areaId);
			}
		});
		
		$("#canvas").append(img);
	}
}

function findAndExecuteActions(interactions) {	
	// Loop all interactions until found ONE that all conditions are fulfilled and is not an
	// onlyOnce interaction already executed
	var i;
	var interactionFound = false;
	for (i=0; i<interactions.length && !interactionFound; i++) {
		interactionFound = fulfillConditions(stage.interactions[interactions[i]].conditions) &&
			!(stage.interactions[interactions[i]].onlyOnce && 
			savegame.onlyOnceInteractionsExecuted.includes(interactions[i]));
	}
	
	if (interactionFound) {
		i--;
		// If there is an object selected (user is using one object with another), we always unselect it
		// except when there is only one action and it's showing a text (normally is the case when the action that the user
		// intended to do failed and a text is shown).
		if (savegame.objectSelected && (stage.interactions[interactions[i]].actions.length!=1 ||
				stage.interactions[interactions[i]].actions[0].typeId!=ACTIONS.SHOW_TEXT)) {
			unselectObject();
		}
		executeActions(stage.interactions[interactions[i]].actions);
		
		// If the interaction is marked to be executed only once, mark it in savefile.
		if (stage.interactions[interactions[i]].onlyOnce) {
			savegame.onlyOnceInteractionsExecuted.push(interactions[i]);
		}
		
		findAndExecuteTriggers();
	}
	return interactionFound;
}

function findAndExecuteTriggers() {
	// Execute all triggers than fulfill its conditions and are not onlyOnce triggers already executed
	for (var i=0; i<stage.triggers.length; i++) {
		if (fulfillConditions(stage.triggers[i].conditions) &&
				!(stage.triggers[i].onlyOnce &&
				savegame.onlyOnceTriggersExecuted.includes(i))) {
			executeActions(stage.triggers[i].actions);
			
			// If the trigger is marked to be executed only once,  mark it in savefile.
			savegame.onlyOnceTriggersExecuted.push(i);
		}
	}
}

function drawInventory() {
	$("#inventory").empty();
	
	var i=0;
	for (; i<savegame.inventory.length; i++) {
		var inventorySlot = $("<div class='inventorySlot'></div>");
		var object = stage.objects[savegame.inventory[i].object];
		var num = savegame.inventory[i].num;
		var img = object.img;
		var description = getText(object.description);
		for (var j=0; j<object.stacks.length && num>=object.stacks[j].minNumber; j++) {
			img = object.stacks[j].img;
			description = getText(object.stacks[j].description);
			
		}
		img = isAbsolutePath(img) ? img : stageObjectPath + img;
		var imgDOM = $("<img data-object='" + savegame.inventory[i].object
				+ "' data-object-description='" + escapeSingleQuotes(description) +
				"' src='" + img + "'>");
		
		// If more than one item, print how many
		if (savegame.inventory[i].num > 1) {
			var p = $("<p class='inventoryNum'>" + savegame.inventory[i].num + "</p>")
			inventorySlot.append(p);
		}		
		inventorySlot.append(imgDOM);
		$("#inventory").append(inventorySlot);
	}
	
	// Fill with empty spaces until all the screen is filled (horizontaly and vertically)
	for (; i<12 || i%2 == 1; i++) {
		var inventorySlot = $("<div class='inventorySlot'></div>");
		$("#inventory").append(inventorySlot);
	}
}

function selectObject(objectDOM) {
	savegame.objectSelected = objectDOM.data("object");
	objectDOM.parent().addClass("selected");
	$("#canvas").addClass("objectSelected");
	document.body.style.cursor="url('" + cursorPath + "gears.png') 10 10, default";
	$("#text").html(objectDOM.data("object-description") + " + ");
}

function unselectObject() {
	var objectDOM = $("#inventory img[data-object=" + savegame.objectSelected + "]");
	savegame.objectSelected = null;
	objectDOM.parent().removeClass("selected");
	$("#canvas").removeClass("objectSelected");
	document.body.style.cursor="default";
	$("#text").html(objectDOM.data("object-description"));
}

function useObjectObject(objectId1, objectId2) {
	var mixture = stage.mixtures[objectId1] && stage.mixtures[objectId1][objectId2] ? stage.mixtures[objectId1][objectId2] :
			stage.mixtures[objectId2] && stage.mixtures[objectId2][objectId1] ? stage.mixtures[objectId2][objectId1] : null;
	
	useMixture(mixture, objectId1);
}

function useObjectArea(objectId, areaId) {
	var screenArea = savegame.screenId + "_" + areaId;
	var mixture = stage.mixtures[objectId] && stage.mixtures[objectId][screenArea] ? stage.mixtures[objectId][screenArea] : null;

	useMixture(mixture, objectId);
}

function useMixture(mixture, objectId) {
	var result = getText(stage.mixtures.description);

	// If no mixture found or found one with no interactions possible to execute show default text
	if (!mixture || !findAndExecuteActions(mixture.interactions)) {
		if (stage.mixtures[objectId] && stage.mixtures[objectId].description) {
			result = getText(stage.mixtures[objectId].description);
		}

		$("#modalText p").html(unescapeNewLinesHTML(result));
		$("#modalText")[0].showModal();
	}
}

function showOptions() {
	drawLanguages();
	drawSavegameSlots();
	$("#options").show();
}

function hideOptions() {
	$("#options").hide();
}

function drawLanguages() {
	$("#languageOptions").empty();
	
	for (var key in stage.languages) {
		if (stage.languages.hasOwnProperty(key)) {
			var button = $("<a data-lang='" + key + "'><img src='../img/flags/" + key + ".png'/></a>");
			if (key === savegame.language) {
				button.addClass("active");
			}
			$("#languageOptions").append(button);
		}
	}
}

function drawSavegameSlots() {
	for (var i=0; i<6; i++) {
		var slot = $($("#savegameSlots .slot")[i]);

		slot.empty();
		var json = existsSavegame(i);
		var imgSave = "<img src='/img/menu/save.png' class='save'/>";
		var imgLoad = "<img src='/img/menu/load.svg' class='load'/>";
		if (json) {
			var date = new Date(json.timestamp);
			var dateString = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear() +
					" - " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
			slot.html("<p><b>#" + (i + 1) + ":</b> " + dateString + "</p>" + imgLoad + imgSave);
		} else {
			slot.html("<p><b>#" + (i + 1) + "</b></p>" + imgSave);
		}
	}
}

// Queues the message for swhowing it in the dialog
function showText(text) {
	textMessages.push(text);
	if (!$($("#modalText")[0]).prop("open")) {
		showNextText();
	}
}

function showNextText() {
	var text = textMessages.shift();
	$("#modalText p").html(unescapeNewLinesHTML(text));
	$("#modalText")[0].showModal();
	
	// Remove bottom text
	$("#text").html("");
}

function randomString(length) {
	return Math.random().toString(36).substr(2, length);
}

function escapeSingleQuotes(text) {
	return text.replace(/'/g, "&#39;");
}