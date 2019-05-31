// **** WEBUI **** //

var video;
var flash;
var isMobileDevice = false;
var presentation = null;
var flash_button = null;
var bandwidth;
var conf_uri;
var conference;
var videoURL;
var presWidth = 1280;
var presHeight = 720;
var presenter;
var pin;
var source = null;
var presenting = false;
var startTime = null;
var userResized = false;
var presentationURL = '';
var videoPresentation = true;
var useConsoleForLogging = true;
var useAlertsForLogging = false;

var id_selfview;
var id_muteaudio;
var id_mutevideo;
var id_mutespeaker;
var id_fullscreen;
var id_screenshare;
var id_presentation;

var isProvider = $("#isProvider").val();
var set_interval = "false";
var set_interval_callback;
var layout;
var media_stats;
var presenting_user = '';
webuiLoaded = true;

var hostName = '';
var patientName = "";
var isValidInteraction = false;
var hostDirtyThisMeeting = false;
var currentLayout = "";

var trans = Array();
trans['BUTTON_MUTEAUDIO'] = "Mute Audio";
trans['BUTTON_UNMUTEAUDIO'] = "Unmute Audio";
trans['BUTTON_MUTEVIDEO'] = "Mute Video";
trans['BUTTON_UNMUTEVIDEO'] = "Unmute Video";
trans['BUTTON_FULLSCREEN'] = "Fullscreen";
trans['BUTTON_NOPRES'] = "No Presentation Active";
trans['BUTTON_SHOWPRES'] = "View Presentation";
trans['BUTTON_HIDEPRES'] = "Hide Presentation";
trans['BUTTON_SHOWSELF'] = "Show Selfview";
trans['BUTTON_HIDESELF'] = "Hide Selfview";
trans['BUTTON_SCREENSHARE'] = "Share Screen";
trans['BUTTON_STOPSHARE'] = "Stop Sharing";
trans['HEADING_ROSTER_LIST'] = "Participants";
trans['TITLE_HOSTS'] = "Hosts";
trans['TITLE_GUESTS'] = "Guests";

var firstParticipantFlag = "";
var jNotifyDefaults = {
    //autoHide: true,
    clickOverlay: false,
    MinWidth: 250,
    TimeShown: 3000,
    ShowTimeEffect: 200,
    HideTimeEffect: 200,
    LongTrip: 20,
    HorizontalPosition: 'center',
    VerticalPosition: -20,
    ShowOverlay: false,
    ColorOverlay: '#000',
    OpacityOverlay: 0.3
};
var pexipParticipantsList = [];
var utilitiesTemp = {};
utilitiesTemp.msgQueue = [];
utilitiesTemp.msgInProgress = false;
var refreshingOrSelfJoinMeeting = true;
var disconnectAlreadyCalled = false;

/* ~~~ PRESENTATION STUFF ~~~ */
function presentationClosed() {
    //id_presentation.textContent = trans['BUTTON_SHOWPRES'];
    if (presentation && $(presentation).find('#presvideo').length>0) {
        rtc.stopPresentation();
    }
    presentation = null;
    $('#presentation-view').css('display', 'none');
}

function remotePresentationClosed(reason) {
    if (presentation) {
        /*if (reason) {
            alert(reason);
        }*/
        //presentation.close()
        $(presentation).css('display', 'none');
        presentation = null;
    }
}

function checkForBlockedPopup() {
    //id_presentation.classList.remove("inactive");
    if (!presentation || typeof presentation.innerHeight === "undefined" || (presentation.innerHeight === 0 && presentation.innerWidth === 0)) {
        // Popups blocked
        presentationClosed();
        flash_button = setInterval(function(){
            //id_presentation.classList.toggle('active');
        }, 1000);
    } else {
        //id_presentation.textContent = trans['BUTTON_HIDEPRES'];
        //presentation.document.title = decodeURIComponent(conference) + " presentation from " + presenter;
        if (flash_button) {
            clearInterval(flash_button);
            flash_button = null;
            //id_presentation.classList.remove('active');
        }
        if ($(presentation).find('#presvideo').length>0) {
            rtc.getPresentation();
        } else {
            loadPresentation(presentationURL);
        }
    }
}

function createPresentationWindow() {
    if (presentation == null) {
        $('#presentation-view').css('display', 'block');
        setTimeout(checkForBlockedPopup, 1000);
        presentation = $('#presentation-view');
        $('#presentation-view').html("<img src='' id='loadimage' style='position:absolute;left:0;top:0;display:block;z-index:5;height:100%;width:100%;' onLoad='switchImage();'/><div width='0px' height='0px' style='overflow:auto;position:absolute;left:0;top:0;'><img src='' id='presimage' width='0px'/></div>");
    }
    /*if (presentation == null) {
        presentation = window.open(document.location, 'presentation', 'height=' + presHeight + ',width=' + presWidth + ',location=no,menubar=no,toolbar=no,status=no');
        setTimeout(checkForBlockedPopup, 1000);

        if (presentation != null) {
            presentation.document.write("<html><body bgcolor='#000000'>");
            presentation.document.write("<script type='text/javascript'>function switchImage() { presimage.src = loadimage.src; }</script>");
            presentation.document.write("<img src='' id='loadimage' style='position:absolute;left:0;top:0;display:none' width='0px' height='0px' onLoad='switchImage();'/>");
            presentation.document.write("<div width='100%' height='100%' style='overflow:auto;position:absolute;left:0;right:0;top:0;bottom:0'>");
            presentation.document.write("<img src='' id='presimage' width='100%'/>");
            presentation.document.write("</div>");
            presentation.document.write("</body></html>");
            presentation.addEventListener('beforeunload', presentationClosed);
            presentation.addEventListener('resize', function() { userResized = true; });
            userResized = false;
        }
    }*/
}

function loadPresentation(url) {
    if (presentation && $(presentation).find('#loadimage').length>0) {
        //presentation.loadimage.src = url;
        $(presentation).find('#loadimage')[0].src = url;
        setTimeout(resizePresentationWindow, 500);
    } else {
        presentationURL = url;
    }
}

