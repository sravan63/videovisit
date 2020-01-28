import React from 'react';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './conference-controls.less';
import { range } from 'rxjs';
import * as WebUI from '../../pexip/complex/webui.js';
import { MessageService } from '../../services/message-service.js';
import GlobalConfig from '../../services/global.config';
import Utilities from '../../services/utilities-service.js';

class ConferenceControls extends React.Component {
    constructor(props) {
        super(props);       
        this.state = { showvideoIcon: true, showaudioIcon: true, showmicIcon: true, isbrowsercheck: false};
        this.hideSettings = true;
    }

    componentDidMount() {
        var browserInfo = Utilities.getBrowserInformation();
        if (browserInfo.isSafari || browserInfo.isFireFox) {
            this.setState({ isbrowsercheck: true })
        }

        this.subscription = MessageService.getMessage().subscribe((notification) => {
            switch(notification.text) {
                case GlobalConfig.CLOSE_SETTINGS:
                this.hideSettings = notification.data;
                break;
            }
        });
        
    }

    componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
    }

    // Mute/Unmute video, mic and speaker.
    toggleControls(cntrlname) {
        switch (cntrlname) {
            case GlobalConfig.VIDEO:
                this.setState({
                    showvideoIcon: !this.state.showvideoIcon
                })
                WebUI.muteUnmuteVideo();
                break;
            case GlobalConfig.AUDIO:
                this.setState({
                    showaudioIcon: !this.state.showaudioIcon
                })
                WebUI.muteSpeaker();
                break;
            case GlobalConfig.MICROPHONE:
                this.setState({
                    showmicIcon: !this.state.showmicIcon
                })
                WebUI.muteUnmuteMic();
                break;
        }
    }

    // Sends notification to toggle the settings
    toggleSettings() {
        this.hideSettings = !this.hideSettings;
        MessageService.sendMessage(GlobalConfig.TOGGLE_SETTINGS, this.hideSettings);
    }

    render() {
        return (
            <div className="button-container">
                <div className="button-group" >
                    <div className="media-toggle">
                        <div title="Enable Video" style={{display: this.state.showvideoIcon ? 'block' : 'none'}} className="btns media-controls video-btn" onClick={()=>this.toggleControls('video')}></div>
                        <div title="Disable Video" style={{display: this.state.showvideoIcon ? 'none' : 'block'}} className="btns media-controls video-muted-btn" onClick={()=>this.toggleControls('video')}></div>   
                    </div>
                    <div className="media-toggle">
                        <div title="Mute Speakers" style={{display: this.state.showaudioIcon ? 'block' : 'none'}}  className="btns media-controls speaker-btn" onClick={()=>this.toggleControls('audio')}></div>
                        <div title="Unmute Speakers" style={{display: this.state.showaudioIcon ? 'none' : 'block'}} className="btns media-controls speaker-muted-btn" onClick={()=>this.toggleControls('audio')}></div>
                    </div>
                    <div className="media-toggle">
                        <div title="Mute Mic" style={{display: this.state.showmicIcon ? 'block' : 'none'}} className="btns media-controls microphone-btn" onClick={()=>this.toggleControls('microphone')}></div>
                        <div title="Unmute Mic" style={{display: this.state.showmicIcon ? 'none' : 'block'}} className="btns media-controls microphone-muted-btn" onClick={()=>this.toggleControls('microphone')}></div>
                    </div>
                    <div className="media-toggle">
                        <div title="Settings" style={{display:this.state.isbrowsercheck ? 'none':'block'}} className="btns media-controls settings-btn" onClick={this.toggleSettings.bind(this)}></div>                                    
                    </div>
                </div>
            </div>
        );
    }
}

export default ConferenceControls;