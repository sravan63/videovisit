import React from "react";
import Header from '../../../../components/header/header';
import Loader from '../../../../components/loader/loader';
import BackendService from '../../../../services/backendService.js';
import './pre-call-check.less';

class PreCallCheck extends React.Component {

    constructor(props) {
        super(props);
        this.interval = '';
        this.state = { userDetails: {}, showPage: false, showLoader: true };
    }

    componentDidMount() {
        this.interval = setInterval(() => this.getMyMeetings(), 180000);
        if (localStorage.getItem('userDetails')) {
            this.state.userDetails = JSON.parse(localStorage.getItem('userDetails'));
            if (this.state.userDetails) {
                this.setState({showPage : true});
            }
        } else {
            this.props.history.push('/login');
        }
    }


    render() {
        return (
            <div id='container' className="pre-call-check-page">
                 <Header/>
                 <div className="pre-call-check-content">
                     <div className="col-md-8 pre-call-check">
                         <div className="col-md-6 options p-0">
                             <div className="dropdown show">
                                  <a className="btn col-md-12 dropdown-toggle rounded-0" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Camera
                                  </a>
                                  <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                    <a className="dropdown-item" href="#">Action</a>
                                    <a className="dropdown-item" href="#">Another action</a>
                                    <a className="dropdown-item" href="#">Something else here</a>
                                  </div>
                             </div>
                             <div className="dropdown show">
                                  <a className="btn col-md-12 dropdown-toggle rounded-0" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Microphone
                                  </a>
                                  <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                    <a className="dropdown-item" href="#">Action</a>
                                    <a className="dropdown-item" href="#">Another action</a>
                                    <a className="dropdown-item" href="#">Something else here</a>
                                  </div>
                             </div>
                             <div className="dropdown show">
                                  <a className="btn col-md-12 dropdown-toggle rounded-0" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Speakers
                                  </a>
                                  <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                    <a className="dropdown-item" href="#">Action</a>
                                    <a className="dropdown-item" href="#">Another action</a>
                                    <a className="dropdown-item" href="#">Something else here</a>
                                  </div>
                             </div>
                         </div>
                         <div className="col-md-6 p-0"></div>
                     </div>
                 </div>
            </div>
        )
    }
}

export default PreCallCheck;