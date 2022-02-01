$(document).ready(function () {
	var reqscript3 = document.createElement('script');
	reqscript3.src = "js/site/pexip/complex/EventSource.js";
	reqscript3.type = "text/javascript";
	document.getElementsByTagName("head")[0].appendChild(reqscript3);
	reqscript3.onload = function () {
		console.log("reqscript3 loaded");
	};
	var configContainerWidth = $("#setupCameraButtonToggleConfig").width();
	$(".setupAccessoryConfigContainer").innerWidth(configContainerWidth);
	if (Modernizr.iswindows == true){
		$("#mic-demo").css('color', 'black');
		$("#mic-demo").html("<span style='text-align:left; padding:10px; width:auto;'> To adjust mic volume: <ul style='margin:10px 0 0;'> <li>Go to Control Panel > <span style='font-weight:bold; display:inline;'>Hardware and Sound</span>.</li><li>Under Sound, go to <span style='font-weight:bold; display:inline;'>Manage audio</span> devices.</li><li>Click <span style='font-weight:bold; display:inline;'>Recording</span> tab</li><li>Click <span style='font-weight:bold; display:inline;'>Properties</span> button.</li><li>Click <span style='font-weight:bold; display:inline;'>Levels</span> tab</li> </ul> </span>");
	} else if (Modernizr.ismacos == true) {
		$("#mic-demo").css('color', 'black');
		$("#mic-demo").html("<span style='text-align:left; padding:10px; width:auto;'> To adjust mic volume: <ul style='margin:10px 0 0;'> <li>Go to System Preferences > <span style='font-weight:bold; display:inline;'>Sound</span>.</li><li>Under Sound, go to the <span style='font-weight:bold; display:inline;'>Input</span> section.</li><li>Select the microphone to use and adjust the volume using your slider.</li> </ul> </span>");
	}

});

function configurePexipVideoProperties(data){
	console.log('========>>>> PEXIP AUTO START');
	console.log("join-conf clicked");

    var reqscript1 = document.createElement('script');
      reqscript1.src = "js/site/pexip/setup/webui.js";
      reqscript1.type = "text/javascript";
      document.getElementsByTagName("head")[0].appendChild(reqscript1);

      //document.getElementById("container").appendChild(reqscript1);
      //document.body.appendChild(reqscript1);

    var reqscript2 = document.createElement('script');
    	//  reqscript2.src = "js/site/pexip/complex/pexrtc.js";

    reqscript1.onload = function(){
      	console.log("reqscript1 loaded");
      reqscript2.src = "js/site/pexip/setup/pexrtc.js";
      reqscript2.type = "text/javascript";
      document.getElementsByTagName("head")[0].appendChild(reqscript2);
    };

    reqscript2.onload = function(){
	    console.log("reqscript2 loaded");
		startPexip(data);
    };
}

function startPexip(data) {
	var guestPin = $("#meetingId").val().split('').reverse().join(''); // From Backend
	$('#guestPin').val(guestPin);
	var roomUrl = data.roomJoinUrl;// "vve-tpmg-dev.kp.org"; // $('#guestUrl').val();
	var alias =  data.meetingVendorId; // "m.ncal.test.1234"; 
	var bandwidth = "1280"; // $('#bandwidth').val();
	var source = "Join+Conference";
	var name = data.member.inMeetingDisplayName;
	initialise(roomUrl, alias, bandwidth, name, guestPin, source);
}


var VideoVisit = {
		logVendorMeetingEvents: function(params){}
};

var VideoVisitSetupWizard = {
	terminateMeeting: function (meetingId, vendorConfId) {
		postPara = {
			meetingId: meetingId,
			vendorConfId: vendorConfId
		};
		console.log("Before calling ajax terminateSetupWizardMeeting - postParams: " + postPara.meetingId + ", " + postPara.vendorConfId + " - Ajax url: " + VIDEO_VISITS.Path.visit.terminateSetupWizardMeeting);
		$.ajax({
			type: "POST",
			url: VIDEO_VISITS.Path.visit.terminateSetupWizardMeeting,
			cache: false,
			async: false,
			data: postPara,
			success: function (returndata) {
				console.log("Setupwizard Meeting terminated successfully - returndata: " + returndata);
			},
	        error: function() {
	        	console.log("Terminate setup wizard meeting failed");
			}
	    });
  	},

	createMeeting: function () {
		postPara = {};
		console.log("Before calling ajax createMeeting - Ajax url: " + VIDEO_VISITS.Path.visit.createSetupWizardMeeting);
		$.ajax({
			type: "POST",
			url: VIDEO_VISITS.Path.visit.createSetupWizardMeeting,
			cache: false,
			async: false,
			data: postPara,
			success: function (data) {
				console.log("Setupwizard Meeting created successfully - returndata: " + data);
				try {
					data = jQuery.parseJSON(data);
					if (data.code) {
						console.warn("Error in the return data for Setup Wizard Create meeting: " + data.message);
					} else {
						$("#guestUrl").val(data.roomUrl);
						$("#meetingId").val(data.meetingId);
						$("#vendorConfId").val(data.vendorConfId);
						$("#guestName").val(data.guestName);
						$("#isProvider").val(data.isProvider);
						configurePexipVideoProperties(data);
					}
				} catch (e) {
					console.warn("Error in the return data for Setup Wizard Create meeting: " + data);
				}
			},
	        error: function() {
	        	console.log("Create setup wizard meeting failed");
			}
	    });
	}
}

