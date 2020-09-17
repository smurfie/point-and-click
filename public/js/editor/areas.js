function loadClickablesJS() {
	$("#areaList").change(function(){
		//Update the buttons
		var hasValue = $("#areaList").val() != null;
		$("#areaProperties").toggle(hasValue);
		$("#editAreaButton").prop("disabled", !hasValue);
		$("#delAreaButton").prop("disabled", !hasValue);
		
		//If is the onLoad area, disable the elements
		var isOnLoad = hasValue && $("#areaList").val() === "onLoad";
		$("#editAreaButton").prop("disabled", isOnLoad);
		$("#delAreaButton").prop("disabled", isOnLoad);
		$("#areaImg").prop("disabled", isOnLoad);
		$("#areaDescription").prop("disabled", isOnLoad);
		$("#areaX").prop("disabled", isOnLoad);
		$("#areaY").prop("disabled", isOnLoad);
		$("#areaW").prop("disabled", isOnLoad);
		$("#areaH").prop("disabled", isOnLoad);
		$("#areaZ").prop("disabled", isOnLoad);
		$("#areaA").prop("disabled", isOnLoad);
		$("#areaCursor").prop("disabled", isOnLoad);
		$("#areaHidden").prop("disabled", isOnLoad);
		
		if (hasValue) {
			//Disable all resizables and draggables
			$(".area").resizable("option", "disabled", true);
			$(".area").parent().draggable("option", "disabled", true);

			currentArea = currentScreen.areas[$(this).val()];
			currentAreaId = $(this).val();
			$("#canvas .area").parent().removeClass("selected");
			$("#area_" + $(this).val()).parent().addClass("selected");
			$("#area_" + $(this).val()).resizable({
				disabled: false,
				containment: $("#canvas")
			});
			$("#area_" + $(this).val()).parent().draggable({
				disabled: false,
				containment: $("#canvas")
			});
			
			//Load States
			loadStates($("#stateList"), isOnLoad ? [] : currentArea.states);
			
			//Interactions
			$("#areaInteractionsButton .interactionsNumber").text(currentArea.interactions.length);
		}
	});
	
	$("#stateList").change(function() {
		//If is the onLoad area, disable the elements
		var isOnLoad = $("#areaList").val() === "onLoad";
		
		currentState = isOnLoad ? null : currentArea.states[$("#stateList").val()];
		currentStateId = $("#stateList").val();
		$("#editStateButton, #delStateButton").prop("disabled", currentStateId === "default" || isOnLoad);
		$("#stateList, #addStateButton").prop("disabled", isOnLoad);
		
		//If the state overrides the default values apply them
		$("#areaImg").val(getAreaStateProperty(currentAreaId, currentStateId, "img"));
		$("#areaDescription").val(getAreaStateProperty(currentAreaId, currentStateId, "description"));
		$("#areaX").val(getAreaStateProperty(currentAreaId, currentStateId, "left"));
		$("#areaY").val(getAreaStateProperty(currentAreaId, currentStateId, "top"));
		$("#areaW").val(getAreaStateProperty(currentAreaId, currentStateId, "width"));
		$("#areaH").val(getAreaStateProperty(currentAreaId, currentStateId, "height"));
		$("#areaZ").val(getAreaStateProperty(currentAreaId, currentStateId, "zindex"));
		$("#areaA").val(getAreaStateProperty(currentAreaId, currentStateId, "alpha"));
		$("#areaCursor").val(getAreaStateProperty(currentAreaId, currentStateId, "cursor"));
		$("#areaHidden").prop("checked", getAreaStateProperty(currentAreaId, currentStateId, "hidden"));

		if (!isOnLoad) {
			$("#areaImg").change();
		}
	});
	
	$("#areaInteractionsButton").click(function() {
		interactionsNumberDOM = $(this).find(".interactionsNumber");
		interactionList = currentArea.interactions;
		
		loadInteractionsModal(interactionsNumberDOM, interactionList);
	});
	
	$(".updateArea").change(function(){
		var currentAreaId = $("#areaList").val();
		if (!currentAreaId || currentAreaId === "onLoad") {
			return;
		}
		
		var state = currentArea.states[$("#stateList").val()];
		
		var img = $("#area_" + currentAreaId);
		img.remove();
		state.img = $("#areaImg").val();
		
		// If the text is already created update it, if not create it
		if (state.description) {
			setText($("#areaDescription").val(), state.description);
		} else {
			state.description = createText($("#areaDescription").val());
		}
		state.top = parseInt($("#areaY").val());
		state.left = parseInt($("#areaX").val());
		state.width = parseInt($("#areaW").val());
		state.height = parseInt($("#areaH").val());
		state.zindex = parseInt($("#areaZ").val());
		state.alpha = parseFloat($("#areaA").val());
		state.cursor = parseInt($("#areaCursor").val());
		state.hidden = $("#areaHidden").is(":checked");
		loadArea(currentAreaId, $("#stateList").val());
		img = $("#area_" + currentAreaId);
		img.parent().addClass("selected");
		img.parent().resizable("option", "disabled", false);
		img.parent().draggable("option", "disabled", false);
	});

	// Area Modal
	$("#editAreaButton").click(function(){
		$("#areaName").val(currentArea.name);
		$("#areaEditor").removeClass("add");
		$("#areaEditor")[0].showModal();
	});
	
	$("#addAreaButton").click(function(){
		var areaId = randomString(8);
		// If after 10 tries we don't generated a non existing id, let's resign.
		for (var i=0; i<10 && currentScreen.areas[areaId]; i++) {
			areaId = randomString(8);
		}
		if (currentScreen.areas[areaId]) return;
		
		$("#areaId").val(areaId);
		$("#areaName").val("");
		$("#areaEditor").addClass("add");
		$("#areaEditor")[0].showModal();
	});
	
	$("#delAreaButton").click(function(){
		var sure = confirm("Sure you want to delete this area? All associated mixtures, conditions and actions will be deleted too!");
		if (sure) {
			delArea(currentScreenId, $("#areaList").val());
		}
	});
	
	$("#saveArea").click(function() {
		var areaId = $("#areaId").val();
		var areaName = $("#areaName").val();
		if ($(this).closest("dialog").hasClass("add")) {
			var area = {
				"name": areaName,
				"states": {
					"default": {
						"img": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
						"left": 0,
						"top": 0,
						"width": 50,
						"height": 50,
						"zindex": 1,
						"alpha": 1,
						"cursor": CURSORS.EYE
					}
				},
				"interactions": []
			};
			currentScreen.areas[areaId] = area;
			loadAreas($("#areaList"), currentScreen.areas, areaId);
		} else {			
			$("#areaList").find(":selected").html(areaName);
			currentScreen.areas[$("#areaList").val()].name = areaName;
		}		
		$(this).closest("dialog")[0].close();
	});
	
	// State Modal
	$("#editStateButton").click(function(){
		$("#stateId").val(currentStateId);
		$("#stateName").val(currentState.name);
		$("#stateEditor").removeClass("add");
		$("#stateEditor")[0].showModal();
	});
	
	$("#addStateButton").click(function(){
		var stateId = randomString(8);
		// If after 10 tries we don't generated a non existing id, let's resign.
		for (var i=0; i<10 && currentArea.states[stateId]; i++) {
			stateId = randomString(8);
		}
		if (currentArea.states[stateId]) return;
		
		$("#stateId").val(stateId);
		$("#stateName").val("");
		$("#stateEditor").addClass("add");
		$("#stateEditor")[0].showModal();
	});
	
	$("#delStateButton").click(function(){
		var sure = confirm("Sure you want to delete this state? All associated conditions and actions will be deleted too!");
		if (sure) {
			delAreaState($("#stateList").val(), currentArea, currentAreaId, $("#stateList"));
		}
	});
	
	$("#saveState").click(function() {
		var stateId = $("#stateId").val();
		var stateName = $("#stateName").val();
		if ($(this).closest("dialog").hasClass("add")) {
			currentArea.states[stateId] = {"name": stateName};
			loadStates($("#stateList"), currentArea.states, stateId);
		} else {			
			$("#stateList").find(":selected").html(stateName);
			currentArea.states[$("#stateList").val()].name = stateName;
		}
		
		if (!currentArea.defaultState) {
			currentArea.defaultState = $("#stateList option:first").val();
		}
			
		
		$(this).closest("dialog")[0].close();
	});
}

