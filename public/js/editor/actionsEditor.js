function loadActionsEditorJS() {
	$("#editInteractionActionButton").click(function() {
		editActionButton(currentInteraction.actions, $("#interactionActionList"));
	});
	
	$("#addInteractionActionButton").click(function() {
		addActionButton(currentInteraction.actions, $("#interactionActionList"));
	});
	
	$("#delInteractionActionButton").click(function() {
		var sure = confirm("Sure you want to delete this action?");
		if (sure) {
			delAction($("#interactionActionList").val(),currentInteraction.actions, $("#interactionActionList"));
		}
	});
	
	$("#downInteractionActionButton").click(function() {
		var i = parseInt($("#interactionActionList").val());
		var tmp = currentInteraction.actions[i];
		currentInteraction.actions[i] = currentInteraction.actions[i+1];
		currentInteraction.actions[i+1] = tmp;
		loadActions($("#interactionActionList"), currentInteraction.actions, i+1);
	});
	
	$("#upInteractionActionButton").click(function() {
		var i = parseInt($("#interactionActionList").val());
		var tmp = currentInteraction.actions[i];
		currentInteraction.actions[i] = currentInteraction.actions[i-1];
		currentInteraction.actions[i-1] = tmp;
		loadActions($("#interactionActionList"), currentInteraction.actions, i-1);
	});
	
	// Modal Actions
	$("#actionTypeList").change(function() {
		$(".actionType").hide();
		$("." + actionClass($(this).val())).show();
		$("#saveAction").prop("disabled", false);
		loadActionsMenu($(this).val());
	});
	
	$("#saveAction").click(function() {
		saveAction();
	});
	
	// Lists
	$("#interactionActionList").change(function() {
		var hasValue = $(this).val() !== null;
		$("#editInteractionActionButton").prop("disabled", !hasValue);
		$("#delInteractionActionButton").prop("disabled", !hasValue);
		$("#downInteractionActionButton").prop("disabled", !hasValue || $(this).find("option:selected").val() === $(this).find("option:last").val());
		$("#upInteractionActionButton").prop("disabled", !hasValue || $(this).find("option:selected").val() === $(this).find("option:first").val());
	});
	
	$("#actionMixtureList").change(function() {
		var hasValue = $(this).val() !== null;
		$("#editActionMixtureButton").prop("disabled", !hasValue);
		$("#delActionMixtureButton").prop("disabled", !hasValue);
	});
	
	// Modal Lists
	$("#actionScreenList").change(function() {
		if (!$(this).val()) {
			return;
		}
		// If in edit mode, select the value passed. Otherwise, if the screen==currentScreen select the currentArea, otherwise null.
		loadAreas($("#actionAreaList"), stage.screens[$(this).val()].areas, $("#saveAction").closest("dialog").hasClass("loadData") ?
				currentActionList[parseInt($("#actionId").val())].area : 
				$(this).val()==currentScreenId ? currentAreaId : null, true);
		
		loadScreenImages($("#actionScreenImageList"), stage.screens[$(this).val()].images, $("#saveAction").closest("dialog").hasClass("loadData") ?
				currentActionList[parseInt($("#actionId").val())].image : null);
	});
	
	$("#actionAreaList").change(function() {
		if (!$(this).val()) {
			return;
		}
		loadStates($("#actionAreaStateList"), stage.screens[$("#actionScreenList").val()].areas[$(this).val()].states,
			$("#saveAction").closest("dialog").hasClass("loadData") ? currentActionList[parseInt($("#actionId").val())].state : null);
	});
	
	
	$("#actionAreaStateList").change(function() {
		$("#saveAction").prop("disabled", $(this).is(":visible") && $(this).val()==null);
	});

	$("#actionTalkList").change(function() {
		$("#saveAction").prop("disabled", false);
	});
	
	// Filters
	$("#filterTalk").on("input", function() {
		var filter = $(this).val();
		$("#actionTalkList option").each(function(){
			$(this).toggle($(this).text().toLowerCase().indexOf(filter.toLowerCase()) >= 0);
		});
		
		// If the selected option is not visible disable the save button
		$("#saveAction").prop("disabled", !$("#actionTalkList option:selected").is(":visible"));
	});
}

function editActionButton(actions, actionsDOM) {
	currentActionList = actions;
	currentActionListDOM = actionsDOM;
	$("#actionEditor").removeClass("add");
	$("#actionEditor").addClass("loadData");
	$("#actionId").val(currentActionListDOM.val());
	selectValue($("#actionTypeList"), currentActionList[currentActionListDOM.val()].typeId);
	$("#actionEditor")[0].showModal();
}

