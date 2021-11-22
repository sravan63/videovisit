import React, { Component,Suspense } from "react";
import '../email-templates.less';
import './guest-instructional.less';
import Utilities from "../../../services/utilities-service";

class GuestInstructional extends Component {
    constructor(props) {
        super(props);
        var content = props.content.caregiverInstructionalEmail;
        content['instructions'] = props.content.instructions;
        this.state = {emailContentDetails:props.data,staticData:content};
        this.getHoursAndMinutes = this.getHoursAndMinutes.bind(this);
    }

    componentDidMount() {}
    getHoursAndMinutes(millis, type,lang) {
        if (!millis) {
            return;
        }
        return Utilities.formatDateAndTimeForEmails(new Date(parseInt(millis)), type,lang);

    }

    render() {
        var content = this.props.content.caregiverInstructionalEmail;
        content['instructions'] = this.props.content.instructions;
        let details = content;
        return (
                <div className="wrapper container-fluid p-0">
                    <div className="instruction">
                        <p className="instruct-header">{details.heading} </p>
                        <p className="instruct-description">{details.subHeading}</p>
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
                            <p>{details.patient}: {this.state.emailContentDetails.memberFirstName} {this.state.emailContentDetails.lastNameFirstCharMember}</p>
                            <p>{details.clinician}: {this.state.emailContentDetails.doctorFirstName} {this.state.emailContentDetails.doctorLastName}{this.state.emailContentDetails.doctorTitle}</p>
                        </div>
                        <div className="learn-more">
                            <a href={this.state.emailContentDetails.guestHelpUrl} target="_blank">{details.learnMore}</a>
                        </div>
                        <div className="need-help">
                            <p>{details.needHelp1}{details.needHelp2}</p>
                            <p>{details.needHelp3}</p>
                        </div>
                    </div>
                </div>)
    }
}

export default GuestInstructional;