function resizePresentationWindow() {
    /*if (presentation != null && presentation.presimage.clientWidth > 640 && !userResized) {
        presWidth = presentation.presimage.clientWidth;
        presHeight = presentation.presimage.clientHeight;
        presentation.window.resizeTo(presWidth + (presentation.outerWidth - presentation.innerWidth), presHeight + (presentation.outerHeight - presentation.innerHeight));
    }*/
}

function loadPresentationStream(videoURL) {
    if (presentation && $(presentation).find('#loadimage').length>0) {
        //presentation.presvideo.poster = "";
        //presentation.presvideo.src = videoURL;
        $('#presentation-view #presvideo').attr('src', videoURL);
    }
}

function createPresentationStreamWindow() {
    if (presentation == null) {
        setTimeout(checkForBlockedPopup, 1000);
        $('#presentation-view').css('display', 'block');
        presentation = $('#presentation-view');
        $('#presentation-view').html("<img src='' id='loadimage' style='position:absolute;left:0;top:0;display:block;z-index:5;height:100%;width:100%;' onLoad='switchImage();'/><div width='0px' height='0px' style='position:absolute;left:0;top:0;'><video id='presvideo' width='0px' autoplay='autoplay' poster='img/spinner.gif'/><img src='' id='presimage' width='0px'/></div>");
    }
    //presentation-view
    /*if (presentation == null) {
        presentation = window.open(document.location, 'presentation', 'height=' + presHeight + ',width=' + presWidth + ',location=no,menubar=no,toolbar=no,status=no');
        setTimeout(checkForBlockedPopup, 1000);

        if (presentation != null) {
            presentation.document.write("<html><body bgcolor='#333333'>");
            presentation.document.write("<div width='100%' height='100%' style='overflow:auto;position:absolute;left:0;right:0;top:0;bottom:0'>");
            presentation.document.write("<video id='presvideo' width='100%' autoplay='autoplay' poster='img/spinner.gif'/>");
            presentation.document.write("</div>");
            presentation.document.write("</body></html>");
            presentation.addEventListener('beforeunload', presentationClosed);
        }
    }*/
}

function presentationStartStop(setting, pres) {
    if (setting == true) {
        presenter = pres;
        if (presenting) {
            //id_presentation.textContent = trans['BUTTON_SHOWPRES'];
            //id_presentation.classList.remove("inactive");
        } else if (source == 'screen') {
            rtc.disconnect();
        } else if (videoPresentation) {
            createPresentationStreamWindow();
        } else {
            createPresentationWindow();
        }
        presenting_user = pres.substring(pres.indexOf('<')+1, pres.indexOf('>'));
        if(!refreshingOrSelfJoinMeeting && !isMobileDevice){
            utilityNotifyQueue(presenting_user + ' has initiated desktop sharing.');
        }
    } else {
        if (presentation != null) {
            //presentation.close();
            $('#presentation-view').css('display', 'none');
        }
        if (flash_button) {
            clearInterval(flash_button);
            flash_button = null;
            //id_presentation.classList.remove('active');
        }
        // id_presentation.textContent = trans['BUTTON_NOPRES'];
        // id_presentation.classList.add("inactive");
        if(!refreshingOrSelfJoinMeeting && !isMobileDevice && presenting_user){
            utilityNotifyQueue(presenting_user + ' has stopped desktop sharing.');
        }
        presenting_user = '';
    }
}

function togglePresentation() {
    if (presentation) {
        presentation.close();
    } else {
        if (videoPresentation) {
            createPresentationStreamWindow();
        } else {
            createPresentationWindow();
        }
    }
}

//To do later - Full screen Implementation
//function goFullscreen() {
//video.goFullscreen = ( video.webkitRequestFullscreen || video.mozRequestFullScreen );
//video.goFullscreen();
//}

function presentScreen() {
    log("info","pexip_smd_initiate_action","console: presentScreen - on click of share my desktop button");
    if (!presenting) {
        //id_screenshare.textContent = trans['BUTTON_STOPSHARE'];
        rtc.present('screen');
        presenting = true;
        $('#id_screenshare').css('display', 'none');
        $('#id_screen_unshare').css('display', 'block');
    } else {
        rtc.present(null);
        $('#id_screenshare').css('display', 'block');
        $('#id_screen_unshare').css('display', 'none');
    }
    /*if (!id_screenshare.classList.contains("inactive")) {
        if (!presenting) {
            id_screenshare.textContent = trans['BUTTON_STOPSHARE'];
            rtc.present('screen');
            presenting = true;
        } else {
            rtc.present(null);
        }
    }*/
}

function stopSharing(){
    log("info","pexip_smd_close_action","console: stopSharing - disable share button");
    rtc.present(null);
    presenting = false;
    $('#id_screenshare').css('display', 'block');
    $('#id_screen_unshare').css('display', 'none');
}

