function loadConditionsEditorJS() {
	$("#editInteractionConditionButton").click(function() {
		editConditionButton(currentInteraction.conditions, $("#interactionConditionList"));
	});
	
	$("#addInteractionConditionButton").click(function() {
		addConditionButton(currentInteraction.conditions, $("#interactionConditionList"));
	});
	
	$("#delInteractionConditionButton").click(function() {
		var sure = confirm("Sure you want to delete this condition?");
		if (sure) {
			delCondition($("#interactionConditionList").val(), currentInteraction.conditions, $("#interactionConditionList"));
		}
	});
	
	$("#downInteractionConditionButton").click(function() {
		var i = parseInt($("#interactionConditionList").val());
		var tmp = currentInteraction.conditions[i];
		currentInteraction.conditions[i] = currentInteraction.conditions[i+1];
		currentInteraction.conditions[i+1] = tmp;
		loadConditions($("#interactionConditionList"), currentInteraction.conditions, i+1);
	});
	
	$("#upInteractionConditionButton").click(function() {
		var i = parseInt($("#interactionConditionList").val());
		var tmp = currentInteraction.conditions[i];
		currentInteraction.conditions[i] = currentInteraction.conditions[i-1];
		currentInteraction.conditions[i-1] = tmp;
		loadConditions($("#interactionConditionList"), currentInteraction.conditions, i-1);
	});
	
	// Modal Conditions
	$("#conditionTypeList").change(function() {
		$(".conditionType").hide();
		$("." + conditionClass($(this).val())).show();
		$("#saveCondition").prop("disabled", false);
		loadConditionsMenu($(this).val());
	});
	
	$("#saveCondition").click(function() {
		saveCondition();
	});
	
	// Lists
	$("#interactionConditionList").change(function() {
		var hasValue = $(this).val() !== null;
		$("#editInteractionConditionButton").prop("disabled", !hasValue);
		$("#delInteractionConditionButton").prop("disabled", !hasValue);
		$("#downInteractionConditionButton").prop("disabled", !hasValue || $(this).find("option:selected").val() === $(this).find("option:last").val());
		$("#upInteractionConditionButton").prop("disabled", !hasValue || $(this).find("option:selected").val() === $(this).find("option:first").val());
	});
	
	$("#conditionMixtureList").change(function() {
		var hasValue = $(this).val() !== null;
		$("#editConditionMixtureButton").prop("disabled", !hasValue);
		$("#delConditionMixtureButton").prop("disabled", !hasValue);
	});
	
	// Modal Lists
	$("#conditionScreenList").change(function() {
		if (!$(this).val()) {
			return;
		}
		loadAreas($("#conditionAreaList"), stage.screens[$(this).val()].areas, $("#saveCondition").closest("dialog").hasClass("loadData") ?
				currentConditionList[parseInt($("#conditionId").val())].area : 
				$(this).val()==currentScreenId ? currentAreaId : null, true);
	});
	
	$("#conditionAreaList").change(function() {
		if (!$(this).val()) {
			return;
		}
		loadStates($("#conditionAreaStateList"), stage.screens[$("#conditionScreenList").val()].areas[$(this).val()].states,
				$("#saveCondition").closest("dialog").hasClass("loadData") ? currentConditionList[parseInt($("#conditionId").val())].state : null);
	});
	
	$("#conditionAreaStateList").change(function() {
		$("#saveCondition").prop("disabled", $(this).is(":visible") && $(this).val()==null);
	});
}

function editConditionButton(conditions, conditionsDOM) {
	currentConditionList = conditions;
	currentConditionListDOM = conditionsDOM;
	$("#conditionEditor").removeClass("add");
	$("#conditionEditor").addClass("loadData");
	$("#conditionId").val(currentConditionListDOM.val());
	selectValue($("#conditionTypeList"), currentConditionList[currentConditionListDOM.val()].typeId);
	$("#conditionEditor")[0].showModal();
}

