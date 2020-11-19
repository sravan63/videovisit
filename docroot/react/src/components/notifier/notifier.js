import React from 'react';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './notifier.less';
import * as WebUI from '../../pexip/complex/webui.js';
import { range } from 'rxjs';
import { MessageService } from '../../services/message-service.js'
import GlobalConfig from '../../services/global.config';
import Utilities from '../../services/utilities-service.js';

class Notifier extends React.Component {
    constructor(props) {
        super(props);
        this.loggedInUserName = '';
        this.state = { message: 'Testing', isMobile:false, showNotifier: false };
    }

    componentDidMount() {
        this.subscription = MessageService.getMessage().subscribe((notification) => {
            switch (notification.text) {
                case GlobalConfig.NOTIFY_USER:
                    if (this.loggedInUserName.toLowerCase() !== notification.data.name.toLowerCase()) {
                        let notificationmsg = notification.data.message.replace(", (dummy@dummy.com)","");
                        this.setState({ message: notificationmsg, showNotifier: true });
                        setTimeout(() => {
                            this.setState({ showNotifier: false });
                        }, 2500);
                    }
                    break;

                case GlobalConfig.ACCESS_MEMBER_NAME:
                    this.loggedInUserName = JSON.parse(localStorage.getItem('memberName'));
                    break;
            }
        });
        var isMobile = Utilities.isMobileDevice();
        if (isMobile) {
            this.setState({ isMobile: true });
        }

    }
    componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
    }


    render() {
        return (
            <div className={this.state.showNotifier && !this.state.isMobile ? "notifier show-message" : "notifier hide-message"}>
               <p>{this.state.message}</p>                             
           </div>
        );
    }
}

export default Notifier;