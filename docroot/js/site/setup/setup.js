$(document).ready(function() {

	var configContainerWidth = $("#setupCameraButtonToggleConfig").width();
	$(".setupAccessoryConfigContainer").innerWidth(configContainerWidth);

});

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

$(window).on("beforeunload", function() { 
    console.log("Inside before unload"); 
     VideoVisitSetupWizard.terminateMeeting($("#meetingId").val(), $("#vendorConfId").val());

});