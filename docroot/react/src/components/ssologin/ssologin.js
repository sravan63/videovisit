import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import '../../views/authentication/authentication.less';
import ReactDOM from 'react-dom';

export default class Ssologin extends React.Component {
    constructor(props) {
        super(props);
        localStorage.clear();
        this.state = {
            username: '',
            password: '',
            errors: {
                usernameflag: '',                
                passwordflag: '',
                errorlogin: false,
                errormsg : '',
            }
        };
        this.button = { disabled: true }
        this.getLoginUserDetails = this.getLoginUserDetails.bind(this);
    }
    getLoginUserDetails() {
        localStorage.clear();
        axios.post('/videovisit/ssosubmitlogin.json?username=' + this.state.username + '&password=' + this.state.password, {}).then((response) => {
            /* if (response && response.data && response.data.statusCode && response.data.statusCode == '200'
              && response.data.data && response.data.data.memberInfo && response.data.data.ssoSession) {*/
            if (response && response.status && response.status == 200) {
                localStorage.setItem('signedIn', true);
                //var data = response.data.data.memberInfo;
                //data.isTempAccess = false;
                //data.ssoSession = response.data.data.ssoSession;
                //localStorage.setItem('userDetails', JSON.stringify(data));
                this.props.history.push('/myMeetings');
            }
        }, (err) => {
            this.setState({
                errors :{errorlogin : true,errormsg : "There was an error authenticating your account. Please sign in using temporary access."} 
            }); 
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
    handleSubmit(event) {
        console.log(this);
    }

    render() {
        const { errors } = this.state;
        return (
            <div className="sso-content">
                    {/* desktop content */}
                    <div className="row mt-1 ml-5 mt-4 mb-5 sso-desktop">
                        <h3 className="member-head-msg">Please sign on for your Video Visit</h3>
                        <form className="col-sm-12 text-center mt-2 p-0">
                            <p className="text-left">Use your kp.org user name and password</p>
                            <div className="form-group row">
                                <div className="col-sm-4">
                                <input type="text" name="username" value={this.state.username} className="form-control rounded-0 p-0 shadow-none no-outline textindent" placeholder="kp.org user name" onChange={this.handleChange.bind(this,'username')}  />
                                </div>
                                <div className="sso-login-error ml-5">
                                    {this.state.errors.errorlogin > 0 && (
                                        <div className="error">{this.state.errors.errormsg}</div>
                                    )
                                    }
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-sm-4">
                                <input type="password" name="password" value={this.state.password} className="form-control rounded-0 p-0 shadow-none outline-no textindent" placeholder="password" onChange={this.handleChange.bind(this,'password')}  />
                                </div>
                            </div>
                            <div className="form-group row mt-5">
                                <div className="col-sm-4 text-right">
                                <button type="button" className="btn w-50 rounded-0 p-0 login-submit" id="login" onClick={this.getLoginUserDetails} disabled={this.button.disabled}>Sign On</button>
                                </div>
                            </div>
                        </form>
                        <div>
                            <button className="btn btn-link p-0" onClick={() => this.props.data.toggleLoginScreen(true)} id="temp-access">Temporary access </button>
                        </div>
                    </div>   
                    {/* mobile content */}              
                    <div className="row sso-mobile" > 
                        <form className="col-xs-12 mobile-form">
                            <div className="form-group">
                                <label className="col-sm-12">User ID</label>
                                <div className="col-sm-12">
                                    <input type="text" name="username" value={this.state.username} className="form-control rounded-0 p-0 shadow-none no-outline textindent mobile-input" onChange={this.handleChange.bind(this,'username')}  />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-sm-12">Password</label>
                                <div className="col-sm-12">
                                    <input type="password" name="password" value={this.state.password} className="form-control rounded-0 p-0 shadow-none outline-no textindent mobile-input" onChange={this.handleChange.bind(this,'password')}  />
                                </div>
                            </div>
                            <div className="form-group mobile-submit mt-5">
                                <button type="button" className="btn w-50 rounded-0 p-0 login-submit" id="login" onClick={this.getLoginUserDetails} disabled={this.button.disabled}>Sign On</button>
                            </div>
                        </form>
                        <button type="button" className="mobile-form-toggle mt-5 btn row pr-2 pl-0" onClick={() => this.props.data.toggleLoginScreen(true)} >
                            <span className="video-icon mr-1"></span>
                            <span className="toggle-text" >Video Visit Temporary Access </span>
                        </button>
                    </div> 
                </div>

        );
    }
}