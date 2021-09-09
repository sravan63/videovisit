import React from 'react';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './conference-details.less';
import { range } from 'rxjs';
import { MessageService } from '../../services/message-service.js';
import GlobalConfig from '../../services/global.config';
import Utilities from '../../services/utilities-service.js';
import * as WebUI from '../../pexip/complex/webui.js';

class ConferenceDetails extends React.Component {
    constructor(props) {
        super(props);       
        this.getHoursAndMinutes = this.getHoursAndMinutes.bind(this);
        this.getClinicianName = this.getClinicianName.bind(this);
        this.updateRunningLateTime = this.updateRunningLateTime.bind(this);
        this.state = { isRunningLate: false,spotlight:false,runLateMeetingTime: '', runningLateUpdatedTime: '', meetingDetails: {}, participants: [], hostDetails: {hostInCall: false, uuid: null}, isGuest: false };
    }

    componentDidMount() {
        this.subscription = MessageService.getMessage().subscribe((notification) => {
            switch(notification.text) {
                case GlobalConfig.SHOW_CONFERENCE_DETAILS:
                    this.setState({ meetingDetails: notification.data.meetingDetails });
                    this.state.isGuest = ( localStorage.getItem('isGuest') && JSON.parse(localStorage.getItem('isGuest')) == true || 
                                           sessionStorage.getItem('isInstantPG') && JSON.parse(sessionStorage.getItem('isInstantPG')) == true );
                    this.setSortedParticipantList();
                    this.indicateUserOnJoin();
                    // this.setState({ meetingDetails: notification.data.meetingDetails });
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
                    if( canShowPresenceIndicator ) {
                        this.validateGuestPresence(GlobalConfig.USER_JOINED, notification.data);
                    }
                break;
                case GlobalConfig.USER_LEFT:
                    this.validateGuestPresence(GlobalConfig.USER_LEFT, notification.data);
                break;
                case GlobalConfig.SPOTLIGHT:
                    this.setSpotlight(true,notification.data);
                break;
                case GlobalConfig.UNSPOTLIGHT:
                    this.setSpotlight(false,notification.data);
                break;
                case GlobalConfig.UPDATE_DUPLICATE_MEMBERS_TO_SIDEBAR:
                    const gData = notification.data;
                    let isInList = false;
                    this.state.participants.map((guest)=>{
                        if( guest.backupName.toLowerCase().trim() == gData.name.toLowerCase().trim() ) {
                            guest.uuid = gData.uuid;
                            isInList = true;
                            if( !guest.inCall ){
                                guest.inCall = true;
                            }
                        }
                    });
                    if( !isInList ) {
                        this.validateGuestPresence(GlobalConfig.USER_JOINED, {display_name: gData.name, uuid: gData.uuid,spotlight:0, protocol: 'api', role: 'guest', isDuplicate: true});
                    }
                break;
                case GlobalConfig.ACTIVESPEAKER:
                    this.setActiveSpeaker(true,notification.data);
                break;
                case GlobalConfig.NOTACTIVESPEAKER:
                    this.setActiveSpeaker(false,notification.data);
                break;
                case GlobalConfig.UPDATE_HOST_DETAILS_IN_GENERICVISIT:
                    if(!this.state.meetingDetails.host.nuid){
                        this.state.meetingDetails.host = notification.data.host;
                        // this.validateHostPresence(notification.data.details, true);
                    }
                break;
            }
        });
        
    }

    setSpotlight(key,data){
        if(this.state.hostDetails.uuid == data.uuid){
            this.setState({spotlight:key});
        }
        else {
            this.state.participants.map((val) => {
                if (val.uuid == data.uuid) {
                    val.spotlighted = key;
                    this.setState({participants:this.state.participants});
                }
            });
        }
    }

