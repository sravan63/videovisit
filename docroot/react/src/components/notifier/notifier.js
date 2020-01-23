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
        this.userDetails = {};
        this.state = {message: 'Testing', showNotifier: false};
    }

    componentDidMount() {
        this.userDetails = JSON.parse(localStorage.getItem('userDetails'));
        this.subscription = MessageService.getMessage().subscribe((notification) => {
            switch(notification.text){
                case GlobalConfig.NOTIFY_USER:
                const loggedInUserName = this.userDetails.lastName.toLowerCase() + ', ' + this.userDetails.firstName.toLowerCase();
                    if(loggedInUserName !== notification.data.name.toLowerCase()){
                        this.setState({ message: notification.data.message, showNotifier: true });
                        setTimeout(()=>{
                            this.setState({ showNotifier: false });
                        }, 2500);
                    }
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