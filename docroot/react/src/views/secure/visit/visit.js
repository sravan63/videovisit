import React, { Suspense, lazy } from 'react';
import Header from '../../../components/header/header';
import Loader from '../../../components/loader/loader';
import BackendService from '../../../services/backendService.js';
import Utilities from '../../../services/utilities-service.js';
import GlobalConfig from '../../../services/global.config';
import './visit.less';

const PreCallCheck = React.lazy(() => import('./pre-call-check/pre-call-check'));
const Conference = React.lazy(() => import('./conference/conference'));

class Visit extends React.Component {

    constructor(props) {
        super(props);
        this.interval = '';
        this.state = { userDetails: {}, showPage: false,isInstantJoin: false,mdoHelpUrl:'',isChecked:false, displayName:'', renderPage:false, isMobile: false, showPreCheck: true };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.denyUser = this.denyUser.bind(this);
        this.allowLogin = this.allowLogin.bind(this);
    }

    componentDidMount() {
        var isDirectLaunch = window.location.href.indexOf('isDirectLaunch') > -1,
            isInstantJoin = window.location.href.indexOf('isInstantJoin') > -1;
        if(isInstantJoin){
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

    }

    handleInputChange(event){
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }
    denyUser(){
        window.location.href = 'https://mydoctor.kaiserpermanente.org/ncal/videovisit/';
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
                    }
                } else {
                    this.props.history.push({
                        pathname: "/login",
                        state: { message: "instantJoin" },
                    });
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
        }
    }

    togglePrecheck() {
        this.setState({
            showPreCheck: false
        });
    }

    render() {
        return (
            <div>{this.state.isInstantJoin ?(<div className='instantJoin-container' style={{visibility: this.state.renderPage ? 'visible' : 'hidden'}}>
                    <Header helpUrl = {this.state.mdoHelpUrl}/>
                    <div className='instant-content'>
                        <div className="row instant-help-link-container">
                            <div className="col-12 text-right help-icon p-0">
                                <a href={this.state.mdoHelpUrl} className="instant-helpLink" target="_blank">Help</a>
                            </div>
                        </div>
                        <div className="row instant-mobile-header">
                            <div className="title">
                                <p className="col-12 p-0 m-0 header">Kaiser Permanente</p>
                                <p className="col-12 p-0 sub-header">Video Visits</p>
                            </div>
                        </div>
                        <div className="confirmationContent">
                            <h3 className="patientConfirm"> Are you {this.state.displayName} ?</h3>
                            <div>
                                <input type="checkbox" className="checkTerms" checked={this.state.isChecked} name="isChecked" onChange={this.handleInputChange}/>
                                <span>I acknowledge the </span><a className="terms "href="http://mydoctor.kaiserpermanente.org/ncal/mdo/terms_and_conditions.jsp" target="_blank">Terms and Conditions shown here.</a>
                            </div>
                            <button  type="button" className="odd" onClick={this.denyUser}>Deny</button>
                            <button  type="button" className="even" onClick={this.allowLogin} disabled={!this.state.isChecked}>Confirm</button>
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