function unpresentScreen(reason) {
   if (reason) {
       //alert(reason);
   }
   presenting = false;
   $('#id_screenshare').css('display', 'block');
   $('#id_screen_unshare').css('display', 'none');
}
//
///* ~~~ MUTE AND HOLD/RESUME ~~~ */
//
//function muteUnmuteSpeaker() {
//    var video=document.getElementById("video");
//      if(video.muted){
//        video.muted = false;
//        id_mutespeaker.classList.remove('mutedspeaker');
//        id_mutespeaker.classList.add('unmutedspeaker');
//      } else {
//        video.muted = true;
//        id_mutespeaker.classList.remove('unmutedspeaker');
//        id_mutespeaker.classList.add('mutedspeaker');
//      }
//    /*if (!id_mutespeaker.classList.contains("inactive")) {
//        if (document.getElementById('video').volume == 1) {
//            document.getElementById('video').volume = 0;
//            id_mutespeaker.classList.remove('unmutedspeaker');
//            id_mutespeaker.classList.add('mutedspeaker');
//        } else {
//            document.getElementById('video').volume = 1;
//            id_mutespeaker.classList.remove('mutedspeaker');
//            id_mutespeaker.classList.add('unmutedspeaker');
//        }
//    }*/
//}
//
//function muteMicStreams() {
//    if (!id_muteaudio.classList.contains("inactive")) {
//        muteAudio = rtc.muteAudio();
//        id_muteaudio.classList.toggle('selected');
//        if (muteAudio) {
//            id_muteaudio.classList.remove('unmutedmic');
//            id_muteaudio.classList.add('mutedmic');
//        } else {
//            id_muteaudio.classList.remove('mutedmic');
//            id_muteaudio.classList.add('unmutedmic');
//        }
//    }
//}
//
//function muteVideoStreams() {
//    if (!id_mutevideo.classList.contains("inactive")) {
//        muteVideo = rtc.muteVideo();
//        id_mutevideo.classList.toggle('selected');
//        if (muteVideo) {
//            id_mutevideo.classList.remove('unmutedcamera');
//            id_mutevideo.classList.add('mutedcamera');
//        } else {
//            id_mutevideo.classList.remove('mutedcamera');
//            id_mutevideo.classList.add('unmutedcamera');
//        }
//    }else{
//
//    }
//}
//
//function toggleSelfview() {
//    console.log("toggleSelfview");
//    
//    if (!id_selfview.classList.contains("inactive")) {
//        if (flash) {
//            //flash.toggleSelfview();
//            if (id_selfview.classList.contains('selected')) {
//                flash.hideSelfview();
//                id_selfview.classList.remove('selected');
//                id_selfview.textContent = trans['BUTTON_SHOWSELF'];
//            } else {
//                flash.showSelfview();
//                id_selfview.classList.add('selected');
//                id_selfview.textContent = trans['BUTTON_HIDESELF'];
//            }
//        } else {
//            selfview.hidden = !selfview.hidden;
//            if (selfview.hidden) {
//                id_selfview.textContent = trans['BUTTON_SHOWSELF'];
//                id_selfview.classList.remove('selected');
//                rosterlist.classList.remove('shorter');
//            } else {
//                id_selfview.textContent = trans['BUTTON_HIDESELF'];
//                id_selfview.classList.add('selected');
//                rosterlist.classList.add('shorter');
//            }
//        }
//    }
//}
//
function holdresume(setting) {
   if (setting === true) {
       video.src = "";
       video.poster = "img/OnHold.jpg";
       id_muteaudio.classList.add("inactive");
       id_mutevideo.classList.add("inactive");
   } else {
       video.poster = "";
       video.src = videoURL;
       if (presentation != null) {
           loadPresentation();
       }
       id_muteaudio.classList.remove("inactive");
       id_mutevideo.classList.remove("inactive");
   }
}

/* ~~~ ROSTER LIST ~~~ */

function updateRosterList(roster) {
    console.log('update roster list on participant change');
    /*rosterlist.removeChild(rosterul);
    rosterul = document.createElement("ul");
    rosterlist.appendChild(rosterul);

    var state = "";
    if (roster.length > 0 && 'role' in roster[0]) {
        var h2 = document.createElement("h2");
        h2.innerHTML = trans['TITLE_HOSTS'];
        rosterul.appendChild(h2);
        state = "HOSTS";
    }

    rosterheading.textContent = trans['HEADING_ROSTER_LIST'] + " (" + roster.length + ")";

    for (var i = 0; i < roster.length; i++) {
        if (roster[i]['role'] == "unknown") {
            continue;
        } else if (roster[i]['role'] == "guest" && state == "HOSTS") {
            var h2 = document.createElement("h2");
            h2.innerHTML = trans['TITLE_GUESTS'];
            rosterul.appendChild(h2);
            state = "GUESTS";
        }

        var li = document.createElement("li");
        if (roster[i]['display_name'] != "" && roster[i]['display_name'] != roster[i]['uri']) {
            var subtitle = document.createElement("p");
            subtitle.innerHTML = roster[i]['uri'];
            var surtitle = document.createElement("h3");
            surtitle.innerHTML = roster[i]['display_name'];
            if (roster[i]['is_presenting'] == "YES") {
                surtitle.classList.add("presenting");
            }
            li.appendChild(surtitle);
            li.appendChild(subtitle);
        } else {
            var surtitle = document.createElement("h3");
            surtitle.innerHTML = roster[i]['uri'];
            li.appendChild(surtitle);
            if (roster[i]['is_presenting'] == "YES") {
                surtitle.classList.add("presenting");
            }
        }

        rosterul.appendChild(li);
    }

    if (video && navigator.userAgent.indexOf("Chrome") != -1 && navigator.userAgent.indexOf("Mobile") == -1 && !source) {
        id_screenshare.classList.remove("inactive");
    }*/
}

/* ~~~ SETUP AND TEARDOWN ~~~ */

function cleanup(event) {
    if (video) {
        video.src = "";
    }
    if (presentation) {
        //presentation.close();
        $(presentation).css('display', 'none');
        presentation = null;
    }
}

function finalise(event) {
    log("info","finalise","console: inside webui finalise event :" + event); 
    //console.log("inside webui finalise");
    rtc.disconnect();
    cleanup();
}

function remoteDisconnect(reason) {
    log("info","remoteDisconnect","console: inside remoteDisconnect reason :" + reason); 
    cleanup();
    alert(reason);
    window.removeEventListener('beforeunload', finalise);
    // window.location = "index.html";
    if(isProvider == "true"){
        window.location.href =  '/videovisit/myMeetings.htm';
    } 
     else {
        var url = window.location.href;
        if(url.indexOf("mobile") > -1){
            window.location.href= '/videovisit/mobileAppPatientMeetings.htm';
        } else {
        window.location.href = '/videovisit/landingready.htm';
       }
   }
}

function handleError(reason) {
    log("error","handleError","console: inside handleError reason :" + reason); 
//    console.log("HandleError");
//    console.log(reason);
    if (video && !selfvideo.src && new Date() - startTime > 30000) {
        reason = "WebSocket connection error.";
    }
    remoteDisconnect(reason);
}

