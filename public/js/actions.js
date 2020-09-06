function executeInteractionsCallback(interactions) {
	return function(){
		$("#conversation").hide();
		findAndExecuteActions(interactions);
	}
}

function executeActions(actions) {
	if (actions == null) return;
	for (var i=0; i<actions.length; i++){
		executeAction(actions[i]);
	}
}

function executeAction(action) {
	switch (action.typeId) {
		case ACTIONS.GO_TO:
			executeActionGoTo(action);
			break;
		case ACTIONS.PICK_UP_OBJECT:
			executeActionPickUpObject(action);
			break;
		case ACTIONS.REMOVE_OBJECT:
			executeActionRemoveObject(action);
			break;
		case ACTIONS.HIDE_AREA:
			executeActionHideArea(action);
			break;
		case ACTIONS.SHOW_AREA:
			executeActionShowArea(action);
			break;
		case ACTIONS.SHOW_TEXT:
			executeActionShowText(action);
			break;
		case ACTIONS.COMPLETE_OBJECTIVE:
			executeActionAreaCompleteObjective(action);
			break;
		case ACTIONS.AREA_CHANGE_STATE:
			executeActionAreaChangeState(action);
			break;
		case ACTIONS.SCREEN_CHANGE_IMAGE:
			executeActionScreenChangeImage(action);
			break;
		case ACTIONS.TALK:
			executeActionTalk(action);
			break;
		/*case ACTIONS.END:
			return "End";*/
	}
}

function executeActionGoTo(action) {
	loadScreen(action.screen);
}

function executeActionPickUpObject(action) {
	var found = false;
	for (var i=0; i<inventory.length && !found; i++) {
		if (inventory[i].object == action.object) {
			found = true;
			inventory[i].num += parseInt(action.num);
		}
	}
	if (!found) {
		inventory.push({
			"object": action.object,
			"num": parseInt(action.num)
		});
	}
	drawInventory();
	
	//Scroll to bottom of inventory
	 $("#inventory").stop().animate({scrollTop:$("#inventory")[0].scrollHeight}, 1000)
}

function executeActionRemoveObject(action) {
	var found = false;
	for (var i=0; i<inventory.length && !found; i++) {
		if (inventory[i].object == action.object) {
			found = true;
			inventory[i].num -= parseInt(action.num);
			if (inventory[i].num <= 0) {
				inventory.splice(i,1);
			}
		}
	}
	drawInventory();
}

// To be backwards compatible hide all states of the object
// In the future a parameter state can be added
function executeActionHideArea(action) {
	for (var key in stage.screens[action.screen].areas[action.area].states) {
		if (stage.screens[action.screen].areas[action.area].states.hasOwnProperty(key)) {
			stage.screens[action.screen].areas[action.area].states[key].hidden = true;
		}
	}
	$("#object_" + action.area).addClass("hidden");
}

//To be backwards compatible show all states of the object
//In the future a parameter state can be added
function executeActionShowArea(action) {
	for (var key in stage.screens[action.screen].areas[action.area].states) {
		if (stage.screens[action.screen].areas[action.area].states.hasOwnProperty(key)) {
			stage.screens[action.screen].areas[action.area].states[key].hidden = false;
		}
	}
	$("#object_" + action.area).removeClass("hidden");
}

function executeActionShowText(action) {
	showText(getText(action.text));
}

function executeActionAreaCompleteObjective(action) {
	objectivesCompleted[action.objective] = true;
}

function executeActionAreaChangeState(action) {
	stage.screens[action.screen].areas[action.area].currentState = action.state;
	$("#object_" + action.area).remove();
	if (action.screen === currentScreenId) {
		loadArea(action.area);
	}
}

function executeActionScreenChangeImage(action) {
	stage.screens[action.screen].currentImage = action.image;
	if (action.screen === currentScreenId) {
		// Reload only the screen image (not all areas)
		var screenPath = currentScreen.images[currentScreen.currentImage].img;
		screenPath = isAbsolutePath(screenPath) ? screenPath : stageScreenPath + screenPath;
		loadAsynchronousImage($('#canvas'), screenPath, true);
	}
}

function executeActionTalk(action) {
	var talk = stage.talks[action.talk];
	var character = stage.characters[talk.characterId];
	
	// Image
	var imagePath = character.img;
	imagePath = isAbsolutePath(imagePath) ? imagePath : stageCharacterPath + imagePath;
	$("#conversationImg").html("<img src='" + imagePath + "'>");
	
	// If there is only one answer it will shown in the upper box, if there is multiple answers they will be shown in the lower box
	var ul = $("<ul></ul>"); // Multiple answers
	var p = $("<p style='color:" + character.fontColor + "'></p>"); // One answer
	var next = $("<img src='/img/menu/next.png' />");
	
	for (var i=0; i<talk.answers.length; i++) {
		var answer = talk.answers[i];
		if (fulfillConditions(answer.conditions)) {
			if (ul.children().size() === 0) {
				p.html((talk.characterId === stage.mainCharacter ? "" : "<strong>\"" + getText(character.name) + "\": </strong>") + 
				unescapeNewLinesHTML(getText(answer.text)) + "</p>");
				next.click(executeInteractionsCallback(answer.interactions));
			} else {
				p.html("");
			}
			var li = $("<li style='color:" + stage.characters[talk.characterId].fontColor + "'>" + getText(answer.text) + "</li>");
			li.click(executeInteractionsCallback(answer.interactions));
			ul.append(li);
		}
	}
	
	var multipleAnswers = ul.children().size() > 1;
	
	$("#conversationText").html(p);
	
	if (multipleAnswers) {
		$("#conversationOptions").html(ul);
	} else {
		$("#conversationNext").html(next);
	}
	
	$("#conversationOptions").toggle(multipleAnswers);
	$("#conversationNext").toggle(!multipleAnswers);
	
	$("#conversation").show();
}