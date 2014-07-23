$(document).ready(function() {

	/*var windowHeight = $(window).height();
	var windowWidth = $(window).width();
	
	var vvHeaderHeight = $("#vvHeader").outerHeight();
	var videoSidebarWidth = $("#video-sidebar").outerWidth();
	var calculatedHeight = windowHeight - vvHeaderHeight;
	var calculatedWidth = windowWidth - videoSidebarWidth;
	
	$("#video-main").width(calculatedWidth);
	$("#video-main").height(calculatedHeight);
	$("#video-sidebar").height(calculatedHeight);

	var btnContainerWidth = $("#btnContainer").outerWidth();
	var calculatedWidthPluginContainer = calculatedWidth - btnContainerWidth;

	$("#pluginContainer").width(calculatedWidthPluginContainer);
	$("#pluginContainer").height(calculatedHeight);
	$("#btnContainer").height(calculatedHeight);	*/

	//alert("inCallContainer: " +$("#inCallContainer").width());
	//alert("inCallPluginAndControlsWrap: " +$("#inCallPluginAndControlsWrap").width());
	//alert("pluginContainer: " +$("#pluginContainer").width());

	var configContainerWidth = $("#setupCameraButtonToggleConfig").width();
	$(".setupAccessoryConfigContainer").innerWidth(configContainerWidth);

});