    setActiveSpeaker(key,data){
        if(data.length > 0){
            if(this.state.hostDetails.uuid == data[0].uuid){
                this.setState({activeSpeaker:key});
            }
            else {
                this.state.participants.map((val) => {
                    if (val.uuid == data[0].uuid) {
                        val.setactiveSpeaker = key;
                        this.setState({participants:this.state.participants});
                    }else{
                        val.setactiveSpeaker = false;
                        this.setState({participants:this.state.participants});
                    }
                });
            }
        }else{
            this.setState({activeSpeaker:false});
            this.state.participants.map((val) => {
                    val.setactiveSpeaker = false;
                    this.setState({participants:this.state.participants});
                
            });
        }
    }

    setSortedParticipantList() {
        let list = [];
        let telephonyGuests = [];
        let interpreterGuests = [];
        var participants = [];
        let clinicians = this.state.meetingDetails.participant ? this.state.meetingDetails.participant.slice(0) : [];
        let guests = this.state.meetingDetails.caregiver ? this.state.meetingDetails.caregiver.slice(0) : [];
        // var isGuest = localStorage.getItem('isGuest') && JSON.parse(localStorage.getItem('isGuest')) == true;
        var isProxyMeeting = JSON.parse(localStorage.getItem('isProxyMeeting'));
        var isECInstantJoin = sessionStorage.getItem('isECInstantJoin');
        if(!this.state.isGuest){
            var udata = JSON.parse(Utilities.decrypt(localStorage.getItem('userDetails')));
            var memberName = udata.lastName.toLowerCase() +', '+ udata.firstName.toLowerCase();
        }
        
        var patientName =  this.state.meetingDetails.member.lastName.toLowerCase() + ', ' + this.state.meetingDetails.member.firstName.toLowerCase();
        var removeGuestName;
        if(isECInstantJoin || this.state.isGuest || patientName != memberName){
            var participant =JSON.parse(localStorage.getItem('memberName'));
            if( participant.indexOf('(') > -1 && participant.indexOf('@') > -1 ){
                        participant = participant.split('(')[0].trim();
                        if(participant.split(',').length > 2){ // lname, fname, (email)
                            var lastIndex = participant.lastIndexOf(',');
                            participant = participant.substring(0, lastIndex);
                        }
                    }
             if(this.state.isGuest){       
                 removeGuestName = guests.findIndex(x=>x.lastName.toLowerCase().trim() + ', '+ x.firstName.toLowerCase().trim() == participant.toLowerCase().trim());
             }else{
                removeGuestName = guests.findIndex(x=>x.lastName.toLowerCase().trim() + ', '+ x.firstName.toLowerCase().trim() == memberName.trim());
             }
             if(removeGuestName != -1){  
                participants = guests.splice(removeGuestName,1);
            }
            participants = guests;
            participants = clinicians.concat(guests);
            
        }else{
             participants = clinicians.concat(guests);
        }
        if (participants) {
            participants.map(guest => {
                let name = guest.firstName.toLowerCase() + ' ' + guest.lastName.toLowerCase();
                name += guest.hasOwnProperty('title') ? guest.title ? ' ' + guest.title : '' : '';
                // TODO: Should remove this after UID implementation
                let backupName = guest.lastName.toLowerCase() + ', ' + guest.firstName.toLowerCase();
                backupName += guest.hasOwnProperty('title') ? guest.title ? ' ' + guest.title : '' : '';
                list.push({ name: name.trim(), inCall: false, spotlighted:false, isTelephony: false, backupName: backupName });
            });
            list.sort((a, b) => (a.name > b.name) ? 1 : -1);            
            if(this.state.isGuest || patientName != memberName) {
                let patientBackupName = this.state.meetingDetails.member.lastName + ', ' + this.state.meetingDetails.member.firstName;
                let patient = this.state.meetingDetails.member.firstName.toLowerCase() + ' ' + this.state.meetingDetails.member.lastName.toLowerCase();
                list.unshift({
                    name: patient.trim(),
                    inCall: false,
                    spotlighted: false,
                    isTelephony: false,
                    backupName: patientBackupName,
                    isPatient : true
                });
            }
        }
        //  var isProxyMeeting = JSON.parse(localStorage.getItem('isProxyMeeting'));
        //  var udata = JSON.parse(Utilities.decrypt(localStorage.getItem('userDetails')));
        //  var memberName = udata.lastName +', '+ udata.firstName;
        //  var patientName =  this.state.meetingDetails.member.firstName.toLowerCase() + ' ' + this.state.meetingDetails.member.lastName.toLowerCase();
        // if(isGuest || memberName != patientName){
        //     list.unshift({ name: patientName.trim(), inCall: false, isTelephony: false, backupName: patientName.hasOwnProperty('title') ? patientName.title ? ' ' + patientName.title : '' : '' });
        // }
        this.setState({ videoGuests: list });

        // Adding Telephony guest to the participant's list.
        if(this.state.meetingDetails.sipParticipants){
            this.state.meetingDetails.sipParticipants.map(guest => {
                let name = guest.displayName.toLowerCase();
                let number = guest.destination ? guest.destination : guest.uri.substring(6,16);
                if(name.indexOf('phone interpreter') > -1) {
                    interpreterGuests.push({ name: name.trim(), number: number, inCall: false, isTelephony: true});
                } else {
                    telephonyGuests.push({ name: name.trim(), number: number, inCall: false, isTelephony: true});
                }
            });
        }
        this.setState({ telephonyGuests: telephonyGuests });
        this.setState({ interpreterGuests: interpreterGuests });
        this.setState({
            participants: this.state.videoGuests.concat(this.state.telephonyGuests, this.state.interpreterGuests)
        });
    }

