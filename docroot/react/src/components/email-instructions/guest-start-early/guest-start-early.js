import React, { Component,Suspense } from "react";
import '../email-templates.less';
import './guest-start-early.less';
import Utilities from "../../../services/utilities-service";

class GuestStartEarly extends Component {
    constructor(props) {
        super(props);
        const content = props.content.careGiverStartEarly;
        content['instructions'] = props.content.instructions;
        this.state = { emailContentDetails:props.data, staticData:content };
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
                        <p className="instruct-header">{details.heading} </p>
                        <p className="instruct-description">{details.subHeading}, {this.getHoursAndMinutes(this.state.emailContentDetails.meetingTimeStamp,'date',this.state.emailContentDetails.lang)} {details.atText} {this.getHoursAndMinutes(this.state.emailContentDetails.meetingTimeStamp,'time',this.state.emailContentDetails.lang)} {details.timeZone} {details.subHeading2}</p>
                        <p className="instruct-description">{details.subHeading3}</p>
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
                            <p>{details.subHeading4}</p>
                            <p>{details.subHeading5}</p>
                            <p><a href={this.state.emailContentDetails.guestHelpUrl} target="_blank">{details.subHeading6}</a></p>
                        </div>
                        <div className="need-help">
                            <p><a href={this.state.emailContentDetails.signInUrl} target="_blank">{details.subHeading7}</a> {details.subHeading8}</p>
                        </div>
                    </div>
                </div>)
    }
}

export default GuestStartEarly;
