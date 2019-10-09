import React from "react";
import { connect } from 'react-redux';

import './header.css';

class header extends React.Component {
	constructor(props) {
	   super(props);
	   this.state = {name: '', userDetails: {}};
	}
	componentWillMount() {
		//if(this.props.userDetails && this.props.userDetails.userDetails){
            if(localStorage.getItem('userDetails')){
            const data = JSON.parse(localStorage.getItem('userDetails'));
            this.state.userDetails = data;
            //const data = this.props.userDetails.userDetails;
			this.setState({
			      name: data.firstName.toLowerCase()+ ' ' + data.lastName.toLowerCase()
			}); 
		 }	    
	}
  render() {
    return (
    	<div className="header-content"> 
    		<div className="title">Video Visits</div>
            { this.state.name? 
                <div className="user-details" >
                    <ul>
                        <li>{this.state.name? this.state.name: ' '}</li>
                        <li>{this.state.name? '|': ''}</li>
                        <li>Help</li>
                        <li>|</li>
                        <li><span className="sign-off" onClick={this.props.signOffMethod}>Sign off</span></li>
                    </ul>
                </div>
             : null
        }
    		
    	</div>
    );
  }
}


const mapStateToProps = (state) => {
    return {
        userDetails: state
    }
}
export default connect(mapStateToProps)(header);
