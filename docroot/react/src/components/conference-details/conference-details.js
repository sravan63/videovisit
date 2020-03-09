import React from 'react';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './conference-details.less';
import { range } from 'rxjs';
import { MessageService } from '../../services/message-service.js';
import GlobalConfig from '../../services/global.config';
import Utilities from '../../services/utilities-service.js';

class ConferenceDetails extends React.Component {
    constructor(props) {
        super(props);       
        this.getHoursAndMinutes = this.getHoursAndMinutes.bind(this);
        this.getClinicianName = this.getClinicianName.bind(this);
        this.setSortedParticipantList = this.setSortedParticipantList.bind(this);
        this.state = { isRunningLate: false, runLateMeetingTime: '', runningLateUpdatedTime: '', meetingDetails: {}, participants: [] };
    }

    componentDidMount() {
        this.subscription = MessageService.getMessage().subscribe((notification) => {
            switch(notification.text) {
                case GlobalConfig.SHOW_CONFERENCE_DETAILS:
                    this.setState({
                        meetingDetails: notification.data.meetingDetails
                    });
                    this.setState({
                        participants: this.setSortedParticipantList()
                    });
                break;
                case GlobalConfig.UPDATE_RUNNING_LATE:
                    this.setState({
                        isRunningLate: true,
                        runLateMeetingTime: notification.data.runLateMeetingTime
                    });
                    this.updateRunningLateTime();
                break;
                case GlobalConfig.USER_JOINED:
                    this.validatePresence(GlobalConfig.USER_JOINED, notification.data);
                break;
                case GlobalConfig.USER_LEFT:
                    this.validatePresence(GlobalConfig.USER_LEFT, notification.data);
                break;
            }
        });
        
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
                let backupName = guest.lastName.toLowerCase() + ', ' + guest.firstName.toLowerCase();
                backupName += guest.hasOwnProperty('title') ? guest.title ? ' ' + guest.title : ' ' : ' ';
                list.push({ name: name.trim(), inCall: false, isTelephony: false, backupName: backupName });
            });
            list.sort((a, b) => (a.name > b.name) ? 1 : -1);
        }
        // Add Telephony guest to the participant's list.
        if(this.state.meetingDetails.sipParticipants){
            let telephonyGuests = [];
            this.state.meetingDetails.sipParticipants.map(guest => {
                let name = guest.displayName.toLowerCase();
                let number = guest.destination ? guest.destination : guest.uri.substring(6,16);
                telephonyGuests.push({ name: name.trim(), number: number, inCall: false, isTelephony: true});
            });
            return list.concat(telephonyGuests);
        } else {
            return list;
        }
    }

    validatePresence(type, data){
        var participantInList = false;
        var hasJoined = type == GlobalConfig.USER_JOINED;
        var participant = hasJoined ? 
                          data.protocol == "sip" ? participant.uri.substring(6, 16) : data.display_name 
                          : data.uuid;
        var isTelephony = hasJoined ? data.protocol == "sip" : false;
        this.state.participants.map(function(p){
            if(hasJoined){
                if(isTelephony){
                    if(p.number.toLowerCase() == participant.toLowerCase()){
                        participantInList = true;
                        p.inCall = hasJoined;
                        p.uuid = data.uuid;
                    }
                } else {
                    if(p.name.toLowerCase() == participant.toLowerCase() || p.backupName.toLowerCase() == participant.toLowerCase()){
                        participantInList = true;
                        p.inCall = hasJoined;
                        p.uuid = data.uuid;
                    }
                }
            } else {
                if(p.uuid == participant.uuid){
                    p.inCall = false;
                }
            }
        });
        // For a new participant
        if(!participantInList && hasJoined){
            if(isTelephony){
                this.state.meetingDetails.sipParticipants.push(data);
            } else if(data.role == "guest") {
                var lName = data.split(',')[0].trim();
                var fName = data.split(',')[1].trim();
                this.state.meetingDetails.caregiver.push({firstName: fName, lastName: lName});
            } else {
                var nArr = data.split(',');
                var lName = nArr[0].trim();
                var title = nArr[1].trim().split(' ').reverse().splice(0,1)[0].trim();
                var fName = nArr[1].split(' ')[1].trim();
                this.state.meetingDetails.participant.push({firstName: fName, lastName: lName, title: title});
            }
            // Re-itrating participants list
            this.setState({
                participants: this.setSortedParticipantList()
            });
        }
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
        return Utilities.formatInMeetingDateAndTime(new Date(parseInt(millis)), type);
    }

    updateRunningLateTime() {
        if (!this.state.isRunningLate || !this.state.runLateMeetingTime) {
            return;
        }
        this.setState({
            runningLateUpdatedTime: Utilities.formatInMeetingRunningLateTime(this.state.runLateMeetingTime)
        });
    }

    componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
    }

    leaveMeeting(){
        MessageService.sendMessage(GlobalConfig.LEAVE_VISIT, null);
    }

    render() {
        return (
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
                                <div className="participant mt-2" key={key}><span className={item.inCall ? "presence-indicator show" : "presence-indicator hide" }></span><span className="name text-capitalize">{item.name}</span></div>
                            )
                        }) 
                         : ('') 
                        }
                   </div>
                </div>
            </div>
        );
    }
}

export default ConferenceDetails;