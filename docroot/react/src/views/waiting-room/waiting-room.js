import React from 'react';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './waiting-room.less';
import * as WebUI from '../../pexip/complex/webui.js';
import { range } from 'rxjs';
import { MessageService } from '../../services/message-service.js'

class WaitingRoom extends React.Component {
    constructor(props) {
        super(props);
        this.waitingroomdata = {};
        this.state = {waitingroommsg: ''};
    }

    componentDidMount() {
        this.subscription = MessageService.getMessage().subscribe((message, data) => {
           // console.log(message);            
            if(message.text == 'Member Ready'){
                this.waitingroomdata= message.data;
                this.setState({ waitingroommsg: this.waitingroomdata}); 
            }
        });
        
    }    
    componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
    }


    render() {
        return (
            <div className="waiting-room-body" style={{display: this.props.waitingroom ? 'none' : 'block' }}>
                        <div className="full-waiting-room">
							<div className="conference-waiting-room">
								<div className="waitingRoomMessageBlock">
                                    <div className="tpmg-logo float-left m-0"></div>
									<span className="waitingroom-text">{this.state.waitingroommsg}</span>
								</div>
							</div>
						</div>                                 
           </div> 
        );
    }
}

export default WaitingRoom;