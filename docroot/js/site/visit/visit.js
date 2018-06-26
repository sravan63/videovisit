$(document).ready(function() {
	
    // To access the GET variable
    function $_GET(q,s) {
        s = (s) ? s : window.location.search;
        var re = new RegExp('&'+q+'=([^&]*)','i');
        return (s=s.replace(/^\?/,'&').match(re)) ? s=s[1] : s='';
    }

    // Grab the GET variable
    //var iframedata = getCookie("iframedata");

    // INITIALIZE  Modals.
    //initializeJoinNowModal();
    //initializeQuitMeetingModal();
    
    //  <!-- Commented by Srini  08/27 -->	
    //showJoinNowModal(decodeURIComponent(iframedata));
    
    // Quit meeting button on the Quit Meeting modal 
/*    $('#quitMeetingId').click(function() { 
    	$("#quitMeetingModal").dialog( "open" );
    });
   
    $('#quitMeetingNo').click(function(){
    	$("#quitMeetingModal").dialog( "close" );
    });	*/

    /*$('#quitMeetingYes').click(function(){
        var quitMeetingIdData = 'meetingId=' + $(this).attr('quitmeetingid') + '&memberName=' + $(this).attr('memberName') ;
         $.ajax({
            type: 'POST',
            url: VIDEO_VISITS.Path.visit.quitmeeting,
            data: quitMeetingIdData,
            success: function(returndata) {
            	window.location.replace("landingready.htm");
            },
            //error receives the XMLHTTPRequest object, a string describing the type of error and an exception object if one exists
            error: function(theRequest, textStatus, errorThrown) {
                window.location.replace(VIDEO_VISITS.Path.global.error);            
            }
        });
        return false;
    });*/
        
});


// onbeforeunload is commented becasue of infinite loop issues in firefox and IE
// For Firefox- https://bugzilla.mozilla.org/show_bug.cgi?id=770626

//window.onbeforeunload = function (e) {
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

var MemberVisit = {
		QuitMeetingActionButtonYes: function(meetingId, memberName, refreshMeetings, isProxyMeeting)
		{
			var quitMeetingIdData = 'meetingId=' + meetingId + '&memberName=' + memberName + '&refreshMeetings=' + refreshMeetings + '&isProxyMeeting=' + isProxyMeeting;

	         $.ajax({
	            type: 'POST',
	            url: VIDEO_VISITS.Path.visit.quitmeeting,
	            cache: false,
			    async: false,
	            data: quitMeetingIdData,
	            success: function(returndata) {
	            	//window.location.replace("landingready.htm");
	            },
	            //error receives the XMLHTTPRequest object, a string describing the type of error and an exception object if one exists
	            error: function(theRequest, textStatus, errorThrown) {
	                //window.location.replace(VIDEO_VISITS.Path.global.error);            
	            }
	        });
		},
		SetKPHCConferenceStatus: function(meetingId, status, isProxyMeeting, careGiverName)
		{
			var postParaKPHC = 'meetingId=' + meetingId + '&status=' + status + '&isProxyMeeting=' + isProxyMeeting + '&careGiverName=' + careGiverName;

	         $.ajax({
	            type: 'POST',
	            url: VIDEO_VISITS.Path.visit.setKPHCConferenceStatus,
	            cache: false,
			    async: true,
	            data: postParaKPHC,
	            success: function(returndata) {
	            	console.log("SetKPHCConferenceStatus: success returndata=" + returndata);
	            },
	            //error receives the XMLHTTPRequest object, a string describing the type of error and an exception object if one exists
	            error: function(theRequest, textStatus, errorThrown) {
	            	console.log("SetKPHCConferenceStatus: error");           
	            }
	        });
		},
		CaregiverJoinMeeting: function(meetingId, status, meetingHash)
		{
			var postData = 'meetingId=' + meetingId + '&status=' + status + '&meetingHash=' + meetingHash;

	         $.ajax({
	            type: 'POST',
	            url: VIDEO_VISITS.Path.visit.caregiverJoinMeeting,
	            cache: false,
			    async: true,
	            data: postData,
	            success: function(returndata) {
	            	console.log("CaregiverJoinMeeting: success returndata=" + returndata);
	            },
	            //error receives the XMLHTTPRequest object, a string describing the type of error and an exception object if one exists
	            error: function(theRequest, textStatus, errorThrown) {
	            	console.log("CaregiverJoinMeeting: error");           
	            }
	        });
		}
		
}

function showJoinNowModal(encodedHrefLocation){

	// Grab the GET variable
    var iframedata = encodedHrefLocation;

//  <!-- Commented by Srini  08/27 -->	
    // Load it into the iframe's source attribute'
//    $("iframe").attr('src', decodeURIComponent(iframedata));
    
    $("iframe").attr('src', iframedata);
    
/*    var finalHeight = $(window).height();
    var finalWidth = $(window).width();
    
	$('#joinNowIframe').css({"height": finalHeight*0.90});
	$('#joinNowIframe').css({"width": finalWidth*0.90});*/
	
    //$("#join-now-modal").dialog( "open" );
    
    LandingReadyPage.keepALive();
	
}


function initializeJoinNowModal(){	
	$("#join-now-modal").dialog({
	      autoOpen: false,
	      width: "98%",
	      modal: true,
	      dialogClass:'hide-modal-title'
	});
}

function initializeQuitMeetingModal(){	
	$("#quitMeetingModal").dialog({
	      autoOpen: false,
	      width: "23%",
	      height: 160,
	      modal: true,
	      resizable:false,
	      dialogClass:'hide-modal-title'
	});
}

function initializeDialog(className, isModal, isResizable, dialogWidth, shouldAutoOpen, dialogTitle, shouldCloseOnEscape, dialogClassName, beforeCloseFunction)
{
	$('.' + className).dialog({
		modal: isModal,
		resizable: isResizable,
		width: dialogWidth,
		autoOpen: shouldAutoOpen,
		title: dialogTitle,
		closeOnEscape:shouldCloseOnEscape,
		dialogClass:dialogClassName,
		beforeClose: beforeCloseFunction
	});

}

/*
 * Opens the dialog specified by class name
 */
function openDialog(className){
	$("#layover").hide();
	$('.' + className).dialog( "open" );
	$(".ui-dialog-titlebar").css({"display":"none"});
}

/*
 * Closes the dialog specified by class name
 */
function closeDialog(className){
	var isOpen = $('.' + className).dialog( "isOpen" );
	if(isOpen){
		$('.' + className).dialog( "close" );
		$(".ui-dialog-titlebar").css({"display":"block"});	
	}
}

