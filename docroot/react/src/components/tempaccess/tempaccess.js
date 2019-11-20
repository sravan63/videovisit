import React from 'react';
import axios from 'axios';
import '../../views/authentication/authentication.less';
import { Route , withRouter} from 'react-router-dom';
class TempAccess extends React.Component {
    constructor(props) {
        super(props);
        localStorage.clear();
        this.state = { lastname: '', mrn: '', birth_month: '', birth_year: '', errormsgs: { errorlogin: false, errormsg: '' } };
        this.button = { disabled: true }
        this.signOn = this.signOn.bind(this);
    }
    signOn() {
        localStorage.clear();
        axios.post('/videovisit/submitlogin.json?last_name=' + this.state.lastname + '&mrn=' + this.state.mrn + '&birth_month=' + this.state.birth_month + '&birth_year=' + this.state.birth_year, {}).then((response) => {
            if (response.data != "" && response.data != null && response && response.data.statusCode == 200) {
                this.setState({
                    errormsgs: { errorlogin: false, errormsg: "" }
                });
                // if(response.data != "" || response.data != null){
                // let data = response.data.member;
                // let fullname = data.firstName + +data.lastName;                
                //data.isTempAccess = true;
                //data.ssoSession = response.headers.authtoken;
                //localStorage.setItem('userDetails', fullname);
                //localStorage.setItem('userDetails', JSON.stringify(data));
                this.props.data.emit({ isMobileError: false });
                this.props.history.push('/myMeetings');
                // }else{
                //     this.props.history.push('/myMeetings');
                // }
            } else {
                this.setState({
                    errormsgs: { errorlogin: true, errormsg: "We could not find this patient. Please try entering the information again." }
                });
                this.props.data.emit({ isMobileError: true });
            }
        }, (err) => {
            this.setState({
                errormsgs: { errorlogin: true, errormsg: "We could not find this patient. Please try entering the information again." }
            });
            this.props.data.emit({ isMobileError: true });
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
            case 'mrn':
                const mrn_regex = event.target.value.replace(/[^0-9 ]/g, "");
                this.mrn = mrn_regex;
                this.setState({
                    [name]: this.mrn
                });
                break;
            case 'birth_month':
                const birth_month_regex = event.target.value.replace(/[^0-9 ]/g, "");
                this.birth_month = birth_month_regex;
                this.setState({
                    [name]: this.birth_month
                });
                break;
            case 'birth_year':
                const birth_year_regex = event.target.value.replace(/[^0-9 ]/g, "");
                this.birth_year = birth_year_regex;
                this.setState({
                    [name]: this.birth_year
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
            <div className="temp-content">
                {/* desktop content */}     
                <div className="temp-desktop">
                        <div className="row mt-4 ml-5 mb-1">
                            <div className="col-12 p-0">
                                <h3 className="member-head-msg">Please sign on for your Video Visit</h3>
                                <p>Children age 11 or younger must have a parent or legal guardian with them during the Video Visit.</p>
                            </div>
                        </div>
                        <div className="row mt-1">
                            <form className="col-sm-12 p-0">
                                <div className="form-group row ml-5 mt-2">
                                    <label className="col-md-2 col-sm-3 col-form-label">Patient's Last Name</label>
                                    <div className="col-sm-4">
                                    <input type="text" value={this.state.lastname} onChange={this.handleChange.bind(this,'lastname')} name="lastname" className="form-control lastname rounded-0 shadow-none no-outline" id="plname" />
                                    </div>
                                    <div className="temp-login-error ml-5">
                                    {this.state.errormsgs.errorlogin && (
                                        <div className="temp-error">{this.state.errormsgs.errormsg}</div>
                                    )
                                    }
                                </div>
                                </div>
                                <div className="form-group row ml-5 mt-2">
                                    <label className="col-md-2 col-sm-3 col-form-label">Medical Record Number</label>
                                    <div className="col-sm-4">
                                    <input type="text" value={this.state.mrn} onChange={this.handleChange.bind(this,'mrn')} name="mrn"  className="form-control mrn rounded-0 shadow-none outline-no" id="mrn" maxLength="8" />
                                    </div>
                                </div>
                                <div className="form-group row ml-5 mt-2">
                                    <label className="col-md-2 col-sm-3 col-form-label">Date of Birth</label>
                                    <div className="col-md-1 col-sm-3">
                                        <input type="text" value={this.state.birth_month} onChange={this.handleChange.bind(this,'birth_month')} name="birth_month"  className="form-control dob-mm rounded-0 shadow-none outline-none" id="dob-month" placeholder="mm" maxLength="2" />
                                    </div>
                                    <div className="col-md-2 col-sm-3">
                                        <input type="text" value={this.state.birth_year} onChange={this.handleChange.bind(this,'birth_year')}  name="birth_year" className="form-control dob-yy rounded-0 shadow-none" id="dob-year" placeholder="yyyy" maxLength="4" />
                                    </div>
                                </div>
                                <div className="form-group row mt-5">                                    
                                    <div className="col-sm-5 text-right p-0">
                                    <button type="button" className="btn rounded-0 p-0 login-submit" id="login" onClick={this.signOn} disabled={this.button.disabled} >Sign On</button>
                                    </div>
                                </div>
                            </form>
                            <div className="col-sm-6 redirectToKp">
                                <button className="btn btn-link temp-login" onClick={() => this.props.data.emit({isTemp: false})} id="temp-access">kp.org Login </button>
                            </div>
                        </div>
                </div>
                {/* mobile content */}              
                <div className="row temp-mobile" > 
                    <p className="col-12 sub-text mt-5 font-weight-bold">Patient's Information</p>
                    <form className="col-xs-12 mobile-form">
                        <div className="form-group">
                            <label className="col-sm-12 text-uppercase">Last Name</label>
                            <div className="col-sm-12">
                                <input type="text" name="lastname" value={this.state.lastname} onChange={this.handleChange.bind(this,'lastname')} className="form-control rounded-0 p-0 shadow-none outline-no textindent mobile-input" placeholder="i.e. Smith"/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-12 text-uppercase">Medical Record Number.</label>
                            <div className="col-sm-12">
                                <input type="text" name="mrn" value={this.state.mrn} onChange={this.handleChange.bind(this,'mrn')} className="form-control rounded-0 p-0 shadow-none outline-no textindent mobile-input" placeholder="######" maxLength="8" />
                            </div>
                        </div>
                        <div className="form-group col">
                            <label className="col-12 p-0 text-uppercase">Date of Birth</label>
                            <div className="row">
                                <div className="col-3">
                                    <input type="text" name="birth_month" value={this.state.birth_month} onChange={this.handleChange.bind(this,'birth_month')} className="form-control rounded-0 p-0 shadow-none outline-no textindent mobile-input" placeholder="MM" maxLength="2" /> 
                                </div> 
                                <div className = "col-9" >
                                    <input type="text" name="birth_year" value={this.state.birth_year} onChange={this.handleChange.bind(this,'birth_year')} className="form-control rounded-0 p-0 shadow-none outline-no textindent mobile-input" placeholder="YYYY" maxLength="4" /> 
                                </div> 
                            </div> 
                        </div> 
                        <div className = "form-group mobile-submit mt-5" >
                             <button type = "button" className = "btn w-50 rounded-0 p-0 login-submit" id="login" onClick={this.signOn} disabled={this.button.disabled}>Sign On</button>
                        </div>
                    </form>
                    {!this.props.data.isInApp ?(<button type="button" className="mobile-form-toggle mt-1 btn row" onClick={() => this.props.data.emit({isTemp: false})} >
                        <span className="video-icon mr-2"></span>
                        <span className="toggle-text" >Video Visit kp.org Login </span>
                    </button>) : ('')}
                    
                </div> 
            </div>
        );
    }
}

export default withRouter(TempAccess);