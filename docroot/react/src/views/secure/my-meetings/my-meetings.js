import React from "react";
import Header from '../../../components/header/header';
import MobileHeader from '../../../components/mobile-header/mobile-header';
import Loader from '../../../components/loader/loader';
import BackendService from '../../../services/backendService.js';
import { MessageService } from '../../../services/message-service.js';
import GlobalConfig from '../../../services/global.config';
import UtilityService from '../../../services/utilities-service.js';
import Footer from '../../../components/footer/footer';
import './my-meetings.less';
class MyMeetings extends React.Component {

    constructor(props) {
        super(props);
        this.interval = '';
        this.state = { userDetails: {}, myMeetings: [], showLoader: true,isInApp: false,mdoHelpUrl:'',showFooter : true,showPromotion: false,hidePromotion: false};
        this.getHoursAndMinutes = this.getHoursAndMinutes.bind(this);
        this.getMyMeetings = this.getMyMeetings.bind(this);
        this.getClinicianName = this.getClinicianName.bind(this);
        this.signOff = this.signOff.bind(this);
        this.keepAlive = 0;
        // this.joinMeeting = this.joinMeeting.bind(this);
    }
    componentDidMount() {
        this.interval = setInterval(() => this.getMyMeetings(), GlobalConfig.AUTO_REFRESH_TIMER);
        if (localStorage.getItem('LoginUserDetails')) {
            const udata = JSON.parse(UtilityService.decrypt(localStorage.getItem('LoginUserDetails')));
            this.state.userDetails = udata;
            if (this.state.userDetails) {
                this.getMyMeetings();
            }
        } else {
            this.props.history.push(GlobalConfig.LOGIN_URL);
        }
        this.subscription = MessageService.getMessage().subscribe((notification) => {
            if (notification.text == GlobalConfig.LOGOUT) {
                this.signOff();
            }
            else if(notification.text == GlobalConfig.TOGGLE_MOBILE_FOOTER){
                this.setState({showFooter : notification.data });
                this.state.showFooter = notification.data;
            }
        });      
        var isInAppAccess = UtilityService.getInAppAccessFlag();
        this.setState({isInApp: isInAppAccess});
        //this.getBrowserBlockInfo();
        if(localStorage.getItem('helpUrl')){
            var helpUrl = localStorage.getItem('helpUrl');
            this.setState({ mdoHelpUrl: helpUrl });
        }

        var isTempAccess = this.state.userDetails.isTempAccess;
        if(localStorage.getItem('keepAlive') && !isTempAccess){
            var keepAliveUrl = localStorage.getItem('keepAlive');
            BackendService.keepAliveCookie(keepAliveUrl);
        }
        if(!isTempAccess){
            this.keepAlive = setInterval(() => {
                var keepAliveUrl = localStorage.getItem('keepAlive');
                BackendService.keepAliveCookie(keepAliveUrl);
            }, 1200000);
        }
        var showPromotion = UtilityService.getPromotionFlag();
        var isMobile = UtilityService.isMobileDevice();
        if (isMobile && showPromotion) { 
            this.setState({ hidePromotion: true });
        }    
    }

    componentWillUnmount() {
        window.clearInterval(this.interval);
        window.clearInterval(this.keepAlive);
        this.subscription.unsubscribe();
        if(localStorage.getItem('meetingAttended')){
            this.signOff();
        }
    }
    /*getBrowserBlockInfo(){
        var propertyName = 'browser',
            url = "loadPropertiesByName.json",
            browserNames = '';
        BackendService.getBrowserBlockDetails(url, propertyName).subscribe((response) => {
            if (response.data && response.status == '200') {
                 browserNames = response.data; 
                 this.setState({ mdoHelpUrl: response.data.mdoHelpUrl });
            } else {
                // Do nothing
            }
        }, (err) => {
            console.log("Error");
        });
    }*/
    resetSessionToken(token){
        this.state.userDetails.ssoSession = token;
        localStorage.setItem('userDetails', UtilityService.encrypt(JSON.stringify(this.state.userDetails)));
        localStorage.setItem('LoginUserDetails', UtilityService.encrypt(JSON.stringify(this.state.userDetails)));
    }

