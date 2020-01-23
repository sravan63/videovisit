import React from 'react';
import Header from '../../components/header/header';
import Sidebar from '../../components/sidebar/sidebar';
import Footer from '../../components/footer/footer';
import Ssologin from '../../components/ssologin/ssologin';
import Login from '../../components/tempaccess/tempaccess';
import Loader from '../../components/loader/loader';
import './guest-authentication.less';
import BackendService from '../../services/backendService.js';
import GlobalConfig from '../../services/global.config';

class Authentication extends React.Component {
    constructor(props) {
        super(props);
        localStorage.clear();
        this.state = { lastname: '', NotLoggedIn: false, meetingCode: null, showLoader: false, inputDisable: false, errormsgs: { errorlogin: false, errormsg: '' } };
        this.button = { disabled: true }
        this.signOn = this.signOn.bind(this);
    }

    componentDidMount() {
        //var meetingCode;
        if (window.location.hash.includes('meetingcode')) {
            this.state.meetingCode = window.location.hash.slice(25);
        }
        this.setState({ showLoader: true });
        BackendService.isMeetingValidGuest(this.state.meetingCode).subscribe((response) => {
            if (response.data != "" && response.data != null && response.data.statusCode == 200) {
                this.setState({ NotLoggedIn: true });
                this.setState({ showLoader: false });
            } else {
                this.setState({ errormsgs: { errorlogin: true } });
                this.setState({ inputDisable: true });
                this.setState({ NotLoggedIn: true });
                this.setState({ showLoader: false });
            }
        }, (err) => {
            this.setState({ errormsgs: { errorlogin: true } });
            this.setState({ NotLoggedIn: true });
            this.setState({ showLoader: false });

        });
    }


    signOn(e) {
        localStorage.clear();
        this.setState({ showLoader: true });
        BackendService.guestLogin(this.state.meetingCode, this.state.lastname).subscribe((response) => {
            if (response.data != "" && response.data != null && response.data.statusCode == 200) {
                if (response.data.data != null && response.data.data != '') {
                    var data = {};
                    data = response.data.data[0] ? response.data.data[0] : '';
                    data.meetingCode = this.state.meetingCode;
                    localStorage.setItem('meetingId', JSON.stringify(data.meetingId));
                    localStorage.setItem('userDetails', JSON.stringify(data));
                    localStorage.setItem('isGuest', true);
                    this.setState({ showLoader: false });
                    this.props.history.push(GlobalConfig.VIDEO_VISIT_ROOM_URL);
                }
            } else {
                this.setState({ errormsgs: { errorlogin: true } });
                this.setState({ showLoader: false });

            }
        }, (err) => {
            this.setState({ errormsgs: { errorlogin: true } });
            this.setState({ showLoader: false });

        });
    }

    handleChange(key, event) {
        event.preventDefault();
        const { name, value } = event.target;
        switch (name) {
            case 'lastname':
                const lname_regex = event.target.value.replace(/[^a-zA-Z ]/g, "");
                this.lastname = lname_regex;
                this.setState({
                    [name]: this.lastname
                });
                break;
            default:
                break;
        }

        if ("" != event.target.value) {
            if (this.state.lastname != "") {
                this.button.disabled = false;
            }
        }
    }

    render() {
        return (
            <div id='container' className="authentication-page">
             <Header/>
             {this.state.showLoader ? (<Loader />):('')}
              {this.state.NotLoggedIn ?  (  
                <div>
             <div className="guest-main-content">
                {this.state.errormsgs.errorlogin ? 
                    <div className="row error-text">
                         <p className="col-sm-12">The video visit you are trying to join is not currently available.</p>
                    </div>
                : ('')}
                <div className="row mobile-help-link">
                    <div className="col-12 text-right help-icon p-0">
                        <small><a href="https://mydoctor.kaiserpermanente.org/ncal/videovisit/#/faq/mobile" className="help-link" target="_blank">Help</a></small>
                    </div>
                </div>
                <div className="row mobile-logo-container"><div className="col-12 mobile-tpmg-logo"></div><p className="col-12 header">Video Visits</p></div>
                <div className="guest-form-content">
                    <div className="row notice">Children age 11 and younger must have a parent or legal guardian present during the visit.</div>
                    <div className="row guest-form" >
                        <form className="col-xs-12 col-md-12 login-form">
                            <div className="form-group">
                                <label className="col-sm-12 text-capitalize">Patient Last Name</label>
                                <div className="col-sm-12">
                                    <input type="text" pattern="[a-zA-Z]+" name="lastname" disabled = {this.state.inputDisable} value={this.state.lastname} onChange={this.handleChange.bind(this,'lastname')} className="form-control rounded-0 p-0 shadow-none outline-no textindent mobile-input"/>
                                </div>
                            </div>
                            <div className = "form-group mobile-submit mt-5" >
                                 <button type = "button" className = "btn w-50 rounded-0 p-0 login-submit" id="login" onClick={this.signOn} disabled={this.button.disabled}>Join</button>
                            </div>
                        </form>
                    </div> 
                </div>
                <div className="row mobile-footer mt-5">
                    <p className="col-12 secondary">Children age 11 and younger must have a parent or legal guardian present during the visit.</p>
                </div>
            </div> 
            <div className="form-footer">
                <Footer />
            </div> 
            </div> ) : ('')}
         </div>
        );
    }
}

export default Authentication;