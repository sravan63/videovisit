var isRunningLate = true;
var runningLateRecursiveCall;
var newStartTimeRecursiveCall;
var meetingHostName = "";
var meetingPatientName = "";

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

	// Returns the code on pre call load to avoid the errors.
	if($("#pluginContainer").length == 0){
		return;
	}

	var host = ($("#meetingHost span").html().indexOf('&nbsp;') > -1)?$("#meetingHost span").html().replace('&nbsp;',''):$("#meetingHost span").html();
	var splittedHostName = host.trim().split(" ");
	for(var c=0;c<splittedHostName.length;c++){
		var char = splittedHostName[c].trim();
		if(char !== ""){
			meetingHostName += char+" ";
		}
	}
	meetingHostName = meetingHostName.trim();

	var patient = ($("#meetingPatient span").html().indexOf('&nbsp;') > -1)?$("#meetingPatient span").html().replace('&nbsp;',''):$("#meetingPatient span").html();
	var splittedPatientName = patient.trim().split(" ");
	for(var c=0;c<splittedPatientName.length;c++){
		var char = splittedPatientName[c].trim();
		if(char !== ""){
			meetingPatientName += char+" ";
		}
	}
	meetingPatientName = meetingPatientName.trim();
	
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
  //Start DE9501: VV_Provider_Member_Vidyo Page_"New Start" time is updating even if the Host joins the meeting
  //Start US18295: Running Late: Add time in player: add time in player
	
	var newStartTimeCheck = function(){
		if(VIDEO_VISITS.Path.IS_HOST_AVAILABLE == true){
			return;
		}
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
							$('#displayMeetingNewStartTime').html('New Start '+newTime);
							$(".waitingroom-text").html("Your visit will now start at <b>"+newTime+"</b><span style='font-size:20px;line-height:29px;display:block;margin-top:24px;'>We're sorry, your doctor is running late.</span>");
					}else{
						$('#displayMeetingNewStartTime').html('');
							$(".waitingroom-text").html("Your visit will start once your doctor joins.");
					}
				}
			},
			error: function(textStatus){
				console.log("RUNNING LATE ERROR: "+textStatus);
				$('#displayMeetingNewStartTime').html('');
				$(".waitingroom-text").html("Your visit will start once your doctor joins.");
			}
		});
	};
	var newStartTimeCheckForOneTime = function(){
		$.ajax({
			type: "GET",
			url: VIDEO_VISITS.Path.visit.providerRunningLateInfo,
			cache: false,
			dataType: "json",
			data: {'meetingId':$("#meetingId").val()},
			success: function(result, textStatus){
				if(result != null && result.service.status.code == 200){
					isRunningLate = result.service.runningLateEnvelope.isRunningLate;
					if(isRunningLate == true){
						var newMeetingTimeStamp = result.service.runningLateEnvelope.runLateMeetingTime;
						var newTime = convertTimestampToDate(newMeetingTimeStamp, 'time_only');
						$('#displayMeetingNewStartTime').html('New Start '+newTime);
						if(VIDEO_VISITS.Path.IS_HOST_AVAILABLE == false){
							$(".waitingroom-text").html("Your visit will now start at <b>"+newTime+"</b><span style='font-size:20px;line-height:29px;display:block;margin-top:24px;'>We're sorry, your doctor is running late.</span>");
						}
					}else{
						$('#displayMeetingNewStartTime').html('');
						if(VIDEO_VISITS.Path.IS_HOST_AVAILABLE == false){
							$(".waitingroom-text").html("Your visit will start once your doctor joins.");
						}
					}
				}
			},
			error: function(textStatus){
				console.log("RUNNING LATE ERROR: "+textStatus);
				$('#displayMeetingNewStartTime').html('');
				$(".waitingroom-text").html("Your visit will start once your doctor joins.");
			}
		});
	};
	
	newStartTimeCheckForOneTime();
	newStartTimeRecursiveCall = window.setInterval(function(){
		newStartTimeCheck();
    },120000);
	
	//End DE9501: VV_Provider_Member_Vidyo Page_"New Start" time is updating even if the Host joins the meeting
	//End US18295: Running Late: Add time in player: add time in player


    // US14832 - Displaying dynamic message in Waiting Room based on recurrent service call [END]

	/*$('#meetingDisconnected').click(function() {
		closeDialog('dialog-block-meeting-disconnected');
		if ($('#pluginContainer').css('visibility') == 'hidden'){
			$('#pluginContainer').css({"visibility":"visible"});
		}
    });*/

    //DE9451 - Splash screen scroll issue fix
	$('html').addClass("no-scroll");
	
});

var getPatientGuestNameList = function(){
	var pgNames = [];
	var patientGuestsLength = $('#meetingPatientGuest').children('p').length;
	for(var i=0; i<patientGuestsLength;i++){
		var lName = $($('#meetingPatientGuest').children('p')[i]).find(".lName").text().trim();
		var fName = $($('#meetingPatientGuest').children('p')[i]).find(".fName").text().trim();
		pgNames.push({fname:fName, lname:lName, index:i, isAvailable: false});
	}
	return pgNames;
}

var getAdditionalCliniciansNameList = function(){
	var additionalCliniciansNames = [];
	var additionalCliniciansLength = $('#meetingParticipant').children('p').length;
	for(var i=0; i<additionalCliniciansLength;i++){
		var clinicianName = $($('#meetingParticipant').children('p')[i]).find("span").text().trim();
		additionalCliniciansNames.push({name:clinicianName, index:i, isAvailable: false});
	}
	return additionalCliniciansNames;
}

