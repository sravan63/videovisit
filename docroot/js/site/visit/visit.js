$(document).ready(function() {

    // To access the GET variable
    function $_GET(q,s) {
        s = (s) ? s : window.location.search;
        var re = new RegExp('&'+q+'=([^&]*)','i');
        return (s=s.replace(/^\?/,'&').match(re)) ? s=s[1] : s='';
    }

    // Grab the GET variable
    var iframedata = $_GET('iframedata');
    
    // Load it into the iframe's source attribute'
    $("iframe").attr('src', decodeURIComponent(iframedata));

    // Move the quit meeting modal outside of the rest of the containers on the page and append to body (fixes some IE modal bugs)
    $('body').append($('#quitMeetingModal'));

    // Reposition modal on this page only
    $('.jqmWindow').css('margin-left','-99px');
    
    // Setup the quit meeting modal and make it draggable
    $( '#quitMeetingModal' ).jqm().jqDrag('.jqDrag');

    $('#quitMeetingLink').click(function(){
        var quitMeetingIdData = 'meetingId=' + $(this).attr('quitmeetingid');
        $.ajax({
            type: 'POST',
            url: VIDEO_VISITS.Path.visit.quitmeeting,
            data: quitMeetingIdData,
            success: function(returndata) {
                window.location.replace(VIDEO_VISITS.Path.visit.logout);
            },
            //error receives the XMLHTTPRequest object, a string describing the type of error and an exception object if one exists
            error: function(theRequest, textStatus, errorThrown) {
                window.location.replace(VIDEO_VISITS.Path.global.error);
            }
        });
        return false;
    })
		LandingReadyPage.keepALive();
});

$(window).unload(function() {
	var quitMeetingIdData = 'meetingId=' + $(this).attr('quitmeetingid');
    $.ajax({
        type: 'POST',
        url: VIDEO_VISITS.Path.visit.quitmeeting,
        data: quitMeetingIdData,
        success: function(returndata) {
            window.location.replace(VIDEO_VISITS.Path.visit.logout);
        },
        //error receives the XMLHTTPRequest object, a string describing the type of error and an exception object if one exists
        error: function(theRequest, textStatus, errorThrown) {
            window.location.replace(VIDEO_VISITS.Path.global.error);
        }
	});
});
 
window.onbeforeunload = function (e) {
    var e = e || window.event;

    var quitMeetingIdData = 'meetingId=' + $(this).attr('quitmeetingid');
    $.ajax({
        type: 'POST',
        url: VIDEO_VISITS.Path.visit.quitmeeting,
        data: quitMeetingIdData,
        success: function(returndata) {
            window.location.replace(VIDEO_VISITS.Path.visit.logout);
        },
        //error receives the XMLHTTPRequest object, a string describing the type of error and an exception object if one exists
        error: function(theRequest, textStatus, errorThrown) {
            window.location.replace(VIDEO_VISITS.Path.global.error);
        }
    }); 
    // For IE and Firefox prior to version 4
    if (e) {
        e.returnValue = 'Are you sure you want to leave the video visit meeting';
    }

    // For Safari
    return 'Are you sure you want to leave the video visit meeting';

}

  
var LandingReadyPage =
{
		keepALiveDelay: ( 5 * 60 * 1000),
		keepALiveTimerId:'',
	
		keepALive: function()
		{
			LandingReadyPage.keepALiveClearTimeOut();
			LandingReadyPage.keepALiveTimerId = setTimeout( LandingReadyPage.keepALiveAction, LandingReadyPage.keepALiveDelay );
		},
		keepALiveClearTimeOut: function()
		{
			if (LandingReadyPage.keepALiveTimerId)
				clearTimeout( LandingReadyPage.keepALiveTimerId );
		},
		keepALiveAction: function()
		{
			$.post(VIDEO_VISITS.Path.landingready.keepALive, {},function(data){	
				
			});
			LandingReadyPage.keepALive();
		}
}

