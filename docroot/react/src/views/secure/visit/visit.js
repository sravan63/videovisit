import React, { Suspense, lazy } from 'react';
import Header from '../../../components/header/header';
import Loader from '../../../components/loader/loader';
import BackendService from '../../../services/backendService.js';
import Utilities from '../../../services/utilities-service.js';
import GlobalConfig from '../../../services/global.config';
import './visit.less';
import {MessageService} from "../../../services/message-service";

const PreCallCheck = React.lazy(() => import('./pre-call-check/pre-call-check'));
const Conference = React.lazy(() => import('./conference/conference'));

class Visit extends React.Component {

    constructor(props) {
        super(props);
        this.interval = '';
        this.state = { userDetails: {}, staticData:{}, chin:'中文',span:'Español', showPage: false,isInstantJoin: false,mdoHelpUrl:'', displayName:'', renderPage:false, isMobile: false, showPreCheck: true };
        this.denyUser = this.denyUser.bind(this);
        this.allowLogin = this.allowLogin.bind(this);
    }

    componentDidMount() {
        var isDirectLaunch = window.location.href.indexOf('isDirectLaunch') > -1,
            isInstantJoin = window.location.href.indexOf('isInstantJoin') > -1;
        if(isInstantJoin){
            this.getLanguage();
            if(sessionStorage.getItem('preCallCheckLoaded') || sessionStorage.getItem('isInstantJoin')) {
                this.showPreCallCheck();
            }else{
                this.launchInstantJoin();
                this.setState({isInstantJoin: true});
            }
        }
        else if (localStorage.getItem('userDetails')) {
            this.state.userDetails = JSON.parse(Utilities.decrypt(localStorage.getItem('userDetails')));
            if (this.state.userDetails) {
                this.setState({ showPage: true });
            }
            this.showPreCallCheck();
        } else if( isDirectLaunch ) {
            this.launchVisit();
        }
        else {
            if(sessionStorage.getItem('guestCode')){
                var meetingCode = JSON.parse(sessionStorage.getItem('guestCode'));
                this.props.history.push('/guestlogin?meetingcode=' + meetingCode);
            } else {
                this.props.history.push(GlobalConfig.LOGIN_URL);
            }

        }
        var isMobile = Utilities.isMobileDevice();
        if (isMobile) {
            this.setState({ isMobile: true });
        }
        this.subscription = MessageService.getMessage().subscribe((message) => {
                if(message.text==GlobalConfig.LANGUAGE_CHANGED){
                    this.getLanguage();
                }

        });


    }

    denyUser(){
        window.location.href = 'https://mydoctor.kaiserpermanente.org/ncal/videovisit/';
    }

    getLanguage(){
        let data = Utilities.getLang();
        if(data.lang=='spanish'){
            this.setState({span:'English',chin: '中文',staticData: data});
        }
        else if(data.lang=='chinese'){
            this.setState({chin:'English',span:'Español',staticData: data});
        }
        else {
            this.setState({span: "Español", chin: '中文',staticData: data});
        }

    }


    allowLogin(){
        this.setState({isInstantJoin:false});
        this.showPreCallCheck();
        sessionStorage.setItem('isInstantJoin',true);
    }

    showPreCallCheck(){
        var browserInfo = Utilities.getBrowserInformation();
        var peripheralsSelected = localStorage.getItem('selectedPeripherals');
        var showPreCallCheck = (browserInfo.isSafari || browserInfo.isFireFox);
        if (showPreCallCheck && !peripheralsSelected) {
            this.setState({ showPreCheck: true });
        } else {
            this.setState({ showPreCheck: false });
        }
    }

    getBrowserBlockInfo(){
        var propertyName = 'browser',
            url = "loadPropertiesByName.json",
            browserNames = '';
        BackendService.getBrowserBlockDetails(url, propertyName).subscribe((response) => {
            if (response.data && response.status == '200') {
                browserNames = response.data;
                this.setState({ mdoHelpUrl: response.data.mdoHelpUrl });
                localStorage.setItem('helpUrl',response.data.mdoHelpUrl);
                localStorage.setItem('mediaStats',response.data.INSERT_MEDIA_STATS_FREQUENCY);
                Utilities.setMeetingFeedbackTimeout(response.data.MEETING_FEEDBACK_TIMEOUT);
                Utilities.setMinTimeToShowUserSurvey(response.data.MINIMUM_IN_MEETING_TIME_FOR_SURVEY);
                if(Utilities.validateBrowserBlock(browserNames)){
                    this.props.history.push('/login');
                    return;
                }
            } else {
                // Do nothing
            }
        }, (err) => {
            console.log("Error");
        });

    }

    launchVisit() {
        var browserInfo = Utilities.getBrowserInformation();
        if( browserInfo.isIE ) {
            this.props.history.push(GlobalConfig.ERROR_PAGE);
            return;
        }
        const params = window.location.href.split('?')[1];
        const urlParams = new URLSearchParams( params );
        const isValidToken = urlParams.has('isValidToken') && JSON.parse(urlParams.get('isValidToken'));
        if( isValidToken ) {
            var isProxy = JSON.parse(urlParams.get('isProxy')) ? 'Y' : 'N';
            var userName = decodeURIComponent(urlParams.get('userDisplayName'));
            var meetingId = decodeURIComponent(urlParams.get('meetingId'));
            var userDetails = { isTempAccess: false, lastName : userName.split(',')[0].trim(), firstName : userName.split(',')[1].trim(), mrn : '', ssoSession: '' }
            localStorage.setItem('userDetails', Utilities.encrypt(JSON.stringify(userDetails)));
            localStorage.setItem('meetingId', JSON.stringify(meetingId));
            localStorage.setItem('isProxyMeeting', JSON.stringify(isProxy))
            localStorage.setItem('isDirectLaunch', true);
            this.setState({ showPage: true });
            this.setState({ isMobile: true });
            this.setState({ showPreCheck: false });
        } else {
            // this.props.history.push(GlobalConfig.ERROR_PAGE);
            window.location.href = 'autherror.htm';
        }
    }

