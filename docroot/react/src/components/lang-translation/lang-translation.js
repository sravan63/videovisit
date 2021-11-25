import React, { Suspense, lazy } from 'react';
import './lang-translation.less';
import Utilities from '../../services/utilities-service.js'
import GlobalConfig from '../../services/global.config';
import {MessageService} from "../../services/message-service";

class Langtranslation extends React.Component {
    constructor(props) {
        super(props);
        this.state = { staticData:{}, chin:'中文',span:'Español',isEmailTemplate: false};
    }

    componentDidMount() {
        sessionStorage.removeItem('Lang-type');
        this.getLanguage();
        this.subscription = MessageService.getMessage().subscribe((message) => {
            if( message.text == GlobalConfig.LANGUAGE_CHANGED ){
                this.getLanguage();
            }
        });      
    }  
    getLanguage(){
        let data = Utilities.getLang();
        if(data.lang == 'spanish'){
            this.setState({span:'English',chin: '中文',staticData: data});
        }
        else if(data.lang == 'chinese'){
            this.setState({chin:'English',span:'Español',staticData: data});
        }
        else {
            this.setState({span: "Español", chin: '中文',staticData: data});
        }
        
    }
    changeLang(event){
        let value = event.target.textContent;
        if(value=="中文" && !sessionStorage.getItem('Lang-type')){
            sessionStorage.setItem('Instant-Lang-selection','chinese');
            Utilities.setLang('chinese');
        }else if(value=="Español" && !sessionStorage.getItem('Lang-type')){
            sessionStorage.setItem('Instant-Lang-selection','spanish');
            Utilities.setLang('spanish');
        }else if(value=="English" && !sessionStorage.getItem('Lang-type')){
            sessionStorage.setItem('Instant-Lang-selection','english');
            Utilities.setLang('english'); 
        }else if(value=="中文" && sessionStorage.getItem('Lang-type')){
            Utilities.setLang('chinese');
        }else if(value=="Español" && sessionStorage.getItem('Lang-type')){
            Utilities.setLang('spanish');
        }else if(value=="English" && sessionStorage.getItem('Lang-type')){
            Utilities.setLang('english'); 
         }
    }
    
    render() {
        var Details = this.state.staticData;
        return (
             <div className="lang-change p-0">
                    <span className="divider" onClick={this.changeLang.bind(this)}>{this.state.chin}</span>
                    <span>|</span>
                    <span className="spanishlabel" onClick={this.changeLang.bind(this)}>{this.state.span}</span>
            </div>
        );
    }
}

export default Langtranslation;
