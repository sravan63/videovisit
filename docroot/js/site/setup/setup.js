$(document).ready(function() {

	var configContainerWidth = $("#setupCameraButtonToggleConfig").width();
	$(".setupAccessoryConfigContainer").innerWidth(configContainerWidth);
	if (Modernizr.iswindows == true){
		$("#mic-demo").css('color', 'black');
		$("#mic-demo").html("<span style='text-align:left; padding:10px; width:auto;'> To adjust mic volume: <ul style='margin:10px 0 0;'> <li>Go to Control Panel > <span style='font-weight:bold; display:inline;'>Hardware and Sound</span>.</li><li>Under Sound, go to <span style='font-weight:bold; display:inline;'>Manage audio</span> devices.</li><li>Click <span style='font-weight:bold; display:inline;'>Recording</span> tab</li><li>Click <span style='font-weight:bold; display:inline;'>Properties</span> button.</li><li>Click <span style='font-weight:bold; display:inline;'>Levels</span> tab</li> </ul> </span>");
	}
	else if (Modernizr.ismacos == true){
		$("#mic-demo").css('color', 'black');
		$("#mic-demo").html("<span style='text-align:left; padding:10px; width:auto;'> To adjust mic volume: <ul style='margin:10px 0 0;'> <li>Go to System Preferences > <span style='font-weight:bold; display:inline;'>Sound</span>.</li><li>Under Sound, go to the <span style='font-weight:bold; display:inline;'>Input</span> section.</li><li>Select the microphone to use and adjust the volume using your slider.</li> </ul> </span>");
	}
});

var VideoVisit = {
		logVendorMeetingEvents: function(params){}
};

var VideoVisitSetupWizard =
{
	terminateMeeting: function(meetingId, vendorConfId)
	{
		postPara = {meetingId: meetingId, vendorConfId: vendorConfId};
        console.log("Before calling ajax terminateSetupWizardMeeting - postParams: " + postPara.meetingId + ", " + postPara.vendorConfId + " - Ajax url: " + VIDEO_VISITS.Path.visit.terminateSetupWizardMeeting);
        $.ajax({
	        type: "POST",
	        url: VIDEO_VISITS.Path.visit.terminateSetupWizardMeeting,
	        cache: false,
		    async: false,
	        data: postPara, 
	        success: function(returndata) {
	        	console.log("Setupwizard Meeting terminated successfully - returndata: " + returndata);
			},
	        error: function() {
	        	console.log("Terminate setup wizard meeting failed");
			}
	    });
  	},

	createMeeting: function()
	{
		postPara = {};
	    console.log("Before calling ajax createMeeting - Ajax url: " + VIDEO_VISITS.Path.visit.createSetupWizardMeeting);
	    $.ajax({
	        type: "POST",
	        url: VIDEO_VISITS.Path.visit.createSetupWizardMeeting,
	        cache: false,
		    async: false,
	        data: postPara, 
	        success: function(data) {
	        	console.log("Setupwizard Meeting created successfully - returndata: " + data);
	        	try{
		        	data = jQuery.parseJSON(data);
		        	$("#guestUrl").val(data.vidyoUrl);
		        	$("#meetingId").val(data.meetingId);
		        	$("#vendorConfId").val(data.vendorConfId);
		        	$("#guestName").val(data.guestName);
		        	$("#isProvider").val(data.isProvider);
	        	}catch(e){
	        		console.warn("Error in the return data for Setup Wizard Create meeting: " + data);
	        	}
			},
	        error: function() {
	        	console.log("Create setup wizard meeting failed");
			}
	    });
	}
}

