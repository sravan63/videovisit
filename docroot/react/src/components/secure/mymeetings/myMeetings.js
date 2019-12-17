import React from "react";
import axios from 'axios';
import Header from '../../header/header';
import './myMeetings.less';

class MyMeetings extends React.Component {

    constructor(props) {
        super(props);
        this.interval = '';
        this.state = { userDetails: {}, myMeetings: [] };
        this.getHoursAndMinutes = this.getHoursAndMinutes.bind(this);
        this.getMyMeetings = this.getMyMeetings.bind(this);
    }
    componentDidMount() {
        this.interval = setInterval(() => this.getMyMeetings(), 180000);
        if (localStorage.getItem('userDetails')) {
            this.state.userDetails = JSON.parse(localStorage.getItem('userDetails'));
            /*this.state.userDetails = this.props.userDetails.userDetails;
            if(this.props.userDetails.userDetails){
                this.getMyMeetings();
            }*/
            if (this.state.userDetails) {
                this.getMyMeetings();
            }
        } else {
            this.props.history.push('/login');
        }



        /*if (localStorage.getItem('signedIn')) {
            var signIn = JSON.parse(localStorage.getItem('signedIn'));
            this.state.userDetails = this.props.userDetails.userDetails;
            if(this.props.userDetails.userDetails){
                this.getMyMeetings();
            }
             if (this.state.userDetails) {
                 this.getMyMeetings();
             }
        } else {
            
        }*/
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
            <div id='container' className="my-meetings">
                <Header history={this.props.history}/>
                <div className="meetings-container">
                <h1 className="visitsToday">Your Video Visits for Today</h1>
                {this.state.myMeetings.length > 0 ? (
                    this.state.myMeetings.map((item,key) =>{
                        return (
                            <div className="meeting-content row" key={key}>
                                {item.isRunningLate == true || item.isRunningLate == "true"?(<div className="col-md-12 running-late-indicator"><span className="runningLate">We're sorry, your doctor is running late.</span> New start time is<span className="newTime"> {this.getHoursAndMinutes(item.runLateMeetingTime)}</span></div>):('')}
                                <div className="col-md-8 pl-0">
                                    <div className="row">
                                        <div className="col-md-5">
                                        <span className="time d-block">{this.getHoursAndMinutes(item.meetingTime)}</span>
                                        <span className="text-capitalize patient-name">{item.member.lastName?item.member.lastName.toLowerCase():''}{item.member.firstName?(', ' +item.member.firstName.toLowerCase()):''} {item.member.middleName?item.member.middleName.toLowerCase():''} </span>
                                        </div>
                                        <div className="col-md-7 clinician-details">
                                        <img className="circle-image" src={item.host.imageUrl} alt="" />
                                        <span className="text-capitalize clinician-name font-weight-bold ml-3">{item.host.firstName?item.host.firstName.toLowerCase():''} {item.host.lastName?item.host.lastName.toLowerCase():''}
                                        {item.host.title? (', ' + item.host.title):''}</span>
                                        <span className="department-details text-capitalize">{item.host.departmentName?item.host.departmentName.toLowerCase():''}</span>
                                        </div>
                                    </div>
                                    <div>
                                    {(item.participant && item.participant.length> 0) || 
                                    (item.caregiver && item.caregiver.length > 0) ||
                                    (item.sipParticipants && item.sipParticipants.length > 0) ?
                                    <h5 className="mt-4">Additional Participants</h5>:('')}
                                    {(item.participant && item.participant.length> 0)? 
                                    item.participant.map((val,index) => {
                                    return ( 
                                    <div key={index}>  
                                     <span className="text-capitalize">{val.firstName?val.firstName.toLowerCase():''} {val.lastName?val.lastName.toLowerCase():''}
                                        {val.title? (', ' + val.title):''}</span>
                                    </div>
                                    ) 
                                    })
                                    :('')}
                                    {(item.caregiver && item.caregiver.length> 0)? 
                                    item.caregiver.map((val,index) => {
                                    return ( 
                                    <div key={index}>  
                                     <span className="text-capitalize">{val.firstName?val.firstName.toLowerCase():''} {val.lastName?val.lastName.toLowerCase():''}
                                     </span>
                                    </div>
                                    ) 
                                    })
                                    :('')}
                                    {(item.sipParticipants && item.sipParticipants.length> 0)? 
                                    item.sipParticipants.map((val,index) => {
                                    return ( 
                                    <div key={index}>  
                                     <span className="telephony">{val.displayName?val.displayName:''}</span>
                                    </div>
                                    ) 
                                    })
                                    :('')}
                                    </div>
                                </div>
                                <div className="col-md-4 pr-0 pl-0">
                                    <div className="row joinNow-container">
                                        <div className="col-md-12 videoJoin">
                                        <div className="video-button">
                                          <button type="button" className="btn rounded-0 p-0 join-visit" disabled={item.meetingVendorId==null} id="join">Join your visit</button>
                                        </div>
                                        </div>
                                        <div className="col-md-12 mt-3 joinText">
                                        {this.state.userDetails.isTempAccess ||item.meetingVendorId != null ?
                                        (<span>You may be joining before your clinician. Please be patient.</span>):(<span>Your visit will be available within 15 minutes of the start time.</span>)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }) 

                ):(
                <div className="nomeetingsmsg">You have no meetings in the next 15 minutes.</div>
                )}
                 <div className="col-sm-12 wifi">
                        <p>Please make sure you have a strong Wi-Fi or 4G connection</p>
                                </div>
                </div>
            </div>
        )
    }
}

export default MyMeetings;