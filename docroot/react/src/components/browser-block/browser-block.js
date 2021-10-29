import React from 'react';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './browser-block.less';
import { range } from 'rxjs';
import { MessageService } from '../../services/message-service.js';
import GlobalConfig from '../../services/global.config';
import Utilities from '../../services/utilities-service.js';

class BrowserBlock extends React.Component {
    constructor(props) {
        super(props);    
        this.state = { isIOS:false,isMobile:false, isSafariBlocked:false };
    }

    componentDidMount() {
        let os = Utilities.getAppOS();
        let isIOS = os == 'iOS' ? true : false;
        let isSafari15_1 = Utilities.getSafariBlocked();
        if( Utilities.isMobileDevice()){
            this.setState({isIOS:isIOS,isMobile:true,isSafariBlocked:isSafari15_1});
        }
    } 



    componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        //this.subscription.unsubscribe();
    }
    render() {
        return (
            <div className="container browser-block-container pb-4" style={{display: this.props.browserblockinfo.isBrowserBlockError ? 'block' : 'none'}}>
                    <div className="row browser-block-header">
                        <div className="mt-2 ml-3 p-0  warning-icon"></div>
                        <div className="warning-text">Video Visits does not support your browser.</div>
                    </div>
                    <div className="row browser-block-content ml-0 mt-4">
                        <div className={this.state.isSafariBlocked ? "col-lg-1 col-md-2 col-sm-3 float-left mdo-logo" : 'col-lg-1 col-md-2 col-sm-3 float-left mt-3 mdo-logo'} ></div>
                            <div className="col-lg-5 col-md-6 special-message col-sm-8">
                                {this.state.isMobile ?
                                    this.state.isSafariBlocked ? (<b>Join using My Doctor Online app.</b>) : this.state.isIOS ? (<b>Join using Safari browser or the My Doctor Online app.</b>):(<b>Join using Chrome browser or the My Doctor Online app.</b>):
                                        (<b>Join on your mobile device using the My Doctor Online app, or try a
                                            different browser.</b>)}
                            </div>
                            <div className="col-lg-6 col-md-10 pl-0 app-store-container">
                                <span className="ios-appstore mt-2 ml-1"><a className="icon-link" href="https://itunes.apple.com/us/app/my-doctor-online-ncal-only/id497468339?mt=8" target="_blank"></a></span>
                                <span style={{display: !this.state.isSafariBlocked ? 'block' : 'none'}} className="android-playstore mt-2"><a className="icon-link" href="https://play.google.com/store/apps/details?id=org.kp.tpmg.preventivecare&amp;hl=en_US" target="_blank"></a></span>
		                    </div>
                    </div>
                </div>
        );
    }
}

export default BrowserBlock;
