import React, { Suspense, lazy } from 'react';
import Loader from '../../../components/loader/loader';
import UCB from '../../../components/user-confirmation-box/user-confirmation-box';
import BackendService from '../../../services/backendService.js';
import Utilities from '../../../services/utilities-service.js';
import GlobalConfig from '../../../services/global.config';
import {MessageService} from "../../../services/message-service";
import * as WebUI from '../../../pexip/complex/webui.js';
import './visit.less';
import UtilityService from "../../../services/utilities-service";

const PreCallCheck = React.lazy(() => import('./pre-call-check/pre-call-check'));
const Conference = React.lazy(() => import('./conference/conference'));

class Visit extends React.Component {

    constructor(props) {
        super(props);
        this.interval = '';
        this.state = { userDetails: {},staticData:{}, chin:'中文',span:'Español', showPage: false,isInstantJoin: false,isECInstantJoin:false, isInstantGuest: false, mdoHelpUrl:'', displayName:'', userConfirmBox:false, isBrowserBlockError: false, invalidSession: false, isMobile: false, showPreCheck: true };
        this.denyUser = this.denyUser.bind(this);
        this.allowLogin = this.allowLogin.bind(this);
    }

    componentDidMount() {
        var isDirectLaunch = window.location.href.indexOf('isDirectLaunch') > -1,
            isInstantJoin = window.location.href.indexOf('isInstantJoin') > -1,
            ecInstantJoin = window.location.href.indexOf('ECInstantJoin') > -1;
        if( isInstantJoin || ecInstantJoin ){
            this._getLanguage();
            if(sessionStorage.getItem('preCallCheckLoaded') || sessionStorage.getItem('isInstantJoin')  || sessionStorage.getItem('isECInstantJoin')) {
                this._showPreCallCheck();
            } else {
                if( isInstantJoin ) {
                    this.setState({isInstantJoin: true}, ()=>{
                        this._launchInstantJoin('instant_join');
                    });
                } else {
                    this.setState({isECInstantJoin: true}, ()=>{
                        this._launchInstantJoin('ec_instant_join');
                    });
                }
            }
        } else if (localStorage.getItem('userDetails')) {
            this.state.userDetails = JSON.parse(Utilities.decrypt(localStorage.getItem('userDetails')));
            if (this.state.userDetails) {
                this.setState({ showPage: true });
            }
            this._showPreCallCheck();
        } else if( isDirectLaunch ) {
            this._directLaunchVisit();
        } else {
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
            if(message.text == GlobalConfig.LANGUAGE_CHANGED) {
                this._getLanguage();
            }
        });
    }

    _getLanguage(){
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

    _showPreCallCheck(){
        var browserInfo = Utilities.getBrowserInformation();
        var peripheralsSelected = localStorage.getItem('selectedPeripherals');
        var showPreCallCheck = (browserInfo.isSafari || browserInfo.isFireFox);
        if (showPreCallCheck && !peripheralsSelected) {
            this.setState({ showPreCheck: true });
            WebUI.log("info","show_pct_page","event: Pre call test page is rendered");
        } else {
            this.setState({ showPreCheck: false });
        }
    }

    _getBrowserBlockInfo(){
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
                if( Utilities.validateBrowserBlock(browserNames) ){
                    if( this.state.isECInstantJoin || this.state.isInstantGuest ){
                        this.setState({ userConfirmBox: true, isBrowserBlockError : true, invalidSession: this.state.invalidSession ? true : false });
                    } else {
                        this.props.history.push('/login');
                    }
                    return;
                }
            } else {
                // Do nothing
            }
        }, (err) => {
            console.log("Error");
        });

    }

    _directLaunchVisit() {
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

    _launchInstantJoin(join_type){
        localStorage.clear();
        const params = window.location.href.split('?')[1];
        const urlParams = new URLSearchParams( params );
        let isInstantGuest = urlParams.has('isPatientGuest') && urlParams.get('isPatientGuest');
        this.state.isInstantGuest = isInstantGuest;
        var browserInfo = Utilities.getBrowserInformation();
        if( browserInfo.isIE ) {
            if( join_type == 'ec_instant_join' ){
                this.setState({ userConfirmBox: true, isBrowserBlockError : true, invalidSession: false });
            } else {
                this._unAuthorizedAccess();
            }
            return;
        }
        this._getBrowserBlockInfo();

        let isInstantJoin;
        let tokenValue;
        if( join_type == 'instant_join' ){
            isInstantJoin = urlParams.has('isInstantJoin') && JSON.parse(urlParams.get('isInstantJoin'));
            tokenValue  = urlParams.has('tk') && urlParams.get('tk');
        } else if( join_type == 'ec_instant_join' ) {
            isInstantJoin = urlParams.has('isECInstantJoin') && JSON.parse(urlParams.get('isECInstantJoin'));
            tokenValue  = urlParams.has('tk') && urlParams.get('tk');
        }
        let isMobile = Utilities.isMobileDevice();
        if(isInstantJoin && tokenValue!='' && !this.state.isBrowserBlockError ){
            BackendService.validateInstantJoin( isMobile, tokenValue, this.state.isInstantJoin ).subscribe((response) => {
                if (response.data && response.status == '200' && !this.state.isBrowserBlockError ) {
                    if (response.data.data != null && response.data.data != '') {
                        let userData = response.data.data;
                        let fullName = userData.firstName + " " + userData.lastName;
                        let meetingId = userData.meeting.meetingId;
                        let isProxyMeeting = "N";
                        const mrn = this.state.isInstantJoin ? userData.meeting.member.mrn : '';
                        this.setState({ userConfirmBox: true, displayName: fullName });
                        let userDetails = { isTempAccess: false, lastName :userData.lastName , firstName:userData.firstName , mrn: mrn, ssoSession: '' };
                        if(this.state.isECInstantJoin ){
                            Utilities.parseInstantForEcGuestName(userData.meeting.caregivers, userData);
                            userDetails.meetingCode = userData.meetingCode;
                            Utilities.setECVisitDetails(userData);
                        }
                        else if( isInstantGuest ){
                            userDetails.mrn = '';
                            userDetails.authToken = '';
                            const instantPG = {firstName: userData.firstName , lastName: userData.lastName, inMeetingDisplayName : userData.lastName + ", " + userData.firstName};
                            Utilities.parseInstantGuestName(userData.meeting.caregiver, instantPG, true);
                            userDetails.meetingCode = instantPG.meetingCode;
                            sessionStorage.setItem('isInstantPG', true);
                        } else{
                            sessionStorage.setItem('isInstantMember', true);
                            localStorage.setItem('isProxyMeeting', JSON.stringify(isProxyMeeting));
                        }
                        localStorage.setItem('meetingId', JSON.stringify(meetingId));
                        localStorage.setItem('userDetails', Utilities.encrypt(JSON.stringify(userDetails)));
                    }
                    else{
                        this._unAuthorizedAccess();
                    }
                } else {
                    this._unAuthorizedAccess();
                }
            }, (err) => {
                this._unAuthorizedAccess();
            });
        } else{
            this._unAuthorizedAccess();
        }
    }

    _unAuthorizedAccess(){
        if( this.state.isECInstantJoin || this.state.isInstantGuest ){
            if(this.state.isBrowserBlockError){
                this.setState({ userConfirmBox: true, isBrowserBlockError : true, invalidSession: false });
            } else {
                this.setState({ userConfirmBox: true, isBrowserBlockError : false, invalidSession: true });
            }
            // this.setState({userConfirmBox: true, displayName:"Joe Mama"});
        } else if( this.state.isInstantJoin ){
            this.props.history.push({
                pathname: "/login",
                state: { message: "instantJoin" },
            });
        } else {
            this.props.history.push('/login');
        }
    }

    /* Call back methods */

    denyUser(){
        window.location.href = 'https://mydoctor.kaiserpermanente.org/ncal/videovisit/';
    }

    changeLang(event){
        let value = event.target.textContent;
        if(value=="中文"){
            sessionStorage.setItem('Instant-Lang-selection','chinese');
            Utilities.setLang('chinese');
        } else if(value=="Español"){
            sessionStorage.setItem('Instant-Lang-selection','spanish');
            Utilities.setLang('spanish');
        } else {
            sessionStorage.setItem('Instant-Lang-selection','english');
            Utilities.setLang('english');
        }
    }

    allowLogin(){
        this._showPreCallCheck();
        if(this.state.isECInstantJoin){
            this.setState({isECInstantJoin:false});
            Utilities.setECVisitFlag(true);
            sessionStorage.setItem('isECInstantJoin',true);
        } else if(this.state.isInstantJoin){
            this.setState({isInstantJoin:false});
            sessionStorage.setItem('isInstantJoin',true);
        }
    }

    togglePrecheck() {
        this.setState({ showPreCheck: false });
    }

    render() {
        return (
            <div> {this.state.isInstantJoin || this.state.isECInstantJoin ?
                (<UCB conf={{data : this.state, changeLang : this.changeLang.bind(this), allowLogin : this.allowLogin.bind(this), denyUser : this.denyUser.bind(this)}}/>
                ):(<Suspense fallback={<Loader />}>
                    {this.state.showPreCheck && !this.state.isMobile?
                        (<PreCallCheck history={this.props.history} data={{togglePrecheck: this.togglePrecheck.bind(this)}}/>)
                        : (<Conference history={this.props.history} />)}
                </Suspense>)}
            </div>
        )
    }
}

export default Visit;
