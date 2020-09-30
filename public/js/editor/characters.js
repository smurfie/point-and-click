function loadCharactersJS() {
	// Characters
	$("#characterList").change(function(){
		var hasValue = $(this).val() != null;
		if (hasValue) {
			currentCharacterId = $(this).val();
			currentCharacter = stage.characters[currentCharacterId];
			$("#characterImg").val(currentCharacter.img);
			$("#characterFontColor").val(currentCharacter.fontColor || "green");
			$("#characterFontColorDiv").css("color", $("#characterFontColor").val());
			$("#characterFontColorDiv").css("backgroundColor", $("#characterFontColor").val());
			$("#mainCharacter").prop('checked', currentCharacterId===stage.mainCharacter);
			$("#mainCharacter").prop("disabled", currentCharacterId===stage.mainCharacter);
			loadCharacterImgDOM();
			loadTalks(currentCharacterId, $("#talkList"));
		}
		$("#characterProperties").toggle(hasValue);
		$("#editCharacterButton").prop("disabled", !hasValue);
		$("#delCharacterButton").prop("disabled", !hasValue || currentCharacterId===stage.mainCharacter);
		$("#characterProperties").prop("disabled", !hasValue);
		$("#characterTalks").toggle(hasValue);
	});
	
	$(".updateCharacter").change(function(){
		currentCharacter.img = $("#characterImg").val();
		currentCharacter.fontColor = $("#characterFontColor").val();
		loadCharacterImgDOM();
		$("#characterFontColorDiv").css("color", $("#characterFontColor").val());
		$("#characterFontColorDiv").css("backgroundColor", $("#characterFontColor").val());
		if ($("#mainCharacter").is(":checked")) {
			stage.mainCharacter = currentCharacterId;
			$("#mainCharacter, #delCharacterButton").prop("disabled", true);
		}
	});
	
	$("#editCharacterButton").click(function(){
		$("#characterId").val(currentCharacterId);
		$("#characterName").val(getText(currentCharacter.name));
		$("#characterEditor").removeClass("add");
		$("#characterEditor")[0].showModal();
	});
	
	$("#addCharacterButton").click(function(){
		if (!stage.characters) {
			stage.characters = {};
		}
		
		var characterId = randomString(8);
		// If after 10 tries we don't generated a non existing id, let's resign.
		for (var i=0; i<10 && stage.characters[characterId]; i++) {
			characterId = randomString(8);
		}
		if (stage.characters[characterId]) return;
	
		$("#characterId").val(characterId);
		$("#characterName").val("");
		$("#characterEditor").addClass("add");
		$("#characterEditor")[0].showModal();
	});
	
	$("#delCharacterButton").click(function(){
		var sure = confirm("The character and all his talks will be deleted. Are you sure?");
		if (sure) {
			delCharacter(currentCharacterId);
		}
	});
	
	$("#saveCharacter").click(function() {
		var characterId = $("#characterId").val();
		if ($(this).closest("dialog").hasClass("add")) {
			stage.characters[characterId] = {};
			stage.characters[characterId].name = createText($("#characterName").val());
			
			// If is the first character make it the main character
			if (!stage.mainCharacter) {
				stage.mainCharacter = characterId;
			}
			loadCharacters($("#characterList"), characterId);
		} else {
			setText($("#characterName").val(), stage.characters[characterId].name);
			$("#characterList :selected").html(getText(stage.characters[characterId].name));
		}

		$(this).closest("dialog")[0].close();
	});
	
	// Talks
	$("#talkList").change(function(){
		var hasValue = $(this).val() != null;
		if (hasValue) {
			currentTalkId = $(this).val();
			currentTalk = stage.talks[currentTalkId];
		}
		
		$("#editTalkButton").prop("disabled", !hasValue);
		$("#delTalkButton").prop("disabled", !hasValue);
	});
	
	$("#editTalkButton").click(function(){
		$("#talkId").val(currentTalkId);
		loadAnswers($("#answerList"), currentTalk.answers);
		
		$("#talkEditor").removeClass("add");
		$("#talkEditor")[0].showModal();
	});
	
	$("#addTalkButton").click(function(){
		if (!stage.talks) {
			stage.talks = {};
		}
		
		var talkId = randomString(8);
		// If after 10 tries we don't generated a non existing id, let's resign.
		for (var i=0; i<10 && stage.talks[talkId]; i++) {
			talkId = randomString(8);
		}
		if (stage.talks[talkId]) return;
		
		$("#talkId").val(talkId);
		loadAnswers($("#answerList"), []);
		
		$("#talkEditor").addClass("add");
		$("#talkEditor")[0].showModal();
	});
	
	$("#delTalkButton").click(function(){
		var sure = confirm("The talk and all his interactions and answers will be deleted. Are you sure?");
		if (sure) {
			delTalk($("#talkList").val());
		}
	});
	
	// Answers / Options
	$("#answerList").change(function(){
		var hasValue = $("#answerList").val() !== null;
		$("#editAnswerButton").prop("disabled", !hasValue);
		$("#delAnswerButton").prop("disabled", !hasValue);
		$("#downAnswerButton").prop("disabled", !hasValue || $("#answerList option:selected").val() === $("#answerList option:last").val());
		$("#upAnswerButton").prop("disabled", !hasValue || $("#answerList option:selected").val() === $("#answerList option:first").val());
		
		if (hasValue) {
			currentAnswer = currentTalk.answers[$(this).val()];
		}
	});
	
	$("#editAnswerButton").click(function() {
		$("#answerEditor").removeClass("add");
		$("#answerId").val($("#answerList").val());
		
		$("#answerText").val(getText(currentAnswer.text));
		loadConditions($("#answerConditionList"), currentAnswer.conditions);
		$("#answerInteractionsButton .interactionsNumber").text(currentAnswer.interactions.length);
		
		$("#answerEditor")[0].showModal();
	});
	
	$("#addAnswerButton").click(function() {
		$("#answerEditor").addClass("add");
		
		$("#answerText").val("");
		$("#answerConditionList").empty();
		$("#answerConditionList").change();
		$("#answerInteractionsButton").prop("disabled", true);
		
		$("#answerInteractionsButton .interactionsNumber").text(0);
		
		$("#answerEditor")[0].showModal();
	});
	
	$("#delAnswerButton").click(function() {
		var sure = confirm("Sure you want to delete this answer?");
		if (sure) {
			delAnswer($("#answerList").val(), currentTalk.answers, $("#answerList"));
			if (currentTalk.answers.length == 0) { //If is the last answer delete the currentTalk and change the modal to "add mode"
				currentTalk = null;
				delete stage.talks[currentTalkId];
				currentTalkId = null;
				$("#answerEditor").addClass("add");
			}
			// Reload talk list
			loadTalks(currentCharacterId, $("#talkList"));
		}
	});
	
	$("#downAnswerButton").click(function() {
		var i = parseInt($("#answerList").val());
		var tmp = currentTalk.answers[i];
		currentTalk.answers[i] = currentTalk.answers[i+1];
		currentTalk.answers[i+1] = tmp;
		loadAnswers($("#answerList"), currentTalk.answers, i+1);
	});
	
	$("#upAnswerButton").click(function() {
		var i = parseInt($("#answerList").val());
		var tmp = currentTalk.answers[i];
		currentTalk.answers[i] = currentTalk.answers[i-1];
		currentTalk.answers[i-1] = tmp;
		loadAnswers($("#answerList"), currentTalk.answers, i-1);
	});
	
	// Answer Modal
	$("#saveAnswer").click(function() {
		if ($(this).closest("dialog").hasClass("add")) {
			if (currentTalkId != $("#talkId").val()) { // It's a new talk and is the first answer so we have to create the talk
				currentTalkId = $("#talkId").val();
				stage.talks[currentTalkId] = {
					characterId: currentCharacterId,
					answers: []
				};
				currentTalk = stage.talks[currentTalkId];
			}
			currentTalk.answers.push({
				"text": createText($("#answerText").val()),
				"conditions": [],
				"interactions": []
			});
			$("#answerId").val(currentTalk.answers.length-1);
			$("#answerInteractionsButton").prop("disabled", false);
			
			$(this).closest("dialog").removeClass("add"); // Put the modal in edit mode
			$("#answerConditionList").change(); // Enable the add button triggering a change event to the list
		} else {
			setText($("#answerText").val(), currentTalk.answers[$("#answerId").val()].text);
		}
		// Update the answer and talk list
		loadAnswers($("#answerList"), currentTalk.answers,$("#answerId").val());
		loadTalks(currentCharacterId, $("#talkList"), currentTalkId);
	});
	
	$("#answerConditionList").change(function() {
		var hasValue = $(this).val() !== null;
		$("#editAnswerConditionButton").prop("disabled", !hasValue);
		$("#delAnswerConditionButton").prop("disabled", !hasValue);
		$("#addAnswerConditionButton").prop("disabled", $("#answerEditor").hasClass("add"));
		$("#downAnswerConditionButton").prop("disabled", !hasValue || $(this).find("option:selected").val() === $(this).find("option:last").val());
		$("#upAnswerConditionButton").prop("disabled", !hasValue || $(this).find("option:selected").val() === $(this).find("option:first").val());
	});
	
	$("#editAnswerConditionButton").click(function() {
		editConditionButton(currentAnswer.conditions, $("#answerConditionList"));
	});
	
	$("#addAnswerConditionButton").click(function() {
		addConditionButton(currentAnswer.conditions, $("#answerConditionList"));
	});
	
	$("#delAnswerConditionButton").click(function() {
		var sure = confirm("Sure you want to delete this condition?");
		if (sure) {
			delCondition($("#answerConditionList").val(), currentAnswer.conditions, $("#answerConditionList"));
		}
	});
	
	$("#downAnswerConditionButton").click(function() {
		var i = parseInt($("#answerConditionList").val());
		var tmp = currentAnswer.conditions[i];
		currentAnswer.conditions[i] = currentAnswer.conditions[i+1];
		currentAnswer.conditions[i+1] = tmp;
		loadConditions($("#answerConditionList"), currentAnswer.conditions, i+1);
	});
	
	$("#upAnswerConditionButton").click(function() {
		var i = parseInt($("#answerConditionList").val());
		var tmp = currentAnswer.conditions[i];
		currentAnswer.conditions[i] = currentAnswer.conditions[i-1];
		currentAnswer.conditions[i-1] = tmp;
		loadConditions($("#answerConditionList"), currentAnswer.conditions, i-1);
	});
	
	$("#answerInteractionsButton").click(function() {
		interactionsNumberDOM = $(this).find(".interactionsNumber");
		interactionList = currentAnswer.interactions;
		
		loadInteractionsModal(interactionsNumberDOM, interactionList);
	});
}

