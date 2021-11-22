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
import * as WebUI from '../../../../pexip/complex/webui.js';
import Utilities from '../../../../services/utilities-service.js';
import MediaService from '../../../../services/media-service.js';
import { MessageService } from '../../../../services/message-service';
import GlobalConfig from '../../../../services/global.config';
import './pre-call-check.less';
import Footer from '../../../../components/footer/footer';
import VVModal from "../../../../modals/simple-modal/modal";
import Langtranslation from "../../../../components/lang-translation/lang-translation";
class PreCallCheck extends React.Component {

    constructor(props) {
        super(props);
        this.interval = '';
        this.list = [];
        this.state = { userDetails: {},renderView:false, staticData:{precall:{}}, chin:'中文',span:'Español',showPage: false, showLoader: true, data: {}, media: {}, constrains: {}, musicOn: false,mdoHelpUrl:'' };
        this.goBack = this.goBack.bind(this);
        this.joinVisit = this.joinVisit.bind(this);
        let data = Utilities.getLang();
        this.permissionRequiredContent = {
            heading: data.errorCodes.CameraAccessPermissionMsg,
            message: data.errorCodes.VisitStartNotificationMsg,
            type: 'Permission'
        };
        this.noDevicesFound = {
            heading: data.errorCodes.NoDeviceFoundHeader,
            message: data.errorCodes.NoDeviceFoundMsg,
            type: 'Permission'
        };
        this.permissionDeniedForSafari={
            heading: data.errorCodes.CameraAccessBlockHeader,
            message: data.errorCodes.CameraAccessBlockSafariMsg,
            type: 'Denied'
        };
        this.permissionDeniedforFirefox={
            heading: data.errorCodes.CameraAccessBlockHeader,
            message: data.errorCodes.CameraAccessBlockDefaultMsg,
            type: 'Denied',
        };
    }

    componentDidMount() {
        this.subscription = MessageService.getMessage().subscribe((message, data) => {
            switch (message.text) {
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
                    const constrains = {
                        audioSource: this.list.audioinput ? this.list.audioinput[0] : null,
                        videoSource: this.list.videoinput ? this.list.videoinput[0] : null,
                    };
                    MediaService.start(constrains);
                    break;
                case GlobalConfig.MEDIA_PERMISSION:
                    var modalData;
                    if(message.data=='denied'){
                        let browserInfo = Utilities.getBrowserInformation();
                        if (browserInfo.isSafari) {
                            modalData = this.permissionDeniedForSafari;
                        }
                        else if(browserInfo.isFireFox){
                            modalData = this.permissionDeniedforFirefox;
                        }
                    }
                    else if(message.data==='prompt-no-Devices'){
                        modalData = this.noDevicesFound;
                    }
                    else{
                        modalData = this.permissionRequiredContent;
                    }
                    MessageService.sendMessage(GlobalConfig.OPEN_MODAL, modalData);
                    break;
                case GlobalConfig.RENDER_VIDEO_DOM:
                    if(message.data=='preCallCheck') {
                        this.setState({renderView: true});
                    }
                    break;
            }
        });
        if (localStorage.getItem('userDetails')) {
            this.state.userDetails = JSON.parse(Utilities.decrypt(localStorage.getItem('userDetails')));
            if (this.state.userDetails) {
                this.setState({ showPage: true });
                MediaService.loadDeviceMediaData();
            }
            sessionStorage.setItem('preCallCheckLoaded',true);
        } else {
            this.props.history.push(GlobalConfig.LOGIN_URL);
        }
        if(localStorage.getItem('helpUrl')){
            var helpUrl = localStorage.getItem('helpUrl');
            this.setState({ mdoHelpUrl: helpUrl });
        }
        //this.getBrowserBlockInfo();
        this.getLanguage();
        this.subscription = MessageService.getMessage().subscribe((message) => {
            if(message.text==GlobalConfig.LANGUAGE_CHANGED){
                this.getLanguage();
            }
        }); 
    }
    /*getBrowserBlockInfo(){
        var propertyName = 'browser',
            url = "loadPropertiesByName.json",
            browserNames = '';
        BackendService.getBrowserBlockDetails(url, propertyName).subscribe((response) => {
            if (response.data && response.status == '200') {
                 browserNames = response.data; 
                 this.setState({ mdoHelpUrl: response.data.mdoHelpUrl });
            } else {
                // Do nothing
            }
        }, (err) => {
            console.log("Error");
        });
    }*/
    toggleOpen(type) {
        this.setState({
            data: {
                isVideo: type == 'video',
                isAudio: type == 'audio',
                isSpeaker: type == 'speaker',
            }
        });
    }

    componentWillUnmount() {
        window.location.reload(false);
        this.subscription.unsubscribe();
    }

