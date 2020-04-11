import React from 'react';
import '../../views/authentication/authentication.less';
import BackendService from '../../services/backendService.js';
import GlobalConfig from '../../services/global.config';
import UtilityService from '../../services/utilities-service.js';
import ReactDOM from 'react-dom';

export default class Ssologin extends React.Component {
    constructor(props) {
        super(props);
        localStorage.clear();
        this.state = {
            username: '',
            password: '',
            NotLoggedIn: false,
            screenOrientation:'',
            errors: {
                usernameflag: '',
                passwordflag: '',
                errorlogin: false,
                errormsg: '',
            }
        };
        this.button = { disabled: true }
        this.getLoginUserDetails = this.getLoginUserDetails.bind(this);
    }


    componentDidMount() {
        BackendService.getPreSSO().subscribe((response) => {
            //console.log(response);
            if (response.data != "" && response.data != null && response && response.status == 200) {
                if (response.data.data != null && response.data.data != '') {
                    this.handleDataAfterResponse(response);
                } else {
                    this.setState({ NotLoggedIn: true });
                }

            } else {
                this.setState({ NotLoggedIn: true });
            }
        }, (err) => {
            console.log(err);
            this.setState({ NotLoggedIn: true });
        });
        window.addEventListener('orientationchange', this.setScreenOrientation);
    }
    setScreenOrientation(){
        var isLandscape = window.matchMedia("(orientation:landscape)").matches;
        // if(isLandscape) {  
        //     this.setState({  screenOrientation: 'landscape' });
        // } else {  
        //     this.setState({  screenOrientation: 'portrait' });
        // }
    }
    handleDataAfterResponse(response) {
        this.setState({
            errors: { errorlogin: false, errormsg: "" }
        });
        this.props.data.emit({ showLoader: false });
        localStorage.setItem('signedIn', true);
        var data = response.data.data.memberInfo;
        if (data != null || data != undefined) {
            data.isTempAccess = false;
            data.ssoSession = response.data.data.ssoSession;
            localStorage.setItem('LoginUserDetails', UtilityService.encrypt(JSON.stringify(data)));
            this.props.data.emit({ isMobileError: false });
            this.props.history.push(GlobalConfig.MEETINGS_URL);
        }


    }

    getLoginUserDetails(e) {
        e.preventDefault();
        localStorage.clear();
        this.props.data.emit({ showLoader: true });
        BackendService.getSSOLogin(this.state.username, this.state.password).subscribe((response) => {
            /* if (response && response.data && response.data.statusCode && response.data.statusCode == '200'
              && response.data.data && response.data.data.memberInfo && response.data.data.ssoSession) {*/
            if (response.data != "" && response.data != null && response && response.status == 200) {
                if (response.data.data != null && response.data.data != '') {
                    this.handleDataAfterResponse(response);
                } else {
                    this.setState({
                        errors: { errorlogin: true, errormsg: "There was an error authenticating your account. Please sign in using temporary access." }
                    });
                    this.props.data.emit({ isMobileError: true });
                    this.props.data.emit({ showLoader: false });
                    window.scrollTo(0, 0);
                }
            } else {
                this.setState({
                    errors: { errorlogin: true, errormsg: "There was an error authenticating your account. Please sign in using temporary access." }
                });
                this.props.data.emit({ isMobileError: true });
                this.props.data.emit({ showLoader: false });
                window.scrollTo(0, 0);
            }
        }, (err) => {
            this.setState({
                errors: { errorlogin: true, errormsg: "There was an error authenticating your account. Please sign in using temporary access." }
            });
            this.props.data.emit({ isMobileError: true });
            this.props.data.emit({ showLoader: false });
            window.scrollTo(0, 0);
        });
    }
    handleChange(key, event) {
        event.preventDefault();
        const { name, value } = event.target;
        let errors = this.state.errors;
        switch (name) {
            case 'username':
                errors.usernameflag = value;
                break;
            case 'password':
                errors.passwordflag = value;
                break;
            default:
                break;
        }
        this.setState({ errors, [name]: value });
        if ("" != event.target.value) {
            if (this.state.errors.usernameflag != "" && this.state.errors.passwordflag != "") {
                this.button.disabled = false;
            } else {
                this.button.disabled = true;
            }
        } else {
            this.button.disabled = true;
        }
    }

    render() {
        const { errors } = this.state;
        return (
            <div className="sso-content"> 
            {this.state.NotLoggedIn ?  (        
                    <div className="row sso-form" style={{width: window.innerWidth < 787 && window.orientation == 0 ? 'auto' : 'fit-content',margin:window.innerWidth < 787 && window.orientation == 0 ? '0' : '0 auto'}}> 
                        <form className="col-xs-12 col-md-12 login-form">
                            <div className="form-group top-form-group-margin">
                                <label className="col-sm-12">kp.org user ID</label>
                                <div className="col-sm-12">
                                    <input type="text" name="username" placeholder="nc123456" maxLength="20" value={this.state.username} className="form-control rounded-0 p-0 shadow-none no-outline textindent mobile-input" onChange={this.handleChange.bind(this,'username')} disabled={this.props.data.browserBlock} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-sm-12">Password</label>
                                <div className="col-sm-12">
                                    <input type="password" name="password" placeholder="######" value={this.state.password} className="form-control rounded-0 p-0 shadow-none outline-no textindent mobile-input" onChange={this.handleChange.bind(this,'password')} disabled={this.props.data.browserBlock} />
                                </div>
                            </div>
                            <div className="form-group mobile-submit margin-gap">
                                <button type="submit" className="btn rounded-0 p-0 login-submit" id="login" onClick={this.getLoginUserDetails} disabled={this.button.disabled || this.props.data.browserBlock}>Sign In</button>
                            </div>
                        </form>
                        <button type="button" disabled={this.props.data.browserBlock} className="mobile-form-toggle mt-1 btn row pr-2 pl-0" onClick={() => this.props.data.emit({isTemp: true})} >
                            <span className="video-icon mr-1"></span>
                            <span className="toggle-text" >Video Visit Temporary Access </span>
                        </button>
                    </div> ) : ('')}
                </div>

        );
    }
}