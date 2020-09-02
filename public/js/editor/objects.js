function loadObjectsJS() {
	$("#objectList").change(function(){
		var hasValue = $(this).val() != null;
		if (hasValue) {
			var objectId = $(this).val();
			currentObject = stage.objects[objectId];
			$("#objectImg").val(currentObject.img);
			loadObjectImgDOM();
			$("#objectDescription").val(currentObject.description ? getText(currentObject.description) : "");
			loadStackList();
		}
		$("#objectProperties").toggle(hasValue);
		$("#editObjectButton").prop("disabled", !hasValue);
		$("#delObjectButton").prop("disabled", !hasValue);
	});
	
	$(".updateObject").change(function(){
		currentObject.img = $("#objectImg").val();
		loadObjectImgDOM();
		
		// If the text is already created update it, if not create it
		if (currentObject.description) {
			setText($("#objectDescription").val(), currentObject.description);
		} else {
			currentObject.description = createText($("#objectDescription").val());
		}
	});
	
	$("#editObjectButton").click(function(){
		$("#objectId").val($("#objectList").val());
		$("#objectName").val(currentObject.name);
		$("#objectEditor").removeClass("add");
		$("#objectEditor")[0].showModal();
	});
	
	$("#addObjectButton").click(function(){
		var objectId = randomString(8);
		// If after 10 tries we don't generated a non existing id, let's resign.
		for (var i=0; i<10 && stage.objects[objectId]; i++) {
			objectId = randomString(8);
		}
		if (stage.objects[objectId]) return;
	
		$("#objectId").val(objectId);
		$("#objectName").val("");
		$("#objectEditor").addClass("add");
		$("#objectEditor")[0].showModal();
	});
	
	$("#delObjectButton").click(function(){
		var sure = confirm("Sure you want to delete this object? All associated mixtures, conditions and actions will be deleted too!");
		if (sure) {
			delObject($("#objectList").val());
		}
	});
	
	$("#saveObject").click(function() {
		var objectId = $("#objectId").val();
		if ($(this).closest("dialog").hasClass("add")) {
			stage.objects[objectId] = {};
			stage.objects[objectId].name = $("#objectName").val();
			stage.objects[objectId].stacks = [];
			loadObjects($("#objectList"), objectId);
		} else {			
			stage.objects[objectId].name = $("#objectName").val();
			$("#objectList :selected").html($("#objectName").val());
		}

		$(this).closest("dialog")[0].close();
	});
	
	$("#stackList").change(function(){
		var hasValue = $(this).val() != null;
		$("#stackProperties").toggle(hasValue);
		$("#delStackButton").prop("disabled", !hasValue);
		if ($(this).val()) {
			currentStack = currentObject.stacks[$(this).val()];
			
			//Load Stack
			$("#stackNum").val(currentStack.minNumber);
			$("#stackImg").val(currentStack.img);
			loadStackImgDOM();
			$("#stackDescription").val(currentStack.description ? getText(currentStack.description) : "");
		}
	});
	
	//Stacks
	$("#addStackButton").click(function(){
		var newStack = parseInt($("#stackList option:last").html() || 1) + 1;
		currentObject.stacks.push({
			minNumber: newStack
		});
		var i = currentObject.stacks.length-1;
		var option = $("<option value='" + i + "'>" + newStack + "</option>");
		option.prop("title", newStack);
		$("#stackList").append(option);
		$("#stackList").val(i);
		$("#stackList").change();
		$("#delStackButton").show();
	});
	
	$("#delStackButton").click(function(){
		var sure = confirm("Sure you want to delete this stack?");
		if (sure) {
			delStackObject($("#stackList").val(), currentObject);
		}
	});
	
	$(".updateStack").change(function(){
		currentStack.minNumber = parseInt($("#stackNum").val());
		$("#stackList option:selected").html($("#stackNum").val());
		currentStack.img = $("#stackImg").val();
		loadStackImgDOM();
		
		// If the text is already created update it, if not create it
		if (currentStack.description) {
			setText($("#stackDescription").val(), currentStack.description);
		} else {
			currentStack.description = createText($("#stackDescription").val());
		}
	});
}

function loadObjects(select, objectId) {
	select.empty();
	for (var key in stage.objects) {
		if (stage.objects.hasOwnProperty(key)) {
			var option = $("<option value='" + key + "'>" + stage.objects[key].name + "</option>");
			option.prop("title", stage.objects[key].name);
			select.append(option);
		}
	}
	selectValue(select, objectId);
}

function loadStackList() {
	$("#stackList").empty();
	for (i=0; i<currentObject.stacks.length; i++) {
		var option = $("<option value='" + i + "'>" + currentObject.stacks[i].minNumber + "</option>");
		option.prop("title", currentObject.stacks[i].minNumber);
		$("#stackList").append(option);
	}
	$("#delStackButton").prop("disabled", i===0);
	$("#stackList").change();
}

function loadObjectImgDOM() {
	if ($("#objectImg").val() !== "") {
		var objectPath = $("#objectImg").val();
		objectPath = isAbsolutePath(objectPath) ? objectPath : stageObjectPath + objectPath;
		$("#objectImgDOM").attr("src", objectPath);
	} else {
		$("#objectImgDOM").removeAttr("src");
	}
}

function loadStackImgDOM() {
	if ($("#stackImg").val() !== "") {
		var objectPath = $("#stackImg").val();
		objectPath = isAbsolutePath(objectPath) ? objectPath : stageObjectPath + objectPath;
		$("#stackImgDOM").attr("src", objectPath);
	} else {
		$("#stackImgDOM").removeAttr("src");
	}
}

function delObject(objectId) {
	var object = stage.objects[objectId];
	
	// First delete all stack descriptions
	delText(object.description);
	for (var i=0; i<object.stacks.length; i++) {
		delText(object.stacks[i].description);
	}
	
	// Delete all mixtures associated
	for (var obj1 in stage.mixtures) {
		if (stage.mixtures.hasOwnProperty(obj1) && obj1 !== "description") {
			var mixture1 = stage.mixtures[obj1];
			
			if (obj1 === objectId) { // First element of the mixture
				delText(mixture1.description);
				for (var obj2 in mixture1) {
					if (mixture1.hasOwnProperty(obj2) && obj2 !== "description") {
						var mixture2 = mixture1[obj2];
						for (var i=mixture2.interactions.length-1; i>=0; i--) {
							delInteraction(i, mixture2.interactions);
						}
						delete mixture1[obj2];
					}
				}
				delete stage.mixtures[obj1];
			} else {
				var mixture2 = mixture1[objectId];
				if (mixture2) { // Second element of the mixture
					for (var i=mixture2.interactions.length-1; i>=0; i--) {
						delInteraction(i, mixture2.interactions);
					}
					delete mixture1.mixture2;
				}
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
				if ((action.typeId === ACTIONS.PICK_UP_OBJECT || action.typeId === ACTIONS.REMOVE_OBJECT) && action.object === objectId) {
					delAction(j, interaction.actions);
				}
			}
		}
		
		if (interaction.conditions) {
			for (var j=interaction.conditions.length-1; j>=0; j--) {
				var condition = interaction.conditions[j];
				if (condition.typeId === CONDITIONS.HAS_OBJECT && condition.object === objectId) {
					delCondition(j, interaction.conditions);
				}
			}
		}
	}
	
	delete stage.objects[objectId];
	loadObjects($("#objectList"));
}

function delStackObject(iStack, object) {
	delText(object.stacks[iStack].description);
	object.stacks.splice(iStack, 1);
	loadStackList();
}