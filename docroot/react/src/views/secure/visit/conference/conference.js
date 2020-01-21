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
import Notifier from '../../../../components/notifier/notifier';
import GlobalConfig from '../../../../services/global.config';
import { MessageService } from '../../../../services/message-service.js';

class Conference extends React.Component {

    constructor(props) {
        super(props);
        this.state = { userDetails: {}, isRunningLate: false, loginType: '', accessToken: null, isProxyMeeting: '', runLateMeetingTime: '', meetingId: null, meetingDetails: {}, participants: [], showLoader: true, runningLatemsg: '', runningLateUpdatedTime: '', hostavail: false, moreparticpants: false, videofeedflag: false,showvideoIcon:true,showaudioIcon:true,showmicIcon:true };
        this.getHoursAndMinutes = this.getHoursAndMinutes.bind(this);
        this.getClinicianName = this.getClinicianName.bind(this);
        this.setSortedParticipantList = this.setSortedParticipantList.bind(this);
        this.leaveMeeting = this.leaveMeeting.bind(this);
        this.startPexip = this.startPexip.bind(this);
    }

    componentDidMount() {
        // Make AJAX call for meeting details
        if (localStorage.getItem('meetingId')) {
            this.setState({
                showLoader: false,
            });
            this.state.meetingId = JSON.parse(localStorage.getItem('meetingId'));
            var sessionInfo = JSON.parse(localStorage.getItem('sessionInfo'));
            if (sessionInfo != null) {
                this.state.loginType = sessionInfo.loginType;
                this.state.accessToken = sessionInfo.accessToken;
            }
            this.getInMeetingDetails();
            this.getRunningLateInfo();
            window.setInterval(() => {
                this.getRunningLateInfo();
            }, GlobalConfig.RUNNING_LATE_TIMER);

        } else {
            this.props.history.push(GlobalConfig.LOGIN_URL);
        }

        if (localStorage.getItem('isProxyMeeting')) {
            this.state.isProxyMeeting = JSON.parse(localStorage.getItem('isProxyMeeting'));
        }

        this.subscription = MessageService.getMessage().subscribe((message, data) => {
            switch (message.text) {
                case GlobalConfig.HOST_AVAIL:
                    this.setState({ hostavail: true });
                    this.toggleDockView(false);
                    this.setState({ videofeedflag: true });
                    break;
                case GlobalConfig.HOST_LEFT:
                    this.setState({ hostavail: false });
                    this.setState({ moreparticpants: false });
                    this.toggleDockView(false);
                    this.setState({ videofeedflag: false });
                    break;
                case GlobalConfig.HAS_MORE_PARTICIPANTS:
                    this.setState({ hostavail: false });
                    this.setState({ moreparticpants: true });
                    this.toggleDockView(true);
                    break;
               case GlobalConfig.VIDEO_MUTE:
                   this.setState({showvideoIcon: false});
                   break;
               case GlobalConfig.VIDEO_UNMUTE:
                   this.setState({showvideoIcon: true});
                   break;
               case GlobalConfig.AUDIO_MUTE:             
                   this.setState({showaudioIcon:false});
                   break;
               case GlobalConfig.AUDIO_UNMUTE:             
                   this.setState({showaudioIcon:true});
                   break;
                case GlobalConfig.MICROPHONE_MUTE:             
                   this.setState({showmicIcon:false});
                   break;
               case GlobalConfig.MICROPHONE_UNMUTE:             
                   this.setState({showmicIcon:true});
                   break;        
            }

        });
    }

