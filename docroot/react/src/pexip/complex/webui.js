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
var deniedPermission = false;

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
var userDetails = { uuid: null };
var connectionRefused = false;
var loggedInUserName;

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
        //presentation.close();
        // TODO - Need to streamline this later, it's a hack for as of now
        if (UtilityService.getAppOS() == "iOS" && reason == "Failed to gather IP addresses") {
            return;
        }
        MessageService.sendMessage(GlobalConfig.STOP_SCREENSHARE, null);
        //$(presentation).css('display', 'none');
        presentation = null;
    }
}

function checkForBlockedPopup() {
    if (!presentation) {
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
        presentation.innerHTML = "<img src='' id='loadimage' /><div width='0px' height='0px' style='position:absolute;left:0;top:0;right:0;'><video id='presvideo' width='0px' autoplay='autoplay'/><img src='' id='presimage' width='0px'/></div>";
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
    if (presentation && $(presentation).find('#presvideo').length>0) {
        $('.presentation-view').find('#presvideo')[0].srcObject = videoURL;
    }
}

export function createPresentationStreamWindow() {
    //presentation-view
    if (!presentation) {
        MessageService.sendMessage(GlobalConfig.START_SCREENSHARE, null);
        //$('.presentation-view').css('display','flex');
        setTimeout(checkForBlockedPopup, 1000);
        //presentation = document.getElementById('presentation-view');
        mobileviewHeight = isMobileDevice ? '40vh' : '100%';
        presentation = $('.presentation-view');
        $('.presentation-view').html("<img src='' id='loadimage' style='position:absolute;left:0;top:0;display:none;height:100%;width:100%;z-index:5;object-fit: contain;' /><div width='0px' height='0px' style='position:absolute;left:0;top:0;right:0;'><video id='presvideo' width='100%' height='100%' autoPlay='autoplay' playsInline='playsinline'/><img src='' id='presimage' width='0px'/></div>");

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
    //log("info", "smd_initiate_action", "console: presentScreen - on click of share my desktop button");
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
    //log("info", "smd_close_action", "event: stopSharing - disable share button");
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
            rtc.getPresentation();
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
    log("info", "conference_page_closed", "event: Closing video conference page and redirecting to visits page");
    //console.log("inside webui finalise");
    rtc.disconnect();
    cleanup();
}

function remoteDisconnect(reason) {
    log("info","conference_page_remote_disconnect","event: Disconnecting the conference, reason :" + reason);
    cleanup();
    if (reason.indexOf("get access to camera") > -1) {
        MessageService.sendMessage(GlobalConfig.LEAVE_VISIT, null);
        alert(reason);
    }else if(reason.indexOf("Disconnected by another participant") > -1){
        $(".leave-button").trigger("click");
        sessionStorage.setItem('isHostKicked',true);
    } else {
        if (reason == 'Test call finished') {
            MessageService.sendMessage(GlobalConfig.TEST_CALL_FINISHED, null);
        } else if( reason.indexOf("Out of transcoding resource") > -1 ){
            MessageService.sendMessage(GlobalConfig.LEAVE_VISIT, null);
            alert('Video visit failed, please try again.');
        }
    }
    window.removeEventListener('beforeunload', finalise);
}

function handleError(reason) {
    log("error","connection_failed_pexip","event: connection failed from pexip, reason :" + reason);
    MessageService.sendMessage(GlobalConfig.HIDE_LOADER, 'true');
    var isTimeOutError = rtc.error == "Timeout sending request: request_token" || reason == "Call Failed: Invalid token"; // || rtc.error == "Error sending request: calls";
    if( isTimeOutError ) {
        if(rtc.refreshTokenProperties.retryTimer){
            clearInterval(rtc.refreshTokenProperties.retryTimer);
            rtc.refreshTokenProperties.retryTimer = null;
        }
        MessageService.sendMessage(GlobalConfig.OPEN_MODAL, { 
            heading: 'Unable to join', 
            message : 'Please try again. (ID: token)',
            controls : [{label: 'OK', type: 'leave'} ]
        });
    } else if( rtc.error == "Timeout sending request: refresh_token" || rtc.error == "Error sending request: refresh_token") {
        if(!rtc.refreshTokenProperties.retryTimer){
            rtc.refreshTokenProperties.retryTimer = setInterval(rtc.refreshToken.bind(this), (rtc.refreshTokenProperties.retries * 1000));
        }
    } else if(rtc.error == 'NotAllowedError') {
        let isSetup = sessionStorage.getItem('isSetupPage');
        let isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        if(isChrome || isSetup) {
            if (!deniedPermission) {
                deniedPermission = true;
                MessageService.sendMessage(GlobalConfig.MEDIA_PERMISSION, 'denied');
            }
        }
    } else {
        if (video && !selfvideo.src && new Date() - startTime > 30000) {
            reason = "WebSocket connection error.";
        }
        remoteDisconnect(reason);
    }
}

function doneSetup(url, pin_status, conference_extension) {
    log("info", "ready_to_connect", "event: User is ready to join the conference.");
    var isSetupPage = localStorage.getItem('isSetupPage');
    if(isSetupPage){
        MessageService.sendMessage(GlobalConfig.CLOSE_MODAL_AUTOMATICALLY, null);
    }
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
    log("info", "enterPin_to_join_conference_room", "event: Passing pin to join the conference.");
    var Guestpin = localStorage.getItem('guestPin');
    pin = Guestpin;
    // console.log("PIN is now " + pin);
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
}

// vmr: meetingVendorId and arg conatins any value passed by consumer
export function sendChatContent(vmr, arg) {
    let loggedInUserUUID= sessionStorage.getItem("UUID");
    let cmdArgs= {aspectMode: getAspectMode()};

    if(loggedInUserUUID) {
        let chatContent= {
            aspectMode: cmdArgs.aspectMode, 
            chatCmd: "selfAspectMode", 
            chatVersion: "0.9.0", 
            clientID: "VideoVisits", 
            cmd: "selfAspectMode", 
            cmdArgs, 
            fromUUID: loggedInUserUUID, 
            toUUID: loggedInUserUUID, 
            vmr
        };

        rtc.sendChatMessage(JSON.stringify(chatContent));
    }
}

function getAspectMode() {
    if(window.matchMedia("(orientation: portrait)").matches) {
        return "portrait";
    }
    else if(window.matchMedia("(orientation: landscape)").matches){
        return "landscape";
    }
    return null;
}

function participantCreated(participant) {
    // CALL BACK WHEN A PARTICIPANT JOINS THE MEETING
    log("info","participant_joined","event: participant joined the visit - participant:" +participant.uuid);
    var uniqueKey = '';
    if(participant.display_name.indexOf('#') > -1){
        uniqueKey = participant.display_name.split('#')[1];
        participant.display_name = participant.display_name.split('#')[0];
    }
    if (participant.protocol == "api" && participant.display_name.indexOf('TPLC') > -1){ 
        return;
    }
    pexipParticipantsList.push(participant);
    // log("info", "participantCreated", "event: participantCreated - inside participantCreated - participant:" + participant);
    
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
        if(!refreshingOrSelfJoinMeeting){
            var joinParticipantMsg = {
                message : participant.display_name + " "+GlobalConfig.JOINED_VISIT,
                name: participant.display_name
            };
            MessageService.sendMessage(GlobalConfig.NOTIFY_USER, joinParticipantMsg);
        }
        MessageService.sendMessage(GlobalConfig.USER_JOINED, participant);
    }
    var loginUserName,
        isProxyMeeting = JSON.parse(localStorage.getItem('isProxyMeeting')),
        userData = JSON.parse(UtilityService.decrypt(localStorage.getItem('userDetails')));

    if(isProxyMeeting == 'Y'){
        loginUserName = userData.lastName +', '+ userData.firstName;
    } else {
        loginUserName = JSON.parse(localStorage.getItem('memberName'));
    }
    if (loginUserName.toLowerCase().trim() === participant.display_name.toLowerCase().trim() && !sessionStorage.getItem('UUID')) {
        // var isLoggedInUser = validateLoggedInUser(participant.start_time);
        // if(isLoggedInUser) {
            userDetails = participant;
            console.log('=====> SETTING UUID :: '+participant.uuid);
            sessionStorage.setItem('UUID',participant.uuid);
        // }
    }
    loggedInUserName = loginUserName;
    toggleWaitingRoom(pexipParticipantsList);
    
    if(UtilityService.isMobileDevice()) {
        sendChatContent(conference);
    }
}

export function validateLoggedInUser(uniqueKey){
    var bool = false;
    if( sessionStorage.getItem('uKey') && uniqueKey ){
        var uKey = sessionStorage.getItem('uKey');
        bool = (uKey == uniqueKey);
    }
    return bool;
}

function participantUpdated(participant) {
    if (participant.protocol == "api" && participant.display_name.indexOf('TPLC') > -1){ 
        return;
    }
    // CALL BACK WHEN A PARTICIPANT JOINS THE MEETING
    if(participant.spotlight != 0 && participant.protocol !='sip'){
        MessageService.sendMessage(GlobalConfig.SPOTLIGHT,participant);
    }
    else if(participant.protocol !='sip'){
        MessageService.sendMessage(GlobalConfig.UNSPOTLIGHT,participant);
    }
    else if(participant.spotlight != 0 && participant.display_name.toLowerCase().indexOf('interpreter') > -1){
        MessageService.sendMessage(GlobalConfig.SPOTLIGHT,participant);
    }
    else if(participant.spotlight == 0 && participant.display_name.toLowerCase().indexOf('interpreter') > -1){
        MessageService.sendMessage(GlobalConfig.UNSPOTLIGHT,participant);
    }
    pexipParticipantsList.push(participant);

}

function participantDeleted(participant) {
    // CALL BACK WHEN A PARTICIPANT LEAVES THE MEETING
    log("info","participant_left","event: participant left the visit - participant:" +participant.uuid);
    if (isMobileDevice) {
        updateParticipantList(participant, 'left');
        console.log("inside participantDeleted");
        sendChatContent(conference);
    } else {
        var removingParticipant = pexipParticipantsList.filter(function(user) {
            return user.uuid == participant.uuid;
        });
        pexipParticipantsList = pexipParticipantsList.filter(function(user) {
            return user.uuid != participant.uuid;
        });
        if(!refreshingOrSelfJoinMeeting){
            if (removingParticipant[0].protocol == "api" && removingParticipant[0].display_name.indexOf('TPLC') > -1){ 
                return;
            }
            var participantMsg = {
                message : removingParticipant[0].display_name + " "+GlobalConfig.LEFT_VISIT,
                name: removingParticipant[0].display_name
            };
            MessageService.sendMessage(GlobalConfig.NOTIFY_USER, participantMsg);
        }

        MessageService.sendMessage(GlobalConfig.USER_LEFT, participant);

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
    if(pexipInitialConnect==false){
        if (isSetup == null) {
            var isMobile = UtilityService.isMobileDevice();
            log("info","conference_connected","event: joined conference successfully.");
            //MessageService.sendMessage(GlobalConfig.CLOSE_MODAL_AUTOMATICALLY, null);
            MessageService.sendMessage(GlobalConfig.RENDER_VIDEO_DOM, 'conference');
            var isDirectLaunch = localStorage.getItem('isDirectLaunch');
            var meetingId = JSON.parse(localStorage.getItem('meetingId'));
            var isProxyMeeting = JSON.parse(localStorage.getItem('isProxyMeeting'));
            var udata = JSON.parse(UtilityService.decrypt(localStorage.getItem('userDetails')));
            var isInstantJoin = sessionStorage.getItem('isInstantJoin');
            var isECInstantJoin = sessionStorage.getItem('isECInstantJoin');
            var mrn = udata.mrn;
            var inMeetingDisplayName = JSON.parse(localStorage.getItem('memberName'));
            var inAppAccess = UtilityService.getInAppAccessFlag();
            if(isDirectLaunch || inAppAccess){
                JoinLeaveMobileCall("J");
            }
            else {
                const JLData = {meetingId: meetingId,inMeetingDisplayName: inMeetingDisplayName,isProxyMeeting: isProxyMeeting,isMobile: isMobile,mrn: mrn, type:'J'}
                MessageService.sendMessage(GlobalConfig.SEND_JOIN_LEAVE_STATUS, JLData);
                var memberName;
                if(isProxyMeeting == 'Y'){
                    memberName = udata.lastName +', '+ udata.firstName;                
                } else {
                    memberName = JSON.parse(localStorage.getItem('memberName'));
                }            
               if( localStorage.getItem('isGuest') || sessionStorage.getItem('isInstantPG') ) {
                    var meetingCode = udata.meetingCode;
                   BackendService.CaregiverJoinMeeting(meetingId, meetingCode);
                } else {
                    BackendService.setConferenceStatus(meetingId, memberName, isProxyMeeting);
                }
            }
            let data = {
                meetingId: meetingId,
                memberName: memberName
            };
            let isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
            if(isChrome) {
                MessageService.sendMessage(GlobalConfig.MEDIA_STATS_DATA, data);
            }
            pexipInitialConnect=true;
        }
    }
}

export function getMediaStatsData(){
    let mediaStatsData =  rtc.getMediaStatistics();
    return mediaStatsData;
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

export function switchDevices(constrain, device = null,type) {
    log("info", type+"_"+constrain+"_peripheral_change_action", "event: peripherals"+constrain+"Change - on changing the peripheral dropdown to :: " + device.label);
    if(constrain == 'camera'){
        rtc.video_source = device.deviceId;
    } else if(constrain == 'microphone'){
        rtc.audio_source = device.deviceId;
    }
    rtc.renegotiate();
    log("info","pexip_renegotiate_called","event: Pexip renegotiate function is invoked");
}

export function initialise(confnode, conf, userbw, username, userpin, req_source, flash_obj, config) {
    console.log("inside webui initialise");
    log('info', 'initialize_pexip_call', "event: video visit initialise");

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
    var isSetupPage = localStorage.getItem('isSetupPage');
    if (localStorage.getItem('selectedPeripherals')) {
        var peripherals = JSON.parse(localStorage.getItem('selectedPeripherals'));
        cameraID = peripherals.videoSource.deviceId;
        if(isSetupPage){
        audioSource = peripherals.micSource.deviceId;
        }
        if(peripherals.audioSource == null || peripherals.audioSource == ''){
            peripherals.audioSource = '';
        }
        log('info', 'initialise_peripherals', "event: video visit peripherals :: Camera - " + peripherals.videoSource.label + " Speaker - " + peripherals.audioSource == null ? "" : peripherals.audioSource.label + " Microphone - " + peripherals.micSource.label );
    } 
    var browserInfo = UtilityService.getBrowserInformation();
    if(UtilityService.isMobileDevice() && browserInfo.isFireFox){
        var isRear = peripherals.videoSource.label.toLowerCase().indexOf('back') > -1 || peripherals.videoSource.label.toLowerCase().indexOf('rear') > -1;  
        MessageService.sendMessage(GlobalConfig.CAMERA_FLIP, !isRear);
    }
    rtc.video_source = cameraID; //cameraID
    if(isSetupPage){
    rtc.audio_source =  audioSource;  //microPhoneID
    }

    window.addEventListener('beforeunload', finalise);

    if(config){
    rtc.requestTimeout = config.clientAPI ? config.clientAPI.reqTokenTimeOut * 1000 : 60000;
    rtc.refreshTokenProperties = {
        timeout : config.clientAPI ? config.clientAPI.refTokenTimeOut * 1000 : 60000,
        interval : config.clientAPI ? config.clientAPI.refDefaultInterval : 120,
        retries : config.clientAPI ? Number(config.clientAPI.refRetryInterval) : 2,
        retryTimer : null
    };
    }
    rtc.onSetup = doneSetup;
    rtc.onConnect = connected;
    rtc.onError = handleError;
    rtc.onDisconnect = remoteDisconnect;
    rtc.onHoldResume = holdresume;
    rtc.onRosterList = updateRosterList;
    rtc.onPresentation = presentationStartStop;
    //rtc.onPresentationReload = loadPresentation;
    rtc.onScreenshareStopped = unpresentScreen;
    rtc.onPresentationConnected = loadPresentationStream;
    rtc.onPresentationDisconnected = remotePresentationClosed;
    rtc.onParticipantCreate = participantCreated;
    rtc.onParticipantUpdate = participantUpdated;
    rtc.onParticipantDelete = participantDeleted;
    rtc.onLayoutUpdate = layoutUpdate;
    rtc.onTrace = traceHandler;
    rtc.onIceFailure = setTurnServer;
    rtc.onChatMessage = chatReceived;
    rtc.onStageUpdate = StageUpdated;
    conference = conf;
    console.log("Conference: " + conference);

    startTime = new Date();

    var turnServerDetails = JSON.parse(sessionStorage.getItem('turnServer'));
    rtc.turn_server = getTurnServersObjs(turnServerDetails);
    /*if (isMobileDevice) {
        rtc.turn_server = getTurnServerObjsForMobile();
    } else {
        if (sidePaneMeetingDetails.vendorConfig && sidePaneMeetingDetails.vendorConfig.turnServers) {
            rtc.turn_server = getTurnServersObjs();
        }
    }*/
    
    // name += '#'+uniqueKey; // Mama, Joe#12345667
    rtc.makeCall(confnode, conference, name, bandwidth, source, flash);
}

function traceHandler(info){
    switch(info) {
        case GlobalConfig.ICE_GATHERING_COMPLETE:
            log("info","IceGatheringCompleted","event: Callback after ice gathering established");
            var browserInfo = UtilityService.getBrowserInformation();
            var os = UtilityService.getAppOS();
            var isIOS = os == 'iOS' ? true : false;
            if( isIOS && browserInfo.isSafari && UtilityService.isMobileDevice()){
                MessageService.sendMessage(GlobalConfig.ENABLE_IOS_CAM, null);
            }
            break;

        case GlobalConfig.NETWORK_CONNECTION_SUCCESS:
            log("info","NetworkEstablished","event: Callback after network established");
            MessageService.sendMessage(GlobalConfig.CLOSE_INFO_MODAL, null);
            break;
_
        case GlobalConfig.NETWORK_RECONNECTING:
            log("info","Reconnecting","event: Reconnecting to the network");
            let data = UtilityService.getLang();
            MessageService.sendMessage(GlobalConfig.OPEN_INFO_MODAL, { text: data.conference.ReconnectMsg, loader: true });
            break;

        case GlobalConfig.FAILED_MID_WAY:
            log("info","IceConnectionDisconnected","event: ICE Disconnected mid-call; triggering ICE restart.");
            connectionRefused = true;
            break;

        case GlobalConfig.CALL_CONNECTED:
            log("info","IceConnectionConnected","event: Ice Connection State connected");
            connectionRefused = false;
            break;

        case GlobalConfig.CALL_DISCONNECTED:
            // Check for the ice connection status and throw ice connection disconnected error here.
            if( connectionRefused == true ) {
                log("error","ConnectionFailed","event: connection failed, reason : Disconnected while gathering IP addresses");
                const eTitle = UtilityService.isMobileDevice() ? 'Refresh Page' : "Can't establish network connection";
                const eMessage = UtilityService.isMobileDevice() ? 'Unable to establish a network connection. If problem persists, switch to a cellular connection and refresh.' : 'Rejoin your visit or use your mobile device with an LTE connection.';
                MessageService.sendMessage(GlobalConfig.CLOSE_INFO_MODAL, null);
                MessageService.sendMessage(GlobalConfig.OPEN_MODAL, { 
                    heading: eTitle, message : eMessage, controls : [{label: 'OK', type: 'leave'} ]
                });
            }
            break;
    }
}

function setTurnServer(){
    log("info","ice_connection_failed","event: Failed to gather ice connection.");
    //var turnServerDetails = JSON.parse(sessionStorage.getItem('turnServer'));
    //rtc.turn_server = getTurnServersObjs(turnServerDetails);
}

function getTurnServersObjs(turnServerDetails) {
    var t_servers = [];
    if (typeof turnServerDetails.turnServers == 'string') {
        t_servers.push({
            url: 'turn:' + turnServerDetails.turnServers + '?transport=tcp',
            username: turnServerDetails.turnUserName,
            credential: turnServerDetails.turnPassword
        });
    } else {
        for (let i = 0; i < turnServerDetails.turnServers.length; i++) {
            t_servers.push({
                url: 'turn:' + turnServerDetails.turnServers[i] + '?transport=tcp',
                username: turnServerDetails.turnUserName,
                credential: turnServerDetails.turnPassword
            });
        }
    }
    return t_servers;
}

function chatReceived(message) {
    if(message.payload) {
        if(typeof message.payload === 'string' && message.payload.indexOf("cmdArgs") !== -1) {
            let chatContent = JSON.parse(message.payload);
            if(chatContent.cmdArgs.aspectMode) {
                MessageService.sendMessage(GlobalConfig.SELF_ASPECT_MODE, {uuid: chatContent.fromUUID, aspectMode: chatContent.cmdArgs.aspectMode});
            }
        }
        if(message.payload.indexOf(GlobalConfig.GENERIC_VISIT) > -1){
            var gHData = message.payload.split('$')[1];
            var genericHost = JSON.parse(gHData);
            MessageService.sendMessage(GlobalConfig.UPDATE_HOST_DETAILS_IN_GENERICVISIT, genericHost);
        }
        if(message.payload.indexOf(GlobalConfig.DUPLICATE_NAME) > -1) {
            // Received text format DUPLICATE_MEMBER#DUPLICATE_ARRAY_LIST
            var mData = message.payload.split('#');
            var duplicateList = JSON.parse(mData[1]);
            var userUUID = sessionStorage.getItem('UUID');
            var isDuplicateUser = false;
            var loggedInAs = '';
            log("info", 'DuplicateMemberInVisit', "event: DuplicateMembersJoined - Total duplicate members in visit "+duplicateList.length);
            duplicateList.map((u)=>{
                var dName = u.name; // mama, joe 2
                var uuid = u.uuid;
                // Update duplicate names in the participants list.
                if( uuid == userUUID ) {
                    isDuplicateUser = true;
                    loggedInAs = dName.trim();
                } else {
                    pexipParticipantsList.map((p)=>{
                        if( p.uuid == uuid ) {
                            p.display_name = dName;
                            MessageService.sendMessage(GlobalConfig.UPDATE_DUPLICATE_MEMBERS_TO_SIDEBAR, {uuid:uuid, name:dName});
                        }
                    });
                }
            });
            if( isDuplicateUser ){
                localStorage.setItem('memberName', JSON.stringify(loggedInAs));
                sessionStorage.setItem('loggedAsDuplicateMember', true);
                // Extracting actual patient name.
                var patientName = loggedInAs.slice(0, -1).trim();
                // Append actual patient to side bar.
                pexipParticipantsList.map((p)=>{
                    if( p.display_name.toLowerCase().trim() == patientName.toLowerCase().trim() ){
                        MessageService.sendMessage(GlobalConfig.UPDATE_DUPLICATE_MEMBERS_TO_SIDEBAR, {uuid:p.uuid, name:patientName});
                    }
                });
            }
        }
    }
}

export function formatDuplicateNames(dName){
    let lName = dName.split(',')[0].trim();
    let fName = dName.split(',')[1].trim();
    let userCount = fName.split(' ')[1].trim();
    return lName+' '+userCount+', '+fName.split(' ')[0].trim(); // mama 2, joe
}

export function getRTC(){
    return rtc;
}

export function pexipDisconnect() {
    connectionRefused = false;
    if( UtilityService.getAppOS() == 'Android' &&
        UtilityService.getAndroidVersion() == 11 && 
        UtilityService.getBrowserInformation().isChrome ) {
        // Fix for Android 11 + Chrome freezing issue.
        video.srcObject = null;
        selfvideo.srcObject = null;
    }
    rtc.disconnect();
    log("info","user_self_disconnect","event: disconnecting from the conference page.");
    var isDirectLaunch = localStorage.getItem('isDirectLaunch');
    var inAppAccess = UtilityService.getInAppAccessFlag();
    if(isDirectLaunch || inAppAccess){
        JoinLeaveMobileCall("L");
    }
}


export function JoinLeaveMobileCall(status){
    var meetingId = JSON.parse(localStorage.getItem('meetingId'));
    var isProxyMeeting = JSON.parse(localStorage.getItem('isProxyMeeting'));
    var udata = JSON.parse(UtilityService.decrypt(localStorage.getItem('userDetails')));
    var userLoggedIn = udata.lastName +', '+ udata.firstName;  
    var inMeetingName = JSON.parse(localStorage.getItem('memberName'));
    var isDirectLaunch = localStorage.getItem('isDirectLaunch');
    var isPatient;
    var inMeetingDisplayName;
        if(userLoggedIn == inMeetingName){
            isPatient = true;
            inMeetingDisplayName = inMeetingName;
        }
        else if(isProxyMeeting == 'Y'){
            isPatient = false;
            inMeetingDisplayName = userLoggedIn;
        }
        else{
            isPatient = false;
            inMeetingDisplayName = userLoggedIn;
        }
        var loginType = isDirectLaunch ? "sso" : "tempAccess"
        BackendService.sendUserJoinLeaveStatus(meetingId,isPatient,status,inMeetingDisplayName,loginType).subscribe((response) => {
            console.log("Success");
            if(status == "L"){
                if(isDirectLaunch){
                window.location.href = 'mobileNativeLogout.htm';
                }
                else{
                MessageService.sendMessage(GlobalConfig.INAPP_LEAVEMEETING, null);
                }
            }
        }, (err) => {
            console.log("Error");
        });
    }

export function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

export function hostInMeeting(element, index, array) {
    return element.role == GlobalConfig.CHAIR_ROLE;
}

export function removeDuplicateParticipants(pexipParticipantsList){
    var participant = pexipParticipantsList.map(a => a.display_name);
    var participantsLength = participant.filter( onlyUnique );
    return participantsLength;
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
            var totalCount  = removeDuplicateParticipants(pexipParticipantsList);
            if(totalCount.length == 1){
                MessageService.sendMessage(GlobalConfig.REMOVE_DUPLICATES, null);
                return;
            }
            if (hostDirtyThisMeeting) {
                //Half waiting room
                MessageService.sendMessage(GlobalConfig.HAS_MORE_PARTICIPANTS, null);
                sessionStorage.setItem('hostleft',true);
            } else {
                // Full waiting room
                MessageService.sendMessage(GlobalConfig.HOST_LEFT, null);
            }
        }
    }
    // if (hostDirtyThisMeeting) {
    //     adjustLayout(participantsInMeeting, isHostAvail);
    // }
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
    log("info",'unload_event_called_on_refresh/browserBack', "event: trigger backend call to updated meeting endtime");
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

                            msg += userDetails.uuid ? ' :: UUID :: '+ userDetails.uuid : ''; 

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
            msg += userDetails.uuid ? ' :: UUID :: '+ userDetails.uuid : ''; 
            if (localStorage.getItem('vendorDetails')) {
                data = JSON.parse(localStorage.getItem('vendorDetails')),
                    meetingId = data.meetingId ? data.meetingId : '',
                    userType = data.userType ? data.userType : '',
                    userId = data.userId ? data.userId : '';

                    msg += userDetails.uuid ? ' :: UUID :: '+ userDetails.uuid : ''; 

                var params = [type, param, msg, meetingId, userType, userId];
                var isSetup = localStorage.getItem('isSetupPage');
                if (isSetup == null) {
                    BackendService.logVendorMeetingEvents(params);
                }
            }
            break;
    }
};

export function muteSpeaker() {
    var video = document.getElementById("video");
    if (video.muted) {
        log("info", "speaker_unmute_action", "event: unmuteSpeaker - on click of unmute speaker button");
        video.muted = false;
    } else {
        log("info", "speaker_mute_action", "event: muteSpeaker - on click of mute speaker button");
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
 function StageUpdated(participantsList){
    var activeSpeakersList = participantsList.filter(x=> x.vad == 100);
    let mapUuidToSpeaker = activeSpeakersList.map(function(val, index){ 
        return { uuid:val.participant_uuid}; 
    });
    if(activeSpeakersList.length > 0){
        MessageService.sendMessage(GlobalConfig.ACTIVESPEAKER,mapUuidToSpeaker);
    }
    else{
        MessageService.sendMessage(GlobalConfig.NOTACTIVESPEAKER,mapUuidToSpeaker);
    }
}
