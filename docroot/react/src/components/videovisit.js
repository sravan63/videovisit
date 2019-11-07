import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

class Videovisit extends React.Component {
    constructor(props) {
        super(props);
        this.state = { userDetails: {} };
        this.getUserDetails = this.getUserDetails.bind(this);
        //setTimeout(this.getUserDetails.bind(this), 100);
        setTimeout(this.redirectToSsoLoginPage.bind(this), 100);
    }
    redirectToSsoLoginPage() {
        if (this.props.location.pathname == "/login") {
            return;
        }
        if (this.props.location.pathname == "/") {
            this.props.history.push('/login');
            return;
        }
        this.state.userDetails = JSON.parse(localStorage.getItem('userDetails'));
        if (this.state.userDetails && this.state.userDetails.ssoSession) {
            this.props.history.push('/secure/myMeetings');
        } else {
            this.props.history.push('/login');
        }
    }
    getUserDetails() {
        axios.get('/videovisit/isValidWSSOSession.json').then((response) => {
            var tempState = this.state;
            if (response && response.data) {
                tempState.userDetails = response.data;
                this.setState({ tempState });
                var data = response.data;
                this.props.dispatch({
                    type: 'ADD_USER_DETAILS',
                    data
                });
                localStorage.setItem('userDetails', JSON.stringify(response.data));

                var role = tempState.userDetails.role.toLowerCase();
                if (role == 'ma') {
                    this.props.history.push('/secure/searchMeetings');
                } else if (role == 'scheduler') {
                    this.props.history.push('/secure/scheduledMeetings');
                } else {
                    this.props.history.push('/secure/myMeetings');
                }
            } else {
                localStorage.clear();
                this.props.history.push('/intro');
            }
        }, (err) => {
            this.props.history.push('/intro');
        });
    }
    render() {
        return (
            <div></div>
        );
    }
}

export default Videovisit;