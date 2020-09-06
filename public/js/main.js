"use strict";

$(document).ready(function() {
	// Dialog polyfill
	var dialog = document.querySelector('dialog');
	dialogPolyfill.registerDialog(dialog);
	// Now dialog acts like a native <dialog>.
	
	$("#modalText").click(function() {
		if ($("#modalText:visible").length > 0) {
			$("#modalText:visible")[0].close();
			if (textMessages.length > 0) {
				showNextText();
			}
		}
	});
	
	$("#inventory").on("mouseenter", "img", function(){
		if (!currentObject) {
			$("#text").html($(this).data("object-description"));
		} else if (currentObject != $(this).data("object")) {
			$("#text").html($("#text").html() + "<span>" + $(this).data("object-description") + "</span>")
		}
	});
	
	$("#inventory").on("mouseleave", "img", function(){
		if (!currentObject) {
			$("#text").html("");
		} else if (currentObject != $(this).data("object")) {
			$("#text span").remove();
		}
	});
	
	$("#inventory").on("click", "img", function(){
		if (!currentObject) { // Select object
			selectObject($(this));
		} else if (currentObject == $(this).data("object")) { // Unselect object
			unselectObject();
		} else {
			useObjectObject(currentObject, $(this).data("object"));
		}
	});
	
	$("#inventory").on("click", ".optionsMenu", function() {
		drawOptionsMenu();
		$("#options").show();
	});
	
	$("#languageOptions").on("click", "a" ,function() {
		$("#languageOptions a").removeClass("active");
		$(this).addClass("active");
	});
	
	$("#okOption").click(function() {
		defaultLanguage = $("#languageOptions a.active").data("lang");
		updateStageName();

		// Reload the screen and inventory to let changes take effect
		drawInventory();
		loadScreen(currentScreenId);
		
		$("#options").hide();
	});
	
	$("#cancelOption").click(function() {
		$("#options").hide();
	});
	
	// If not object is selected, unselect the currentObject
	$("#canvas").click(function(){
		if (currentObject) {
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
var imagePath, cursorPath;
var stagePath, stageImagePath, stageScreenPath, stageObjectPath, stageAreaPath, stageCharacterPath;
var inventory = [];
var objectivesCompleted = {};
var currentScreen, currentScreenId, currentArea, currentObject;
var numImages = 0, loadedImages = 0;
var textMessages = [];
var defaultLanguage;
var drawOptions = false;

function init() {
	updateToLastVersion();
	
	defaultLanguage = stage.defaultLanguage;
	
	imagePath = "/img/";
	cursorPath = imagePath + "cursor/";
	
	stagePath = "/stage/" + stage.folderName + "/";
	stageImagePath = stagePath + "img/";
	stageScreenPath = stageImagePath + "screens/";
	stageObjectPath = stageImagePath + "objects/";
	stageAreaPath = stageImagePath + "areas/";
	stageCharacterPath = stageImagePath + "characters/";
	
	// If more than one language, draw the options menu
	if (Object.keys(stage.languages).length > 1) {
		drawOptions = true;
	}

	updateStageName()
	scaleCanvas();
	drawInventory();
	loadStage();
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
		$("#text").css("width", (stage.width + 186) + "px");
		$("#options").css("width", (stage.width + 186) + "px");
		
		$("#conversationText").css("width", (stage.width - 300) + "px");
		$("#conversationOptions").css("width", (stage.width - 80) + "px");
	}
}

function loadStage() {
	loadScreen(stage.initialScreen);
}

function loadScreen(screenId) {
	$("#loadingCanvas").css("background-image", "url('" + imagePath + "loading.gif')");
	$("#loadingCanvas").show();
	currentScreenId = screenId;
	currentScreen = stage.screens[screenId];
	
	$("#canvas").empty();
	// If the currentImage for that screen is empty select the defaultImage
	currentScreen.currentImage = currentScreen.currentImage || currentScreen.defaultImage;
	// Choose between absolute or relative image
	var screenPath = currentScreen.images[currentScreen.currentImage].img;
	screenPath = isAbsolutePath(screenPath) ? screenPath : stageScreenPath + screenPath;
	loadAsynchronousImage($('#canvas'), screenPath, true);
	
	$("#text").empty();
	for (var areaId in currentScreen.areas) {
		if (currentScreen.areas.hasOwnProperty(areaId)) {
			loadArea(areaId);
		}
	}
	// Execute onLoadActions
	currentArea = currentScreen.areas.onLoad;
	findAndExecuteActions(currentArea.interactions);
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
	if (areaId!="onLoad") {
		var stateId = currentScreen.areas[areaId].currentState || "default";
		var area = currentScreen.areas[areaId];
		var state = stateId !== "default" ? area.states[stateId] : null;
		
		// Load all areas, even the hidden ones
		var img = $("<img id='object_" + areaId + "' class='area" + (getAreaStateProperty(areaId, stateId, "hidden") ? " hidden" : "") + "'>");
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
			if (!currentObject) {
				$("#text").html(description);
			} else if (currentObject != $(this).data("object")) {
				$("#text").html($("#text").html() + "<span>" + description + "</span>")
			}		
		});
		
		img.mouseleave(function(){
			if (!currentObject) {
				$("#text").html("");
			} else {
				$("#text span").remove();
			}
		});
		
		img.click(function(e){
			e.preventDefault();
			e.stopPropagation();
			if (!currentObject) {
				currentArea = area;
				findAndExecuteActions(currentArea.interactions);
			} else {
				useObjectArea(currentObject, areaId);
			}
		});
		
		$("#canvas").append(img);
	}
}

function findAndExecuteActions(interactions) {	
	// Loop all interactions until found ONE that all conditions are fulfilled
	var i;
	for (i=0; i<interactions.length && !fulfillConditions(interactions[i].conditions); i++);
	
	var interactionFound = i < interactions.length;
	if (interactionFound) {
		// If there is an object selected (user is using one object with another), we always unselect it
		// except when there is only one action and it's showing a text (normally is the case when the action that the user
		// intended to do failed and a text is shown).
		if (currentObject && (interactions[i].actions.length!=1 || interactions[i].actions[0].typeId!=ACTIONS.SHOW_TEXT)) {
			unselectObject();
		}
		executeActions(interactions[i].actions);
		
		// If the interaction is marked to be executed only once, remove it.
		if (interactions[i].onlyOnce) {
			interactions.splice(i--, 1);
		}
		
		findAndExecuteTriggers();
	}
	return interactionFound;
}

function findAndExecuteTriggers() {
	// Execute all triggers than fulfill its conditions
	for (var i=0; i<stage.triggers.length; i++) {
		if (fulfillConditions(stage.triggers[i].conditions)) {
			executeActions(stage.triggers[i].actions);
			
			// If the trigger has the flag onlyOnce, delete it after executing his actions
			if (stage.triggers[i].onlyOnce) {
				stage.triggers.splice(i--, 1);
			}
		}
	}
}

function drawInventory() {
	$("#inventory").empty();
	
	if (drawOptions) {
		$("#inventory").append("<div class='inventorySlot optionsMenu'></div>");
	}
	
	var i=0;
	for (; i<inventory.length; i++) {
		var inventorySlot = $("<div class='inventorySlot'></div>");
		var object = stage.objects[inventory[i].object];
		var num = inventory[i].num;
		var img = object.img;
		var description = getText(object.description);
		for (var j=0; j<object.stacks.length && num>=object.stacks[j].minNumber; j++) {
			img = object.stacks[j].img;
			description = getText(object.stacks[j].description);
			
		}
		img = isAbsolutePath(img) ? img : stageObjectPath + img;
		var imgDOM = $("<img data-object='" + inventory[i].object + "' data-object-description='" + escapeSingleQuotes(description) +
				"' src='" + img + "'>");
		
		//If more than one item, print how many
		if (inventory[i].num > 1) {
			var p = $("<p class='inventoryNum'>" + inventory[i].num + "</p>")
			inventorySlot.append(p);
		}		
		inventorySlot.append(imgDOM);
		$("#inventory").append(inventorySlot);
	}
	
	// Fill with empty spaces until all the screen is filled (horizontaly and vertically)
	for (i = drawOptions ? i+1 : i; i<12 || i%2 == 1; i++) {
		var inventorySlot = $("<div class='inventorySlot'></div>");
		$("#inventory").append(inventorySlot);
	}
}

function selectObject(objectDOM) {
	currentObject = objectDOM.data("object");
	objectDOM.parent().addClass("selected");
	$("#canvas").addClass("objectSelected");
	document.body.style.cursor="url('" + cursorPath + "gears.png') 10 10, default";
	$("#text").html(objectDOM.data("object-description") + " + ");
}

function unselectObject() {
	var objectDOM = $("#inventory img[data-object=" + currentObject + "]");
	currentObject = null;
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
	var screenArea = currentScreenId + "_" + areaId;
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

function drawOptionsMenu() {
	$("#languageOptions").empty();
	
	for (var key in stage.languages) {
		if (stage.languages.hasOwnProperty(key)) {
			var button = $("<a data-lang='" + key + "'><img src='../img/flags/" + key + ".png'/></a>");
			if (key === defaultLanguage) {
				button.addClass("active");
			}
			$("#languageOptions").append(button);
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