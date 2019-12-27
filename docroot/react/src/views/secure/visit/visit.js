import React from "react";
import Header from '../../../components/header/header';
import Loader from '../../../components/loader/loader';
import PreCallCheck from './pre-call-check/pre-call-check';
import Conference from './conference/conference';
import BackendService from '../../../services/backendService.js';
import Utilities from '../../../services/utilities-service.js';
import './visit.less';

class Visit extends React.Component {

    constructor(props) {
        super(props);
        this.interval = '';
        this.state = { userDetails: {}, showPage: false, showPreCheck: true };
    }

    componentDidMount() {
        this.interval = setInterval(() => this.getMyMeetings(), 180000);
        if (localStorage.getItem('userDetails')) {
            this.state.userDetails = JSON.parse(localStorage.getItem('userDetails'));
            if (this.state.userDetails) {
                this.setState({showPage: true});
            }
        } else {
            this.props.history.push('/login');
        }
    }

    


    render() {
        return (
            <div>
                {this.state.showPreCheck ? (<PreCallCheck />): (<Conference />)}
            </div>
        )
    }
}

export default Visit;