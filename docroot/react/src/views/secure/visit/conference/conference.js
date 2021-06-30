import React from "react";
/*import * as mainWebrtc from '../../../../pexip/complex/desktop-main-webrtc.js';*/
import Header from '../../../../components/header/header';
import Loader from '../../../../components/loader/loader';
import VVModal from '../../../../modals/simple-modal/modal';
import SurveyModal from '../../../../modals/survey-modal/survey-modal';
import InfoModal from '../../../../modals/info-modal/info-modal';
import BackendService from '../../../../services/backendService.js';
import Utilities from '../../../../services/utilities-service.js';
import './conference.less';
import * as pexip from '../../../../pexip/complex/pexrtcV20.js';
import * as WebUI from '../../../../pexip/complex/webui.js';
import * as eventSource from '../../../../pexip/complex/EventSource.js';
import WaitingRoom from '../../../../components/waiting-room/waiting-room';
import Settings from '../../../../components/settings/settings.js';
import Notifier from '../../../../components/notifier/notifier';
import ConferenceDetails from '../../../../components/conference-details/conference-details';
import ConferenceControls from '../../../../components/conference-controls/conference-controls';
import GlobalConfig from '../../../../services/global.config';
import MediaService from '../../../../services/media-service.js';
import { MessageService } from '../../../../services/message-service.js';

class Conference extends React.Component {

    constructor(props) {
        super(props);
        this.state = {isPIPMode: false, userDetails: {}, isRearCamera:false, showVideoFeed: false, staticData:{conference:{},errorCodes:{}}, chin:'中文',span:'Español', showRemotefeed:false, showOverlay:false, isMobileSafari:false, disableCamFlip:true, showvideoIcon: true, media: {}, showaudioIcon: true, showmicIcon: true, isGuest: false, isIOS: false, isMobile: false, leaveMeeting: false, meetingCode: '', isRunningLate: false, loginType: '', accessToken: null, isProxyMeeting: '', meetingId: null, meetingDetails: {}, participants: [], showLoader: true, runningLatemsg: '', hostavail: false, moreparticpants: false, videofeedflag: false, isbrowsercheck: false, showSharedContent: false,mdoHelpUrl:'', isMirrorView:true };
        this.getInMeetingGuestName = this.getInMeetingGuestName.bind(this);
        this.startPexip = this.startPexip.bind(this);
        this.hideSettings = true;
        this.list = [];
        this.handle = 0;
        this.NoDevices = false;
        this.runningLate = 0;
        this.MediaStats = 0;
        this.keepAlive = 0;
        this.overlayTimer = 0;
        this.timerForLeaveMeeting = 0;
        this.visibilityChange = null;
        this.initialPositionTop = '';
        this.initialPositionLeft = '';
        this.widthSideBar = 0;
        this.pos1 = 0;
        this.pos2 = 0;
        this.pos3 = 0;
        this.pos4 = 0;
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        this.deviceChanged = this.deviceChanged.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.leaveOverlayMeeting = this.leaveOverlayMeeting.bind(this);
        this.stayinMeeting = this.stayinMeeting.bind(this);
        this.leaveMeeting = this.leaveMeeting.bind(this);
        this.setPIPMode = this.setPIPMode.bind(this);
        this.appendParticipant = this.appendParticipant.bind(this);
        this.removeParticipant = this.removeParticipant.bind(this);
        this.dragElement = this.dragElement.bind(this);
        this.dragMouseDown = this.dragMouseDown.bind(this);
        this.elementDrag = this.elementDrag.bind(this);
        this.closeDragElement = this.closeDragElement.bind(this);
        this.handleEnd = this.handleEnd.bind(this);
        this.handleMove = this.handleMove.bind(this);
        this.handleStart = this.handleStart.bind(this);
        this.quitMeetingCalled = false;
        this.surveyInprogress = false;
        this.surveyTimer = 0;
        this.surveyAutoCloseTime = null;
        this.screenMode = '';
        this.restartPexip=null;
        this.presentationViewMedia = React.createRef();
        this.selfViewMedia = React.createRef();
        this.remoteFeedMedia = React.createRef();
        this.getLanguage();
        let data = Utilities.getLang();
        this.leaveVisitPopupOptions = {
            heading: 'Leave Visit',
            message : 'Your video visit session is going to end, unless you choose Stay.',
            controls : [{label: 'Leave Room', type: 'leave'}, {label: 'Stay', type: 'stay'} ]
        };
        this.permissionRequiredContent = {
            heading: data.errorCodes.CameraAccessPermissionMsg,
            message: data.errorCodes.VisitStartNotificationMsg,
            type: 'Permission'
        };
        this.noDevicesFound = {
            heading: data.errorCodes.NoDeviceFoundHeader,
            message: data.errorCodes.NoDeviceFoundMsg,
            type: 'Permission'
        };
        this.permissionDeniedContent={
            heading: data.errorCodes.CameraAccessBlockHeader,
            message: data.errorCodes.CameraAccessBlockDefaultMsg,
            type: 'Denied',
        };
        this.permissionDeniedForSafari={
            heading: data.errorCodes.CameraAccessBlockHeader,
            message: data.errorCodes.CameraAccessBlockSafariMsg,
            type: 'Denied'
        };
        this.permissionDeniedMobile={
            heading: data.errorCodes.CameraAccessBlockHeader,
            message: data.errorCodes.CameraAccessBlockMobileMsg,
            type: 'Denied'
        }
    }

