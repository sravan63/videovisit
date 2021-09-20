import React, { Component } from "react";
import BackendService from "../../services/backendService";

class emailInstructions extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const params = window.location.href.split('?')[1];
        const urlParams = new URLSearchParams( params );
        const tokenValue  = urlParams.has('tk') && urlParams.get('tk');
        const lang  = urlParams.has('lang') && urlParams.get('lang');
        this.getVisitDetails(tokenValue);
    }

    getVisitDetails(tokenValue){
        BackendService.validateJwtToken(tokenValue).subscribe((response) => {
            if (response.data && response.status == '200') {

            } else {
                // Do nothing
            }
        }, (err) => {
            console.log("Error");
        });
    }

    render() {
        return ( <div className="email-container">
            <p >Get ready for your
                video visit</p>
        </div> )
    }
}

export default emailInstructions;
