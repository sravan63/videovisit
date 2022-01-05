import React, { Suspense, lazy } from 'react';
import Header from '../../components/header/header';
import Sidebar from '../../components/sidebar/sidebar';
import Footer from '../../components/footer/footer';
import Loader from '../../components/loader/loader';
import './authentication.less';
import BackendService from '../../services/backendService.js';
import Utilities from '../../services/utilities-service.js';
import BrowserBlock from '../../components/browser-block/browser-block';
import GlobalConfig from '../../services/global.config';
import {MessageService} from "../../services/message-service";
import Langtranslation from "../../components/lang-translation/lang-translation";
const Ssologin = React.lazy(() => import('../../components/ssologin/ssologin'));
const Login = React.lazy(() => import('../../components/tempaccess/tempaccess'));

class Authentication extends React.Component {
    constructor(props) {
        super(props);
        localStorage.clear();
        this.tempAccessToken = false;
        this.state = { tempAccessToken: false,staticData:{auth:{sso:{}},errorCodes:{}}, chin:'中文',span:'Español',instantJoin:false,isMobileError: false, isInApp: false, showLoader: false,propertyName:'',isBrowserBlockError:false, isMobile: false,mdoHelpUrl:'',isScrollPosition: false };
    }

    emitFromChild(obj) {
        if (obj.hasOwnProperty('isTemp')) {
            this.setState({ tempAccessToken: obj.isTemp });
            this.setState({ isMobileError: false });
        }
        if (obj.hasOwnProperty('isMobileError')) {
            this.setState({ isMobileError: obj.isMobileError });
        }
        if (obj.hasOwnProperty('showLoader')) {
            this.setState({ showLoader: obj.showLoader });
        }
        if (obj.hasOwnProperty('instantJoin')) {
            this.setState({ instantJoin: obj.instantJoin,isMobileError:false});
        }
    }

    componentDidMount() {
        var instantJoinCheck = this.props.location.state;
        if(instantJoinCheck && instantJoinCheck.message && instantJoinCheck.message=='instantJoin'){
          this.setState({isMobileError:true,instantJoin:true});
        }
        var browserInfo = Utilities.getBrowserInformation();
        if(!browserInfo.isIE){
            this.validateInAppAccess();
        }
        var inAppAccess = Utilities.getInAppAccessFlag();
        if(!inAppAccess){
            this.getBrowserBlockInfo();
        }
        this.getLanguage();
        this.subscription = MessageService.getMessage().subscribe((message) => {
            if(message.text==GlobalConfig.LANGUAGE_CHANGED){
                this.getLanguage();
            }
        });
    }
    getBrowserBlockInfo(){
        var propertyName = 'browser',
            url = "loadPropertiesByName.json",
            browserNames = '';
        BackendService.getBrowserBlockDetails(url, propertyName).subscribe((response) => {
            if (response.data && response.status == '200') {
                 browserNames = response.data;
                 this.setState({ mdoHelpUrl: response.data.mdoHelpUrl });
                 sessionStorage.setItem('helpUrl',response.data.mdoHelpUrl);
                 sessionStorage.setItem('keepAlive',response.data.KEEP_ALIVE_URL);
                 sessionStorage.setItem('mediaStatsTimer',response.data.INSERT_MEDIA_STATS_FREQUENCY);
                 Utilities.setMeetingFeedbackTimeout(response.data.MEETING_FEEDBACK_TIMEOUT);
                 Utilities.setMinTimeToShowUserSurvey(response.data.MINIMUM_IN_MEETING_TIME_FOR_SURVEY);
                 if(Utilities.validateBrowserBlock(browserNames)){
                     this.setState({ isBrowserBlockError: true });
                 }
            } else {
                // Do nothing
            }
        }, (err) => {

        });

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
    validateInAppAccess() {
        var urlStr = window.location.href;
        var url = new URL(urlStr);
        if ((url.search !== '' || url.href.indexOf('isAndroidSDK') > -1) && this.state.tempAccessToken == false) {
            // VIA IN APP BROWSER
            this.setState({ isInApp: true });
            Utilities.setInAppAccessFlag(true);
            const params = window.location.href.split('?')[1];
            const urlParams = new URLSearchParams( params );
            var isSDK = decodeURIComponent(urlParams.get('isAndroidSDK'));
            sessionStorage.setItem('isAndroidSDK', isSDK);
        }
        else if( Utilities.getInAppAccessFlag() ) {
            this.setState({ isInApp: true });
        }
    }

    render() {
        var Details = this.state.staticData;
        return (
            <div id='container' className="authentication-page">
            {this.state.showLoader ? (<Loader />):('')}
             <Header helpUrl = {this.state.mdoHelpUrl} data={Details}/>
             <div className={this.state.isInApp && window.window.innerWidth >= 1024 ? "main-content occupy-space" : "main-content"}>
                {this.state.isMobileError ?
                    (<div className="row error-text">
                        {this.state.tempAccessToken || this.state.isInApp ?
                            (<p className="col-sm-12">{Details.errorCodes.ErrorPatientInfo}</p>)
                           :this.state.instantJoin ?(<p className="col-sm-12" style={{fontWeight:this.state.isBrowserBlockError ? 'bold': '',height:this.state.isBrowserBlockError ? '60px': '',lineHeight:this.state.isBrowserBlockError ? '52px': ''}}>{Details.errorCodes.ErrorInvalidLink}</p>):(<p className="col-sm-12">{Details.errorCodes.ErrorInvalidUSerID}</p>)
                        }
                    </div>)
                : ('')}
                {!this.state.isInApp ? (
                <div className={this.state.isMobileError ? "row help-link-container error-chk":"row help-link-container"}>
                    <div className="col-lg-12 col-md-12 help-icon text-right p-0">
                        <a href={Details.HelpLink} className="help-link" target="_blank">{Details.Help}</a>
                        <Langtranslation />
                    </div>
                </div>):('')}
                { <BrowserBlock browserblockinfo = {this.state}/> }
                <div>
                    <Suspense fallback={<Loader />}>
                        {this.state.tempAccessToken || this.state.isInApp ? (
                            <Login data={{tempAccessToken:this.state.tempAccessToken,showLoader:this.state.showLoader,emit:this.emitFromChild.bind(this), isInApp: this.state.isInApp,browserBlock:this.state.isBrowserBlockError,translateLang:Details}}/>
                        ) : (
                            <Ssologin history={this.props.history} data={{tempAccessToken:this.state.tempAccessToken,showLoader:this.state.showLoader, isInApp: this.state.isInApp, emit:this.emitFromChild.bind(this),browserBlock:this.state.isBrowserBlockError,translateLang:Details}}/>
                        )}
                    </Suspense>
                </div>
                <div className="row mobile-footer mt-3" style={{display: this.state.isInApp ? 'block' : 'auto', margin: this.state.isInApp && window.window.innerWidth >= 1024 ? '0' : ''}}>
                    <p className="col-12 font-weight-bold">{Details.auth.sso.PatientGuest}</p>
                    <p className="col-12 secondary">{Details.auth.sso.EmailInvitation}</p>
                </div>
                {!this.state.isInApp ?(<div className="auth-form-footer" style={{bottom:this.state.isBrowserBlockError ? '0rem': ''}}>
                    <Footer />
                </div>) : ('')}
            </div>
         </div>
        );
    }
}

export default Authentication;