function loadCharacters(select, characterId) {
	select.empty();
	for (var key in stage.characters) {
		if (stage.characters.hasOwnProperty(key)) {
			var option = $("<option value='" + key + "'>" + getText(stage.characters[key].name) + "</option>");
			option.prop("title", getText(stage.characters[key].name));
			select.append(option);
		}
	}
	selectValue(select, characterId);
}

function loadCharacterImgDOM() {
	if ($("#characterImg").val() !== "") {
		var characterPath = $("#characterImg").val();
		characterPath = isAbsolutePath(characterPath) ? characterPath : stageCharacterPath + characterPath;
		$("#characterImgDOM").attr("src", characterPath);
	} else {
		$("#characterImgDOM").removeAttr("src");
	}
}

function delCharacter(characterId) {
	for (var key in stage.talks) {
		if (stage.talks.hasOwnProperty(key) && stage.talks[key].characterId === characterId) {
			delTalk(key);
		}
	}
	
	delText(stage.characters[characterId].name);
	delete stage.characters[characterId];
	loadCharacters($("#characterList"));
}

//Load the talks of the specified character
function loadTalks(characterId, select, talkId) {
	select.empty();
	for (var key in stage.talks) {
		if (stage.talks.hasOwnProperty(key) && stage.talks[key].characterId == characterId) {
			var text = talkTextToShow(stage.talks[key]);
			var option = $("<option value='" + key + "'>" + text + "</option>");
			option.prop("title", text);
			select.append(option);
		}
	}
	selectValue(select, talkId);
}