function loadAreas(select, areas, areaId, hideOnLoad) {
	select.empty();
	for (var key in areas) {
		if (areas.hasOwnProperty(key) && (!hideOnLoad || key!=="onLoad")) {
			var option = $("<option value='" + key + "'>" + areas[key].name + "</option>");
			option.prop("title", areas[key].name);
			select.append(option);
		}
	}
	selectValue(select, areaId);
}

function loadArea(areaId, stateId) {
	stateId = stateId || "default";
	if (areaId!="onLoad") {
		// Get the path and add it the stageArea path if it's relative to the game
		var imgPath = getAreaStateProperty(areaId, stateId, "img");
		imgPath = isAbsolutePath(imgPath) ? imgPath : stageAreaPath + imgPath;
		var img = $("<img id='area_" + areaId + "' class='area' src='" + imgPath + "'>");
		
		loadCursor(img, getAreaStateProperty(areaId, stateId, "cursor"));
		$("#canvas").append(img);
		img.css({
			"top": getAreaStateProperty(areaId, stateId, "top") + "px",
			"left": getAreaStateProperty(areaId, stateId, "left") + "px",
			"width": getAreaStateProperty(areaId, stateId, "width") + "px",
			"height": getAreaStateProperty(areaId, stateId, "height") + "px",
			"opacity": getAreaStateProperty(areaId, stateId, "alpha"),
			"position": "absolute"
		});
		
		img.click(function(e){
			var areaId = $(this).prop("id").substring(5);
			if (areaId != $("#areaList").val()) {
				$("#areaList").val(areaId);
				$("#areaList").change();
			}
		});
		
		img.resizable({
			resize: function( event, ui ) {
				$("#areaW").val(ui.size.width);
				$("#areaH").val(ui.size.height);
				if (currentState == null) {
					currentArea.width = ui.size.width;
					currentArea.height = ui.size.height;
				} else {
					currentState.width = ui.size.width;
					currentState.height = ui.size.height;
				}
			}
		});
		img.parent().draggable({
			drag: function( event, ui ) {
				$("#areaX").val(ui.position.left);
				$("#areaY").val(ui.position.top);
				if (currentState == null) {
					currentArea.left = ui.position.left;
					currentArea.top = ui.position.top;
				} else {
					currentState.left = ui.position.left;
					currentState.top = ui.position.top;
				}
			}
		});
		
		img.parent().css("z-index", getAreaStateProperty(areaId, stateId, "zindex"));
		
		if (getAreaStateProperty(areaId, stateId, "hidden")) {
			img.parent().addClass("hidden");
		}
	}
}

