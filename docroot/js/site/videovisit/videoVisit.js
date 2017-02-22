var isRunningLate = true;
var runningLateRecursiveCall;

$(document).ready(function() {
	//$('html').css('overflow-y', 'hidden');
	var windowHeight = $(window).height();
	var windowWidth = $(window).width();
	
	var vvHeaderHeight = $("#vvHeader").outerHeight();
	var videoSidebarWidth = $("#video-sidebar").outerWidth();
	var calculatedHeight = windowHeight - vvHeaderHeight;
	var calculatedWidth = windowWidth - videoSidebarWidth;
	
	$("#inCallPluginAndControlsWrap").height(calculatedHeight);
	$("#video-sidebar").height(calculatedHeight);
	$(".video-sidebar-content").height(calculatedHeight - 33);
	/*$("#waitingRoom").css("background-image","url('vidyoplayer/img/waiting_rm_bkgd.png')");*/

	var btnContainerWidth = $("#btnContainer").outerWidth();
	var calculatedWidthPluginContainer = calculatedWidth - btnContainerWidth;
	
	/* Mandar [DE7189] - Code changes for right side space */
	var calWidth = windowWidth - (200 + btnContainerWidth);
	$("#pluginContainer").width(calWidth);
	/* Mandar [DE7189] END */
	
	$("#pluginContainer").height(calculatedHeight);
	$("#btnContainer").height(calculatedHeight);
	
	$("#infoWrapper").height(calculatedHeight);
	$("#infoWrapper").width(calculatedWidthPluginContainer);
	
	$("#setupContents").height(calculatedHeight);
	$("#setupContents").width(calculatedWidthPluginContainer);
	
	//make ajax call to KP Keep alive url
    var keepAliveUrl = $("#kpKeepAliveUrl").val();
    if(keepAliveUrl != null && keepAliveUrl != "" && keepAliveUrl.length > 0 && keepAliveUrl != "undefined")
    {
    	try
    	{
	    	$.ajax({
	    	    url: keepAliveUrl,
	    	    type: 'GET',
	    	    dataType: 'jsonp',
	    	    cache: false,
	    	    async: true,
	    	    crossDomain:true,
	    	    success: function(returndata){    	    	
	    	    },
	            error: function() {            	
	            }
	    	});
    	}
    	catch(e)
		{
			
		}
    }

    // US14832 - Displaying dynamic message in Waiting Room based on reccurent service call [START]
    // This service call will trigger for every 2 minutes
    var waitingRoomCheck = function(){
    	if(VIDEO_VISITS.Path.IS_HOST_AVAILABLE == false){
			$.ajax({
				type: "GET",
				url: VIDEO_VISITS.Path.visit.providerRunningLateInfo,
				cache: false,
				dataType: "json",
				data: {'meetingId':$("#meetingId").val()},
				success: function(result, textStatus){
					if(result.service.status.code == 200){
						isRunningLate = result.service.runningLateEnvelope.isRunningLate;
						if(isRunningLate == true){
							var newMeetingTimeStamp = result.service.runningLateEnvelope.runLateMeetingTime;
							var newTime = convertTimestampToDate(newMeetingTimeStamp, 'time_only');
							if($("#isHost").val() == true){
								$('#displayMeetingNewStartTime').html('');
							}else{
								$('#displayMeetingNewStartTime').html('New Start '+newTime);
							}
							$(".waitingroom-text").html("Your visit will now start at <b>"+newTime+"</b><br><span style='font-size:20px;line-height:44px;'>Your doctor is running late</span>");
						}else{
							$(".waitingroom-text").html("Your visit will start once your doctor joins.");
						}
					}
				},
				error: function(textStatus){
					console.log("RUNNING LATE ERROR: "+textStatus);
				}
			});
		}else{
			window.clearInterval(runningLateRecursiveCall);
			$('#displayMeetingNewStartTime').html('');
		}
	};

	waitingRoomCheck();

	// Making a service for every 2 minutes
	runningLateRecursiveCall = window.setInterval(function(){
    	waitingRoomCheck();
    },120000);

    // US14832 - Displaying dynamic message in Waiting Room based on recurrent service call [END]

	/*$('#meetingDisconnected').click(function() {
		closeDialog('dialog-block-meeting-disconnected');
		if ($('#pluginContainer').css('visibility') == 'hidden'){
			$('#pluginContainer').css({"visibility":"visible"});
		}
    });*/

    $(window).scroll(function(e) {
     	if($('#splash').css('display') === "block"){
        	$(window).scrollTop(0);
	    }
     });

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

	$('#container-videovisit').css("min-width", "900px");/*us13302*/

	/* Setting resize Widths */
	var windowWidth = $(window).width();
	var videoSidebarWidth = $("#video-sidebar").outerWidth();
	var btnContainerWidth = $("#btnContainer").outerWidth();

	var width = $('#container-videovisit').width();

	console.log("vvHeader width: " + $('vvHeader').width());

	if($('#video-sidebar').css('display') == 'none'){
		var calculatedWidthPluginContainer = width - btnContainerWidth;
		$("#pluginContainer").width(calculatedWidthPluginContainer);
		$("#infoWrapper").width(calculatedWidthPluginContainer);
	}
	else{
		var calculatedWidthPluginContainer = width - (200 + btnContainerWidth);
		$("#pluginContainer").width(calculatedWidthPluginContainer);
		$("#infoWrapper").width(calculatedWidthPluginContainer);
	}

	/* Setting resize Heights */
	var windowHeight = $(window).height();
	var vvHeaderHeight = $("#vvHeader").outerHeight();
	var calculatedHeight = windowHeight - vvHeaderHeight;

	//$('#container-videovisit').height(calculatedHeight);
	$("#video-main").height(calculatedHeight);
	$("#pluginContainer").height(calculatedHeight);
	$("#video-sidebar").height(calculatedHeight);
	$(".video-sidebar-content").height(calculatedHeight - 33);
	$("#btnContainer").height(calculatedHeight);
});
