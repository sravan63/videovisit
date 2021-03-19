import React from "react";
import { MessageService } from '../../services/message-service.js';
import GlobalConfig from '../../services/global.config';
import { connect } from 'react-redux';

import './info-modal.less';

class InfoModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = { showOverlay: false, information: '', showLoader:false };
    }

    componentDidMount() {
        this.subscription = MessageService.getMessage().subscribe((notification) => {
            switch (notification.text) {
                case GlobalConfig.OPEN_INFO_MODAL:
                    if(this.state.showOverlay){
                        this.setState({showOverlay : false});
                    }
                    this.setState({
                        information : notification.data.text, 
                        showOverlay : true, 
                        showLoader : notification.data.loader
                    });
                    break;
                case GlobalConfig.CLOSE_INFO_MODAL:
                    this.setState({showOverlay : false});
                    break;
            }
        });

    }

    render() {
        return (
        <div className="info-modal">
            { this.state.showOverlay ? (
                <div className="container-fluid">
                    <div className="row info-modal-overlay"> 
                        <div className="info-container">
                            <div className="content p-3">
                                {this.state.showLoader ? (<div className="loader"></div>):('')}
                                <div className="info p-1">{this.state.information}</div>
                            </div>
                        </div>
                    </div>
                </div>) : ('')
            }
        </div>
        );
    }
}


export default InfoModal;