function doneSetup(url, pin_status, conference_extension) {
    console.log("inside doneSetup");

    if (url) {
        if (typeof(MediaStream) !== "undefined" && url instanceof MediaStream) {
            selfvideo.srcObject = url;
        } else {
            selfvideo.src = url;
        }
    }
    console.log("PIN status: " + pin_status);
    console.log("IVR status: " + conference_extension);
    /*if (pin_status == 'required') {
        pinentry.classList.remove("hidden");
    } else if (pin_status == 'optional') {
        selectrole.classList.remove("hidden");
    } else if (conference_extension) {
        ivrentry.classList.remove("hidden");
    } else {
        maincontent.classList.remove("hidden");
        rtc.connect(pin);
    }*/
    submitPinEntry();
}

/*function submitSelectRole() {
    var id_guest = document.getElementById('id_guest');
    selectrole.classList.add("hidden");
    if (id_guest.checked) {
        maincontent.classList.remove("hidden");
        rtc.connect('');
    } else {
        pinentry.classList.remove("hidden");
    }
}*/

function submitPinEntry() {
    maincontent.classList.remove("hidden");
    pin = $('#guestPin').val();
    console.log("PIN is now " + pin);
    rtc.connect(pin);
    return false;
}

function submitIVREntry() {
    var id_room = document.getElementById('id_room');
    ivrentry.classList.add("hidden");
    room = id_room.value;
    console.log("Target room is now " + room);
    rtc.connect(null, room);
    return false;
}

function sipDialOut() {
    //console.log("SIP Dial Out");
    log("info","sipDialOut","console: sipDialOut - inside sipDialOut"); 
    var phone_num = $("#phone_num").val();
    log("info","sipDialOut","console: sipDialOut - inside sipDialOut phone_num: " +phone_num); 
    //console.log("phone_num: " +phone_num);
    
    if(isProvider == "true"){
        $.ajax({
            type: "POST",
            url: VIDEO_VISITS.Path.grid.meeting.vendorDialOut,
            cache: false,
            async: true,
            data: phone_num,
            success: function(returndata){
                alert("success - work in progress");
                log('info','sipDialOut','sipDialOut success');
            },
            error: function(){
                // display error message
                log('error','sipDialOut','sipDialOut failed');
                alert("error");
            }
        });
    } else{
        alert("coming soon...");
    }
}

function participantCreated(participant){
    // CALL BACK WHEN A PARTICIPANT JOINS THE MEETING
    log("info","participantCreated","console: participantCreated - inside participantCreated - participant:" +participant); 
    if(isMobileDevice){
        updateParticipantList(participant,'join');
        console.log("inside participantCreated");
     }
     else if(participant.protocol=="sip"){
        console.log("telephony")
     }
     else {
        pexipParticipantsList.push(participant);
        var joinParticipantMsg = participant.display_name + " has joined the visit.";
        if(!refreshingOrSelfJoinMeeting && participant.display_name != $('#guestName').val()){
            utilityNotifyQueue(joinParticipantMsg);
        }
        toggleWaitingRoom(pexipParticipantsList);
        VideoVisit.checkAndShowParticipantAvailableState(pexipParticipantsList,'pexip');
    }
    /*var participant_name = participant.display_name;
    console.log("Participant Name: " +participant.display_name);

    var providerFirstName = $("#providerFirstName").val();
    console.log("Provider First Name: " +providerFirstName);

    if(providerFirstName.toLowerCase().indexOf(participant_name.toLowerCase()) > -1){
        console.log("it's a match!!!");
        console.log("Participant uuid: " +participant.uuid);
    } else{
        console.log("it's not a match!!! :(");
    }*/
    
    if(isProvider == "true"){
        // var patientFirstName = $("#patientDisplayName").val().split(/[ ,]+/);
        // var participantName = participant.display_name.split(/[ ,]+/);

        // console.log("patientFirstName: " +patientFirstName);
        // console.log("participantName: " +participantName);

        // for (var i = 0; i < patientFirstName.length; i++) {
        //     for (var j = 0; j < participantName.length; j++) {
        //         if (patientFirstName[i] === participantName[j]) {
        //             console.log("It's a match!!! :)");

        //             var uuid = participant.uuid;
        //             console.log("Participant uuid: " +participant.uuid);

        //             rtc.setParticipantSpotlight(uuid, true);
        //         } else{
        //             console.log("It's not a match!!! :(");         
        //         }
        //     }
        // }
        var uuid = participant.uuid;
        rtc.setParticipantSpotlight(uuid, true);
        return false;
    } else{
        // var providerFirstName = $("#meetingHostName").val().split(",");
        // var participantName = participant.display_name.split(/[ ,]+/);

        // console.log("providerFirstName: " +providerFirstName);
        // console.log("participantName: " +participantName);

        // for (var i = 0; i < providerFirstName.length; i++) {
        //     for (var j = 0; j < participantName.length; j++) {
        //         if (providerFirstName[i] === participantName[j]) {
        //             console.log("It's a match!!! :)");

        //             var uuid = participant.uuid;
        //             console.log("Participant uuid: " +participant.uuid);

        //             rtc.setParticipantSpotlight(uuid, true);
        //         } else{
        //             console.log("It's not a match!!! :(");         
        //         }
        //     }
        // }
        var uuid = participant.uuid;
        rtc.setParticipantSpotlight(uuid, true);
        return false;
    }
}

function participantUpdated(participant){
    // CALL BACK WHEN A PARTICIPANT JOINS THE MEETING
    // toggleWaitingRoom();
    pexipParticipantsList.push(participant);
    if(isMobileDevice){
        updateParticipantList(participant,'join');
        console.log("inside participantUpdated");
    }
    if(participant.protocol == "sip" ){
        var joinParticipantMsg = participant.display_name + " has joined the visit.";
            if(!refreshingOrSelfJoinMeeting && participant.display_name != $('#guestName').val()){
                utilityNotifyQueue(joinParticipantMsg);
        }
        var data = [];
        data.sipParticipants = participant;
        VideoVisit.updateParticipantsAndGuestsList(data);
        VideoVisit.checkAndShowParticipantAvailableState(pexipParticipantsList,'pexip');
    }
}

