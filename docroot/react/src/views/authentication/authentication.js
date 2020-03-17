import React from 'react';
import Header from '../../components/header/header';
import Sidebar from '../../components/sidebar/sidebar';
import Footer from '../../components/footer/footer';
import Ssologin from '../../components/ssologin/ssologin';
import Login from '../../components/tempaccess/tempaccess';
import Loader from '../../components/loader/loader';
import './authentication.less';
import BackendService from '../../services/backendService.js';
import Utilities from '../../services/utilities-service.js';
import BrowserBlock from '../../components/browser-block/browser-block';

class Authentication extends React.Component {
    constructor(props) {
        super(props);
        localStorage.clear();
        this.tempAccessToken = false;
        this.state = { tempAccessToken: false, isMobileError: false, isInApp: false, showLoader: false,propertyName:'',isBrowserBlockError:false, isMobile: false };
    }

    emitFromChild(obj) {
        if (obj.hasOwnProperty('isTemp')) {
            this.setState({ tempAccessToken: obj.isTemp });
            this.setState({ isMobileError: false });
        }
        if (obj.hasOwnProperty('isMobileError')) {
            this.setState({ isMobileError: obj.isMobileError });
        }
        if (obj.hasOwnProperty('showLoader')) {
            this.setState({ showLoader: obj.showLoader });
        }
    }

    componentDidMount() {
        var browserInfo = Utilities.getBrowserInformation();
        if(!browserInfo.isIE){
            this.validateInAppAccess();
        }
        this.getBrowserBlockInfo();
    }
    getBrowserBlockInfo(){
        var propertyName = 'browser',
            url = "loadPropertiesByName.json",
            browserNames = '';
        BackendService.getBrowserBlockDetails(url, propertyName).subscribe((response) => {
            if (response.data && response.status == '200') {
                 browserNames = response.data;
                 if(Utilities.validateBrowserBlock(browserNames)){
                    this.setState({ isBrowserBlockError: true });
                 }
            } else {
                // Do nothing
            }
        }, (err) => {
            console.log("Error");
        });

    }
    
    validateInAppAccess() {
        var urlStr = window.location.href;
        var url = new URL(urlStr);
        if ((url.search !== '' || url.href.indexOf('useragentType') > -1) && this.state.tempAccessToken == false) {
            // VIA IN APP BROWSER
            this.setState({ isInApp: true });
            Utilities.setInAppAccessFlag(true);
        }

    }

    render() {
        return (
            <div id='container' className="authentication-page">
            {this.state.showLoader ? (<Loader />):('')}
             <Header/>
             <div className="main-content">
                {this.state.isMobileError ? 
                    (<div className="row error-text">
                        {this.state.tempAccessToken || this.state.isInApp ? 
                            (<p className="col-sm-12">Incorrect patient information</p>) 
                           :(<p className="col-sm-12">Invalid User ID / Password</p>)
                        }
                    </div>)
                : ('')}
                <div className="row mobile-help-link">
                    <div className="col-12 text-right help-icon p-0">
                        <a href="https://mydoctor.kaiserpermanente.org/ncal/videovisit/#/faq/mobile" className="help-link" target="_blank">Help</a>
                    </div>
                </div>
                
                {!this.state.isInApp ?(<div className="row mobile-logo-container"><div className="col-12 mobile-tpmg-logo"></div><p className="col-12 header">Video Visits</p></div>) :('')}
                <BrowserBlock browserblockinfo = {this.state}/>             
                {this.state.tempAccessToken || this.state.isInApp ? (
                    <Login data={{tempAccessToken:this.state.tempAccessToken,showLoader:this.state.showLoader,emit:this.emitFromChild.bind(this), isInApp: this.state.isInApp,browserBlock:this.state.isBrowserBlockError}}/>
                ) : (
                    <Ssologin history={this.props.history} data={{tempAccessToken:this.state.tempAccessToken,showLoader:this.state.showLoader,emit:this.emitFromChild.bind(this),browserBlock:this.state.isBrowserBlockError}}/>
                )}
                <div className="row mobile-footer mt-5">
                    <p className="col-12 font-weight-bold">If You're a Patient's Guest</p>
                    <p className="col-12 secondary">Guests of patients with a video visit, click the link in your email invitation.</p>
                </div>
            </div> 
            <div className="form-footer">
                <Footer />
            </div>
         </div>
        );
    }
}

export default Authentication;