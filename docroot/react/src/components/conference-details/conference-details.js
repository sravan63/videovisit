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
        this.state = { isRunningLate: false, runLateMeetingTime: '', runningLateUpdatedTime: '', meetingDetails: {}, participants: [], hostDetails: {hostInCall: false, uuid: null} };
    }

    componentDidMount() {
        this.subscription = MessageService.getMessage().subscribe((notification) => {
            switch(notification.text) {
                case GlobalConfig.SHOW_CONFERENCE_DETAILS:
                    this.setState({
                        meetingDetails: notification.data.meetingDetails
                    });
                    this.setSortedParticipantList();
                    var isGuest = localStorage.getItem('isGuest') && JSON.parse(localStorage.getItem('isGuest')) == true;
                    var isProxyMeeting = JSON.parse(localStorage.getItem('isProxyMeeting'));
                    if( isGuest || isProxyMeeting == 'Y' ){
                        var name = JSON.parse(localStorage.getItem('memberName'));
                        this.validateGuestPresence(GlobalConfig.USER_JOINED, {display_name: name, uuid: null, protocol: 'api'});
                    }
                break;
                case GlobalConfig.UPDATE_RUNNING_LATE:
                    this.setState({
                        isRunningLate: true,
                        runLateMeetingTime: notification.data.runLateMeetingTime
                    });
                    this.updateRunningLateTime();
                break;
                case GlobalConfig.USER_JOINED:
                    var canShowPresenceIndicator = this.validateUser(notification.data);
                    if( canShowPresenceIndicator ){
                        this.validateGuestPresence(GlobalConfig.USER_JOINED, notification.data);
                    }
                break;
                case GlobalConfig.USER_LEFT:
                    this.validateGuestPresence(GlobalConfig.USER_LEFT, notification.data);
                break;
            }
        });
        
    }

    setSortedParticipantList() {
        let list = [];
        let telephonyGuests = [];
        let clinicians = this.state.meetingDetails.participant ? this.state.meetingDetails.participant.slice(0) : [];
        let guests = this.state.meetingDetails.caregiver ? this.state.meetingDetails.caregiver.slice(0) : [];
        let participants = clinicians.concat(guests);
        if (participants) {
            participants.map(guest => {
                let name = guest.firstName.toLowerCase() + ' ' + guest.lastName.toLowerCase();
                name += guest.hasOwnProperty('title') ? guest.title ? ' ' + guest.title : '' : '';
                // remove this later
                let backupName = guest.lastName.toLowerCase() + ', ' + guest.firstName.toLowerCase();
                backupName += guest.hasOwnProperty('title') ? guest.title ? ' ' + guest.title : '' : '';
                list.push({ name: name.trim(), inCall: false, isTelephony: false, backupName: backupName });
            });
            list.sort((a, b) => (a.name > b.name) ? 1 : -1);
        }
        this.setState({ videoGuests: list });
        // Add Telephony guest to the participant's list.
        if(this.state.meetingDetails.sipParticipants){
            this.state.meetingDetails.sipParticipants.map(guest => {
                let name = guest.displayName.toLowerCase();
                let number = guest.destination ? guest.destination : guest.uri.substring(6,16);
                telephonyGuests.push({ name: name.trim(), number: number, inCall: false, isTelephony: true});
            });
        }
        this.setState({ telephonyGuests: telephonyGuests });
        this.setState({
            participants: this.state.videoGuests.concat(this.state.telephonyGuests)
        });
    }

    validateUser(participant){
        var showIndicator = true;
        // TODO: Should change this logic after provider React Development.
        var isGuest = localStorage.getItem('isGuest') && JSON.parse(localStorage.getItem('isGuest')) == true;
        if(isGuest){
            var memberName = this.state.meetingDetails.member.lastName +', '+ this.state.meetingDetails.member.firstName;
            if(participant.display_name.toLowerCase().trim() == memberName.toLowerCase().trim()){
                showIndicator = false;
            }
        } else {
            var isProxyMeeting = JSON.parse(localStorage.getItem('isProxyMeeting'));
            if( isProxyMeeting == 'N' ) {
                var udata = JSON.parse(Utilities.decrypt(localStorage.getItem('userDetails')));
                var memberName = udata.lastName +', '+ udata.firstName;
                if(participant.display_name.toLowerCase().trim() == memberName.toLowerCase().trim()){
                    showIndicator = false;
                }
            }
        }
        return showIndicator;
    }

    validateGuestPresence(type, data){
        var participantInList = false;
        var hasJoined = type == GlobalConfig.USER_JOINED;
        var participant = hasJoined ? 
                          data.protocol == "sip" ? data.uri.substring(6, 16) : data.display_name 
                          : data.uuid;
        var isTelephony = hasJoined ? data.protocol == "sip" : false;
        // Remove this later
        if( participant.indexOf('(') > -1 && participant.indexOf('@') > -1 ){
            participant = participant.split('(')[0].trim();
        }
        this.state.participants.map(function(p){
            if(hasJoined){
                if(isTelephony){
                    if(p.number == participant){
                        participantInList = true;
                        p.inCall = true;
                        p.uuid = data.uuid;
                    }
                } else {
                    if( !p.isTelephony 
                        && (p.name.toLowerCase() == participant.toLowerCase() 
                        || p.backupName.toLowerCase() == participant.toLowerCase()
                    ) ){
                        participantInList = true;
                        p.inCall = true;
                        p.uuid = data.uuid;
                    }
                }
            } else {
                if(p.uuid == participant){
                    p.inCall = false;
                    participantInList = true;
                }
            }
        });
        if(!participantInList){
            let isHost = this.validateHost(data, hasJoined);
            // For a new participant
            if(hasJoined && !isHost){
                this.appendParticipantToTheList(data, participant, isTelephony);
            }
        }
    }

    validateHost(data, hasJoined){
        let isHostValidation = false;
        if(hasJoined){
            let hClinician = this.state.meetingDetails.host;
            let host = '';
            host += hClinician.firstName ? hClinician.firstName.toLowerCase() : '';
            host += hClinician.lastName ? ' ' + hClinician.lastName.toLowerCase() : '';
            host += hClinician.title ? ', ' + hClinician.title : '';

            // remove this later
            let hostclinician = '';
            hostclinician += hClinician.lastName ? hClinician.lastName.toLowerCase() : '';
            hostclinician += hClinician.firstName ? ', ' + hClinician.firstName.toLowerCase() : '';
            hostclinician += hClinician.title ? ' ' + hClinician.title : '';

            if(data.display_name.toLowerCase() == host.toLowerCase() || data.display_name.toLowerCase() == hostclinician.toLowerCase()){
                this.setState({
                    hostDetails: { hostInCall: true, uuid: data.uuid }
                });
                isHostValidation = true;
            }
        } else {
            if(data.uuid == this.state.hostDetails.uuid){
                this.setState({
                    hostDetails: { hostInCall: false, uuid: data.uuid }
                });
                isHostValidation = true;
            }
        }
        return isHostValidation;
    }

    appendParticipantToTheList(data, participant, isTelephony){
        if(isTelephony){
            this.state.telephonyGuests.push({ name: data.display_name.trim(), number: participant, inCall: true, isTelephony: true, uuid: data.uuid });
        } else if(data.role == "guest") { // In 'Lastname, Firstname (email)' format.
            var gName = participant.indexOf('(') > -1 ? participant.split('(')[0] : participant;
            var lName = participant.split(',')[0].trim();
            var fName = participant.split(',')[1].trim();
            let name = fName.toLowerCase() + ' ' + lName.toLowerCase();
            // remove this later
            let backupName = lName.toLowerCase() + ', ' + fName.toLowerCase();
            this.state.videoGuests.push({ name: name.trim(), inCall: true, isTelephony: false, backupName: backupName, uuid: data.uuid });
            this.state.videoGuests.sort((a, b) => (a.name > b.name) ? 1 : -1);
        } else { // In 'Lastname, Firstname Title' format.
            var nArr = participant.split(',');
            var lName = nArr[0].trim();
            var title = nArr[1].trim().split(' ').reverse().splice(0,1)[0].trim();
            var fName = nArr[1].split(' ')[1].trim();
            let name = fName.toLowerCase() + ' ' + lName.toLowerCase();
            name += title ? ' ' + title : '';
            // remove this later
            let backupName = lName.toLowerCase() + ', ' + fName.toLowerCase();
            backupName += title ? ' ' + title : '';
            this.state.videoGuests.push({ name: name.trim(), inCall: true, isTelephony: false, backupName: backupName, uuid: data.uuid });
            this.state.videoGuests.sort((a, b) => (a.name > b.name) ? 1 : -1);
        }
        // Re-iterating participants list
        this.setState({
            participants: this.state.videoGuests.concat(this.state.telephonyGuests)
        });
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
                        <div className="clinician-info text-capitalize"><span className={this.state.hostDetails.hostInCall ? "presence-indicator show" : "presence-indicator hide" }></span><span className="name text-capitalize">{this.getClinicianName(this.state.meetingDetails.host)}</span></div>
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