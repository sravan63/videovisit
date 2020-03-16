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

class MobileHeader extends React.Component {
    constructor(props) {
        super(props);
        this.loggedInUserName = '';
        this.promoContainer = React.createRef();
        this.state = { message: 'Testing', isMobile:false, hidePromotion: true, isInApp: false };
    }

    componentDidMount() {
        var isMobile = Utilities.isMobileDevice();
        var isInAppAccess = Utilities.getInAppAccessFlag();
        if (isMobile & !isInAppAccess) {
            this.setState({ isMobile: true, hidePromotion: false, isInApp: false });
        } else if(isMobile) {
            this.setState({ isMobile: true, isInApp: true });
        }

        window.addEventListener('scroll', this.scrollHandler.bind(this));

    }

    componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
    }

    scrollHandler(){
        if(this.promoContainer.current) {
            var mHeader = document.getElementsByClassName('header-controls')[0];
            if(!this.state.hidePromotion && window.scrollY >= mHeader.offsetTop) {
                this.setState({ hidePromotion: true });
            } else if(this.state.hidePromotion && window.scrollY <= 0){
                this.setState({ hidePromotion: false });
            }
        }

    } 

    signOff() {
        MessageService.sendMessage(GlobalConfig.LOGOUT, null);
    }

    render() {
        return (
            <div>
                { !this.state.isInApp ? (<div className={this.state.hidePromotion ? "mobile-header fix-to-top" : "mobile-header"}>
                    { this.state.isMobile ? 
                    (<div className={this.state.hidePromotion ? "promotion-container hide-promotion" : "promotion-container show-promotion"} ref={this.promoContainer}>
                        <div className="promotion">Banner Here</div>
                    </div>) : ('') }
                    <div className={this.state.hidePromotion ? "header-controls" : "header-controls"}>
                        < a href = "https://mydoctor.kaiserpermanente.org/ncal/videovisit/#/faq/mobile" className = "helpMobile" target = "_blank" >Help</a>
                        <a className="sign-off" onClick = {this.signOff}>Sign Out</a>
                    </div>
                </div>) :('') }
            </div>
        );
    }
}

export default MobileHeader;