// Returns the text asociated to the id passed as parameter.
// If no language is defined then the savegame.language is taken if exists.
// If the text is empty then take the stage.defaultLanguage text
function getText(id, language) {
    language = typeof language === "undefined" ? 
            (typeof savegame === "undefined" ? stage.defaultLanguage : savegame.language) : language;
    return typeof stage.texts[id][language] === "undefined" ?
            stage.texts[id][stage.defaultLanguage] : stage.texts[id][language];
}
