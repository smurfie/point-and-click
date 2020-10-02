function loadMixturesJS() {
	$("#mixture1List").change( function(){
		var hasValue = $("#mixture1List").val() != null;
		var hasValue2 = $("#mixture2List").val() != null;
		$("#mixture1Description").toggle(hasValue);
		$("#mixtureProperties").toggle(hasValue2);
		$("#mixture2Filter").toggle(hasValue);
		$("#mixture2List").toggle(hasValue);
		loadMixture2List();
		
		if (hasValue && stage.mixtures[$("#mixture1List").val()]) {
			$("#mixture1Description").val(stage.mixtures[$("#mixture1List").val()].description ? 
					getText(stage.mixtures[$("#mixture1List").val()].description) : "");
		} else {
			$("#mixture1Description").val("");
		}
	});
	
	$("#mixture2List").change(function(){
		var hasValue = $("#mixture2List").val() != null;
		$("#mixtureProperties").toggle(hasValue);
		
		$("#conditionMixtureList").empty();
		$("#actionMixtureList").empty();
		
		$("#mixtureInteractionsButton .interactionsNumber").text(0);
		
		if (hasValue && stage.mixtures[$("#mixture1List").val()] && stage.mixtures[$("#mixture1List").val()][$("#mixture2List").val()]) {
			var mixture = stage.mixtures[$("#mixture1List").val()][$("#mixture2List").val()];
			
			//Interactions
			$("#mixtureInteractionsButton .interactionsNumber").text(mixture.interactions ? mixture.interactions.length : 0);
		}
	});
	
	$("#mixtureDescription").change(function(){
		// If the description is already created update it, if not create it
		if (stage.mixtures.description) {
			setText($("#mixtureDescription").val(), stage.mixtures.description);
		} else {
			stage.mixtures.description = createText($("#mixtureDescription").val());
		}
	});
	
	$("#mixture1Description").change(function(){
		if (!stage.mixtures[$("#mixture1List").val()]) {
			stage.mixtures[$("#mixture1List").val()] = {};
		}
		
		if ($("#mixture1Description").val()) {
			// If the description is already created update it, if not create it
			if (stage.mixtures[$("#mixture1List").val()].description) {
				setText($("#mixture1Description").val(), stage.mixtures[$("#mixture1List").val()].description);
			} else {
				stage.mixtures[$("#mixture1List").val()].description = createText($("#mixture1Description").val());
			}
		} else {
			//Delete empty properties
			delText(stage.mixtures[$("#mixture1List").val()].description);
			delete stage.mixtures[$("#mixture1List").val()].description;
			if (Object.keys(stage.mixtures[$("#mixture1List").val()]).length==0) {
				delete stage.mixtures[$("#mixture1List").val()];
			}
		}
		
		repaintMixture1();
	});
	
	$("#mixtureInteractionsButton").click(function() {
		if (!stage.mixtures[$("#mixture1List").val()]) {
			stage.mixtures[$("#mixture1List").val()] = {}
		}
		
		if (!stage.mixtures[$("#mixture1List").val()][$("#mixture2List").val()]) {
			stage.mixtures[$("#mixture1List").val()][$("#mixture2List").val()] = {}
		}
		
		if (!stage.mixtures[$("#mixture1List").val()][$("#mixture2List").val()].interactions) {
			stage.mixtures[$("#mixture1List").val()][$("#mixture2List").val()].interactions = [];
		}
		
		interactionsNumberDOM = $(this).find(".interactionsNumber");
		interactionList = stage.mixtures[$("#mixture1List").val()][$("#mixture2List").val()].interactions;
		
		loadInteractionsModal(interactionsNumberDOM, interactionList);
	});
	
	//Update the colors (and prune the empty interactions) when the modal is closed
	$("#interactionsEditor")[0].addEventListener('close', function(e) {
		if (currentInteractionsNumberDOM.closest("button").attr("id") === "mixtureInteractionsButton") {
			repaintMixture2();
		}
	});	
	
	//Mix Filters
	$("#mixture1Filter").on("input",function(){
		$("#mixture1List option").each(function(){
			$(this).toggle($(this).text().toLowerCase().indexOf($("#mixture1Filter").val().toLowerCase())>=0);
		})
	});
	
	$("#mixture2Filter").on("input",function(){
		$("#mixture2List option").each(function(){
			$(this).toggle($(this).text().toLowerCase().indexOf($("#mixture2Filter").val().toLowerCase())>=0);
		})
	});
	
	$("#hideGoTo").change(function(){
		loadMixture2List();
	});
}

function loadMixtures() {
	$("#mixtureDescription").val(stage.mixtures.description ? getText(stage.mixtures.description) : "");
	loadMixture1List();
}

function loadMixture1List() {
	loadObjects($("#mixture1List"));
}

function repaintMixture1(){
	//Paint green the ones with value
	$("#mixture1List option").each(function(index, item){
		if (stage.mixtures[$(item).val()] && Object.keys(stage.mixtures[$(item).val()]).length>0) {
			$(item).addClass("hasValue");
		} else {
			$(item).removeClass("hasValue");
		}
	});
}

function loadMixture2List() {
	var idObject1 = $("#mixture1List").val();
	if (idObject1 != null) {
		loadObjects($("#mixture2List"));
		$("#mixture2List option[value=" + idObject1 + "]").remove();
		loadScreenAreas($("#mixture2List"));
		
		//Because this select load various lists we have to select the first value and call change()
		$("#mixture2List").val($("#mixture2List").find("option:first").val());
		$("#mixture2List").change();
		repaintMixture2();
		$("#mixture2Filter").trigger("input");
	} else {
		$("#mixture2List").empty();
	}
}

function repaintMixture2(){
	//Paint green the ones with interactions
	$("#mixture2List option").each(function(index, item){
		if (stage.mixtures[$("#mixture1List").val()] && stage.mixtures[$("#mixture1List").val()][$(item).val()] &&
				stage.mixtures[$("#mixture1List").val()][$(item).val()].interactions) {
			var mixture = stage.mixtures[$("#mixture1List").val()][$(item).val()];
			if (mixture.interactions.length > 0) {
				$(item).addClass("hasValue");
			} else {
				delete stage.mixtures[$("#mixture1List").val()][$(item).val()];
				$(item).removeClass("hasValue");
			}
		} else {
			$(item).removeClass("hasValue");
		}
	});
	repaintMixture1();
}

function loadScreenAreas(select) {
	for (var key in stage.screens) {
		if (stage.screens.hasOwnProperty(key)) {
			loadAreasWithScreen(select, key);
		}
	}
}

function loadAreasWithScreen(select, screenKey) {
	for (var key in stage.screens[screenKey].areas) {
		if (stage.screens[screenKey].areas.hasOwnProperty(key) && key != "onLoad" &&
				(!$("#hideGoTo").is(":checked") || !stage.screens[screenKey].areas[key].name.startsWith("goTo"))) {
			var option = $("<option value='" + screenKey + "_" + key + "'>" + stage.screens[screenKey].areas[key].name + " (" + stage.screens[screenKey].name + ")</option>");
			option.prop("title", stage.screens[screenKey].areas[key].name + " (" + stage.screens[screenKey].name + ")");
			select.append(option);
		}
	}
}