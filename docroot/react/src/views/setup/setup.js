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
import * as pexip from '../../pexip/complex/pexrtcV20.js';
import * as WebUI from '../../pexip/complex/webui.js';
import * as eventSource from '../../pexip/complex/EventSource.js';
import './setup.less';

class Setup extends React.Component {

    constructor(props) {
        super(props);
        this.interval = '';
        this.list = [];
        this.state = { data: {}, media: {}, constrains: {}, startTest: false, loadingSetup: false };
        this.joinVisit = this.joinVisit.bind(this);
        this.startTest = this.startTest.bind(this);
    }

    componentDidMount() {
        this.subscription = MessageService.getMessage().subscribe((message, data) => {
            if (message.text == 'Test call finished') {
                this.doneSetupTest();
            } else if(message.text == 'Media Data Ready'){
                this.list = message.data;
                this.setState({ media: this.list });
                this.setState({
                    constrains: {
                        audioSource: this.list.audiooutput ? this.list.audiooutput[0] : null,
                        videoSource: this.list.videoinput ? this.list.videoinput[0] : null,
                        micSource: this.list.audioinput ? this.list.audioinput[0] : null,
                    }
                });
                const constrains = {
                    audioSource: this.list.audioinput ? this.list.audioinput[0] : null,
                    videoSource: this.list.videoinput ? this.list.videoinput[0] : null,
                };
            }
        });
    }

    componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
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
            MediaService.start(constrains);
        } else if (type == 'speaker') {
            this.state.constrains.audioSource = media;
            MediaService.changeAudioDestination(media);
        } else if (type == 'mic') {
            this.state.constrains.micSource = media;
            const constrains = {
                videoSource: this.state.constrains.videoSource,
                audioSource: this.state.constrains.micSource,
            };
            MediaService.start(constrains);
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
        MediaService.stop();
        if (localStorage.getItem('userDetails')) {
            this.props.history.push('/myMeetings');
        } else {
            this.props.history.push('/login');
        }
    }

    startTest() {
        this.setState({ loadingSetup: true });
        const url = 'createSetupWizardMeeting.json';
        BackendService.getSetupMeeting(url).subscribe((response) => {
            if (response.data && response.data.statusCode == '200') {
                this.setState({ startTest: true});
                const meeting = response.data.data;
                var guestPin = meeting.meetingId.split('').reverse().join(''),// meeting.vendorGuestPin,
                    roomJoinUrl = meeting.roomJoinUrl, //"vve-tpmg-dev.kp.org",
                    alias = meeting.meetingVendorId,
                    bandwidth = "1280",
                    source = "Join+Conference",
                    name = meeting.member.inMeetingDisplayName;
                WebUI.initialise(roomJoinUrl, alias, bandwidth, name, guestPin, source);
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
                 <Header />
                 <div className="row mobile-logo-container m-0"><div className="col-12 mobile-tpmg-logo"></div><p className="col-12 header">Video Visits</p></div>
                 <div className="setup-content">
                     <div className="row setup">
                         <div className="col-md-5 peripheral-options p-0">
                             <div className="periheral-container">
                                 <div className="label">Camera</div>
                                 <div className="dropdown show">
                                      <a className={this.state.constrains.videoSource && !this.state.loadingSetup ? 'btn col-md-12 dropdown-toggle rounded-0' : 'btn col-md-12 dropdown-toggle rounded-0 disabled'} role="button" href="#" data-toggle="dropdown" onClick={this.toggleOpen.bind(this,'video')}>
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
                                      <a className={this.state.constrains.micSource && !this.state.loadingSetup ? 'btn col-md-12 dropdown-toggle rounded-0' : 'btn col-md-12 dropdown-toggle rounded-0 disabled'} role="button" href="#" data-toggle="dropdown" onClick={this.toggleOpen.bind(this,'audio')}>
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
                                 <div className="dropdown show">
                                      <a className={this.state.constrains.audioSource && !this.state.loadingSetup ? 'btn col-md-12 dropdown-toggle rounded-0' : 'btn col-md-12 dropdown-toggle rounded-0 disabled'} role="button" href="#" data-toggle="dropdown" onClick={this.toggleOpen.bind(this,'speaker')}>
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
                             </div>
                         </div>
                         <div className="col-md-5 p-0 video-preview">
                             {!this.state.startTest ? (
                                 <div className="start-test">
                                     <button className="btn rounded-0 btn-primary" onClick={this.startTest}>Start</button>
                                 </div>
                             ) : (
                             <div className="preview">
                                <video id="video" playsInline autoPlay></video>
                                <div id="selfview" className="selfview">
                                  <video id="selfvideo" autoPlay="autoplay" playsInline="playsinline" muted={true}>
                                  </video>
                                </div>
                             </div>
                             )}
                         </div>
                         <div className="col-md-12 mt-5 button-controls text-center">
                           <button className="btn rounded-0" onClick={this.joinVisit} disabled={this.state.loadingSetup}>Join</button>
                         </div>
                     </div>
                 </div>
            </div>
        )
    }
}

export default Setup;