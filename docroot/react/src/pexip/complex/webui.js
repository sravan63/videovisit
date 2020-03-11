// **** WEBUI **** //
import { PexRTC } from './pexrtcV20.js';
import MediaService from '../../services/media-service.js';
import { MessageService } from '../../services/message-service.js'
import $ from 'jquery';
import BackendService from '../../services/backendService';
import GlobalConfig from '../../services/global.config';
import UtilityService from '../../services/utilities-service.js';

var video;
var flash;
var isMobileDevice = false;
var presentation = null;
var flash_button = null;
var bandwidth;
var conf_uri;
var pexipInitialConnect = false;
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
var cameraID;
var audioSource;
var isSetup;

var id_selfview;
var id_muteaudio;
var id_mutevideo;
var id_mutespeaker;
var id_fullscreen;
var id_screenshare;
var id_presentation;

var set_interval = "false";
var set_interval_callback;
var layout;
var media_stats;
var presenting_user = '';
var webuiLoaded = true;

var hostName = '';
var patientName = "";
var isValidInteraction = false;
var hostDirtyThisMeeting = false;
var currentLayout = "";
var mobileviewHeight;

var firstParticipantFlag = "";
var pexipParticipantsList = [];
var utilitiesTemp = {};
utilitiesTemp.msgQueue = [];
utilitiesTemp.msgInProgress = false;
var refreshingOrSelfJoinMeeting = true;
var disconnectAlreadyCalled = false;

var rtc = new PexRTC();

/* ~~~ PRESENTATION STUFF ~~~ */
export function presentationClosed() {
    if (presentation && $(presentation).find('#presvideo').length > 0) {
        rtc.stopPresentation();
    }
    presentation = null;
    MessageService.sendMessage(GlobalConfig.STOP_SCREENSHARE, null);
}

function remotePresentationClosed(reason) {
    if (presentation) {
        presentation.close();
        // TODO - Need to streamline this later, it's a hack for as of now
        if (getAppOS() == "iOS" && reason == "Failed to gather IP addresses") {
            return;
        }
        $(presentation).css('display', 'none');
        presentation = null;
    }
}

function checkForBlockedPopup() {
    if (!presentation || typeof presentation.innerHeight === "undefined" || (presentation.innerHeight === 0 && presentation.innerWidth === 0)) {
        // Popups blocked
        presentationClosed();
        flash_button = setInterval(function() {
            //id_presentation.classList.toggle('active');
        }, 1000);
    } else {
        if (flash_button) {
            clearInterval(flash_button);
            flash_button = null;
            //id_presentation.classList.remove('active');
        }
        if ($(presentation).find('#presvideo').length > 0) {
            rtc.getPresentation();
        } else {
            loadPresentation(presentationURL);
        }
    }
}

export function createPresentationWindow() {
    if (presentation == null) {
        MessageService.sendMessage(GlobalConfig.START_SCREENSHARE, null);
        presentation = document.getElementById('presentation-view');
        presentation.innerHTML = "<img src='' id='loadimage' /><div width='0px' height='0px' style='position:absolute;left:0;top:0;'><video id='presvideo' width='0px' autoplay='autoplay'/><img src='' id='presimage' width='0px'/></div>";
        // setTimeout(checkForBlockedPopup, 1000);
    }
}

function loadPresentation(url) {
    if (presentation && document.querySelectorAll('.presentation-view #loadimage')[0]) {
        document.querySelectorAll('.presentation-view #loadimage')[0].setAttribute('src', url);
        // setTimeout(resizePresentationWindow, 500);
    } else {
        presentationURL = url;
    }
}

export function resizePresentationWindow() {
    if (presentation != null && presentation.presimage.clientWidth > 640 && !userResized) {
        presWidth = presentation.presimage.clientWidth;
        presHeight = presentation.presimage.clientHeight;
        presentation.window.resizeTo(presWidth + (presentation.outerWidth - presentation.innerWidth), presHeight + (presentation.outerHeight - presentation.innerHeight));
    }
}

function loadPresentationStream(videoURL) {
    if (presentation && document.querySelectorAll('.presentation-view #loadimage')) {
        presentation.presvideo.poster = "";
        presentation.presvideo.src = videoURL;
        presentation.presvideo.setAttribute('src', videoURL);
    }
}