function addActionButton(actions, actionsDOM) {
	currentActionList = actions;
	currentActionListDOM = actionsDOM;
	$("#actionEditor").addClass("add");
	selectValue($("#actionTypeList"));
	$("#actionEditor")[0].showModal();
}

function loadActionTypes() {
	$("#actionTypeList").empty();
	for (var key in ACTIONS) {
		if (ACTIONS.hasOwnProperty(key)) {
			var option = $("<option value=" + ACTIONS[key] + ">" + actionName(ACTIONS[key]) + "</option>");
			option.prop("title",  actionName(ACTIONS[key]));
			$("#actionTypeList").append(option);
		}
	}
	selectValue($("#actionTypeList"));
}

function actionName(actionTypeId) {
	if (typeof actionTypeId !== "number") {
		actionTypeId = parseInt(actionTypeId);
	}
		
	switch (actionTypeId) {
		case ACTIONS.GO_TO:
			return "Go To";
		case ACTIONS.PICK_UP_OBJECT:
			return "Pick up Object";
		case ACTIONS.REMOVE_OBJECT:
			return "Remove Object";
		case ACTIONS.HIDE_AREA:
			return "Hide Area";
		case ACTIONS.SHOW_AREA:
			return "Show Area";
		case ACTIONS.SHOW_TEXT:
			return "Show Text";
		case ACTIONS.COMPLETE_OBJECTIVE:
			return "Complete Objective";
		case ACTIONS.AREA_CHANGE_STATE:
			return "Area Change State";
		case ACTIONS.SCREEN_CHANGE_IMAGE:
			return "Screen Change Image";
		case ACTIONS.TALK:
			return "Talk";
		case ACTIONS.END:
			return "End";
	}
	return "NO_NAME!";
}

function actionClass(actionTypeId) {
	if (typeof actionTypeId !== "number") {
		actionTypeId = parseInt(actionTypeId);
	}
	
	switch (actionTypeId) {
		case ACTIONS.GO_TO:
			return "goTo";
		case ACTIONS.PICK_UP_OBJECT:
			return "pickUpObject";
		case ACTIONS.REMOVE_OBJECT:
			return "removeObject";
		case ACTIONS.HIDE_AREA:
			return "hideArea";
		case ACTIONS.SHOW_AREA:
			return "showArea";
		case ACTIONS.SHOW_TEXT:
			return "showText";
		case ACTIONS.COMPLETE_OBJECTIVE:
			return "completeObjective";
		case ACTIONS.AREA_CHANGE_STATE:
			return "areaChangeState";
		case ACTIONS.SCREEN_CHANGE_IMAGE:
			return "screenChangeImage";
		case ACTIONS.TALK:
			return "talk";
		case ACTIONS.END:
			return "end";
	}
	return "NO_CLASS";
}

function actionDescription(action) {
	switch (action.typeId) {
		case ACTIONS.GO_TO:
			return "Go To: " + stage.screens[action.screen].name;
		case ACTIONS.PICK_UP_OBJECT:
			return "Pick up Object: " + stage.objects[action.object].name;
		case ACTIONS.REMOVE_OBJECT:
			return "Remove Object: " + stage.objects[action.object].name;
		case ACTIONS.HIDE_AREA:
			return "Hide Area: " + stage.screens[action.screen].areas[action.area].name + " (" + stage.screens[action.screen].name + ")";
		case ACTIONS.SHOW_AREA:
			return "Show Area: " + stage.screens[action.screen].areas[action.area].name + " (" + stage.screens[action.screen].name + ")";
		case ACTIONS.SHOW_TEXT:
			return "Show Text: " + getText(action.text);
		case ACTIONS.COMPLETE_OBJECTIVE:
			return "Complete Objective: " + stage.objectives[action.objective].name;
		case ACTIONS.AREA_CHANGE_STATE:
			return "Area Change State: " + stage.screens[action.screen].areas[action.area].name + " (" + stage.screens[action.screen].name + "): "
					+ (action.state === "default" ? "default" : stage.screens[action.screen].areas[action.area].states[action.state].name);
		case ACTIONS.SCREEN_CHANGE_IMAGE:
			return "Screen Change Image: " + stage.screens[action.screen].name + " (" +  stage.screens[action.screen].images[action.image].name + ")";
		case ACTIONS.TALK:
			return "Talk: " + talkTextToShow(stage.talks[action.talk]);
		case ACTIONS.END:
			return "End";
	}
	return "NO_DESCRIPTION";
}

