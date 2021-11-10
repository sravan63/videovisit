import React, { Component } from "react";
import './member-instant-join.less';
import Utilities from '../../../services/utilities-service.js';

class memberInstantJoin extends Component {
    constructor(props) {
        super(props);
        const content = props.content.memberInstantJoin;
        content['instructions'] = props.content.instructions;
        this.state = {emailContentDetails:props.data,staticData:content};
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
      return ( <div>
        <div className="container-fluid p-0 member-container">
                          <div className="row">
                                  
                                <div className="col-md-12">
                                  <h3 className="instruct-header">{details.subHeading} </h3>
                                  {details.subHeading2}{details.subHeading3} {this.getHoursAndMinutes(this.state.emailContentDetails.meetingTimeStamp,'date',this.state.emailContentDetails.lang)}{details.atText}{this.getHoursAndMinutes(this.state.emailContentDetails.meetingTimeStamp,'time',this.state.emailContentDetails.lang)}{details.timeZone}{details.subHeading4}</div>
                                </div>
                          <div className="row mt-4">
                            <div className="col-md-12 text-center mb-4"><a href={this.state.emailContentDetails.meetingURL} target="_blank" className="start-visit">{details.startVisit}</a></div>
                          </div>
                          <div className="col-md-12 mb-2 pl-0">
                                    <a href={this.state.emailContentDetails.guestHelpUrl} target="_blank" className="email-data-link">{details.learnMore}</a> 
                          </div>
                          <div className="row">
                            <div className="col-md-12">{details.subHeading5}</div>
                          </div>
          </div>
    </div>) }
  }
  

export default memberInstantJoin;
