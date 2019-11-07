import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import '../../views/authentication/authentication.less';
class Login extends React.Component {
    constructor(props) {
        super(props);
        localStorage.clear();
        this.state = { username: '', password: '', userDetails: {} };
        this.getLoginUserDetails = this.getLoginUserDetails.bind(this);
    }
    getLoginUserDetails() {
        localStorage.clear();
        axios.post('/videovisit/ssosubmitlogin.json?username=' + this.state.username + '&password=' + this.state.password, {}).then((response) => {
            if (response && response.data && response.data.statusCode && response.data.statusCode == '200' && response.data.data && response.data.data.memberInfo && response.data.data.ssoSession) {
                var data = response.data.data.memberInfo;
                data.isTempAccess = false;
                data.ssoSession = response.data.data.ssoSession;
                localStorage.setItem('userDetails', JSON.stringify(data));
                this.props.history.push('/secure/myMeetings');
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
			 <div className="temp-content">
					<div className="row mt-4 ml-5 mb-1">
						<div className="col-12 p-0">
							<h3 className="member-head-msg">Please sign on for your Video Visit</h3>
							<p>Children age 11 or younger must have a parent or legal guardian with them during the Video Visit.</p>
						</div>
					</div>
					<div className="row mt-1">
						<form className="col-sm-12 p-0">
							<div className="form-group row ml-5 mt-2">
								<label for="lastName" className="col-md-2 col-sm-3 col-form-label">Patient's Last Name</label>
								<div className="col-sm-4">
								<input type="text" className="form-control rounded-0 p-0 shadow-none no-outline" id="plname" />
								</div>
							</div>
							<div className="form-group row ml-5 mt-2">
								<label for="medicalRecordNumber" className="col-md-2 col-sm-3 col-form-label">Medical Record Number</label>
								<div className="col-sm-4">
								<input type="text" className="form-control rounded-0 p-0 shadow-none outline-no" id="mrn" />
								</div>
							</div>
							<div className="form-group row ml-5 mt-2">
								<label for="dateOfBirth" className="col-md-2 col-sm-3 col-form-label">Date of Birth</label>
								<div className="col-md-2 col-sm-3">
									<input type="text" className="form-control rounded-0 shadow-none outline-none" id="dob-month" placeholder="mm" />
								</div>
								<div className="col-md-2 col-sm-3">
									<input type="text" className="form-control rounded-0 shadow-none" id="dob-year" placeholder="yyyy" />
								</div>
							</div>
							<div className="form-group row ml-5 mt-5">
								<div className="col-sm-4">
								</div>
								<div className="col-sm-2">
								<button className="btn w-100 rounded-0 p-0 login-submit" id="login" >Sign On</button>
								</div>
							</div>
						</form>
						<div className="col-sm-6 ml-5">
							<button className="btn btn-link" onClick={() => this.props.data.changeUnit(false)} id="temp-access">SSO access </button>
						</div>
					</div>
			</div>  
        );
    }
}

export default Login;