function addConditionButton(conditions, conditionsDOM) {
	currentConditionList = conditions;
	currentConditionListDOM = conditionsDOM;
	$("#conditionEditor").addClass("add");
	selectValue($("#conditionTypeList"));
	$("#conditionEditor")[0].showModal();
}

function loadConditionTypes() {
	$("#conditionTypeList").empty();
	for (var key in CONDITIONS) {
		if (CONDITIONS.hasOwnProperty(key)) {
			var option = $("<option value=" + CONDITIONS[key] + ">" + conditionName(CONDITIONS[key]) + "</option>");
			option.prop("title", conditionName(CONDITIONS[key]));
			$("#conditionTypeList").append(option);
		}
	}
	selectValue($("#conditionTypeList"));
}

function conditionName(conditionTypeId) {
	if (typeof conditionTypeId !== "number") {
		conditionTypeId = parseInt(conditionTypeId);
	}
		
	switch (conditionTypeId) {
		case CONDITIONS.HAS_OBJECT:
			return "Has Object";
		case CONDITIONS.OBJECTIVE_COMPLETED:
			return "Objective Completed";
		case CONDITIONS.AREA_HAS_STATE:
			return "Area Has State";
	}
	return "NO_NAME!";
}

function conditionClass(conditionTypeId) {
	if (typeof conditionTypeId !== "number") {
		conditionTypeId = parseInt(conditionTypeId);
	}
	
	switch (conditionTypeId) {
		case CONDITIONS.HAS_OBJECT:
			return "hasObject";
		case CONDITIONS.OBJECTIVE_COMPLETED:
			return "objectiveCompleted";
		case CONDITIONS.AREA_HAS_STATE:
			return "areaHasState";
	}
	return "NO_CLASS";
}

function conditionDescription(condition) {
	var not = condition.negate ? "(NOT) " : "";
	switch (condition.typeId) {
		case CONDITIONS.HAS_OBJECT:
			return not + "Has Object: " + stage.objects[condition.object].name;
		case CONDITIONS.OBJECTIVE_COMPLETED:
			return not + "Objective Completed: " + stage.objectives[condition.objective].name;
		case CONDITIONS.AREA_HAS_STATE:
			return not +"Area Has State: " + stage.screens[condition.screen].areas[condition.area].name + " (" + stage.screens[condition.screen].name + "): "
					+ (condition.state === "default" ? "default" : stage.screens[condition.screen].areas[condition.area].states[condition.state].name);
	}
	return "NO_DESCRIPTION";
}

// Load (if dialog hasClass loadData, load the current condition and remove the class)
function loadConditionsMenu(conditionTypeId) {
	if (typeof conditionTypeId !== "number") {
		conditionTypeId = parseInt(conditionTypeId);
	}
	$("#conditionNegate").prop('checked', $("#saveCondition").closest("dialog").hasClass("loadData") && currentConditionList[parseInt($("#conditionId").val())].negate == true );
	
	switch (conditionTypeId) {
		case CONDITIONS.HAS_OBJECT:
			loadConditionHasObject();
			break;
		case CONDITIONS.OBJECTIVE_COMPLETED:
			loadConditionObjectiveCompleted();
			break;
		case CONDITIONS.AREA_HAS_STATE:
			loadConditionAreaHasState();
			break;
	}
	$("#saveCondition").closest("dialog").removeClass("loadData");
}

function loadConditionHasObject() {
	loadObjects($("#conditionObjectList"), $("#saveCondition").closest("dialog").hasClass("loadData") ? 
			currentConditionList[parseInt($("#conditionId").val())].object : "last");
	$("#conditionObjectNum").val($("#saveCondition").closest("dialog").hasClass("loadData") ? 
			currentConditionList[parseInt($("#conditionId").val())].num : "1");
	
	// If there is no objects disable the save button
	$("#saveCondition").prop("disabled", $("#conditionObjectList").val() === null);
}

