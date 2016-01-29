$(document).ready(function() {
	$('html').css('overflow-y', 'hidden');
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
	
	$("#infoWrapper").height(calculatedHeight);
	$("#infoWrapper").width(calculatedWidthPluginContainer);
	
	$("#setupContents").height(calculatedHeight);
	$("#setupContents").width(calculatedWidthPluginContainer);
});

var VideoVisit =
{
	setMinDimensions: function(){

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
		//$("#video-sidebar").css("min-height", btnGroupHeight);
		$("#btnContainer").css("min-height", btnGroupHeight);
		
		if (navigator.appName.indexOf("Internet Explorer")!=-1){
			if(navigator.appVersion.indexOf("MSIE 8")!=-1){
				$("#vidyoPlugin").css("min-height", btnGroupHeight);
				//$("#vidyoPlugin").css("min-width", calculatedMinWidth-200-btnContainerWidth);
			}
		}
	}
}

$(window).resize(function(){

	/* Setting resize Widths */
	var windowWidth = $(window).width();
	var videoSidebarWidth = $("#video-sidebar").outerWidth();
	var btnContainerWidth = $("#btnContainer").outerWidth();

	if($('#video-sidebar').css('display') == 'none'){
		var calculatedWidthPluginContainer = windowWidth - btnContainerWidth;
		$("#pluginContainer").width(calculatedWidthPluginContainer);
	}
	else{
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
