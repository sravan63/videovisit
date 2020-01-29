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
class Settings extends React.Component {
    constructor(props) {
        super(props);       
        this.list = [];
        this.state = { data: {}, media: {}, constrains: {}, settingstoggle: true };
    }

    componentDidMount() {
        this.subscription = MessageService.getMessage().subscribe((message) => {
            switch(message.text) {
                case GlobalConfig.MEDIA_DATA_READY:
                    this.list = message.data;                    
                    this.setState({ media: this.list });
                    this.setState({
                        constrains: {
                            audioSource: this.list.audiooutput ? this.list.audiooutput[0] : null,
                            videoSource: this.list.videoinput ? this.list.videoinput[0] : null,
                            micSource: this.list.audioinput ? this.list.audioinput[0] : null,
                        }
                    });
                break;
                case GlobalConfig.TOGGLE_SETTINGS:
                    this.setState({ settingstoggle: message.data });
                   // this.state.settingstoggle = message.data;
                    break;
            }
        });
        document.addEventListener('click', this.handleClickOutside.bind(this), true);
    } 
    handleClickOutside(event){
        const domNode = ReactDOM.findDOMNode(this);
        const settingsNode = event.target.className.indexOf('settings-btn') > -1;
        
        if (!domNode || !domNode.contains(event.target)) {
            if(!settingsNode && !this.state.settingstoggle){
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
            WebUI.switchDevices('video',media.deviceId);
        } else if (type == 'speaker') {
            this.state.constrains.audioSource = media;
            MediaService.changeAudioDestination(media,'video');
            WebUI.switchDevices('speaker');
        } else if (type == 'mic') {
            this.state.constrains.micSource = media;
            MediaService.changeAudioDestination(media,'video');
            WebUI.switchDevices('mic');
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
        document.removeEventListener('click', this.handleClickOutside.bind(this), true);
        this.subscription.unsubscribe();
    }

    close() {
        this.setState({ settingstoggle: true });
        MessageService.sendMessage(GlobalConfig.CLOSE_SETTINGS, true);
    }

    render() {
        return (
            <div className="setting-peripherals" style={{left : this.state.settingstoggle ? '-527px' : '0',transition: '1s'}}>
                <div className="row settings-page">
                    <div className="col-md-10 peripheral-options p-0">
                                <div className="close-button" onClick={() => this.close(this)}></div>
                                <div className="text-center"><h4>Settings</h4></div>
                                    <div className="periheral-container">
                                        <div className="label">Camera</div>
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
                                        <div className="label">Microphone</div>
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
                                        <div className="label">Speaker</div>
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
                                        <button className="btn rounded-0" onClick={() => this.close(this)}>Done</button>
                                    </div>
                                </div>
                            </div>
                         </div>   
        );
    }
}

export default Settings;