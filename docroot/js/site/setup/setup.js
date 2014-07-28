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
  	}
}

$(window).on("beforeunload", function() { 
    console.log("Inside before unload"); 
     VideoVisitSetupWizard.terminateMeeting($("#meetingId").val(), $("#vendorConfId").val());

});