    selectPeripheral(media, type) {
        if (type == 'camera') {
            this.state.constrains.videoSource = media;
            const constrains = {
                videoSource: this.state.constrains.videoSource,
                audioSource: this.state.constrains.micSource,
            };
            MediaService.start(constrains);
            WebUI.switchDevices('camera', media,"pct");
        } else if (type == 'speaker') {
            this.state.constrains.audioSource = media;
            MediaService.changeAudioDestination(media);
            this.setState({ musicOn: false });
            WebUI.switchDevices('speaker', media,"pct");
        } else if (type == 'mic') {
            this.state.constrains.micSource = media;
            const constrains = {
                videoSource: this.state.constrains.videoSource,
                audioSource: this.state.constrains.micSource,
            };
            MediaService.start(constrains);
            WebUI.switchDevices('microphone', media,"pct");
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
        WebUI.log("info","pct_back_button_clicked","event: Back button is triggered inside Pre call test page");
        var isInstantJoin = sessionStorage.getItem('isInstantJoin');
        var isGuest = localStorage.getItem('isGuest');
        if (isGuest == "true") {
            this.props.history.push('/guestlogin?meetingcode=' + this.state.userDetails.meetingCode);
        } else if(isInstantJoin){
            this.props.history.push('/login');
        } else {
            this.props.history.push('/myMeetings');
        }
    }

    joinVisit() {
        // set constrains.
        WebUI.log("info","pct_join_button_clicked","event: Join button is triggered inside Pre call test page");
        const data = this.state.constrains;
        localStorage.setItem('selectedPeripherals', JSON.stringify(data));
        MediaService.stop();
        this.props.data.togglePrecheck();
    }
    getLanguage(){
        let data = Utilities.getLang();
        if(data.lang=='spanish'){
            this.setState({span:'English',chin: '中文',staticData: data});
        }
        else if(data.lang=='chinese'){
            this.setState({chin:'English',span:'Español',staticData: data});
        }
        else {
            this.setState({span: "Español", chin: '中文',staticData: data});
        }

    }
    changeLang(event){
        let value = event.target.textContent;
        if(value=="中文"){
            sessionStorage.setItem('Instant-Lang-selection','chinese');
            Utilities.setLang('chinese');
        }
        else if(value=="Español"){
            sessionStorage.setItem('Instant-Lang-selection','spanish');
            Utilities.setLang('spanish');
         }
        else{
            sessionStorage.setItem('Instant-Lang-selection','english');
            Utilities.setLang('english');
        }
    }

    render() {
        let Details = this.state.staticData;
        return (
            <div>
            <VVModal />
            <div id='container' className="pre-call-check-page" style={{background: this.state.renderView ? '#F0F4F7' : '#000000'}} >
                 <div className="pre-call-check-header row m-0">
                    <div className="col-md-8 banner-content">
                        <div className="logo"></div>
                        <div className="title">
                            <p className="m-0">{Details.videoVisits}</p>
                            <p className="text-uppercase m-0 sub-title">The Permanente Medical Group</p>
                        </div>
                    </div>
                    <div className="col-md-4 links text-right">
                        <ul>
                            <li>
                            <a href={Details.HelpLink} className="help-link" target="_blank">{Details.Help}</a>
                            <Langtranslation />   
                        </li>
                        </ul>
                    </div>
                  </div>
                  <div className="row mobile-logo-container m-0"><div className="col-12 mobile-tpmg-logo"></div><p className="col-12 header">Video Visits</p></div>
                 <div className="pre-call-check-content" style={{visibility: this.state.renderView ? 'visible' : 'hidden'}}>
                     <div className="row pre-call-check">
                         <div className="col-lg-5 col-md-7 peripheral-options p-0">
                             <div className="periheral-container">
                                 <div className="label">{Details.precall.Camera}</div>
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
                                 <div className="label">{Details.precall.Microphone}</div>
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
                                 <div className="label">{Details.precall.Speaker}</div>
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
                                 <div className="speaker-playback">
                                     <audio id="playBackAudioFile"></audio>
                                     {this.state.musicOn ? (
                                         <button className="btn playback-button pause" onClick={this.toggleMusic.bind(this, false)}>
                                             <span className="pause-icon"></span>
                                             <span className="text">{Details.precall.PauseSound}</span>
                                         </button>
                                    ) : (
                                         <button className="btn playback-button play" onClick={this.toggleMusic.bind(this, true)}>
                                             <span className="play-icon"></span>
                                             <span className="text">{Details.precall.PlaySound}</span>
                                         </button>
                                    )}
                                 </div>
                             </div>
                         </div>
                         <div className="col-lg-5 col-md-5 video-preview"><video id="preview" playsInline autoPlay></video></div>
                         <div className="col-md-12 button-controls text-center">
                           <button className="btn rounded-0 mr-3" onClick={this.goBack}>{Details.precall.Back}</button>
                           <button className="btn rounded-0" onClick={this.joinVisit}>{Details.precall.Join}</button>
                         </div>
                     </div>
                 </div>
                 <div className="form-footer">
                        <Footer />
                    </div>
            </div>
            </div>
        )
    }
}

export default PreCallCheck;
