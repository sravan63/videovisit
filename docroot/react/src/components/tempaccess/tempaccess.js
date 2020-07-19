import React from 'react';
import '../../views/authentication/authentication.less';
import BackendService from '../../services/backendService.js';
import GlobalConfig from '../../services/global.config';
import { Route, withRouter } from 'react-router-dom';
import UtilityService from '../../services/utilities-service.js';
import BrowserBlock from '../../components/browser-block/browser-block';

class TempAccess extends React.Component {
    constructor(props) {
        super(props);
        localStorage.clear();
        this.state = { isInApp: false, lastname: '', mrn: '', birth_month: '', birth_year: '', errormsgs: { errorlogin: false, errormsg: '' },isbrowserBlockDisplay : false };
        this.button = { disabled: true }
        this.signOn = this.signOn.bind(this);
    }

    componentDidMount() {
        this.setState({isInApp : this.props.data.isInApp});
        this.setScreenOrientation();
        window.addEventListener('orientationchange', this.setScreenOrientation.bind(this));
        var inAppAccess = UtilityService.getInAppAccessFlag();
        if(!inAppAccess){
            this.getBrowserBlockInfo();
        }
        this.setState({ isbrowserBlockDisplay: window.innerWidth > 961 });
    }
    getBrowserBlockInfo(){
        var propertyName = 'browser',
            url = "loadPropertiesByName.json",
            browserNames = '';
        BackendService.getBrowserBlockDetails(url, propertyName).subscribe((response) => {
            if (response.data && response.status == '200') {
                 browserNames = response.data;
                 this.setState({ mdoHelpUrl: response.data.mdoHelpUrl });
                 sessionStorage.setItem('helpUrl',response.data.mdoHelpUrl);
                 sessionStorage.setItem('keepAlive',response.data.KEEP_ALIVE_URL);
                 if(UtilityService.validateBrowserBlock(browserNames)){
                    this.setState({ isBrowserBlockError: true });
                 }
            } else {
                // Do nothing
            }
        }, (err) => {
            console.log("Error");
        });

    }
    setScreenOrientation(){
        //var isLandscape = window.matchMedia("(orientation:landscape)").matches;
        if(window.orientation == 0) {  
            this.setState({  screenOrientation: 'portrait' });
        } else {  
            this.setState({  screenOrientation: 'landscape' });
        }
        setTimeout(() => {
            if(window.innerWidth > 961){
                this.setState({ isbrowserBlockDisplay: true });
            }else{
                this.setState({ isbrowserBlockDisplay: false });
            }    
        }, 0);
    }
    signOn(e) {
        e.preventDefault();
        localStorage.clear();
        var mrn = this.state.mrn;
        var month = this.state.birth_month;
        if (mrn.length > 0)
        {
            if (mrn.length < 8)
            {
                while (mrn.length < 8)
                {
                    mrn = '0' + mrn;
                }
                this.state.mrn = mrn;
            }
        }
        if (month.length < 2 )
        {
            while(month.length < 2 )
            {
                month = '0' + month;
            }
            this.state.birth_month = month;
        }
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
                let helpLinkUrl = sessionStorage.getItem('helpUrl'),
                    keepAliveUrl = sessionStorage.getItem('keepAlive');
                localStorage.setItem('helpUrl',helpLinkUrl);
                localStorage.setItem('keepAlive',keepAliveUrl);
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
                window.scrollTo(0, 0);
            }
        }, (err) => {
            this.setState({
                errormsgs: { errorlogin: true, errormsg: "We could not find this patient. Please try entering the information again." }
            });
            this.props.data.emit({ isMobileError: true });
            this.props.data.emit({ showLoader: false });
            window.scrollTo(0, 0);
        });
    }
    
    handleChange(key, event) {
        event.preventDefault();
        const { name, value } = event.target;
        switch (name) {
            case 'lastname':
                const lname_regex = event.target.value.replace(/[^A-Za-z '‘’-]/g, "");    
                this.lastname = lname_regex;
                this.setState({
                    [name]: this.lastname
                });
                this.state.lastname = this.lastname;
                break;
            case 'mrn':
                const mrn_regex = event.target.value.replace(/[^0-9]/g, "");
                this.mrn = mrn_regex;
                this.setState({
                    [name]: this.mrn
                });
                this.state.mrn = this.mrn;
                break;
            case 'birth_month':
                const birth_month_regex = event.target.value.replace(/[^0-9]/g, "");
                this.birth_month = birth_month_regex;
                this.setState({
                    [name]: this.birth_month
                });
                this.state.birth_month = this.birth_month;
                break;
            case 'birth_year':
                const birth_year_regex = event.target.value.replace(/[^0-9]/g, "");
                this.birth_year = birth_year_regex;
                this.setState({
                    [name]: this.birth_year
                });
                this.state.birth_year = this.birth_year;
                break;
            default:
                break;
        }
        
        if ("" != event.target.value) {
            if (this.state.lastname.trim() != "" && this.state.mrn.trim() != "" && this.state.birth_month.trim() != "" && this.state.birth_year.trim() != "") {
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
                {this.state.isbrowserBlockDisplay ?  (    
                    <BrowserBlock browserblockinfo = {this.state} />    
                 ) : ('')}
                <div className={this.state.screenOrientation == 'portrait' ? "row temp-form width-p-auto" : "row temp-form width-l-fit"}> 
                    {!this.state.isInApp ?(<div className="row mobile-logo-container">
                        <div className="title">
                            <p className="col-12 p-0 m-0 header">Kaiser Permanente</p>
                            <p className="col-12 p-0 sub-header">Video Visits</p>
                        </div>
                    </div>) :
                    ('')}
                    {!this.state.isbrowserBlockDisplay ?  (    
                        <BrowserBlock browserblockinfo = {this.state} />    
                    ) : ('')}
                    <form className="col-xs-12 col-md-12 login-form" onSubmit={this.signOn} noValidate>
                        <p className="col-12 sub-text font-weight-bold">Patient's Information</p>
                        <div className="form-group">
                            <label className="col-sm-12 text-uppercase">Last Name</label>
                            <div className="col-sm-12">
                                <input type="text" pattern="[a-zA-Z]+" name="lastname" value={this.state.lastname} onChange={this.handleChange.bind(this,'lastname')} className="form-control rounded-0 p-0 shadow-none outline-no textindent mobile-input" placeholder="i.e. Smith" disabled={this.props.data.browserBlock}/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-12 text-uppercase">Medical Record Number</label>
                            <div className="col-sm-12">
                                <input type="tel" name="mrn" value={this.state.mrn} onChange={this.handleChange.bind(this,'mrn')} className="form-control rounded-0 p-0 shadow-none outline-no textindent mobile-input" placeholder="######" maxLength="8" disabled={this.props.data.browserBlock} />
                            </div>
                        </div>
                        <div className="form-group col">
                            <label className="col-12 p-0 text-uppercase">Date of Birth</label>
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
                             <button type = "submit" className = "btn rounded-0 p-0 login-submit" id="login"  disabled={this.button.disabled}>Sign In</button>
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