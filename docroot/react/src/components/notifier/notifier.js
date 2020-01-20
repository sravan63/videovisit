import React from 'react';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './notifier.less';
import * as WebUI from '../../pexip/complex/webui.js';
import { range } from 'rxjs';
import { MessageService } from '../../services/message-service.js'
import GlobalConfig from '../../services/global.config';

class Notifier extends React.Component {
    constructor(props) {
        super(props);
        this.waitingroomdata = {};
        this.state = {message: 'Testing', showNotifier: false};
    }

    componentDidMount() {
        this.subscription = MessageService.getMessage().subscribe((message, data) => {
            switch(message.text){
                case GlobalConfig.NOTIFY_USER:
                    this.setState({ message: message.data, showNotifier: true });
                    setTimeout(()=>{
                        this.setState({ showNotifier: false });
                    }, 2500);
                break;
            }
        });
        
    }    
    componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
    }


    render() {
        return (
           <div className={this.state.showNotifier ? "notifier show-message" : "notifier hide-message"}>
               <p>{this.state.message}</p>                             
           </div> 
        );
    }
}

export default Notifier;