function loadCursor(img, cursor){
	var imgFile = cursorPath;
	var offset = "";
	switch (cursor) {
		case CURSORS.NONE:
			imgFile = "";
			offset = "";
			break;
		case CURSORS.HAND:
			imgFile += "hand.png";
			offset = "15 15";
			break;
		case CURSORS.BUBBLE:
			imgFile += "bubble.png";
			offset = "10 30";
			break;
		case CURSORS.EYE:
			imgFile += "eye.png";
			offset = "15 15";
			break;
		case CURSORS.ARROW_UP:
			imgFile += "arrow_up.png";
			offset = "15 0";
			break;
		case CURSORS.ARROW_RIGHT:
			imgFile += "arrow_right.png";
			offset = "30 15";
			break;
		case CURSORS.ARROW_DOWN:
			imgFile += "arrow_down.png";
			offset = "15 30";
			break;
		case CURSORS.ARROW_LEFT:
			imgFile += "arrow_left.png";
			offset = "0 15";
			break;
		default:
			imgFile += "hand.png";
			offset = "15 15";
			break;
	}
	img.css("cursor", "url(" + imgFile + ") " + offset + ", auto");
}