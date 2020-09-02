function loadObjectivesJS() {
	$("#objectiveList").change(function(){
		var hasValue = $(this).val() != null;
		$("#editObjectiveButton").prop("disabled", !hasValue);
		$("#delObjectiveButton").prop("disabled", !hasValue);
		$("#selectedObjective").html(hasValue ? stage.objectives[$(this).val()].name : "");
	});
	
	$("#editObjectiveButton").click(function(){
		$("#objectiveId").val($("#objectiveList").val());
		$("#objectiveName").val(stage.objectives[$("#objectiveList").val()].name);
		$("#objectiveEditor").removeClass("add");
		$("#objectiveEditor")[0].showModal();
	});
	
	$("#addObjectiveButton").click(function(){
		var objectiveId = randomString(8);
		// If after 10 tries we don't generated a non existing id, let's resign.
		for (var i=0; i<10 && stage.objectives[objectiveId]; i++) {
			objectiveId = randomString(8);
		}
		if (stage.objectives[objectiveId]) return;
		
		$("#objectiveId").val(objectiveId);
		$("#objectiveName").val("");
		$("#objectiveEditor").addClass("add");
		$("#objectiveEditor")[0].showModal();
	});
	
	$("#delObjectiveButton").click(function(){
		var sure = confirm("Sure you want to delete this objective? All associated conditions and actions will be deleted too!");
		if (sure) {
			delObjective($("#objectiveList").val());
		}
	});
	
	$("#saveObjective").click(function() {
		var objectiveId = $("#objectiveId").val();
		if ($(this).closest("dialog").hasClass("add")) {
			stage.objectives[objectiveId] = { "name": $("#objectiveName").val() };
			loadObjectives($("#objectiveList"), objectiveId);			
		} else {
			stage.objectives[objectiveId].name = $("#objectiveName").val();
			$("#objectiveList :selected").html($("#objectiveName").val());
		}
		$(this).closest("dialog")[0].close();
	});
}

function loadObjectives(select, objectiveId) {
	select.empty();
	for (var key in stage.objectives) {
		if (stage.objectives.hasOwnProperty(key)) {
			var option = $("<option value='" + key + "'>" + stage.objectives[key].name + "</option>");
			option.prop("title", stage.objectives[key].name);
			select.append(option);
		}
	}
	selectValue(select, objectiveId);
}

function delObjective(objectiveId) {
	// First Delete all actions and conditions associated
	var allInteractions = getAllInteractions();
	for (var i=0; i<allInteractions.length; i++) {
		var interaction = allInteractions[i];
		
		if (interaction.actions) {
			for (var j=interaction.actions.length-1; j>=0; j--) {
				var action = interaction.actions[j];
				if (action.typeId === ACTIONS.COMPLETE_OBJECTIVE && action.objective === objectiveId) {
					delAction(j, interaction.actions);
				}
			}
		}
		
		if (interaction.conditions) {
			for (var j=interaction.conditions.length-1; j>=0; j--) {
				var condition = interaction.conditions[j];
				if (condition.typeId === CONDITIONS.OBJECTIVE_COMPLETED && condition.objective === objectiveId) {
					delCondition(j, interaction.conditions);
				}
			}
		}
	}
	
	delete stage.objectives[objectiveId];
	loadObjectives($("#objectiveList"));
}