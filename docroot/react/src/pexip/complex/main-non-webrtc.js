/**
 * 
 */

$(document).ready(function(){
	console.log("inside main-non-webrtc");
	
	$("#join-conf").on("click", function(){
	    console.log("join-conf clicked");

	      // var alias = "meet.NCAL_TEST5";
	      var alias = $("#guestUrl").val();
	      var bandwidth = "1280";
	      var source = "Join+Conference";
	      var name = $("#guestName").val();

	      var loadCheckInterval = setInterval(function (){
	          var flash = document.getElementById('flashvideo');
	          if (flash.startCall !== undefined) {
	        	  initialise("TTGSS-PEXIP-2.TTGTPMG.NET", alias, bandwidth, name, "", source, flash);
	              clearInterval(loadCheckInterval);
	          }
	      }, 500);
	});
});