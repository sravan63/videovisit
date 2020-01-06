import React, { Suspense, lazy } from 'react';
import Header from '../../../components/header/header';
import Loader from '../../../components/loader/loader';
import BackendService from '../../../services/backendService.js';
import Utilities from '../../../services/utilities-service.js';
import './visit.less';

const PreCallCheck = React.lazy(() => import('./pre-call-check/pre-call-check'));
const Conference = React.lazy(() => import('./conference/conference'));

class Visit extends React.Component {

    constructor(props) {
        super(props);
        this.interval = '';
        this.state = { userDetails: {}, showPage: false, showPreCheck: true };
    }

    componentDidMount() {
        if (localStorage.getItem('userDetails')) {
            this.state.userDetails = JSON.parse(localStorage.getItem('userDetails'));
            if (this.state.userDetails) {
                this.setState({showPage: true});
            }
        } else {
            this.props.history.push('/login');
        }
        var browserInfo = Utilities.getBrowserInformation();
        var peripheralsSelected = localStorage.getItem('selectedPeripherals');
        var showPreCallCheck = (browserInfo.isSafari || browserInfo.isFireFox);
        if(showPreCallCheck && !peripheralsSelected){
            this.setState({showPreCheck : true});
        } else {
            this.setState({showPreCheck : false});
        }
    }

    togglePrecheck(){
        this.setState({
            showPreCheck: false
        });
    }

    render() {
        return (
            <div>
                <Suspense fallback={<Loader />}>
                    {this.state.showPreCheck ? 
                      (<PreCallCheck history={this.props.history} data={{togglePrecheck: this.togglePrecheck.bind(this)}}/>)
                    : (<Conference history={this.props.history} />)}
                </Suspense>
            </div>
        )
    }
}

export default Visit;