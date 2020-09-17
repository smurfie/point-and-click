function loadScreensJS() {
	$("#screenList").change(function(){
		loadScreen($(this).val());
	});
	
	$("#initialScreen").change(function(){
		if ($(this).is(":checked")) {
			stage.initialScreen = $("#screenList").val();
		}
	});
	
	$("#screenImageList").change(function(){
		// Choose between the absolute or relative path
		var screenPath;
		if ($("#screenImageList").val()) {
			screenPath = currentScreen.images[$("#screenImageList").val()].img;
			screenPath = isAbsolutePath(screenPath) ? screenPath : stageScreenPath + screenPath;
		}
		$("#canvas").css("background-image", $("#screenImageList").val() ? "url(" + screenPath + ")" : "none");
		
		var hasValue = $("#screenImageList").val() !== null;
		var isDefault = hasValue && $("#screenImageList").val() === currentScreen.defaultImage;
		
		$("#editScreenImageButton").prop("disabled", !hasValue);
		$("#delScreenImageButton").prop("disabled", !hasValue || isDefault);
		$("#makeDefaultScreenImageButton").prop("disabled", !hasValue || isDefault);
	});
	
	// Screen Modal
	$("#editScreenButton").click(function(){
		$("#screenId").val($("#screenList").val());
		$("#screenName").val(currentScreen.name);
		$("#screenImg").val(currentScreen.images[currentScreen.defaultImage].img);
		$("#screenEditor").removeClass("add");
		$("#screenEditor")[0].showModal();
	});
	
	$("#addScreenButton").click(function(){
		var screenId = randomString(8);
		// If after 10 tries we don't generated a non existing id, let's resign.
		for (var i=0; i<10 && stage.screens[screenId]; i++) {
			screenId = randomString(8);
		}
		if (stage.screens[screenId]) return;
	
		$("#screenId").val(screenId);
		$("#screenName").val("");
		$("#screenImg").val("");
		$("#screenEditor").addClass("add");
		$("#screenEditor")[0].showModal();
	});
	
	$("#delScreenButton").click(function(){
		if (stage.initialScreen === $("#screenList").val()) {
			alert("You can't delete the initial screen");
		} else {
			var sure = confirm("Sure you want to delete this screen? All associated conditions and actions will be deleted too!");
			if (sure) {
				delScreen($("#screenList").val());
			}
		}
	});
	
	$("#saveScreen").click(function() {
		var screenId = $("#screenId").val();
		var img = $("#screenImg").val();
		//FIXME: In case of http urls this gets weird
		var imgName = img.substring(0,img.indexOf("."));
		
		if ($(this).closest("dialog").hasClass("add")) {
			stage.screens[screenId] = {};
			var screen = stage.screens[screenId];
			var imageId = randomString(8);		
			
			screen.name = $("#screenName").val();
			screen.images = {};
			
			screen.images[imageId] = {};
			screen.images[imageId].img = img;
			screen.images[imageId].name = imgName;
			screen.defaultImage = imageId;

			//Create a default area
			screen.areas = {
				onLoad: {
					"name": "onLoad",
					"interactions": [],
				}
			};
			if (!stage.initialScreen) {
				stage.initialScreen = screenId;
			}
			
			loadScreens($("#screenList"), screenId);
		} else {
			var screen = stage.screens[screenId];
			screen.name = $("#screenName").val();
			screen.images[screen.defaultImage].img = img;
			screen.images[screen.defaultImage].name = imgName;
			loadScreenImages($("#screenImageList"), currentScreen.images, currentScreen.defaultImage);
			
			$("#screenList :selected").html($("#screenName").val());
			
			// Choose between the absolute or relative path
			var screenPath = $("#screenImg").val();
			screenPath = isAbsolutePath(screenPath) ? screenPath : stageScreenPath + screenPath;
			$("#canvas").css("background-image","url(" + screenPath + ")");
		}		
		$(this).closest("dialog")[0].close();
	});
	
	// Screen Image Modal
	$("#editScreenImageButton").click(function(){
		var screenImage = currentScreen.images[$("#screenImageList").val()];
		$("#screenImageId").val($("#screenImageList").val());
		$("#screenImageName").val(screenImage.name);
		$("#screenImageImg").val(screenImage.img);
		$("#screenImageEditor").removeClass("add");
		$("#screenImageEditor")[0].showModal();
	});
	
	$("#addScreenImageButton").click(function(){
		var screenImageId = randomString(8);
		// If after 10 tries we don't generated a non existing id, let's resign.
		for (var i=0; i<10 && currentScreen.images[screenImageId]; i++) {
			screenImageId = randomString(8);
		}
		if (currentScreen.images[screenImageId]) return;
	
		$("#screenImageId").val(screenImageId);
		$("#screenImageName").val("");
		$("#screenImageImg").val("");
		$("#screenImageEditor").addClass("add");
		$("#screenImageEditor")[0].showModal();
	});
	
	$("#delScreenImageButton").click(function(){
		var sure = confirm("Sure you want to delete this screen image? All associated actions will be deleted too!");
		if (sure) {
			delScreenImage($("#screenImageList").val(), currentScreenId);
		}
	});
	
	$("#makeDefaultScreenImageButton").click(function(){
		currentScreen.defaultImage = $("#screenImageList").val();
		loadScreenImages($("#screenImageList"), currentScreen.images, $("#screenImageList").val());
	});
	
	$("#saveScreenImage").click(function() {
		var screenImageId = $("#screenImageId").val();
		
		if ($(this).closest("dialog").hasClass("add")) {
			currentScreen.images[screenImageId] = {};
		}
		var screenImage = currentScreen.images[screenImageId];
		
		screenImage.name = $("#screenImageName").val();
		screenImage.img = $("#screenImageImg").val();
		
		loadScreenImages($("#screenImageList"), currentScreen.images, screenImageId);
		$(this).closest("dialog")[0].close();
	});
}

