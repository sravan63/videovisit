


$(document).ready(function() {
    var meetingTimestamp,convertedTimestamp,meetingIdData,hreflocation;
 
    initializeUserPresentInMeetingModal();
    
	// Join now Click Event
    $(".joinNowButton").click(function(){
    	
    	var meetingId = $(this).attr('meetingid');
        meetingIdData = 'meetingId=' + meetingId;
        hreflocation = $(this).attr('mmMeetingUrl');
        
        
        var name = hreflocation.substring(hreflocation.indexOf("&user=") +"&user=".length);
		name = name.substring(0, name.indexOf("&"));
		
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
			            		if ( returndata.success)
			            		{
			            			hreflocation = returndata.result;
			            			// SHOW Join now modal.
			            			window.location.replace("visit.htm?iframedata=" + encodeURIComponent(hreflocation) + "&meetingId=" + meetingId + "&memberName=" + name);
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
	      height:150,
	      modal: true,
	      resizable:false,
	      dialogClass:'hide-modal-title'
	});

}


