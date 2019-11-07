import React from "react";
import axios from 'axios';
import Header from '../../header/header';
import './myMeetings.less';

class MyMeetings extends React.Component {
    constructor(props) {
        super(props);
        this.data = [];
        this.state = { userDetails: {}, myMeetings: [] };
        this.getHoursAndMinutes = this.getHoursAndMinutes.bind(this);
        this.getMyMeetings = this.getMyMeetings.bind(this);
    }
    componentDidMount() {
        if (localStorage.getItem('signedIn')) {
            var signIn = JSON.parse(localStorage.getItem('signedIn'));
            /*this.state.userDetails = this.props.userDetails.userDetails;
			if(this.props.userDetails.userDetails){
				this.getMyMeetings();
			}*/
           /* if (this.state.userDetails) {
                this.getMyMeetings();
            }*/
        } else {
            this.props.history.push('/login');
        }
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
            headers.ssoSession = this.state.userDetails.ssoSession;
        }
        axios.post('/videovisit/' + myMeetingsUrl + '?getProxyMeetings=' + isProxy, {}, { headers: headers }).then((response) => {
            if (response.data && response.data.statusCode == '200') {
                var tempState = this.state;
                tempState.myMeetings = response.data.data ? response.data.data : [];
                this.setState({ tempState });
            }
        }, (err) => {
            console.log(err);
            if (err.response && err.response.status == 401) {
                alert("Un Authorised");
                localStorage.clear();
                this.props.history.push('/login');
            }
        });
    }
    getHoursAndMinutes(millis) {
        return new Date(parseInt(millis)).getHours() + ':' + new Date(parseInt(millis)).getMinutes();
    }
    signOff() {
        let signOfUrl = "/ssosignoff.json";
        let headers = {
            "Content-Type": "application/json"
        };
        if (this.state.userDetails.isTempAccess) {

        } else {
            headers.ssoSession = this.state.userDetails.ssoSession;
        }
        localStorage.clear();
        axios.post('/videovisit' + signOfUrl, {}, { headers: headers }).then((response) => {
            this.props.history.push('/login');
            if (response) {}
        }, (err) => {
            this.props.history.push('/login');
            console.log(err);
        });
    }
    render() {
        return (
            <div id='container' className="my-meetings">
				<Header signOffMethod={this.signOff.bind(this)} />
				<h1>Your Video Visits for Today</h1>
				<div>
				{this.state.myMeetings.length > 0 ? (
					this.state.myMeetings.map((item,key) =>{
						return (
							<div className="seperator" key={key}>
								<div>Host: {item.host.firstName} {item.host.lastName}</div>
								<div className="pat">Patient: {item.member.firstName} {item.member.lastName}</div>
								<div>Time: {this.getHoursAndMinutes(item.meetingTime)}</div>
								<div><button type="button" className="btn btn-outline-primary join ml-4">Join</button></div>
							</div>
						)
					}) 
				):(
						<div className="nomeetingsmsg">You have no meetings in the next 15 minutes.</div>
				)}
				</div>
			</div>
        )
    }
}

export default MyMeetings;