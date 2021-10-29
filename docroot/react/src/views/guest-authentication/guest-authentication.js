import React from 'react';
import Header from '../../components/header/header';
import Sidebar from '../../components/sidebar/sidebar';
import Footer from '../../components/footer/footer';
import Ssologin from '../../components/ssologin/ssologin';
import Login from '../../components/tempaccess/tempaccess';
import Loader from '../../components/loader/loader';
import './guest-authentication.less';
import BackendService from '../../services/backendService.js';
import { MessageService } from '../../services/message-service.js';
import UtilityService from '../../services/utilities-service.js';
import GlobalConfig from '../../services/global.config';
import BrowserBlock from '../../components/browser-block/browser-block';

class Authentication extends React.Component {
    constructor(props) {
        super(props);
        localStorage.removeItem('LoginUserDetails');
        this.state = { lastname: '',isSafari15_1:false,displayErrorMsg: '', authToken:'', ReJoin:false, staticData:{guestauth:{},errorCodes:{}}, chin:'中文',span:'Español', NotLoggedIn: false, meetingCode: null, showLoader: false, inputDisable: false, errorlogin: false,isBrowserBlockError: false,mdoHelpUrl:'',statusCode:'' };
        this.button = { disabled: true }
        this.signOn = this.signOn.bind(this);
        this.renderErrorCompValidation = this.renderErrorCompValidation.bind(this);
        this.errorCompForGuestLogin = this.errorCompForGuestLogin.bind(this);
        this.guestLogin = this.guestLogin.bind(this);
    }

