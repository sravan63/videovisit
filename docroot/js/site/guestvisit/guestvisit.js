$(document).ready(function() {

    // To access the GET variable
    function $_GET(q,s) {
        s = (s) ? s : window.location.search;
        var re = new RegExp('&'+q+'=([^&]*)','i');
        return (s=s.replace(/^\?/,'&').match(re)) ? s=s[1] : s='';
    }

	 // Grab the GET variable
	var iframedata = $_GET('iframedata');
	
	
	// INITIALIZE Join now modal.
	initializeJoinNowModal();

	showJoinNowModal(decodeURIComponent(iframedata));
    
    
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


function showJoinNowModal(encodedHrefLocation){

	// Grab the GET variable
    var iframedata = encodedHrefLocation;
    
    initializeQuitMeetingModal();
    
    // Load it into the iframe's source attribute'
    $("iframe").attr('src', decodeURIComponent(iframedata));
    
    $('#guest-join-now-modal').jqmShow();
    GuestReadyPage.keepALive();
    
    return false;
}


function initializeJoinNowModal(){
	$('#guest-join-now-modal').jqm({
	modal: true,
	});
}


function initializeQuitMeetingModal(){

    // Move the quit meeting modal outside of the rest of the containers on the page and append to body (fixes some IE modal bugs)
    $('body').append($('#quitMeetingModal'));

    // Reposition modal on this page only
    $('.jqmWindow').css('margin-left','-99px');
    
    // Setup the quit meeting modal and make it draggable
    $( '#quitMeetingModal' ).jqm().jqDrag('.jqDrag');

    $('#quitMeetingLink').click(function(){
        var quitMeetingIdData = 'meetingCode=' + gup("meetingCode"); //$(this).attr('meetingCode');
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
    })
		
}

