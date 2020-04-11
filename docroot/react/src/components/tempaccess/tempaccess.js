import React from 'react';
import '../../views/authentication/authentication.less';
import BackendService from '../../services/backendService.js';
import GlobalConfig from '../../services/global.config';
import { Route, withRouter } from 'react-router-dom';
import UtilityService from '../../services/utilities-service.js';

class TempAccess extends React.Component {
    constructor(props) {
        super(props);
        localStorage.clear();
        this.state = { lastname: '', mrn: '', birth_month: '', birth_year: '', errormsgs: { errorlogin: false, errormsg: '' } };
        this.button = { disabled: true }
        this.signOn = this.signOn.bind(this);
    }

    signOn(e) {
        e.preventDefault();
        localStorage.clear();
        this.props.data.emit({ showLoader: true });
        BackendService.getTempLogin(this.state.lastname.trim(), this.state.mrn, this.state.birth_month, this.state.birth_year).subscribe((response) => {
            if (response.data != "" && response.data != null && response && response.data.statusCode == 200) {
                this.props.data.emit({ showLoader: false });
                this.setState({
                    errormsgs: { errorlogin: false, errormsg: "" }
                });
                let data = response.data.data;
                // let fullname = data.firstName + +data.lastName;                
                data.isTempAccess = true;
                data.ssoSession = response.headers.authtoken;
                //localStorage.setItem('userDetails', fullname);
                localStorage.setItem('LoginUserDetails', UtilityService.encrypt(JSON.stringify(data)));
                localStorage.setItem('signedIn', true);
                this.props.data.emit({ isMobileError: false });
                this.props.history.push(GlobalConfig.MEETINGS_URL);
            } else {
                this.setState({
                    errormsgs: { errorlogin: true, errormsg: "We could not find this patient. Please try entering the information again." }
                });
                this.props.data.emit({ isMobileError: true });
                this.props.data.emit({ showLoader: false });
                window.scrollTo(0, -2);
            }
        }, (err) => {
            this.setState({
                errormsgs: { errorlogin: true, errormsg: "We could not find this patient. Please try entering the information again." }
            });
            this.props.data.emit({ isMobileError: true });
            this.props.data.emit({ showLoader: false });
        });
    }
    
    handleChange(key, event) {
        event.preventDefault();
        const { name, value } = event.target;
        switch (name) {
            case 'lastname':
                const lname_regex = event.target.value;    
                var isValid = UtilityService.hasAllLegalCharacters(lname_regex);
                if(isValid){
                    this.lastname = lname_regex;
                    this.setState({
                        [name]: this.lastname
                    });
                }
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
    getStyles(){
        let width= '';
        if(window.innerWidth < 787 && window.orientation == 0){
            width += 'auto';
        }else if(window.innerWidth > 787 && window.orientation == 0){
            width += '65%';
        }
        return width;

    }
    render() {
        return (
            <div className="temp-content">
                <div className="row temp-form" style={{width: this.getStyles(),margin:window.innerWidth < 787 && window.orientation == 0 ? '0' : '0 auto'}}> 
                    <form className="col-xs-12 col-md-12 login-form">
                        <p className="col-12 sub-text mt-5 font-weight-bold">Patient's Information</p>
                        <div className="form-group">
                            <label className="col-sm-12 text-capitalize">Last Name</label>
                            <div className="col-sm-12">
                                <input type="text" pattern="[a-zA-Z]+" name="lastname" value={this.state.lastname} onChange={this.handleChange.bind(this,'lastname')} className="form-control rounded-0 p-0 shadow-none outline-no textindent mobile-input" placeholder="i.e. Smith" disabled={this.props.data.browserBlock}/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-12 text-capitalize">Medical Record Number</label>
                            <div className="col-sm-12">
                                <input type="tel" name="mrn" value={this.state.mrn} onChange={this.handleChange.bind(this,'mrn')} className="form-control rounded-0 p-0 shadow-none outline-no textindent mobile-input" placeholder="######" maxLength="8" disabled={this.props.data.browserBlock} />
                            </div>
                        </div>
                        <div className="form-group col">
                            <label className="col-12 p-0 text-capitalize">Date of Birth</label>
                            <div className="row">
                                <div className="col-3">
                                    <input type="tel" name="birth_month" value={this.state.birth_month} onChange={this.handleChange.bind(this,'birth_month')} className="form-control rounded-0 p-0 shadow-none outline-no textindent mobile-input" placeholder="MM" maxLength="2" disabled={this.props.data.browserBlock} /> 
                                </div> 
                                <div className = "col-9" >
                                    <input type="tel" name="birth_year" value={this.state.birth_year} onChange={this.handleChange.bind(this,'birth_year')} className="form-control rounded-0 p-0 shadow-none outline-no textindent mobile-input" placeholder="YYYY" maxLength="4" disabled={this.props.data.browserBlock} /> 
                                </div> 
                            </div> 
                        </div> 
                        <div className = "form-group mobile-submit mt-5" >
                             <button type = "button" className = "btn rounded-0 p-0 login-submit" id="login" onClick={this.signOn} disabled={this.button.disabled}>Sign In</button>
                        </div>
                    </form>
                    {!this.props.data.isInApp ?(<button type="button" className="mobile-form-toggle mt-1 btn cancel-btn row" onClick={() => this.props.data.emit({isTemp: false})} >
                        {/* <span className="video-icon mr-2"></span>
                        <span className="toggle-text" >Cancel </span> */}
                        Cancel
                    </button>) : ('')}
                    
                </div> 
            </div>
        );
    }
}

export default withRouter(TempAccess);