//US31767
var getMeetingsTimeoutVal;
var runUDPTest = true;
var browserInfo;
var blockChrome;
var blockFF;
var blockSafari;
var blockEdge;
var allowPexipIE;
var vendorValue = false;
//US31767
$(document).ready(function() {
    var meetingTimestamp,convertedTimestamp,meetingIdData,hreflocation;
    browserInfo = getBrowserInfo();
    blockChrome = ($("#blockChrome").val() == 'true');
    blockFF = ($("#blockFF").val() == 'true');
    blockSafari = ($("#blockSafari").val() == 'true');//US35718 changes
    blockEdge = ($("#blockEdge").val() == 'true');//US35718 changes
    allowPexipIE = ($("#blockPexipIE").val() == 'false');
    initializeUserPresentInMeetingModal();
    //make ajax call to KP Keep alive url
    var keepAliveUrl = $("#kpKeepAliveUrl").val();
    if (keepAliveUrl != null && keepAliveUrl != "" && keepAliveUrl.length > 0 && keepAliveUrl != "undefined") {
        try {
            $.ajax({
                url: keepAliveUrl,
                type: 'GET',
                dataType: 'jsonp',
                cache: false,
                async: true,
                crossDomain: true,
                success: function (keepAliveData) {},
                error: function () {}
            });
        } catch (e) {

        }
    }
    
    // Join now Click Event
    $(document).delegate('.joinNowButton', 'click', function(){
        $("#layover").show();
        //US30802
			if(browserInfo.isChrome == true){
				setPeripheralsFlag("false");
			}else{
				setPeripheralsFlag("true");
			}
               
        //US30802
        var meetingId = $(this).attr('meetingid');
        meetingIdData = 'meetingId=' + meetingId;
        var isProxyMeeting = $(this).attr('isproxymeeting');
        //  <!-- Commented by Srini  08/27 -->
        // hreflocation = $(this).attr('mmMeetingUrl');
        var name = $(this).attr('userName');

        if (isProxyMeeting != null && ("Y" == isProxyMeeting || "y" == isProxyMeeting)) {
            var postParaForLaunchProxyMeeting = {
                "meetingId": meetingId,
                "inMeetingDisplayName": name,
                "isProxyMeeting": isProxyMeeting
            };
            $.ajax({
                url: VIDEO_VISITS.Path.landingready.launchMemberProxyMeeting,
                type: 'POST',
                data: postParaForLaunchProxyMeeting,
                cache: false,
                success: function (returndata) {
                    try {
                        returndata = jQuery.parseJSON(returndata);
                        if (returndata.service.status.code === '200') {
                            hreflocation = returndata.service.launchMeetingEnvelope.launchMeeting.roomJoinUrl;
                            var postParaVideoVisit = {
                                roomUrl: hreflocation,
                                attendeeName: name,
                                meetingId: meetingId,
                                isMember: "Y",
                                guestName: name,
                                isProvider: "false",
                                isProxyMeeting: isProxyMeeting,
                                guestUrl: encodeURIComponent(hreflocation)
                            };
                            $.ajax({
                                type: 'POST',
                                url: VIDEO_VISITS.Path.landingready.videoVisit,
                                cache: false,
                                async: false,
                                data: postParaVideoVisit,
                                success: function(){
                                    //add logic to differentiate vidyo/pexip
                                    if($.browser.mozilla){
                                        window.setTimeout(function(){
                                            window.location.href="videoVisitReady.htm";
                                            }, 3000);
                                    }else{
                                        window.location.href="videoVisitReady.htm";
                                    }
                                },
                                error: function(err) {
                                    window.location.href="logout.htm";//DE15797 changes, along with backend back button filter changes
                                }
                            })
                        } else if (returndata.service.status.code === '400') {
                            $("#layover").hide();
                             $("#user-in-meeting-modal").dialog( "open" );  
                        }else if(returndata.service.status.code === '510'){
                            $("#error_label_" + meetingId).css("display", "inline").html('<label>The meeting you are trying to join has already ended.</label><br/>');
                            moveToit("p.error"); 
                            $("#layover").hide();
                            return false;
                        } else if (returndata.service.status.code === '520') {
                            $("#error_label_" + meetingId).css("display", "inline").html('<label>The meeting you are trying to join has been cancelled.</label><br/>');
                            moveToit("p.error"); 
                            $("#layover").hide();
                            return false;
                        } else {
                            $("#layover").hide();
                            $("#join-meeting-fail-modal").dialog("open");
                        }
                    } catch (e) {
                        $("#layover").hide();
                        $("#join-meeting-fail-modal").dialog("open");
                    }
                },
                //error receives the XMLHTTPRequest object, a string describing the type of error and an exception object if one exists
                error: function (theRequest, textStatus, errorThrown) {
                    $("#layover").hide();
                    $("#join-meeting-fail-modal").dialog("open");
                }
            }).fail(function() {
                $("#layover").hide();
                $("#join-meeting-fail-modal").dialog("open");
            });
        } else {
            var postParaForUserPresentInMeeting = {
                "meetingId": meetingId,
                "megaMeetingDisplayName": name
            };
            $.post(VIDEO_VISITS.Path.landingready.launchMeetingForMemberDesktop, postParaForUserPresentInMeeting, function (launchMeetingForMemberDesktopData) {
                try {
                    launchMeetingForMemberDesktopData = jQuery.parseJSON(launchMeetingForMemberDesktopData);
                    if(launchMeetingForMemberDesktopData.service.status.code === '200'){

                        hreflocation = launchMeetingForMemberDesktopData.service.launchMeetingEnvelope.launchMeeting.roomJoinUrl;
                        var postParaVideoVisit = {
                            roomUrl: hreflocation,
                            attendeeName: name,
                            meetingId: meetingId,
                            isMember: "Y",
                            guestName: name,
                            isProvider: "false",
                            isProxyMeeting: isProxyMeeting,
                            guestUrl: encodeURIComponent(hreflocation)
                        };
                        $.ajax({
                            type: 'POST',
                            url: VIDEO_VISITS.Path.landingready.videoVisit,
                            cache: false,
                            async: false,
                            data: postParaVideoVisit,
                            success: function(){
                                //add logic to differentiate vidyo/pexip
                                if($.browser.mozilla){
                                    window.setTimeout(function(){
                                        window.location.href="videoVisitReady.htm";
                                        }, 3000);
                                }else{
                                    window.location.href="videoVisitReady.htm";
                                }
                            },
                            error: function(err) {
                                window.location.href="logout.htm";//DE15797 changes, along with backend back button filter changes
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
                    } else {
                        $("#layover").hide();
                        $('#end_meeting_error').html('').append(launchMeetingForMemberDesktopData.service.status.message).show();
                    }
                } catch (e) {
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

var refreshGrid = function(){
    runUDPTest = true;
    getMemberMeetings();
}

function startUDPTest(){
    checkSTUNServer({
      urls: 'stun:stun.l.google.com:19302'
      }, 5000).then(function(bool){
            if(bool){
             console.log('Yep, the STUN server works...');
             $('#blockerMessage').css('display', 'none');
            } else{
             //alert('Doesn\'t work');
             var params = ['error','UDP_STUN_FAIL','UDP test failed'];
             logVendorMeetingEvents(params);
             
             $('.joinNowButton').each(function(){
                var vendor = $(this).attr('vendor');
                if(vendor!="pexip"){
                $("#blockerMessage").css("display","block");    
                $(this).removeClass('joinNowButton').addClass('not-available');
                }
            });
          }
          runUDPTest = false;
      }).catch(function(e){
         console.log(e);
         console.log('STUN server does not work.');
         var params = ['error','UDP_STUN_FAIL','UDP test failed'];
         logVendorMeetingEvents(params);
         $("#blockerMessage").css("display","block");
         $('.joinNowButton').each(function(){
            $(this).removeClass('joinNowButton').addClass('not-available');
        });
      });
}

function checkSTUNServer(stunConfig, timeout){
  console.log('stunConfig: ', stunConfig);
  return new Promise(function(resolve, reject){

    setTimeout(function(){
        if(promiseResolved) return;
        resolve(false);
        promiseResolved = true;
    }, timeout || 5000);

        var promiseResolved = false,
            myPeerConnection = window.webkitRTCPeerConnection || window.mozRTCPeerConnection || window.RTCPeerConnection //compatibility for firefox and chrome
            ,
            pc = new myPeerConnection({
                iceServers: [stunConfig]
            }),
            noop = function () {};
        pc.createDataChannel(""); //create a bogus data channel
        pc.createOffer(function (sdp) {
            if (sdp.sdp.indexOf('candidate:') > -1) { // sometimes sdp contains the ice candidates...
                promiseResolved = true;
                resolve(true);
            }
            pc.setLocalDescription(sdp, noop, noop);
        }, noop); // create offer and set local description
        pc.onicecandidate = function (ice) { //listen for candidate events
            if (promiseResolved || !ice || !ice.candidate || !ice.candidate.candidate || !(ice.candidate.candidate.toLowerCase().indexOf('candidate:') > -1 && ice.candidate.candidate.toLowerCase().indexOf('udp') > -1)) return;
            promiseResolved = true;
            resolve(true);
        };
    });
}

/*
    Blocks the JOIN button based on browser compatibility
*/
function checkAndBlockMeetings(){
    var showBlockMessage = false;
    $('.joinNowButton').each(function(){
        var vendor = $(this).attr('vendor');
        var allow = allowToJoin(vendor);
        if(allow == false && vendor!="pexip"){
            showBlockMessage = true;
            $(this).removeClass('joinNowButton').addClass('not-available');
        }
        if(allow == false && vendor=="pexip"){
            showBlockMessage = true;
            $(this).removeClass('joinNowButton').addClass('not-available');
        }
    });
    if(showBlockMessage && vendorValue){
        $("#blockerMessage").css("display","block");
        $('#browser-block-message').html('Join on your mobile device using the My Doctor Online app, or update your browser version.');
    }
    if(showBlockMessage && !vendorValue){
        $("#blockerMessage").css("display","block");
    }

}

function allowToJoin(vendor){
    var allow = true;
    var browserUserAgent = navigator.userAgent;
    var jqBrowserInfoObj = $.browser; 
    if(vendor === 'pexip'){
        if (browserInfo.isIE){
            var agent = navigator.userAgent;
            if(navigator.userAgent.indexOf('Edge/') === -1){
                allow = allowPexipIE; // Depends on backend flag.
                if(allow == false){
                    $('#browser-block-message').html('Join on your mobile device using the My Doctor Online app, or use a different browser.');
                }
            }
            
        }
            if(navigator.userAgent.indexOf('Edge/') > -1 && blockEdge){
                allow= false;
                $('#browser-block-message').html('Join on your mobile device using the My Doctor Online app, or use a different browser.');
            }

        if (navigator.appCodeName == 'Mozilla') {
            if (browserUserAgent.indexOf('Edge/') !== -1) {
                var isEdge = true;
            } else if (browserUserAgent.indexOf('Chrome/') !== -1) {
                var isChrome = true;
            } else if (browserUserAgent.indexOf('Safari/') !== -1) {
                var isSafari = true;
            } else if (browserUserAgent.indexOf('Firefox/') !== -1) {
                var isFirefox = true;
            }
        }
        if (isEdge && !blockEdge) {
            var blockEdgeVersion = $("#blockEdgeVersion").val() ? Number($("#blockEdgeVersion").val()) : 18;
            var agentVal = navigator.userAgent;
            var val = agentVal.split('Edge/');
            var edge_ver = val[1].slice(0,2);
            //var edge_ver = Number(window.navigator.userAgent.match(/Edge\/\d+\.(\d+)/)[1], 10);
            if(edge_ver < blockEdgeVersion){
                allow = false;
                vendorValue = true;
            }
        } else if (isChrome) {
            var blockChromeVersion = $("#blockChromeVersion").val() ? Number($("#blockChromeVersion").val()) : 61;
            var chrome_ver = Number(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
            if(chrome_ver < blockChromeVersion){
                allow= false;
                vendorValue = true;
            }
        } else if (isFirefox) {
            var blockFirefoxVersion = $("#blockFirefoxVersion").val() ? Number($("#blockFirefoxVersion").val()) : 60;
            var firefox_ver = Number(window.navigator.userAgent.match(/Firefox\/(\d+)\./)[1], 10);
            if(firefox_ver < blockFirefoxVersion){
                allow = false;
                vendorValue = true;
            }
        } else if (isSafari) {
            var agent = navigator.userAgent;
            var majorMinorDot = agent.substring(agent.indexOf('Version/')+8, agent.lastIndexOf('Safari')).trim();
            var majorVersion = majorMinorDot.split('.')[0];
            var versionNumber = parseFloat(majorMinorDot);
            // Block access from Safari version 12.
            var blockSafariVersion = $("#blockPexipSafariVersion").val()?Number($("#blockPexipSafariVersion").val()):11.1;
            if(versionNumber < blockSafariVersion){
                allow = false;
                vendorValue = true;
            }
        }
        
    } else {
        if(browserInfo.isChrome && blockChrome){
            allow = false;
        }else if(browserInfo.isFirefox && blockFF){
            allow = false;
        }else if(browserInfo.isSafari){
            var agent = navigator.userAgent;
            var majorMinorDot = agent.substring(agent.indexOf('Version/')+8, agent.lastIndexOf('Safari')).trim();
            var majorVersion = majorMinorDot.split('.')[0];
            var versionNumber = parseInt(majorVersion);
            // Block access from Safari version 12.
            var blockSafariVersion = $("#blockSafariVersion").val()?parseInt($("#blockSafariVersion").val()):12;//US35718 changes
            if(versionNumber >= blockSafariVersion && blockSafari){
                allow = false;
            }
        } else if (browserInfo.isIE){
            var agent = navigator.userAgent;
            // Block access for EDGE
            if(agent.indexOf('Edge/') > -1 && blockEdge){
                allow = false;
            }
        }
    }
    return allow;
}

var logVendorMeetingEvents = function(params){
        var userId;
        var userType;
        var logType = params[0];
        var eventName = (params[1])?params[1]:'';
        var eventDesc = (params[2])?params[2]:'';
        var isCareGiver = ($("#caregiverId").val().trim() != "" && $("#meetingCode").val().trim() != "");
        console.log("sendEventNotification :: params :: "+params);
        if(isCareGiver == true){
            userType = 'Caregiver';
            userId = $("#guestName").val().trim();
        }else{
            userId = $("#memberDOmrn").val().trim();
            userType = $('#isProxyMeeting').val() == 'Y'?(userId?'Patient_Proxy':'Non_Patient_Proxy'):'Patient';
        }
        console.log("sendEventNotification :: params :: "+params);
        var eventData = {
            'logType': logType,
            'meetingId':userId,
            'userType': userType,
            'userId': userId,
            'eventName':eventName,
            'eventDescription':eventDesc
        };

        $.ajax({
            type: "POST",
            url: VIDEO_VISITS.Path.visit.logVendorMeetingEvents,
            cache: false,
            dataType: "json",
            data: eventData,
            success: function(result, textStatus){
                console.log("sendEventNotification :: result :: "+result);
            },
            error: function(textStatus){
                console.log("sendEventNotification :: error :: "+textStatus);
            }
        });
    };

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
        data: {
            "showPeripheralsPage": flagVal
        },
        success: function (result, textStatus) {
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
    $('.no-meetings-grid').css('display', 'none');
    $('.my-meetings-grid').css('display', 'block');
    $('.my-meetings-grid').empty();
    $('.my-meetings-grid').html('<div style="text-align:center;"><div class="spinner-container"><img width="50px" height="50px" style="float:none;height:50px;width:50px;" src="images/global/iconLoading_small.gif"/></div></div>');
    window.scrollTo(0, 0);
    clearTimeout(getMeetingsTimeoutVal);
    getMeetingsTimeoutVal = setTimeout(function(){
        runUDPTest = true;
        getMemberMeetings();
    },180000);
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
            $('.my-meetings-grid').empty();
            $('.my-meetings-grid').css('display', 'none');
            $('.no-meetings-grid').css('display', 'block');
        },
        complete: function(){
            
        }
    });
}

function updateDomWithMeetingsData(data){
    if(!data || data.length == 0){
        $('.my-meetings-grid').empty();
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
            var meetingLastName = meeting.member.lastName?meeting.member.lastName:'';
            var meetingFirstName = meeting.member.firstName?meeting.member.firstName:'';
            var meetingMiddleName = meeting.member.middleName?meeting.member.middleName:'';
            htmlToBeAppend += '<span>'+meetingLastName+', '+meetingFirstName+' '+meetingMiddleName+'</span>';
            htmlToBeAppend += '<div class="accord-contents" style="display:block;margin-top:30px;">';
            if(meeting.participant && meeting.participant.length > 0 || meeting.caregiver && meeting.caregiver.length > 0 || meeting.sipParticipants && meeting.sipParticipants.length > 0){
                htmlToBeAppend += '<h2 class="label" style="float:none;margin-bottom:10px;">Additional Participants</h2>';
            }
            if(meeting.participant && meeting.participant.length > 0){
                htmlToBeAppend += '<div class="names-container-member" style="margin:0px;"><span class="names participants" style="margin-left:0;">';
                for(var j=0;j<meeting.participant.length;j++){
                    var fname= meeting.participant[j].firstName?meeting.participant[j].firstName.toLowerCase():'';
                    var lname = meeting.participant[j].lastName?meeting.participant[j].lastName.toLowerCase():'';
                    htmlToBeAppend += '<span>'+fname+' '+lname;
                    if(meeting.participant[j].title){
                        htmlToBeAppend += ', '+meeting.participant[j].title;
                    }
                    htmlToBeAppend += '</span>';
                }
                htmlToBeAppend += '</span></div>';//.names-container-member class end
            }
            htmlToBeAppend += '<div class="names-container-member" style="margin:0px;">';
            var isGuestAvail = (meeting.caregiver && meeting.caregiver.length > 0);
            var isSipParticipantAvail = (meeting.sipParticipants && meeting.sipParticipants.length > 0);
            if(isGuestAvail || isSipParticipantAvail){
                var newArray = [];
                if (meeting.vendor == "pexip") {
                    var videoGuests = meeting.caregiver;
                    var sipParticipants = meeting.sipParticipants;
                    if (videoGuests != null && sipParticipants != null) {
                        newArray = videoGuests.concat(sipParticipants);
                    } else if (sipParticipants != null) {
                        newArray = meeting.sipParticipants;
                    } else if (videoGuests != null) {
                        newArray = meeting.caregiver;
                    }
                } else {
                    newArray = meeting.caregiver;
                }
                let phoneNumsCount = 0;
                htmlToBeAppend += '<span class="names patient-guests" style="margin-left:0;">';
                for(var j=0;j<newArray.length;j++){
                    var cgfname = newArray[j].firstName?newArray[j].firstName.toLowerCase():'';
                    var cglname = newArray[j].lastName?newArray[j].lastName.toLowerCase():'';
                    var displayname = '';
                    var isTelephony = isNumberString(cgfname);

                    var isSip = newArray[j].destination?true:false;

                    if(isSip){
                        displayname = newArray[j].displayName;
                    }
                    //isTelephony = false;//US35148: Telephony: Deactivate for Release 8.6
                    else if(isTelephony){
                        var tele = cgfname.trim().split('').reverse().join('').substr(0,10).split('').reverse().join('');
                        var telePhoneNumber = changeFromNumberToTelephoneFormat(tele);
                        //displayname = telePhoneNumber;
                        phoneNumsCount = (phoneNumsCount + 1);
                        displayname = "Phone "+phoneNumsCount;
                    }else{
                        displayname = cgfname+' '+cglname;
                    }
                    htmlToBeAppend += '<span>'+displayname+'</span>';
                }
                htmlToBeAppend += '</span>';
            }
            htmlToBeAppend += '</div>';//.names-container-member class end
            htmlToBeAppend += '</div>';//.accord-contents class end
            htmlToBeAppend += '</div>';//.left class end
            htmlToBeAppend += '<div class="center">';
            htmlToBeAppend += '<img class="circle-image" src='+meeting.host.imageUrl+' alt="" />';
            var hostfname = meeting.host.firstName?meeting.host.firstName.toLowerCase():'';
            var hostlname = meeting.host.lastName?meeting.host.lastName.toLowerCase():'';
            htmlToBeAppend += '<span class="name-and-details camel-case"><span style="text-transform:capitalize">'+hostfname+' '+hostlname+'</span>';
            if(meeting.host.title){
                htmlToBeAppend += ', '+meeting.host.title;
            }
            htmlToBeAppend += '</span>';
            var hostdep = meeting.host.departmentName?meeting.host.departmentName.toLowerCase():'';
            htmlToBeAppend += '<span class="department-details camel-case">'+hostdep+'</span>';
            htmlToBeAppend += '</div>';//.center class end
            htmlToBeAppend += '<div class="right">';
            var memberDiplayName = '';
            if($('#isNonMember').val() == true || $('#isNonMember').val() == 'true'){
                //${WebAppContext.isNonMember()}
                if(meeting.meetingVendorId == null || meeting.meetingVendorId.length <= 0){
                    var vendorVal = meeting.vendor?meeting.vendor:'';
                    htmlToBeAppend += '<div style=""><p style=""><button class="btn not-available" href="javascript:location.reload()" style="margin-bottom:0;" vendor="'+vendorVal+'">Join your visit</button></p><p class="" style="margin-top:20px;">Your visit will be available within 15 minutes of the start time.</p></div>';
                }else{
                    memberDiplayName = meetingLastName+', '+meetingFirstName;
                    var vendorVal = meeting.vendor?meeting.vendor:'';
                    htmlToBeAppend += '<div style=""><p style=""><button id="joinNowId" class="btn joinNowButton" userName="'+memberDiplayName+', (dummy@dummy.com)" meetingid="'+meeting.meetingId+'" isproxymeeting="Y" href="#" style="margin-bottom:0;" vendor="'+vendorVal+'">Join your visit</button></p><p class="" style="margin-top:20px;">You may be joining before your clinician. Please be patient.</p></div>';
                }

            }else{
                //${not WebAppContext.isNonMember()}
                if(meeting.meetingVendorId == null || meeting.meetingVendorId.length <= 0){
                    var vendorVal = meeting.vendor?meeting.vendor:'';
                    htmlToBeAppend += '<div style=""><p style=""><button class="btn not-available" href="javascript:location.reload()" style="margin-bottom:0;" vendor="'+vendorVal+'">Join your visit</button></p><p class="" style="margin-top:20px;">Your visit will be available within 15 minutes of the start time.</p></div>';
                }else{
                    //DE15381 changes
                    htmlToBeAppend += '<div style="">';
                    var memberDoLname = meeting.member.lastName ? meeting.member.lastName.trim() : ''; //$('#memberDOlastName').val()?$('#memberDOlastName').val().trim():'';
                    var memberDofname = meeting.member.firstName ? meeting.member.firstName.trim() : '';
                    $('#memberDOfirstName').val() ? $('#memberDOfirstName').val().trim() : '';
                    if (!memberDoLname || !memberDofname) {
                        memberDiplayName = memberDoLname + ' ' + memberDofname;
                    } else {
                        memberDiplayName = memberDoLname + ', ' + memberDofname;
                    }
                    //memberDiplayName = meetingLastName+', '+meetingFirstName;
                    if($('#memberDOmrn').val() == meeting.member.mrn){
                        var vendorVal = meeting.vendor?meeting.vendor:'';
                        htmlToBeAppend += '<p class=""><button id="joinNowId" class="btn joinNowButton" userName="'+memberDiplayName.trim()+'" meetingid="'+meeting.meetingId+'" isproxymeeting="N" href="#" style="margin-bottom:0;" vendor="'+vendorVal+'">Join your visit</button></p><p class="" style="margin-top:20px;">You may be joining before your clinician. Please be patient.</p>';
                    }else{
                        var vendorVal = meeting.vendor?meeting.vendor:'';
                        var primaryMemberName = $('#memberDOlastName').val().trim() + ', ' + $('#memberDOfirstName').val().trim();
                        htmlToBeAppend += '<p style=""><button id="joinNowId" class="btn joinNowButton" userName="'+primaryMemberName.trim()+', (dummy@dummy.com)" meetingid="'+meeting.meetingId+'" isproxymeeting="Y" href="#" style="margin-bottom:0;" vendor="'+vendorVal+'">Join your visit</button></p><p class="" style="margin-top:20px;">You may be joining before your clinician. Please be patient.</p>';
                    }
                    htmlToBeAppend += '</div>';
                    //DE15381 changes
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
        checkAndBlockMeetings();
    }
    if(browserInfo.isChrome == true || browserInfo.isFirefox == true){
        //do nothing
    }else if(browserInfo.isSafari){
        if(runUDPTest == true){
            startUDPTest();
        } else {
             $("#blockerMessage").css("display","none");
        }
    }
}
//US31767