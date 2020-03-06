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
        this.validateInAppAccess();
        this.getBrowserBlockInfo();
    }
    getBrowserBlockInfo(){
        var propertyName = 'browser',
            url = "loadPropertiesByName.json",
            browserNames = '';
        BackendService.getBrowserBlockDetails(url, propertyName).subscribe((response) => {
            if (response.data && response.status == '200') {
                 browserNames = response.data;                 
                 this.browserBlockCheckVersions(browserNames);
            } else {
                // Do nothing
            }
        }, (err) => {
            console.log("Error");
        });

    }
    browserBlockCheckVersions(browserNames){
        var browserInfo = Utilities.getBrowserInformation();
        let blockIE = (browserNames.BLOCK_IE_BROWSER == 'true');
        let blockChrome = (browserNames.BLOCK_CHROME_BROWSER == 'true');
        let blockFF = (browserNames.BLOCK_FIREFOX_BROWSER == 'true');
        let blockSafari = (browserNames.BLOCK_SAFARI_BROWSER == 'true');
        let blockEdge  = (browserNames.BLOCK_EDGE_BROWSER == 'true');
        let blockChromeVersion = browserNames.BLOCK_CHROME_VERSION;
        let blockFirefoxVersion  = browserNames.BLOCK_FIREFOX_VERSION;
        let blockEdgeVersion  = browserNames.BLOCK_EDGE_VERSION;
        let blockSafariVersion  = browserNames.BLOCK_SAFARI_VERSION;
        var isMobile = Utilities.isMobileDevice();
        if (isMobile) {
            this.setState({ isMobile: true });
        }
        console.log(this.state.isMobile);
        if (browserInfo.isIE && blockIE) {
            this.setState({ isBrowserBlockError: true });
            return;            
        }
        if (browserInfo.isChrome) {
            if (blockChrome) {
                this.setState({ isBrowserBlockError: true });
            } else {                
                var chrome_ver = Number(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
                if (chrome_ver < blockChromeVersion) {
                    this.setState({ isBrowserBlockError: true });
                }
            }
        }
        if (browserInfo.isFirefox) {
            if (blockFF) {
                this.setState({ isBrowserBlockError: true });
            } else {
                var firefox_ver = Number(window.navigator.userAgent.match(/Firefox\/(\d+)\./)[1], 10);
                if (firefox_ver < blockFirefoxVersion) {
                    this.setState({ isBrowserBlockError: true });
                }
            }
        }

        if (browserInfo.isSafari) {
            if (blockSafari) {
                this.setState({ isBrowserBlockError: true });
            } else {
                var majorMinorDot = navigator.userAgent.substring(agent.indexOf('Version/') + 8, agent.lastIndexOf('Safari')).trim();                
                var versionNumber = parseFloat(majorMinorDot);
                // Block access from Safari version 12.                
                if (versionNumber < blockSafariVersion) {
                    this.setState({ isBrowserBlockError: true });
                }
            }
        }
        
        if (browserInfo.isEdge) {
            if (blockEdge) {
                this.setState({ isBrowserBlockError: true });
            } else {
                var val = navigator.userAgent.split('Edge/');
                var edge_ver = val[1].slice(0, 2);
                //var edge_ver = Number(window.navigator.userAgent.match(/Edge\/\d+\.(\d+)/)[1], 10);
                if (edge_ver < blockEdgeVersion) {
                    this.setState({ isBrowserBlockError: true });
                }
            }
        }
    
    
    
    }
    validateInAppAccess() {
        var urlStr = window.location.href;
        var url = new URL(urlStr);
        if ((url.search !== '' || url.href.indexOf('?') > -1) && this.state.tempAccessToken == false) {
            // VIA IN APP BROWSER
            this.setState({ isInApp: true });
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
                <div className="container browser-block-container pb-4" style={{display: this.state.isBrowserBlockError ? 'block' : 'none'}}>
                    <div className="row browser-block-header">
                        <div className="mt-2 ml-3 p-0  warning-icon"></div>
                        <div className="warning-text">Video Visits does not support your browser.</div>
                    </div>
                    <div className="row browser-block-content ml-0 mt-4">
                        <div className="col-lg-1 col-md-2 col-sm-3 float-left mt-3 mdo-logo"></div>
                            <div className="col-lg-4 col-md-6 special-message col-sm-8 ml-2">
                                <b>Join on your mobile device using the My Doctor Online app, or try a
                                        different browser.</b>
                            </div>
                            <div className="col-lg-6 col-md-10 app-store-container">
                                <span className="ios-appstore mt-2 ml-1"><a className="icon-link" href="https://itunes.apple.com/us/app/my-doctor-online-ncal-only/id497468339?mt=8" target="_blank"></a></span>
                                <span className="android-playstore mt-2"><a className="icon-link" href="https://play.google.com/store/apps/details?id=org.kp.tpmg.preventivecare&amp;hl=en_US" target="_blank"></a></span>
		                    </div>
                    </div>
                </div>                
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