export function createPresentationStreamWindow() {
    //presentation-view
    if (presentation == null) {
        MessageService.sendMessage(GlobalConfig.START_SCREENSHARE, null);
        presentation = document.getElementById('presentation-view');
        mobileviewHeight = isMobileDevice ? '40vh' : '100%';
        presentation.innerHTML = "<img src='' id='loadimage' /><div width='0px' height='0px' style='position:absolute;left:0;top:0;'><video id='presvideo' width='0px' autoplay='autoplay'/><img src='' id='presimage' width='0px'/></div>";
        // setTimeout(checkForBlockedPopup, 1000);
    }
}

function presentationStartStop(setting, pres) {
    if (setting == true) {
        presenter = pres;
        if (presenting) {
            // Do Nothing
        } else if (source == 'screen') {
            rtc.disconnect();
        } else if (videoPresentation) {
            createPresentationStreamWindow();
        } else {
            createPresentationWindow();
        }
        presenting_user = pres.substring(pres.indexOf('<') + 1, pres.indexOf('>'));

        if (!refreshingOrSelfJoinMeeting && !isMobileDevice) {
            const data = {
                message: presenting_user + ' '+GlobalConfig.PRESENTATION_ON,
                name: presenting_user
            };
            MessageService.sendMessage(GlobalConfig.NOTIFY_USER, data);
        }
    } else {
        if (presentation != null) {
            MessageService.sendMessage(GlobalConfig.STOP_SCREENSHARE, null);
            presentation = null;
        }
        if (flash_button) {
            clearInterval(flash_button);
            flash_button = null;
        }
        if (!refreshingOrSelfJoinMeeting && !isMobileDevice && presenting_user) {
            const data = {
                message: presenting_user + ' '+GlobalConfig.PRESENTATION_OFF,
                name: presenting_user
            };
            MessageService.sendMessage(GlobalConfig.NOTIFY_USER, data);
        }
        presenting_user = '';
    }
}