function participantDeleted(participant){
    // CALL BACK WHEN A PARTICIPANT LEAVES THE MEETING
    log("info","participantDeleted","console: participantDeleted - inside participantDeleted - participant:" +participant); 
    if(isMobileDevice){
        updateParticipantList(participant,'left');
        console.log("inside participantDeleted");
     }else {
         var removingParticipant = pexipParticipantsList.filter(function(user){
             return user.uuid == participant.uuid;
         });
         pexipParticipantsList = pexipParticipantsList.filter(function(user){
             return user.uuid != participant.uuid;
         });
         var participantMsg = removingParticipant[0].display_name + " has left the visit.";
        if(!refreshingOrSelfJoinMeeting && removingParticipant.display_name != $('#guestName').val()){
            utilityNotifyQueue(participantMsg);
        }
        VideoVisit.checkAndShowParticipantAvailableState(pexipParticipantsList,'pexip');
        toggleWaitingRoom(pexipParticipantsList);
     }   
}

function layoutUpdate(view){
    log("info","layoutUpdate","console: layoutUpdate - inside layoutUpdate - view:" +view.view); 
    //console.log("inside layoutUpdate - view: " +view.view);

    switch(view.view){
        case "1:7":
            console.log("Layout 1:7");
            break;
        case "1:21":
            console.log("Layout 1:21");
            break;
        case "2:21":
            console.log("Layout 2:21");
            break;
        case "1:0":
            console.log("Layout 1:0");
            break;
        case "4:0":
            console.log("Layout 4:0");
            break;
        default:
            console.log("default case - cannot get view");
            break;
    }
}

function getMediaStats(){
    console.log("inside getMediaStats");

    if(set_interval == "false"){
        set_interval = "true";

        set_interval_callback = setInterval(function(){
            console.log("getting info every 5 seconds");
            media_stats = rtc.getMediaStatistics();
            // media_stats = JSON.stringify(rtc.getMediaStatistics());

            $("#stat-window").html("<tr>" +
                    "<th> Incoming Audio </th>" +
                    "<th> Incoming Video </th>" +
                    "<th> Outgoing Audio </th>" +
                    "<th> Outgoing Video </th>" +
                "</tr>" +
                "<tr>" +
                    "<td> Bitrate - " + media_stats.incoming.audio.bitrate + "</td>" +
                    "<td> Bitrate - " + media_stats.incoming.video.bitrate + "</td>" +
                    "<td> Bitrate - " + media_stats.outgoing.audio.bitrate + "</td>" +
                    "<td> Bitrate - " + media_stats.outgoing.video.bitrate + "</td>" +
                "</tr>" +
                "<tr>" +
                    "<td> Codec - " + media_stats.incoming.audio.codec + "</td>" +
                    "<td> Codec - " + media_stats.incoming.video.codec + "</td>" +
                    "<td> Codec - " + media_stats.outgoing.audio.codec + "</td>" +
                    "<td> Codec - " + media_stats.outgoing.video.codec + "</td>" +
                "</tr>" +
                "<tr>" +
                    "<td> Packets Lost - " + media_stats.incoming.audio['packets-lost'] + '</td>' +
                    "<td> Decode Delay - " + media_stats.incoming.video['decode-delay'] + "</td>" +
                    "<td> Packets Lost - " + media_stats.outgoing.audio['packets-lost'] + "</td>" +
                    "<td> Configured Bitrate - " + media_stats.outgoing.video['configured-bitrate'] + "</td>" +
                "</tr>" +
                "<tr>" +
                    "<td> Packets Received - " + media_stats.incoming.audio['packets-received'] + "</td>" +
                    "<td> Packets Lost - " + media_stats.incoming.video['packets-lost'] + "</td>" +
                    "<td> Packets Sent - " + media_stats.outgoing.audio['packets-sent'] + "</td>" +
                    "<td> Packets Lost - " + media_stats.outgoing.video['packets-lost'] + "</td>" +
                "</tr>" +
                "<tr>" +
                    "<td> Percentage Lost - " + media_stats.incoming.audio['percentage-lost'] + "</td>" +
                    "<td> Packets Received - " + media_stats.incoming.video['packets-received'] + "</td>" +
                    "<td> Percentage Lost - " + media_stats.outgoing.audio['percentage-lost'] + "</td>" +
                    "<td> Packets Sent - " + media_stats.outgoing.video['packets-sent'] + "</td>" +
                "</tr>" +
                "<tr>" +
                    "<td> Percentage Lost Recent - " + media_stats.incoming.audio['percentage-lost-recent'] + "</td>" +
                    "<td> Percentage Lost - " + media_stats.incoming.video['percentage-lost'] + "</td>" +
                    "<td> Percentage Lost Recent - " + media_stats.outgoing.audio['percentage-lost-recent'] + "</td>" +
                    "<td> Percentage Lost - " + media_stats.outgoing.video['percentage-lost'] + "</td>" +
                "</tr>" +
                "<tr>" +
                    "<td> </td>" +
                    "<td> Percentage Lost Recent - " + media_stats.incoming.video['percentage-lost-recent'] + "</td>" +
                    "<td> </td>" +
                    "<td> Percentage Lost Recent - " + media_stats.outgoing.video['percentage-lost-recent'] + "</td>" +
                "</tr>" +
                "<tr>" +
                    "<td> </td>" +
                    "<td> Resolution - " + media_stats.incoming.audio.resolution + "</td>" +
                    "<td> </td>" +
                    "<td> Resolution - " + media_stats.incoming.video.resolution + "</td>" +
                "</tr>");
        }, 1000);
        
        $("#stat-window-container").toggle();
        $("#info-button").css("background", "#f38b3c");
        
        /*if ($("#stat-window-container").style.display === "none") {
            $("#stat-window-container").style.display = "block";
        } else {
            $("#stat-window-container").style.display = "none";
        }*/
        
    } else if(set_interval == "true"){
        console.log("Stop Info");
        set_interval = "false";
        $("#stat-window-container").toggle();
        $("#info-button").css("background", "#555");
        clearInterval(set_interval_callback);
    }
}

