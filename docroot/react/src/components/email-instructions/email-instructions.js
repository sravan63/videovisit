import React, { Component } from "react";
import BackendService from "../../services/backendService";
import EmailStartEarly from '../email-instructions/email-start-early/email-start-early';
import GuestInstructional from "./guest-instructional/guest-instructional";
import GuestStartEarly from "./guest-start-early/guest-start-early";
import MemberInstantJoin from "./member-instant-join/member-instant-join";

import EmailHeader from "./email-header/header";
import EmailFooter from "./email-footer/footer";
import PatientInstructional from "./patient-instructional/patient-instructional";
import PatientRunningLateReminder from "./patient-running-late-reminder/patient-running-late-reminder";
import GuestRunningLateReminder from "./guest-running-late-reminder/guest-running-late-reminder";

class emailInstructions extends Component {
    constructor(props) {
        super(props);
        this.state = {emailContentDetails:null,langName:{}, staticData:{}};
        this.lang = '';
    }

    componentDidMount() {
        const params = window.location.href.split('?')[1];
        const urlParams = new URLSearchParams( params );
        const tokenValue  = urlParams.has('tk') && urlParams.get('tk');
        this.lang  = urlParams.has('lang') && urlParams.get('lang');
        this.setState({langName: this.lang});
        this.getVisitDetails(tokenValue);
        let lang = this.lang === 'spa'? "spanish" : "chinese";
        let data = require('../../lang/'+lang+'.json');
        this.setState({
            staticData: data
        });
    }

    getVisitDetails(tokenValue){
        BackendService.validateJwtToken(tokenValue).subscribe((response) => {
            if (response.data && response.status == '200') {
                let lang = this.lang === 'spa'? "spanish" : "chinese";
                response.data.service.envelope.emailDynamicContent.lang = lang;
                this.setState({emailContentDetails: response.data.service.envelope.emailDynamicContent});
            } else {
                // Do nothing
            }
        }, (err) => {
            console.log("Error");
        });
    }

    render() {
        let details = this.state.emailContentDetails;
        let content = this.state.staticData;
        const emailTemplates = () => {
            switch(details && details.emailType) {
                case "member_earlystart":
                    return <EmailStartEarly data={details} content={content.email} />;
                case "member_instruction":
                    return <PatientInstructional data={details} content={content.email} />;
                case "caregiver_instruction":
                    return <GuestInstructional data={details} content={content.email} />;
                case "caregiver_earlystart":
                    return <GuestStartEarly data={details} content={content.email} />;
                case "member_instant_join":
                    return <MemberInstantJoin data={details} content={content.email} />;
                case "member_runninglate":
                    return <PatientRunningLateReminder data={details} content={content.email}/>;
                case "caregiver_running_late":
                    return <GuestRunningLateReminder data={details} content={content.email}/>;
                default:
                    return null
            }
          }
        return (  details && details.emailType ?
            (<div>
                <EmailHeader/>
                { emailTemplates() }
                <EmailFooter content={content.email.footer}/>
            </div> ) : ('') )
    }
}

export default emailInstructions;
