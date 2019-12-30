import React from "react";
/*import * as mainWebrtc from '../../../../pexip/complex/desktop-main-webrtc.js';*/
import Header from '../../../../components/header/header';
import Loader from '../../../../components/loader/loader';
import BackendService from '../../../../services/backendService.js';
import './conference.less';
import * as pexip from '../../../../pexip/complex/pexrtcV20.js';
import * as WebUI from '../../../../pexip/complex/webui.js';
import * as eventSource from '../../../../pexip/complex/EventSource.js';


class Conference extends React.Component {

    constructor(props) {
        super(props);
        this.state = { userDetails: {}, meetingDetails: {}, participants: [], showLoader: true };
        this.getHoursAndMinutes = this.getHoursAndMinutes.bind(this);
        this.getClinicianName = this.getClinicianName.bind(this);
        this.setSortedParticipantList = this.setSortedParticipantList.bind(this);
        this.leaveMeeting = this.leaveMeeting.bind(this);
        this.startPexip = this.startPexip.bind(this);
    }

    componentDidMount() {
        // Make AJAX call for meeting details
        if (localStorage.getItem('meetingDetails')) {
            this.setState({
                showLoader: false,
            });
            this.state.meetingDetails = JSON.parse(localStorage.getItem('meetingDetails'));
            this.state.participants = this.setSortedParticipantList();
            this.startPexip(this.state.meetingDetails);

        } else {
            this.props.history.push('/login');
        }
    }


    startPexip(meeting) {

        //console.log(sidePaneMeetingDetails);
        //$('html').removeClass("no-scroll");
        var guestPin = meeting.vendorGuestPin;
        localStorage.setItem('guestPin', guestPin);
        //$('#guestPin').val(guestPin);
        //var roomUrl = $('#guestUrl').val(); //vve-tpmg-dev.kp.org
        var roomUrl = "vve-tpmg-dev.kp.org";
        var alias = meeting.meetingVendorId; // "M.NCAL.MED.0.0.419872.278914" // "M.NCAL.MED.0.369638..1234";
        var bandwidth = "1280"; // $('#bandwidth').val();
        var source = "Join+Conference";
        //var name = $("#guestName").val();
        var name = meeting.member.inMeetingDisplayName;
        WebUI.initialise(roomUrl, alias, bandwidth, name, guestPin, source);
        //VideoVisit.setMinDimensions();
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
                name += guest.hasOwnProperty('title') ? ' ' + guest.title : ' ';
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
            str = Hour + ':' + Minutes + AMPM + ', ';
        } else {
            str = String(DateObj).substr(0, 10);
        }

        return str;
    }

    leaveMeeting() {
        this.props.history.push('/myMeetings');
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
                            <li><a href="https://mydoctor.kaiserpermanente.org/ncal/videovisit/#/faq/mobile" className="help-link" target="_blank">Refresh</a></li>
                        </ul>
                    </div>
                </div>
                {this.state.meetingDetails ? (
                    <div className="row video-conference-container">
                        <div className="col-md-10 p-0 video-conference">
                            <div className="button-container"></div>
                            <div className="stream-container">
                             <video className="remoteFeed" width="100%" height="100%" id="video" autoPlay="autoplay" playsInline="playsinline" poster="img/spinner.gif"></video>
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
                    ) : ('')}
            </div>
        )
    }
}

export default Conference;