function connected(url) {
    log("info","connected","console: connected - inside connected"); 
    setTimeout(function(){
        refreshingOrSelfJoinMeeting = false;
    },5000);
    if (source == 'screen') {
        video.poster = "img/screenshare.png";
    } else {
        videoURL = url;
        if (video) {
            video.poster = "";
            if (typeof(MediaStream) !== "undefined" && videoURL instanceof MediaStream) {
                video.srcObject = videoURL;
            } else {
                video.src = videoURL;
            } 
            // id_fullscreen.classList.remove("inactive");
        }
    }
//    toggleSelfview();
    if(!isMobileDevice){
        VideoVisit.setMinDimensions();
        setPatientGuestPresenceIndicatorManually();
    }
}

function setPatientGuestPresenceIndicatorManually(){
    if($('#isMember').val()){
        for(var i=0;i<sidePaneMeetingDetails.sortedParticipantsList.length;i++){
            if($('#guestName').val() == sidePaneMeetingDetails.sortedParticipantsList[i].inMeetingDisplayName){
                $('.guest-part-'+i+' .participant-indicator').css('visibility', 'visible');
            }
        }
    }
}

function switchDevices(){
    // rtc.user_media_stream = stream;

    // rtc.video_source =  cameraID;
    // rtc.audio_source =  microPhoneID;
    
    // if(switchingDevice==1)
        // rtc.renegotiate(vmrInfoData.confNode, "meet.KNW_3344556611","rads", bandwidth);
    // rtc.renegotiate("Join+Conference");
    
    rtc.renegotiate();
}

function initialise(confnode, conf, userbw, username, userpin, req_source, flash_obj) {
    console.log("inside webui initialise");
    hostName = getHostName();
    $("#selectPeripheral").detach().appendTo($("#rosterlist"));
    // $("#selectPeripheral").addClass("hidden");
    $("#enterDetails").addClass("hidden");
    $("#selectrole").removeClass("hidden");

    video = document.getElementById("video");
    id_selfview = document.getElementById('id_selfview');
    id_muteaudio = document.getElementById('mic');
    id_mutevideo = document.getElementById('camera');
    id_mutespeaker = document.getElementById('speaker');
    id_fullscreen = document.getElementById('id_fullscreen');
    id_screenshare = document.getElementById('id_screenshare');
    id_presentation = document.getElementById('id_presentation');

    flash = flash_obj;
    if (flash) {
        id_selfview.textContent = trans['BUTTON_HIDESELF'];
        id_selfview.classList.add('selected');
        videoPresentation = false;
    }
    console.log("Video: " + video);
    console.log("Bandwidth: " + userbw);

    pin = userpin;
    bandwidth = parseInt(userbw);
    name = decodeURIComponent(username).replace('+', ' ');
    source = req_source;

    rtc = new PexRTC();

    rtc.video_source =  cameraID;    //cameraID
    //rtc.audio_source =  audioSource;    //microPhoneID
    
    window.addEventListener('beforeunload', finalise);

    rtc.onSetup = doneSetup;
    rtc.onConnect = connected;
    rtc.onError = handleError;
    rtc.onDisconnect = remoteDisconnect;
    rtc.onHoldResume = holdresume;
    rtc.onRosterList = updateRosterList;
    rtc.onPresentation = presentationStartStop;
    rtc.onPresentationReload = loadPresentation;
    rtc.onScreenshareStopped = unpresentScreen;
    rtc.onPresentationConnected = loadPresentationStream;
    rtc.onPresentationDisconnected = remotePresentationClosed;
    rtc.onParticipantCreate = participantCreated;
    rtc.onParticipantUpdate = participantUpdated;
    rtc.onParticipantDelete = participantDeleted;
    rtc.onLayoutUpdate = layoutUpdate;
    
    conference = conf;
    console.log("Conference: " + conference);

    startTime = new Date();
    if(isMobileDevice){
        rtc.turn_server  = getTurnServerObjsForMobile();
    }else{
        if(sidePaneMeetingDetails.vendorConfig && sidePaneMeetingDetails.vendorConfig.turnServers){
            rtc.turn_server  = getTurnServersObjs();
        }
    }    
    rtc.makeCall(confnode, conference, name, bandwidth, source, flash);
}

function getTurnServersObjs(){
    var t_servers = [];
    if(typeof sidePaneMeetingDetails.vendorConfig.turnServers == 'string'){
        t_servers.push({
            url: 'turn:'+sidePaneMeetingDetails.vendorConfig.turnServers+'?transport=tcp',
            username: sidePaneMeetingDetails.vendorConfig.turnUserName,
            credential: sidePaneMeetingDetails.vendorConfig.turnPassword
        });
    }else{
        for(let i=0;i<sidePaneMeetingDetails.vendorConfig.turnServers.length;i++){
            t_servers.push({
                url: 'turn:'+sidePaneMeetingDetails.vendorConfig.turnServers[i]+'?transport=tcp',
                username: sidePaneMeetingDetails.vendorConfig.turnUserName,
                credential: sidePaneMeetingDetails.vendorConfig.turnPassword
            });
        }
    }
    return t_servers;
}

function getTurnServerObjsForMobile(){
    var t_servers = [];
    if($('#turnServers').val()){
        var servers = $('#turnServers').val().replace('[','').replace(']','').split(',');
        for(let i=0;i<servers.length;i++){
            t_servers.push({
                url: 'turn:'+servers[i].trim()+'?transport=tcp',
                username: $('#turnUserName').val().trim(),
                credential: $('#turnPassword').val().trim()
            });
        }
    }
    return t_servers;
}

