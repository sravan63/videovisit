import React from "react";
import { MessageService } from '../services/message-service.js';
import GlobalConfig from '../services/global.config';
import './modal.less';

class VVModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = { showOverlay: false, popupOptions: null };
    }

    componentDidMount() {
        this.subscription = MessageService.getMessage().subscribe((notification) => {
            switch (notification.text) {
                case GlobalConfig.OPEN_MODAL:
                    if(this.state.showOverlay){
                        this.setState({showOverlay : false});
                    }
                    this.setState({popupOptions : notification.data});
                    this.setState({showOverlay : true});
                    break;
                case GlobalConfig.CLOSE_MODAL_AUTOMATICALLY:
                    this.setState({showOverlay : false});
                    break;
            }
        });

    }

    componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
    }

    closePopup(option){
        MessageService.sendMessage(GlobalConfig.CLOSE_MODAL, option);
        this.setState({showOverlay : false});
    }

    render() {
    return (
        <div className="vv-modal">
            {this.state.showOverlay ? (
            <div id="leaveMeetingPopup" className="leaveMeeting-popup">
                <div className="popup-content">
                    <h3>{ this.state.popupOptions.heading }</h3>
                    <h4>{ this.state.popupOptions.message }</h4>
                    <div className= "overlayButton">
                        { this.state.popupOptions.controls && this.state.popupOptions.controls.length > 0 ? 
                            this.state.popupOptions.controls.map((item,index) =>{
                            return (
                                <button key={index} type="button" className={index%2 == 0 && this.state.popupOptions.controls.length > 1 ? "odd" : "even"} onClick={this.closePopup.bind(this, item)} >{ item.label }</button>
                            )
                        }) 
                         : ('') 
                        }
                    </div>
                </div>
            </div>):('')}
        </div>
    )
}

}
export default VVModal;