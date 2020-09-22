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
	}
}

function executeActionGoTo(action) {
	loadScreen(action.screen, true);
}

function executeActionPickUpObject(action) {
	var found = false;
	for (var i=0; i<savegame.inventory.length && !found; i++) {
		if (savegame.inventory[i].object == action.object) {
			found = true;
			savegame.inventory[i].num += parseInt(action.num);
		}
	}
	if (!found) {
		savegame.inventory.push({
			"object": action.object,
			"num": parseInt(action.num)
		});
	}
	drawInventory();
	
	// Scroll to bottom of inventory
	 $("#inventory").stop().animate({scrollTop:$("#inventory")[0].scrollHeight}, 1000)
}

function executeActionRemoveObject(action) {
	var found = false;
	for (var i=0; i<savegame.inventory.length && !found; i++) {
		if (savegame.inventory[i].object == action.object) {
			found = true;
			savegame.inventory[i].num -= parseInt(action.num);
			if (savegame.inventory[i].num <= 0) {
				savegame.inventory.splice(i,1);
			}
		}
	}
	drawInventory();
}

// Mark the area as hidden in the savegame
function executeActionHideArea(action) {
	createScreenArea(action.screen, action.area);
	savegame.screens[action.screen].areas[action.area].hidden = true;
	$("#object_" + action.area).addClass("hidden");
}

// Mark the area as shown in the savegame
function executeActionShowArea(action) {
	createScreenArea(action.screen, action.area);
	savegame.screens[action.screen].areas[action.area].hidden = false;
	$("#object_" + action.area).removeClass("hidden");
}

function executeActionShowText(action) {
	showText(getText(action.text));
}

function executeActionAreaCompleteObjective(action) {
	savegame.objectivesCompleted[action.objective] = true;
}

function executeActionAreaChangeState(action) {
	createScreenArea(action.screen, action.area);

	savegame.screens[action.screen].areas[action.area].stateId = action.state;
	$("#object_" + action.area).remove();
	if (action.screen === savegame.screenId) {
		loadArea(action.area);
	}
}

function executeActionScreenChangeImage(action) {
	createScreenArea(action.screen, action.area);

	savegame.screens[action.screen].imageId = action.image;
	if (action.screen === savegame.screenId) {
		// Reload only the screen image (not all areas)
		var screenPath = stage.screens[savegame.screenId].images[action.image].img;
		screenPath = isAbsolutePath(screenPath) ? screenPath : stageScreenPath + screenPath;
		loadAsynchronousImage($('#canvas'), screenPath, true);
	}
}

function executeActionTalk(action) {
	loadTalk(action.talk);
	savegame.talkId = action.talk;
}

function loadTalk(talkId) {
	var talk = stage.talks[talkId];
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
				next.click(executeTalkInteractionsCallback(answer.interactions));
			} else {
				p.html("");
			}
			var li = $("<li style='color:" + stage.characters[talk.characterId].fontColor + "'>" + getText(answer.text) + "</li>");
			li.click(executeTalkInteractionsCallback(answer.interactions));
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

function executeTalkInteractionsCallback(interactions) {
	return function(){
		$("#conversation").hide();
		delete savegame.talkId;
		findAndExecuteActions(interactions);
	}
}