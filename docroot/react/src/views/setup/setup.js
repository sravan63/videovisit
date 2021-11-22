import React from "react";
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import $ from 'jquery';
import Popper from 'popper.js';

import { range } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import VVModal from '../../modals/simple-modal/modal';
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
import Langtranslation from "../../components/lang-translation/lang-translation";
import './setup.less';

class Setup extends React.Component {

    constructor(props) {
        super(props);
        this.interval = '';
        this.list = [];
        this.state = { data: {},isSafari15_1:false,userDetails: {},staticData:{}, chin:'中文',span:'Español', media: {}, constrains: {}, startTest: false, loadingSetup: false ,isBrowserBlockError: false,mdoHelpUrl:'',isChromecheck: false};
        this.joinVisit = this.joinVisit.bind(this);
        this.startTest = this.startTest.bind(this);
        this.getLanguage();
        let data = UtilityService.getLang();
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
        this.permissionDeniedContent={
            heading: data.errorCodes.CameraAccessBlockHeader,
            message: data.errorCodes.CameraAccessBlockDefaultMsg,
            type: 'Denied',
        };
        this.permissionDeniedForSafari={
            heading: data.errorCodes.CameraAccessBlockHeader,
            message: data.errorCodes.CameraAccessBlockSafariMsg,
            type: 'Denied'
        };
        this.permissionDeniedMobile={
            heading: data.errorCodes.CameraAccessBlockHeader,
            message: data.errorCodes.CameraAccessBlockMobileMsg,
            type: 'Denied'
        }
    }

    componentDidMount() {
        var nonSafari = /CriOS|FxiOS/.test(navigator.userAgent);
        if(nonSafari){
          this.getBrowserBlockInfo();
          return false;
        }
        sessionStorage.setItem('isSetupPage', true);        
        navigator.mediaDevices.addEventListener('devicechange',()=>{
            MediaService.onDeviceChange();
        });
        this.subscription = MessageService.getMessage().subscribe((message, data) => {
            switch (message.text) {
                case GlobalConfig.TEST_CALL_FINISHED:
                    this.doneSetupTest();
                    break;
                case GlobalConfig.UPDATE_MEDIA_DEVICES:
                    this.displayDevices(message.data);
                    MediaService.resetDeviceChangeFlag();
                    break;
                case GlobalConfig.MEDIA_DATA_READY:
                    this.displayDevices(message.data);
                    break;
                case GlobalConfig.LANGUAGE_CHANGED:
                    this.getLanguage();
                    break;
                case GlobalConfig.MEDIA_PERMISSION:
                    var modalData;
                    var browserInfo = UtilityService.getBrowserInformation();
                    if(message.data=='denied'){                        
                        if (browserInfo.isSafari) {
                            modalData = this.permissionDeniedForSafari;
                            MessageService.sendMessage(GlobalConfig.OPEN_MODAL, modalData);
                        }
                        else {
                            if(UtilityService.isMobileDevice()){
                                modalData = this.permissionDeniedMobile;
                            }
                            else {
                                modalData = this.permissionDeniedContent;
                            }
                        }                        
                    }
                    else if(message.data==='prompt-no-Devices'){
                        modalData = this.noDevicesFound;
                        this.NoDevices = true;
                    }
                    else{
                        modalData = this.permissionRequiredContent;
                    }
                    if (this.state.isChromecheck) {
                        MessageService.sendMessage(GlobalConfig.OPEN_MODAL, modalData);
                        return;
                    }
                    if(!browserInfo.isChrome && !browserInfo.isSafari){
                        MessageService.sendMessage(GlobalConfig.OPEN_MODAL, modalData);
                    }
                    break;    
            }
        });
        
        this.getBrowserBlockInfo();
        this.getLanguage();
        MediaService.loadDeviceMediaData();
    }

    componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
        window.location.reload();
        sessionStorage.removeItem('isSetupPage');
    }

    displayDevices(data){
        this.list = data;
        this.setState({ media: this.list });
        this.setState({
            constrains: {
                audioSource: this.list.audiooutput ? this.list.audiooutput[0] : null,
                videoSource: this.list.videoinput ? this.list.videoinput[0] : null,
                micSource: this.list.audioinput ? this.list.audioinput[0] : null,
            }
        });
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
                     let isSafari15_1 = UtilityService.getSafariBlocked();
                     this.setState({ isBrowserBlockError: true,isSafari15_1:isSafari15_1 });
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
            WebUI.switchDevices('camera', media,"setupPage");
        } else if (type == 'speaker') {
            this.state.constrains.audioSource = media;
            MediaService.changeAudioDestination(media, 'video');
            WebUI.switchDevices('speaker', media,"setupPage");
        } else if (type == 'mic') {
            this.state.constrains.micSource = media;
            const constrains = {
                videoSource: this.state.constrains.videoSource,
                audioSource: this.state.constrains.micSource,
            };
            WebUI.switchDevices('microphone', media,"setupPage");
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
        var browserInfo = UtilityService.getBrowserInformation();
        setTimeout(() => {
           if(!localStorage.getItem('campermission') && !UtilityService.isMobileDevice()){
                MessageService.sendMessage(GlobalConfig.MEDIA_PERMISSION, 'prompt');
           }    
        }, 2000);        
        this.setState({ loadingSetup: true });        
        if(browserInfo.isSafari || browserInfo.isFireFox) {
          MediaService.stopAudio();
        }
        if(browserInfo.isChrome){
            this.setState({ isChromecheck: true });
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
                    bandwidth = null,
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
    getLanguage(){
        let data = UtilityService.getLang();
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
            UtilityService.setLang('chinese');
        }
        else if(value=="Español"){
            sessionStorage.setItem('Instant-Lang-selection','spanish');
            UtilityService.setLang('spanish');
         }
        else{
            sessionStorage.setItem('Instant-Lang-selection','english');
            UtilityService.setLang('english');
        }
    }
    render() {
        var Details = this.state.staticData;
        if(Details && Details.setup){
            var translateLang = Details.setup;
        }
        return (
            <div id='container' className="setup-page">
                 <Header helpUrl = {this.state.mdoHelpUrl} data={Details}/>
                 <div className="row mobile-help-link">
                 <div className="col-lg-12 col-md-12 help-icon text-right float-left p-0">
                        <a href={Details.HelpLink} className="help-link" target="_blank">{Details.Help}</a>
                        <Langtranslation />
                    </div>
                 </div>
                <div className="row mobile-logo-container">
                 <div className="title">
                      <p className="col-12 m-0 header">Kaiser Permanente</p>
                      <p className="col-12 sub-header">{Details.videoVisits}</p>
                  </div>
                  </div>
                  <VVModal />
                 <div className="setup-content">
                     <div className="row setup">
                     <BrowserBlock browserblockinfo = {this.state}/>
                         <div className="col-md-5 peripheral-options p-0">
                             <div className="periheral-container">
                                 <div className="label">{translateLang && translateLang.Camera}</div>
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
                                 <div className="label">{translateLang && translateLang.Microphone}</div>
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
                                 <div className="label">{translateLang && translateLang.Speaker}</div>
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
                                     <button className="btn rounded-0 btn-primary" onClick={this.startTest} disabled={this.state.isBrowserBlockError}>{translateLang && translateLang.Start}</button>                                        
                                 </div>
                                <div className="preview" style={{display: !this.state.startTest ? 'none' : 'block'}} >
                                    <video id="video" playsInline autoPlay></video>
                                    <div id="selfview" className="selfview">
                                        <video id="selfvideo" autoPlay="autoplay" playsInline="playsinline" muted={true}>
                                        </video>
                                    </div>
                                </div>
                         </div>
                         <div className="col-md-7"></div>
                         <div className="col-md-5 pl-0">
                             <div className="msg-note">{translateLang && translateLang.EquipmentMsgNote}</div>
                         </div>
                         <div className="col-md-12 mt-5 button-controls text-center mb-4">
                           <button className="btn rounded-0" onClick={this.joinVisit} disabled={this.state.loadingSetup || this.state.isBrowserBlockError}>{translateLang && translateLang.Join}</button>
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
