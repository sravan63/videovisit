import React, { Component,Suspense } from "react";
import '../email-templates.less';
import './guest-instructional.less';
import GlobalConfig from "../../../services/global.config";
import PermanenteHeader  from '../../../assets/email/pm-tpmg-blue.svg';
import Logo from '../../../assets/email/kp-logo.png';
import FooterLogo from '../../../assets/email/pm-tpmg-white.webp';

class GuestInstructional extends Component {
    constructor(props) {
        super(props);
        this.state = {emailContentDetails:props.data,staticData:{}};
        this.getHoursAndMinutes = this.getHoursAndMinutes.bind(this);
    }

    componentDidMount() {
        let data = require('../../../lang/'+this.state.emailContentDetails.lang+'.json');
        this.setState({
            staticData: data.email.caregiverInstructionalEmail
        });
    }

    getHoursAndMinutes(millis, type,lang) {
        if (!millis) {
            return;
        }
        return this.formatInMeetingDateAndTime(new Date(parseInt(millis)), type,lang);

    }

    formatInMeetingDateAndTime(DateObj, type,lang) {
        let str = '';
        if (type == 'time') {
            let Hour = (DateObj.getHours() > 12 ? parseInt(DateObj.getHours()) - 12 : DateObj.getHours());
            let Minutes = (DateObj.getMinutes() <= 9) ? "0" + DateObj.getMinutes() : DateObj.getMinutes();
            let AMPM = DateObj.getHours() > 11 ? "PM" : "AM";
            Hour = (Hour == 0) ? 12 : Hour;
            switch(lang){
                case "spanish":
                    str = Hour + ':' + Minutes + " " + (DateObj.getHours() > 11 ? 'p. m.' : 'a. m.');
                    break;
                case "chinese":
                    str = (DateObj.getHours() > 11 ? '下午' : '上午') + ''+ Hour + ':' + Minutes;
                    break;
                default:
                    str = Hour + ':' + Minutes + " " + AMPM;
                    break;
            }

        } else {
            let week = GlobalConfig.WEEK_DAYS[lang][DateObj.getDay()];
            let month = GlobalConfig.MONTHS[lang][DateObj.getMonth()];
            let date = DateObj.getDate() < 10 ? String(DateObj.getDate()).replace("0", "") : DateObj.getDate();

            switch(lang){
                case "spanish":
                    str = week + ', ' + date + ' de ' +  month;
                    break;
                case "chinese":
                    str = week + ', ' + month + '' +  date;
                    break;
                default:
                    str = week + ', ' + month + ' ' +  date;
                    break;
            }
        }
        return str;
    }

    render() {
        let details = this.state.staticData;
        return (
                <div className="wrapper container-fluid p-0">
                    <div className="instruction">
                        <p className="instruct-header">{details.heading} </p>
                        <p className="instruct-description">{details.subHeading}</p>
                        <div className="visit-rules">
                            <ul>
                                <li style={{ fontWeight:'bold' }}>{details.rule1}</li>
                                <li>{details.rule2}</li>
                                <li>{details.rule3}</li>
                                <li style={{marginBottom:'12px'}}>{details.rule4}</li>
                            </ul>
                        </div>
                        <div className="text-center">
                            <a href={this.state.emailContentDetails.meetingURL}
                               target="_blank" className="start-visit">{details.startVisit}</a>
                        </div>
                        <div className="time-details">
                            <p>{details.dateTime}: {this.getHoursAndMinutes(this.state.emailContentDetails.meetingTimeStamp,'date',this.state.emailContentDetails.lang)} at {this.getHoursAndMinutes(this.state.emailContentDetails.meetingTimeStamp,'time',this.state.emailContentDetails.lang)} Pacific Time</p>
                            <p>{details.patient}: {this.state.emailContentDetails.memberFirstName} {this.state.emailContentDetails.lastNameFirstCharMember}</p>
                            <p>{details.clinician}: {this.state.emailContentDetails.doctorFirstName} {this.state.emailContentDetails.doctorLastName} {this.state.emailContentDetails.doctorTitle}</p>
                        </div>
                        <div className="learn-more">
                            <a href={this.state.emailContentDetails.guestHelpUrl} target="_blank">{details.learnMore}</a>
                        </div>
                        <div className="need-help">
                            <p>{details.needHelp1}</p>
                            <p>{details.needHelp2}</p>
                            <p>{details.needHelp3}</p>
                        </div>
                    </div>
                </div>)
    }
}

export default GuestInstructional;