    componentDidMount() {
        if (typeof document.hidden !== 'undefined') {
            this.visibilityChange = 'visibilitychange';
        }
        else if (typeof document.msHidden !== 'undefined') {
            this.visibilityChange = 'msvisibilitychange';
        }
        else if (typeof document.webkitHidden !== 'undefined') {
            this.visibilityChange = 'webkitvisibilitychange';
        }
        navigator.mediaDevices.addEventListener('devicechange',this.deviceChanged);
        document.addEventListener(this.visibilityChange, this.handleVisibilityChange, false);
        // Make AJAX call for meeting details
        if (localStorage.getItem('meetingId')) {
            //this.setState({ showLoader: false });
            if (localStorage.getItem('isGuest')) {
                this.state.isGuest = true;
                this.state.loginType = "guest";
                sessionStorage.removeItem('guestLeave');
            }
            this.state.meetingId = JSON.parse(localStorage.getItem('meetingId'));
            Utilities.logMeetingStartTime(this.state.meetingId);
            this.surveyAutoCloseTime = Utilities.getMeetingFeedbackTimeout();
            var userDetails = JSON.parse(Utilities.decrypt(localStorage.getItem('userDetails')));
            var isInstantJoin = sessionStorage.getItem('isInstantJoin');
            if (userDetails != null) {
                this.state.meetingCode = this.state.isGuest ? userDetails.meetingCode : null;
                if(this.state.isGuest == true){
                    this.state.loginType = "guest";
                }
                else if(isInstantJoin){
                    // loginType
                    this.state.loginType='instant_join';
                }
                else{
                    this.state.loginType = userDetails.isTempAccess ? GlobalConfig.LOGIN_TYPE.TEMP : GlobalConfig.LOGIN_TYPE.SSO
                }
                this.state.accessToken = userDetails.ssoSession;
                this.state.userDetails = userDetails;
            }
            this.getInMeetingDetails();
            this.getRunningLateInfo();
            this.runningLate = setInterval(() => {
                this.getRunningLateInfo();
            }, GlobalConfig.RUNNING_LATE_TIMER);
            var isTempAccess = this.state.userDetails.isTempAccess;
            if(localStorage.getItem('keepAlive') && !isTempAccess && !isInstantJoin){
            var keepAliveUrl = localStorage.getItem('keepAlive');
            BackendService.keepAliveCookie(keepAliveUrl);
            }
            if(!isTempAccess && !isInstantJoin){
            this.keepAlive = setInterval(() => {
                var keepAliveUrl = localStorage.getItem('keepAlive');
                BackendService.keepAliveCookie(keepAliveUrl);
            }, 1200000);
            }

        } else {
            if(sessionStorage.getItem('guestCode')){
                var meetingCode = JSON.parse(sessionStorage.getItem('guestCode'));
                this.props.history.push('/guestlogin?meetingcode=' + meetingCode);
            }
            else{
            this.props.history.push(GlobalConfig.LOGIN_URL);
            }
        }

        if (localStorage.getItem('isProxyMeeting')) {
            this.state.isProxyMeeting = JSON.parse(localStorage.getItem('isProxyMeeting'));
        }

        var browserInfo = Utilities.getBrowserInformation();
        if (browserInfo.isSafari || browserInfo.isFireFox) {
            this.setState({ isbrowsercheck: true })
        }

        if (browserInfo.isSafari){
            this.setState({isMobileSafari:true});
        }

        var isMobile = Utilities.isMobileDevice();
        if (isMobile) {
            this.setState({ isMobile: true });
        }

        var os = Utilities.getAppOS();
        if (os == 'iOS') {
            this.setState({ isIOS: true });
        }

        if(sessionStorage.getItem('hostleft')){
            setTimeout(() => {
                 this.startTimerforLeaveMeeting();
            }, 6000);
        }

        if(sessionStorage.getItem('overlayDisplayed')){
            setTimeout(() => {
                this.showOverlayView(true);
            }, 5000);
        }

        if(sessionStorage.getItem('isValidInteraction')){
            setTimeout(() => {
                 this.startTimerforLeaveMeeting();
            }, 5000);
        }
        let selfBox = document.getElementById("selfvideo");
        this.dragElement(selfBox);
        this.initialPositionTop = selfBox.offsetTop + "px";
        this.initialPositionLeft = selfBox.offsetLeft + "px";
        //selfBox.addEventListener("touchend", this.handleEnd, false);
        //selfBox.addEventListener("touchmove", this.handleMove, false);
        selfBox.addEventListener("touchstart", this.handleStart, false);

        this.subscription = MessageService.getMessage().subscribe((message) => {
            switch (message.text) {
                case GlobalConfig.CLOSE_SURVEY_MODAL:
                    this.submitSurvey(message.data);
                    break;
                case GlobalConfig.CLOSE_MODAL:
                    this.vvModalClosed(message.data);
                    break;
                case GlobalConfig.HOST_AVAIL:
                    this.setState({ hostavail: true, videofeedflag: true, moreparticpants: false });
                    this.toggleDockView(false);
                    this.handleTimer(false);
                    window.clearTimeout(this.overlayTimer);
                    window.clearTimeout(this.timerForLeaveMeeting);
                    MessageService.sendMessage(GlobalConfig.CLOSE_MODAL_AUTOMATICALLY, null);
                    sessionStorage.removeItem('overlayDisplayed');
                    break;
                case GlobalConfig.HOST_LEFT:
                    this.setState({ hostavail: false, moreparticpants: false, videofeedflag: false });
                    this.toggleDockView(false);
                    this.handleTimer(true);
                    if(sessionStorage.getItem('isTrueHost')){
                        sessionStorage.setItem('isValidInteraction',true);
                        this.startTimerforLeaveMeeting();
                    }
                    break;
                case GlobalConfig.HAS_MORE_PARTICIPANTS:
                    this.setState({ hostavail: false, moreparticpants: true });
                    const isDock = window.innerWidth > 1024; // passes true only for desktop
                    this.toggleDockView(isDock);
                    this.handleTimer(false);
                    break;
                case GlobalConfig.LEAVE_VISIT:
                    this.leaveMeeting(message.data);
                    break;
                case GlobalConfig.MEMBER_READY:
                case GlobalConfig.UPDATE_RUNNING_LATE:
                    if(!sessionStorage.getItem('memberAlone')){
                    sessionStorage.setItem('memberAlone', true);
                    this.handleTimer(true);
                    }
                    break;
                case GlobalConfig.START_SCREENSHARE:
                    this.setState({ showSharedContent: true });
                    this.setState({isPIPMode: this.setPIPMode()});
                    break;
                case GlobalConfig.STOP_SCREENSHARE:
                    this.setState({ showSharedContent: false });
                    this.setState({isPIPMode: this.setPIPMode()});
                    break;
                case GlobalConfig.MEDIA_DATA_READY:
                    this.list = message.data;
                    this.setState({ media: this.list });
                    let constrains = {
                            audioSource: this.list.audiooutput ? this.list.audiooutput[0] : null,
                            videoSource: this.list.videoinput ? this.list.videoinput[0] : null,
                            micSource: this.list.audioinput ? this.list.audioinput[0] : null
                        };
                    if (localStorage.getItem('selectedPeripherals') == null) {
                        localStorage.setItem('selectedPeripherals', JSON.stringify(constrains));
                    }
                    this.startPexip(this.state.meetingDetails);
                    var isDirectLaunch = localStorage.getItem('isDirectLaunch');
                    if( !isDirectLaunch ) {
                    MessageService.sendMessage(GlobalConfig.SHOW_CONFERENCE_DETAILS, {
                        meetingDetails: this.state.meetingDetails
                    });
                    }
                    break;
                case GlobalConfig.CAMERA_FLIP:
                    this.setState({isMirrorView: message.data});
                    break;

                case GlobalConfig.VIDEO_MUTE:
                    this.setState({
                        showvideoIcon: message.data
                    });
                    break;
                case GlobalConfig.AUDIO_MUTE:
                    this.setState({
                        showaudioIcon: message.data
                    });
                    break;
                case GlobalConfig.MICROPHONE_MUTE:
                    this.setState({
                        showmicIcon: message.data
                    });
                    break;
                case GlobalConfig.TOGGLE_SETTINGS:
                    if(this.state.hideSettings !== message.data){
                        this.hideSettings = message.data;
                    }
                    break;
                case GlobalConfig.CLOSE_SETTINGS:
                    this.hideSettings = message.data;
                    break;
                case GlobalConfig.ENABLE_IOS_CAM:
                    this.setState({
                        disableCamFlip: false,
                        isMobileSafari: true
                    });
                    break;
                case GlobalConfig.INAPP_LEAVEMEETING:
                    this.props.history.push(GlobalConfig.MEETINGS_URL);
                    break;
                case GlobalConfig.MEDIA_STATS_DATA:
                    this.sendMediaStats(message.data);
                    break;
                case GlobalConfig.REMOVE_DUPLICATES:
                    this.setState({ hostavail: false, moreparticpants: false, videofeedflag: false });
                    this.toggleDockView(false);
                    this.handleTimer(true);
                    break;
                case GlobalConfig.MEDIA_PERMISSION:
                    var modalData;
                    if(message.data=='denied'){
                        let browserInfo = Utilities.getBrowserInformation();
                        if (browserInfo.isSafari) {
                            modalData = this.permissionDeniedForSafari;
                        }
                        else {
                            if(Utilities.isMobileDevice()){
                                modalData = this.permissionDeniedMobile;
                            }
                            else {
                                modalData = this.permissionDeniedContent;
                            }
                        }
                    }
                    else if(message.data==='prompt-no-Devices'){
                        modalData = this.noDevicesFound;
                        this.NoDevices = true;
                    }
                    else{
                        modalData = this.permissionRequiredContent;
                    }
                    MessageService.sendMessage(GlobalConfig.OPEN_MODAL, modalData);
                    break;
                case GlobalConfig.RENDER_VIDEO_DOM:
                    if(message.data!='preCallCheck') {
                        this.setState({showRemotefeed: true, showVideoFeed:true, showLoader:false});
                    }
                    let element = document.querySelector('.conference-details');
                    let positionInfo = element.getBoundingClientRect();
                    this.widthSideBar = positionInfo.width;
                    break;
                case GlobalConfig.HIDE_LOADER:
                    this.setState({showLoader:false});
                    break;
                case GlobalConfig.USER_JOINED:
                    this.appendParticipant(message.data);
                break;
                case GlobalConfig.USER_LEFT:
                    this.removeParticipant(message.data);
                break;
                case GlobalConfig.SELF_ASPECT_MODE:
                    if(message && message.data) {
                        this.screenMode= message.data.toLowerCase();
                        this.setState({isPIPMode: this.setPIPMode()});
                    }
                break;
            }

        });
        window.addEventListener('resize', this.handleResize,false);
        if(localStorage.getItem('helpUrl')){
            var helpUrl = localStorage.getItem('helpUrl');
            this.setState({ mdoHelpUrl: helpUrl });
        }
        this.getLanguage();
            this.subscription = MessageService.getMessage().subscribe((message) => {
                if(message.text==GlobalConfig.LANGUAGE_CHANGED){
                    this.getLanguage();
                }
            });
    }

