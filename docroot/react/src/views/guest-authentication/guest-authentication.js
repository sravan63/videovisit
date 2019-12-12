import React from 'react';
import Header from '../../components/header/header';
import Sidebar from '../../components/sidebar/sidebar';
import Footer from '../../components/footer/footer';
import Ssologin from '../../components/ssologin/ssologin';
import Login from '../../components/tempaccess/tempaccess';
import './guest-authentication.less';

class Authentication extends React.Component {
    constructor(props) {
        super(props);
        localStorage.clear();
        this.state = { lastname: '', errormsgs: { errorlogin: false, errormsg: '' } };
        this.button = { disabled: true }
        this.signOn = this.signOn.bind(this);
    }

    componentDidMount(){ }

    signOn(e) {
        console.log('CLICKED ON GUEST SIGN ON');
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
            if (this.state.lastname != "" && this.state.mrn != "" && this.state.birth_month != "" && this.state.birth_year != "") {
                this.button.disabled = false;
            } else {
                this.button.disabled = true;
            }
        } else {
            this.button.disabled = true;
        }
    }

    render() {
        return (
            <div id='container' className="authentication-page">
             <Header/>
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
                                <label className="col-sm-12 text-capitalize">Patient's Last Name</label>
                                <div className="col-sm-12">
                                    <input type="text" pattern="[a-zA-Z]+" name="lastname" value={this.state.lastname} onChange={this.handleChange.bind(this,'lastname')} className="form-control rounded-0 p-0 shadow-none outline-no textindent mobile-input" placeholder="i.e. Smith"/>
                                </div>
                            </div>
                            <div className = "form-group mobile-submit mt-5" >
                                 <button type = "button" className = "btn w-50 rounded-0 p-0 login-submit" id="login" onClick={this.signOn} disabled={this.button.disabled}>Sign In</button>
                            </div>
                        </form>
                    </div> 
                </div>
                <div className="row mobile-footer mt-5">
                    <p className="col-12">If You're a Patient's Guest</p>
                    <p className="col-12 secondary">Guests of patients with a video visit, click the link in your email invitation.</p>
                </div>
            </div> 
            <Footer />
             
         </div>
        );
    }
}

export default Authentication;