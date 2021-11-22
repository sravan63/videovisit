import React, { Component,Suspense } from "react";
import '../email-templates.less';
import './email-vav-reschedule.less';
import Utilities from "../../../services/utilities-service";

class vavReschedule extends Component {
    constructor(props) {
        super(props);
        const content = props.content.VavRescheduleEmail;
        content["VavRescheduleEmail"] = props.content.VavRescheduleEmail;
        this.state = { emailContentDetails: props.data, staticData: content };
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
        var content = this.props.content.VavRescheduleEmail;
        content['instructions'] = this.props.content.instructions;
        let details = content; 
        return (
                <div className="wrapper container-fluid p-0">
                    <div className="instruction">
                        <p className="instruct-header">{details.subHeading} </p>
                        <p className="instruct-description">{details.subHeading2}</p>
                        <p className="instruct-description">{details.subHeading3}</p>
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
                               target="_blank" className="start-visit">{details.buttonLabel}</a>
                        </div>
                        <div className="time-details">
                            <p>{details.dateLabel}: {this.getHoursAndMinutes(this.state.emailContentDetails.meetingTimeStamp,'date',this.state.emailContentDetails.lang)}{details.at} {this.getHoursAndMinutes(this.state.emailContentDetails.meetingTimeStamp,'time',this.state.emailContentDetails.lang)} Pacific Time</p>
                            <p>{details.patientlabel}: {this.state.emailContentDetails.memberFirstName} {this.state.emailContentDetails.memberLastName}</p>
                            <p>{details.clinicianLabel}: {this.state.emailContentDetails.doctorFirstName} {this.state.emailContentDetails.doctorLastName}{this.state.emailContentDetails.doctorTitle}</p>
                        </div>
                        <div className="learn-more">
                            <a href={this.state.emailContentDetails.guestHelpUrl} target="_blank">{details.learnMore}</a>
                        </div>
                        <div className="need-help">
                            <p>{details.helpLabel}</p>
                        </div>
                    </div>
                </div>)
    }
}

export default vavReschedule;