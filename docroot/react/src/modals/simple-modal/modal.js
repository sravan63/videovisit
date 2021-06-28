import React from "react";
import { MessageService } from '../../services/message-service.js';
import GlobalConfig from '../../services/global.config';
import UtilityService from '../../services/utilities-service';
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
                    this.setState({popupOptions: notification.data,showOverlay : true});
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
    refreshPage() {
        window.location.reload(false);
    }

    closePopup(option){
        MessageService.sendMessage(GlobalConfig.CLOSE_MODAL, option);
        this.setState({showOverlay : false});
    }

    render() {
    let Details = UtilityService.getLang();
    return (
        <div className="vv-modal">
            {this.state.showOverlay ? (
            <div id="leaveMeetingPopup" className="leaveMeeting-popup">
                <div className="popup-content">
                    { this.state.popupOptions.type && this.state.popupOptions.type.length > 0 ? (<div><h5>{ this.state.popupOptions.heading }</h5>
                        { this.state.popupOptions.type=='Permission' ? (<p>{ this.state.popupOptions.message }</p>) :
                            (<div className="selectIcon">
                                <p>{ this.state.popupOptions.message }</p>
                                <div className= "refreshButton">
                                    <button type="button" className="refresh" onClick={this.refreshPage}>{Details.Refresh}</button>
                                </div>
                            </div>)}
                    </div>):(<div><h3>{ this.state.popupOptions.heading }</h3>
                        <h4>{ this.state.popupOptions.message }</h4></div>) }
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
