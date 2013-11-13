


$(document).ready(function() {
    var meetingTimestamp,convertedTimestamp,meetingIdData,hreflocation;
 
    initializeUserPresentInMeetingModal();
    
	// Join now Click Event
    $(".joinNowButton").click(function(){
    	
    	var meetingId = $(this).attr('meetingid');
        meetingIdData = 'meetingId=' + meetingId;
        //  <!-- Commented by Srini  08/27 -->
        // hreflocation = $(this).attr('mmMeetingUrl');
        var name = $(this).attr('userName');
		
        var postParaForUserPresentInMeeting = { "meetingId": meetingId, "megaMeetingDisplayName":name};
        
        $.post(VIDEO_VISITS.Path.landingready.userPresentInMeeting, postParaForUserPresentInMeeting,function(userPresentInMeetingData){
			try{
				userPresentInMeetingData = jQuery.parseJSON(userPresentInMeetingData);
			}
			catch(e)
			{
				
				$('#end_meeting_error').html('').append(e.message).show();
				 window.location.replace(VIDEO_VISITS.Path.visit.logout);
			}
			
			if (userPresentInMeetingData.errorMessage) {
				
				$('#end_meeting_error').html('').append(userPresentInMeetingData.errorMessage).show();		
			}
			else{
				if(userPresentInMeetingData.result == "true"){
					// show the dialog 
					 $("#user-in-meeting-modal").dialog( "open" );
				}
				else{
					$.ajax({
			            type: 'POST',
			            data: meetingIdData,
			            url: VIDEO_VISITS.Path.landingready.joinmeeting,
			            success: function(returndata) {
			            	try
			            	{
			            		returndata = jQuery.parseJSON(returndata);
			            		if(returndata.result === '2'){
			            			$("p.error").css("display", "inline").html('<label>The meeting you are trying to join has already ended.</label><br/>');
			                        moveToit("p.error");            	
			                        return false; 
			                      }
			            		if ( returndata.success)
			            		{
			            			 //  <!-- Commented by Srini  08/27 -->
			            			hreflocation = returndata.result;
			            			//hreflocation = "http://localhost:8080/vidyoplayer/player.html?guestName="+name+"&guestUrl=" +encodeURIComponent(hreflocation);
			            			hreflocation = "/vidyoplayer/player.html?guestName="+name+"&guestUrl=" +encodeURIComponent(hreflocation);
			            			//  <!-- Commented by Srini  08/27 -->	
			            			// SHOW Join now modal.
			            			window.location.replace("visit.htm?iframedata=" + encodeURIComponent(hreflocation) + "&meetingId=" + meetingId + "&memberName=" + name);
			            			//window.location.replace("visit.htm?iframedata=" + hreflocation + "&meetingId=" + meetingId + "&memberName=" + name);
			            		}
			            		
			            	}
			            	catch(e)
			    			{
			    				
			    				$('#end_meeting_error').html('').append(e.message).show();
			    				 window.location.replace(VIDEO_VISITS.Path.visit.logout);
			    			}
							
			            },
			            //error receives the XMLHTTPRequest object, a string describing the type of error and an exception object if one exists
			            error: function(theRequest, textStatus, errorThrown) {
			            	
			            	window.location.replace(VIDEO_VISITS.Path.visit.logout);
			            }
			        });
				}
			}
			
		});
        
        
        
        
        return false;
    })

    //Get the meeting timestamp, convert it and display it. Grabs the text contents of the element with the timestamp class,
    //converts it to the correct timestamp and then appends it to the next h3 in the code
    $('.timestamp').each(function(){
        meetingTimestamp = $(this).text();
        var tz = $("#tz").val();

        convertedTimestamp = convertTimestampToDate(meetingTimestamp, 'time_only') + " " + tz;

        $(this).next('h3').append(convertedTimestamp);
    });
    
    // Ok button on user in meeting modal
    $('#user-in-meeting-modal-ok').click(function(){
    	$("#user-in-meeting-modal").dialog( "close" );
    });
    
});

function initializeUserPresentInMeetingModal(){
	$("#user-in-meeting-modal").dialog({
	      autoOpen: false,
	      width: "30%",
	      height:165,
	      modal: true,
	      resizable:false,
	      dialogClass:'hide-modal-title'
	});

}