    getMyMeetings() {
        let headers = {
            "Content-Type": "application/json",
            "mrn": this.state.userDetails.mrn ? this.state.userDetails.mrn : ''
        };
        let myMeetingsUrl = "retrieveActiveMeetingsForMemberAndProxies.json";
        let isProxy = true;
        let loginType = "sso";
        if (this.state.userDetails.isTempAccess) {
            headers.authtoken = this.state.userDetails.ssoSession;
            isProxy = false;
            loginType = GlobalConfig.LOGIN_TYPE.TEMP; // "tempAccess";
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
                if (this.state.userDetails.isTempAccess){
                    this.resetSessionToken(response.headers.authtoken);
                }
            } else {
                this.setState({ showLoader: false });
            }
        }, (err) => {
            console.log(err);
            if (err.response && err.response.status == 401) {
                // alert("Un Authorised");
                localStorage.clear();
                this.setState({ showLoader: false });
                UtilityService.setPromotionFlag(false);
                this.props.history.push(GlobalConfig.LOGIN_URL);
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

    signOff() {
        localStorage.clear();
        var loginType;
        var headers = {},
            data = this.state.userDetails;
        if (data.isTempAccess) {
            headers.authtoken = data.ssoSession;
            loginType = GlobalConfig.LOGIN_TYPE.TEMP;
        } else {
            headers.ssoSession = data.ssoSession;
            loginType = GlobalConfig.LOGIN_TYPE.SSO;
        }
        BackendService.logout(headers, loginType).subscribe((response) => {
            if (response.data != "" && response.data != null && response.data.statusCode == 200) {
                this.props.history.push('/login');
            } else {
                this.props.history.push('/login');
            }
        }, (err) => {
            this.props.history.push('/login');

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

    checkIOS(url){
        var iOSver = UtilityService.iOSversion();
        if (iOSver[0] >= 7) {                   
            window.location.replace(url);
        }else{
            this.openTab(url);
        }
    }

    openTab(url){
        var a = window.document.createElement("a");
        a.target = '_blank';
        a.href = url;
        // Dispatch fake click
        var e = window.document.createEvent("MouseEvents");
        e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
    }

    joinMeeting(meeting) {
        console.log(meeting);
        localStorage.removeItem('meetingAttended')
        localStorage.setItem('meetingId', JSON.stringify(meeting.meetingId));
        this.setState({ showLoader: true });
        var myMeetingsUrl;
        var meetingId = meeting.meetingId;
        var headers = {
            "Content-Type": "application/json",
            "mrn": this.state.userDetails.mrn ? this.state.userDetails.mrn : ''
        };
        var sessionInfo = {};
        var isInAppAccess = UtilityService.getInAppAccessFlag();
        var loginType = GlobalConfig.LOGIN_TYPE.SSO;
        if (this.state.userDetails.isTempAccess) {
            headers.authtoken = this.state.userDetails.ssoSession;
            headers.megaMeetingDisplayName = meeting.member.inMeetingDisplayName;
            loginType = GlobalConfig.LOGIN_TYPE.TEMP;
            if(isInAppAccess){
                myMeetingsUrl = "launchMeetingForMember.json";
            }
            else{
                myMeetingsUrl = "launchMeetingForMemberDesktop.json";
            }
        } else {
            var isProxyMeeting,
                loginMrn = this.state.userDetails.mrn;
            if (loginMrn == meeting.member.mrn) {
                isProxyMeeting = "N";
                myMeetingsUrl = "launchMeetingForMemberDesktop.json";
                headers.ssoSession = this.state.userDetails.ssoSession;
                headers.megaMeetingDisplayName = meeting.member.inMeetingDisplayName;
            } else {
                isProxyMeeting = "Y";
                myMeetingsUrl = "launchMemberProxyMeeting.json";
                headers.ssoSession = this.state.userDetails.ssoSession;
                headers.inMeetingDisplayName = meeting.member.inMeetingDisplayName;
            }
            headers.isProxyMeeting = isProxyMeeting;
            localStorage.setItem('isProxyMeeting', JSON.stringify(isProxyMeeting));
        }
        sessionInfo.loginType = loginType;
        localStorage.setItem('sessionInfo', JSON.stringify(sessionInfo));
        var isMobile = UtilityService.isMobileDevice();
        BackendService.launchMemberVisit(myMeetingsUrl, meetingId, headers, loginType, isMobile).subscribe((response) => {
            if (response.data && response.data.statusCode == '200') {
                if (response.data.data != null && response.data.data != '') {
                    if (this.state.userDetails.isTempAccess){
                        this.resetSessionToken(response.headers.authtoken);
                    }
                    this.setState({ showLoader: false });
                    var roomJoin = response.data.data.roomJoinUrl;
                    localStorage.setItem('userDetails', UtilityService.encrypt(JSON.stringify(this.state.userDetails)));
                    localStorage.setItem('roomUrl', roomJoin);
                    //InApp logic
                    var isInAppAccess = UtilityService.getInAppAccessFlag();
                    if(isInAppAccess){
                        var os = UtilityService.getAppOS();
                        if(os=='iOS'){
                          window.location.replace(roomJoin);
                        } else {
                            var isAndroidSDK = sessionStorage.getItem('isAndroidSDK');
                            if(isAndroidSDK=="true") {
                                this.openTab(roomJoin);
                            } else {
                                this.props.history.push(GlobalConfig.VIDEO_VISIT_ROOM_URL);
                            }
                        }
                    }
                    // inapp logic ends
                    this.props.history.push(GlobalConfig.VIDEO_VISIT_ROOM_URL);
                } else {
                    this.setState({ showLoader: false });
                }
            } else {
                this.setState({ showLoader: false });
            }
        }, (err) => {
            console.log(err);
            this.setState({ showLoader: false });
            this.props.history.push(GlobalConfig.LOGIN_URL);
        });
    }


    render() {
        return (
            <div id='container' className="my-meetings">
                {this.state.showLoader && !this.state.isInApp ? (<Loader />):('')}
                <Header history={this.props.history} helpUrl={this.state.mdoHelpUrl} />
                <MobileHeader />
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
                <div className="no-meetings">{!this.state.showLoader ? (<p className="text-center">You have no visits in the next 15 minutes.</p>):('')}</div>
                )}
                { !this.state.hidePromotion ? 
                    (<div className="row promotion-container show-promotion">
                        <div className="promotion">
                            <div className="banner"><div className="image-holder"></div></div>
                            <div className="message-container">
                                <div className="wrapper">
                                    <div className="message">Next time you want to see your doctor, try a video visit from our My Doctor Online mobile app.</div>
                                    <div className="badgets">
                                        <div className="ios icon"><a className="icon-link" href="https://itunes.apple.com/us/app/my-doctor-online-ncal-only/id497468339?mt=8" target="_blank"></a></div>
                                        <div className="android icon"><a className="icon-link" href="https://play.google.com/store/apps/details?id=org.kp.tpmg.preventivecare&amp;hl=en_US" target="_blank"></a></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>) : ('') }
                 <div className="col-sm-12 col-lg-12 col-md-12" className={this.state.isInApp && window.window.innerWidth >= 1024 ? "wifi inapp-wifi" : "wifi"}>
                    <p>Please make sure you have a strong Wi-Fi or 4G connection</p>
                 </div>
                </div>
                {this.state.showFooter ? (<div className="mymeeting-form-footer">
                    <Footer />
                </div>) : ('') }
                
            </div>
        )
    }
}

export default MyMeetings;