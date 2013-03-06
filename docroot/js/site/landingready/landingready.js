$(document).ready(function() {
    var meetingTimestamp,convertedTimestamp,meetingIdData,hreflocation;
    
    // Dialog initialization
    $('body').append($('#dialog-block-user-in-meeting-modal'));
    // Setup the user-in-meeting dialog
    $( '#dialog-block-user-in-meeting-modal' ).jqm();
    
    // Initialize preloader
    $('body').append($('#modal-preloader'));
    // Setup the user-in-meeting dialog
    $( '#modal-preloader' ).jqm({modal:true});
    

	// Join now Click Event
    $(".btn").click(function(){
    	$( '#modal-preloader').jqmShow() ;
    	var meetingId = $(this).attr('meetingid');
        meetingIdData = 'meetingId=' + meetingId;
        hreflocation = $(this).attr('href');
        
        
        var name = hreflocation.substring(hreflocation.indexOf("&user=") +"&user=".length);
		name = name.substring(0, name.indexOf("&"));
		
        var postParaForUserPresentInMeeting = { "meetingId": meetingId, "megaMeetingDisplayName":name};
        
        $.post(VIDEO_VISITS.Path.landingready.userPresentInMeeting, postParaForUserPresentInMeeting,function(userPresentInMeetingData){
			try{
				userPresentInMeetingData = jQuery.parseJSON(userPresentInMeetingData);
			}
			catch(e)
			{
				$( '#modal-preloader').jqmHide() ;
				$('#end_meeting_error').html('').append(e.message).show();
			}
			
			if (userPresentInMeetingData.errorMessage) {
				$( '#modal-preloader').jqmHide() ;
				$('#end_meeting_error').html('').append(userPresentInMeetingData.errorMessage).show();		
			}
			else{
				if(userPresentInMeetingData.result == "true"){
					
					// show the dialog 
					$( '#modal-preloader').jqmHide() ;
					$( '#dialog-block-user-in-meeting-modal' ).jqmShow() ;
				}
				else{
					$.ajax({
			            type: 'POST',
			            data: meetingIdData,
			            url: VIDEO_VISITS.Path.landingready.joinmeeting,
			            success: function(returndata) {
							returndata = jQuery.parseJSON(returndata);
							hreflocation = returndata.result;
			                window.location.replace("visit.htm?iframedata=" + encodeURIComponent(hreflocation));
			            },
			            //error receives the XMLHTTPRequest object, a string describing the type of error and an exception object if one exists
			            error: function(theRequest, textStatus, errorThrown) {
			                window.location.replace(VIDEO_VISITS.Path.global.error);
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
        convertedTimestamp = convertTimestampToDate(meetingTimestamp, 'time_only');

        $(this).next('h3').append(convertedTimestamp);
    })
});


