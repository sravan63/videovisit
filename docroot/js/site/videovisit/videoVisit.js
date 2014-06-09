$(document).ready(function() {

	var finalWidth = $(window).width();
	console.log("finalWidth: " +finalWidth);
	var finalHeight = $(window).height();
	console.log("finalHeight: " +finalHeight);
	//$('#joinNowIframe').css({"height": finalHeight*0.90});
	//$('#joinNowIframeGuest').css({"height": finalHeight*0.90});

	var calculatedWidth = finalWidth - 200;
	console.log("calculatedWidth: "+calculatedWidth);
	var calculatedHeight = finalHeight;
	console.log("calculatedHeight: "+calculatedHeight);

	$("#video-main").width(calculatedWidth);
	$("#video-main").height(calculatedHeight);
	$("#video-sidebar").height(calculatedHeight);

	var calculatedWidthPluginContainer = calculatedWidth-80;
	console.log("calculatedWidthPluginContainer: " +calculatedWidthPluginContainer);
	$("#pluginContainer").width(calculatedWidthPluginContainer);
	$("#pluginContainer").height(calculatedHeight);
	$("#btnContainer").height(calculatedHeight);
});
