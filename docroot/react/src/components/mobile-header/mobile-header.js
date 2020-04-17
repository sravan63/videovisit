import React from 'react';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './mobile-header.less';
import * as WebUI from '../../pexip/complex/webui.js';
import { range } from 'rxjs';
import { MessageService } from '../../services/message-service.js'
import GlobalConfig from '../../services/global.config';
import Utilities from '../../services/utilities-service.js';
import BackendService from '../../services/backendService.js';

class MobileHeader extends React.Component {
    constructor(props) {
        super(props);
        this.loggedInUserName = '';
        this.promoContainer = React.createRef();
        this.state = { message: 'Testing', isMobile:false, hidePromotion: true, isInApp: false, showPromotion: false,mdoHelpUrl:'' };
    }

    componentDidMount() {
        var isMobile = Utilities.isMobileDevice();
        var isInAppAccess = Utilities.getInAppAccessFlag();
        var showPromotion = Utilities.getPromotionFlag();
        if (isMobile & !isInAppAccess && showPromotion) { 
            this.setState({ isMobile: true, hidePromotion: false, isInApp: false, showPromotion: true });
        } else {
            this.setState({ isMobile: isMobile, isInApp: isInAppAccess, showPromotion: showPromotion });
        }

        window.addEventListener('scroll', this.scrollHandler.bind(this));
        this.getBrowserBlockInfo();
    }

    componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        // this.subscription.unsubscribe();
        window.removeEventListener('scroll', this.scrollHandler.bind(this), false);
    }
    
    getBrowserBlockInfo(){
        var propertyName = 'browser',
            url = "loadPropertiesByName.json",
            browserNames = '';
        BackendService.getBrowserBlockDetails(url, propertyName).subscribe((response) => {
            if (response.data && response.status == '200') {
                 browserNames = response.data; 
                 this.setState({ mdoHelpUrl: response.data.mdoHelpUrl });
            } else {
                // Do nothing
            }
        }, (err) => {
            console.log("Error");
        });
    }
    scrollHandler(){
        if(this.promoContainer.current && this.state.showPromotion) {
            var mHeader = document.getElementsByClassName('header-controls')[0];
            if(!this.state.hidePromotion && window.scrollY >= mHeader.offsetTop) {
                this.setState({ hidePromotion: true });
                // Re-positions the page to the top.
                setTimeout(()=>{ 
                    window.scrollTo(0, 20); 
                }, 200);
            } else if(this.state.hidePromotion && window.scrollY <= 0) {
                this.setState({ hidePromotion: false });
            }
        }

    } 

    signOff() {
        Utilities.setPromotionFlag(false);
        MessageService.sendMessage(GlobalConfig.LOGOUT, null);
    }

    render() {
        return (
            <div>
                { !this.state.isInApp ? (<div className={this.state.hidePromotion ? "mobile-header fix-to-top" : "mobile-header"}>
                    { this.state.isMobile ? 
                    (<div className={this.state.hidePromotion ? "promotion-container hide-promotion" : "promotion-container show-promotion"} ref={this.promoContainer}>
                        <div className="promotion">
                            <div className="banner"><div className="image-holder"></div></div>
                            <div className="message-container">
                                <div className="wrapper">
                                    <div className="message">Next time you want to see your doctor, try a video visit from our My Doctor Online mobile app.</div>
                                    <div className="badgets">
                                        <div className="ios icon"><a className="icon-link" href="https://itunes.apple.com/us/app/my-doctor-online-ncal-only/id497468339?mt=8" target="_blank"></a></div>
                                        <div className="android icon"><a className="icon-link" href="https://play.google.com/store/apps/details?id=org.kp.tpmg.preventivecare&amp;hl=en_US" target="_blank"></a></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>) : ('') }
                    <div className={this.state.hidePromotion ? "header-controls" : "header-controls"}>
                        < a href = {this.state.mdoHelpUrl} className = "helpMobile" target = "_blank" >Help</a>
                        <a className="sign-off" onClick = {this.signOff}>Sign Out</a>
                    </div>
                </div>) :('') }
            </div>
        );
    }
}

export default MobileHeader;