// function logoutFromMDOApp(){
//     console.log('calling from MDO app');
//     disconnect();
// }

function disconnect(){
    log("info","disconnect","console: disconnect");
    //console.log("inside disconnect");
    // disconnects pexip
    rtc.disconnect();

    disconnectAlreadyCalled = true;
    var url = window.location.href;
    var memberMobile = url.indexOf("mobile") > -1;
    var isMember = $("#isMember").val();
    var guestName = $("#guestName").val();
        var patientName =$("#meetingPatient").val();
        if(guestName.toLowerCase() == patientName.toLowerCase()){
            isPatientLoggedIn = true;
        }
        else{
            isPatientLoggedIn = false;
        }
    var userData = {
        inMeetingDisplayName : $("#guestName").val(),
        isPatient : isPatientLoggedIn,
        joinLeaveMeeting : "L",
        meetingId: $('#meetingId').val()
    };

    if(memberMobile){
        $.ajax({
            type: "POST",
            url: 'joinLeaveMeeting.json',// VIDEO_VISITS.Path.visit.joinLeaveMeeting,
            cache: false,
            dataType: "json",
            data: userData,
            success: function(result, textStatus){
                log("info","console: joinLeaveMeeting:: success : result - : " +result);
                //console.log("joinLeaveMeeting :: result :: "+result);
            },
            error: function(textStatus){
                log("info","console: joinLeaveMeeting:: error - : " +textStatus);
                //console.log("joinLeaveMeeting :: error :: "+textStatus);
            }
        });
    }
    var refreshMeetings = false;  
    var isNative = $("#isNative").val(),
        isMember = $("#isMember").val(),
        meetingCode =  $("#meetingCode").val(),
        patientLastName = $("#patientLastName").val(),
        isProxyMeeting = $('#isProxyMeeting').val(),
        caregiverId =   $("#caregiverId").val(),
        meetingId = $('#meetingId').val();

        if(isNative=="true"){
            window.location.href = 'mobileNativeLogout.htm';
        } else {
            //var url = window.location.href;
            //var memberMobile = url.indexOf("mobile") > -1;
            if(memberMobile){
                if(isMember == "true"){
                    window.location.href= '/videovisit/mobileAppPatientMeetings.htm';
                } else if (isMember == "false"){
                     window.location.href="mobilepatientguestmeetings.htm?meetingCode=" + meetingCode + "&patientLastName=" + patientLastName ;
                }
                return;
            }
            if(isMember == "true"){
                MemberVisit.QuitMeetingActionButtonYes(meetingId, decodeURIComponent($('#guestName').val()), refreshMeetings, isProxyMeeting);
                 window.setTimeout(function(){
                       window.location.href = '/videovisit/landingready.htm';
                    },2000);

           } else {
                GuestVisit.QuitMeetingActionButtonYes(meetingCode, caregiverId, meetingId, refreshMeetings);
                window.setTimeout(function(){
                       window.location.href = '/videovisit/guestready.htm';
                    },2000);

           }
    
}
}

function toggleWaitingRoom(pexipParticipantsList){
    var isHostAvail = validateHostAvailability(pexipParticipantsList);
    var participants = pexipParticipantsList.map(a => a.uuid);
    if(!hostDirtyThisMeeting && isHostAvail){
        hostDirtyThisMeeting = true;
    }
    VIDEO_VISITS.Path.IS_HOST_AVAILABLE = isHostAvail; 
    if(isHostAvail){
        log('info',"Mobile debugging  : **** "+isProvider+" Host Available : #### "+isHostAvail);
        $("#fullWaitingRoom").css("display","none");
        if(hostDirtyThisMeeting){
            //Half waiting room
            $("#halfWaitingRoom").css("display","none");
            var calculatedHeight = $("#pluginContainer").height();
            $(".remoteFeed").height(calculatedHeight);
        }
        // Full Height
        // var calculatedHeight = $("#video-main").height();
        // $("#pluginContainer").height(calculatedHeight);
    }else{
        if(pexipParticipantsList.length == 1){
            $("#fullWaitingRoom").css("display","block");
            if(hostDirtyThisMeeting){
                $("#fullWaitingRoom").css("display","block");
            }
        } else if(pexipParticipantsList.length > 1){
            if(hostDirtyThisMeeting){
                //Half waiting room
                var calculatedHeight = ($("#pluginContainer").height()-5) / 2;
                $("#fullWaitingRoom").css("display","none");
                $("#halfWaitingRoom").css("display","block");
                $("#halfWaitingRoom").height(calculatedHeight);
                $(".remoteFeed").height(calculatedHeight);
            } else {
                // Full waiting room
                $("#fullWaitingRoom").css("display","block");
            }
        }
    }
    adjustLayout(participants, isHostAvail);
}

function adjustLayout(participants, isHostAvail){
    var totalPartcicipants = participants.length;
    var view = "";
    if(isHostAvail){
        if(totalPartcicipants == 2){
            view = "1:0";
        } else if(totalPartcicipants > 2){
            view = "1:21";
        }
    } else {
        if(totalPartcicipants > 1){
          view = "4:0";
        } else {
            view = "1:0";
        }
    }
    if(currentLayout != view){
        rtc.transformLayout({"layout": view});
    }
}

/* **
    ** This will validate and returns a boolean value 
    ** based on host's availabilty in the on going meeting
** */
function validateHostAvailability(participants){
    var isHostAvailable = false;
    if(participants){
        console.log("Mobile debugging :##### : "+participants);
        for(var i=0;i<participants.length;i++){
            var pName = changeConferenceParticipantNameFormat(participants[i].display_name);
            if(pName.toLowerCase() == hostName.toLowerCase()){
                isHostAvailable = true;
                console.log("Mobile debugging isHostAvailable  *** :##### : ");
                break;
            }
        }
    }
    return isHostAvailable;
}


