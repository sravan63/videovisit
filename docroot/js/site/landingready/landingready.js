//US31767
var getMeetingsTimeoutVal;
//US31767
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
    $(document).delegate('.joinNowButton', 'click', function(){
    	$("#layover").show();
    	//US30802
    	setPeripheralsFlag("true");
    	//US30802
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
	            success: function(returndata) {
	            	try
	            	{
	            		returndata = jQuery.parseJSON(returndata);
	        			if (returndata.service.status.code === '200')
	            		{
	            			hreflocation = returndata.service.launchMeetingEnvelope.launchMeeting.roomJoinUrl;
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
	            		else if(returndata.service.status.code === '400'){
	    					$("#layover").hide();
	    					 $("#user-in-meeting-modal").dialog( "open" );	
	                    }else if(returndata.service.status.code === '510'){
	            			$("#error_label_" + meetingId).css("display", "inline").html('<label>The meeting you are trying to join has already ended.</label><br/>');
	                        moveToit("p.error"); 
	                        $("#layover").hide();
	                        return false; 
	                    }
	            		else if(returndata.service.status.code === '520'){
	            			$("#error_label_" + meetingId).css("display", "inline").html('<label>The meeting you are trying to join has been cancelled.</label><br/>');
	                        moveToit("p.error"); 
	                        $("#layover").hide();
	                        return false; 
	                    }
	            		else{
	            			$("#layover").hide();
			            	$("#join-meeting-fail-modal").dialog("open");		
	        			}
	            	}
	            	catch(e)
	    			{	    				
	            		$("#layover").hide();
		            	$("#join-meeting-fail-modal").dialog("open");
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
             });
        }
        else
        {
        	var postParaForUserPresentInMeeting = { "meetingId": meetingId, "megaMeetingDisplayName":name};
            $.post(VIDEO_VISITS.Path.landingready.launchMeetingForMemberDesktop, postParaForUserPresentInMeeting,function(launchMeetingForMemberDesktopData){
    			try{
    				launchMeetingForMemberDesktopData = jQuery.parseJSON(launchMeetingForMemberDesktopData);
        			if(launchMeetingForMemberDesktopData.service.status.code === '200'){

            			hreflocation = launchMeetingForMemberDesktopData.service.launchMeetingEnvelope.launchMeeting.roomJoinUrl;
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
            		
        			}else if(launchMeetingForMemberDesktopData.service.status.code === '400'){
        				$("#layover").hide();
    					$("#user-in-meeting-modal").dialog( "open" );					 
        			}else if(launchMeetingForMemberDesktopData.service.status.code === '510'){
            			$("#error_label_" + meetingId).css("display", "inline").html('<label>The meeting you are trying to join has already ended.</label><br/>');
                        moveToit("p.error"); 
                        $("#layover").hide();
                        return false; 
        			}else if(launchMeetingForMemberDesktopData.service.status.code === '520'){
            			$("#error_label_" + meetingId).css("display", "inline").html('<label>The meeting you are trying to join has been cancelled.</label><br/>');
                        moveToit("p.error"); 
                        $("#layover").hide();
                        return false; 
        			}
        			else {
        				$("#layover").hide();
        				$('#end_meeting_error').html('').append(launchMeetingForMemberDesktopData.service.status.message).show();		
        			}
    			}
    			catch(e)
    			{
    				$("#layover").hide();
	            	$("#join-meeting-fail-modal").dialog("open");
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

        //convertedTimestamp = convertTimestampToDate(meetingTimestamp, 'time_only') + " " + tz;
        convertedTimestamp = convertTimestampToDate(meetingTimestamp, 'time_only');

        $(this).next('span').append(convertedTimestamp);
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
    
    // Ok button on user in meeting modal
    $('#user-in-meeting-modal-ok').click(function(){    	
    	$("#user-in-meeting-modal").dialog( "close" );    	
    });
    
    $('#join-meeting-fail-modal-refresh').click(function(){
    	$("#join-meeting-fail-modal").dialog( "close" );
    	getMemberMeetings();
    });
    
    $('#join-meeting-fail-modal-cancel').click(function(){
    	$("#join-meeting-fail-modal").dialog( "close" );
    	return false;
    });

    $(".accord-ctrl-container").on("click", function(e){
        e.preventDefault();

        if($(this).children($('.accord-ctrl')).hasClass("more")){
        	$(this).find($(".accord-ctrl")).removeClass("more").addClass("less").html("less");
            $(this).parent($('.host-name-container')).next($('.accord-contents')).toggle();
            $(this).find($(".accord-ctrl-caret")).addClass("accord-ctrl-caret-less");
        } else{
        	$(this).find($(".accord-ctrl")).removeClass("less").addClass("more").html("more");
            $(this).parent($('.host-name-container')).next($('.accord-contents')).toggle();
            $(this).find($(".accord-ctrl-caret")).removeClass("accord-ctrl-caret-less");
        }
    });
    //US31767
    getMemberMeetings();
    //US31767
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


//US31767
function getMemberMeetings(){
    $("#layover-content-main").show();
    window.scrollTo(0, 0);
    clearTimeout(getMeetingsTimeoutVal);
    getMeetingsTimeoutVal = setTimeout(function(){getMemberMeetings();},180000);
	$.ajax({
        type: "GET",
        url: VIDEO_VISITS.Path.landingready.dataMemberMeetings,
        cache: false,
        dataType: "json",
        success: function(result){
            updateDomWithMeetingsData(result);
        },
        error: function(error){
        	console.log(error);
        	//updateDomWithMeetingsData({envelope:{meetings:[]}});
            $('.my-meetings-grid').css('display', 'none');
            $('.no-meetings-grid').css('display', 'block');
        },
        complete: function(){
            $("#layover-content-main").hide();
        }
    });
}

function updateDomWithMeetingsData(data){
    if(!data || data.length == 0){
        $('.my-meetings-grid').css('display', 'none');
        $('.no-meetings-grid').css('display', 'block');
    }else{
        $('.no-meetings-grid').css('display', 'none');
        $('.my-meetings-grid').css('display', 'block');
        $('.my-meetings-grid').empty();
        var htmlToBeAppend = '';
        for(var i=0;i<data.length;i++){
            var meeting = data[i];
            htmlToBeAppend += '<div class="landing-portal-single-container">';
            if(meeting.isRunningLate == true || meeting.isRunningLate == "true"){
                var updatedTime = convertTimestampToDate(meeting.runLateMeetingTime, 'time_only');
                htmlToBeAppend += '<div class="running-late-indicator">We\'re sorry, your doctor is running late. New start time is <span style="font-size:20px;font-weight: 500;" class="running-late-timestamp-'+meeting.meetingId+'">'+updatedTime+'</span>.</div>';
            }
            htmlToBeAppend += '<div class="meeting-details-container" style="font-size:14px;">'
            htmlToBeAppend += '<div class="left">';
            var updatedTime = convertTimestampToDate(meeting.meetingTime, 'time_only');
            htmlToBeAppend += '<div class="time-display"><span class="hidden timestamp">'+meeting.meetingTime+' </span><span>'+updatedTime+'</span></div>';
            htmlToBeAppend += '<span>'+meeting.member.lastName+', '+meeting.member.firstName+' '+meeting.member.middleName+'</span>';
            htmlToBeAppend += '<div class="accord-contents" style="display:block;margin-top:30px;">';
            if(meeting.participant != null && meeting.participant.length > 0 || meeting.caregiver != null && meeting.caregiver.length > 0){
                htmlToBeAppend += '<h2 class="label" style="float:none;margin-bottom:10px;">Additional Participants</h2>';
            }
            if(meeting.participant != null && meeting.participant.length > 0){
                htmlToBeAppend += '<div class="names-container-member" style="margin:0px;"><span class="names participants" style="margin-left:0;">';
                for(var j=0;j<meeting.participant.length;j++){
                    htmlToBeAppend += '<span>'+meeting.participant[j].firstName.toLowerCase()+' '+meeting.participant[j].lastName.toLowerCase();
                    if(meeting.participant[j].title){
                        htmlToBeAppend += ', '+meeting.participant[j].title;
                    }
                    htmlToBeAppend += '</span>';
                }
                htmlToBeAppend += '</span></div>';//.names-container-member class end
            }
            htmlToBeAppend += '<div class="names-container-member" style="margin:0px;">';
            if(meeting.caregiver != null && meeting.caregiver.length > 0){
                htmlToBeAppend += '<span class="names patient-guests" style="margin-left:0;">';
                for(var j=0;j<meeting.caregiver.length;j++){
                    htmlToBeAppend += '<span>'+meeting.caregiver[j].firstName.toLowerCase()+' '+meeting.caregiver[j].lastName.toLowerCase()+'</span>';
                }
                htmlToBeAppend += '</span>';
            }
            htmlToBeAppend += '</div>';//.names-container-member class end
            htmlToBeAppend += '</div>';//.accord-contents class end
            htmlToBeAppend += '</div>';//.left class end
            htmlToBeAppend += '<div class="center">';
            htmlToBeAppend += '<img class="circle-image" src='+meeting.host.imageUrl+' alt="" />';
            htmlToBeAppend += '<span class="name-and-details camel-case"><span style="text-transform:capitalize">'+meeting.host.firstName.toLowerCase()+' '+meeting.host.lastName.toLowerCase()+'</span>';
            if(meeting.host.title){
                htmlToBeAppend += ', '+meeting.host.title;
            }
            htmlToBeAppend += '</span>';
            htmlToBeAppend += '<span class="department-details camel-case">'+meeting.host.departmentName.toLowerCase()+'</span>';
            htmlToBeAppend += '</div>';//.center class end
            htmlToBeAppend += '<div class="right">';
            if($('#isNonMember').val() == true || $('#isNonMember').val() == 'true'){
                //${WebAppContext.isNonMember()}
                if(meeting.meetingVendorId == null || meeting.meetingVendorId.length <= 0){
                    htmlToBeAppend += '<div style=""><p style=""><button class="btn not-available" href="javascript:location.reload()" style="margin-bottom:0;">Join your visit</button></p><p class="" style="margin-top:20px;">Your visit will be available within 15 minutes of the start time.</p></div>';
                }else{
                    htmlToBeAppend += '<div style=""><p style=""><button id="joinNowId" class="btn joinNowButton" userName="'+$('#memberDOlastName').val()+', '+$('#memberDOfirstName').val()+', (dummy@dummy.com)" meetingid="'+meeting.meetingId+'" isproxymeeting="Y" href="#" style="margin-bottom:0;">Join your visit</button></p><p class="" style="margin-top:20px;">You may be joining before your clinician. Please be patient.</p></div>';
                }

            }else{
                //${not WebAppContext.isNonMember()}
                if(meeting.meetingVendorId == null || meeting.meetingVendorId.length <= 0){
                    htmlToBeAppend += '<div style=""><p style=""><button class="btn not-available" href="javascript:location.reload()" style="margin-bottom:0;">Join your visit</button></p><p class="" style="margin-top:20px;">Your visit will be available within 15 minutes of the start time.</p></div>';
                }else{
                    htmlToBeAppend += '<div style="">';
                    if($('#memberDOmrn').val() == meeting.member.mrn){
                        htmlToBeAppend += '<p class=""><button id="joinNowId" class="btn joinNowButton" userName="'+$('#memberDOlastName').val()+', '+$('#memberDOfirstName').val()+'" meetingid="'+meeting.meetingId+'" isproxymeeting="N" href="#" style="margin-bottom:0;">Join your visit</button></p><p class="" style="margin-top:20px;">You may be joining before your clinician. Please be patient.</p>';
                    }else{
                        htmlToBeAppend += '<p style=""><button id="joinNowId" class="btn joinNowButton" userName="'+$('#memberDOlastName').val()+', '+$('#memberDOfirstName').val()+', (dummy@dummy.com)" meetingid="'+meeting.meetingId+'" isproxymeeting="Y" href="#" style="margin-bottom:0;">Join your visit</button></p><p class="" style="margin-top:20px;">You may be joining before your clinician. Please be patient.</p>';
                    }
                    htmlToBeAppend += '</div>';
                }
            }
            htmlToBeAppend += '</div>';//.right class end
            htmlToBeAppend += '<p class="error error-guest-login" id="error_label_'+meeting.meetingId+'" style="margin-bottom:25px; font-size:16px;"></p>';
            htmlToBeAppend += '</div>';//.meeting-details-container class end
            htmlToBeAppend += '</div>';//.landing-portal-single-container class end
        }
        $('.my-meetings-grid').html(htmlToBeAppend);
        window.setTimeout(function () {
            for(var x=0;x<data.length;x++){
                if((data[x].participant != null && data[x].participant.length>0) || (data[x].caregiver != null && data[x].caregiver.length > 0)){
                    $('#'+data[x].meetingId).find($(".accord-ctrl-container")).css("display", "inline-block");
                } else{
                    $('#'+data[x].meetingId).find($(".accord-ctrl-container")).css("display", "none");
                }
            }
        },100);
    }
}
//US31767