    indicateUserOnJoin() {
        // TODO: Should change this logic after UID implementation
        // var isGuest = localStorage.getItem('isGuest') && JSON.parse(localStorage.getItem('isGuest')) == true;
        var isProxyMeeting = JSON.parse(localStorage.getItem('isProxyMeeting'));
        if( this.state.isGuest ){
            var name = JSON.parse(localStorage.getItem('memberName'));
            this.validateGuestPresence(GlobalConfig.USER_JOINED, {display_name: name, uuid: null,spotlight:0, protocol: 'api', role: 'guest'});
        } else if( isProxyMeeting == 'Y' ){
            var patient = this.state.meetingDetails.member.lastName+', '+this.state.meetingDetails.member.firstName;
            var name = JSON.parse(localStorage.getItem('memberName'));
            // Satisfies only for child proxy scenario.
            if( name !== patient ){
                this.validateGuestPresence(GlobalConfig.USER_JOINED, {display_name: name, uuid: null,spotlight:0, protocol: 'api', role: 'guest'});
            }
        }
        
    }

    validateUser(participant) {
        var showIndicator = true;
        // TODO: Should change this logic after UID implementation
        // var isGuest = localStorage.getItem('isGuest') && JSON.parse(localStorage.getItem('isGuest')) == true;
        if(this.state.isGuest){
            var memberName = this.state.meetingDetails.member.lastName +', '+ this.state.meetingDetails.member.firstName;
            if(participant.display_name.toLowerCase().trim() == memberName.toLowerCase().trim()){
                showIndicator = true;
            }
        } else {
            var isProxyMeeting = JSON.parse(localStorage.getItem('isProxyMeeting'));
            if( sessionStorage.getItem('loggedAsDuplicateMember') ) {
                // For duplicate members
                var patient = JSON.parse(localStorage.getItem('memberName'));
                if( participant.display_name.toLowerCase().trim() == patient.toLowerCase().trim() ) {
                    showIndicator = false;
                }
            } else if( isProxyMeeting == 'N' ) {
                var udata = JSON.parse(Utilities.decrypt(localStorage.getItem('userDetails')));
                var memberName = udata.lastName +', '+ udata.firstName;
                if(participant.display_name.toLowerCase().trim() == memberName.toLowerCase().trim() ){
                    showIndicator = false;
                }
            } else {
                var patient = this.state.meetingDetails.member.lastName+', '+this.state.meetingDetails.member.firstName;
                if( participant.display_name.toLowerCase().trim() == patient.toLowerCase().trim() ) {
                    showIndicator = true;
                }
            }
        }
        return showIndicator;
    }

