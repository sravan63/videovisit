import React from 'react';
import Header from '../../components/header/header';
import Sidebar from '../../components/sidebar/sidebar';
import Footer from '../../components/footer/footer';
import Ssologin from '../../components/ssologin/ssologin';
import Login from '../../components/tempaccess/tempaccess';
import './authentication.less';

class Authentication extends React.Component {
    constructor(props) {
        super(props);
        localStorage.clear();
        this.tempAccessToken = false;
        this.state = { tempAccessToken: false, isMobileError: false, isInApp: false };
    }

    emitFromChild(obj) {
        if(obj.hasOwnProperty('isTemp')){
            this.setState({tempAccessToken:obj.isTemp});
            this.setState({isMobileError:false});
        }
        if(obj.hasOwnProperty('isMobileError')){
            this.setState({isMobileError:obj.isMobileError});
        }
    }

    componentDidMount(){
        this.validateInAppAccess();
    }

    validateInAppAccess(){
        var urlStr = window.location.href;
        var url = new URL(urlStr);
        if((url.search !== '' || url.href.indexOf('?') > -1) && this.state.tempAccessToken == false){
            // VIA IN APP BROWSER
            this.setState({isInApp:true});
        }

    }

    render() {
        return (
            <div id='container' className="authentication-page">
             <Header/>            
             <Sidebar/> 
             <div className="main-content">
                {this.state.isMobileError ? 
                    (<div className="row error-text">
                        {this.state.tempAccessToken ? 
                            (<p className="col-12">Incorrect patient information</p>) 
                           :(<p className="col-12">Invalid User ID / Password</p>)
                        }
                    </div>)
                : ('')}

                {!this.state.isInApp ?(
                    <div className="row">
                        <div className="col-12 text-right help-icon p-0">
                            <small><a href="https://mydoctor.kaiserpermanente.org/ncal/videovisit/#/faq/mobile" target="_blank">Help</a></small>
                        </div>
                    </div>)
                :('')}
                {!this.state.isInApp ?(<div className="row mobile-logo-container"><div className="col-12 mobile-tpmg-logo"></div><p className="col-12 header">Video Visits</p></div>) :('')}
                                 
                {this.state.tempAccessToken || this.state.isInApp ? (
                    <Login data={{tempAccessToken:this.state.tempAccessToken,emit:this.emitFromChild.bind(this), isInApp: this.state.isInApp}}/>
                ) : (
                    <Ssologin history={this.props.history} data={{tempAccessToken:this.state.tempAccessToken,emit:this.emitFromChild.bind(this)}}/>
                )}
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