// Load (if dialog hasClass loadData, load the current action and remove the class)
function loadActionsMenu(actionTypeId) {
	if (typeof actionTypeId !== "number") {
		actionTypeId = parseInt(actionTypeId);
	}
	
	switch (actionTypeId) {
		case ACTIONS.GO_TO:
			loadActionGoTo();
			break;
		case ACTIONS.PICK_UP_OBJECT:
			loadActionPickUpObject();
			break;
		case ACTIONS.REMOVE_OBJECT:
			loadActionRemoveObject();
			break;
		case ACTIONS.HIDE_AREA:
			loadActionHideArea();
			break;
		case ACTIONS.SHOW_AREA:
			loadActionShowArea();
			break;
		case ACTIONS.SHOW_TEXT:
			loadActionShowText();
			break;
		case ACTIONS.COMPLETE_OBJECTIVE:
			loadActionCompleteObjective();
			break;
		case ACTIONS.AREA_CHANGE_STATE:
			loadActionAreaChangeState();
			break;
		case ACTIONS.SCREEN_CHANGE_IMAGE:
			loadActionScreenChangeImage();
			break;
		case ACTIONS.TALK:
			loadActionTalk();
			break;
		case ACTIONS.END:
			break;
	}
	$("#saveAction").closest("dialog").removeClass("loadData");
}

function loadActionGoTo() {
	loadScreens($("#actionScreenList"), $("#saveAction").closest("dialog").hasClass("loadData") ?
			currentActionList[parseInt($("#actionId").val())].screen : "last");
}

function loadActionPickUpObject() {
	loadObjects($("#actionObjectList"), $("#saveAction").closest("dialog").hasClass("loadData") ?
			currentActionList[parseInt($("#actionId").val())].object : "last");
	$("#actionObjectNum").val($("#saveAction").closest("dialog").hasClass("loadData") ?
			currentActionList[parseInt($("#actionId").val())].num : 1);
	
	// If there is no objects disable the save button
	$("#saveAction").prop("disabled", $("#actionObjectList").val() === null);
}

function loadActionRemoveObject() {
	loadActionPickUpObject();
}

function loadActionHideArea() {
	loadActionScreens();
}

function loadActionShowArea() {
	loadActionScreens();
}

function loadActionScreens() {
	loadScreens($("#actionScreenList"), $("#saveAction").closest("dialog").hasClass("loadData") ?
			currentActionList[parseInt($("#actionId").val())].screen : currentScreenId);
	
	// If there is no area (because screen always exists at least one) disable the save button
	$("#saveAction").prop("disabled", $("#actionAreaList").val() === null);
}

function loadActionShowText() {
	$("#actionTextTextarea").val($("#saveAction").closest("dialog").hasClass("loadData") ?
			getText(currentActionList[$("#actionId").val()].text) : "");
}

function loadActionCompleteObjective() {
	loadObjectives($("#actionObjectiveList"), $("#saveAction").closest("dialog").hasClass("loadData") ?
			currentActionList[parseInt($("#actionId").val())].objective : "last");
	
	// If there is no objectives disable the save button
	$("#saveAction").prop("disabled", $("#actionObjectiveList").val() === null);
}

function loadActionAreaChangeState() {
	loadActionScreens();
}

function loadActionScreenChangeImage() {
	loadActionScreens();
}

function loadActionTalk() {
	$("#filterTalk").val("");
	loadAllTalks($("#actionTalkList"));
	$("#saveAction").prop("disabled", $("#actionTalkList").val() === null);
}

