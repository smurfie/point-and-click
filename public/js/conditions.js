function fulfillConditions(conditions) {
	if (conditions == null) return true;
	var passConditions = true;
	for (var i=0; i<conditions.length; i++){
		passConditions &= fulfillCondition(conditions[i]);
	}
	return passConditions;
}

function fulfillCondition(condition) {
	var result;
	switch (condition.typeId) {
		case CONDITIONS.HAS_OBJECT:
			result = fulfillConditionHasObject(condition);
			break;
		case CONDITIONS.OBJECTIVE_COMPLETED:
			result = fulfillConditionObjectiveCompleted(condition);
			break;
		case CONDITIONS.AREA_HAS_STATE:
			result = fulfillConditionAreaHasState(condition);
			break;
		default:
			result = false;
	}
	return condition.negate ? !result : result;
}

function fulfillConditionHasObject(condition) {
	for (var i=0; i<inventory.length; i++) {
		if (inventory[i].object===condition.object) {
			return inventory[i].num>=condition.num;
		}
	}
	return false;
}

function fulfillConditionObjectiveCompleted(condition) {
	return objectivesCompleted[condition.objective] != null;
}

function fulfillConditionAreaHasState(condition) {
	var area = stage.screens[condition.screen].areas[condition.area];
	if (!area.currentState) {
		area.currentState = area.defaultState;
	}
	return area.currentState == condition.state;
}