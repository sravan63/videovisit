$(document).ready(function() {

	var windowHeight = $(window).height();
	var windowWidth = $(window).width();
	
	var vvHeaderHeight = $("#vvHeader").outerHeight();
	var videoSidebarWidth = $("#video-sidebar").outerWidth();
	var calculatedHeight = windowHeight - vvHeaderHeight;
	var calculatedWidth = windowWidth - videoSidebarWidth;
	
	$("#inCallPluginAndControlsWrap").height(calculatedHeight);
	$("#video-sidebar").height(calculatedHeight);

	var btnContainerWidth = $("#btnContainer").outerWidth();
	var calculatedWidthPluginContainer = calculatedWidth - btnContainerWidth;

	$("#pluginContainer").width(calculatedWidthPluginContainer);
	$("#pluginContainer").height(calculatedHeight);
	$("#btnContainer").height(calculatedHeight);
});

var VideoVisit =
{
	setMinDimensions: function(){
		/*console.log("inside setMinWidths");
		console.log("vvHeader width: " +$('#vvHeader').outerWidth());
		console.log("clinician-name width: " +$('#clinician-name').outerWidth());
		console.log("leaveEndBtnContainer width: " +$('#leaveEndBtnContainer').outerWidth());	*/

		var btnContainerWidth = $("#btnContainer").width();
		var calculatedMinWidth = $('#clinician-name').outerWidth() + $('#leaveEndBtnContainer').outerWidth() +10;

		/* Setting min-widths */
		$('#container-videovisit').css("min-width", calculatedMinWidth);
		$("#video-main").css("min-width", calculatedMinWidth-200);
		$("#pluginContainer").css("min-width", calculatedMinWidth-200-btnContainerWidth);

		
		/* Setting min-heights */
		var btnGroupHeight = $("#buttonGroup").outerHeight();

		$("#video-main").css("min-height", btnGroupHeight);
		$("#pluginContainer").css("min-height", btnGroupHeight);
		$("#video-sidebar").css("min-height", btnGroupHeight);
		$("#btnContainer").css("min-height", btnGroupHeight);
	}
}

$(window).resize(function(){
	//console.log("inside resize");

	/* Setting resize Widths */
	var windowWidth = $(window).width();
	var videoSidebarWidth = $("#video-sidebar").outerWidth();
	var btnContainerWidth = $("#btnContainer").outerWidth();

	if($('#video-sidebar').css('display') == 'none'){
		console.log("inside if: video sidebar display none");
		var calculatedWidthPluginContainer = windowWidth - btnContainerWidth;
		$("#pluginContainer").width(calculatedWidthPluginContainer);
	}
	else{
		console.log("inside else: video sidebar display yes");
		var calculatedWidthPluginContainer = windowWidth - (200 + btnContainerWidth);
		$("#pluginContainer").width(calculatedWidthPluginContainer);
	}

	/* Setting resize Heights */
	var windowHeight = $(window).height();
	var vvHeaderHeight = $("#vvHeader").outerHeight();
	var calculatedHeight = windowHeight - vvHeaderHeight;

	//$('#container-videovisit').height(calculatedHeight);
	$("#video-main").height(calculatedHeight);
	$("#pluginContainer").height(calculatedHeight);
	$("#video-sidebar").height(calculatedHeight);
	$("#btnContainer").height(calculatedHeight);
});
