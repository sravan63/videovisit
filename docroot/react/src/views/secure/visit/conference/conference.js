import React from "react";
import Header from '../../../../components/header/header';
import Loader from '../../../../components/loader/loader';
import BackendService from '../../../../services/backendService.js';
import './conference.less';

class Conference extends React.Component {

    constructor(props) {
        super(props);
        this.interval = '';
        this.state = { userDetails: {}, meetingDetails: {}, showLoader: true };
        this.getHoursAndMinutes = this.getHoursAndMinutes.bind(this);
        this.getMyMeetings = this.getMyMeetings.bind(this);
        this.getClinicianName = this.getClinicianName.bind(this);
    }

    componentDidMount() {
        this.interval = setInterval(() => this.getMyMeetings(), 180000);
        if (localStorage.getItem('userDetails')) {
            this.state.userDetails = JSON.parse(localStorage.getItem('userDetails'));
            if (this.state.userDetails) {
                this.getMyMeetings();
            }
        } else {
            this.props.history.push('/login');
        }
    }

    componentWillUnmount() {
        clearTimeout(this.interval);
    }

    getMyMeetings() {
        let headers = {
            "Content-Type": "application/json",
            "mrn": this.state.userDetails.mrn
        };
        let myMeetingsUrl = "retrieveActiveMeetingsForMemberAndProxies.json";
        let isProxy = true;
        if (this.state.userDetails.isTempAccess) {
            headers.authtoken = this.state.userDetails.ssoSession;
            isProxy = false;
            myMeetingsUrl = "retrieveActiveMeetingsForMember.json";
        } else {
            if (this.state.userDetails.mrn) {
                headers.isNonMember = false
            } else {
                headers.isNonMember = true;
            }
            headers.guid = this.state.userDetails.guid;
            headers.ssoSession = this.state.userDetails.ssoSession;
        }
        BackendService.getMyMeetings(myMeetingsUrl, isProxy, headers).subscribe((response) => {
            if (response.data && response.data.statusCode == '200') {
                var tempState = this.state;
                tempState.meetingDetails = response.data.data ? response.data.data : [];
                tempState.showLoader = false;
                this.setState({ tempState });
            } else {
                this.state.showLoader = false;
            }
        }, (err) => {
            console.log(err);
            if (err.response && err.response.status == 401) {
                alert("Un Authorised");
                localStorage.clear();
                this.setState({ showLoader: false });
                this.props.history.push('/login');
            }
            this.setState({ showLoader: false });
        });
    }

    getClinicianName(host) {
        let clinician = '';
        clinician += host.firstName ? host.firstName.toLowerCase() : '';
        clinician += host.lastName ? ' ' + host.lastName.toLowerCase() : '';
        clinician += host.title ? ', ' + host.title : '';
        return clinician.trim();
    }

    getHoursAndMinutes(millis) {
        let DateObj = new Date(parseInt(millis));
        let Hour = (DateObj.getHours() > 12 ? parseInt(DateObj.getHours()) - 12 : DateObj.getHours());
        if (Hour == 0) {
            Hour = 12;
        }
        if (Hour <= 9) {
            Hour = "0" + Hour;
        }
        let Minutes = DateObj.getMinutes();
        if (Minutes <= 9) {
            Minutes = "0" + Minutes;
        }
        let AMPM = DateObj.getHours() > 11 ? "PM" : "AM";
        return Hour + ':' + Minutes + " " + AMPM;
    }


    render() {
        return (
            <div>CONFERENCE PAGE</div>
        )
    }
}

export default Conference;