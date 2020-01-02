import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

class Videovisit extends React.Component {
    constructor(props) {
        super(props);
        this.state = { userDetails: {} };
        setTimeout(this.redirectToSsoLoginPage.bind(this), 100);

    }
    redirectToSsoLoginPage() {
        if (this.props.location.pathname == "/login" || this.props.location.pathname == "/guestlogin") {
            return;
        }
        if (this.props.location.pathname == "/") {
            this.props.history.push('/login');
            return;
        }
        /*this.state.userDetails = JSON.parse(localStorage.getItem('userDetails'));
        if (this.state.userDetails && this.state.userDetails.ssoSession) {
            this.props.history.push('/myMeetings');
        } else {
            this.props.history.push('/login');
        }*/
    }
    render() {
        return (
            <div></div>
        );
    }
}

export default Videovisit;