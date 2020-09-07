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
        this.state = { userDetails: {}, showPage: false, isMobile: false, showPreCheck: true };
    }

    componentDidMount() {
        var isDirectLaunch = window.location.href.indexOf('isDirectLaunch') > -1;
        if (localStorage.getItem('userDetails')) {
            this.state.userDetails = JSON.parse(Utilities.decrypt(localStorage.getItem('userDetails')));
            if (this.state.userDetails) {
                this.setState({ showPage: true });
            }
        } else if( isDirectLaunch ) {
            this.launchVisit();
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
        var browserInfo = Utilities.getBrowserInformation();
        var peripheralsSelected = localStorage.getItem('selectedPeripherals');
        var permissionNotGranted = sessionStorage.getItem('deniedPermission');
        var showPreCallCheck = (browserInfo.isSafari || browserInfo.isFireFox);
        if (showPreCallCheck && !peripheralsSelected && !permissionNotGranted) {
            this.setState({ showPreCheck: true });
        } else {
            this.setState({ showPreCheck: false });
        }
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

    togglePrecheck() {
        this.setState({
            showPreCheck: false
        });
    }

    render() {
        return (
            <div>
                <Suspense fallback={<Loader />}>
                    {this.state.showPreCheck && !this.state.isMobile? 
                      (<PreCallCheck history={this.props.history} data={{togglePrecheck: this.togglePrecheck.bind(this)}}/>)
                    : (<Conference history={this.props.history} />)}
                </Suspense>
            </div>
        )
    }
}

export default Visit;
