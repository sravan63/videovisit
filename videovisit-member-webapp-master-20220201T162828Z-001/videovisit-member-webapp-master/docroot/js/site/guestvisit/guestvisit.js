$(document).ready(function() {
    // To access the GET variable
    function $_GET(q,s) {
        s = (s) ? s : window.location.search;
        var re = new RegExp('&'+q+'=([^&]*)','i');
        return (s=s.replace(/^\?/,'&').match(re)) ? s=s[1] : s='';
    }

    // Grab the GET variable
	//var iframedata = getCookie("iframedata");
	
	// INITIALIZE Join now modal.
	//initializeJoinNowModal();
	//initializeQuitMeetingModal();
    
    //showJoinNowModal(decodeURIComponent(iframedata));
    
    // Quit meeting button on the Quit Meeting modal 
    $('#quitMeetingGuestId').click(function() { 
    	$("#layover").hide();
    	$("#quitMeetingGuestModal").dialog( "open" );
    });
   
    $('#quitMeetingGuestNo').click(function(){
    	$("#quitMeetingGuestModal").dialog( "close" );
    });

    $('#quitMeetingGuestYes').click(function(){
        var quitMeetingIdData = 'meetingCode=' + $.trim($("#meetingCode").val()) +  '&caregiverId=' + $(this).attr('caregiverId')  + '&meetingId=' + $(this).attr('quitmeetingid');
        
        $.ajax({
            type: 'POST',
            url: VIDEO_VISITS.Path.guestvisit.quitmeeting,
            data: quitMeetingIdData,
            success: function(returndata) {
                //window.location.replace(VIDEO_VISITS.Path.guestvisit.logout);
            	window.location.replace(VIDEO_VISITS.Path.guestvisit.logout);
            },
            //error receives the XMLHTTPRequest object, a string describing the type of error and an exception object if one exists
            error: function(theRequest, textStatus, errorThrown) {
                window.location.replace(VIDEO_VISITS.Path.guestglobal.error);
            }
        });
        return false;
    });
    
    
});

var GuestReadyPage =
{
		keepALiveDelay: ( 5 * 60 * 1000),
		keepALiveTimerId:'',
	
		keepALive: function()
		{
			GuestReadyPage.keepALiveClearTimeOut();
			GuestReadyPage.keepALiveTimerId = setTimeout( GuestReadyPage.keepALiveAction, GuestReadyPage.keepALiveDelay );
		},
		keepALiveClearTimeOut: function()
		{
			if (GuestReadyPage.keepALiveTimerId)
				clearTimeout( GuestReadyPage.keepALiveTimerId );
		},
		keepALiveAction: function()
		{
			$.post(VIDEO_VISITS.Path.guestready.keepALive, {},function(data){	
				
			});
			GuestReadyPage.keepALive();
		}
}

var GuestVisit = {
		QuitMeetingActionButtonYes: function(meetingCode, caregiverId, meetingId, refreshMeetings)
		{	
			//var quitMeetingIdData = 'meetingCode=' + $.trim($("#meetingCode").val()) +  '&caregiverId=' + $(this).attr('caregiverId')  + '&meetingId=' + $(this).attr('quitmeetingid');
			var quitMeetingIdData = 'meetingCode=' + meetingCode + '&caregiverId=' + caregiverId + '&meetingId=' + meetingId + '&refreshMeetings=' + refreshMeetings;
	        $.ajax({
	            type: 'POST',
	            url: VIDEO_VISITS.Path.guestvisit.quitmeeting,
	            cache: false,
			    async: false,
	            data: quitMeetingIdData,
	            success: function(returndata) {
	            	//window.location.replace(VIDEO_VISITS.Path.guestvisit.logout);
	            },
	            //error receives the XMLHTTPRequest object, a string describing the type of error and an exception object if one exists
	            error: function(theRequest, textStatus, errorThrown) {
	               // window.location.replace(VIDEO_VISITS.Path.guestglobal.error);
	            }
	        });
		}
}

function showJoinNowModal(encodedHrefLocation){

	// Grab the GET variable
    var iframedata = encodedHrefLocation;
//  <!-- Commented by Srini  08/27 -->	
    // Load it into the iframe's source attribute'
   // $("iframe").attr('src', decodeURIComponent(iframedata));
    $("iframe").attr('src', iframedata);
    
/*    var finalHeight = $(window).height();
    var finalWidth = $(window).width();
    
	$('#joinNowIframeGuest').css({"height": finalHeight*0.90});
	$('#joinNowIframeGuest').css({"width": finalWidth*0.90});*/
	
    $("#guest-join-now-modal").dialog( "open" );
    $("#layover").hide();
    GuestReadyPage.keepALive();
    
    return false;
}




function initializeJoinNowModal(){	
	$("#guest-join-now-modal").dialog({
	      autoOpen: false,
	      width: "98%",
	      modal: true,
	      dialogClass:'hide-modal-title'
	});

}



function initializeQuitMeetingModal(){	
	$("#quitMeetingGuestModal").dialog({
		 autoOpen: false,
	      width: "23%",
	      height: 160,
	      modal: true,
	      resizable:false,
	      dialogClass:'hide-modal-title'
	});
    
    
    
}

