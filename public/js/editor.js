"use strict";

var stage;

$(document).ready(function(){
	
	//Change tab
	$("#navList li").click(function(e){
		e.preventDefault();
		$("#navList li").removeClass("active");
		$(this).addClass("active");
		$("#rightMenu .tab").hide();
		
		var menu =  $(this).data("id");
		
		// When visiting mixtures or triggers update the page
		if (menu === "mixturesMenu") {
			loadMixtures();
		}
		if (menu === "triggersMenu") {
			loadTriggers($("#triggerList"));
		}
		
		$("#" + menu).show();
	});
	
	//Press intro in dialog
	$("dialog input").keypress(function(e) {
		if (e.which == 13) {
			$(this).closest("dialog").find("button.defaultAction").click();
		}
	});
	
	$("button.closeModal").click(function(){
		$(this).closest("dialog")[0].close();
	});
	
	$("#tryItButton").click(function(){
		localStorage.setItem("stage", JSON.stringify(stage));
		window.open('/game');
	});

	$("#getJSONButton").click(function(){
		$("#getJSONModal textarea").val(JSON.stringify(stage));
		$("#getJSONModal")[0].showModal();
		$("#getJSONModal textarea").select();
	});
	
	$("#loadJSONButton").click(function(){
		$("#loadJSONModal textarea").val("");
		$("#loadJSONModal")[0].showModal();
	});
	
	$("#loadJSON").click(function(){
		stage = JSON.parse($("#loadJSONModal textarea").val());
		$("#loadJSONModal")[0].close();
		init();
	});
	
	$("#saveJSON").click(function(){
		download("stage.json", JSON.stringify(stage));
	});
	
	$("#loadJSONFromFile").click(function() {
		$("#importJSONFromFile").click();
	});
	
	$("#importJSONFromFile").change(function() {
		var reader = new FileReader();
		reader.onload = function() {
			stage = JSON.parse(this.result);
			$("#loadJSONModal")[0].close();
			init();
		};
		reader.readAsText($(this)[0].files[0]);
	});
	
	$("#visibleAreas").change(function(){
		$("#canvas").toggleClass("visibleAreas", $("#visibleAreas").val()==1 || $("#visibleAreas").val()==3);
		$("#canvas").toggleClass("noLineAreas", $("#visibleAreas").val()==2 || $("#visibleAreas").val()==3);
	});
	
	$("#folderName").change(function(){
		stage.folderName = $("#folderName").val();
		setPaths();
	});

	$("#stageName").change(function(){
		stage.name = $("#stageName").val();
		document.title = "Point and Click - Editor" + (stage.name.length > 0 ? " (" + stage.name + ")" : "");
	});
	
	$("#canvasWidth").change(function(){
		stage.width = parseInt($("#canvasWidth").val());
		scaleCanvas();
	});	
	
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
		init();
	}
});

var imagePath, cursorPath;
var stagePath, stageImagePath, stageScreenPath, stageObjectPath, stageAreaPath, stageCharacterPath;
var currentScreen, currentArea, currentState, currentInteraction, currentConditionList, currentConditionListDOM, 
	currentActionList, currentActionListDOM, currentObject, currentTrigger, currentTriggerId, currentCharacter,
	currentCharacterId, currentTalk, currentTalkId, currentAnswer;
var currentScreenId, currentAreaId, currentStateId, currentInteractionsNumberDOM, currentInteractionList;
var defaultLanguage;

//If refresh then the events won't be loaded again
function init(refresh) {
	if (typeof stage == "undefined") {
		stage = {
			screens: {},
			objects: {},
			objectives: {},
			mixtures: {},
			triggers: [],
			version: VERSION,
			folderName: stagename,
			width: 960,
			texts: {},
			defaultLanguage: "en_US",
			languages: {
				"en_US": "English"
			}
		}
	}
	
	updateToLastVersion();
	
	//Default language is loaded at beginning and not changed until reloading/reseting
	defaultLanguage = stage.defaultLanguage;
	$("#defaultLanguage").text(stage.languages[defaultLanguage]);
	
	scaleCanvas();
	
	//Load the other Javascript functions the first time the page is started
	if (!refresh) {
		loadScreensJS();
		loadClickablesJS();
		loadInteractionsEditorJS();
		loadConditionsEditorJS();
		loadActionsEditorJS();
		loadObjectsJS();
		loadObjectivesJS();
		loadMixturesJS();
		loadTriggersJS();
		loadCharactersJS();
		loadLanguagesJS();
	}
	
	//Load all the things that only need to be loaded once
	$("#folderName").val(stage.folderName);
	$("#folderName").change();
	$("#stageName").val(stage.name);
	$("#stageName").change();
	$("#canvasWidth").val(stage.width ? stage.width : 960);
	$("#canvasWidth").change();
	loadScreens($("#screenList"), stage.initialScreen);
	loadCursors($("#areaCursor"));
	loadObjects($("#objectList"));
	loadObjectives($("#objectiveList"));
	loadMixtures();
	loadCharacters($("#characterList"));
	loadLanguages($("#languageList"), defaultLanguage);
	loadConditionTypes();
	loadActionTypes();
}

function scaleCanvas() {
	if (stage.width) {
		$("#canvas").css("width", (stage.width + 4) + "px");
		$("#rightMenu").css("left", (stage.width + 4) + "px"); //4 for borders
		$("#rightMenu").css("width", "calc(100% - " + (stage.width + 24) + "px)"); //24 = 2+2+10+10 (borders + margins)
	}
}

function loadCursors(select, cursorId) {
	select.empty();
	for (var cursor in CURSORS) {
		if (CURSORS.hasOwnProperty(cursor)) {
			var option = $("<option value='" + CURSORS[cursor] + "'>" + cursor + "</option>");
			option.prop("title", cursor);
			select.append(option);
		}
	}
	selectValue(select, cursorId);
}

function randomString(length) {
	return Math.random().toString(36).substr(2, length);
}

//Select id. if not passed, select param ["first"(default) or "last"]
function selectValue(select, id) {
	id = id || "first";
	select.val(id!=="first" && id!=="last" ? id : select.find("option:" + id).val());
	select.change();
}

function setPaths() {
	imagePath = "/img/";
	cursorPath = imagePath + "cursor/";
	
	stagePath = "/stage/" + stage.folderName + "/";
	stageImagePath = stagePath + "img/";
	stageScreenPath = stageImagePath + "screens/";
	stageAreaPath = stageImagePath + "areas/";
	stageObjectPath = stageImagePath + "objects/";
	stageCharacterPath = stageImagePath + "characters/";
}