import React, { Component } from "react";
import BackendService from "../../services/backendService";
import EmailStartEarlySp from '../email-instructions/email-start-early-sp';
import EmailStartEarlyCh from '../email-instructions/email-start-early-ch';

class emailInstructions extends Component {
    constructor(props) {
        super(props);
        this.state = {emailContentDetails:{},langName:{}}
    }

    componentDidMount() {
        const params = window.location.href.split('?')[1];
        const urlParams = new URLSearchParams( params );
        const tokenValue  = urlParams.has('tk') && urlParams.get('tk');
        const lang  = urlParams.has('lang') && urlParams.get('lang');
        this.setState({langName: lang});
        this.getVisitDetails(tokenValue);
    }

    getVisitDetails(tokenValue){
        BackendService.validateJwtToken(tokenValue).subscribe((response) => {
            if (response.data && response.status == '200') {
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
            if(details.emailType == "GUEST_EARLYSTART" && langName == "spa"){
                return <EmailStartEarlySp data={details} />;
            }
            if(details.emailType == "GUEST_EARLYSTART" && langName == "chi"){
                return <EmailStartEarlyCh data={details} />;
            }
          }
        return ( <div>
            {emailTemplates()}
                </div> )
    }
}

export default emailInstructions;
