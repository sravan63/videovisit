import React from 'react';
import Header from '../header/header';
import { connect } from 'react-redux';
import axios from 'axios';

//import * as main from '../../miscellaneous/test'

import './login.less';

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
    redirectToTempAccessPage() {
        //main.bodyLoaded();
        this.props.history.push('/tempaccess');
    }
    handleChange(key, event) {
        //var innerObj = this.state.innerObj;
        //innerObj.obj2 = event.target.value;
        //this.setState({innerObj});//setting inner level property
        //this.setState({[key]: event.target.value});
        this.setState({
            [key]: event.target.value });
    }
    render() {
        return (
            <div id='container' className="ssologin-page">
		<Header/>
			<div id='body'>
				<table>
					<tbody>
						<tr>
							<td><span>Uname:</span></td>
							<td><input type="text" id="username" onChange={(e)=>this.handleChange('username', e)} /></td>
						</tr>
						<tr>
							<td><span>Password:</span></td>
							<td><input type="password" id="password" onChange={(e)=>this.handleChange('password', e)} /></td>
						</tr>
						<tr>
							<td colSpan="2" className="text-center"><button onClick={this.getLoginUserDetails}>Sign On</button></td>
						</tr>
						<tr>
							<td colSpan="2" className="text-center"><span className="tempAccess" onClick={this.redirectToTempAccessPage.bind(this)}>Temp Access</span></td>
						</tr>
					</tbody>
				</table>
			</div>  
		 </div>
        );
    }
}

export default Login;