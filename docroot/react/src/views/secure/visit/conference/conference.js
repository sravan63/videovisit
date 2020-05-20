import React from "react";
/*import * as mainWebrtc from '../../../../pexip/complex/desktop-main-webrtc.js';*/
import Header from '../../../../components/header/header';
import Loader from '../../../../components/loader/loader';
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
        this.state = { userDetails: {}, isRearCamera:false, isMobileSafari:false, disableCamFlip:true, showvideoIcon: true, media: {}, showaudioIcon: true, showmicIcon: true, isGuest: false, isIOS: false, isMobile: false, leaveMeeting: false, meetingCode: '', isRunningLate: false, loginType: '', accessToken: null, isProxyMeeting: '', meetingId: null, meetingDetails: {}, participants: [], showLoader: true, runningLatemsg: '', hostavail: false, moreparticpants: false, videofeedflag: false, isbrowsercheck: false, showSharedContent: false,mdoHelpUrl:'' };
        this.getInMeetingGuestName = this.getInMeetingGuestName.bind(this);
        this.startPexip = this.startPexip.bind(this);
        this.hideSettings = true;
        this.list = [];
        this.handle = 0;
        this.runningLate = 0;
    }

    componentDidMount() {
        // Make AJAX call for meeting details
        if (localStorage.getItem('meetingId')) {
            this.setState({ showLoader: false });
            if (localStorage.getItem('isGuest')) {
                this.state.isGuest = true;
                this.state.loginType = "guest";
                sessionStorage.removeItem('guestLeave');
            }
            this.state.meetingId = JSON.parse(localStorage.getItem('meetingId'));
            var userDetails = JSON.parse(Utilities.decrypt(localStorage.getItem('userDetails')));
            if (userDetails != null) {
                this.state.meetingCode = this.state.isGuest ? userDetails.meetingCode : null;
                if(this.state.isGuest == true){
                    this.state.loginType = "guest";
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

        this.subscription = MessageService.getMessage().subscribe((message) => {
            switch (message.text) {
                case GlobalConfig.HOST_AVAIL:
                    this.setState({ hostavail: true, videofeedflag: true, moreparticpants: false });
                    this.toggleDockView(false);
                    this.handleTimer(false);
                    break;
                case GlobalConfig.HOST_LEFT:
                    this.setState({ hostavail: false, moreparticpants: false, videofeedflag: false });
                    this.toggleDockView(false);
                    this.handleTimer(true);
                    break;
                case GlobalConfig.HAS_MORE_PARTICIPANTS:
                    this.setState({ hostavail: false, moreparticpants: true });
                    const isDock = window.innerWidth > 1024; // passes true only for desktop
                    this.toggleDockView(isDock);
                    this.handleTimer(false);
                    break;
                case GlobalConfig.LEAVE_VISIT:
                    this.leaveMeeting();
                    break;
                case GlobalConfig.MEMBER_READY:
                    if(!sessionStorage.getItem('memberAlone')){
                    sessionStorage.setItem('memberAlone', true);
                    this.handleTimer(true);
                    }
                    break;       
                case GlobalConfig.START_SCREENSHARE:
                    this.setState({ showSharedContent: true });
                    break;
                case GlobalConfig.STOP_SCREENSHARE:
                    this.setState({ showSharedContent: false });
                    break;
                case GlobalConfig.MEDIA_DATA_READY:  
                    this.list = message.data;
                    this.setState({ media: this.list });
                    let constrains = {
                            audioSource: this.list.audiooutput ? this.list.audiooutput[0] : null,
                            videoSource: this.list.videoinput ? this.list.videoinput[0] : null,
                            micSource: this.list.audioinput ? this.list.audioinput[0] : null
                        };
                    localStorage.setItem('selectedPeripherals', JSON.stringify(constrains));
                    this.startPexip(this.state.meetingDetails); 
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
        
            }

        });
        window.addEventListener('resize', this.handleResize.bind(this));
        this.getBrowserBlockInfo();
    }
    getBrowserBlockInfo(){
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
    }
    handleResize(){
        if(this.state.moreparticpants){
            const isDock = window.innerWidth > 1024; // passes true only for desktop
            this.toggleDockView(isDock);
        }

    } 

    handleTimer(param){
        if(param){
        this.handle = setInterval(() => {
                this.leaveMeeting();
            }, GlobalConfig.SIGNOUT_MEMBER_ALONE);
        }
        else{
            window.clearInterval(this.handle);
        }
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
                if (localStorage.getItem('selectedPeripherals')) {
                    this.startPexip(this.state.meetingDetails);
                }
                else{
                    MediaService.loadDeviceMediaData();
                }
                var turnServerInfo = data.vendorConfig;
                sessionStorage.setItem('turnServer', JSON.stringify(turnServerInfo));
                var isDirectLaunch = localStorage.getItem('isDirectLaunch');
                if( !isDirectLaunch ) {
                    MessageService.sendMessage(GlobalConfig.SHOW_CONFERENCE_DETAILS, {
                        meetingDetails: this.state.meetingDetails
                    });
                }
            } else {
                // Do nothing
            }
        }, (err) => {
            console.log("Error");
        });

    }

    getRunningLateInfo() {
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
            bandwidth = "1280",
            source = "Join+Conference",
            name;
        if (this.state.isGuest == false) {
            if(this.state.isProxyMeeting == 'Y'){
                name = this.state.userDetails.lastName + ', ' + this.state.userDetails.firstName;
            } else {
                name = Utilities.formatStringTo(meeting.member.inMeetingDisplayName, GlobalConfig.STRING_FORMAT[0]);
            }
            localStorage.setItem('memberName', JSON.stringify(name));
            var userType = this.state.isProxyMeeting == 'Y' ? (meeting.member.mrn ? 'Patient_Proxy' : 'Non_Patient_Proxy') : 'Patient';
            var vendorDetails = {
                "meetingId": meeting.meetingId,
                "userType": userType,
                "userId": meeting.member.mrn
            };
            localStorage.setItem('vendorDetails', JSON.stringify(vendorDetails));
        } else {
            var guestName = this.getInMeetingGuestName(meeting.caregiver);
            localStorage.setItem('memberName', JSON.stringify(guestName));
            name = Utilities.formatStringTo(guestName, GlobalConfig.STRING_FORMAT[0]);
            var vendorDetails = {
                "meetingId": meeting.meetingId,
                "userType": "Caregiver",
                "userId": name
            };
            localStorage.setItem('vendorDetails', JSON.stringify(vendorDetails));
        }
        MessageService.sendMessage(GlobalConfig.ACCESS_MEMBER_NAME, null);
        WebUI.initialise(roomJoinUrl, alias, bandwidth, name, guestPin, source);
    }

    componentWillUnmount() {
        // clear on component unmount
        window.clearInterval(this.handle);
        window.clearInterval(this.runningLate);
        this.subscription.unsubscribe();
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
       window.removeEventListener('resize', this.handleResize.bind(this), false);
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

    leaveMeeting(isFromBackButton) {
        this.setState({ leaveMeeting: true });
        sessionStorage.removeItem('memberAlone');
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
            } else {
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
                if (response.data && response.data.statusCode == '200') {
                    if (this.state.loginType == GlobalConfig.LOGIN_TYPE.TEMP) {
                    this.resetSessionToken(response.headers.authtoken);
                    }
                Utilities.setPromotionFlag(true);
                this.props.history.push(GlobalConfig.MEETINGS_URL);
                }
                else{
                    this.props.history.push(GlobalConfig.LOGIN_URL);
                }
                //window.location.reload(false);
            }, (err) => {
                console.log("Error");
                Utilities.setPromotionFlag(false);
                this.props.history.push(GlobalConfig.LOGIN_URL);
                //window.location.reload(false);
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
                this.props.history.push('/guestlogin?meetingcode=' + this.state.meetingCode);
                // window.location.reload(false);
            }, (err) => {
                console.log("Error");
                this.props.history.push('/guestlogin?meetingcode=' + this.state.meetingCode);
                //window.location.reload(false);
            });
        }
        
        localStorage.removeItem('selectedPeripherals');

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
            alert(vObject.label);
            alert(isRear);
            if(isRear && this.state.isRearCamera == true){
            document.getElementById('selfvideo').style.transform = "none";
            }else{
            document.getElementById('selfvideo').style.transform = "scaleX(-1)";
            }
        }
        else{
            if(this.state.isRearCamera == true){
            document.getElementById('selfvideo').style.transform = "none";
            }else{
            document.getElementById('selfvideo').style.transform = "scaleX(-1)";
            }
        }
        
        WebUI.switchDevices('video', videoSource);
    }

    

    render() {
        return (
            <div className="conference-page pl-0 container-fluid">
                <Notifier />
                {this.state.showLoader ? (<Loader />):('')}
                <div className="conference-header row">
                    <div className="col-md-8 banner-content">
                        <div className="logo"></div>
                        <div className="title">
                            <p className="m-0">Video Visits</p>
                            <p className="text-uppercase m-0 sub-title">The Permanente Medical Group</p>
                        </div>
                    </div>
                    <div className="col-md-4 links text-right">
                        <ul>
                            <li><a href={this.state.mdoHelpUrl} className="help-link" target="_blank">Help</a></li>
                            <li className="text-capitalize">|</li>
                            <li><a className="help-link" onClick={this.refreshPage}>Refresh</a></li>
                        </ul>
                    </div>
                </div>
                {this.state.meetingDetails ? (
                    <div className="row video-conference-container">
                        <div className="col-md-10 p-0 video-conference">
                            <ConferenceControls controls={this.state}/>
                            <div className="col p-0 remote-feed-container">
                                <WaitingRoom waitingroom={this.state} />
                                <div id="presentation-view" className="presentation-view" style={{display: this.state.showSharedContent ? 'flex' : 'none'}}></div>
                                <div className={this.state.moreparticpants ? 'mobile-remote-on-waiting-room stream-container' : 'stream-container'} style={{display: this.state.videofeedflag ? 'block' : 'none'}}>
                                 <video className="remoteFeed" width="100%" height="100%" id="video" autoPlay="autoplay" playsInline="playsinline"></video>
                                </div>
                                <Settings />
                            </div>
                            <div id="selfview" className="self-view">
                               <video id="selfvideo" autoPlay="autoplay" playsInline="playsinline" muted={true}>
                               </video>
                            </div>
                            <div id="controls" className="controls-bar">
                              <ul className="video-controls m-0">
                                <li style={{display: this.state.showvideoIcon ? 'block' : 'none'}}><span className="white-circle"><span id="camera"  className="icon-holder unmutedcamera" onClick={()=>this.toggleControls('video')}></span></span></li>
                                <li style={{display: this.state.showvideoIcon ? 'none' : 'block'}}><span className="white-circle"><span id="camera" className="icon-holder mutedcamera" onClick={()=>this.toggleControls('video')}></span></span></li>
                                {!this.state.isbrowsercheck && !this.state.isMobile ? (
                                <li><span className="white-circle"><span id="settings" className="icon-holder settings-btn" onClick={this.toggleSettings.bind(this)}></span></span></li>):('')}
                                <li ><span className="white-circle"><span id="cameraSwitch" className = {this.state.disableCamFlip && this.state.isMobileSafari ? 'icon-holder disable' : 'icon-holder'} onClick={()=>this.toggleCamera()}></span></span></li>
                                <li><span className="red-circle"><span id="endCall" className="icon-holder" onClick={()=>this.leaveMeeting('mobile')} ></span></span></li>
                                <li style={{display: this.state.showaudioIcon ? 'block' : 'none'}}><span className="white-circle"><span id="speaker" className="icon-holder unmutedspeaker" onClick={()=>this.toggleControls('audio')} ></span></span></li>
                                <li style={{display: this.state.showaudioIcon ? 'none' : 'block'}}><span className="white-circle"><span id="speaker" className="icon-holder mutedspeaker" onClick={()=>this.toggleControls('audio')}></span></span></li>
                                <li style={{display: this.state.showmicIcon ? 'block' : 'none'}}><span className="white-circle"><span id="mic" className="icon-holder unmutedmic" onClick={()=>this.toggleControls('microphone')} ></span></span></li>
                                <li style={{display: this.state.showmicIcon ? 'none' : 'block'}}><span className="white-circle"><span id="mic" className="icon-holder mutedmic" onClick={()=>this.toggleControls('microphone')} ></span></span></li>
                              </ul>
                            </div>
                            <div id="controls" className="landscape-controlbar">
                              <ul className="video-controls m-0">
                                <li className="cam" style={{display: this.state.showmicIcon ? 'block' : 'none'}}><span className="white-circle"><span id="mic" className="icon-holder unmutedmic" onClick={()=>this.toggleControls('microphone')} ></span></span></li>
                                <li className="cam" style={{display: this.state.showmicIcon ? 'none' : 'block'}}><span className="white-circle"><span id="mic" className="icon-holder mutedmic" onClick={()=>this.toggleControls('microphone')} ></span></span></li>
                                <li style={{display: this.state.showaudioIcon ? 'block' : 'none'}}><span className="white-circle"><span id="speaker" className="icon-holder unmutedspeaker" onClick={()=>this.toggleControls('audio')} ></span></span></li>
                                <li style={{display: this.state.showaudioIcon ? 'none' : 'block'}}><span className="white-circle"><span id="speaker" className="icon-holder mutedspeaker" onClick={()=>this.toggleControls('audio')}></span></span></li>
                                <li><span className="red-circle"><span id="endCall" className="icon-holder" onClick={()=>this.leaveMeeting('mobile')} ></span></span></li>
                                {!this.state.isbrowsercheck && !this.state.isMobile ? (
                                <li><span className="white-circle"><span id="settings" className="icon-holder settings-btn" onClick={this.toggleSettings.bind(this)}></span></span></li>):('')}
                                <li ><span className="white-circle"><span id="cameraSwitch" className = {this.state.disableCamFlip && this.state.isMobileSafari ? 'icon-holder disable' : 'icon-holder'} onClick={()=>this.toggleCamera()}></span></span></li>
                                <li style={{display: this.state.showvideoIcon ? 'block' : 'none'}}><span className="white-circle"><span id="camera"  className="icon-holder unmutedcamera" onClick={()=>this.toggleControls('video')}></span></span></li>
                                <li style={{display: this.state.showvideoIcon ? 'none' : 'block'}}><span className="white-circle"><span id="camera" className="icon-holder mutedcamera" onClick={()=>this.toggleControls('video')}></span></span></li>
                              </ul>
                            </div>
                        </div>
                        <ConferenceDetails/>
                    </div>
            ): ('')
        } </div>
        )
    }
}

export default Conference;