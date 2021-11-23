import React, { Component } from "react";
import '../member-instant-join/member-instant-join.less';
import Utilities from '../../../services/utilities-service.js';

class GuestInstantJoin extends Component {
    constructor(props) {
        super(props);
        const content = props.content.careGiverInstantJoin;
        content['instructions'] = props.content.instructions;
        this.state = {emailContentDetails:props.data,staticData:content};
    }

    getHoursAndMinutes(millis, type,lang) {
        if (!millis) {
            return;
        }
        return Utilities.formatDateAndTimeForEmails(new Date(parseInt(millis)), type,lang);
    }

    render() {
        var content = this.props.content.careGiverInstantJoin;
        content['instructions'] = this.props.content.instructions;
        let details = content;
        return ( <div>
            <div className="container-fluid p-0 member-container">
                <div className="row">
                    <div className="col-md-12">
                        <h3 className="instruct-header">{details.heading}</h3>
                        <p className="instruct-description">{details.subHeading}</p>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-md-12 text-center mb-4"><a href={this.state.emailContentDetails.meetingURL} target="_blank" className="start-visit">{details.startVisit}</a></div>
                </div>
                <div className="row mt-4">
                    <div className="col-md-12" style={{color: '#000000'}}>{details.dateTime}: {this.getHoursAndMinutes(this.state.emailContentDetails.meetingTimeStamp,'date',this.state.emailContentDetails.lang)}{details.at} {this.getHoursAndMinutes(this.state.emailContentDetails.meetingTimeStamp,'time',this.state.emailContentDetails.lang)} Pacific Time</div>
                </div>
                <div className="col-md-12 mt-4 pl-0">
                    <a href={this.state.emailContentDetails.guestHelpUrl} target="_blank" className="email-data-link">{details.learnMore}</a>
                </div>
                <div className="row">
                    <div className="col-md-12" style={{color: '#000000'}}>{details.note}</div>
                </div>
            </div>
        </div>) }
}


export default GuestInstantJoin;
