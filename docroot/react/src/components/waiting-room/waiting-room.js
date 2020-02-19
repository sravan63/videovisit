import React from 'react';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './waiting-room.less';
import * as WebUI from '../../pexip/complex/webui.js';
import { range } from 'rxjs';
import { MessageService } from '../../services/message-service.js';
import GlobalConfig from '../../services/global.config';
import Utilities from '../../services/utilities-service.js';

class WaitingRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {waitingroommsg: '',runningLateUpdatedTime:'',isRunningLate:''};
    }

    componentDidMount() {
        this.subscription = MessageService.getMessage().subscribe((message, data) => {
            switch(message.text) {
                case GlobalConfig.MEMBER_READY:
                    this.setState({ waitingroommsg: message.data}); 
                break;
                case GlobalConfig.UPDATE_RUNNING_LATE:
                    this.setState({isRunningLate: message.data.isRunningLate,waitingroommsg: message.data.runningLatemsg,runningLateUpdatedTime:Utilities.formatInMeetingRunningLateTime(message.data.runLateMeetingTime)});
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
            <div className="waiting-room-body" style={{width: this.props.waitingroom.hostavail ? '0' : '100%', display:this.props.waitingroom.hostavail ? "none" : "block",height: this.props.waitingroom.moreparticpants ? 'auto' : '100%' }}>
                <div className="full-waiting-room" style={{display: this.props.waitingroom.moreparticpants ? 'none' : 'block' }}>
    				<div className="conference-waiting-room">
    					<div className="waitingRoomMessageBlock row">
                            <div className="tpmg-logo float-left p-0 m-0"></div>
    						<span className="waitingroom-text" style={{display: this.state.isRunningLate ? 'none' : 'block' }}>{this.state.waitingroommsg}</span>
                            <span className="waitingroom-text" style={{display: this.state.isRunningLate ? 'block' : 'none' }}>Your visit will now start at <b>{this.state.runningLateUpdatedTime}</b></span>
                            <div className="runninglate-msg mt-2" style={{display: this.state.isRunningLate ? 'block' : 'none' }}>{this.state.waitingroommsg}</div>                                    
    					</div>
    				</div>
    			</div>
                <div className="half-waiting-room" style={{display: this.props.waitingroom.moreparticpants ? 'block' : 'none' }}>
    				<div className="conference-waiting-room">
    					<div className="waitingRoomMessageBlock row">
                            <div className="tpmg-logo float-left p-0 m-0"></div>
    						<span className="waitingroom-text col-md-9" style={{display: this.state.isRunningLate  ? 'none' : 'block' }}>{this.state.waitingroommsg}</span>
                            <span className="waitingroom-text " style={{display: this.state.isRunningLate  ? 'block' : 'none' }}>Your visit will now start at <b>{this.state.runningLateUpdatedTime}</b></span>
                            <div className="runninglate-msg mt-2" style={{display: this.state.isRunningLate  ? 'block' : 'none' }}>{this.state.waitingroommsg}</div>                                    
    					</div>
    				</div>
    			</div>                                  
           </div> 
        );
    }
}

export default WaitingRoom;