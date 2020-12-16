import React from "react";
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import $ from 'jquery';
import Popper from 'popper.js';

import { range } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import Header from '../../components/header/header';
import Loader from '../../components/loader/loader';
import BackendService from '../../services/backendService.js';
import MediaService from '../../services/media-service.js';
import { MessageService } from '../../services/message-service';
import GlobalConfig from '../../services/global.config';
import * as pexip from '../../pexip/complex/pexrtcV20.js';
import * as WebUI from '../../pexip/complex/webui.js';
import * as eventSource from '../../pexip/complex/EventSource.js';
import UtilityService from '../../services/utilities-service';
import BrowserBlock from '../../components/browser-block/browser-block';
import Footer from '../../components/footer/footer';
import './setup.less';

class Setup extends React.Component {

    constructor(props) {
        super(props);
        this.interval = '';
        this.list = [];
        this.state = { data: {}, userDetails: {}, media: {}, constrains: {}, startTest: false, loadingSetup: false ,isBrowserBlockError: false,mdoHelpUrl:''};
        this.joinVisit = this.joinVisit.bind(this);
        this.startTest = this.startTest.bind(this);
    }

    componentDidMount() {
        var nonSafari = /CriOS|FxiOS/.test(navigator.userAgent);
        if(nonSafari){
          this.getBrowserBlockInfo();
          return false;
        }
        sessionStorage.setItem('isSetupPage', true);
        MediaService.loadDeviceMediaData();
        this.subscription = MessageService.getMessage().subscribe((message, data) => {
            switch (message.text) {
                case GlobalConfig.TEST_CALL_FINISHED:
                    this.doneSetupTest();
                    break;
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
            }
        });
        
        this.getBrowserBlockInfo();
    }

    componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
        window.location.reload();
        sessionStorage.removeItem('isSetupPage');
    }

    getBrowserBlockInfo(){
        var propertyName = 'browser',
            url = "loadPropertiesByName.json",
            browserNames = '';
        BackendService.getBrowserBlockDetails(url, propertyName).subscribe((response) => {
            if (response.data && response.status == '200') {
                 browserNames = response.data; 
                 this.setState({ mdoHelpUrl: response.data.mdoHelpUrl });
                 if(UtilityService.validateBrowserBlock(browserNames)){
                    this.setState({ isBrowserBlockError: true });
                 }
            } else {
                // Do nothing
            }
        }, (err) => {
            console.log("Error");
        });
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
            WebUI.switchDevices('speaker', media);
        } else if (type == 'mic') {
            this.state.constrains.micSource = media;
            const constrains = {
                videoSource: this.state.constrains.videoSource,
                audioSource: this.state.constrains.micSource,
            };
            WebUI.switchDevices('mic', media);
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

    joinVisit() {
        localStorage.removeItem('selectedPeripherals');
        if (localStorage.getItem('userDetails')) {
            this.props.history.push(GlobalConfig.MEETINGS_URL);
        } else {
            this.props.history.push(GlobalConfig.LOGIN_URL);
        }
    }

    startTest() {
        this.setState({ loadingSetup: true });
        var browserInfo = UtilityService.getBrowserInformation();
        if(browserInfo.isSafari || browserInfo.isFireFox) {
          MediaService.stopAudio();
        }
        const data = this.state.constrains;
        localStorage.setItem('selectedPeripherals', JSON.stringify(data));
        const url = 'createSetupWizardMeeting.json';
        BackendService.getSetupMeeting(url).subscribe((response) => {
            if (response.data && response.data.statusCode == '200') {
                this.setState({ startTest: true });
                /*setTimeout(() => {
                    MediaService.changeAudioDestination(data.audioSource, 'video');
                }, 1000);*/
                const meeting = response.data.data;
                var guestPin = meeting.meetingId.split('').reverse().join(''),
                    roomJoinUrl = meeting.roomJoinUrl,
                    alias = meeting.meetingVendorId,
                    bandwidth = "1280",
                    source = "Join+Conference",
                    name = meeting.member.inMeetingDisplayName;
                localStorage.setItem('isSetupPage', true);
                var turnServerInfo = meeting.vendorConfig;
                sessionStorage.setItem('turnServer', JSON.stringify(turnServerInfo));
                WebUI.initialise(roomJoinUrl, alias, bandwidth, name, guestPin, source, null, null);
            } else {
                this.setState({ loadingSetup: false });
            }
        }, (err) => {
            console.log(err);
            this.setState({ loadingSetup: false });
        });
    }

    doneSetupTest() {
        this.setState({ startTest: false, loadingSetup: false });
    }

    render() {
        return (
            <div id='container' className="setup-page">
                 <Header helpUrl = {this.state.mdoHelpUrl}/>
                 <div className="row mobile-help-link">
                    <div className="col-12 text-right help-icon p-0">
                        <a href={this.state.mdoHelpUrl} className="help-link" target="_blank">Help</a>
                    </div>
                 </div>
                <div className="row mobile-logo-container">
                 <div className="title">
                      <p className="col-12 m-0 header">Kaiser Permanente</p>
                      <p className="col-12 sub-header">Video Visits</p>
                  </div>
                  </div>
                 
                 <div className="setup-content">
                     <div className="row setup">
                     <BrowserBlock browserblockinfo = {this.state}/>
                         <div className="col-md-5 peripheral-options p-0">
                             <div className="periheral-container">
                                 <div className="label">Camera</div>
                                 <div className="dropdown show">
                                      <a className={this.state.constrains.videoSource && !this.state.loadingSetup && !this.state.isBrowserBlockError ? 'btn col-md-12 dropdown-toggle rounded-0' : 'btn col-md-12 dropdown-toggle rounded-0 disabled'} role="button" href="#" data-toggle="dropdown" onClick={this.toggleOpen.bind(this,'video')}>
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
                                      <a className={this.state.constrains.micSource && !this.state.loadingSetup && !this.state.isBrowserBlockError ? 'btn col-md-12 dropdown-toggle rounded-0' : 'btn col-md-12 dropdown-toggle rounded-0 disabled'} role="button" href="#" data-toggle="dropdown" onClick={this.toggleOpen.bind(this,'audio')}>
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
                             {this.state.constrains.audioSource ? (<div className="periheral-container">
                                 <div className="label">Speaker</div>
                                 <div className="dropdown show">
                                      <a className={this.state.constrains.audioSource && !this.state.loadingSetup && !this.state.isBrowserBlockError ? 'btn col-md-12 dropdown-toggle rounded-0' : 'btn col-md-12 dropdown-toggle rounded-0 disabled'} role="button" href="#" data-toggle="dropdown" onClick={this.toggleOpen.bind(this,'speaker')}>
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
                                 </div>
                             </div>) : ('')}
                         </div>
                         <div className="col-md-5 p-0 video-preview">
                                 <div className="start-test" style={{display: !this.state.startTest ? 'flex' : 'none'}}>
                                     <button className="btn rounded-0 btn-primary" onClick={this.startTest} disabled={this.state.isBrowserBlockError}>Start</button>
                                 </div>
                            
                             <div className="preview" style={{display: !this.state.startTest ? 'none' : 'block'}} >
                                <video id="video" playsInline autoPlay></video>
                                <div id="selfview" className="selfview">
                                  <video id="selfvideo" autoPlay="autoplay" playsInline="playsinline" muted={true}>
                                  </video>
                                </div>
                             </div>
                            
                         </div>
                         <div className="col-md-12 mt-5 button-controls text-center mb-4">
                           <button className="btn rounded-0" onClick={this.joinVisit} disabled={this.state.loadingSetup || this.state.isBrowserBlockError}>Join</button>
                         </div>
                     </div>
                 </div>
                 <div className="setup-form-footer">
                        <Footer />
                </div>
            </div>
        )
    }
}

export default Setup;
