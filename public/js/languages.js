// Default language is taken of the public var defaultLanguage (that is loaded from stage.defaultLanguage at program start)
var languageList = {
	"en_US": "English",
	"es_ES": "Castellano",
	"ca_ES": "Català"
}

function loadLanguagesJS() {
	$("#languageList").change(function(){
		var hasValue = $(this).val() != null;
		
		//If all the languages are added disable the add button
		var moreLanguages = false;
		for (var key in languageList) {
			if (languageList.hasOwnProperty(key) && !stage.languages[key]) {
				moreLanguages = true;
			}
		}
		
		$("#addLanguageButton").prop("disabled", !moreLanguages);
		$("#delLanguageButton, #defaultLanguageCheck").prop("disabled", !hasValue || $(this).val() === stage.defaultLanguage);
		$("#defaultLanguageCheck").prop("checked", hasValue && $(this).val() === stage.defaultLanguage);
	});
	
	$("#defaultLanguageCheck").change(function(){
		if ($(this).is(":checked")) {
			stage.defaultLanguage = $("#languageList").val();
			$(this).prop("disabled", true);
			
			//Reload all to use the new default language
			init(true);
		}
	});
	
	$("#addLanguageButton").click(function(){
		$("#languageAddList").empty();
		for (var key in languageList) {
			if (languageList.hasOwnProperty(key) && !stage.languages[key]) {
				var option = $("<option value='" + key + "'>" + languageList[key] + "</option>");
				option.prop("title", languageList[key]);
				$("#languageAddList").append(option);
			}
		}
		
		$("#languageEditor")[0].showModal();
	});
	
	$("#delLanguageButton").click(function(){
		var sure = confirm("Sure you want to delete this language? All translated texts will be deleted too!");
		if (sure) {
			delLanguage($("#languageList").val());
			loadLanguages($("#languageList"), defaultLanguage);
		}
	});
	
	$("#addLanguage").click(function() {
		var languageId = $("#languageAddList").val();
		stage.languages[languageId] = languageList[languageId];
		loadLanguages($("#languageList"), languageId);
		
		$(this).closest("dialog")[0].close();
	});
	
	$("#exportLanguageButton").click(function() {
		var languageId = $("#languageList").val();
		var texts = "";
		
		for (var key in stage.texts) {
			if (stage.texts.hasOwnProperty(key) && typeof stage.texts[key][languageId] !== "undefined" 
					&& stage.texts[key][languageId] !== "") {
				// Take the current text if exists
				texts += key + TRANSLATION_SEPARATOR + stage.texts[key][languageId] + TRANSLATION_SEPARATOR + "\n";
			} else if (stage.texts.hasOwnProperty(key) && typeof stage.texts[key][stage.defaultLanguage] !== "undefined"
					&& stage.texts[key][stage.defaultLanguage] !== "") {
				// If not exists take the default one if exists
				texts += key + TRANSLATION_SEPARATOR + stage.texts[key][stage.defaultLanguage] + TRANSLATION_SEPARATOR + "\n";
			}
		}
		
		download(stage.folderName + "-" + languageId + ".txt", texts.replace(/\n$/, ""));
	});
	
	$("#importLanguageButton").click(function() {
		$("#importLanguageFile").click();
	});
	
	$("#importLanguageFile").change(function() {
		var sure = confirm("All the translations for this languages will be overwritten with the ones in the file. Are you sure?");
		if (sure) {
			var reader = new FileReader();
			reader.onload = function() {
				var languageId = $("#languageList").val();
				var texts = this.result;
				var textArray = texts.split(TRANSLATION_SEPARATOR);
				textArray.pop(); //Remove the last element because it's empty
				
				for (var i=0; i<textArray.length; i+=2) {
					var idTranslation = textArray[i].replace(/^\n/, "");
					var translation = textArray[i+1];
					if (idTranslation.length !== 8 || !stage.texts[idTranslation]) {
						alert("An ocurred parsing element number " + (1+(i/2)) + ", texts relateds: (" + idTranslation + "): " + translation);
						throw new Error("parse error!");
					}
					stage.texts[idTranslation][languageId] = translation;
				}
				alert("File imported successfully!");
			};
			reader.readAsText($(this)[0].files[0]);
		}
		$("#importLanguageFile").val("");
	});
}

function loadLanguages(select, languageId) {
	select.empty();
	for (var key in stage.languages) {
		if (stage.languages.hasOwnProperty(key)) {
			var option = $("<option value='" + key + "'>" + stage.languages[key] + "</option>");
			option.prop("title", stage.languages[key]);
			select.append(option);
		}
	}
	selectValue(select, languageId);
}
// Creates a text with it's default language and returns it's id
function createText(text) {
	var textId = randomString(8);
	// If after 10 tries we don't generated a non existing id, let's resign.
	for (var i=0; i<10 && stage.texts[textId]; i++) {
		textId = randomString(8);
	}
	if (stage.texts[textId]) return false;
	
	stage.texts[textId] = {};
	stage.texts[textId][defaultLanguage] = text;
	
	return textId;
}

// Returns the text asociated to the id passed as parameter.
// If no language is defined then the default is taken.
// If the text is empty then take the defaultLanguage text
function getText(id, language) {
	language = typeof language === "undefined" ? defaultLanguage : language;
	return typeof stage.texts[id][language] === "undefined" ? stage.texts[id][stage.defaultLanguage] : stage.texts[id][language];
}

function setText(text, id, language) {
	language = typeof language === "undefined" ? defaultLanguage : language;
	stage.texts[id][language] = text;
}

function delText(id) {
	delete stage.texts[id];
}

function delLanguage(languageId) {
	for (var key in stage.texts) {
		if (stage.texts.hasOwnProperty(key) && typeof stage.texts[key][languageId] !== "undefined") {
			delete stage.texts[key][languageId];
		}
	}
	delete stage.languages[languageId];
}

function download(filename, text) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);
	
	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}