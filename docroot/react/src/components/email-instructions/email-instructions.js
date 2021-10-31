import React, { Component } from "react";
import BackendService from "../../services/backendService";
import EmailStartEarlySp from '../email-instructions/email-start-early-sp';
import EmailStartEarlyCh from '../email-instructions/email-start-early-ch';
import GuestInstructional from "./guest-instructional/guest-instructional";

class emailInstructions extends Component {
    constructor(props) {
        super(props);
        this.state = {emailContentDetails:null,langName:{}};
        this.lang = '';
    }

    componentDidMount() {
        const params = window.location.href.split('?')[1];
        const urlParams = new URLSearchParams( params );
        const tokenValue  = urlParams.has('tk') && urlParams.get('tk');
        this.lang  = urlParams.has('lang') && urlParams.get('lang');
        this.setState({langName: this.lang});
        this.getVisitDetails(tokenValue);
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
        let langName = this.state.langName;
        const emailTemplates = () => {
            switch(details && details.emailType) {
                case "GUEST_EARLYSTART":
                    if(langName == "spa"){
                        return <EmailStartEarlySp data={details} />;
                    }
                    else{
                        return <EmailStartEarlyCh data={details} />;
                    }
                case "caregiver_instructional_email":
                    return <GuestInstructional data={details} />;
                default:
                    return null
            }
          }
        return ( <div>
            {emailTemplates()}
                </div> )
    }
}

export default emailInstructions;