var VideoVisit =
{
	setShowPrecallTestingFlag: function(flag){
		var val = (flag == true)?"true":"flag";
		$.ajax({
			type: "POST",
			url: VIDEO_VISITS.Path.visit.setPeripheralsFlag,
			cache: false,
			dataType: "json",
			data: {"showPeripheralsPage":val},
			success: function(result, textStatus){
				console.log(result);
			},
			error: function(textStatus){
				
			}
		});
	},
	checkAndShowParticipantAvailableState: function(participants,isWebRTC){
		if(participants){
			var patientGuests = getPatientGuestNameList();
			var additinalClinicians = getAdditionalCliniciansNameList();
			var hostAvailable = false;
			var patientAvailable = false;

        	for(var i=0;i<participants.length;i++){
        		var pData = participants[i];
        		var pName = (isWebRTC)?participants[i].trim():pData.name.trim();
        		// Host Availability
        		if(meetingHostName.toLowerCase().indexOf(pName.toLowerCase()) > -1){
        			hostAvailable = true;
        		}
        		// Patient Availability
        		if(meetingPatientName.toLowerCase().indexOf(pName.toLowerCase()) > -1){
        			patientAvailable = true;
        		}
        		// Patient Guests Availability
        		for(var pg=0;pg<patientGuests.length;pg++){
        			var guest = patientGuests[pg];
        			if(pName.toLowerCase().indexOf(guest.fname.toLowerCase()) > -1 && pName.toLowerCase().indexOf(guest.lname.toLowerCase()) > -1){
        				guest.isAvailable = true;
        			}
        		}
	  			// Additional Clinicians Availability
	  			for(var c=0;c<additinalClinicians.length;c++){
        			var clinician = additinalClinicians[c];
        			if(clinician.name.toLowerCase() == pName.toLowerCase()){
        				clinician.isAvailable = true;
        			}
        		}
        	}

        	// Host icon toggle
        	if(hostAvailable == true){
        		$("#hostActiveIcon").css("display","inline-block");
        	} else {
        		$("#hostActiveIcon").css("display","none");
        	}

        	// Patient icon toggle
        	if(patientAvailable == true){
        		$("#patientActiveIcon").css("display","inline-block");
        	} else {
        		$("#patientActiveIcon").css("display","none");
        	}

        	// Patient Guests icon toggle
    		for(var pg=0;pg<patientGuests.length;pg++){
    			var guest = patientGuests[pg];
    			if(guest.isAvailable == true){
    				$($('#meetingPatientGuest').children('p')[pg]).find("i").css("display","inline-block");
    			} else{
    				$($('#meetingPatientGuest').children('p')[pg]).find("i").css("display","none");
    			}
    		}

  			// Additional Clinicians icon toggle
  			for(var c=0;c<additinalClinicians.length;c++){
    			var clinician = additinalClinicians[c];
    			if(clinician.isAvailable == true){
    				$($('#meetingParticipant').children('p')[c]).find("i").css("display","inline-block");
    			} else{
    				$($('#meetingParticipant').children('p')[c]).find("i").css("display","none");
    			}
    		}
    	}
	},
	logVendorMeetingEvents: function(params){
		var userId;
		var userType;
		var logType = params[0];
		var eventName = (params[1])?params[1]:'';
		var eventDesc = (params[2])?params[2]:'';
		var isCareGiver = ($("#caregiverId").val().trim() != "" && $("#meetingCode").val().trim() != "");
		console.log("sendEventNotification :: params :: "+params);
		if(isCareGiver == true){
	       	userType = 'Caregiver';
	       	userId = $("#guestName").val().trim();
		}else{
			userId = $("#mrn").val().trim();
			userType = 'Patient';
		}
		console.log("sendEventNotification :: params :: "+params);
		var eventData = {
			'logType': logType,
			'meetingId':$("#meetingId").val(),
			'userType': userType,
			'userId': userId,
			'eventName':eventName,
			'eventDescription':eventDesc
		};

		$.ajax({
			type: "POST",
			url: VIDEO_VISITS.Path.visit.logVendorMeetingEvents,
			cache: false,
			dataType: "json",
			data: eventData,
			success: function(result, textStatus){
				console.log("sendEventNotification :: result :: "+result);
			},
			error: function(textStatus){
				console.log("sendEventNotification :: error :: "+textStatus);
			}
		});
	},
	setMinDimensions: function(){

		var btnContainerWidth = $("#btnContainer").width();
		var calculatedMinWidth = $('#clinician-name').outerWidth() + $('#leaveEndBtnContainer').outerWidth() +10;

		/* Setting min-widths */
		$('#container-videovisit').css("min-width", calculatedMinWidth);
		$("#video-main").css("min-width", calculatedMinWidth-200);
		$("#pluginContainer").css("min-width", calculatedMinWidth-200-btnContainerWidth);

		
		/* Setting min-heights */
		//DE9498 Kranti--commented
		//var btnGroupHeight = $("#buttonGroup").outerHeight();
		//DE9498 Kranti--new line
		var btnGroupHeight = 550;

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
		if($('#webrtc').val() == 'true'){
			$('#inCallContainer').css('min-width', '0');
			$('#inCallContainer').css('margin-top', '0');
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