    dragElement(elmnt) {
        document.getElementById(elmnt.id).onmousedown = this.dragMouseDown;
    }

    dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;
        document.onmouseup = this.closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = this.elementDrag;
    }

    elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        let elmnt = this.selfViewMedia.current;

        // calculate the new cursor position:
        this.pos1 = this.pos3 - e.clientX;
        this.pos2 = this.pos4 - e.clientY;
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;
        // set the element's new position:
        //
        let selfViewElement = document.querySelector('#selfvideo');
        let selfPosition = selfViewElement.getBoundingClientRect();

        let element = document.querySelector('.video-conference');
        let positionInfo = element.getBoundingClientRect();

        let controls = document.querySelector('#controls');
        let controlsPosition = controls.getBoundingClientRect();


        let confWidth = positionInfo.width - selfPosition.width - controlsPosition.width ;


        if(window.innerWidth >= 715 && window.innerWidth <= 1024){
            if ((elmnt.offsetTop - this.pos2) < 0) {
                elmnt.style.top = "0px";
            }
            else if (elmnt.offsetTop - this.pos2 >= parseInt(this.initialPositionTop.slice(0, -2))) {
                elmnt.style.top = this.initialPositionTop;
            } else {
                elmnt.style.top = (elmnt.offsetTop - this.pos2) + "px";
            }
            if (elmnt.offsetLeft - this.pos1 < 17) {
                elmnt.style.left = "16px";
            } else if (elmnt.offsetLeft - this.pos1 > confWidth ) {
                elmnt.style.left = confWidth + "px";
            } else {
                elmnt.style.left = (elmnt.offsetLeft - this.pos1) + "px";
            }
        }
        else if(window.innerWidth > 1024){
            if ((elmnt.offsetTop - this.pos2) < -98 && window.innerWidth > 1024) {
                elmnt.style.top = "-98px";
            } else if (elmnt.offsetTop - this.pos2 >= parseInt(this.initialPositionTop.slice(0, -2))) {
                elmnt.style.top = this.initialPositionTop;
            } else {
                elmnt.style.top = (elmnt.offsetTop - this.pos2) + "px";
            }

            if (elmnt.offsetLeft - this.pos1 < 2) {
                elmnt.style.left = "0px";
            } else if (elmnt.offsetLeft - this.pos1 > parseInt(this.initialPositionLeft.slice(0, -2)) + this.widthSideBar) {
                elmnt.style.left = parseInt(this.initialPositionLeft.slice(0, -2)) + this.widthSideBar + "px";
            } else {
                elmnt.style.left = (elmnt.offsetLeft - this.pos1) + "px";
            }
        }
    }


    closeDragElement(e) {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }

    handleStart(e){
        e.preventDefault();
        var touchLocation = e.targetTouches[0];
        // get the mouse cursor position at startup:
        this.pos3 = touchLocation.pageX ;
        this.pos4 = touchLocation.pageY;
        document.ontouchmove = this.handleMove;
        // call a function whenever the cursor moves:
        document.ontouchend = this.handleEnd;
    }

     handleMove(e){
        if(Utilities.isMobileDevice() && (this.state.isPIPMode || window.matchMedia("(orientation: landscape)").matches)) {
            var touchLocation = e.targetTouches[0];
            let elmnt = this.selfViewMedia.current;

            // assign box new coordinates based on the touch.
            this.pos1 = this.pos3 - touchLocation.pageX ;
            this.pos2 = this.pos4 - touchLocation.pageY;
            this.pos3 = touchLocation.pageX ;
            this.pos4 = touchLocation.pageY;

            let selfViewElement = document.querySelector('#selfvideo');
            let selfPosition = selfViewElement.getBoundingClientRect();

            let element = document.querySelector('.video-conference');
            let positionInfo = element.getBoundingClientRect();

            let controls = document.querySelector('#controls');
            let controlsPosition = controls.getBoundingClientRect();


            let confWidth = positionInfo.width - selfPosition.width - controlsPosition.width ;

            if(window.innerWidth >= 715 && window.innerWidth <= 1024){
                if ((elmnt.offsetTop - this.pos2) < 0) {
                    elmnt.style.top = "0px";
                }
                else if (elmnt.offsetTop - this.pos2 >= parseInt(this.initialPositionTop.slice(0, -2))) {
                    elmnt.style.top = this.initialPositionTop;
                } else {
                    elmnt.style.top = (elmnt.offsetTop - this.pos2) + "px";
                }
                if (elmnt.offsetLeft - this.pos1 < 17) {
                    elmnt.style.left = "16px";
                } else if (elmnt.offsetLeft - this.pos1 > confWidth ) {
                    elmnt.style.left = confWidth + "px";
                } else {
                    elmnt.style.left = (elmnt.offsetLeft - this.pos1) + "px";
                }
            }
            else{
                if ((elmnt.offsetTop - this.pos2) < 2 ) {
                    elmnt.style.top = "0px";
                } else if (elmnt.offsetTop - this.pos2 >= parseInt(this.initialPositionTop.slice(0, -2)) + controlsPosition.height) {
                    elmnt.style.top = (parseInt(this.initialPositionTop.slice(0, -2)) + controlsPosition.height -10) + "px";
                } else {
                    elmnt.style.top = (elmnt.offsetTop - this.pos2) + "px";
                }

                if (elmnt.offsetLeft - this.pos1 < 2) {
                    elmnt.style.left = "0px";
                } else if (elmnt.offsetLeft - this.pos1 > parseInt(this.initialPositionLeft.slice(0, -2))) {
                    elmnt.style.left = this.initialPositionLeft;
                } else {
                    elmnt.style.left = (elmnt.offsetLeft - this.pos1) + "px";
                }
            }
        }
     }

    handleEnd(e) {
        document.ontouchmove = null;
        document.ontouchend = null;
    }


    appendParticipant(newParticipant) {
        this.setState({
            participants: [...this.state.participants, newParticipant]
          },function() {
            this.setState({isPIPMode: this.setPIPMode()});
        });
    }

    removeParticipant(leftParticipant) {
        this.setState({participants: this.state.participants.filter(function(participant) {
            return participant.uuid !== leftParticipant.uuid;
        })}, function(){
            this.setState({isPIPMode: this.setPIPMode()});
        });
    }

    deviceChanged() {
        MediaService.onDeviceChange();
    }

    sendMediaStats(data) {
        var mediaStatsFrequency = localStorage.getItem('mediaStats');
        if (mediaStatsFrequency == 0) {
            return;
        }
        mediaStatsFrequency = parseInt(mediaStatsFrequency) * 1000;
        var meetingVmr = this.state.meetingDetails.meetingVendorId;
        BackendService.storeMediaStats(data.meetingId, meetingVmr, data.memberName, '');
        this.MediaStats = setInterval(() => {
            BackendService.storeMediaStats(data.meetingId, meetingVmr, data.memberName, '');
        }, mediaStatsFrequency);
    }
    /*getBrowserBlockInfo(){
        var propertyName = 'browser',
            url = "loadPropertiesByName.json",
            browserNames = '';
        BackendService.getBrowserBlockDetails(url, propertyName).subscribe((response) => {
            if (response.data && response.status == '200') {
                 browserNames = response.data;
                 this.setState({ mdoHelpUrl: response.data.mdoHelpUrl });
            } else {
                // Do nothing
            }
        }, (err) => {
            console.log("Error");
        });
    }*/
    handleResize() {
        if(window.innerWidth >= 1024) {
            this.selfViewMedia.current.style.top = "initial";
            this.selfViewMedia.current.style.left = "initial";
            this.initialPositionTop = document.querySelector('#selfvideo').offsetTop + "px";
            this.initialPositionLeft = document.querySelector('#selfvideo').offsetLeft + "px";
            let element = document.querySelector('.conference-details');
            let positionInfo = element.getBoundingClientRect();
            this.widthSideBar = positionInfo.width;
            this.selfViewMedia.current.style.top = this.initialPositionTop;
            this.selfViewMedia.current.style.left = this.initialPositionLeft;
        }
        else if (window.innerWidth <= 1024 && window.matchMedia("(orientation: landscape)").matches) {
                this.selfViewMedia.current.style.top = "initial";
                this.selfViewMedia.current.style.left = "16px";
                this.initialPositionTop = document.querySelector('#selfvideo').offsetTop + "px";
        }
        else{
            this.selfViewMedia.current.style.top = "initial";
            this.selfViewMedia.current.style.left = "initial";
        }
       if(this.state.moreparticpants) {
            const isDock = window.innerWidth > 1024; // passes true only for desktop
            this.toggleDockView(isDock);
        }
        // OrientationChange Deprecated so using resize handler
        if(window.matchMedia("(orientation: portrait)").matches) {
            this.setState({isPIPMode: this.setPIPMode()});
            WebUI.sendChatContent(this.state.meetingDetails.meetingVendorId);
        }
         if(window.matchMedia("(orientation: landscape)").matches) {
            this.setState({isPIPMode: this.setPIPMode()});
            WebUI.sendChatContent(this.state.meetingDetails.meetingVendorId);
        }
    }

    handleVisibilityChange() {
        if(Utilities.isMobileDevice()){
            let presentationView = this.presentationViewMedia ? this.presentationViewMedia.current.querySelector("#presvideo") : null;

            if (document.visibilityState === 'visible') {
                console.log("Document visible now");
                if((Date.now() - this.restartPexip) > 20000){
                    window.location.reload();
                } else {
                    this.selfViewMedia && this.selfViewMedia.current.play();
                    this.remoteFeedMedia && this.remoteFeedMedia.current.play();
                    presentationView && presentationView.play();
                    /*WebUI.pexipDisconnect();
                    MediaService.stopAudio();
                    setTimeout(()=>{
                        MediaService.loadDeviceMediaData();
                    },1000);*/
                }
            } else if(document.visibilityState === 'hidden') {
                console.log("Document hidden now");
                this.restartPexip = Date.now();
                this.selfViewMedia && this.selfViewMedia.current.pause();
                this.remoteFeedMedia && this.remoteFeedMedia.current.pause();
                presentationView && presentationView.pause();
            }
        }
    }


    handleTimer(param){
        var self = this;
        if(param){
            clearTimeout(this.handle);
            this.handle = setTimeout(function() {
                self.leaveMeeting();
                self.handle = 0;
            },GlobalConfig.SIGNOUT_MEMBER_ALONE);
        }
        else{
            clearTimeout(this.handle);
        }
    }

    startTimerforLeaveMeeting(){
        this.timerForLeaveMeeting = setTimeout(() => {
                // this.setState({showOverlay: true});
                MessageService.sendMessage(GlobalConfig.OPEN_MODAL, this.leaveVisitPopupOptions);
                this.showOverlayView();
            }, 600000);
    }

    showOverlayView(param){
        if(param){
            // this.setState({showOverlay: true});
            MessageService.sendMessage(GlobalConfig.OPEN_MODAL, this.leaveVisitPopupOptions);
        }
        sessionStorage.setItem('overlayDisplayed',true);
        sessionStorage.removeItem('isValidInteraction');
        sessionStorage.removeItem('hostleft');
        this.overlayTimer = setTimeout(() => {
            // this.setState({showOverlay: false});
            MessageService.sendMessage(GlobalConfig.CLOSE_MODAL_AUTOMATICALLY, null);
            this.leaveMeeting();
        }, 60000);
    }

    vvModalClosed(data){
        if(data.type == 'stay'){
            this.stayinMeeting();
        } else if(data.type == 'leave'){
            this.leaveOverlayMeeting();
        }
    }


    stayinMeeting(){
         sessionStorage.removeItem('overlayDisplayed');
         clearTimeout(this.overlayTimer);
         clearTimeout(this.timerForLeaveMeeting);
         // this.setState({showOverlay: false});
         this.startTimerforLeaveMeeting();
         sessionStorage.setItem('isValidInteraction',true);
    }

    leaveOverlayMeeting(){
        // this.setState({showOverlay: false});
        this.leaveMeeting();
    }

    toggleDockView(isDock) {
        if (isDock) {
            var ele = document.getElementsByClassName('video-conference')[0];
            var dockHeight = ele.offsetHeight / 2;
            // var wRoom = document.getElementsByClassName('conference-waiting-room')[0];
            var wRoom = document.querySelectorAll('.half-waiting-room .conference-waiting-room')[0];
            wRoom.style.height = '50%';// dockHeight / 16 + 'rem';
            var remoteFeed = document.getElementsByClassName('stream-container')[0];
            remoteFeed.style.height = '50%';//dockHeight / 16 + 'rem';
        } else {
            var wRoom = document.getElementsByClassName('conference-waiting-room')[0];
            //wRoom.style.height = '100%';
            var wRoom1 = document.getElementsByClassName('stream-container')[0];
            wRoom1.style.height = '100%';
        }
    }

    getInMeetingDetails() {
        var meetingId = this.state.meetingId,
            loginType = this.state.loginType,
            url = "meetingDetails.json";
        BackendService.getMeetingDetails(url, meetingId, loginType).subscribe((response) => {
            if (response.data && response.data.statusCode == '200') {
                var data = response.data.data;
                this.setState({ meetingDetails: data });
                MediaService.loadDeviceMediaData();
                var turnServerInfo = data.vendorConfig;
                sessionStorage.setItem('turnServer', JSON.stringify(turnServerInfo));

            } else {
                // Do nothing
            }
        }, (err) => {
            console.log("Error");
        });

    }

    getRunningLateInfo() {
        if(this.state.hostavail == true){
            return;
        }
        var meetingId = this.state.meetingId,
            loginType = this.state.loginType,
            url = "providerRunningLateInfo.json";
        BackendService.getRunningLateInfo(url, meetingId, loginType).subscribe((response) => {
            if (response.data && response.data.statusCode == '200') {
                var data = response.data.data;
                if (data.isRunningLate == true) {
                    data['runningLatemsg'] = "We're sorry, your doctor is running late.";
                    MessageService.sendMessage(GlobalConfig.UPDATE_RUNNING_LATE, data);
                } else {
                    MessageService.sendMessage(GlobalConfig.MEMBER_READY, 'Your visit will start once your doctor joins.');
                }
            }
        }, (err) => {
            console.log("Error");
        });
    }

    getInMeetingGuestName(caregiver) {
        var details = JSON.parse(Utilities.decrypt(localStorage.getItem('userDetails')));
        var guestName;
        caregiver.forEach(function(val, index) {
            if (val.careGiverMeetingHash == details.meetingCode) {
                guestName = val.lastName + ', ' + val.firstName + ' (' + val.emailAddress + ')';
            }
        });
        return guestName;
    }


    startPexip(meeting) {
        localStorage.setItem('guestPin', meeting.vendorGuestPin);
        var guestPin = meeting.vendorGuestPin,
            roomJoinUrl = meeting.roomJoinUrl,
            alias = meeting.meetingVendorId,
            bandwidth = parseInt("2400"),
            source = "Join+Conference",
            name;
        if (this.state.isGuest == false) {
            if( !sessionStorage.getItem('loggedAsDuplicateMember') ){
                if(this.state.isProxyMeeting == 'Y'){
                    name = this.state.userDetails.lastName + ', ' + this.state.userDetails.firstName;
                } else {
                    name = Utilities.formatStringTo(meeting.member.inMeetingDisplayName, GlobalConfig.STRING_FORMAT[0]);
                }
                localStorage.setItem('memberName', JSON.stringify(name));
            } else {
                name = JSON.parse(localStorage.getItem('memberName'));
                // localStorage.setItem('memberName', name);
            }
            var userType = this.state.isProxyMeeting == 'Y' ? (meeting.member.mrn ? 'Patient_Proxy' : 'Non_Patient_Proxy') : 'Patient';
            var vendorDetails = {
                "meetingId": meeting.meetingId,
                "userType": userType,
                "userId": meeting.member.mrn
            };
            localStorage.setItem('vendorDetails', JSON.stringify(vendorDetails));
        } else {
            if( !sessionStorage.getItem('loggedAsDuplicateMember') ){
                var guestName = this.getInMeetingGuestName(meeting.caregiver);
                localStorage.setItem('memberName', JSON.stringify(guestName));
                name = Utilities.formatStringTo(guestName, GlobalConfig.STRING_FORMAT[0]);
            } else {
                name = JSON.parse(localStorage.getItem('memberName'));
                //localStorage.setItem('memberName', JSON.stringify(name));
            }
            var vendorDetails = {
                "meetingId": meeting.meetingId,
                "userType": "Caregiver",
                "userId": name
            };
            localStorage.setItem('vendorDetails', JSON.stringify(vendorDetails));
        }
        const config = meeting.vendorConfig;
        MessageService.sendMessage(GlobalConfig.ACCESS_MEMBER_NAME, null);
        sessionStorage.removeItem('UUID');
        WebUI.log("info", "PreparingSetup", "event: Preparing user to join the conference.");
        WebUI.initialise(roomJoinUrl, alias, bandwidth, name, guestPin, source, null, config);
    }

    componentWillUnmount() {
        // clear on component unmount
        if(this.NoDevices){
            this.subscription.unsubscribe();
            this.goTo();
            return;
        }
        MediaService.stopAudio();
        clearTimeout(this.handle);
        window.clearInterval(this.runningLate);
        window.clearInterval(this.MediaStats);
        window.clearInterval(this.keepAlive);
        window.clearTimeout(this.overlayTimer);
        window.clearTimeout(this.timerForLeaveMeeting);
        window.clearTimeout(this.surveyTimer);
        this.subscription.unsubscribe();
        localStorage.setItem('meetingAttended', true);
        if(this.state.isGuest == true){
            var isGuestLeave = sessionStorage.getItem('guestLeave');
            if(!isGuestLeave) {
            var isFromBackButton = "true";
            this.leaveMeeting(isFromBackButton);
            }
        } else {
            if(this.state.leaveMeeting == false){
                var isFromBackButton = "true";
                this.leaveMeeting(isFromBackButton);
            }
       }
       localStorage.removeItem('selectedPeripherals');
       sessionStorage.removeItem('UUID');
       sessionStorage.removeItem('meetingTimeLog');
       sessionStorage.removeItem('loggedAsDuplicateMember');
       window.removeEventListener('resize', this.handleResize, false);
       document.removeEventListener(this.visibilityChange, this.handleVisibilityChange, false);

    }

    toggleSettings() {
        this.hideSettings = !this.hideSettings;
        MessageService.sendMessage(GlobalConfig.TOGGLE_SETTINGS, this.hideSettings);
    }

    toggleControls(cntrlname) {
        switch (cntrlname) {
            case GlobalConfig.VIDEO:
                this.setState({
                    showvideoIcon: !this.state.showvideoIcon
                })
                WebUI.muteUnmuteVideo();
                break;
            case GlobalConfig.AUDIO:
                this.setState({
                    showaudioIcon: !this.state.showaudioIcon
                })
                WebUI.muteSpeaker();
                break;
            case GlobalConfig.MICROPHONE:
                this.setState({
                    showmicIcon: !this.state.showmicIcon
                })
                WebUI.muteUnmuteMic();
                break;
        }
    }

    initSurvey(leaveType){
        if( leaveType == 'mobile' || leaveType == 'manual' ){
            if( Utilities.canShowUserSurvey() ) {
                this.initiateSurvey();
                this.surveyTimer = setTimeout(() => {
                    MessageService.sendMessage(GlobalConfig.CLOSE_SURVEY_MODAL_AUTOMATICALLY, null);
                    this.surveyInprogress = false;
                    this.goTo();
               }, this.surveyAutoCloseTime);
            }
        }
    }

    leaveMeeting(isFromBackButton) {
        this.initSurvey(isFromBackButton);
        this.setState({ leaveMeeting: true });
        sessionStorage.removeItem('preCallCheckLoaded');
        sessionStorage.removeItem('isInstantJoin');
        sessionStorage.removeItem('memberAlone');
        sessionStorage.removeItem('isValidInteraction');
        sessionStorage.removeItem('overlayDisplayed');
        sessionStorage.removeItem('hostleft');
        sessionStorage.removeItem('isTrueHost');
        var isDirectLaunch = localStorage.getItem('isDirectLaunch');
        var inAppAccess = Utilities.getInAppAccessFlag();
        if(isDirectLaunch || inAppAccess){
            WebUI.pexipDisconnect();
            return false;
        }
        if (this.state.isGuest == false) {
            var headers = {},
                loginType = this.state.loginType;
            if (loginType == GlobalConfig.LOGIN_TYPE.TEMP) {
                headers.authtoken = this.state.accessToken;
            } else if(loginType=='instant_join'){
                headers.authtoken='';
            } else{
                headers.ssoSession = this.state.accessToken;
            }
            headers.mrn = this.state.userDetails.mrn;
            var meetingId = this.state.meetingDetails.meetingId,
                isProxyMeeting = this.state.isProxyMeeting,
                backButton = isFromBackButton ? isFromBackButton : false;
            WebUI.pexipDisconnect();
            if(isProxyMeeting == 'Y'){
                headers.memberName = this.state.userDetails.lastName + ', ' + this.state.userDetails.firstName;
            }
            else{
                headers.memberName = Utilities.formatStringTo(this.state.meetingDetails.member.inMeetingDisplayName, GlobalConfig.STRING_FORMAT[0]);
            }
            BackendService.quitMeeting(meetingId, isProxyMeeting, headers, loginType, backButton).subscribe((response) => {
                console.log("Success");
                this.quitMeetingCalled = true;
                if (response.data && response.data.statusCode == '200') {
                    if( this.state.loginType == GlobalConfig.LOGIN_TYPE.TEMP ){
                        this.resetSessionToken(response.headers.authtoken);
                    }
                    this.goTo();
                }
                else{
                    if(!this.surveyInprogress){
                        this.props.history.push(GlobalConfig.LOGIN_URL);
                    }
                }
            }, (err) => {
                console.log("Error");
                this.quitMeetingCalled = true;
                if(!this.surveyInprogress){
                    Utilities.setPromotionFlag(false);
                    this.props.history.push(GlobalConfig.LOGIN_URL);
                }
            });

        } else {
            sessionStorage.setItem('guestLeave',true);
             WebUI.pexipDisconnect();
            let headers = {};
                headers.authtoken = this.state.userDetails.authToken;
                headers.patientLastName = this.state.userDetails.lastname;
            var backButton = isFromBackButton ? isFromBackButton : false;
            BackendService.guestLogout(this.state.meetingCode,headers,backButton).subscribe((response) => {
                console.log("Success");
                this.goTo();
            }, (err) => {
                console.log("Error");
                this.goTo();
            });
        }
        localStorage.removeItem('selectedPeripherals');
    }
    getLanguage(){
        let data = Utilities.getLang();
        if(data.lang=='spanish'){
            this.setState({span:'English',chin: '中文',staticData: data});
        }
        else if(data.lang=='chinese'){
            this.setState({chin:'English',span:'Español',staticData: data});
        }
        else {
            this.setState({span: "Español", chin: '中文',staticData: data});
        }

    }
    changeLang(event){
        let value = event.target.textContent;
        if(value=="中文"){
            sessionStorage.setItem('Instant-Lang-selection','chinese');
            Utilities.setLang('chinese');
        }
        else if(value=="Español"){
            sessionStorage.setItem('Instant-Lang-selection','spanish');
            Utilities.setLang('spanish');
         }
        else{
            sessionStorage.setItem('Instant-Lang-selection','english');
            Utilities.setLang('english');
        }
    }
    resetSessionToken(token) {
        this.state.accessToken = token;
        this.state.userDetails.ssoSession = token;
        localStorage.setItem('userDetails', Utilities.encrypt(JSON.stringify(this.state.userDetails)));
        localStorage.setItem('LoginUserDetails', Utilities.encrypt(JSON.stringify(this.state.userDetails)));
    }

    refreshPage() {
        window.location.reload(false);
    }

    toggleCamera(){
        var camID = this.state.media["videoinput"];
        var videoSource;
        var vObject;
        // Keeps only first and last camera ids, if device has more than 2 cameras.
        if(camID.length > 2){
            camID.splice(1,camID.length-2);
        }
        //videoSource = this.state.isRearCamera ? camID[0].deviceId : camID[1].deviceId;
        vObject = this.state.isRearCamera ? camID[0] : camID[1];
        videoSource = vObject.deviceId;
        this.state.isRearCamera = !this.state.isRearCamera;
        var browserInfo = Utilities.getBrowserInformation();

        if (browserInfo.isFireFox) {
            var isRear = vObject.label.toLowerCase().indexOf('back') > -1 || vObject.label.toLowerCase().indexOf('rear') > -1;
            if(isRear){
              this.setState({isMirrorView : false});
            // document.getElementById('selfvideo').style.transform = "none";
            }else{
                this.setState({isMirrorView : true});
            // document.getElementById('selfvideo').style.transform = "scaleX(-1)";
            }
        }
        else{
            if(this.state.isRearCamera == true){
                this.setState({isMirrorView : false});
            // document.getElementById('selfvideo').style.transform = "none";
            }else{
                this.setState({isMirrorView : true});
            // document.getElementById('selfvideo').style.transform = "scaleX(-1)";
            }
        }

        WebUI.switchDevices('video', vObject);
    }

    initiateSurvey(){
        let uValue;
        let uType;
        let meetingId = this.state.meetingDetails.meetingId;
        if(!this.state.isGuest) {
            uValue = this.state.userDetails.mrn;
            uType = 'mrn';
        } else {
            const guestName = JSON.parse(localStorage.getItem('memberName'));
            uValue = Utilities.formatStringTo(guestName, GlobalConfig.STRING_FORMAT[0]);
            uValue = uValue.split('(')[0].trim();
            uType = 'name';
        }
        this.surveyInprogress = true;
        BackendService.getSurveyDetails( meetingId, uType, uValue ).subscribe((response) => {
            console.log("Success");
            if(response.data && response.data.code == '200') {
                if(response.data.survey) {
                    MessageService.sendMessage(GlobalConfig.OPEN_SURVEY_MODAL, response.data.survey);
                        this.setState({showVideoFeed: false});
                } else {
                    this.surveyInprogress = false;
                    if( this.quitMeetingCalled ){
                        this.goTo();
                    }
                }
            } else {
                this.surveyInprogress = false;
                if( this.quitMeetingCalled ){
                    this.goTo();
                }
            }
        }, (err) => {
            console.log("Error");
            this.surveyInprogress = false;
            if( this.quitMeetingCalled ){
                this.goTo();
            }
        });
    }

    goTo() {
        if(this.surveyInprogress){
            return;
        }
        if(this.state.isGuest == false){
            if (this.state.loginType == GlobalConfig.LOGIN_TYPE.TEMP) {
                Utilities.setPromotionFlag(true);
                this.props.history.push(GlobalConfig.MEETINGS_URL);
            } else if (this.state.loginType == 'instant_join') {
                this.props.history.push(GlobalConfig.LOGIN_URL);
                history.pushState(null, null, location.href);
                window.onpopstate = function(event) {
                    history.go(1);
                };
            } else {
                Utilities.setPromotionFlag(true);
                this.props.history.push(GlobalConfig.MEETINGS_URL);
            }
        } else {
            this.props.history.push('/guestlogin?meetingcode=' + this.state.meetingCode);
        }
    }

    submitSurvey(data){
        if(!data){
            this.surveyInprogress = false;
            this.goTo();
        } else {
            let uValue;
            let uType;
            if(!this.state.isGuest) {
                uValue = this.state.userDetails.mrn;
                uType = 'mrn';
            } else {
                const guestName = JSON.parse(localStorage.getItem('memberName'));
                uValue = Utilities.formatStringTo(guestName, GlobalConfig.STRING_FORMAT[0]);
                uValue = uValue.split('(')[0].trim();
                uType = 'name';
            }
            const survey = {
                userAnswers: data,
                userType: uType,
                userValue: uValue,
                meetingId: this.state.meetingDetails.meetingId
            };
            BackendService.submitSurvey( survey ).subscribe((response) => {
                console.log("Success");
                this.surveyInprogress = false;
                this.goTo();
            }, (err) => {
                console.log("Error");
                this.surveyInprogress = false;
                this.goTo();
            });
        }

    }

    setPIPMode() {
        if(this.state.isMobile && window.matchMedia("(orientation: portrait)").matches) {
            if(this.state.participants && this.state.participants.length > 0 ) {
                let isHostAvail = this.state.participants.some(WebUI.hostInMeeting);
                //let participantCount = WebUI.removeDuplicateParticipants(this.state.participants).length;
                //let isNotLandscapeOrAudioCall = this.state.participants.every(p => p.is_audio_only_call.toUpperCase() === "NO" && p.selfAspectMode.toUpperCase() === "PORTRAIT");
                let isNotAudioCall = this.state.participants.every(p => p.is_audio_only_call.toUpperCase() === "NO" );
                let participantCount = this.state.participants.length;
                if(participantCount === 2 && this.screenMode ==='portrait' && isNotAudioCall && !this.state.showSharedContent && isHostAvail) {
                    let vh = window.innerHeight - 50;
                    this.remoteFeedMedia.current.style.setProperty('height', `${vh}px`);
                    this.remoteFeedMedia.current.style.setProperty('min-height', `${vh}px`); //just to avoid safari iPhone white space bug
                    return true;
                }
            }
        }
        this.remoteFeedMedia.current.style.removeProperty("min-height");
        this.remoteFeedMedia.current.style.removeProperty("height");
        return false;
    }

    render() {
        let remoteFeedClass, selfViewClass, Details = this.state.staticData;
        let remoteStreamContainerClass = this.state.moreparticpants ? 'mobile-remote-on-waiting-room stream-container' : 'stream-container';
        if(this.state.isPIPMode) {
            remoteStreamContainerClass = `${remoteStreamContainerClass} stream-containerPIP`;
            remoteFeedClass =  'remoteFeedPIP';
            selfViewClass =  'selfViewVideoPIP';
        }
        else{
            remoteFeedClass = 'remoteFeed';
            selfViewClass = 'selfViewVideo';
        }

        return (
            <div className="conference-page pl-0 container-fluid">
                <Notifier />
                {this.state.showLoader ? (<Loader />):('')}
                <InfoModal />
                <SurveyModal />
                <VVModal />
                <div className="conference-header row">
                    <div className="col-md-8 banner-content">
                        <div className="logo"></div>
                        <div className="title">
                            <p className="m-0">{Details.videoVisits}</p>
                            <p className="text-uppercase m-0 sub-title">The Permanente Medical Group</p>
                        </div>
                    </div>
                    <div className="col-md-4 links text-right">
                        <ul>
                            <li><a href={this.state.staticData.HelpLink} className="help-link" target="_blank">{this.state.staticData.Help}</a></li>
                            <li className="text-capitalize">|</li>
                            <li><a className="help-link" onClick={this.refreshPage}>{Details.conference.Refresh}</a></li>
                            <div className="lang-change p-0">
                            <span className="divider" onClick={this.changeLang.bind(this)}>{this.state.chin}</span>
                                    <span>|</span>
                                    <span className="spanishlabel" onClick={this.changeLang.bind(this)}>{this.state.span}</span>
                            </div>    
                            
                        </ul>
                    </div>
                </div>
                {this.state.meetingDetails ? (
                    <div className="row video-conference-container" >
                        <div className="col-md-10 p-0 video-conference" style={{visibility: this.state.showRemotefeed ? 'visible' : 'hidden'}}>
                            <ConferenceControls controls={this.state} data={Details} />
                            <div className="col-11 col-md-12 p-0 remote-feed-container" style={{visibility: this.state.showVideoFeed ? 'visible' : 'hidden'}}>
                                <WaitingRoom waitingroom={this.state} data={Details} />
                                    <div ref={this.presentationViewMedia} id="presentation-view" className="presentation-view" style={{display: this.state.showSharedContent ? 'flex' : 'none'}}></div>
                                        <div className={remoteStreamContainerClass} style={{display: this.state.videofeedflag ? 'block' : 'none'}}>
                                            <video ref ={this.remoteFeedMedia} data-view="larger"  className={remoteFeedClass} width="100%" height="100%"  id="video" autoPlay="autoplay" playsInline="playsinline"></video>
                                            {/* <video ref ={this.remoteFeedMedia} className="remoteFeed" width="100%" height="100%"  id="video" autoPlay="autoplay" playsInline="playsinline"></video> */}
                                        </div>
                                    <Settings data={Details} />
                            </div>
                            <div id="selfview"  className="self-view" style={{visibility: this.state.showVideoFeed ? 'visible' : 'hidden'}}>
                               <video ref={this.selfViewMedia} data-view="smaller" id="selfvideo" className={selfViewClass} style={{transform: this.state.isMirrorView ? 'scaleX(-1)' : 'none'}} autoPlay="autoplay" playsInline="playsinline" muted={true}> 
                                </video>
                               {/* <video ref={this.selfViewMedia} id="selfvideo" className="selfViewVideo" style={{transform: this.state.isMirrorView ? 'scaleX(-1)' : 'none'}} autoPlay="autoplay" playsInline="playsinline" muted={true}> 
                               </video> */}
                            </div>
                            <div id="controls" className="controls-bar">
                              <ul className="video-controls m-0">
                                <li style={{display: this.state.showvideoIcon ? 'block' : 'none'}}><span className="white-circle"><span id="camera"  className="icon-holder unmutedcamera" onClick={()=>this.toggleControls('video')}></span></span></li>
                                <li style={{display: this.state.showvideoIcon ? 'none' : 'block'}}><span className="white-circle"><span id="camera" className="icon-holder mutedcamera" onClick={()=>this.toggleControls('video')}></span></span></li>
                                {!this.state.isbrowsercheck && !this.state.isMobile ? (
                                <li><span className="white-circle"><span id="settings" className="icon-holder settings-btn" onClick={this.toggleSettings.bind(this)}></span></span></li>):('')}
                                 {this.state.isMobile ? (
                                <li ><span className="white-circle"><span id="cameraSwitch" className = {this.state.disableCamFlip && this.state.isMobileSafari ? 'icon-holder disable' : 'icon-holder'} onClick={()=>this.toggleCamera()}></span></span></li>):('')}
                                <li><span className="red-circle"><span id="endCall" className="icon-holder" onClick={()=>this.leaveMeeting('mobile')} ></span></span></li>
                                {/* <li style={{display: this.state.showaudioIcon ? 'block' : 'none'}}><span className="white-circle"><span id="speaker" className="icon-holder unmutedspeaker" onClick={()=>this.toggleControls('audio')} ></span></span></li>
                                <li style={{display: this.state.showaudioIcon ? 'none' : 'block'}}><span className="white-circle"><span id="speaker" className="icon-holder mutedspeaker" onClick={()=>this.toggleControls('audio')}></span></span></li>*/}
                                <li style={{display: this.state.showmicIcon ? 'block' : 'none'}}><span className="white-circle"><span id="mic" className="icon-holder unmutedmic" onClick={()=>this.toggleControls('microphone')} ></span></span></li>
                                <li style={{display: this.state.showmicIcon ? 'none' : 'block'}}><span className="white-circle"><span id="mic" className="icon-holder mutedmic" onClick={()=>this.toggleControls('microphone')} ></span></span></li>
                              </ul>
                            </div>
                            <div id="controls" className="landscape-controlbar col-1">
                              <ul className="video-controls m-0">
                                <li className="cam" style={{display: this.state.showmicIcon ? 'block' : 'none'}}><span className="white-circle"><span id="mic" className="icon-holder unmutedmic" onClick={()=>this.toggleControls('microphone')} ></span></span></li>
                                <li className="cam" style={{display: this.state.showmicIcon ? 'none' : 'block'}}><span className="white-circle"><span id="mic" className="icon-holder mutedmic" onClick={()=>this.toggleControls('microphone')} ></span></span></li>
                                {/* <li style={{display: this.state.showaudioIcon ? 'block' : 'none'}}><span className="white-circle"><span id="speaker" className="icon-holder unmutedspeaker" onClick={()=>this.toggleControls('audio')} ></span></span></li>
                                <li style={{display: this.state.showaudioIcon ? 'none' : 'block'}}><span className="white-circle"><span id="speaker" className="icon-holder mutedspeaker" onClick={()=>this.toggleControls('audio')}></span></span></li> */ }
                                <li><span className="red-circle"><span id="endCall" className="icon-holder" onClick={()=>this.leaveMeeting('mobile')} ></span></span></li>
                                {!this.state.isbrowsercheck && !this.state.isMobile ? (
                                <li><span className="white-circle"><span id="settings" className="icon-holder settings-btn" onClick={this.toggleSettings.bind(this)}></span></span></li>):('')}
                                {this.state.isMobile ? (
                                <li ><span className="white-circle"><span id="cameraSwitch" className = {this.state.disableCamFlip && this.state.isMobileSafari ? 'icon-holder disable' : 'icon-holder'} onClick={()=>this.toggleCamera()}></span></span></li>):('')}
                                <li style={{display: this.state.showvideoIcon ? 'block' : 'none'}}><span className="white-circle"><span id="camera"  className="icon-holder unmutedcamera" onClick={()=>this.toggleControls('video')}></span></span></li>
                                <li style={{display: this.state.showvideoIcon ? 'none' : 'block'}}><span className="white-circle"><span id="camera" className="icon-holder mutedcamera" onClick={()=>this.toggleControls('video')}></span></span></li>                                
                              </ul>
                            </div>
                        </div>
                        <ConferenceDetails conference={this.state} data={Details} />
                    </div>
            ): ('')
        } </div>
        )
    }
}

export default Conference;
