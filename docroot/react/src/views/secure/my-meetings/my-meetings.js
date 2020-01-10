import React from "react";
import Header from '../../../components/header/header';
import Loader from '../../../components/loader/loader';
import BackendService from '../../../services/backendService.js';
import './my-meetings.less';

class MyMeetings extends React.Component {

    constructor(props) {
        super(props);
        this.interval = '';
        this.state = { userDetails: {}, myMeetings: [], showLoader: true };
        this.getHoursAndMinutes = this.getHoursAndMinutes.bind(this);
        this.getMyMeetings = this.getMyMeetings.bind(this);
        this.getClinicianName = this.getClinicianName.bind(this);
        // this.joinMeeting = this.joinMeeting.bind(this);
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
        let loginType = "sso";
        if (this.state.userDetails.isTempAccess) {
            headers.authtoken = this.state.userDetails.ssoSession;
            isProxy = false;
            loginType = "tempAccess";
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
        BackendService.getMyMeetings(myMeetingsUrl, isProxy, headers, loginType).subscribe((response) => {
            if (response.data && response.data.statusCode == '200') {
                var tempState = this.state;
                tempState.myMeetings = response.data.data ? response.data.data : [];
                tempState.showLoader = false;
                this.setState({ tempState });
            } else {
                this.setState({ showLoader: false });
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

    joinMeeting(meeting) {
        console.log(meeting);
        localStorage.setItem('meetingId', JSON.stringify(meeting.meetingId));
        this.setState({ showLoader: true });
        //this.props.history.push('/videoVisitReady');
        var myMeetingsUrl = "launchMeetingForMemberDesktop.json";
        var meetingId = meeting.meetingId;
        var headers = {
            "Content-Type": "application/json",
            "mrn": this.state.userDetails.mrn
        };
        var loginType = "sso";
        if (this.state.userDetails.isTempAccess) {
            headers.authtoken = this.state.userDetails.ssoSession;
            headers.megaMeetingDisplayName = meeting.member.inMeetingDisplayName;
            loginType = "tempAccess";

        } else {
            myMeetingsUrl = "launchMemberProxyMeeting.json";
            headers.ssoSession = this.state.userDetails.ssoSession;
            headers.inMeetingDisplayName = meeting.member.inMeetingDisplayName;
        }
        BackendService.launchMemberVisit(myMeetingsUrl, meetingId, headers, loginType).subscribe((response) => {
            if (response.data && response.data.statusCode == '200') {
                if (response.data.data != null && response.data.data != '') {
                    this.props.history.push('/videoVisitReady');
                    var roomJoin = response.data.data.roomJoinUrl;
                    localStorage.setItem('roomUrl', roomJoin);
                } else {
                    this.setState({ showLoader: false });
                }
            } else {
                this.setState({ showLoader: false });
            }
        }, (err) => {
            console.log(err);
            this.setState({ showLoader: false });
        });
    }


    render() {
        return (
            <div id='container' className="my-meetings">
                {this.state.showLoader ? (<Loader />):('')}
                <Header history={this.props.history}/>
                <div className="mobile-header">Video Visits</div>
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
                                            <div className="clinician-name-and-details">
                                                <span className="text-capitalize clinician-name font-weight-bold ml-3">{this.getClinicianName(item.host)}</span>
                                            <span className="department-details text-capitalize ml-3">{item.host.departmentName?item.host.departmentName.toLowerCase():''}</span>
                                            </div>
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
                                          <button type="button" className="btn rounded-0 p-0 join-visit" disabled={item.meetingVendorId==null} onClick={this.joinMeeting.bind(this,item)}>Join your visit</button>
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
                <div className="no-meetings">{!this.state.showLoader ? (<p className="text-center">You have no meetings in the next 15 minutes.</p>):('')}</div>
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