// Save
function saveAction() {
	actionTypeId = parseInt($("#actionTypeList").val());
	
	if ($("#saveAction").closest("dialog").hasClass("add")) {
		if (!currentActionList) {
			// We are creating an action for a mixture:
			var obj1 = $("#mixture1List").val();
			var obj2 = $("#mixture2List").val();
			if (!stage.mixtures[obj1]) {
				stage.mixtures[obj1] = {};
			}
			if (!stage.mixtures[obj1][obj2]) {
				stage.mixtures[obj1][obj2] = {};
			}
			if (!stage.mixtures[obj1][obj2].actions) {
				stage.mixtures[obj1][obj2].actions = [];
			}
			currentActionList = stage.mixtures[obj1][obj2].actions;
			repaintMixture2();
		}		
		currentActionList.push({typeId: actionTypeId});
		$("#actionId").val(currentActionList.length-1);
		var option = $("<option value='" + $("#actionId").val() + "'>" + "</option>");
		currentActionListDOM.append(option);
	} else {
		// Clear the object (To avoid having unused variables in case of a typeId change for example)
		if (currentActionList[$("#actionId").val()].text) {
			delText(currentActionList[$("#actionId").val()].text);
		}
		currentActionList[$("#actionId").val()] = {};
		currentActionList[$("#actionId").val()].typeId = actionTypeId;
	}
	
	switch (actionTypeId) {
		case ACTIONS.GO_TO:
			saveActionGoTo();
			break;
		case ACTIONS.PICK_UP_OBJECT:
			saveActionPickUpObject();
			break;
		case ACTIONS.REMOVE_OBJECT:
			saveActionRemoveObject();
			break;
		case ACTIONS.HIDE_AREA:
			saveActionHideArea();
			break;
		case ACTIONS.SHOW_AREA:
			saveActionShowArea();
			break;
		case ACTIONS.SHOW_TEXT:
			saveActionShowText();
			break;
		case ACTIONS.COMPLETE_OBJECTIVE:
			saveActionCompleteObjective();
			break;
		case ACTIONS.AREA_CHANGE_STATE:
			saveActionAreaChangeState();
			break;
		case ACTIONS.SCREEN_CHANGE_IMAGE:
			saveActionScreenChangeImage();
			break;
		case ACTIONS.TALK:
			saveActionTalk();
			break;
		case ACTIONS.END:
			break;
	}
	$("#saveAction").closest("dialog")[0].close();
	currentActionListDOM.find("option[value=" + $("#actionId").val() + "]").html(actionDescription(currentActionList[$("#actionId").val()]));
	currentActionListDOM.find("option[value=" + $("#actionId").val() + "]").prop("title", actionDescription(currentActionList[$("#actionId").val()]));
	currentActionListDOM.change();
}

function saveActionGoTo() {
	currentActionList[$("#actionId").val()].screen = $("#actionScreenList").val();
}

function saveActionPickUpObject() {
	currentActionList[$("#actionId").val()].object = $("#actionObjectList").val();
	currentActionList[$("#actionId").val()].num = parseInt($("#actionObjectNum").val());
}

function saveActionRemoveObject() {
	currentActionList[$("#actionId").val()].object = $("#actionObjectList").val();
	currentActionList[$("#actionId").val()].num = parseInt($("#actionObjectNum").val());
}

function saveActionHideArea() {
	saveActionArea();
}

function saveActionShowArea() {
	saveActionArea();
}

function saveActionArea() {
	currentActionList[$("#actionId").val()].screen = $("#actionScreenList").val();
	currentActionList[$("#actionId").val()].area = $("#actionAreaList").val();
}

function saveActionShowText() {
	// If the text is already created update it, if not create it
	if (currentActionList[$("#actionId").val()].text) {
		setText($("#actionTextTextarea").val(), currentActionList[$("#actionId").val()].text);
	} else {
		currentActionList[$("#actionId").val()].text = createText($("#actionTextTextarea").val());
	}
}

function saveActionCompleteObjective() {
	currentActionList[$("#actionId").val()].objective = $("#actionObjectiveList").val();
}

function saveActionAreaChangeState() {
	currentActionList[$("#actionId").val()].screen = $("#actionScreenList").val();
	currentActionList[$("#actionId").val()].area = $("#actionAreaList").val();
	currentActionList[$("#actionId").val()].state = $("#actionAreaStateList").val();
}

function saveActionScreenChangeImage() {
	currentActionList[$("#actionId").val()].screen = $("#actionScreenList").val();
	currentActionList[$("#actionId").val()].image = $("#actionScreenImageList").val();
}

function saveActionTalk() {
	currentActionList[$("#actionId").val()].talk = $("#actionTalkList").val();
}

// Deletes the idAction from actionList and updates the actionListDOM if provided
function delAction(idAction, actionList, actionListDOM) {
	// If it has text delete it first
	if (actionList[idAction].text) {
		delText(actionList[idAction].text);
	}
	actionList.splice(idAction, 1);
	
	if (actionListDOM) {
		loadActions(actionListDOM, actionList);
	}
}