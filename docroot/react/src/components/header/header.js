import React from "react";
import BackendService from '../../services/backendService.js';
import { MessageService } from '../../services/message-service.js';
import UtilityService from '../../services/utilities-service.js';
import GlobalConfig from '../../services/global.config';
import KPLOGO from '../../components/kp-logo/kp-logo';
import Langtranslation from '../lang-translation/lang-translation';
import './header.less';

class header extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                name: '',
                isInApp: false,
                isSetup: false,
                userDetails: {},
                staticData:{}, chin:'中文',span:'Español'
            };
            this.signOffMethod = this.signOffMethod.bind(this);
        }
        componentDidMount() {              
            this.getLanguage();
            this.subscription = MessageService.getMessage().subscribe((message) => {
                if(message.text==GlobalConfig.LANGUAGE_CHANGED){
                    this.getLanguage();
                }
            });      
        }
        componentWillMount() {
            //if(this.props.userDetails && this.props.userDetails.userDetails){
            var url = window.location.href.toLowerCase().indexOf('setup') > -1;
            if(url){
                this.setState({isSetup:true});
            }    
            var isInAppAccess = UtilityService.getInAppAccessFlag(); 
            if(isInAppAccess){
                this.setState({isInApp: true});
            }  
            if (localStorage.getItem('LoginUserDetails')) {
                const data = JSON.parse(UtilityService.decrypt(localStorage.getItem('LoginUserDetails')));
                this.state.userDetails = data;
                //const data = this.props.userDetails.userDetails;
                this.setState({
                    name: data.lastName.toLowerCase() + ', ' + data.firstName.toLowerCase()
                });
            }
        }
        
        signOffMethod() {
            MessageService.sendMessage(GlobalConfig.LOGOUT, null);
        }

        getLanguage(){
            let data = UtilityService.getLang();
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
                UtilityService.setLang('chinese');
            }
            else if(value=="Español"){
                sessionStorage.setItem('Instant-Lang-selection','spanish');
                UtilityService.setLang('spanish');
             }
            else{
                sessionStorage.setItem('Instant-Lang-selection','english');
                UtilityService.setLang('english');
            }
        }

        render() {
                return (
                <div className = "container-fluid">
                    { !this.state.isInApp ? (
                        <div className = {!this.state.name || this.state.isSetup || window.location.href.indexOf('isInstantJoin') > -1 || window.location.href.indexOf('isECInstantJoin') > -1 ? "row header-content bmargin" : "row header-content"}>
                            <div className = "col-md-7 banner-content">
                                <div className = "logo"> 
                            </div> 
                            <div className = "title">
                                <p className = "m-0" >{this.props.data && this.props.data.videoVisits ? this.props.data.videoVisits: 'Video Visits' }</p>
                                <p className = "text-uppercase m-0 sub-title" >The Permanente Medical Group</p> 
                            </div> 
                        </div> 
                        <div className = "col-md-5 text-right user-details" >
                            { this.state.name && !this.state.isSetup && !(window.location.href.indexOf('isInstantJoin') > -1 || window.location.href.indexOf('isECInstantJoin') > -1 ) ? (<ul >
                                <li className = "text-capitalize user-name">{this.state.name ? this.state.name : ''}</li>
                                 <li className = "text-capitalize">{this.state.name ? '|' : ''} </li> 
                                 <li>
                                     <a href = {this.state.staticData.HelpLink} className = "help-link" target = "_blank" >{this.state.staticData.Help}</a>
                                </li>
                                <li> {this.state.name ? '|' : ''} </li> 
                                <li className = "text-capitalize"> 
                                    {this.state.name ? < a className = "sign-off" onClick = {this.signOffMethod}>{this.props.data.Signout}</a> :''}
                                </li>   
                                <li className="text-capitalize lang-trans">
                                <Langtranslation />
                                </li>                     
                            </ul> ) : (<KPLOGO />) }
                        </div>
                    </div>) : 
                    ('')}
                </div> );
            }
        }


        export default header;
