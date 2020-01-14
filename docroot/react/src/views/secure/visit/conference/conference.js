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
import WaitingRoom from '../../../waiting-room/waiting-room.js';
import { MessageService } from '../../../../services/message-service.js';

class Conference extends React.Component {

    constructor(props) {
        super(props);
        this.state = { userDetails: {}, isRunningLate: false, isProxyMeeting:'',runLateMeetingTime: '', meetingId: null, meetingDetails: {}, participants: [], showLoader: true,runningLatemsg:'',runningLateUpdatedTime:'' };
        this.getHoursAndMinutes = this.getHoursAndMinutes.bind(this);
        this.getClinicianName = this.getClinicianName.bind(this);
        this.setSortedParticipantList = this.setSortedParticipantList.bind(this);
        this.leaveMeeting = this.leaveMeeting.bind(this);
        this.startPexip = this.startPexip.bind(this);
        this.state = {hostavail: false,moreparticpants: false};
    }

    componentDidMount() {
        // Make AJAX call for meeting details
        if (localStorage.getItem('meetingId')) {
            this.setState({
                showLoader: false,
            });
            this.state.meetingId = JSON.parse(localStorage.getItem('meetingId'));
            this.getInMeetingDetails();
            this.getRunningLateInfo();
            window.setInterval(() => {
                this.getRunningLateInfo();
            }, 120000);

        } else {
            this.props.history.push('/login');
        }

        if (localStorage.getItem('isProxyMeeting')) {
            this.state.isProxyMeeting = JSON.parse(localStorage.getItem('isProxyMeeting'));
        }

        this.subscription = MessageService.getMessage().subscribe((message, data) => {
            console.log(message);            
            if(message.text == 'Host Availble'){
                this.setState({ hostavail: true}); 
            }
            else if(message.text == 'Host left'){
                this.setState({ hostavail: false}); 
            }
            else if(message.text == 'More participants'){
                this.setState({ moreparticpants: true}); 
            }
        });
        //console.log(this.state.waitingroommsg);
    }

    getInMeetingDetails() {
        var meetingId = this.state.meetingId,
            url = "meetingDetails.json";
        BackendService.getMeetingDetails(url, meetingId).subscribe((response) => {
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
            url = "providerRunningLateInfo.json";
        BackendService.getRunningLateInfo(url, meetingId).subscribe((response) => {
            if (response.data && response.data.statusCode == '200') {
                var data = response.data.data;
                if (data.isRunningLate == true) {
                    this.setState({
                        isRunningLate: true,
                        runLateMeetingTime: data.runLateMeetingTime,
                        runningLatemsg:"We're sorry, your doctor is running late."
                    });
                    this.updateRunningLateTime();
                    //MessageService.sendMessage("running late", "We're sorry, your doctor is running late.");
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
            roomJoinUrl = "vve-tpmg-dev.kp.org",
            alias = meeting.meetingVendorId,
            bandwidth = "1280",
            source = "Join+Conference",
            name = meeting.member.inMeetingDisplayName;
        var userType = this.state.isProxyMeeting == 'Y'?(meeting.member.mrn?'Patient_Proxy':'Non_Patient_Proxy'):'Patient';    
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
            if(Hour >= 10){
                 HourStr = Hour;
            }else{
                 HourStr = Hour.replace("0","");
            }
            //let HourStr =  ? Hour : Hour.replace("0","");
            str = HourStr + ':' + Minutes + AMPM + ', ';
        } else {
            week = String(DateObj).substring(0, 3);
            monthstr = String(DateObj).substr(4, 6);
            month = monthstr.replace("0","");
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
            runningLateUpdatedTime:  hours + ':' + minutes +' ' + ampmval
        });
        //console.log(this.state.runningLateUpdatedTime);
        
        // $('.meeting-updated-time-date-info .time-display').text('updated: ' + hours + ':' + minutes + ampmval);
        // $('.meeting-updated-time-date-info').show();
    }

    leaveMeeting() {
        var meetingId = this.state.meetingDetails.meetingId,
            memberName = this.state.meetingDetails.member.inMeetingDisplayName,
            isProxyMeeting = this.state.isProxyMeeting;
        BackendService.quitMeeting(meetingId, memberName, isProxyMeeting).subscribe((response) => {
                console.log("Success");
            }, (err) => {
                console.log("Error");
        });
        WebUI.pexipDisconnect();
        var browserInfo = Utilities.getBrowserInformation();
        if (browserInfo.isSafari || browserInfo.isFireFox) {
            localStorage.removeItem('selectedPeripherals');
        }
        this.props.history.push('/myMeetings');
        window.location.reload(false);
    }
    refreshPage() {
        window.location.reload(false);
    }


    render() {
            return (
                <div className="conference-page pl-0 container-fluid">
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
                                    <div title="Enable Video" className="btns media-controls video-btn"></div>
                                    <div title="Disable Video" className="btns media-controls video-muted-btn"></div>   
                                </div>
                                <div className="media-toggle">
                                    <div title="Mute Speakers" className="btns media-controls speaker-btn"></div>
                                    <div title="Unmute Speakers" className="btns media-controls speaker-muted-btn"></div>
                                </div>
                                <div className="media-toggle">
                                    <div title="Mute Mic" className="btns media-controls microphone-btn"></div>
                                    <div title="Unmute Mic" className="btns media-controls microphone-muted-btn"></div>
                                </div>
                                <div className="media-toggle">
                                    <div title="Settings" className="btns media-controls settings-btn"></div>
                                </div>
                            </div>
                            </div>
                            <WaitingRoom  waitingroom={this.state} />
                            <div className="stream-container" style={{display: this.state.hostavail ? 'block' : 'none' }}>
                             <video className="remoteFeed" width="100%" height="100%" id="video" autoPlay="autoplay" playsInline="playsinline"></video>
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