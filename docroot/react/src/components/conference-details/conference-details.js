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
        this.state = { isRunningLate: false, runLateMeetingTime: '', runningLateUpdatedTime: '', meetingDetails: {}, participants: [] };
    }

    componentDidMount() {
        this.subscription = MessageService.getMessage().subscribe((notification) => {
            switch(notification.text) {
                case GlobalConfig.SHOW_CONFERENCE_DETAILS:
                    this.setState({
                        meetingDetails: notification.data.meetingDetails,
                        participants: notification.data.participants
                    });
                break;
                case GlobalConfig.UPDATE_RUNNING_LATE:
                    this.setState({
                        isRunningLate: true,
                        runLateMeetingTime: notification.data.runLateMeetingTime
                    });
                    this.updateRunningLateTime();
                break;
            }
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
        MessageService.sendMessage(GlobalConfig.LEAVE_VISIT, null)
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
                                <div className="participant text-capitalize mt-2" key={key}>{item.name}</div>
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