import React, { Suspense, lazy } from 'react';
import Header from '../../components/header/header';
import Sidebar from '../../components/sidebar/sidebar';
import Footer from '../../components/footer/footer';
import Loader from '../../components/loader/loader';
import './authentication.less';
import BackendService from '../../services/backendService.js';
import Utilities from '../../services/utilities-service.js';
import BrowserBlock from '../../components/browser-block/browser-block';

const Ssologin = React.lazy(() => import('../../components/ssologin/ssologin'));
const Login = React.lazy(() => import('../../components/tempaccess/tempaccess'));

class Authentication extends React.Component {
    constructor(props) {
        super(props);
        localStorage.clear();
        this.tempAccessToken = false;
        this.state = { tempAccessToken: false, isMobileError: false, isInApp: false, showLoader: false,propertyName:'',isBrowserBlockError:false, isMobile: false,mdoHelpUrl:'' };
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
        var inAppAccess = Utilities.getInAppAccessFlag();
        if(!inAppAccess){
            this.getBrowserBlockInfo();
        }
    }
    getBrowserBlockInfo(){
        var propertyName = 'browser',
            url = "loadPropertiesByName.json",
            browserNames = '';
        BackendService.getBrowserBlockDetails(url, propertyName).subscribe((response) => {
            if (response.data && response.status == '200') {
                 browserNames = response.data;
                 this.setState({ mdoHelpUrl: response.data.mdoHelpUrl });
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
        if ((url.search !== '' || url.href.indexOf('isAndroidSDK') > -1) && this.state.tempAccessToken == false) {
            // VIA IN APP BROWSER
            this.setState({ isInApp: true });
            Utilities.setInAppAccessFlag(true);
            const params = window.location.href.split('?')[1];
            const urlParams = new URLSearchParams( params );
            var isSDK = decodeURIComponent(urlParams.get('isAndroidSDK'));
            sessionStorage.setItem('isAndroidSDK', isSDK);
        }
        else if( Utilities.getInAppAccessFlag() ) {
            this.setState({ isInApp: true });
        }
    }

    render() {
        return (
            <div id='container' className="authentication-page">
            {this.state.showLoader ? (<Loader />):('')}
             <Header helpUrl = {this.state.mdoHelpUrl}/>
             <div className={this.state.isInApp && window.window.innerWidth >= 1024 ? "main-content occupy-space" : "main-content"}>
                {this.state.isMobileError ? 
                    (<div className="row error-text">
                        {this.state.tempAccessToken || this.state.isInApp ? 
                            (<p className="col-sm-12">Incorrect patient information</p>) 
                           :(<p className="col-sm-12">Invalid User ID / Password</p>)
                        }
                    </div>)
                : ('')}
                {!this.state.isInApp ? (
                <div className="row help-link-container">
                    <div className="col-12 text-right help-icon p-0">
                        <a href={this.state.mdoHelpUrl} className="help-link" target="_blank">Help</a>
                    </div>
                </div>):('')}
                <BrowserBlock browserblockinfo = {this.state}/>
                <div>
                    <Suspense fallback={<Loader />}>
                        {this.state.tempAccessToken || this.state.isInApp ? (
                            <Login data={{tempAccessToken:this.state.tempAccessToken,showLoader:this.state.showLoader,emit:this.emitFromChild.bind(this), isInApp: this.state.isInApp,browserBlock:this.state.isBrowserBlockError}}/>
                        ) : (
                            <Ssologin history={this.props.history} data={{tempAccessToken:this.state.tempAccessToken,showLoader:this.state.showLoader, isInApp: this.state.isInApp, emit:this.emitFromChild.bind(this),browserBlock:this.state.isBrowserBlockError}}/>
                        )}
                    </Suspense>
                </div>
                <div className="row mobile-footer mt-5" style={{display: this.state.isInApp ? 'block' : 'auto', margin: this.state.isInApp && window.window.innerWidth >= 1024 ? '0' : ''}}>
                    <p className="col-12 font-weight-bold">If You're a Patient's Guest</p>
                    <p className="col-12 secondary">Guests of patients with a video visit, click the link in your email invitation.</p>
                </div>
            </div> 
            {!this.state.isInApp ?(<div className="form-footer">
                <Footer />
            </div>) : ('')}
         </div>
        );
    }
}

export default Authentication;