    launchInstantJoin(){
        var browserInfo = Utilities.getBrowserInformation();
        if( browserInfo.isIE ) {
            this.props.history.push('/login');
            return;
        }
        this.getBrowserBlockInfo();
        const params = window.location.href.split('?')[1];
        const urlParams = new URLSearchParams( params );
        const isInstantJoin = urlParams.has('isInstantJoin') && JSON.parse(urlParams.get('isInstantJoin'));
        const tokenValue  = urlParams.has('tk') && urlParams.get('tk');
        let isMobile = Utilities.isMobileDevice();
        if(isInstantJoin && tokenValue!=''){
            BackendService.validateInstantJoin(isMobile, tokenValue).subscribe((response) => {
                if (response.data && response.status == '200') {
                    if (response.data.data != null && response.data.data != '') {
                        let userData = response.data.data;
                        let meetingId = userData.meeting.meetingId;
                        let isProxyMeeting = "N";
                        let fullName = userData.firstName + " " + userData.lastName;
                        this.setState({renderPage: true, displayName:fullName});
                        let userDetails = { isTempAccess: false, lastName :userData.lastName , firstName:userData.firstName , mrn:userData.meeting.member.mrn, ssoSession: '' };
                        localStorage.setItem('userDetails', Utilities.encrypt(JSON.stringify(userDetails)));
                        localStorage.setItem('meetingId', JSON.stringify(meetingId));
                        localStorage.setItem('isProxyMeeting', JSON.stringify(isProxyMeeting));
                    }
                    else{
                       this.props.history.push({
                            pathname: "/login",
                            state: { message: "instantJoin" },
                        });
                        // this.setState({renderPage: true, displayName:"Joe Mama"});
                    }
                } else {
                    this.props.history.push({
                        pathname: "/login",
                        state: { message: "instantJoin" },
                    });
                    // this.setState({renderPage: true, displayName:"Joe Mama"});
                }
            }, (err) => {
                this.props.history.push({
                    pathname: "/login",
                    state: { message: "instantJoin" },
                });
            });

        }
        else{
            this.props.history.push({
                pathname: "/login",
                state: { message: "instantJoin" },
            });            
            // this.setState({renderPage: true, displayName:"Joe Mama"});
        }
    }

    togglePrecheck() {
        this.setState({
            showPreCheck: false
        });
    }

    changeLang(event){
        let value = event.target.textContent;
        if(value=="中文"){
            sessionStorage.setItem('Instant-Lang-selection','chinese');
            Utilities.setLang('chinese');
        }
        else if(value=="Español"){
            sessionStorage.setItem('Instant-Lang-selection','spanish');
            Utilities.setLang('spanish');
         }
        else{
            sessionStorage.setItem('Instant-Lang-selection','english');
            Utilities.setLang('english');
        }
    }


    render() {
        let Details = this.state.staticData;
        if(Details && Details.instant_join){
            var instantDetails = Details.instant_join;
        }
        return (
            <div>{this.state.isInstantJoin ?(<div className='instantJoin-container' style={{visibility: this.state.renderPage ? 'visible' : 'hidden'}}>
                    <Header helpUrl = {this.state.mdoHelpUrl} data={Details}/>
                    <div className='instant-content'>
                        <div className="row instant-help-link-container">
                        <div className="col-lg-12 col-md-12 help-icon text-right p-0">
                        <a href={Details.HelpLink} className="help-link" target="_blank">{Details.Help}</a>
                            <div className="lang-change p-0">
                                <span className="divider" onClick={this.changeLang.bind(this)}>{this.state.chin}</span>
                                <span>|</span>
                                <span className="spanishlabel" onClick={this.changeLang.bind(this)}>{this.state.span}</span>
                            </div>
                        </div>
                        </div>
                        <div className="row instant-mobile-header">
                            <div className="title">
                                <p className="col-12 p-0 m-0 header">Kaiser Permanente</p>
                                <p className="col-12 p-0 sub-header">{Details.videoVisits}</p>
                            </div>
                        </div>
                        <div className="confirmationContent">
                            <h3 className="patientConfirm"> {Details.AreYou} {this.state.displayName}?</h3>
                            <div>
                                <button  type="button" className="denyUser" onClick={this.denyUser}>{instantDetails && instantDetails.No}</button>
                                <button  type="button" className="allowUser" onClick={this.allowLogin}>{instantDetails && instantDetails.Yes}</button>
                            </div>
                        </div>
                        <div className="instant-form-footer">
                            <div className="instant-main-footer">
                                <ul id="instant-list-conditions">
                                    <li><a href="http://mydoctor.kaiserpermanente.org/ncal/mdo/terms_and_conditions.jsp"
                                           target="_blank"> Terms and Conditions</a></li>
                                    <li className="last"><a
                                        href="https://members.kaiserpermanente.org/kpweb/privacystate/entrypage.do"
                                        target="_blank">Privacy Practices</a></li>
                                </ul>
                                <p className="copyright">Copyright ©2012-2020 The Permanente Medical Group, Inc. All rights
                                    reserved.</p>
                            </div>
                        </div>
                    </div>
                </div>):
                (<Suspense fallback={<Loader />}>
                    {this.state.showPreCheck && !this.state.isMobile?
                        (<PreCallCheck history={this.props.history} data={{togglePrecheck: this.togglePrecheck.bind(this)}}/>)
                        : (<Conference history={this.props.history} />)}
                </Suspense>)}
            </div>
        )
    }
}

export default Visit;
