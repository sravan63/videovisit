import React, { Component,Suspense } from "react";
import './patient-reminder.less';
import '../guest-instructional/guest-instructional.less';
import Utilities from "../../../services/utilities-service";

class PatientReminder extends Component {
    constructor(props) {
        super(props);
        const content = props.content.caregiverInstructionalEmail;
        content['instructions'] = props.content.instructions;
        this.state = {emailContentDetails:props.data,staticData:content};
        this.getHoursAndMinutes = this.getHoursAndMinutes.bind(this);
    }

    componentDidMount() { }

    getHoursAndMinutes(millis, type,lang) {
        if (!millis) {
            return;
        }
        return Utilities.formatDateAndTimeForEmails(new Date(parseInt(millis)), type,lang);

    }


    render() {
        let details = this.state.staticData;
        return (
                <div className="wrapper container-fluid p-0">
                    <div className="instruction">
                        <p className="instruct-header">{details.reminderHeading}</p>
                        <p className="instruct-description mt-3">{details.subHeading3} <a href="http://kpdoc.org/mdoapp" target="_blank" className="email-link">{details.subHeading4}</a> {details.subHeading5} <a href="http://kpdoc.org/videovisits" target="_blank" className="email-link">{details.subHeading10}</a></p>
                        <div className="visit-rules" style={{padding:'0 20px'}}>
                            <ul>
                                <li style={{ fontWeight:'bold' }}>{details.instructions.rule1}</li>
                                <li>{details.instructions.rule2}</li>
                                <li>{details.instructions.rule3}</li>
                                <li style={{marginBottom:'12px'}}>{details.instructions.rule4}</li>
                            </ul>
                        </div>
                        <div className="text-center">
                            <a href={this.state.emailContentDetails.meetingURL}
                               target="_blank" className="start-visit">{details.startVisit}</a>
                        </div>
                        <div className="time-details">
                            <p>{details.dateTime}: {this.getHoursAndMinutes(this.state.emailContentDetails.meetingTimeStamp,'date',this.state.emailContentDetails.lang)}{details.at} {this.getHoursAndMinutes(this.state.emailContentDetails.meetingTimeStamp,'time',this.state.emailContentDetails.lang)} Pacific Time</p>
                            <p>{details.patient}: {this.state.emailContentDetails.memberFirstName} {this.state.emailContentDetails.memberLastName}</p>
                            <p>{details.clinician}: {this.state.emailContentDetails.doctorFirstName} {this.state.emailContentDetails.doctorLastName}{this.state.emailContentDetails.doctorTitle}</p>
                        </div>
                        <div className="row learn-more" style={{fontSize:'17px'}}>
                            <div className="col-md-12">{details.subHeading6}</div>
                            <div className="col-md-12">{details.subHeading7}</div>
                            <div className="col-md-12 mb-4"><a href={this.state.emailContentDetails.guestHelpUrl} className="email-link" target="_blank">{details.subHeading8} </a></div>
                        </div>
                        <div className="row need-help">
                            <div className="col-md-12"><a href={this.state.emailContentDetails.signInUrl} className="email-link" target="_blank">{details.needHelpReminder1} </a>{details.needHelpReminder2}</div>
                        </div>
                    </div>
                </div>)
    }
}

export default PatientReminder;
