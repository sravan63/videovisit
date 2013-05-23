//window.onbeforeunload = function (e) {
//
//    var e = e || window.event;
//
//    var quitMeetingIdData = 'meetingId=0' ;
//    $.ajax({
//        type: 'POST',
//        url: VIDEO_VISITS.Path.visit.quitmeeting,
//        data: quitMeetingIdData,
//        success: function(returndata) {
//            window.location.replace(VIDEO_VISITS.Path.visit.logout);
//        },
//        //error receives the XMLHTTPRequest object, a string describing the type of error and an exception object if one exists
//        error: function(theRequest, textStatus, errorThrown) {
//            window.location.replace(VIDEO_VISITS.Path.global.error);
//        }
//    }); 
//    // For IE and Firefox prior to version 4
//    //if (e) {
//    //    e.returnValue = 'Are you sure you want to leave the video visit meeting';
//   // }
//
//    // For Safari
//  // return 'Are you sure you want to leave the video visit meeting';
//
//}


$(document).ready(function() {
    var meetingTimestamp,convertedTimestamp,meetingIdData,hreflocation;
    
    // Dialog initialization
    //$('body').append($('#dialog-block-user-in-meeting-modal'));
    // Setup the user-in-meeting dialog
//    $( '#dialog-block-user-in-meeting-modal' ).jqm();
    
    // INITIALIZE Join now modal.
    //initializeJoinNowModal();
    

	// Join now Click Event
    $(".btn").click(function(){
    	
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
				
				$('#end_meeting_error').html('').append(e.message).show();
				 window.location.replace(VIDEO_VISITS.Path.visit.logout);
			}
			
			if (userPresentInMeetingData.errorMessage) {
				
				$('#end_meeting_error').html('').append(userPresentInMeetingData.errorMessage).show();		
			}
			else{
				if(userPresentInMeetingData.result == "true"){
					
					// show the dialog 
					$( '#dialog-block-user-in-meeting-modal' ).jqm();
					$( '#dialog-block-user-in-meeting-modal' ).jqmShow() ;
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
			            			window.location.replace("visit.htm?iframedata=" + encodeURIComponent(hreflocation) + "&pMeetingId=10");
			            			//showJoinNowModal(encodeURIComponent(hreflocation));
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
    })
});


//function showJoinNowModal(encodedHrefLocation){
//
//	// Grab the GET variable
//    var iframedata = encodedHrefLocation;
//    
//    initializeQuitMeetingModal();
//    
//    // Load it into the iframe's source attribute'
//    $("iframe").attr('src', decodeURIComponent(iframedata));
//    
//    $('#join-now-modal').jqmShow();
//    LandingReadyPage.keepALive();
//    
//    return false;
//}
//
//
//function initializeJoinNowModal(){
//	$('#join-now-modal').jqm({
//	modal: true,
//	});
//}
//
//
//function initializeQuitMeetingModal(){
//
//	
//	// Move the quit meeting modal outside of the rest of the containers on the page and append to body (fixes some IE modal bugs)
//    $('body').append($('#quitMeetingModal'));
//
//    // Reposition modal on this page only
//    $('.jqmWindow').css('margin-left','-99px');
//    
//    // Setup the quit meeting modal and make it draggable
//    $( '#quitMeetingModal' ).jqm().jqDrag('.jqDrag');
//
//    $('#quitMeetingLink').click(function(){
//        var quitMeetingIdData = 'meetingId=' + $(this).attr('quitmeetingid');
//        $.ajax({
//            type: 'POST',
//            url: VIDEO_VISITS.Path.visit.quitmeeting,
//            data: quitMeetingIdData,
//            success: function(returndata) {
//                window.location.replace(VIDEO_VISITS.Path.visit.logout);
//            },
//            //error receives the XMLHTTPRequest object, a string describing the type of error and an exception object if one exists
//            error: function(theRequest, textStatus, errorThrown) {
//                window.location.replace(VIDEO_VISITS.Path.global.error);
//            }
//        });
//        return false;
//    })
//}



  
//var LandingReadyPage =
//{
//		keepALiveDelay: ( 5 * 60 * 1000),
//		keepALiveTimerId:'',
//	
//		keepALive: function()
//		{
//			LandingReadyPage.keepALiveClearTimeOut();
//			LandingReadyPage.keepALiveTimerId = setTimeout( LandingReadyPage.keepALiveAction, LandingReadyPage.keepALiveDelay );
//		},
//		keepALiveClearTimeOut: function()
//		{
//			if (LandingReadyPage.keepALiveTimerId)
//				clearTimeout( LandingReadyPage.keepALiveTimerId );
//		},
//		keepALiveAction: function()
//		{
//			$.post(VIDEO_VISITS.Path.landingready.keepALive, {},function(data){	
//				
//			});
//			LandingReadyPage.keepALive();
//		}
//}
