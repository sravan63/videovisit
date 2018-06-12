$(document).ready(function() {
	
	
    var meetingTimestamp,convertedTimestamp,meetingIdData,hreflocation,meetingId,patientLastName, verifyData;

	// Join now Click Event
    $(".btn").click(function(e){
       // e.preventDefault();
    	$("#layover").show();
    	//US30802
    	setPeripheralsFlag("true");
    	//US30802
        var caregiverId = $(this).attr('caregiverId');
        var name = $(this).attr('userName');
                       
        meetingIdData = 'meetingCode=' + $.trim($("#meetingCode").val()); //$(this).attr('meetingCode');
        meetingId = $.trim($("#meetingId").val());
        patientLastName = $.trim($("#patientLastName").val());
        verifyData= 'meetingId=' + meetingId+ 
        '&meetingCode=' + $.trim($("#meetingCode").val())+
        '&guestName=' + name +
        '&patientLastName=' + patientLastName ;
        
       
        $.ajax({
        	
        	type: 'POST',
            data: verifyData,
            url: VIDEO_VISITS.Path.guestready.joinmeeting,
            success: function(returndata) {
            
              try
              {
            	  returndata = jQuery.parseJSON(returndata);
            	  //MEETING_FINISHED_EXCEPTION
            	  //if(returndata.result === '2'){
            	  //500-Meeting data not found, 520-Meeting Cancelled, 510-Meeting Ended
            	  if(returndata.status.code === '510' || returndata.status.code === '500' || returndata.status.code === '520'){
            		  window.location.replace("guest?meetingCode=" +  $.trim($("#meetingCode").val()));
                      return false;
                    }
            	  //CAREGIVER JOINED FROM DIFFERENT DEVICE
            	  //else if (returndata.result === '4') {
            	  else if (returndata.status.code === '400') { 
                  	$("p.error").css("display", "inline").html('<label>You have already joined this video visit from another device. You must first sign off from the other device before attempting to join this visit here.</label><br/>');
                      moveToit("p.error");  
                      $("#layover").hide();
                      return false;  
                    }
            	  	//hreflocation = returndata.result;
            	  if(returndata.launchMeetingEnvelope.launchMeeting != null){
            	  	hreflocation = returndata.launchMeetingEnvelope.launchMeeting.roomJoinUrl;
            	  }else{
            	  hreflocation = null;
            	  }
            	  	//  hreflocation = "http://localhost:8080/vidyoplayer/player.html?guestName="+name+"&guestUrl=" +encodeURIComponent(hreflocation);
            	  	//	hreflocation = "/vidyoplayer/player.html?guestName=" + name + "&isProvider=false&meetingId=" +meetingId + "&caregiverId=" +caregiverId+ "&meetingCode=" +$.trim($("#meetingCode").val())+ "&guestUrl=" +encodeURIComponent(hreflocation);
            	  
            	  	var meetingCode = $.trim($("#meetingCode").val());
            	  	var postParaVideoVisit = {vidyoUrl: hreflocation, meetingId: meetingId, meetingCode: $.trim($("#meetingCode").val()),
            	  	        guestName: name, patientLastName: patientLastName, isMember: "N",
            	  	        isProvider: "false", meetingId: meetingId, caregiverId: caregiverId, meetingCode: meetingCode, guestUrl: encodeURIComponent(hreflocation)};
            	  	
	      			$.ajax({
	      			    type: 'POST',
	      			    url: VIDEO_VISITS.Path.landingready.videoVisit,
	      			    cache: false,
	      			    async: false,
	      			    data: postParaVideoVisit,
		      			success: function(){
	      			    	if($.browser.mozilla){
	      			    		window.setTimeout(function(){
	      							window.location.href="videoVisitReady.htm";
	      							}, 3000);
	          				}else{
	          					window.location.href="videoVisitReady.htm";
	          				}
	      			    },
	      		        error: function() {
	      		        }
	      			})
	      			
              }
              catch(e)
              {
            	  //window.location.replace(VIDEO_VISITS.Path.guestglobal.expired);
              }
 
            },
            //error receives the XMLHTTPRequest object, a string describing the type of error and an exception object if one exists
            error: function(theRequest, textStatus, errorThrown) {
            	 window.location.replace(VIDEO_VISITS.Path.guestglobal.expired);
            }
        })
        return false;
     });

    //Get the meeting timestamp, convert it and display it. Grabs the text contents of the element with the timestamp class,
    //converts it to the correct timestamp and then appends it to the next h3 in the code
    $('.timestamp').each(function(){
        meetingTimestamp = $(this).text();
        var tz = $("#tz").val();
        convertedTimestamp = convertTimestampToDate(meetingTimestamp, 'time_only');

        $(this).html(convertedTimestamp);
    });

    /* Grabs the text contents of the element with class name 'camel-case' and converts it into 'camel case format' (Ex:Camel Case) */
    $('.camel-case').each(function(){
        var existingText = $(this).text().toLowerCase().trim();
        var splittedText = existingText.split(' ');
        var isClinician = (existingText.indexOf(',') > 0);
        var convertedCamelCaseText = '';

        for(var i=0;i<splittedText.length;i++){
            var s = (isClinician && i == splittedText.length-1)?splittedText[i].toUpperCase():splittedText[i];
            if(s !== ''){
                convertedCamelCaseText += s.charAt(0).toUpperCase() + s.slice(1)+' ';
            }
        }
        $(this).html(convertedCamelCaseText.trim());
    });
});



//US30802
function setPeripheralsFlag(flagVal){
    $.ajax({
        type: "POST",
        url: VIDEO_VISITS.Path.visit.setPeripheralsFlag,
        cache: false,
        dataType: "json",
        data: {"showPeripheralsPage":flagVal},
        success: function(result, textStatus){
            console.log(result);
        },
        error: function(textStatus){
            $("#layover").hide();
        }
    });
}
//US30802