function loadStates(select, states, stateId) {
	select.empty();
	var option = $("<option value='default'>default</option>");
	option.prop("title", "Default");
	select.append(option);
	for (var key in states) {
		if (states.hasOwnProperty(key) && key != "default") {
			var option = $("<option value='" + key + "'>" + states[key].name + "</option>");
			option.prop("title", states[key].name);
			select.append(option);
		}
	}
	selectValue(select, stateId);
}

function delArea(screenId, areaId) {
	// First delete all state descriptions
	var area = stage.screens[screenId].areas[areaId];
	for (var key in area.states) {
		if (area.states.hasOwnProperty(key)) {
			delText(area.states[key].description);
		}
	}
	
	// Delete all mixtures asociated
	for (var obj1 in stage.mixtures) {
		if (stage.mixtures.hasOwnProperty(obj1) && obj1 !== "description") {
			var mixture1 = stage.mixtures[obj1];
			if (mixture1[screenId + "_" + areaId]) {
				for (var i=mixture1[screenId + "_" + areaId].interactions.length-1; i>=0; i--) {
					delInteraction(i, mixture1[screenId + "_" + areaId].interactions);
				}
				delete mixture1[screenId + "_" + areaId];
			}
		}
	}
	
	// Also delete all actions and conditions associated
	var allInteractions = getAllInteractions();
	for (var i=0; i<allInteractions.length; i++) {
		var interaction = allInteractions[i];
		
		if (interaction.actions) {
			for (var j=interaction.actions.length-1; j>=0; j--) {
				var action = interaction.actions[j];
				if ((action.typeId === ACTIONS.AREA_CHANGE_STATE || action.typeId === ACTIONS.HIDE_AREA || action.typeId === ACTIONS.SHOW_AREA) 
						&& action.area === areaId) {
					delAction(j, interaction.actions);
				}
			}
		}
		
		if (interaction.conditions) {
			for (var j=interaction.conditions.length-1; j>=0; j--) {
				var condition = interaction.conditions[j];
				if (condition.typeId === CONDITIONS.AREA_HAS_STATE && condition.area === areaId) {
					delCondition(j, interaction.conditions);
				}
			}
		}
	}
	
	// And finally delete all interactions of the area to recursively delete the text associated to them
	for (var i=area.interactions.length-1; i>=0; i--) {
		delInteraction(i, area.interactions);
	}
	
	delete stage.screens[screenId].areas[areaId];
	$("#screenList").change(); //To reload also the canvas
}

function delAreaState(stateId, area, areaId, stateListDOM) {
	// First Delete all actions and conditions associated
	var allInteractions = getAllInteractions();
	for (var i=0; i<allInteractions.length; i++) {
		var interaction = allInteractions[i];
		
		if (interaction.actions) {
			for (var j=interaction.actions.length-1; j>=0; j--) {
				var action = interaction.actions[j];
				if (action.typeId === ACTIONS.AREA_CHANGE_STATE && action.area === areaId && action.state === stateId) {
					delAction(j, interaction.actions);
				}
			}
		}
		
		if (interaction.conditions) {
			for (var j=interaction.conditions.length-1; j>=0; j--) {
				var condition = interaction.conditions[j];
				if (condition.typeId === CONDITIONS.AREA_HAS_STATE && condition.area === areaId && condition.state === stateId) {
					delCondition(j, interaction.conditions);
				}
			}
		}
	}
	
	delText(area.states[stateId].description);
	delete area.states[stateId];
	if (stateListDOM) {
		loadStates(stateListDOM, area.states);
	}
}