function loadConditionObjectiveCompleted() {
	loadObjectives($("#conditionObjectiveList"), $("#saveCondition").closest("dialog").hasClass("loadData") ?
			currentConditionList[parseInt($("#conditionId").val())].objective : "last");
	
	// If there is no objectives disable the save button
	$("#saveCondition").prop("disabled", $("#conditionObjectiveList").val() === null);
}

function loadConditionAreaHasState() {
	loadScreens($("#conditionScreenList"), $("#saveCondition").closest("dialog").hasClass("loadData") ? 
			currentConditionList[parseInt($("#conditionId").val())].screen : currentScreenId);
	
	// If there is no area (because screen always exists at least one) disable the save button
	$("#saveCondition").prop("disabled", $("#conditionAreaList").val() === null);
}

// Save
function saveCondition() {
	conditionTypeId = parseInt($("#conditionTypeList").val());
	conditionNegate = $("#conditionNegate").is(":checked");
	
	if ($("#saveCondition").closest("dialog").hasClass("add")) {
		if (!currentConditionList) {
			// We are creating a condition for a mixture:
			var obj1 = $("#mixture1List").val();
			var obj2 = $("#mixture2List").val();
			if (!stage.mixtures[obj1]) {
				stage.mixtures[obj1] = {};
			}
			if (!stage.mixtures[obj1][obj2]) {
				stage.mixtures[obj1][obj2] = {};
			}
			if (!stage.mixtures[obj1][obj2].conditions) {
				stage.mixtures[obj1][obj2].conditions = [];
			}
			currentConditionList = stage.mixtures[obj1][obj2].conditions;
			repaintMixture2();
		}
		currentConditionList.push({
			"typeId": conditionTypeId,
			"negate": conditionNegate
		});
		$("#conditionId").val(currentConditionList.length-1);
		var option = $("<option value='" + $("#conditionId").val() + "'>" + "</option>");
		currentConditionListDOM.append(option);
	}  else {
		currentConditionList[$("#conditionId").val()].typeId = conditionTypeId;
		currentConditionList[$("#conditionId").val()].negate = conditionNegate;
	}
	
	switch (conditionTypeId) {
		case CONDITIONS.HAS_OBJECT:
			saveConditionHasObject();
			break;
		case CONDITIONS.OBJECTIVE_COMPLETED:
			saveConditionObjectiveCompleted();
			break;
		case CONDITIONS.AREA_HAS_STATE:
			saveConditionAreaHasState();
			break;
	}
	$("#saveCondition").closest("dialog")[0].close();
	currentConditionListDOM.find("option[value=" + $("#conditionId").val() + "]").html(conditionDescription(currentConditionList[$("#conditionId").val()]));
	currentConditionListDOM.find("option[value=" + $("#conditionId").val() + "]").prop("title", conditionDescription(currentConditionList[$("#conditionId").val()]));
	currentConditionListDOM.change();
}

function saveConditionHasObject() {
	currentConditionList[$("#conditionId").val()].object = $("#conditionObjectList").val();
	currentConditionList[$("#conditionId").val()].num = $("#conditionObjectNum").val();
}

function saveConditionObjectiveCompleted() {
	currentConditionList[$("#conditionId").val()].objective = $("#conditionObjectiveList").val();
}

function saveConditionAreaHasState() {
	currentConditionList[$("#conditionId").val()].screen = $("#conditionScreenList").val();
	currentConditionList[$("#conditionId").val()].area = $("#conditionAreaList").val();
	currentConditionList[$("#conditionId").val()].state = $("#conditionAreaStateList").val();
}

// Deletes the idCondition from conditionList and updates the conditionListDOM if provided
function delCondition(idCondition, conditionList, conditionListDOM) {
	conditionList.splice(idCondition, 1);
	if (conditionListDOM) {
		loadConditions(conditionListDOM, conditionList);
	}
}