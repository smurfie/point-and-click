function loadInteractionsEditorJS() {
	$("#interactionList").change(function() {
		var hasValue = $(this).val() !== null;
		
		$("#interactionOnlyOnce").prop("disabled", !hasValue);
		$("#delInteractionButton").prop("disabled", !hasValue);
		$("#downInteractionButton").prop("disabled", !hasValue || $("#interactionList option:selected").val() === $("#interactionList option:last").val());
		$("#upInteractionButton").prop("disabled", !hasValue || $("#interactionList option:selected").val() === $("#interactionList option:first").val());
		currentInteractionsNumberDOM.text(currentInteractionList.length);
		
		//Adding conditions/actions depends on having an interaction selected
		$("#addInteractionConditionButton, #addInteractionActionButton").prop("disabled", !hasValue);
		
		if (hasValue) {
			currentInteraction = currentInteractionList[$(this).val()];
			$("#interactionOnlyOnce").prop("checked", currentInteraction.onlyOnce);
			
			//Load Conditions
			loadConditions($("#interactionConditionList"), currentInteraction.conditions);
			
			//Load Actions
			loadActions($("#interactionActionList"), currentInteraction.actions);
		} else {
			$("#interactionConditionList, #interactionActionList").empty();
			$("#interactionConditionList, #interactionActionList").change();
		}
	});
	
	$("#addInteractionButton").click(function(){
		currentInteractionList.push({
			onlyOnce: false,
			conditions: [],
			actions: []
		});
		var i = currentInteractionList.length-1;
		var option = $("<option value='" + i + "'>" + i + "</option>");
		option.prop("title", i);
		$("#interactionList").append(option);
		$("#interactionList").val(i);
		$("#interactionList").change();
		$("#delInteractionButton").show();
		$("#interactionOnlyOnce").prop("checked", false);
	});
	
	$("#delInteractionButton").click(function(){
		var sure = confirm("Sure you want to delete this interaction?");
		if (sure) {
			delInteraction($("#interactionList").val(), currentInteractionList, $("#interactionList"));
		}
	});
	
	$("#downInteractionButton").click(function() {
		var i = parseInt($("#interactionList").val());
		var tmp = currentInteractionList[i];
		currentInteractionList[i] = currentInteractionList[i+1];
		currentInteractionList[i+1] = tmp;
		loadInteractions($("#interactionList"), currentInteractionList, i+1);
	});
	
	$("#upInteractionButton").click(function() {
		var i = parseInt($("#interactionList").val());
		var tmp = currentInteractionList[i];
		currentInteractionList[i] = currentInteractionList[i-1];
		currentInteractionList[i-1] = tmp;
		loadInteractions($("#interactionList"), currentInteractionList, i-1);
	});
	
	// We save this value on the fly (to not create a save button only for it
	$("#interactionOnlyOnce").change(function() {
		currentInteraction.onlyOnce = $(this).prop("checked");
	});
}

function loadInteractions(select, interactions, interactionId) {
	select.empty();
	for (var i=0; i<interactions.length; i++) {
		var option = $("<option value='" + i + "'>" + i + "</option>");
		option.prop("title", i);
		select.append(option);
	}
	selectValue(select, interactionId);
}

function loadConditions(select, conditions, conditionId) {
	select.empty();
	for (var i=0; conditions && i<conditions.length; i++) {
		var option = $("<option value='" + i + "'>" + conditionDescription(conditions[i]) + "</option>");
		option.prop("title", conditionDescription(conditions[i]));
		select.append(option);
	}
	selectValue(select, conditionId);
}

function loadActions(select, actions, actionId) {
	select.empty();
	for (var i=0; actions && i<actions.length; i++) {
		var option = $("<option value='" + i + "'>" + actionDescription(actions[i]) + "</option>");
		option.prop("title", actionDescription(actions[i]))
		select.append(option);
	}
	selectValue(select, actionId);
}

function delInteraction(interactionId, interactionList, interactionListDOM) {
	var interaction = interactionList[interactionId];
	
	//We have to delete recursively all conditions and actions first
	if (interaction.conditions) {
		for (var i=interaction.conditions.length-1; i>=0; i--) {
			delCondition(i, interaction.conditions, $("#interactionConditionsList"));
		}
	}
	
	if (interaction.actions) {
		for (var i=interaction.actions.length-1; i>=0; i--) {
			delAction(i, interaction.actions, $("#interactionActionList"));
		}
	}
	
	interactionList.splice(interactionId, 1);
	if (interactionListDOM) {
		loadInteractions(interactionListDOM, interactionList);
	}
}

function loadInteractionsModal(interactionsNumberDOM, interactionList) {
	currentInteractionsNumberDOM = interactionsNumberDOM;
	currentInteractionList = interactionList
	
	loadInteractions($("#interactionList"), currentInteractionList);
	$("#interactionsEditor")[0].showModal();
}