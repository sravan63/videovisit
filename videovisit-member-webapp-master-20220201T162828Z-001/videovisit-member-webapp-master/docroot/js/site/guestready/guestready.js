//US31768
var getGuestMeetingsTimeoutVal;
var runUDPTest = true;
var browserInfo;
//US31768
$(document).ready(function() {
	
	
    var meetingTimestamp,convertedTimestamp,meetingIdData,hreflocation,meetingId,patientLastName, verifyData;
    browserInfo = getBrowserInfo();

	// Join now Click Event
    $(document).delegate('.btn', 'click', function(e){
       // e.preventDefault();
    	$("#layover").show();
    	//US30802
        if($(this).attr('vendor') == 'pexip'){
            setPeripheralsFlag("false");
        }else{
            setPeripheralsFlag("true");
        }    	
    	//US30802
        var caregiverId = $(this).attr('caregiverId');
        var name = $(this).attr('userName');
                       
        meetingIdData = 'meetingCode=' + $.trim($("#meetingCode").val()); //$(this).attr('meetingCode');
        meetingId = $.trim($("#meetingId").val());
        patientLastName = $.trim($("#patientLastName").val());
        verifyData= 'meetingId=' + meetingId+ 
        '&meetingCode=' + $.trim($("#meetingCode").val())+
        '&guestName=' + name +
        '&patientLastName=' + patientLastName ;
        
       
        $.ajax({
        	
        	type: 'POST',
            data: verifyData,
            url: VIDEO_VISITS.Path.guestready.joinmeeting,
            success: function (returndata) {

                try {
                    returndata = jQuery.parseJSON(returndata);
                    //MEETING_FINISHED_EXCEPTION
                    //if(returndata.result === '2'){
                    //500-Meeting data not found, 520-Meeting Cancelled, 510-Meeting Ended
                    if (returndata.status.code === '510' || returndata.status.code === '500' || returndata.status.code === '520') {
                        window.location.replace("guest?meetingCode=" + $.trim($("#meetingCode").val()));
                        return false;
                    }
            	  //CAREGIVER JOINED FROM DIFFERENT DEVICE
            	  //else if (returndata.result === '4') {
            	  else if (returndata.status.code === '400') { 
                  	$("p.error").css("display", "inline").html('<label>You have already joined this video visit from another device. You must first sign off from the other device before attempting to join this visit here.</label><br/>');
                      moveToit("p.error");  
                      $("#layover").hide();
                      return false;  
                    }
                    //hreflocation = returndata.result;
                    if (returndata.launchMeetingEnvelope.launchMeeting != null) {
                        hreflocation = returndata.launchMeetingEnvelope.launchMeeting.roomJoinUrl;
                    } else {
                        hreflocation = null;
                    }
                    //  hreflocation = "http://localhost:8080/vidyoplayer/player.html?guestName="+name+"&guestUrl=" +encodeURIComponent(hreflocation);
                    //	hreflocation = "/vidyoplayer/player.html?guestName=" + name + "&isProvider=false&meetingId=" +meetingId + "&caregiverId=" +caregiverId+ "&meetingCode=" +$.trim($("#meetingCode").val())+ "&guestUrl=" +encodeURIComponent(hreflocation);

                    var meetingCode = $.trim($("#meetingCode").val());
                    var postParaVideoVisit = {
                        roomUrl: hreflocation,
                        meetingId: meetingId,
                        meetingCode: $.trim($("#meetingCode").val()),
                        guestName: name,
                        patientLastName: patientLastName,
                        isMember: "N",
                        isProvider: "false",
                        meetingId: meetingId,
                        caregiverId: caregiverId,
                        meetingCode: meetingCode,
                        guestUrl: encodeURIComponent(hreflocation)
                    };

                    $.ajax({
                        type: 'POST',
                        url: VIDEO_VISITS.Path.landingready.videoVisit,
                        cache: false,
                        async: false,
                        data: postParaVideoVisit,
                        success: function () {
                            //add logc to differentiate vidyo/pexip
                            if ($.browser.mozilla) {
                                window.setTimeout(function () {
                                    window.location.href = "videoVisitReady.htm";
                                }, 3000);
                            } else {
                                window.location.href = "videoVisitReady.htm";
                            }
                        },
                        error: function () {}
                    })

                } catch (e) {
                    //window.location.replace(VIDEO_VISITS.Path.guestglobal.expired);
                }

            },
            //error receives the XMLHTTPRequest object, a string describing the type of error and an exception object if one exists
            error: function(theRequest, textStatus, errorThrown) {
            	 window.location.replace(VIDEO_VISITS.Path.guestglobal.expired);
            }
        })
        return false;
     });

    //Get the meeting timestamp, convert it and display it. Grabs the text contents of the element with the timestamp class,
    //converts it to the correct timestamp and then appends it to the next h3 in the code
    $('.timestamp').each(function(){
        meetingTimestamp = $(this).text();
        var tz = $("#tz").val();
        convertedTimestamp = convertTimestampToDate(meetingTimestamp, 'time_only');

        $(this).html(convertedTimestamp);
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
    getGuestMeetings();
    
});

var refreshGrid = function(){
    runUDPTest = true;
    getGuestMeetings();
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

function checkSTUNServer(stunConfig, timeout){ 
    console.log('stunConfig: ', stunConfig);
  return new Promise(function(resolve, reject){

    setTimeout(function(){
        if(promiseResolved) return;
        resolve(false);
        promiseResolved = true;
    }, timeout || 5000);

        var promiseResolved = false,
            myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection //compatibility for firefox and chrome
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
            if (promiseResolved || !ice || !ice.candidate || !ice.candidate.candidate || !(ice.candidate.candidate.indexOf('candidate:') > -1 && ice.candidate.candidate.indexOf('udp') > -1)) return;
            promiseResolved = true;
            resolve(true);
        };
    });
}

var logVendorMeetingEvents = function(params){
    var userId;
    var userType;
    var logType = params[0];
    var meetingId = $("#meetingId").val().trim();
    var eventName = (params[1])?params[1]:'';
    var eventDesc = (params[2])?params[2]:'';
    console.log("sendEventNotification :: params :: "+params);
    userType = 'Caregiver';
    userId = $("#guestName").val().trim();
    console.log("sendEventNotification :: params :: "+params);
    var eventData = {
        'logType': logType,
        'meetingId':meetingId,
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

//US31768
function getGuestMeetings(){	
	$('.no-meetings-grid').css('display', 'none');
    $('.my-meetings-grid').css('display', 'block');
    $('.my-meetings-grid').empty();
    $('.my-meetings-grid').html('<div style="text-align:center;"><div class="spinner-container"><img width="50px" height="50px" style="float:none;height:50px;width:50px;" src="images/global/iconLoading_small.gif"/></div></div>');
    window.scrollTo(0, 0);
    clearTimeout(getGuestMeetingsTimeoutVal);
    getGuestMeetingsTimeoutVal = setTimeout(function(){
        runUDPTest = true;
        getGuestMeetings();
    },180000);
    $.ajax({
        type: "GET",
        url: VIDEO_VISITS.Path.guestready.guestMeeting,
        cache: false,
        dataType: "json",
        success: function(result){
            updateDomWithMeetings(result);
        },
        error: function(error){
        	$('.my-meetings-grid').empty();
            $('.my-meetings-grid').css('display', 'none');
            $('.no-meetings-grid').css('display', 'block');
        },
        complete: function () {}
    });
}

function updateDomWithMeetings(guestData){
    if(!guestData || guestData.length == 0){
    	$('.my-meetings-grid').empty();
        $('.my-meetings-grid').css('display', 'none');
        $('.no-meetings-grid').css('display', 'block');
    }else{
        $('.no-meetings-grid').css('display', 'none');
        $('.my-meetings-grid').css('display', 'block');
        $('.my-meetings-grid').empty();
        var htmlToBeAppend = '';
        for(var i=0;i<guestData.length;i++){
            var meeting = guestData[i];
            htmlToBeAppend += '<div class="landing-portal-single-container" style="padding-bottom:25px;">';
            htmlToBeAppend += '<div class="meeting-details-container" style="font-size:14px;">';
            htmlToBeAppend += '<div class="left">';
            var updatedTime = convertTimestampToDate(meeting.meetingTime, 'time_only');
            htmlToBeAppend += '<div class="time-display"><span class="timestamp">'+updatedTime+' </span><span></span></div>';
            var lname = meeting.member.lastName?meeting.member.lastName:'';
            var fname = meeting.member.firstName?meeting.member.firstName:'';
            var mname = meeting.member.middleName?meeting.member.middleName:'';
            htmlToBeAppend += '<span>'+lname+', '+fname+' '+mname+'</span>';
            htmlToBeAppend += '<div class="accord-contents" style="display:block;margin-top:30px;">';
            if(meeting.participant && meeting.participant.length > 0 || meeting.caregiver && meeting.caregiver.length > 0 || meeting.sipParticipants && meeting.sipParticipants.length > 0){
                htmlToBeAppend += '<h2 class="label" style="float:none;margin-bottom:10px;">Additional Participants</h2>';
            }
            if(meeting.participant && meeting.participant.length > 0){
                htmlToBeAppend += '<div class="names-container-member" style="margin:0px;"><span class="names participants" style="margin-left:0;">';
                for(var j=0;j<meeting.participant.length;j++){
                    var pfname = meeting.participant[j].firstName?meeting.participant[j].firstName.toLowerCase():'';
                    var plname = meeting.participant[j].lastName?meeting.participant[j].lastName.toLowerCase():'';
                    htmlToBeAppend += '<span>'+pfname+' '+plname;
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
                for(var x=0;x<newArray.length;x++){
                    var cgfname = newArray[x].firstName?newArray[x].firstName:'';
                    var cglname = newArray[x].lastName?newArray[x].lastName:'';
                    var displayname = '';
                    var isTelephony = isNumberString(cgfname);

                    var isSip = newArray[x].destination?true:false;

                    if(isSip){
                        displayname = newArray[x].displayName;
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
            if(meeting.host.homePageUrl){
                var fname = meeting.host.firstName?meeting.host.firstName.toLowerCase():'';
                var lname = meeting.host.lastName?meeting.host.lastName.toLowerCase():'';
                htmlToBeAppend += '<a target="_blank" class="name-and-details camel-case" style="font-weight:bold;" href="'+meeting.host.homePageUrl+'"><span style="text-transform:capitalize">'+fname+' '+lname+'</span>';
                if(meeting.host.title){
                    htmlToBeAppend += ', '+meeting.host.title;
                }
                htmlToBeAppend += '</a>';
            }else{
                var hostfname = meeting.host.firstName?meeting.host.firstName.toLowerCase():'';
                var hostlname = meeting.host.lastName?meeting.host.lastName.toLowerCase():'';
                htmlToBeAppend += '<div class="name-and-details camel-case" style="font-weight:bold;"><span style="text-transform:capitalize">'+hostfname+' '+hostlname+'</span>';
                if(meeting.host.title){
                    htmlToBeAppend += ', '+meeting.host.title;
                }
                htmlToBeAppend += '</div>';
            }
            var department = (meeting.host.departmentName)?meeting.host.departmentName.toLowerCase():'';
            htmlToBeAppend += '<div class="department-details camel-case" style="width: 180px;">'+department+'</div>';
            htmlToBeAppend += '</div>';//.center class end
            htmlToBeAppend += '<div class="right">';
            if(meeting.caregiver && meeting.caregiver.length > 0){
                for(var y=0;y<meeting.caregiver.length;y++){
                    if($('#meetingCode').val() == meeting.caregiver[y].careGiverMeetingHash){
                        var cglname = meeting.caregiver[y].lastName?meeting.caregiver[y].lastName:'';
                        var cgfname = meeting.caregiver[y].firstName?meeting.caregiver[y].firstName:'';
                        var vendorVal = meeting.vendor?meeting.vendor:'';
                        htmlToBeAppend += '<button id="joinNowId" class="btn joinNowButton"userName="'+cglname+', '+cgfname+', ('+meeting.caregiver[y].emailAddress+')" meetingid="'+meeting.meetingId+'" href="'+meeting.meetingVendorId+'" caregiverId="'+meeting.caregiver[y].careGiverId+'" vendor="'+vendorVal+'">Join your visit</button>';
                    }
                }
                htmlToBeAppend += '<p class="" style="margin-top:20px;">You may be joining before your clinician. Please be patient.</p><p class="error error-guest-login"></p>';
            }
            htmlToBeAppend += '</div>';//.right class end
            htmlToBeAppend += '</div>';//.meeting-details-container class end
            htmlToBeAppend += '</div>';//.landing-portal-single-container class end

        }
        $('.my-meetings-grid').html(htmlToBeAppend);
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
//US31768
