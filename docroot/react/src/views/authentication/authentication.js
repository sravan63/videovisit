import React from 'react';
import Header from '../../components/header/header';
import Sidebar from '../../components/sidebar/sidebar';
import Footer from '../../components/footer/footer';
import Ssologin from '../../components/ssologin/ssologin';
import Login from '../../components/tempaccess/tempaccess';
import Loader from '../../components/loader/loader';
import './authentication.less';

class Authentication extends React.Component {
    constructor(props) {
        super(props);
        localStorage.clear();
        this.tempAccessToken = false;
        this.state = { tempAccessToken: false, isMobileError: false, isInApp: false, showLoader: false };
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
                        <small><a href="https://mydoctor.kaiserpermanente.org/ncal/videovisit/#/faq/mobile" className="help-link" target="_blank">Help</a></small>
                    </div>
                </div>
                {!this.state.isInApp ?(<div className="row mobile-logo-container"><div className="col-12 mobile-tpmg-logo"></div><p className="col-12 header">Video Visits</p></div>) :('')}
                                 
                {this.state.tempAccessToken || this.state.isInApp ? (
                    <Login data={{tempAccessToken:this.state.tempAccessToken,showLoader:this.state.showLoader,emit:this.emitFromChild.bind(this), isInApp: this.state.isInApp}}/>
                ) : (
                    <Ssologin history={this.props.history} data={{tempAccessToken:this.state.tempAccessToken,showLoader:this.state.showLoader,emit:this.emitFromChild.bind(this)}}/>
                )}
                <div className="row mobile-footer mt-5">
                    <p className="col-12">If You're a Patient's Guest</p>
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