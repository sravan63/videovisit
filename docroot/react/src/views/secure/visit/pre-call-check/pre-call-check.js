import React from "react";
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import $ from 'jquery';
import Popper from 'popper.js';

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
        this.state = { userDetails: {}, showPage: false, showLoader: true, data: {}, media: {}, constrains: {} };
        this.goBack = this.goBack.bind(this);
        this.joinVisit = this.joinVisit.bind(this);
    }

    componentDidMount() {
        // this.interval = setInterval(() => this.getMyMeetings(), 180000);
        if (localStorage.getItem('userDetails')) {
            this.state.userDetails = JSON.parse(localStorage.getItem('userDetails'));
            if (this.state.userDetails) {
                this.setState({ showPage: true });
            }
        } else {
            this.props.history.push('/login');
        }
        this.list = MediaService.getMediaList();
        var self = this;
        setTimeout(function() {
            self.setState({ media: self.list });
            self.setState({
                constrains: {
                    audioSource: self.list.audioinput[0],
                    videoSource: self.list.videoinput[0],
                    micSource: self.list.audiooutput[0]
                }
            });
        }, 1000);

        MediaService.start(this.state.constrains);
        console.log(this.list);
    }

    toggleOpen(type) {
        console.log('DD :: ' + type);
        this.setState({
            data: {
                isVideo: type == 'video',
                isAudio: type == 'audio',
                isSpeaker: type == 'speaker',
            }
        });
    }

    selectPeripheral(media) {
        console.log('SELECTED MEDIA IS :: ' + media);
        this.setState({
            constrains: {
                audioSource: media,
                videoSource: media
            }
        });
    }

    goBack() {
        MediaService.stop();
        this.props.history.push('/myMeetings');
    }

    joinVisit() {
        MediaService.stop();
        this.props.data.togglePrecheck();
    }


    render() {
        return (
            <div id='container' className="pre-call-check-page">
                 <Header/>
                 <div className="pre-call-check-content">
                     <div className="row pre-call-check">
                         <div className="col-md-5 options p-0">
                             <div className="label">Camera</div>
                             <div className="dropdown show">
                                  <a className="btn col-md-12 dropdown-toggle rounded-0" href="#" role="button" data-toggle="dropdown" onClick={this.toggleOpen.bind(this,'video')}>
                                    {this.state.constrains.videoSource ? this.state.constrains.videoSource.label : ''}
                                  </a>
                                  <div className={this.state.data.isVideo ? 'dropdown-menu show' : 'dropdown-menu'} aria-labelledby="dropdownMenuButton">
                                    { this.state.media.videoinput && this.state.media.videoinput.length > 0 ? 
                                        this.state.media.videoinput.map((item,key) =>{
                                        return (
                                            <a className="dropdown-item" key={key} onClick={this.selectPeripheral.bind(this,item)}>{item.label}</a>
                                        )
                                    }) 
                                     : ('') 
                                    }
                                  </div>
                             </div>
                             <div className="label">Microphone</div>
                             <div className="dropdown show">
                                  <a className="btn col-md-12 dropdown-toggle rounded-0" href="#" role="button" data-toggle="dropdown" onClick={this.toggleOpen.bind(this,'audio')}>
                                    {this.state.constrains.audioSource ? this.state.constrains.audioSource.label : ''}
                                  </a>
                                  <div className={this.state.data.isAudio ? 'dropdown-menu show' : 'dropdown-menu'} aria-labelledby="dropdownMenuButton">
                                    { this.state.media.audioinput && this.state.media.audioinput.length > 0 ? 
                                        this.state.media.audioinput.map((item,key) =>{
                                        return (
                                            <a className="dropdown-item" key={key} onClick={this.selectPeripheral.bind(this,item)}>{item.label}</a>
                                        )
                                    }) 
                                     : ('') 
                                    }
                                  </div>
                             </div>
                             <div className="label">Speaker</div>
                             <div className="dropdown show">
                                  <a className="btn col-md-12 dropdown-toggle rounded-0" href="#" role="button" data-toggle="dropdown" onClick={this.toggleOpen.bind(this,'speaker')}>
                                    {this.state.constrains.micSource ? this.state.constrains.micSource.label : ''}
                                  </a>
                                  <div className={this.state.data.isSpeaker ? 'dropdown-menu show' : 'dropdown-menu'} aria-labelledby="dropdownMenuButton">
                                    { this.state.media.audiooutput && this.state.media.audiooutput.length > 0 ? 
                                        this.state.media.audiooutput.map((item,key) =>{
                                        return (
                                            <a className="dropdown-item" key={key} onClick={this.selectPeripheral.bind(this,item)}>{item.label}</a>
                                        )
                                    }) 
                                     : ('') 
                                    }
                                  </div>
                             </div>
                         </div>
                         <div className="col-md-5 video-preview"><video playsInline autoPlay></video></div>
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