    validateGuestPresence(type, data) {
        var participantInList = false;
        var hasJoined = type == GlobalConfig.USER_JOINED;
        var participant = hasJoined ? 
                          data.protocol == "sip" ? data.uri.substring(6, 16) : data.display_name 
                          : data.uuid;
        var isTelephony = hasJoined ? data.protocol == "sip" : false;
        if(hasJoined){
            var isInterpreter = data.display_name.toLowerCase().indexOf('interpreter') > -1 ? data.display_name : false;
        }


        // TODO: Should remove this after UID implementation
        if( participant.indexOf('(') > -1 && participant.indexOf('@') > -1 ){
            participant = participant.split('(')[0].trim();
            if(participant.split(',').length > 2){ // lname, fname, (email)
                var lastIndex = participant.lastIndexOf(',');
                participant = participant.substring(0, lastIndex);
            }
        }

        this.state.participants.map(function(p){
            if(hasJoined){
                if(isTelephony){
                    if(isInterpreter){
                        if(p.name.toLowerCase() == isInterpreter.toLowerCase()){
                            participantInList = true;
                            p.inCall = true;
                            p.uuid = data.uuid;
                            if(data.spotlight !=0){
                                p.spotlighted = true;
                            }
                        }
                    }
                    else if(p.number == participant){
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
                        if(data.spotlight !=0){
                            p.spotlighted = true;
                        }
                    }
                }
            } else {
                if(p.uuid == participant){
                    p.inCall = false;
                    p.spotlighted = false;
                    participantInList = true;
                }
            }
        });
        if(!participantInList){
            let isHost = this.validateHostPresence(data, hasJoined);
            if(hasJoined && !isHost) {
                this.appendParticipantToTheList(data, participant, isTelephony);
            }
        }
    }

    validateHostPresence(data, hasJoined) {
        let isHostValidation = false;
        if(hasJoined) {
            let hClinician = this.state.meetingDetails.host;
            let host = '';
            host += hClinician.firstName ? hClinician.firstName.toLowerCase() : '';
            host += hClinician.lastName ? ' ' + hClinician.lastName.toLowerCase() : '';
            host += hClinician.title ? ', ' + hClinician.title : '';

            // TODO: Should remove this after UID implementation
            let hostclinician = '';
            hostclinician += hClinician.lastName ? hClinician.lastName.toLowerCase() : '';
            hostclinician += hClinician.firstName ? ', ' + hClinician.firstName.toLowerCase() : '';
            hostclinician += hClinician.title ? ' ' + hClinician.title : '';

            if(data.display_name.toLowerCase() == host.toLowerCase() || data.display_name.toLowerCase() == hostclinician.toLowerCase()){
                let pinFeed = data.spotlight !=0 ? true: false;
                this.setState({
                    hostDetails: { hostInCall: true, uuid: data.uuid },
                    spotlight:pinFeed
                });
                sessionStorage.setItem('isTrueHost',true);
                isHostValidation = true;
            }
        } else {
            if(data.uuid == this.state.hostDetails.uuid){
                this.setState({
                    hostDetails: { hostInCall: false, uuid: data.uuid },
                    spotlight:false
                });
                sessionStorage.setItem('isTrueHost',true);
                isHostValidation = true;
            }
        }
        return isHostValidation;
    }

