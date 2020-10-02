function loadTriggersJS() {
	
	//Triggers
	$("#triggerList").change(function(){
		var hasValue = $(this).val() != null;
		$("#editTriggerButton").prop("disabled", !hasValue);
		$("#delTriggerButton").prop("disabled", !hasValue);
		
		//Adding conditions/actions depends on having a trigger selected
		$("#addTriggerConditionButton, #addTriggerActionButton").prop("disabled", !hasValue);
		
		if (hasValue) {
			currentTriggerId = $(this).val();
			currentTrigger = stage.triggers[currentTriggerId];
				
			//Load Conditions
			loadConditions($("#triggerConditionList"), currentTrigger.conditions);
			
			//Load Actions
			loadActions($("#triggerActionList"), currentTrigger.actions);
		} else {
			$("#triggerConditionList, #triggerActionList").empty();
			$("#triggerConditionList, #triggerActionList").change();
		}
	});
	
	$("#editTriggerButton").click(function(){
		$("#triggerId").val(currentTriggerId);
		$("#triggerName").val(currentTrigger.name);
		$("#triggerOnlyOnce").prop('checked', currentTrigger.onlyOnce);
		$("#triggerEditor").removeClass("add");
		$("#triggerEditor")[0].showModal();
	});
	
	$("#addTriggerButton").click(function(){
		$("#triggerId").val(stage.triggers.length);
		$("#triggerName").val("");
		$("#triggerOnlyOnce").prop('checked', false);
		$("#triggerEditor").addClass("add");
		$("#triggerEditor")[0].showModal();
	});
	
	$("#delTriggerButton").click(function(){
		var sure = confirm("Sure you want to delete this trigger?");
		if (sure) {
			delTrigger(currentTriggerId);
		}
	});
	
	$("#saveTrigger").click(function() {
		var currentTriggerId = $("#triggerId").val();
		if ($(this).closest("dialog").hasClass("add")) {
			stage.triggers.push({
				name: $("#triggerName").val(),
				onlyOnce: $("#triggerOnlyOnce").prop('checked'),
				conditions: [],
				actions: []
			});
		} else {
			currentTrigger.name = $("#triggerName").val();
			currentTrigger.onlyOnce = $("#triggerOnlyOnce").prop('checked');
		}
		loadTriggers($("#triggerList"), currentTriggerId);
		$(this).closest("dialog")[0].close();
	});
	
	$("#triggerConditionList").change(function(){
		var hasValue = $(this).val() != null;
		$("#editTriggerConditionButton").prop("disabled", !hasValue);
		$("#delTriggerConditionButton").prop("disabled", !hasValue);
		$("#downTriggerConditionButton").prop("disabled", !hasValue || $(this).find("option:selected").val() === $(this).find("option:last").val());
		$("#upTriggerConditionButton").prop("disabled", !hasValue || $(this).find("option:selected").val() === $(this).find("option:first").val());
	});
	
	$("#triggerActionList").change(function(){
		var hasValue = $(this).val() != null;
		$("#editTriggerActionButton").prop("disabled", !hasValue);
		$("#delTriggerActionButton").prop("disabled", !hasValue);
		$("#downTriggerActionButton").prop("disabled", !hasValue || $(this).find("option:selected").val() === $(this).find("option:last").val());
		$("#upTriggerActionButton").prop("disabled", !hasValue || $(this).find("option:selected").val() === $(this).find("option:first").val());
	});
	
	//Conditions
	$("#editTriggerConditionButton").click(function() {
		editConditionButton(currentTrigger.conditions, $("#triggerConditionList"));
	});
	
	$("#addTriggerConditionButton").click(function() {
		addConditionButton(currentTrigger.conditions, $("#triggerConditionList"));
	});
	
	$("#delTriggerConditionButton").click(function() {
		var sure = confirm("Sure you want to delete this condition?");
		if (sure) {
			delCondition($("#triggerConditionList").val(), currentTrigger.conditions, $("#triggerConditionList"));
		}
	});
	
	$("#downTriggerConditionButton").click(function() {
		var i = parseInt($("#triggerConditionList").val());
		var tmp = currentTrigger.conditions[i];
		currentTrigger.conditions[i] = currentTrigger.conditions[i+1];
		currentTrigger.conditions[i+1] = tmp;
		loadConditions($("#triggerConditionList"), currentTrigger.conditions, i+1);
	});
	
	$("#upTriggerConditionButton").click(function() {
		var i = parseInt($("#triggerConditionList").val());
		var tmp = currentTrigger.conditions[i];
		currentTrigger.conditions[i] = currentTrigger.conditions[i-1];
		currentTrigger.conditions[i-1] = tmp;
		loadConditions($("#triggerConditionList"), currentTrigger.conditions, i-1);
	});
	
	//Actions
	$("#editTriggerActionButton").click(function() {
		editActionButton(currentTrigger.actions, $("#triggerActionList"));
	});
	
	$("#addTriggerActionButton").click(function() {
		addActionButton(currentTrigger.actions, $("#triggerActionList"));
	});
	
	$("#delTriggerActionButton").click(function() {
		var sure = confirm("Sure you want to delete this action?");
		if (sure) {
			delAction($("#triggerActionList").val(), currentTrigger.actions, $("#triggerActionList"));
		}
	});
	
	$("#downTriggerActionButton").click(function() {
		var i = parseInt($("#triggerActionList").val());
		var tmp = currentTrigger.actions[i];
		currentTrigger.actions[i] = currentTrigger.actions[i+1];
		currentTrigger.actions[i+1] = tmp;
		loadActions($("#triggerActionList"), currentTrigger.actions, i+1);
	});
	
	$("#upTriggerActionButton").click(function() {
		var i = parseInt($("#triggerActionList").val());
		var tmp = currentTrigger.actions[i];
		currentTrigger.actions[i] = currentTrigger.actions[i-1];
		currentTrigger.actions[i-1] = tmp;
		loadActions($("#triggerActionList"), currentTrigger.actions, i-1);
	});
}

function loadTriggers(select, objectiveId) {
	select.empty();
	for (var key in stage.triggers) {
		if (stage.triggers.hasOwnProperty(key)) {
			var option = $("<option value='" + key + "'>" + stage.triggers[key].name + "</option>");
			option.prop("title", stage.triggers[key].name);
			select.append(option);
		}
	}
	selectValue(select, objectiveId);
}

// We have to delete recursively all conditions and actions first
function delTrigger(triggerId) {
	var trigger = stage.triggers[triggerId];
	for (var i=trigger.conditions.length-1; i>=0; i--) {
		delCondition(i, trigger.conditions, $("#triggerConditionsList"));
	}
	for (var i=trigger.actions.length-1; i>=0; i--) {
		delAction(i, trigger.actions, $("#triggerActionList"));
	}
	
	stage.triggers.splice(triggerId, 1);
	loadTriggers($("#triggerList"));
}