//Load all Talks
function loadAllTalks(select, talkId) {
	select.empty();
	for (var key in stage.talks) {
		if (stage.talks.hasOwnProperty(key)) {
			var text = talkTextToShow(stage.talks[key]);
			var option = $("<option value='" + key + "'>" + text + "</option>");
			option.prop("title", text);
			select.append(option);
		}
	}
	selectValue(select, talkId);
}

function talkTextToShow(talk) {
	var answers = talk.answers;
	
	// If we have multiple answers show an (M) at the beginning
	var textToShow = answers.length > 1 ? "(M) " : "";
	textToShow += getText(stage.characters[talk.characterId].name) +":\n";
	
	for (var i=0; i<answers.length; i++) {
		textToShow += "-" + getText(answers[i].text) + "\n";
	}
	
	return textToShow;
}

function delTalk(talkId) {
	var talk = stage.talks[talkId];
	
	delText(talk.text);
	
	// Delete all actions associated
	var allInteractions = getAllInteractions();
	for (var i=0; i<allInteractions.length; i++) {
		var interaction = allInteractions[i];
		
		if (interaction.actions) {
			for (var j=interaction.actions.length-1; j>=0; j--) {
				var action = interaction.actions[j];
				if (action.typeId === ACTIONS.TALK && action.talk === talkId) {
					delAction(j, interaction.actions);
				}
			}
		}
	}
	
	if (talk.answers) {
		for (var i=talk.answers.length-1; i>=0; i--) {
			delAnswer(i, talk.answers);
		}
	}
	
	delete stage.talks[talkId];
	loadTalks(currentCharacterId, $("#talkList"));
}

function loadAnswers(select, answers, answerId) {
	select.empty();
	for (var i=0; answers && i<answers.length; i++) {
		var option = $("<option value='" + i + "'>" + getText(answers[i].text) + "</option>");
		option.prop("title", getText(answers[i].text));
		select.append(option);
	}
	selectValue(select, answerId);
}

function delAnswer(answerId, answerList, answerListDOM) {
	var answer = answerList[answerId];
	
	delText(answer.text);
	
	for (var i=answer.conditions.length-1; i>=0; i--) {
		delCondition(i, answer.conditions);
	}
	
	for (var i=answer.interactions.length-1; i>=0; i--) {
		delInteraction(i, answer.interactions);
	}
	answerList.splice(answerId, 1);
	
	if (answerListDOM) {
		loadAnswers(answerListDOM, answerList);
	}
}