    toggleDockView(isDock) {
        if (isDock) {
            var ele = document.getElementsByClassName('video-conference')[0];
            var dockHeight = ele.offsetHeight / 2;
            var wRoom = document.getElementsByClassName('conference-waiting-room')[0];
            wRoom.style.height = dockHeight / 16 + 'rem';
            var remoteFeed = document.getElementsByClassName('stream-container')[0];
            remoteFeed.style.height = dockHeight / 16 + 'rem';
        } else {
            var wRoom = document.getElementsByClassName('conference-waiting-room')[0];
            wRoom.style.height = '100%';
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
                this.setState({
                    meetingDetails: data
                });
                var sortedParticipants = this.setSortedParticipantList();
                this.setState({
                    participants: sortedParticipants
                });
                this.startPexip(this.state.meetingDetails);

            } else {

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
                    this.setState({
                        isRunningLate: true,
                        runLateMeetingTime: data.runLateMeetingTime,
                        runningLatemsg: "We're sorry, your doctor is running late."
                    });
                    this.updateRunningLateTime();                    
                }
            } else {

            }
        }, (err) => {
            console.log("Error");
        });
    }


    startPexip(meeting) {
        localStorage.setItem('guestPin', meeting.vendorGuestPin);
        localStorage.setItem('memberName', JSON.stringify(meeting.member.inMeetingDisplayName));
        var guestPin = meeting.vendorGuestPin,
            roomJoinUrl = meeting.roomJoinUrl,
            alias = meeting.meetingVendorId,
            bandwidth = "1280",
            source = "Join+Conference",
            name = meeting.member.inMeetingDisplayName;
        var userType = this.state.isProxyMeeting == 'Y' ? (meeting.member.mrn ? 'Patient_Proxy' : 'Non_Patient_Proxy') : 'Patient';
        var vendorDetails = {
            "meetingId": meeting.meetingId,
            "userType": userType,
            "userId": meeting.member.mrn
        };
        localStorage.setItem('vendorDetails', JSON.stringify(vendorDetails));
        WebUI.initialise(roomJoinUrl, alias, bandwidth, name, guestPin, source);
        //Visit.setMinDimensions();
    }

    componentWillUnmount() {
        // clear on component unmount
    }

    setSortedParticipantList() {
        let list = [];
        let clinicians = this.state.meetingDetails.participant ? this.state.meetingDetails.participant.slice(0) : [];
        let guests = this.state.meetingDetails.caregiver ? this.state.meetingDetails.caregiver.slice(0) : [];
        let participants = clinicians.concat(guests);
        if (participants) {
            participants.map(guest => {
                let name = guest.firstName.toLowerCase() + ' ' + guest.lastName.toLowerCase();
                name += guest.hasOwnProperty('title') ? guest.title ? ' ' + guest.title : ' ' : ' ';
                list.push({ name: name.trim() });
            });
            list.sort((a, b) => (a.name > b.name) ? 1 : -1);
        }
        return list;
    }

    getClinicianName(host) {
        if (!host) {
            return;
        }
        let clinician = '';
        clinician += host.firstName ? host.firstName.toLowerCase() : '';
        clinician += host.lastName ? ' ' + host.lastName.toLowerCase() : '';
        clinician += host.title ? ', ' + host.title : '';
        return clinician.trim();
    }

    getHoursAndMinutes(millis, type) {
        if (!millis) {
            return;
        }
        let DateObj = new Date(parseInt(millis));
        let str = '';
        let week = '';
        let month = '';
        let monthstr = '';
        let HourStr = '';
        if (type == 'time') {
            let Hour = (DateObj.getHours() > 12 ? parseInt(DateObj.getHours()) - 12 : DateObj.getHours());
            if (Hour == 0) {
                Hour = 12;
            }
            if (Hour <= 9) {
                Hour = "0" + Hour;
            }
            let Minutes = DateObj.getMinutes();
            if (Minutes <= 9) {
                Minutes = "0" + Minutes;
            }
            let AMPM = DateObj.getHours() > 11 ? "PM" : "AM";
            if (Hour >= 10) {
                HourStr = Hour;
            } else {
                HourStr = Hour.replace("0", "");
            }
            //let HourStr =  ? Hour : Hour.replace("0","");
            str = HourStr + ':' + Minutes + AMPM + ', ';
        } else {
            week = String(DateObj).substring(0, 3);
            monthstr = String(DateObj).substr(4, 6);
            month = monthstr.replace("0", "");
            str = week + ', ' + month;
        }

        return str;
    }
    updateRunningLateTime() {
        if (!this.state.isRunningLate || !this.state.runLateMeetingTime) {
            return;
        }
        var meetingTime = new Date(parseInt(this.state.runLateMeetingTime));
        var hours = meetingTime.getHours();
        var minutes = meetingTime.getMinutes();
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        var ampmval = 'AM';
        if (hours > 11) {
            ampmval = 'PM';
            hours = hours - 12;
        }
        hours = (hours == 0) ? 12 : hours;
        this.setState({
            runningLateUpdatedTime: hours + ':' + minutes + ' ' + ampmval
        });
    }

    leaveMeeting() {
        var headers = {},
            loginType = this.state.loginType;
        if (loginType == 'tempAccess') {
            headers.authtoken = this.state.accessToken;
        } else {
            headers.ssoSession = this.state.accessToken;
        }
        var meetingId = this.state.meetingDetails.meetingId,
            memberName = this.state.meetingDetails.member.inMeetingDisplayName,
            isProxyMeeting = this.state.isProxyMeeting;
        BackendService.quitMeeting(meetingId, memberName, isProxyMeeting, headers, loginType).subscribe((response) => {
            console.log("Success");
            window.location.reload(false);
        }, (err) => {
            console.log("Error");
            window.location.reload(false);
        });
        WebUI.pexipDisconnect();
        var browserInfo = Utilities.getBrowserInformation();
        if (browserInfo.isSafari || browserInfo.isFireFox) {
            localStorage.removeItem('selectedPeripherals');
        }
        this.props.history.push(GlobalConfig.MEETINGS_URL);

    }
    refreshPage() {
        window.location.reload(false);
    }
    disablecontrols(cntrlname){
        switch (cntrlname) {
            case GlobalConfig.VIDEO:
                WebUI.muteUnmuteVideo();
                break;
            case GlobalConfig.AUDIO:
                WebUI.muteSpeaker();
                break;
            case GlobalConfig.MICROPHONE:
                WebUI.muteUnmuteMic();
                break;    
                
        }                
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
                            <li><a href="https://mydoctor.kaiserpermanente.org/ncal/videovisit/#/faq/mobile" className="help-link" target="_blank">Help</a></li>
                            <li className="text-capitalize">|</li>
                            <li><a className="help-link" onClick={this.refreshPage}>Refresh</a></li>
                        </ul>
                    </div>
                </div>
                {this.state.meetingDetails ? (
                    <div className="row video-conference-container">
                        <div className="col-md-10 p-0 video-conference">
                            <div className="button-container">
                            <div className="button-group" >
                                <div className="media-toggle">
                                    <div title="Enable Video" style={{display: this.state.showvideoIcon ? 'block' : 'none'}} className="btns media-controls video-btn" onClick={()=>this.disablecontrols('video')}></div>
                                    <div title="Disable Video" style={{display: this.state.showvideoIcon ? 'none' : 'block'}} className="btns media-controls video-muted-btn" onClick={()=>this.disablecontrols('video')}></div>   
                                </div>
                                <div className="media-toggle">
                                    <div title="Mute Speakers" style={{display: this.state.showaudioIcon ? 'block' : 'none'}}  className="btns media-controls speaker-btn" onClick={()=>this.disablecontrols('audio')}></div>
                                    <div title="Unmute Speakers" style={{display: this.state.showaudioIcon ? 'none' : 'block'}} className="btns media-controls speaker-muted-btn" onClick={()=>this.disablecontrols('audio')}></div>
                                </div>
                                <div className="media-toggle">
                                    <div title="Mute Mic" style={{display: this.state.showmicIcon ? 'block' : 'none'}} className="btns media-controls microphone-btn" onClick={()=>this.disablecontrols('microphone')}></div>
                                    <div title="Unmute Mic" style={{display: this.state.showmicIcon ? 'none' : 'block'}} className="btns media-controls microphone-muted-btn" onClick={()=>this.disablecontrols('microphone')}></div>
                                </div>
                                <div className="media-toggle">
                                    <div title="Settings" className="btns media-controls settings-btn"></div>
                                </div>
                            </div>
                            </div>
                            <div className="col p-0">
                                <WaitingRoom waitingroom={this.state} />
                                <div className="stream-container" style={{display: this.state.videofeedflag ? 'block' : 'none'}}>
                                 <video className="remoteFeed" width="100%" height="100%" id="video" autoPlay="autoplay" playsInline="playsinline"></video>
                                </div>
                            </div>
                            <div id="selfview" className="self-view">
                           <video id="selfvideo" autoPlay="autoplay" playsInline="playsinline" muted={true}>
                        </video>
                        </div>
                        </div>
                        <div className="col-md-2 p-0 conference-details">
                            <div className="clinician-information">
                                <button className="btn leave-button" onClick={this.leaveMeeting}>Leave Room</button>
                                <div className="visit-details">
                                    <p className="text-capitalize mt-1 mb-1">Visit details</p>
                                    <div className="clinician-info text-capitalize">{this.getClinicianName(this.state.meetingDetails.host)}</div>
                                    <div className="visit-time text-capitalize">
                                        <b>{this.getHoursAndMinutes(this.state.meetingDetails.meetingTime, 'time')}</b>
                                        <span>{this.getHoursAndMinutes(this.state.meetingDetails.meetingTime, 'date')}</span>
                                    </div>
                                    <div style={{display: this.state.isRunningLate ? 'block' : 'none' }}>
                                        <span className="time-display">updated: {this.state.runningLateUpdatedTime}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="participants-information">
                                <p className="header mb-0">Guests</p>
                                <div className="participant-details" aria-labelledby="dropdownMenuButton">
                                    { this.state.participants && this.state.participants.length > 0 ? 
                                        this.state.participants.map((item,key) =>{
                                        return (
                                            <div className="participant text-capitalize mt-2" key={key}>{item.name}</div>
                                        )
                                    }) 
                                     : ('') 
                                    }
                               </div>
                            </div>
                        </div>
                    </div>
            ): ('')
        } </div>
        )
    }
}

export default Conference;