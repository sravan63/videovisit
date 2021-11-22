import React, { Component,Suspense } from "react";
import '../email-templates.less';
import './patient-running-late-reminder.less';
import Utilities from "../../../services/utilities-service";

class PatientRunningLateReminder extends Component {
    constructor(props) {
        super(props);
        const content = props.content.runningLate;
        content['instructions'] = props.content.instructions;
        this.state = { emailContentDetails:props.data, staticData:content };
        this.getHoursAndMinutes = this.getHoursAndMinutes.bind(this);
    }

    componentDidMount() { }

    getHoursAndMinutes(millis, type, lang) {
        if (!millis) {
            return;
        }
        return Utilities.formatDateAndTimeForEmails(new Date(parseInt(millis)), type,lang);
    }
    

    render() {
        var content = this.props.content.runningLate;
        content['instructions'] = this.props.content.instructions;
        let details = content;
        return (
                <div className="wrapper container-fluid p-0">
                    <div className="instruction">
                        <p className="instruct-header">{details.heading} </p>
                        <p className="instruct-description">{details.subHeading}{this.getHoursAndMinutes(this.state.emailContentDetails.meetingTimeStamp,'time',this.state.emailContentDetails.lang)} {details.timeZone}{details.subHeading2}{this.getHoursAndMinutes(this.state.emailContentDetails.meetingRunLateTimeStamp,'time',this.state.emailContentDetails.lang)} {details.timeZone}{details.subHeading3}</p>
                        <p className="instruct-description">{details.patientInstruction1}, <a href={this.state.emailContentDetails.downloadMdoAppUrl} target="_blank">{details.patientInstructionLink}</a>{details.patientInstruction2}<a href={this.state.emailContentDetails.meetingURL} target="_blank">{details.patientInstructionAccessLink}</a></p>
                        <div className="visit-rules">
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
                        <div className="addln-details">
                            <p>{details.needInterpreter}</p>
                            <p>{details.troubleSiginIn}</p>
                            <p><a href={this.state.emailContentDetails.guestHelpUrl} target="_blank">{details.learnMore}</a></p>
                        </div>
                        <div className="need-help">
                            <p><a href={this.state.emailContentDetails.signInUrl} target="_blank">{details.signIn}</a>{details.orCall}</p>
                        </div>
                    </div>
                </div>)
    }
}

export default PatientRunningLateReminder;
