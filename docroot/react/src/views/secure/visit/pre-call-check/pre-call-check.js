import React from "react";
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import $ from 'jquery';
import Popper from 'popper.js';

import { range } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import Header from '../../../../components/header/header';
import Loader from '../../../../components/loader/loader';
import BackendService from '../../../../services/backendService.js';
import MediaService from '../../../../services/media-service.js';
import './pre-call-check.less';

class PreCallCheck extends React.Component {

    constructor(props) {
        super(props);
        this.interval = '';
        this.list = [];
        this.state = { userDetails: {}, showPage: false, showLoader: true, data: {}, media: {}, constrains: {}, musicOn: false };
        this.goBack = this.goBack.bind(this);
        this.joinVisit = this.joinVisit.bind(this);
    }

    componentDidMount() {
        if (localStorage.getItem('userDetails')) {
            this.state.userDetails = JSON.parse(localStorage.getItem('userDetails'));
            if (this.state.userDetails) {
                this.setState({ showPage: true });
            }
        } else {
            this.props.history.push('/login');
        }

        var self = this;
        setTimeout(function() {
            self.list = MediaService.getMediaList();
            self.setState({ media: self.list });
            self.setState({
                constrains: {
                    audioSource: self.list.audioinput ? self.list.audioinput[0] : null,
                    videoSource: self.list.videoinput ? self.list.videoinput[0] : null,
                    micSource: self.list.audiooutput ? self.list.audiooutput[0] : null,
                }
            });
            MediaService.start(self.state.constrains);
        }, 3000);
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
            MediaService.start(this.state.constrains);
        } else if (type == 'speaker') {
            this.state.constrains.audioSource = media;
            MediaService.changeAudioDestination(media);
            this.setState({ musicOn: false });
        } else if (type == 'mic') {
            this.state.constrains.micSource = media;
            MediaService.start(this.state.constrains);
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

    toggleMusic(bool) {
        this.setState({ musicOn: bool });
        MediaService.toggleMusic(bool);
    }

    goBack() {
        MediaService.stop();
        this.props.history.push('/myMeetings');
    }

    joinVisit() {
        // set constrains.
        const data = this.state.constrains;
        localStorage.setItem('selectedPeripherals', JSON.stringify(data));
        MediaService.stop();
        this.props.data.togglePrecheck();
    }


    render() {
        return (
            <div id='container' className="pre-call-check-page">
                 <div className="pre-call-check-header row m-0">
                    <div className="col-md-8 banner-content">
                        <div className="logo"></div>
                        <div className="title">
                            <p className="m-0">Video Visits</p>
                            <p className="text-uppercase m-0 sub-title">The Permanente Medical Group</p>
                        </div>
                    </div>
                    <div className="col-md-4 links text-right">
                        <ul>
                            <li><a href="https://mydoctor.kaiserpermanente.org/ncal/videovisit/#/faq/mobile" className="help-link" target="_blank">Help</a></li>
                        </ul>
                    </div>
                  </div>
                  <div className="row mobile-logo-container m-0"><div className="col-12 mobile-tpmg-logo"></div><p className="col-12 header">Video Visits</p></div>
                 <div className="pre-call-check-content">
                     <div className="row pre-call-check">
                         <div className="col-md-5 peripheral-options p-0">
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
                                 <div className="mic-nodes-container">
                                    <div className="background-nodes" id="playNodes"></div>
                                 </div>
                             </div>
                             <div className="periheral-container">
                                 <div className="label">Speaker</div>
                                 <div className="dropdown show">
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
                                 </div>
                                 <div className="speaker-playback">
                                     <audio id="playBackAudioFile"></audio>
                                     {this.state.musicOn ? (
                                         <button className="btn playback-button pause" onClick={this.toggleMusic.bind(this, false)}>
                                             <span className="pause-icon"></span>
                                             <span className="text">Pause Sound</span>
                                         </button>
                                    ) : (
                                         <button className="btn playback-button play" onClick={this.toggleMusic.bind(this, true)}>
                                             <span className="play-icon"></span>
                                             <span className="text">Play Sound</span>
                                         </button>
                                    )}
                                 </div>
                             </div>
                         </div>
                         <div className="col-md-5 video-preview"><video id="preview" playsInline autoPlay></video></div>
                         <div className="col-md-12 button-controls text-center">
                           <button className="btn rounded-0 mr-3" onClick={this.goBack}>Back</button>
                           <button className="btn rounded-0" onClick={this.joinVisit}>Join</button>
                         </div>
                     </div>
                 </div>
            </div>
        )
    }
}

export default PreCallCheck;