    appendParticipantToTheList(data, participant, isTelephony) {
        if(isTelephony){
            if(data.display_name.toLowerCase().trim().indexOf('interpreter') > -1){
                this.state.interpreterGuests.push({ name: data.display_name.trim(), number: participant, inCall: true, isTelephony: true, uuid: data.uuid });
            } else {
                this.state.telephonyGuests.push({ name: data.display_name.trim(), number: participant, inCall: true, isTelephony: true, uuid: data.uuid });
            }
        } else if(data.role == "guest") { // In 'Lastname, Firstname (email)' format.
            // var isGuest = localStorage.getItem('isGuest') && JSON.parse(localStorage.getItem('isGuest')) == true;
            var gName = participant.indexOf('(') > -1 ? participant.split('(')[0] : participant;
            var lName = participant.split(',')[0].trim();
            var fName = participant.split(',')[1].trim();
            let name = fName.toLowerCase() + ' ' + lName.toLowerCase();
            // TODO: Should remove this after UID implementation
            let backupName = lName.toLowerCase() + ', ' + fName.toLowerCase();
            if( this.validateDuplicateUser(gName) ){
                console.log('===== changing duplicate name format  ===== ');
                var duplicateName = WebUI.formatDuplicateNames(gName); // returns as mama 2, joe
                var dLName = duplicateName.split(',')[0].trim();
                var dFName = duplicateName.split(',')[1].trim();
                name = dFName.toLowerCase() + ' ' + dLName.toLowerCase(); // changed to joe mama 2
            }
            console.log(' ====== ACTUAL NAME CHANGED TO :: '+name);
            var memberName = '';
            if(!this.state.isGuest){
                var udata = JSON.parse(Utilities.decrypt(localStorage.getItem('userDetails')));
                memberName = JSON.parse(localStorage.getItem('memberName')); // udata.lastName.toLowerCase() +', '+ udata.firstName.toLowerCase();
            }
            if(!(data.display_name.toLowerCase() == JSON.parse(localStorage.getItem('memberName')).toLowerCase()) && this.state.isGuest ){
                // For guests
                this.state.videoGuests.push({ name: name.trim(), inCall: true, isTelephony: false, backupName: backupName, uuid: data.uuid });
            }else if(!(data.display_name.toLowerCase() == memberName.toLowerCase()) && !this.state.isGuest){
                // For actual members
                this.state.videoGuests.push({ name: name.trim(), inCall: true, isTelephony: false, backupName: backupName, uuid: data.uuid });
            } else if(!(data.display_name.toLowerCase() == JSON.parse(localStorage.getItem('memberName')).toLowerCase()) && sessionStorage.getItem('loggedAsDuplicateMember') ){
                // For duplicate members
                this.state.videoGuests.push({ name: name.trim(), inCall: true, isTelephony: false, backupName: backupName, uuid: data.uuid });
            }

            // var filteredPatient = this.state.videoGuests.findIndex(x=>x.name == patientName);
            // if(filteredPatient == 0 && filteredPatient != -1){
            //     this.state.videoGuests.splice(filteredPatient,1);
            // }
            //participants = guests;
            // var onlyPatient = this.state.videoGuests.filter(x=>x.isPatient == true);
            // if(onlyPatient.length > 0){
            //     this.state.videoGuests.splice(filteredPatient, 1);
            // }
            this.state.videoGuests.sort((a, b) => (a.name > b.name) ? 1 : -1);
            //let backupName1 = onlyPatient[0].name.toLowerCase() + ', ' + onlyPatient[0].name.toLowerCase();
            // if(filteredPatient == 0 && filteredPatient != -1){
            //     this.state.videoGuests.unshift({ name: patientName.trim(), inCall: false, isTelephony: false, backupName: patientName, uuid: data.uuid });
            // }
            
        } else { // In 'Lastname, Firstname Title' format.
            var nArr = participant.split(',');
            var lName = nArr[0].trim();
            var title = '';
            var fName = '';
            if( nArr[1].trim().indexOf(' ') > -1) {
                title = nArr[1].trim().split(' ').reverse().splice(0,1)[0].trim();
                fName = nArr[1].split(title)[0].trim();
            } else {
                fName = nArr[1].trim();
            }
            let name = fName.toLowerCase() + ' ' + lName.toLowerCase();
            name += title ? ' ' + title : '';
            // TODO: Should remove this after UID implementation
            let backupName = lName.toLowerCase() + ', ' + fName.toLowerCase();
            backupName += title ? ' ' + title : '';
            this.state.videoGuests.push({ name: name.trim(), inCall: true, isTelephony: false, backupName: backupName, uuid: data.uuid });
            this.state.videoGuests.sort((a, b) => (a.name > b.name) ? 1 : -1);
        }
        // Re-iterating participants list
        this.setState({
            participants: this.state.videoGuests.concat(this.state.telephonyGuests, this.state.interpreterGuests)
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
        // this.setState({
        //     runningLateUpdatedTime: Utilities.formatInMeetingRunningLateTime(this.state.runLateMeetingTime)
        // });
        return Utilities.formatInMeetingRunningLateTime(this.state.runLateMeetingTime);
    }

    componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
    }

    leaveMeeting() {
        MessageService.sendMessage(GlobalConfig.LEAVE_VISIT, 'manual');
    }

    validateDuplicateUser(userName){
        var isDuplicate = false;
        var patientName =  this.state.meetingDetails.member.lastName.toLowerCase() + ', ' + this.state.meetingDetails.member.firstName.toLowerCase();
        if( userName.trim().toLowerCase().indexOf(patientName.toLowerCase()) > -1 ) {
             // Mama, Joe 2
             isDuplicate = isNaN(userName.slice(-1)) == false;
        }
        return isDuplicate;
    }
    toggleLangInfo(){
        let data = Utilities.getLang(); 
        switch(data.lang){
            case "spanish":
                return "participant-details spanish-scroll";
                break;            
            default:
                return  "participant-details";
                break;    

        }
    }
    render() {
        let Details = this.props.data.conference;
        return (
            <div className="col-md-2 p-0 conference-details" style={{display: this.props.conference.showRemotefeed ? 'block' : 'none'}} >
                <div className="clinician-information">
                    <button className="btn leave-button" onClick={this.leaveMeeting}>{Details && Details.LeaveRoom}</button>
                    <div className="visit-details">
                        <p className="mt-1 mb-1">{Details && Details.VisitDetails}</p>
                        <div className="clinician-info text-capitalize"><span className={this.state.spotlight ? "pinnedIcon show" : "pinnedIcon removePin" }></span><span className = {this.state.spotlight ? "name text-capitalize adjustWidth" : "name text-capitalize"}><span className={this.state.activeSpeaker ? "activespeaker" : "notactivespeaker"}>{this.getClinicianName(this.state.meetingDetails.host)}</span></span><span className={this.state.hostDetails.hostInCall ? "presence-indicator show" : "presence-indicator hide" }></span></div>
                        <div className="visit-time">
                            {this.getHoursAndMinutes(this.state.meetingDetails.meetingTime, 'time')}
                            <span>{this.getHoursAndMinutes(this.state.meetingDetails.meetingTime, 'date')}</span>
                        </div>
                        <div className="runningLate-time" style={{display: this.state.isRunningLate ? 'block' : 'none' }}>
                            <span className="time-display">{Details && Details.Updated}: {this.updateRunningLateTime()}</span>
                        </div>
                    </div>
                </div>
                <div className="participants-information">
                    <p className="header mb-0">{Details && Details.Guests}</p>
                    <div className={this.toggleLangInfo()} aria-labelledby="dropdownMenuButton">
                        { this.state.participants && this.state.participants.length > 0 ? 
                            this.state.participants.map((item,key) =>{
                            if(!JSON.parse(localStorage.getItem('memberName')).includes(item.backupName)){
                                return (
                                    <div className="participant mt-2" key={key}><span className = {item.spotlighted ? "pinnedIcon" : "pinnedIcon removePin"}></span><span className={item.spotlighted ? "name text-capitalize adjustWidth": "name text-capitalize"}><span className={item.setactiveSpeaker ? "activespeaker" : "notactivespeaker"}>{item.name}</span></span><span className={item.inCall ? "presence-indicator show" : "presence-indicator hide" }></span></div>
                                )
                            }
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
