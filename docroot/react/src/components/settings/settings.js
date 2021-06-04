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
        // this.list = {};
        this.updatedDevices = {};
        this.browserInfo = null;
        this.state = { data: {}, media: {}, constrains: {}, settingstoggle: true , isbrowsercheck: false};
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        this.subscription = MessageService.getMessage().subscribe((message) => {
            switch (message.text) {
                case GlobalConfig.MEDIA_DATA_READY:
                    this.setPeripherals(message);
                    break;
                case GlobalConfig.RESET_MEDIA_DEVICES:
                    if(this.state.media) {
                        this.updatedDevices['speakersBeforeChange'] = this.browserInfo.isSafari ? 0 : Number(this.state.media.audiooutput.length);
                        this.updatedDevices['micsBeforeChange'] = Number(this.state.media.audioinput.length);
                        this.updatedDevices['camerasBeforeChange'] = Number(this.state.media.videoinput.length);
                        // this.list = {};
                        this.setState({media: {}});
                    }
                    break;
                case GlobalConfig.UPDATE_MEDIA_DEVICES:
                    const tspeakers = this.browserInfo.isSafari ? 0 : message.data.audiooutput.length;
                    const tmics = message.data.audioinput.length;
                    const tcameras = message.data.videoinput.length;
                    // this.setPeripherals(message);
                    let constrains = {
                        audioSource: message.data.audiooutput ? message.data.audiooutput[0] : null,
                        videoSource: message.data.videoinput ? message.data.videoinput[0] : null,
                        micSource: message.data.audioinput ? message.data.audioinput[0] : null
                    };
                    const rtc = WebUI.getRTC();
                    if( this.updatedDevices['camerasBeforeChange'] > tcameras || rtc.video_source !== constrains.videoSource.deviceId ) {
                        // Change in camera
                        const videoSource = constrains.videoSource;
                        const micSource = constrains.micSource;
                        this.selectPeripheral(micSource, 'mic');
                        this.selectPeripheral(videoSource, 'camera');
                        localStorage.setItem('selectedPeripherals', JSON.stringify(this.state.constrains));
                    } else if( this.updatedDevices['micsBeforeChange'] > tmics || rtc.audio_source !== constrains.micSource.deviceId ) {
                        // Change in mic
                        const micSource = constrains.micSource;
                        this.selectPeripheral(micSource, 'mic');
                        localStorage.setItem('selectedPeripherals', JSON.stringify(this.state.constrains));
                    }
                    if( !this.browserInfo.isSafari && (this.updatedDevices['speakersBeforeChange'] > tspeakers || constrains.audioSource.deviceId !== this.state.constrains.audioSource.deviceId) ) {
                        // Change in speaker
                        const speakerSource = constrains.audioSource;
                        this.selectPeripheral(speakerSource, 'speaker');
                        localStorage.setItem('selectedPeripherals', JSON.stringify(this.state.constrains));
                    }
                    MediaService.resetDeviceChangeFlag();
                    this.setPeripherals(message);
                    break;
                case GlobalConfig.TOGGLE_SETTINGS:
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
            WebUI.switchDevices('video', media);
        } else if (type == 'speaker') {
            this.state.constrains.audioSource = media;
            MediaService.changeAudioDestination(media, 'video');
            WebUI.switchDevices('speaker',media);
        } else if (type == 'mic') {
            this.state.constrains.micSource = media;
            WebUI.switchDevices('mic',media);
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