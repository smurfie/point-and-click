# Changelog

## TODO
- Update Manual

## Nice to have
- Savegame (see structure.json file)

## 2020-09-18:
- Added gitignore for personal projects
- Moved updating version before language because old versions don't have language
- Removed empty descriptions from state areas
- Added a To Be Translated (TBT-) text to texts not yet translated when exporting
- Fixed some tooltip issues
- Added tooltip-up
- Redesign down-menu
- Make local backups when using the editor (new restore button)

## 2020-09-17:
- Removed properties from onLoad area not used

## 2020-09-06:
- Fix Safari stage bug
- Convert new lines in conversation box correctly (leave it without new lines in conversation options)
- Fix default action when no interaction can be selected
- Select language at start and remove options menu
- Update Readme

## 2020-09-04:
- Add Safari stage with translations (default catalan)
- Translation for stage name
- Fix some translation issues

## 2020-09-03:
- Added google analytics

## 2020-09-02:
- Cloned project from personal repo to make it public and removed all Eclipse and Google related stuff, also removed personal stages
- Added express to run it locally
- Added stage name to structure.json
- Added favicon
- Added Try it! To try the editor changes live
- Format this changelog to github style

## 2016-12-29:
- Updated Safari game
- Changed to Cloud Engine and Eclipse Neon

## 2016-11-05:
- Tweaked css

## 2016-10-29:
- Solved a bug when creating a new talk, canceling it and editing the current talk

## 2016-10-22:
- Solved bug that changed the current talk while adding a new answer
- Added scrollbar to answers
- Solved bug with single quotes in object description

## 2016-10-20:
- Resized the parent game window with the iframe width and heigth

## 2016-10-16:
- Changed the structure of talks and adapted the code

## 2016-10-14:
- Solved bugs related to talks

## 2016-10-12:
- Solved bug creating the states of the onLoad area
- Fixed css for too long text boxes
- Solved various bugs related to talks
- Added fontColor to characters

## 2016-10-11:
- Solved bug when changing name of character

## 2016-10-09:
- Added action talk in game

## 2016-09-27:
- Added action talk in editor

## 2016-09-25:
- Added talks objects and his options (next button, answers...), next to do is create the action talk

## 2016-08-24:
- Added characters

## 2016-08-23:
- Added triggers to the stage constructor
- Added save/load from local disk

## 2016-08-22:
- Added absolute image paths
- Fixed the width of the screen in the editor area
- Added background to the selected menu

## 2016-08-19:
- Added multi-language in an options screen in the game
- Box-sizing: border-box for editor and game and adjusted div sizes
- Solved bug showing boxes for a second in the place of areas when loading the first screen

## 2016-08-17:
- ** New version **
- Removed the language named default and by default use en_US. (Default language in the editor is loaded at init and not changed)
- Disabled the state box in onLoad area
- Removed onLoad descriptions from stage.texts, and area->state descriptions that are empty
- Added multi-language support to the editor (limited to en_US, es_ES, ca_ES) and solved some bugs related to it.

## 2016-08-13:
- Solved a bug when eliminating the last object
- Only let to save an action/condition if all the fields are correct
- Update the triggers and mixtures page each time is acceded (easier than updating each time a possible change is made in another page)
- All menu icons in black
- Bug with the getAllInteractions function not available from xx.jsp

## 2016-08-12:
- Redone all delete objects to delete recursively all the things that depends on them

## 2016-08-11:
- Solved a bug with the object states when if the state attribute was false (boolean) it used the default state attribute.

## 2016-08-10:
- ** New version **
- The game structure has been adapted to accept multiple languages
- Solved a bug introduced with the object states when if you pick an object and return to the same screen, the object reappear
- Solved a bug introduced with the object states when executing the showObject or hideObject action only works with one state

## 2016-08-08:
- ** New version **
- Added one time (onlyOnce) triggers
- Added one time (onlyOnce) interactions

## 2016-04-10:
- ** New version **
- Added triggers (editor and game) without the onlyOnce option
- Added Google Analytics

## 2016-04-07
- Added icons to the menus
- Introduced trigger menu and adapted the code to differentiate better between conditions/actions coming from triggers/interactions
- Deleted code that is not used anymore from Mixture Interactions
- Deleted the disabled in the jsp (The Javascript will handle it on start)
- Solved a bug where the button for deleting a Stack object don't get enabled ever

## 2016-03-15
- Added this changelog
- ** Discarded **: The possibility to have states in the objects. Drawbacks:
	- Change all actions/conditions object related (Gain object, Lose object, Has object)
	- In objects with multiple elements change the state of one or everyone?
	- Stack will depend also of the state?
	- If two objects with different state pass to have the same state, merge them?

## 2016-03-13
- Moved all the default properties of an area to the state "default"
- Added help tooltips

## 2016-03-10
- Solved a bug when the area has no interactions it allowed to add actions and conditions
- Changed some javascript to use $(this) instead of $(selector) to improve performance

## 2016-03-06
- Implemented the action of changing the background image (editor and game)
- Solved a bug upgrading to the latest version

## 2016-03-03
- ** New version **
- Changed the hidden buttons for disabled ones
- Added the functionality of having more than one image per screen (still not possible changing between them)
- Solved a bug in states
- Solved two bugs when reloading and area when changing its state

## 2016-02-29
- Created a function to get a property from an area/state
- Removed the bottom text after showing a dialog text
- Added z-index and opacity to areas

## 2016-02-25
- Added the possibility of changing the area properties when changing its state (in the game)
- Started new game "Barcelona"

## 2016-02-18
- Added option for sorting (Up/Down buttons) the Actions and Conditions in the Interactions modal
- Added option for sorting (Up/down buttons) the Interactions
- Added comment for clarifying the interactions functionality
- Added the possibility of changing the area properties when changing its state (only in the editor)

## 2016-02-16
- New property width (canvasWidth)
- Solved a bug in error 403 page

## 2016-02-09
- Added some css styles
- Added "/game" page with iframe for centering the game
- Queue for dialog text messages

## 2016-01-15
- ** New version **
- Changed the way mixtures works:
	- They accept more than 1 interactions
	- Removed description2 (It's a new interaction now)
	- Updated editor and game

## 2016-01-14
- Interactions in new modal (disacloped from areas)

## 2016-01-12
- Various bux fixes
- Various improvements for performance and usability

## 2015-12-25
- Case insensitive emails
- Added Pat to wanted permit list

## 2015-12-23
- ** New level: Christmas Gift **

## 2015-12-17
- Enhanced image loading

## 2015-12-16
- Various updates
- Created structure.json

## 2015-12-13
- Initial loading
- Proloading images

## 2015-12-12
- First upload
- ** New level: Wanted **