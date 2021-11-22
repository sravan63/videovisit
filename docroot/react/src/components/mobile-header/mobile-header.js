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
import Langtranslation from "../../components/lang-translation/lang-translation";
class MobileHeader extends React.Component {
    constructor(props) {
        super(props);
        this.loggedInUserName = '';
        this.promoContainer = React.createRef();
        this.scrollHandler =  this.scrollHandler.bind(this);
        this.state = { message: 'Testing',staticData:{}, chin:'中文',span:'Español', isMobile:false, hidePromotion: true, isInApp: false, showPromotion: false,mdoHelpUrl:'' };
    }

    componentDidMount() {
        var isMobile = Utilities.isMobileDevice();
        var isInAppAccess = Utilities.getInAppAccessFlag();
        var showPromotion = Utilities.getPromotionFlag();
        if (isMobile & !isInAppAccess && showPromotion) { 
            this.setState({ isMobile: true, hidePromotion: false, isInApp: false, showPromotion: true });
            setTimeout(() => {
                MessageService.sendMessage(GlobalConfig.TOGGLE_MOBILE_FOOTER, false);    
            }, 0);
            
        } else {
            this.setState({ isMobile: isMobile, isInApp: isInAppAccess, showPromotion: showPromotion });
        }

        window.addEventListener('scroll', this.scrollHandler, false);
        this.getBrowserBlockInfo();
        if (localStorage.getItem('LoginUserDetails')) {
            const data = JSON.parse(Utilities.decrypt(localStorage.getItem('LoginUserDetails')));
            this.state.userDetails = data;
            //const data = this.props.userDetails.userDetails;
            this.setState({
                name: data.lastName.toLowerCase() + ', ' + data.firstName.toLowerCase()
            });
        }
        this.getLanguage();
        this.subscription = MessageService.getMessage().subscribe((message) => {
            if(message.text==GlobalConfig.LANGUAGE_CHANGED){
                this.getLanguage();
            }
        });
    }

    componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        // this.subscription.unsubscribe();        
        window.removeEventListener('scroll', this.scrollHandler, false);
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
    getLanguage(){
        let data = Utilities.getLang();
        if(data.lang=='spanish'){
            this.setState({span:'English',chin: '中文',staticData: data});
        }
        else if(data.lang=='chinese'){
            this.setState({chin:'English',span:'Español',staticData: data});
        }
        else {
            this.setState({span: "Español", chin: '中文',staticData: data});
        }

    }
    changeLang(event){
        let value = event.target.textContent;
        if(value=="中文"){
            sessionStorage.setItem('Instant-Lang-selection','chinese');
            Utilities.setLang('chinese');
        }
        else if(value=="Español"){
            sessionStorage.setItem('Instant-Lang-selection','spanish');
            Utilities.setLang('spanish');
         }
        else{
            sessionStorage.setItem('Instant-Lang-selection','english');
            Utilities.setLang('english');
        }
    }
    scrollHandler(){
        if(this.promoContainer.current && this.state.showPromotion) {
            var mHeader = document.getElementsByClassName('header-controls')[0];
            if(!this.state.hidePromotion && window.scrollY >= 250) {
                this.setState({ hidePromotion: true });
                MessageService.sendMessage(GlobalConfig.TOGGLE_MOBILE_FOOTER, true);
                // Re-positions the page to the top.
                setTimeout(()=>{ 
                    window.scrollTo(0, 20); 
                }, 200);
            } else if(this.state.hidePromotion && window.scrollY <= 0) {
                this.setState({ hidePromotion: false });
                MessageService.sendMessage(GlobalConfig.TOGGLE_MOBILE_FOOTER, false);
            }
        }

    } 
    getBadgeVersion(OSName){
        let data = Utilities.getLang(); 
        switch(data.lang){
            case "spanish":
                return OSName + "-spanish icon";
                break;
            case "chinese":
                return OSName + "-chinese icon";
                break;
            default:
                return OSName + "-english icon";
                break;    

        }
    }
    signOff() {
        Utilities.setPromotionFlag(false);
        MessageService.sendMessage(GlobalConfig.LOGOUT, null);
    }

    render() {
        let Details = this.state.staticData;
        return (
            <div>
                { !this.state.isInApp ? (<div className={this.state.hidePromotion ? "mobile-header fix-to-top" : "mobile-header"}>
                    { this.state.isMobile ? 
                    (<div>
                        <div className={this.state.hidePromotion ? "header-controls" : "header-controls"}>
                               
                               <a className="text-capitalize user-name sign-off">{this.state.name ? this.state.name : ''}</a><br/>
                               <div className="float-right">
                                   <a href = {this.state.staticData.HelpLink} className="pr-2" target = "_blank">{this.state.staticData.Help}</a>|
                                   <a className="sign-off pl-2" onClick = {this.signOff}> {this.props.data.Signout}</a>
                               </div>    
                               <Langtranslation />                    
                           </div>
                        <div className={this.state.hidePromotion ? "promotion-container hide-promotion" : "promotion-container show-promotion"} ref={this.promoContainer}>
                        <div className="promotion">
                            <div className="banner"><div className="image-holder"></div></div>
                            <div className="message-container">
                                <div className="wrapper">
                                    <div className="message">{Details.my_visits.MobileAppLabelTxt}</div>
                                    <div className="badgets">
                                        <div className={this.getBadgeVersion('ios')}><a className="icon-link" href="https://itunes.apple.com/us/app/my-doctor-online-ncal-only/id497468339?mt=8" target="_blank"></a></div>
                                        <div className={this.getBadgeVersion('android')}><a className="icon-link" href="https://play.google.com/store/apps/details?id=org.kp.tpmg.preventivecare&amp;hl=en_US" target="_blank"></a></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div></div>) : (<div className={this.state.hidePromotion ? "header-controls" : "header-controls"}>
                               
                               <a className="text-capitalize user-name sign-off">{this.state.name ? this.state.name : ''}</a><br/>
                               <div className="float-right">
                                   <a href = {this.state.staticData.HelpLink} className="pr-2" target = "_blank">{this.state.staticData.Help}</a>|
                                   <a className="sign-off pl-2" onClick = {this.signOff}> {this.props.data.Signout}</a>
                               </div>    
                               <Langtranslation />                   
                           </div>) }
                    
                </div>) :('') }
            </div>
        );
    }
}

export default MobileHeader;