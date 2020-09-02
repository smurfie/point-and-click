"use strict";

$(document).ready(function() {
	$("iframe").load(function() {
		this.width  = this.contentWindow.document.body.scrollWidth;
		this.height = this.contentWindow.document.body.scrollHeight;
	});
});