export function togglePresentation() {
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

export function presentScreen() {
    log("info", "smd_initiate_action", "console: presentScreen - on click of share my desktop button");
    if (!presenting) {
        rtc.present('screen');
        presenting = true;
        $('#id_screenshare').css('display', 'none');
        $('#id_screen_unshare').css('display', 'block');
    } else {
        rtc.present(null);
        $('#id_screenshare').css('display', 'block');
        $('#id_screen_unshare').css('display', 'none');
    }
    if (!id_screenshare.classList.contains("inactive")) {
        if (!presenting) {
            id_screenshare.textContent = trans['BUTTON_STOPSHARE'];
            rtc.present('screen');
            presenting = true;
        } else {
            rtc.present(null);
        }
    }
}

export function stopSharing() {
    log("info", "smd_close_action", "event: stopSharing - disable share button");
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

/* ~~~ MUTE AND HOLD/RESUME ~~~ */

export function getControlReference(control) {
    var isLandscape = window.matchMedia("(orientation:landscape)").matches;
    var parent = isLandscape ? 'landscape-controlbar' : 'controls-bar';
    var dom = document.getElementsByClassName(parent)[0].getElementsByClassName('video-controls')[0];
    var children = dom.getElementsByClassName('icon-holder');
    var ref;
    for (var i = 0; i < children.length; i++) {
        var ele = children[i];
        if (ele.id == control) {
            ref = ele;
            break;
        }
    }
    return ref;
}

export function changeInOtherControls(control, bool, removedClass, addedClass) {

    var isLandscape = window.matchMedia("(orientation:landscape)").matches;
    var otherparent = (isLandscape) ? 'controls-bar' : 'landscape-controlbar';
    var dom = document.getElementsByClassName(otherparent)[0].getElementsByClassName('video-controls')[0];
    var children = dom.getElementsByClassName('icon-holder');
    var ref;
    for (var i = 0; i < children.length; i++) {
        var ele = children[i];
        if (ele.id == control) {
            ref = ele;
            break;
        }
    }
    if (!ref) {
        return;
    }

    if (bool) {
        ref.classList.remove(removedClass);
        ref.classList.add(addedClass);
    } else {
        ref.classList.remove(addedClass);
        ref.classList.add(removedClass);
    }
}

export function toggleSelfview() {
    console.log("toggleSelfview");

    if (!id_selfview.classList.contains("inactive")) {
        if (flash) {
            //flash.toggleSelfview();
            if (id_selfview.classList.contains('selected')) {
                flash.hideSelfview();
                id_selfview.classList.remove('selected');
                id_selfview.textContent = trans['BUTTON_SHOWSELF'];
            } else {
                flash.showSelfview();
                id_selfview.classList.add('selected');
                id_selfview.textContent = trans['BUTTON_HIDESELF'];
            }
        } else {
            selfview.hidden = !selfview.hidden;
            if (selfview.hidden) {
                id_selfview.textContent = trans['BUTTON_SHOWSELF'];
                id_selfview.classList.remove('selected');
                rosterlist.classList.remove('shorter');
            } else {
                id_selfview.textContent = trans['BUTTON_HIDESELF'];
                id_selfview.classList.add('selected');
                rosterlist.classList.add('shorter');
            }
        }
    }
}

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
}

/* ~~~ SETUP AND TEARDOWN ~~~ */

export function cleanup(event) {
    if (video) {
        video.src = "";
    }
    if (presentation) {
        //presentation.close();
        $(presentation).css('display', 'none');
        presentation = null;
    }
}

export function finalise(event) {
    log("info", "finalise", "console: inside webui finalise event :" + event);
    //console.log("inside webui finalise");
    rtc.disconnect();
    cleanup();
}

function remoteDisconnect(reason) {
    log("info", "remoteDisconnect", "console: inside remoteDisconnect reason :" + reason);
    cleanup();
    if (reason.indexOf("get access to camera") > -1) {
        $('#dialog-block-meeting-disconnected00').modal({ 'backdrop': 'static' });
    } else {
        if (reason == 'Test call finished') {
            MessageService.sendMessage(GlobalConfig.TEST_CALL_FINISHED, null);
        }
    }
    window.removeEventListener('beforeunload', finalise);
}

function handleError(reason) {
    log("error", "handleError", "event: inside handleError reason :" + reason);
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
    submitPinEntry();
}

export function submitPinEntry() {
    //maincontent.classList.remove("hidden");
    var Guestpin = localStorage.getItem('guestPin');
    pin = Guestpin;
    console.log("PIN is now " + pin);
    rtc.connect(pin);
    return false;
}

export function submitIVREntry() {
    var id_room = document.getElementById('id_room');
    ivrentry.classList.add("hidden");
    room = id_room.value;
    console.log("Target room is now " + room);
    rtc.connect(null, room);
    return false;
}

export function sipDialOut() {
    //console.log("SIP Dial Out");
    log("info", "sipDialOut", "console: sipDialOut - inside sipDialOut");
    var phone_num = $("#phone_num").val();
    log("info", "sipDialOut", "event: sipDialOut - inside sipDialOut phone_num: " + phone_num);
    //console.log("phone_num: " +phone_num);

    if (isProvider == "true") {
        $.ajax({
            type: "POST",
            url: VIDEO_VISITS.Path.grid.meeting.vendorDialOut,
            cache: false,
            async: true,
            data: phone_num,
            success: function(returndata) {
                alert("success - work in progress");
                log('info', 'sipDialOut', 'sipDialOut success');
            },
            error: function() {
                // display error message
                log('error', 'sipDialOut', 'sipDialOut failed');
                alert("error");
            }
        });
    } else {
        alert("coming soon...");
    }
}

function participantCreated(participant) {
    // CALL BACK WHEN A PARTICIPANT JOINS THE MEETING
    pexipParticipantsList.push(participant);
    log("info", "participantCreated", "console: participantCreated - inside participantCreated - participant:" + participant);
    toggleWaitingRoom(pexipParticipantsList);


    if (participant.protocol == "sip") {
        var joinParticipantMsg = {
            message : participant.display_name + " "+GlobalConfig.JOINED_VISIT,
            name: participant.display_name
        };
        if(!refreshingOrSelfJoinMeeting){
            MessageService.sendMessage(GlobalConfig.NOTIFY_USER, joinParticipantMsg);
        }

        MessageService.sendMessage(GlobalConfig.USER_JOINED, participant);

    } else {
        var joinParticipantMsg = {
            message : participant.display_name + " "+GlobalConfig.JOINED_VISIT,
            name: participant.display_name
        };
        
        if(!refreshingOrSelfJoinMeeting){
            MessageService.sendMessage(GlobalConfig.NOTIFY_USER, joinParticipantMsg);
        }

        var udata = JSON.parse(UtilityService.decrypt(localStorage.getItem('userDetails')));
        var memberName = udata.lastName +', '+ udata.firstName;
        if(participant.display_name.toLowerCase() != memberName.toLowerCase() && !localStorage.getItem('isGuest')){
            MessageService.sendMessage(GlobalConfig.USER_JOINED, participant);
        }

        toggleWaitingRoom(pexipParticipantsList);
    }
}

function participantUpdated(participant) {
    // CALL BACK WHEN A PARTICIPANT JOINS THE MEETING
    pexipParticipantsList.push(participant);

}

function participantDeleted(participant) {
    // CALL BACK WHEN A PARTICIPANT LEAVES THE MEETING
    log("info", "participantDeleted", "console: participantDeleted - inside participantDeleted - participant:" + participant);
    if (isMobileDevice) {
        updateParticipantList(participant, 'left');
        console.log("inside participantDeleted");
    } else {
        var removingParticipant = pexipParticipantsList.filter(function(user) {
            return user.uuid == participant.uuid;
        });
        pexipParticipantsList = pexipParticipantsList.filter(function(user) {
            return user.uuid != participant.uuid;
        });
        if(!refreshingOrSelfJoinMeeting){
            var participantMsg = {
                message : removingParticipant[0].display_name + " "+GlobalConfig.LEFT_VISIT,
                name: removingParticipant[0].display_name
            };
            MessageService.sendMessage(GlobalConfig.NOTIFY_USER, participantMsg);
        }
        //VideoVisit.checkAndShowParticipantAvailableState(pexipParticipantsList, 'pexip');
        var udata = JSON.parse(UtilityService.decrypt(localStorage.getItem('userDetails')));
        var memberName = udata.lastName +', '+ udata.firstName;
        if( removingParticipant[0].display_name != memberName && !localStorage.getItem('isGuest')){
           MessageService.sendMessage(GlobalConfig.USER_LEFT, participant);
        }
        toggleWaitingRoom(pexipParticipantsList);
    }
}

function layoutUpdate(view) {
    log("info", "layoutUpdate", "console: layoutUpdate - inside layoutUpdate - view:" + view.view);

    switch (view.view) {
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

export function getMediaStats() {
    log("info", "getMediaStats", "console: getMediaStats - inside getMediaStats");
    //console.log("inside getMediaStats");

    if (set_interval == "false") {
        set_interval = "true";

        set_interval_callback = setInterval(function() {
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

    } else if (set_interval == "true") {
        console.log("Stop Info");
        set_interval = "false";
        $("#stat-window-container").toggle();
        $("#info-button").css("background", "#555");
        clearInterval(set_interval_callback);
    }
}

function connected(url) {
    log("info", "connected", "event: connected - inside connected");
    setTimeout(function() {
        refreshingOrSelfJoinMeeting = false;
    }, 5000);
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
        }
    }
    var isSetup = localStorage.getItem('isSetupPage');
    if (isSetup == null) {
        var meetingId = JSON.parse(localStorage.getItem('meetingId'));
            var isProxyMeeting = JSON.parse(localStorage.getItem('isProxyMeeting'));
            var udata = JSON.parse(UtilityService.decrypt(localStorage.getItem('userDetails')));
            var memberName;
            if(isProxyMeeting == 'Y'){
                memberName = udata.lastName +','+ udata.firstName;                
            }else{
                memberName = JSON.parse(localStorage.getItem('memberName'));
            }            
           if (localStorage.getItem('isGuest')) {
            var meetingCode= udata.meetingCode;
              BackendService.CaregiverJoinMeeting(meetingId, meetingCode);  
            }  
            else{
              BackendService.setConferenceStatus(meetingId, memberName, isProxyMeeting);
            }
    }
}

export function setPatientGuestPresenceIndicatorManually() {
    if ($('#isMember').val()) {
        for (var i = 0; i < sidePaneMeetingDetails.sortedParticipantsList.length; i++) {
            if ($('#guestName').val() == sidePaneMeetingDetails.sortedParticipantsList[i].inMeetingDisplayName) {
                $('.guest-part-' + i + ' .participant-indicator').css('visibility', 'visible');
            }
        }
    }
}

export function switchDevices(constrain, device = null) {
    if(constrain == 'video'){
        rtc.video_source = device;
    }
    rtc.renegotiate();
}

export function initialise(confnode, conf, userbw, username, userpin, req_source, flash_obj) {
    console.log("inside webui initialise");
    log('info', 'initialise', "event: video visit initialise");

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
    var camID = [];
    if (localStorage.getItem('selectedPeripherals')) {
        var peripherals = JSON.parse(localStorage.getItem('selectedPeripherals'));
        cameraID = peripherals.videoSource.deviceId;
        //audioSource = peripherals.audioSource.deviceId;
    } else {
        MediaService.loadDeviceMediaData();
        this.subscription = MessageService.getMessage().subscribe((message, data) => {
            if (message.text == GlobalConfig.MEDIA_DATA_READY) {
                this.list = message.data;
                cameraID = this.list.videoinput[0].deviceId;
                //audioSource = this.list.audiooutput[0].deviceId;
            }
        });
    }
    rtc.video_source = cameraID; //cameraID
    // rtc.audio_source =  audioSource;    //microPhoneID

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
    /*if (isMobileDevice) {
    rtc.turn_server = getTurnServerObjsForMobile();
} else {
    if (sidePaneMeetingDetails.vendorConfig && sidePaneMeetingDetails.vendorConfig.turnServers) {
        rtc.turn_server = getTurnServersObjs();
    }
}*/
    rtc.makeCall(confnode, conference, name, bandwidth, source, flash);
}

export function getTurnServersObjs() {
    var t_servers = [];
    if (typeof sidePaneMeetingDetails.vendorConfig.turnServers == 'string') {
        t_servers.push({
            url: 'turn:' + sidePaneMeetingDetails.vendorConfig.turnServers + '?transport=tcp',
            username: sidePaneMeetingDetails.vendorConfig.turnUserName,
            credential: sidePaneMeetingDetails.vendorConfig.turnPassword
        });
    } else {
        for (let i = 0; i < sidePaneMeetingDetails.vendorConfig.turnServers.length; i++) {
            t_servers.push({
                url: 'turn:' + sidePaneMeetingDetails.vendorConfig.turnServers[i] + '?transport=tcp',
                username: sidePaneMeetingDetails.vendorConfig.turnUserName,
                credential: sidePaneMeetingDetails.vendorConfig.turnPassword
            });
        }
    }
    return t_servers;
}

export function getTurnServerObjsForMobile() {
    var t_servers = [];
    if ($('#turnServers').val()) {
        var servers = $('#turnServers').val().replace('[', '').replace(']', '').split(',');
        for (let i = 0; i < servers.length; i++) {
            t_servers.push({
                url: 'turn:' + servers[i].trim() + '?transport=tcp',
                username: $('#turnUserName').val().trim(),
                credential: $('#turnPassword').val().trim()
            });
        }
    }
    return t_servers;
}

export function pexipDisconnect() {
    rtc.disconnect();
}

export function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

export function hostInMeeting(element, index, array) {
    return element.role == GlobalConfig.CHAIR_ROLE;
}

export function toggleWaitingRoom(pexipParticipantsList) {
    var isHostAvail = pexipParticipantsList.some(hostInMeeting);
    var participants = pexipParticipantsList.map(a => a.uuid);
    var participantsInMeeting = participants.filter(onlyUnique);
    if (!hostDirtyThisMeeting && isHostAvail) {
        hostDirtyThisMeeting = true;
    }
    if (isHostAvail) {
        MessageService.sendMessage(GlobalConfig.HOST_AVAIL, null);
    } else {
        if (participantsInMeeting.length == 1) {
            MessageService.sendMessage(GlobalConfig.HOST_LEFT, null);
        } else if (participantsInMeeting.length > 1) {
            if (hostDirtyThisMeeting) {
                //Half waiting room
                MessageService.sendMessage(GlobalConfig.HAS_MORE_PARTICIPANTS, null);
            } else {
                // Full waiting room
                MessageService.sendMessage(GlobalConfig.HOST_LEFT, null);
            }
        }
    }
    if (hostDirtyThisMeeting) {
        adjustLayout(participantsInMeeting, isHostAvail);
    }
}

export function adjustLayout(participants, isHostAvail) {
    var totalPartcicipants = participants.length;
    var view = "";
    if (isHostAvail) {
        if (totalPartcicipants == 2) {
            view = "1:0";
        } else if (totalPartcicipants > 2) {
            view = "1:7";
        }
    } else {
        if (totalPartcicipants > 1) {
            view = "4:0";
        } else {
            view = "1:0";
        }
    }
    if (currentLayout != view) {
        rtc.transformLayout({ "layout": view });
    }
}

export function disconnectOnRefresh() {
    log("info", 'disconnectOnRefresh', "event: Refresh::click - disconnectOnRefresh before calling navigateToPage if disconnected completely : ");
    console.log("inside disconnect");
    disconnectAlreadyCalled = true;
    var guestName = $("#guestName").val();
    var patientName = $("#meetingPatient").val();
    if (guestName.toLowerCase() == patientName.toLowerCase()) {
        isPatientLoggedIn = true;
    } else {
        isPatientLoggedIn = false;
    }
    var userData = {
        inMeetingDisplayName: $("#guestName").val(),
        isPatient: isPatientLoggedIn,
        joinLeaveMeeting: "L",
        meetingId: $('#meetingId').val()
    };
    $.ajax({
        type: "POST",
        url: 'joinLeaveMeeting.json', // VIDEO_VISITS.Path.visit.joinLeaveMeeting,
        cache: false,
        dataType: "json",
        data: userData,
        success: function(result, textStatus) {
            log("info", "joinLeaveMeeting", "console: joinLeaveMeeting:: result - : " + result);
        },
        error: function(textStatus) {
            log("error", "joinLeaveMeeting", "console: joinLeaveMeeting:: error - : " + textStatus);
        }
    });
}

export function leaveFromMeeting() {
    log("info", "leaveFromMeeting", "console: leaveFromMeeting");
    disconnectOnRefresh();
}

export var log = function(type, param, msg) {
    switch (type) {
        case 'info':
            if (useConsoleForLogging) {
                if (msg) {
                    console.log(msg);
                } else {
                    console.log(param);
                }
            }
            if (useAlertsForLogging) {
                if (msg) {
                    alert(msg);
                } else {
                    alert(param);
                }
            }
            if (msg) {
                if (msg.toLowerCase().indexOf("event") > -1) {
                    var data = {},
                        meetingId,
                        userType, userId;
                    if (localStorage.getItem('vendorDetails')) {
                        data = JSON.parse(localStorage.getItem('vendorDetails')),
                            meetingId = data.meetingId ? data.meetingId : '',
                            userType = data.userType ? data.userType : '',
                            userId = data.userId ? data.userId : '';

                        var params = [type, param, msg, meetingId, userType, userId];
                        var isSetup = localStorage.getItem('isSetupPage');
                        if (isSetup == null) {
                            BackendService.logVendorMeetingEvents(params);
                        }
                    }
                    //VideoVisit.logVendorMeetingEvents(params);
                }
            }
            break;
        case 'error':
            // Notify error to backed
            var params = [type, param, msg];
            //VideoVisit.logVendorMeetingEvents(params);
            console.error('WebRTC ERROR :: ' + param + ' :: ' + msg);
            break;
    }
};

export function muteSpeaker() {
    var video = document.getElementById("video");
    if (video.muted) {
        log("info", "speaker_unmute_action", "event: muteSpeaker - on click of mute speaker button");
        video.muted = false;
    } else {
        log("info", "speaker_mute_action", "event: unmuteSpeaker - on click of unmute speaker button");
        video.muted = true;
    }
}

export function muteUnmuteVideo() {
    let muteVideo = rtc.muteVideo();
    if (muteVideo) {
        log("info", "video_mute_action", "event: muteVideo - on click of mute video button");
    } else {
        log("info", "video_unmute_action", "event: unmuteVideo - on click of unmute video  button");        
    }
}


export function muteUnmuteMic() {
    let muteAudio = rtc.muteAudio();
    if (muteAudio) {
        log("info", "microphone_mute_action", "event: muteMic - on click of mute mic button");
    } else {
        log("info", "microphone_unmute_action", "event: unmuteMic - on click of unmute mic button");
    }
}