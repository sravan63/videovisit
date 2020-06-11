import React from "react";
import BackendService from '../../services/backendService.js';
import { MessageService } from '../../services/message-service.js';
import UtilityService from '../../services/utilities-service.js';
import GlobalConfig from '../../services/global.config';
import KPLOGO from '../../components/kp-logo/kp-logo';

import './header.less';

class header extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                name: '',
                isInApp: false,
                isLogin: false,
                userDetails: {}
            };
            this.signOffMethod = this.signOffMethod.bind(this);
        }
        componentWillMount() {
            //if(this.props.userDetails && this.props.userDetails.userDetails){
            var isInAppAccess = UtilityService.getInAppAccessFlag(); 
            if(isInAppAccess){
                var url = window.location.href.indexOf('login') > -1;
                this.setState({isInApp: true, isLogin:url});
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
            var isSetup = window.location.href.indexOf('setup') > -1;
            if(isSetup){
                MessageService.sendMessage(GlobalConfig.SETUPLOGOUT, null);
            }
            else{
                MessageService.sendMessage(GlobalConfig.LOGOUT, null);
            }

        }
        render() {
                return (
                <div className = "container-fluid">
                    { !this.state.isInApp ? (
                        <div className = {!this.state.name ? "row header-content bmargin" : "row header-content"}>
                            <div className = "col-md-7 banner-content">
                                <div className = "logo"> 
                            </div> 
                            <div className = "title">
                                <p className = "m-0" >Video Visits</p> 
                                <p className = "text-uppercase m-0 sub-title" >The Permanente Medical Group</p> 
                            </div> 
                        </div> 
                        <div className = "col-md-5 text-right user-details" >
                            { this.state.name ? (<ul >
                                <li className = "text-capitalize user-name" > 
                                {this.state.name ? this.state.name : ''} 
                                </li>
                                 <li className = "text-capitalize" > 
                                 {this.state.name ? '|' : ''} 
                                 </li> 
                                 <li > 
                                 <a href = {this.props.helpUrl}
                                className = "help-link"
                                target = "_blank" >Help</a>
                                </li>
                                <li> {this.state.name ? '|' : ''} </li> 
                                <li className = "text-capitalize"> 
                                    {this.state.name ? < a className = "sign-off" onClick = {this.signOffMethod}>Sign out</a> :''}
                                </li>                        
                            </ul> ) : (<KPLOGO />) }
                        </div>
                    </div>) : 
                    ('')}
                </div> );
            }
        }


        export default header;