function getHostName(){
    // This check is to fix the production issue DE9219
    var host = '';
    if($("#isProvider").val() == 'true'){
        var hostname = ($("#meetingHost").val().indexOf('&nbsp;') > -1)?$("#meetingHost").val().replace('&nbsp;',''):$("#meetingHost").val();
        host = changeConferenceParticipantNameFormat(hostname);
    }else{
        var hostname = ($("#meetingHostName").val().indexOf('&nbsp;') > -1)?$("#meetingHostName").val().replace('&nbsp;',''):$("#meetingHostName").val();
        host = changeConferenceParticipantNameFormat(hostname);
    }
    var splittedHostName = host.trim().split(" ");
    var hName = "";
    for(var c=0;c<splittedHostName.length;c++){
        var char = splittedHostName[c].trim();
        if(char !== ""){
            hName += char+" ";
        }
    }
    return hName.trim();
};

function disconnectOnRefresh(){
    log("info","disconnectOnRefresh","console: disconnectOnRefresh");
    console.log("inside disconnect");
    disconnectAlreadyCalled = true;
    var guestName = $("#guestName").val();
        var patientName =$("#meetingPatient").val();
        if(guestName.toLowerCase() == patientName.toLowerCase()){
            isPatientLoggedIn = true;
        }
        else{
            isPatientLoggedIn = false;
        }
    var userData = {
        inMeetingDisplayName : $("#guestName").val(),
        isPatient : isPatientLoggedIn,
        joinLeaveMeeting : "L",
        meetingId: $('#meetingId').val()
    };
    $.ajax({
        type: "POST",
        url: 'joinLeaveMeeting.json',// VIDEO_VISITS.Path.visit.joinLeaveMeeting,
        cache: false,
        dataType: "json",
        data: userData,
        success: function(result, textStatus){
            log("info","console: joinLeaveMeeting:: result - : " +result);
            //console.log("joinLeaveMeeting :: result :: "+result);
        },
        error: function(textStatus){
            log("error","console: joinLeaveMeeting:: error - : " +textStatus);
            //console.log("joinLeaveMeeting :: error :: "+textStatus);
        }
    });
}

//jNotify Message Priortization
var utilityNotifyQueue = function(notify_message){
  if (notify_message != "showMessage"){
    utilitiesTemp.msgQueue.push(notify_message);
    if (utilitiesTemp.msgInProgress == false){
      utilityNotifyQueue("showMessage");
    }
  }
  else{
    utilitiesTemp.msgInProgress = true;
    notify_message = utilitiesTemp.msgQueue.pop();
    if(firstParticipantFlag == true){
      jNotify(
        notify_message,
        {
          defaults: jNotifyDefaults,
          autoHide: true,// made this as true to fix DE8857 issue(to hide jnotification for first time joined participant)
          onClosed: function(){
            if (utilitiesTemp.msgQueue.length > 0){
              utilityNotifyQueue("showMessage"); // call the next message in the queue
            }
            else{
              utilitiesTemp.msgInProgress = false;
            }
          }
      });
    }
    else{
      jNotify(
        notify_message,
        {
          defaults: jNotifyDefaults,
          autoHide: true,
          onClosed: function(){
            if (utilitiesTemp.msgQueue.length > 0){
              utilityNotifyQueue("showMessage"); // call the next message in the queue
            }
            else{
              utilitiesTemp.msgInProgress = false;
            }
          }
      });
    }
  }
};

$(window).on("beforeunload", function() {
    console.log('browser un loading');
    utilitiesTemp.meetingEnded = true;
    if(!disconnectAlreadyCalled){
        leaveFromMeeting();
    }    
});

function leaveFromMeeting(){
    log("info","leaveFromMeeting","console: leaveFromMeeting");
    disconnectOnRefresh();
}

var log = function (type, param, msg) {
    switch (type){
        case 'info':
            if (useConsoleForLogging) {
                if(msg){
                    console.log(msg);
                }else{
                    console.log(param);
                }
            }
            if (useAlertsForLogging) {
                if(msg){
                    alert(msg);
                }else{
                    alert(param);
                }
            }
            if(msg){                    
                if(msg.toLowerCase().indexOf("event tracked") > -1){
                    var params = [type, param, msg];
                    VideoVisit.logVendorMeetingEvents(params);
                }
            }
        break;
        case 'error':
            // Notify error to backed
            var params = [type, param, msg];
            VideoVisit.logVendorMeetingEvents(params);
            console.error('WebRTC ERROR :: '+param+' :: '+msg);
        break;
    }
};

function muteSpeaker() {
    var video=document.getElementById("video");
      if(video.muted){
        log("info","pexip_speaker_mute_action","console: muteSpeaker - on click of mute speaker button");
        video.muted = false;
        $('#id_speaker_unmute').css('display', 'none');
        $('#id_speaker_mute').css('display', 'block');
      } else {
        log("info","pexip_speaker_unmute_action","console: unmuteSpeaker - on click of unmute speaker button");
        video.muted = true;
        $('#id_speaker_mute').css('display', 'none');
        $('#id_speaker_unmute').css('display', 'block');
      }
}

function muteUnmuteVideo() {
    muteVideo = rtc.muteVideo();
      if(muteVideo){
        log("info","pexip_video_mute_action","console: muteVideo - on click of mute video button");
        $('#id_video_unmute').css('display', 'block');
        $('#id_video_mute').css('display', 'none');
      } else {
        log("info","pexip_video_unmute_action","console: unmuteVideo - on click of unmute video  button");
        $('#id_video_mute').css('display', 'block');
        $('#id_video_unmute').css('display', 'none');
      }
}


function muteUnmuteMic() {
    muteAudio = rtc.muteAudio();
      if(muteAudio){
        log("info","pexip_microphone_mute_action","console: muteMic - on click of mute mic button");
        $('#id_mic_unmute').css('display', 'block');
        $('#id_mic_mute').css('display', 'none');
      } else {
        log("info","pexip_microphone_unmute_action","console: unmuteMic - on click of unmute mic button");
        $('#id_mic_mute').css('display', 'block');
        $('#id_mic_unmute').css('display', 'none');
      }
}