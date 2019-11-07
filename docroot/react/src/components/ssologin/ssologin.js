import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import '../../views/authentication/authentication.less';

export default class Ssologin extends React.Component {
    constructor(props) {
		super(props);		
        localStorage.clear();
        this.state = { username: '', password: '', userDetails: {}};
		this.getLoginUserDetails = this.getLoginUserDetails.bind(this);
    }
    getLoginUserDetails() {
        localStorage.clear();
        axios.post('/videovisit/ssosubmitlogin.json?username=' + this.state.username + '&password=' + this.state.password, {}).then((response) => {
           /* if (response && response.data && response.data.statusCode && response.data.statusCode == '200'
             && response.data.data && response.data.data.memberInfo && response.data.data.ssoSession) {*/
          if(response && response.status && response.status==200){
          	 localStorage.setItem('signedIn', true);
                //var data = response.data.data.memberInfo;
                //data.isTempAccess = false;
                //data.ssoSession = response.data.data.ssoSession;
                //localStorage.setItem('userDetails', JSON.stringify(data));
                this.props.history.push('/myMeetings');
            }
        }, (err) => {
            console.log(err);
        });
	}
    handleChange(key, event) {
        this.setState({
            [key]: event.target.value });
    }
    render() {
        return (
			 <div className="sso-content">
						<div className="row mt-1 ml-5 mt-4 mb-5">
						<h3 className="member-head-msg">Please sign on for your Video Visit</h3>
						<form className="col-sm-12 text-center mt-2 p-0">
							<p className="text-left">Use your kp.org user name and password</p>
							<div className="form-group row">
								<div className="col-sm-4">
								<input type="text" className="form-control rounded-0 p-0 shadow-none no-outline textindent" placeholder="kp.org user name" id="uname" onChange={(e)=>this.handleChange('username', e)}  />
								</div>
							</div>
							<div className="form-group row">
								<div className="col-sm-4">
								<input type="password" className="form-control rounded-0 p-0 shadow-none outline-no textindent" placeholder="password" id="pwd" onChange={(e)=>this.handleChange('password', e)}  />
								</div>
							</div>
							<div className="form-group row mt-5">
								<div className="col-sm-4 text-right">
								<button type="button" className="btn w-50 rounded-0 p-0 login-submit" id="login" onClick={this.getLoginUserDetails}>Sign On</button>
								</div>
							</div>
						</form>
						<div>
							<button className="btn btn-link p-0" onClick={() => this.props.data.changeUnit(true)} id="temp-access">Temporary access </button>
						</div>
					</div>					
			</div> 
        );
    }
}

