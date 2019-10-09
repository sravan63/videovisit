import React from 'react';
import Header from '../header/header';
import { connect } from 'react-redux';
import axios from 'axios';

import './tempaccess.css';

class TempAccess extends React.Component {
  constructor(props) {
    super(props);
    localStorage.clear();
	 this.state = {last_name: '', mrn: '', birth_month: '', birth_year: '', userDetails: {}};
	 this.signOn = this.signOn.bind(this);
  }
  signOn(){
	  localStorage.clear();
	    axios.post('/videovisit/submitlogin.json?last_name='+this.state.last_name+'&mrn='+this.state.mrn+'&birth_month='+this.state.birth_month+'&birth_year='+this.state.birth_year, {}).then((response) => {
	    	if(response && response.data && response.data.statusCode == '200' && response.data.data && response.data.data.member){
	    		var data = response.data.data.member;
	    		data.isTempAccess = true;
	        	data.ssoSession = response.headers.authtoken;
	        	this.props.dispatch({
			      type:'ADD_USER_DETAILS',
			      data});
	        	localStorage.setItem('userDetails', JSON.stringify(data));
		        this.props.history.push('/secure/myMeetings');
	    	}
	    }, (err) => {
	        console.log(err.message);
	    });
}
  handleChange(key, event){
		this.setState({[key]: event.target.value});
	}
  render() {
    return (
      <div id='container' className="signon-page">
			<Header/>
			<div id='body'>
				<table>
					<tbody>
						<tr>
							<td><span>Patient Last Name:</span></td>
							<td><input type="text" id="last_name" onChange={(e)=>this.handleChange('last_name', e)}/></td>
						</tr>
						<tr>
							<td><span>Medical Record:</span></td>
							<td><input type="text" id="mrn" onChange={(e)=>this.handleChange('mrn', e)}/></td>
						</tr>
						<tr>
							<td><span>Date of Birth:</span></td>
							<td><input type="number" id="birth_month" onChange={(e)=>this.handleChange('birth_month', e)} /><input type="number" id="birth_year" onChange={(e)=>this.handleChange('birth_year', e)}/></td>
						</tr>
						<tr>
							<td colSpan="2" className="text-center"><button onClick={this.signOn}>Sign On</button></td>
						</tr>
					</tbody>
				</table>
			</div>
       </div>    
    );
  }
}

const mapStateToProps = (state) => {
    return {
        userDetails: state
    }
}
export default connect(mapStateToProps)(TempAccess);