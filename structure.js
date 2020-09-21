// As this game doesn't use interfaces this file explains the structure of the main variables
stage = {
	stageName: textId,
	folderName: stringPath,
	initialScreen: screenId,
	width: number,
	screens: {
		id: {
			name: string,
			images: {
				id: {
					name: string,
					img: stringPath
				}
			},
			defaultImage: imageId,
			areas:{
				id: { // always an id = onLoad
					name: string,
					states: {
						idState: { // always an id = default
							name: string, // if != default
							img: stringPath,
							description: textId,
							cursor: cursorId,
							top: number,
							left: number,
							width: number,
							height: number,
							zindex: number,
							alpha: number, // float
							hidden: boolean
						}
					},
					interactions: [
						interactionId
					]
				}
			}
		}
	},
	objects: { //Inventory objects that don't change (instead can be destroyed and added another one), can stack...
		id: {
			name: string,
			img: stringPath,
			description: textId,
			stacks:[
				{ //Ordered list saying the minNumber for which is applicable (for money for example)
					minNumber: number,
					img: stringPath,
					description: textId
				}
			]
		}	
	},
	objectives: {
		id: {
			name: string
		}
	},
	mixtures: {
		description: textId, // default text for any mixture
		id: { // object1 id
			description: textId, // default text for any mixture using object1
			id: { // object2 id or screenId_areaId
				interactions: [
					interactionId
				]
			}
		}
	},
	interactions: {
		interactionId: {
			onlyOnce: boolean,
			conditions: [
				{
					typeId: conditionId,
					negate: boolean
					// + Condition properties described below
				}
			],
			actions: [
				{
					typeId: actionId
					// + Action properties described below
				}
			]
		}
	},
	triggers: [
		{
			name: string,
			onlyOnce: boolean,
			conditions: [
				{
					typeId: conditionId,
					negate: boolean
					// + Condition properties described below
				}
			],
			actions: [
				{
					typeId: actionId
					// + Action properties described below
				}
			]
		}
	],
	texts: {
		id: {
			languageId: string, // At least one language is requires (the default one)
			languageId2: string // Optional (other languages)
		}
	},
	characters: {
		id: {
			name: textId,
			img: stringPath,
			fontColor: stringColor // default: green
		}
	},
	mainCharacter: characterId, // If characters is not empty mainCharacter has to exist
	talks: {
		id: {
			characterId,
			answers: [ // At least one answer has to be always possible, if only one answer is possible it is triggered automatically
				{
					text: textId,
					conditions: [ // To show or not the option
						{
							typeId: conditionId,
							negate: boolean
							// + Condition properties described below
						}
					],
					interactions: [ // Once the option is clicked
						interactionId
					]
				}
			]
		}
	},
	defaultLanguage: stringLanguage, // default "en_US"
	languages: {
		id: string, // Example "en_US": "English"
	},
	version: number
}

/*
condition properties:
	1 - HAS_OBJECT: Do you have "num" objectId's?
		objectId, num
	2 - OBJECTIVE_COMPLETED: Do you completed objectiveId
		objectiveId
	3 - AREA_HAS_STATE:  The areaId in screenId has the stateId (if doesn't exists in savegame it's 
			looked in stage default state)
		screenId, areaId, stateId

action properties:
	1 - GO_TO: go to screenId
		screenId
	2 - PICK_UP_OBJECT: Pick up "num" objectId's
		objectId, num
	3 - REMOVE_OBJECT: Remove "num" objectId's
		objectId, num
	4 - HIDE_AREA: Hide areaId from screenId
		screenId, areaId
	5 - SHOW_AREA: Show areaId from screenId
		screenId, areaId
	6 - SHOW_TEXT: Show textId with savegame.language
		textId
	7 - COMPLETE_OBJECTIVE: Complete objectiveId
		objectiveId
	8 - AREA_CHANGE_STATE: Change state from areaId in screenId to stateId
		screenId, areaId, stateId
	9 - SCREEN_CHANGE_IMAGE: Change image from screenId to imageId
		screenId, imageId
	10 - TALK: Begin a converstaion with talkId
		talkId

cursors :
	0 - NONE
	1 - HAND
	2 - BUBBLE
	3 - EYE
	4 - ARROW_UP
	5 - ARROW_RIGHT
	6 - ARROW_DOWN
	7 - ARROW_LEFT
*/


savegame = {
	language: stringLanguage,
	screenId: screenId,
	screens: {
		screenId: {
			imageId: imageId,
			areas: [
				{
					areaId: {
						stateId: stateId,
						hidden: boolean
					}
				}
			]
		}
	},
	onlyOnceInteractionsExecuted: [
		interactionId
	],
	onlyOnceTriggersExecuted : [
		index
	],
	inventory: [
		{
			objectId: objectId,
			num: string
		}
	],
	objectSelected: objectId,
	objectivesCompleted: {
		objectiveId: true
	},
	talkId: talkId
}
