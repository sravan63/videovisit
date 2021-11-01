import React from 'react';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './settings.less';
import * as WebUI from '../../pexip/complex/webui.js';
import { range } from 'rxjs';
import { MessageService } from '../../services/message-service.js';
import GlobalConfig from '../../services/global.config';
import MediaService from '../../services/media-service.js';
import Popper from 'popper.js';
import ReactDOM from 'react-dom';
import Utilities from '../../services/utilities-service.js';
class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.mediaAvailable = false;
        this.updatedDevices = {};
        this.browserInfo = null;
        this.rtc = null;
        this.state = { data: {}, media: {}, constrains: {}, settingstoggle: true , isbrowsercheck: false};
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        this.subscription = MessageService.getMessage().subscribe((message) => {
            switch (message.text) {
                case GlobalConfig.MEDIA_DATA_READY:
                    this.setPeripherals(message);
                    this.mediaAvailable = true;
                    break;
                case GlobalConfig.RESET_MEDIA_DEVICES:
                    if(this.mediaAvailable == true && this.state.media) {
                        this.updatedDevices['speakersBeforeChange'] = this.browserInfo.isSafari ? 0 : Number(this.state.media.audiooutput.length);
                        this.updatedDevices['micsBeforeChange'] = Number(this.state.media.audioinput.length);
                        this.updatedDevices['camerasBeforeChange'] = Number(this.state.media.videoinput.length);
                        this.setState({media: {}});
                    }
                    break;
                case GlobalConfig.RECONNECT_ON_DEVICE_CHANGE:
                    // For mobile
                    setTimeout(()=>{
                        this.selectPeripheral(this.state.constrains.micSource, 'mic');
                        this.selectPeripheral(this.state.constrains.videoSource, 'camera');
                        MediaService.resetDeviceChangeFlag();
                    }, 1000);
                    break;
                case GlobalConfig.UPDATE_MEDIA_DEVICES:
                    const speakersAfterChange = this.browserInfo.isSafari ? 0 : message.data.audiooutput.length;
                    const micsAfterChange = message.data.audioinput.length;
                    const camerasAfterChange = message.data.videoinput.length;
                    if( this.updatedDevices['camerasBeforeChange'] !== camerasAfterChange ) {
                        // Change in CAMERAS
                        if(this.updatedDevices['camerasBeforeChange'] > camerasAfterChange){
                            WebUI.log("info","camera_pluggedOut","event: An external camera device is plugged out inside conference page");
                        }
                        else{
                           WebUI.log("info","camera_pluggedIn","event: An external camera device is plugged in inside conference page");
                        }
                        const videoSource = this.updatedDevices['camerasBeforeChange'] > camerasAfterChange ? message.data.videoinput[0] : 
                        message.data.videoinput.length > 1 ? message.data.videoinput[1] : message.data.videoinput[0];
                        const micSource = this.updatedDevices['micsBeforeChange'] > micsAfterChange ? message.data.audioinput[0] : 
                        message.data.audioinput.length > 1 ? message.data.audioinput[1] : message.data.audioinput[0];
                        this.selectPeripheral(micSource, 'mic');
                        this.selectPeripheral(videoSource, 'camera');
                        localStorage.setItem('selectedPeripherals', JSON.stringify(this.state.constrains));
                    } else if( this.updatedDevices['micsBeforeChange'] !== micsAfterChange ) {
                        // Change in MICS
                        if(this.updatedDevices['micsBeforeChange'] > micsAfterChange){
                            WebUI.log("info","microphone_pluggedOut","event: An external microphone device is plugged out inside conference page");
                        }
                        else{
                            WebUI.log("info","microphone_pluggedIn","event: An external microphone device is plugged in inside conference page");
                        }
                        const micSource = this.updatedDevices['micsBeforeChange'] > micsAfterChange ? message.data.audioinput[0] : 
                        message.data.audioinput.length > 1 ? message.data.audioinput[1] : message.data.audioinput[0];
                        this.selectPeripheral(micSource, 'mic');
                        localStorage.setItem('selectedPeripherals', JSON.stringify(this.state.constrains));
                    }
                    if( !this.state.isbrowsercheck && (this.updatedDevices['speakersBeforeChange'] !== speakersAfterChange) ) {
                        // Change in SPEAKERS
                        if(this.updatedDevices['speakersBeforeChange'] > speakersAfterChange){
                            WebUI.log("info","speaker_pluggedOut","event: An external speaker device is plugged out inside conference page");
                        }
                        else{
                            WebUI.log("info","speaker_pluggedIn","event: An external speaker device is plugged in inside conference page");
                        }
                        const speakerSource = this.updatedDevices['speakersBeforeChange'] > speakersAfterChange ? message.data.audiooutput[0] : 
                        message.data.audiooutput.length > 1 ? message.data.audiooutput[1] : message.data.audiooutput[0];
                        this.selectPeripheral(speakerSource, 'speaker');
                        localStorage.setItem('selectedPeripherals', JSON.stringify(this.state.constrains));
                    }
                    MediaService.resetDeviceChangeFlag();
                    this.setPeripherals(message);
                    this.showActivePeripherals();
                    break;
                case GlobalConfig.TOGGLE_SETTINGS:
                    if(message.data == false){
                        this.showActivePeripherals();
                    }
                    this.setState({ settingstoggle: message.data });
                    // this.state.settingstoggle = message.data;
                    break;
            }
        });
        document.addEventListener('click', this.handleClickOutside, true);
        this.browserInfo = Utilities.getBrowserInformation();
        if (this.browserInfo.isSafari || this.browserInfo.isFireFox) {
            this.setState({ isbrowsercheck: true })
        }
        this.rtc = WebUI.getRTC();
    }
    setPeripherals(message){
        // this.list = message.data;
        this.setState({ media: message.data });
        this.setState({
            constrains: {
                audioSource: message.data.audiooutput ? message.data.audiooutput[0] : null,
                videoSource: message.data.videoinput ? message.data.videoinput[0] : null,
                micSource: message.data.audioinput ? message.data.audioinput[0] : null,
            }
        });
    }
    showActivePeripherals(){
        let vSource = null;
        this.state.media.videoinput.map((v)=>{
            if(v.deviceId == this.rtc.video_source){ vSource = v; }
        });
        let mSource = null;
        this.state.media.audioinput.map((m)=>{
            if(m.deviceId == this.rtc.audio_source){ mSource = m; }
        });
        let sSource = null;
        this.state.media.audiooutput.map((s)=>{
            if(MediaService.getCurrentSpeakerDevice() && s.deviceId == MediaService.getCurrentSpeakerDevice().deviceId ){ sSource = s; }
        });
        this.setState({
            constrains: {
                audioSource: sSource ? sSource : this.state.constrains.audioSource,
                videoSource: vSource ? vSource : this.state.constrains.videoSource,
                micSource: mSource ? mSource : this.state.constrains.micSource,
            }
        });
    }
    handleClickOutside(event) {
        const domNode = ReactDOM.findDOMNode(this);
        const settingsNode = event.target.className.indexOf('settings-btn') > -1;

        if (!domNode || !domNode.contains(event.target)) {
            if (!settingsNode && !this.state.settingstoggle) {
                this.close(this);
            }
        }
    }
    toggleOpen(type) {
        this.setState({
            data: {
                isVideo: type == 'video',
                isAudio: type == 'audio',
                isSpeaker: type == 'speaker',
            }
        });
    }

    selectPeripheral(media, type) {
        if (type == 'camera') {
            this.state.constrains.videoSource = media;
            const constrains = {
                videoSource: this.state.constrains.videoSource,
                audioSource: this.state.constrains.micSource,
            };
            WebUI.switchDevices('camera', media,"vv");
        } else if (type == 'speaker') {
            this.state.constrains.audioSource = media;
            MediaService.changeAudioDestination(media, 'video');
            // WebUI.switchDevices('speaker',media);
        } else if (type == 'mic') {
            this.state.constrains.micSource = media;
            WebUI.switchDevices('microphone',media,"vv");
        }
        // Sets the constrains in dropdowns.
        this.setState({
            constrains: {
                audioSource: this.state.constrains.audioSource,
                videoSource: this.state.constrains.videoSource,
                micSource: this.state.constrains.micSource
            }
        });
    }

    componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        document.removeEventListener('click', this.handleClickOutside, true);
        this.subscription.unsubscribe();
    }

    close() {
        this.setState({ settingstoggle: true });
        MessageService.sendMessage(GlobalConfig.CLOSE_SETTINGS, true);
    }

    render() {
        let Details = this.props.data.conference;
        return (<div>
                {!this.state.isbrowsercheck ? (<div className={ this.state.settingstoggle ? 'setting-peripherals hide-peripherals' : 'setting-peripherals show-peripherals'}>
                    <div className="row settings-page p-0">
                        <div className="col-xs-12 col-md-12 peripheral-options p-0">
                            <div className="close-button" onClick={() => this.close(this)}></div>
                            <div className="text-center"><h4>{Details && Details.Settings}</h4></div>
                            <div className="periheral-container">
                                <div className="label">{Details && Details.Camera}</div>
                                <div className="dropdown show">
                                    <a className={this.state.constrains.videoSource ? 'btn col-md-12 dropdown-toggle rounded-0' : 'btn col-md-12 dropdown-toggle rounded-0 disabled'} role="button" href="#" data-toggle="dropdown" onClick={this.toggleOpen.bind(this,'video')}>
                                        {this.state.constrains.videoSource ? this.state.constrains.videoSource.label : ''}
                                    </a>
                                    <div className={this.state.data.isVideo ? 'dropdown-menu show' : 'dropdown-menu'} aria-labelledby="dropdownMenuButton">
                                        { this.state.media.videoinput && this.state.media.videoinput.length > 0 ?
                                            this.state.media.videoinput.map((item,key) =>{
                                                return (
                                                    <a className="dropdown-item" key={key} onClick={this.selectPeripheral.bind(this,item, 'camera')}>{item.label}</a>
                                                )
                                            })
                                            : ('')
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="periheral-container">
                                <div className="label">{Details && Details.Microphone}</div>
                                <div className="dropdown show">
                                    <a className={this.state.constrains.micSource ? 'btn col-md-12 dropdown-toggle rounded-0' : 'btn col-md-12 dropdown-toggle rounded-0 disabled'} role="button" href="#" data-toggle="dropdown" onClick={this.toggleOpen.bind(this,'audio')}>
                                        {this.state.constrains.micSource ? this.state.constrains.micSource.label : ''}
                                    </a>
                                    <div className={this.state.data.isAudio ? 'dropdown-menu show' : 'dropdown-menu'} aria-labelledby="dropdownMenuButton">
                                        { this.state.media.audioinput && this.state.media.audioinput.length > 0 ?
                                            this.state.media.audioinput.map((item,key) =>{
                                                return (
                                                    <a className="dropdown-item" key={key} onClick={this.selectPeripheral.bind(this,item, 'mic')}>{item.label}</a>
                                                )
                                            })
                                            : ('')
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="periheral-container">
                                <div className="label">{Details && Details.Speaker}</div>
                                {this.state.constrains.audioSource ? (<div className="dropdown show">
                                    <a className={this.state.constrains.audioSource ? 'btn col-md-12 dropdown-toggle rounded-0' : 'btn col-md-12 dropdown-toggle rounded-0 disabled'} role="button" href="#" data-toggle="dropdown" onClick={this.toggleOpen.bind(this,'speaker')}>
                                        {this.state.constrains.audioSource ? this.state.constrains.audioSource.label : ''}
                                    </a>
                                    <div className={this.state.data.isSpeaker ? 'dropdown-menu show' : 'dropdown-menu'} aria-labelledby="dropdownMenuButton">
                                        { this.state.media.audiooutput && this.state.media.audiooutput.length > 0 ?
                                            this.state.media.audiooutput.map((item,key) =>{
                                                return (
                                                    <a className="dropdown-item" key={key} onClick={this.selectPeripheral.bind(this,item, 'speaker')}>{item.label}</a>
                                                )
                                            })
                                            : ('')
                                        }
                                    </div>
                                </div>) : ('')}
                            </div>
                            <div className="col-md-12 button-controls text-center">
                                <button className="btn rounded-0" onClick={() => this.close(this)}>{Details && Details.Done}</button>
                            </div>
                        </div>
                    </div>
                </div>) : ('')}</div>
        );
    }
}

export default Settings;