function loadScreens(select, screenId) {
	select.empty();
	for (var key in stage.screens) {
		if (stage.screens.hasOwnProperty(key)) {
			var option = $("<option value='" + key + "'>" + stage.screens[key].name + "</option>");
			option.prop("title", stage.screens[key].name);
			select.append(option);
		}
	}
	selectValue(select, screenId);
}

function loadScreen(screenId) {
	//Update the buttons and the areas Menu
	var hasValue = $("#screenList").val() != null;
	$("#navList li[data-id='areasMenu']").toggle(hasValue);
	$("#initialScreenDiv").toggle(hasValue);
	$("#screenImageListDiv").toggle(hasValue);
	$("#editScreenButton").prop("disabled", !hasValue);
	$("#delScreenButton").prop("disabled", !hasValue);
	
	if (!hasValue) {
		$("#canvas").empty();
		$("#canvas").css("background-image","none");
		return;
	}
		
	//Initial Screen
	$("#initialScreen").prop('checked', screenId===stage.initialScreen);
	currentScreen = stage.screens[screenId];
	currentScreenId = screenId;
	
	$("#canvas").empty();
	
	//Images
	loadScreenImages($("#screenImageList"), currentScreen.images, currentScreen.defaultImage);
	
	//Areas
	$("#areaList").empty();
	$("#areaProperties").hide();
	for (var key in currentScreen.areas) {
		if (currentScreen.areas.hasOwnProperty(key)) {
			loadArea(key);
		}
	}
	loadAreas($("#areaList"), stage.screens[screenId].areas);
	
	//Disable all resizables and draggables
	$(".area").resizable("option", "disabled", true);
	$(".area").parent().draggable("option", "disabled", true);

	$("#areaList").change();
}

function loadScreenImages(select, images, screenImageId) {
	select.empty();
	for (var key in images) {
		if (images.hasOwnProperty(key)) {
			var image = images[key];
			var defaultImage = key === currentScreen.defaultImage;
			var name =  defaultImage ? image.name + " (default)" : image.name
			var option = $("<option value='" + key + "'>" + name + "</option>");
			option.prop("title", name);
			select.append(option);
		}
	}
	selectValue(select, screenImageId);
}

function delScreen(screenId) {
	// First delete all areas
	var screen = stage.screens[screenId];
	for (var key in screen.areas) {
		if (screen.areas.hasOwnProperty(key)) {
			delArea(screenId, key);
		}
	}
	
	// Also delete all actions and conditions associated
	var allInteractions = getAllInteractions();
	for (var i=0; i<allInteractions.length; i++) {
		var interaction = allInteractions[i];
		
		if (interaction.actions) {
			for (var j=interaction.actions.length-1; j>=0; j--) {
				var action = interaction.actions[j];
				if ((action.typeId === ACTIONS.GO_TO || action.typeId === ACTIONS.HIDE_AREA || action.typeId === ACTIONS.SHOW_AREA 
						|| action.typeId === ACTIONS.AREA_CHANGE_STATE || action.typeId === ACTIONS.SCREEN_CHANGE_IMAGE)
						&& action.screen === screenId) {
					delAction(j, interaction.actions);
				}
			}
		}
		
		if (interaction.conditions) {
			for (var j=interaction.conditions.length-1; j>=0; j--) {
				var condition = interaction.conditions[j];
				if (condition.typeId === CONDITIONS.AREA_HAS_STATE && condition.screen === screenId) {
					delCondition(j, interaction.conditions);
				}
			}
		}
	}
	
	delete stage.screens[screenId];
	loadScreens($("#screenList"));
}

function delScreenImage(imageId, screenId) {
	// First delete all actions associated
	var allInteractions = getAllInteractions();
	for (var i=0; i<allInteractions.length; i++) {
		var interaction = allInteractions[i];
		
		if (interaction.actions) {
			for (var j=interaction.actions.length-1; j>=0; j--) {
				var action = interaction.actions[j];
				if (action.typeId === ACTIONS.SCREEN_CHANGE_IMAGE && action.screen === screenId && action.image === imageId) {
					delAction(j, interaction.actions);
				}
			}
		}
	}
	
	var screen = stage.screens[screenId];
	delete screen.images[imageId];
	loadScreenImages($("#screenImageList"), screen.images);
}