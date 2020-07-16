import React from 'react';
import Header from '../../components/header/header';
import Sidebar from '../../components/sidebar/sidebar';
import Footer from '../../components/footer/footer';
import Ssologin from '../../components/ssologin/ssologin';
import Login from '../../components/tempaccess/tempaccess';
import Loader from '../../components/loader/loader';
import './guest-authentication.less';
import BackendService from '../../services/backendService.js';
import UtilityService from '../../services/utilities-service.js';
import GlobalConfig from '../../services/global.config';
import BrowserBlock from '../../components/browser-block/browser-block';

class Authentication extends React.Component {
    constructor(props) {
        super(props);
        localStorage.removeItem('LoginUserDetails');
        this.state = { lastname: '', displayErrorMsg: '', authToken:'', ReJoin:false, NotLoggedIn: false, meetingCode: null, showLoader: false, inputDisable: false, errorlogin: false,isBrowserBlockError: false,mdoHelpUrl:'' };
        this.button = { disabled: true }
        this.signOn = this.signOn.bind(this);
        this.renderErrorCompValidation = this.renderErrorCompValidation.bind(this);
        this.errorCompForGuestLogin = this.errorCompForGuestLogin.bind(this);
        this.guestLogin = this.guestLogin.bind(this);
    }

    componentDidMount() {
        //var meetingCode;
        if(sessionStorage.getItem('meetingCodeval') != window.location.hash.slice(25)){
            sessionStorage.clear();
        }
        if (window.location.hash.includes('meetingcode')) {
            this.state.meetingCode = window.location.hash.slice(25);
            sessionStorage.setItem('meetingCodeval',this.state.meetingCode);
        }
        this.setState({ showLoader: true });
        var isMobile = UtilityService.isMobileDevice();
        var browserInfo = UtilityService.getBrowserInformation();
        if(isMobile && navigator.userAgent.match('FxiOS')){
            alert("For firefox only");
        }
       if(!browserInfo.isIE){
        BackendService.isMeetingValidGuest(this.state.meetingCode).subscribe((response) => {
            if (response.data != "" && response.data != null && response.data.statusCode == 200) {
                this.setState({ NotLoggedIn: true, showLoader: false, authToken:response.headers.authtoken });
            if (sessionStorage.getItem('guestLeave')) {
                this.setState({ ReJoin: true});
             }
            } 
            else if (response.data.statusCode == 510){
                this.renderErrorCompValidation(true);
            }
            else {
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
     }
     getBrowserBlockInfo(){
        var propertyName = 'browser',
            url = "loadPropertiesByName.json",
            browserNames = '';
        BackendService.getBrowserBlockDetails(url, propertyName).subscribe((response) => {
            if (response.data && response.status == '200') {
                 browserNames = response.data; 
                 this.setState({ mdoHelpUrl: response.data.mdoHelpUrl });
                 if(UtilityService.validateBrowserBlock(browserNames)){
                    this.setState({ isBrowserBlockError: true });
                 }
            } else {
                // Do nothing
            }
        }, (err) => {
            console.log("Error");
        });
    }
    renderErrorCompValidation(param) {
        this.setState({
            errorlogin: true,
            displayErrorMsg: param ? GlobalConfig.GUEST_FUTURE_MEETING : GlobalConfig.GUEST_VALIDATE_MEETING_ERROR_MSG,
            inputDisable: true,
            NotLoggedIn: true,
            showLoader: false
        });
    }


    signOn(e) {
        e.preventDefault();
        localStorage.clear();
        this.setState({ showLoader: true });
        let headers = {
            "authToken": this.state.authToken
        };
        sessionStorage.setItem('lastname',this.state.lastname);
        this.guestLogin(this.state.meetingCode, this.state.lastname.trim(),headers,false);
    }

    reJoinMeeting(){
        sessionStorage.removeItem('guestLeave');
        let headers = {
            "authToken": this.state.authToken
        };
        var pname = sessionStorage.getItem('lastname');
        this.guestLogin(this.state.meetingCode,pname,headers,true);
        //this.props.history.push(GlobalConfig.VIDEO_VISIT_ROOM_URL);
    }

    guestLogin(meetingCode,lastname,headers,rejoin){
        BackendService.guestLogin(meetingCode,lastname,headers).subscribe((response) => {
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
                this.setState({ errorlogin: true, displayErrorMsg: GlobalConfig.GUEST_LOGIN_VALIDATION_MSG, showLoader: false });
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

    errorCompForGuestLogin() {
        this.setState({ errorlogin: true, displayErrorMsg: GlobalConfig.GUEST_LOGIN_ERROR_MSG, showLoader: false });
        window.scrollTo(0, 0);
    }

    SignOut(){
        sessionStorage.removeItem('guestLeave');
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

    render() {
        return (
            <div id='container' className="authentication-page">
             <Header helpUrl = {this.state.mdoHelpUrl}/>
             {this.state.showLoader ? (<Loader />):('')}
              {this.state.NotLoggedIn ?  (  
                <div>
             <div className={this.state.ReJoin ? "guest-main-content rejoinchk":"guest-main-content"}>
                {this.state.errorlogin ? 
                    <div className="row error-text">
                         <p className="col-sm-12">{this.state.displayErrorMsg}</p>
                    </div>
                : ('')}
                
                <div className="row mobile-help-link">
                    <div className="col-12 text-right help-icon p-0">
                        <a href={this.state.mdoHelpUrl} className="help-link" target="_blank">Help</a>
                    </div>
                </div>
                <div className="row mobile-logo-container">
                    <div className="title">
                        <p className="col-12 m-0 header">Kaiser Permanente</p>
                        <p className="col-12 sub-header">Video Visits</p>
                    </div>
                </div>
                <div className="guest-form-content">
                <BrowserBlock browserblockinfo = {this.state}/>
                {this.state.ReJoin ? (
                   <div className="guest-form rejoinComp">
                      <button type = "submit" className = "btn w-50 rounded-0 p-0 rejoin" onClick={()=>this.reJoinMeeting()} disabled={this.state.isBrowserBlockError} >Rejoin</button>
                      <button type = "submit" className = "btn w-50 rounded-0 p-0 signout" onClick={()=>this.SignOut()} disabled={this.state.isBrowserBlockError} >Sign out</button>
                    </div>
                ):
                 (    
                    <div className="row guest-form" >
                    <div className="row notice">Children age 11 and younger must have a parent or legal guardian present during the visit.</div>
                        <form className="col-xs-12 col-md-12 login-form">
                            <div className="form-group">
                                <label className="col-sm-12 text-capitalize">Patient Last Name</label>
                                <div className="col-sm-12">
                                    <input type="text" pattern="[a-zA-Z]+" name="lastname" disabled = {this.state.inputDisable || this.state.isBrowserBlockError} value={this.state.lastname} onChange={this.handleChange.bind(this,'lastname')} className="form-control rounded-0 p-0 shadow-none outline-no textindent mobile-input"/>
                                </div>
                            </div>
                            <div className = "form-group mobile-submit mt-5" >
                                 <button type = "submit" className = "btn w-50 rounded-0 p-0 login-submit" id="login" onClick={this.signOn} disabled={this.button.disabled || this.state.isBrowserBlockError}>Join</button>
                            </div>
                        </form>
                    </div> )}
                </div>
                <div className="row mobile-footer mt-5">
                    <p className="col-12 secondary">Children age 11 and younger must have a parent or legal guardian present during the visit.</p>
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