    componentDidMount() {
        //var meetingCode;
        var getMe = UtilityService.getBrowserInformation();
        if(sessionStorage.getItem('meetingCodeval') != window.location.hash.slice(25)){
            sessionStorage.clear();
        }
        if (window.location.hash.includes('meetingcode')) {
            this.state.meetingCode = window.location.hash.slice(25);
            sessionStorage.setItem('meetingCodeval',this.state.meetingCode);
        }
        this.setState({ showLoader: true });
        var browserInfo = UtilityService.getBrowserInformation();
       if(!browserInfo.isIE){
        BackendService.isMeetingValidGuest(this.state.meetingCode).subscribe((response) => {
            if (response.data != "" && response.data != null && response.data.statusCode == 200) {
                this.setState({ NotLoggedIn: true, showLoader: false, authToken:response.headers.authtoken });
            if (sessionStorage.getItem('guestLeave')) {
                this.setState({ ReJoin: true});
                sessionStorage.setItem('ReJoin',true);
             }
            } 
            else if (response.data.statusCode == 510){
                this.setState({ statusCode: 510 });
                this.renderErrorCompValidation(true);
            }
            else {
                this.setState({ statusCode: 511 });
                this.renderErrorCompValidation(false);
            }
        }, (err) => {
            this.renderErrorCompValidation();

        });
    }else{
        this.renderErrorCompValidation();
        this.setState({ errorlogin: false, displayErrorMsg: '' });
    }
        this.getBrowserBlockInfo();
        if(sessionStorage.getItem('ReJoin')){
            this.setState({ ReJoin: true});
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
                 sessionStorage.setItem('mediaStatsTimer',response.data.INSERT_MEDIA_STATS_FREQUENCY);
                 if(UtilityService.validateBrowserBlock(browserNames)){
                     let isSafari15_1 = UtilityService.getSafariBlocked();
                     this.setState({ isBrowserBlockError: true,isSafari15_1:isSafari15_1 });
                 }
            } else {
                // Do nothing
            }
        }, (err) => {
            console.log("Error");
        });
    }
    renderErrorCompValidation(param) {
        let data = UtilityService.getLang();
        this.setState({
            errorlogin: true,
            displayErrorMsg: param ? GlobalConfig.GUEST_FUTURE_MEETING : data.errorCodes.ErrorVisitUnavailable,
            inputDisable: true,
            NotLoggedIn: true,
            showLoader: false
        });
    }


    signOn(e) {
        e.preventDefault();
        localStorage.clear();
        this.setState({ showLoader: true });
        this.state.lastname = this.state.lastname.replace(/[‘’]/g, "'");
        sessionStorage.setItem('lastname',this.state.lastname);
        this.guestLogin(this.state.meetingCode, this.state.lastname.trim(),this.state.authToken,false);
    }

    reJoinMeeting(){
        sessionStorage.removeItem('guestLeave');
        var pname = sessionStorage.getItem('lastname');
        this.guestLogin(this.state.meetingCode,pname,this.state.authToken,true);
        //this.props.history.push(GlobalConfig.VIDEO_VISIT_ROOM_URL);
    }

    guestLogin(meetingCode,lastname,authToken,rejoin){
        BackendService.guestLogin(meetingCode,lastname,authToken).subscribe((response) => {
            if (response.data != "" && response.data != null && response.data.statusCode == 200) {
                if (response.data.data != null && response.data.data != '') {
                    var data = {};
                    data = response.data.data ? response.data.data : '';
                    data.meetingCode = this.state.meetingCode;
                    data.authToken = response.headers.authtoken;
                    data.lastname = lastname;
                    localStorage.setItem('meetingId', JSON.stringify(data.meetingId));
                    localStorage.setItem('userDetails', UtilityService.encrypt(JSON.stringify(data)));
                    localStorage.setItem('isGuest', true);
                    this.setState({ showLoader: false });
                    let helpLinkUrl = sessionStorage.getItem('helpUrl'),
                        mediaStatsTimer = sessionStorage.getItem('mediaStatsTimer');
                    localStorage.setItem('mediaStats',mediaStatsTimer);
                    localStorage.setItem('helpUrl',helpLinkUrl);
                    this.props.history.push(GlobalConfig.VIDEO_VISIT_ROOM_URL);
                }
            } else if (response.data.statusCode == 300 || response.data.statusCode == 900) {
                if(rejoin){
                this.setState({ showLoader: false });    
                this.SignOut();  
                window.location.reload(false);
                window.scrollTo(0, 0);
                }
                else{
                this.errorCompForGuestLogin();
                }
            } else if (response.data.statusCode == 510 || response.data.statusCode == 500) {
                let data = UtilityService.getLang();
                this.setState({ statusCode: 500 });
                this.setState({ errorlogin: true, displayErrorMsg: data.errorCodes.ErrorNoMatchingMsg, showLoader: false });
                window.scrollTo(0, 0); 
            } else {
                if(rejoin){
                this.setState({ showLoader: false });    
                this.SignOut();  
                window.location.reload(false); 
                window.scrollTo(0, 0); 
                }
                else{
                this.errorCompForGuestLogin();
                }
            }
        }, (err) => {
            if(rejoin){
                this.setState({ showLoader: false });    
                this.SignOut();   
                window.location.reload(false);
                window.scrollTo(0, 0); 
                }
                else{
                this.errorCompForGuestLogin();
                }
        });
    }
    getLanguage(){
        let data = UtilityService.getLang();
        if(data.lang=='spanish'){
            this.setState({span:'English',chin: '中文',staticData: data});
        }
        else if(data.lang=='chinese'){
            this.setState({chin:'English',span:'Español',staticData: data});
        }
        else {
            this.setState({span: "Español", chin: '中文',staticData: data});
        }
        if(this.state.errorlogin){
            if(this.state.statusCode == 511){
                this.setState({ displayErrorMsg: data.errorCodes.ErrorVisitUnavailable });
            }
            if(this.state.statusCode == 500){
                this.setState({ displayErrorMsg: data.errorCodes.ErrorNoMatchingMsg });
            }    
        }
    }
    changeLang(event){
        let value = event.target.textContent;
        if(value=="中文"){
            sessionStorage.setItem('Instant-Lang-selection','chinese');
            UtilityService.setLang('chinese');
        }
        else if(value=="Español"){
            sessionStorage.setItem('Instant-Lang-selection','spanish');
            UtilityService.setLang('spanish');
         }
        else{
            sessionStorage.setItem('Instant-Lang-selection','english');
            UtilityService.setLang('english');
        }
    }
    errorCompForGuestLogin() {
        this.setState({ errorlogin: true, displayErrorMsg: GlobalConfig.GUEST_LOGIN_ERROR_MSG, showLoader: false });
        window.scrollTo(0, 0);
    }

    SignOut(){
        sessionStorage.removeItem('guestLeave');
        sessionStorage.removeItem('ReJoin');
        sessionStorage.setItem('guestCode',JSON.stringify(this.state.meetingCode));
        this.setState({ReJoin:false, errorlogin: false});
        localStorage.clear();
        history.pushState(null, null, location.href);
        window.onpopstate = function(event) {
           history.go(1);
        };
    }

    


    handleChange(key, event) {
        event.preventDefault();
        const { name, value } = event.target;
        switch (name) {
            case 'lastname':
                const lname_regex = event.target.value.replace(/[^A-Za-z '‘’-]/g, "");
                this.lastname = lname_regex;
                this.setState({
                    [name]: this.lastname
                });
                break;
            default:
                break;
        }

        if ("" != event.target.value.trim()) {
            if (this.lastname != "") {
                this.button.disabled = false;
            } else {
                this.button.disabled = true;
            }
        } else {
            this.button.disabled = true;
        }

    }
    toggleLangInfo(){
        let data = UtilityService.getLang(); 
        switch(data.lang){
            case "spanish":
                return "guest-form rejoinComp spanish";
                break;            
            default:
                return  "guest-form rejoinComp";
                break;    

        }
    }
    render() {
        var Details = this.state.staticData;
        return (
            <div id='container' className="authentication-page">
             <Header helpUrl = {this.state.mdoHelpUrl} data={this.state.staticData} />
             {this.state.showLoader ? (<Loader />):('')}
              {this.state.NotLoggedIn ?  (  
                <div>
             <div className={this.state.ReJoin ? "guest-main-content rejoinchk":"guest-main-content"}>
                {this.state.errorlogin ? 
                    <div className="row error-text">
                         <p className="col-sm-12">{this.state.displayErrorMsg}</p>
                    </div>
                : ('')}
                
                <div className={this.state.errorlogin ? "row mobile-help-link error-chk":"row mobile-help-link"}>
                    <div className="col-lg-12 col-md-12 help-icon text-right p-0">
                        <a href={this.state.staticData.HelpLink} className="help-link" target="_blank">{this.state.staticData.Help}</a>
                        <div className="lang-change p-0">
                            <span className="divider" onClick={this.changeLang.bind(this)}>{this.state.chin}</span>
                            <span>|</span>
                            <span className="spanishlabel" onClick={this.changeLang.bind(this)}>{this.state.span}</span>
                        </div>
                    </div>
                </div>
                <div className="row mobile-logo-container">
                    <div className="title">
                        <p className="col-12 m-0 header">Kaiser Permanente</p>
                        <p className="col-12 sub-header">{this.state.staticData.videoVisits}</p>
                    </div>
                </div>
                <div className="guest-form-content">
                <BrowserBlock browserblockinfo = {this.state}/>
                {this.state.ReJoin ? (
                   <div className={this.toggleLangInfo()}>
                      <button type = "submit" className = "btn w-50 rounded-0 p-0 rejoin" onClick={()=>this.reJoinMeeting()} disabled={this.state.isBrowserBlockError}>{this.state.staticData.guestauth.Rejoin}</button>
                      <button type = "submit" className = "btn w-50 rounded-0 p-0 signout" onClick={()=>this.SignOut()} disabled={this.state.isBrowserBlockError}>{Details.Signout}</button>
                    </div>
                ):
                 (    
                    <div className="row guest-form" >
                    <div className="row notice">{Details.guestauth.GuestHeaderLabelTxt}</div>
                        <form className="col-xs-12 col-md-12 login-form">
                            <div className="form-group">
                                <label className="col-sm-12">{Details.guestauth.PatientLastName}</label>
                                <div className="col-sm-12">
                                    <input type="text" pattern="[a-zA-Z]+" name="lastname" disabled = {this.state.inputDisable || this.state.isBrowserBlockError} value={this.state.lastname} onChange={this.handleChange.bind(this,'lastname')} className="form-control rounded-0 p-0 shadow-none outline-no textindent mobile-input"/>
                                </div>
                            </div>
                            <div className = "form-group mobile-submit mt-5" >
                                 <button type = "submit" className = "btn w-50 rounded-0 p-0 login-submit" id="login" onClick={this.signOn} disabled={this.button.disabled || this.state.isBrowserBlockError}>{Details.guestauth.JoinBtnName}</button>
                            </div>
                        </form>
                    </div> )}
                </div>
                <div className="row mobile-footer mt-5">
                    <p className="col-12 secondary">{Details.guestauth.GuestHeaderLabelTxt}</p>
                </div>
                <div className="guest-form-footer">
                    <Footer />
                </div>
            </div> 
            </div> ) : ('')}
         </div>
        );
    }
}

export default Authentication;
