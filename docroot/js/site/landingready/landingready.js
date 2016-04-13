$(document).ready(function() {
    var meetingTimestamp,convertedTimestamp,meetingIdData,hreflocation;
 
    initializeUserPresentInMeetingModal();
    
    //make ajax call to KP Keep alive url
    var keepAliveUrl = $("#kpKeepAliveUrl").val();
    if(keepAliveUrl != null && keepAliveUrl != "" && keepAliveUrl.length > 0 && keepAliveUrl != "undefined")
    {
    	try
    	{
    		$.ajax({
        	    url: keepAliveUrl,
        	    type: 'GET',
        	    dataType: 'jsonp',
        	    cache: false,
        	    async: true,
        	    crossDomain:true,
        	    success: function(keepAliveData){    	    	
        	    },
                error: function() {            	
                }
        	});
    	}
    	catch(e)
		{
			
		}    	
    }
    
	// Join now Click Event
    $(".joinNowButton").click(function(){
    	$("#layover").show();
    	var meetingId = $(this).attr('meetingid');
        meetingIdData = 'meetingId=' + meetingId;
        var isProxyMeeting = $(this).attr('isproxymeeting');
        //  <!-- Commented by Srini  08/27 -->
        // hreflocation = $(this).attr('mmMeetingUrl');
        var name = $(this).attr('userName');
        
        if(isProxyMeeting != null && ("Y" == isProxyMeeting || "y" == isProxyMeeting))
        {
        	var postParaForLaunchProxyMeeting = {"meetingId": meetingId, "inMeetingDisplayName":name, "isProxyMeeting":isProxyMeeting};
        	$.ajax({
        		url: VIDEO_VISITS.Path.landingready.launchMemberProxyMeeting,
        		type: 'POST',
	            data: postParaForLaunchProxyMeeting,
	            cache: false,
			    async: false,
	            success: function(returndata) {
	            	try
	            	{
	            		returndata = jQuery.parseJSON(returndata);
	            		
	            		if(returndata.errorIdentifier === 510){
	            			$("#error_label_" + meetingId).css("display", "inline").html('<label>The meeting you are trying to join has already ended.</label><br/>');
	                        moveToit("p.error"); 
	                        $("#layover").hide();
	                        return false; 
	                    }
	            		else if(returndata.errorIdentifier === 520){
	            			$("#error_label_" + meetingId).css("display", "inline").html('<label>The meeting you are trying to join has been cancelled.</label><br/>');
	                        moveToit("p.error"); 
	                        $("#layover").hide();
	                        return false; 
	                    }
	            		else if(returndata.errorIdentifier === 400){
	            			// show the dialog 
	    					$("#layover").hide();
	    					 $("#user-in-meeting-modal").dialog( "open" );	
	                    }
	            		else if(returndata.errorMessage){
	        				$("#layover").hide();
	        				$('#end_meeting_error').html('').append(returndata.errorMessage).show();		
	        			}
	        			else if (returndata.success)
	            		{
	            			hreflocation = returndata.result;
	            			var postParaVideoVisit = {vidyoUrl: hreflocation, attendeeName: name, meetingId: meetingId, isMember: "Y", guestName: name, isProvider: "false", isProxyMeeting: isProxyMeeting, guestUrl: encodeURIComponent(hreflocation)};
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
	            		
	            	}
	            	catch(e)
	    			{	    				
	    				$('#end_meeting_error').html('').append(e.message).show();
	    				 window.location.replace(VIDEO_VISITS.Path.visit.logout);
	    			}					
	            },
	            //error receives the XMLHTTPRequest object, a string describing the type of error and an exception object if one exists
	            error: function(theRequest, textStatus, errorThrown)
	            {
	            	$("#layover").hide();
	            	$("#join-meeting-fail-modal").dialog("open");
	            }
	        }).fail(function() {
            	$("#layover").hide();
            	$("#join-meeting-fail-modal").dialog("open");
             });;
        }
        else
        {
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
    				$("#layover").hide();
    				$('#end_meeting_error').html('').append(userPresentInMeetingData.errorMessage).show();		
    			}
    			else{
    				if(userPresentInMeetingData.result == "true"){					
    					// show the dialog 
    					$("#layover").hide();
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
    			            			$("#error_label_" + meetingId).css("display", "inline").html('<label>The meeting you are trying to join has already ended.</label><br/>');
    			                        moveToit("p.error"); 
    			                        $("#layover").hide();
    			                        return false; 
    			                     }
    			            		if ( returndata.success)
    			            		{
    			            			hreflocation = returndata.result;
    			            			//hreflocation = "http://localhost:8080/vidyoplayer/player.html?guestName="+name+"&guestUrl=" +encodeURIComponent(hreflocation);
    			            			//hreflocation = "/vidyoplayer/player.html?guestName=" +name+ "&isProvider=false&meetingId=" +meetingId+ "&guestUrl=" +encodeURIComponent(hreflocation);
    			            			
    			            			var postParaVideoVisit = {vidyoUrl: hreflocation, attendeeName: name, meetingId: meetingId, isMember: "Y", guestName: name, isProvider: "false", isProxyMeeting: isProxyMeeting, guestUrl: encodeURIComponent(hreflocation)};
    			            			
    			                  	  	//setCookie("iframedata",encodeURIComponent(hreflocation),365);
    			            			//window.location.replace("visit.htm");
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
    			            	}
    			            	catch(e)
    			    			{    			    				
    			    				$('#end_meeting_error').html('').append(e.message).show();
    			    				 window.location.replace(VIDEO_VISITS.Path.visit.logout);
    			    			}    							
    			            },
    			            //error receives the XMLHTTPRequest object, a string describing the type of error and an exception object if one exists
    			            error: function(theRequest, textStatus, errorThrown) {
    			            	$("#layover").hide();
    			            	$("#join-meeting-fail-modal").dialog("open");
    			            }
    			        });
    				}
    			}
    			
            }).fail(function() {
            	$("#layover").hide();
            	$("#join-meeting-fail-modal").dialog("open");
             });
        }
		return false;
    })

    //Get the meeting timestamp, convert it and display it. Grabs the text contents of the element with the timestamp class,
    //converts it to the correct timestamp and then appends it to the next h3 in the code
    $('.timestamp').each(function(){
        meetingTimestamp = $(this).text();
        var tz = $("#tz").val();

        convertedTimestamp = convertTimestampToDate(meetingTimestamp, 'time_only') + " " + tz;

        $(this).next('span').append(convertedTimestamp);
    });
    
    // Ok button on user in meeting modal
    $('#user-in-meeting-modal-ok').click(function(){    	
    	$("#user-in-meeting-modal").dialog( "close" );    	
    });
    
    $('#join-meeting-fail-modal-refresh').click(function(){
    	$("#join-meeting-fail-modal").dialog( "close" );
    	window.location.href = window.location.href;
    });
    
    $('#join-meeting-fail-modal-cancel').click(function(){
    	$("#join-meeting-fail-modal").dialog( "close" );
    	return false;
    });

    $(".accord-ctrl-container").on("click", function(e){
        e.preventDefault();

        if($(this).children($('.accord-ctrl')).hasClass("more")){
            $(this).children($('.accord-ctrl')).removeClass("more").addClass("less").html("less");
            $(this).parent($('.host-name-container')).next($('.accord-contents')).toggle();
        } else{
            $(this).children($('.accord-ctrl')).removeClass("less").addClass("more").html("more");
            $(this).parent($('.host-name-container')).next($('.accord-contents')).toggle();
        }
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
	
	$("#join-meeting-fail-modal").dialog({
	      autoOpen: false,
	      width: "30%",
	      height:185,
	      modal: true,
	      resizable:false,
	      dialogClass:'hide-modal-title'
	});

}

