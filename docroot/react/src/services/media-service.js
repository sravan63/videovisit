import React from 'react';
import Axios from 'axios-observable';
import DeviceService from './device-peripheral-service.js';
import Utilities from './utilities-service.js';
import { MessageService } from './message-service';
import GlobalConfig from './global.config';
import { range } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import * as WebUI from "../pexip/complex/webui";

class MediaService extends React.Component {

    constructor() {
        super();
        this.state = { mediaData: {},cameraAllowed:false,micAllowed:false,camBlocked:false, selectedConstrain : {} };
        this.mediaData = {};
        this.drawNewCanvas = true;
        this.isDeviceChange = false;
        this.speaker = null;
        this.onDeviceChange = this.onDeviceChange.bind(this);
        this.loadDeviceMediaData = this.loadDeviceMediaData.bind(this);
    }

    // Initiates the device load
    loadDeviceMediaData(){
      var browserInfo = Utilities.getBrowserInformation();
      var isSetup = sessionStorage.getItem('isSetupPage');
      if(!browserInfo.isIE){
        if(browserInfo.isSafari || browserInfo.isFireFox) {
            if (!Utilities.isMobileDevice() &&  browserInfo.isFireFox ) {
                MessageService.sendMessage(GlobalConfig.MEDIA_PERMISSION, 'prompt');
            }
            if (isSetup =='true') {
                navigator.mediaDevices.getUserMedia({audio: true, video: false}).then((stream) => {
                    console.log('Stream1 started with success');
                    window.localStream = stream;
                    this.setDevice();
                }).catch((error) => {
                    this.handleError(error);
                    console.log('Failed to start stream1');
                });
            } else {
                navigator.mediaDevices.getUserMedia({audio: true, video: true}).then((stream) => {
                    console.log('Stream1 started with success');
                    window.localStream = stream;
                    this.setDevice();
                }).catch((error) => {
                    this.handleError(error);
                    console.log('Failed to start stream1');
                });
            }
        } else {
          navigator.mediaDevices.enumerateDevices().then((list)=>{
              this.gotDevicesList(list);
          }).catch((error)=>{
              this.handleError(error);
          });
        }

        // Registers the device change handler.

      }
    }

    setDevice(){
        MessageService.sendMessage(GlobalConfig.CLOSE_MODAL_AUTOMATICALLY, null);
        MessageService.sendMessage(GlobalConfig.RENDER_VIDEO_DOM, 'preCallCheck');
        navigator.mediaDevices.enumerateDevices().then((list)=>{
            this.gotDevicesList(list.slice(0));
        }).catch((error)=>{
            this.handleError(error)
        });
    }

    stopAudio(){
      if(window.localStream) {
          localStream.getTracks().forEach((track) => {
              track.stop();
          });
      }
    }

    // Gets the list of devices on load.
    gotDevicesList(devices){
        if(devices.length == 0){
            MessageService.sendMessage(GlobalConfig.MEDIA_PERMISSION, 'prompt-no-Devices');
            return;
        }
        if(devices.length !=0 ){
            let micsDetected = [];
            let camDetected = [];
            devices.forEach((val)=>{
                if(val.kind && val.kind === 'audioinput'){
                    micsDetected.push(val.groupId);
                }
                else if(val.kind && val.kind === 'videoinput'){
                    camDetected.push(val.groupId)
                }
            });
            if(micsDetected.length == 0 || camDetected.length == 0){
                MessageService.sendMessage(GlobalConfig.MEDIA_PERMISSION, 'prompt-no-Devices');
                return;
            }
        }
        this.sergigateMediaByKind(devices);
        devices.map(mData => {
          const media = {};
          if( mData.label == '' ){
            var dummy = mData.kind == 'videoinput' ? 'Camera ' : mData.kind == 'audioinput' ? 'Microphone ' : 'Speaker ';
            dummy += this.mediaData[mData.kind].length + 1;
            media['label'] = dummy;
          } else {
            media['label'] = mData.label;
          }
          media['deviceId'] = mData.deviceId;
          media['kind'] = mData.kind;
          this.mediaData[media.kind].push(media);
        });

        localStorage.removeItem('campermission');
        let isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        let isSetup = sessionStorage.getItem('isSetupPage');
        if(isChrome && !Utilities.isMobileDevice()) {
            setTimeout(()=>{
                this.cameraPermissions();
                this.micPermissions();
            },1600);
        }
        console.log('Media Service - List Of Media Devices :: ' + this.mediaData);
        this.removeInvalidDevices();
        if( this.isDeviceChange ){
          MessageService.sendMessage(GlobalConfig.UPDATE_MEDIA_DEVICES, this.mediaData);
        } else {
          MessageService.sendMessage(GlobalConfig.MEDIA_DATA_READY, this.mediaData);
        }
    }

    resetDeviceChangeFlag(){
      this.isDeviceChange = false;
    }

    removeInvalidDevices() {
      for(var m in this.mediaData) {
        const media = this.mediaData[m];
        for(var i=media.length-1; i>=0; i--){
          const mData = media[i];
          if( !Utilities.checkForValidMediaDevice(mData.deviceId) && mData.deviceId !== '' ) {
            media.splice(i,1);
          }
        }
      }
    }

  // Error call back.
    handleError(error){
        WebUI.log("info","handle_error_called_on_media_permission","event: Error" + error);
        let isSetup = sessionStorage.getItem('isSetupPage');
        var ErrorMsg = error.message,
            browserInfo = Utilities.getBrowserInformation();
        if(ErrorMsg =='Failed starting capture of a audio track' || ErrorMsg == 'The I/O read operation failed.'){
            alert("Unable to join: Looks like you're on a phone call, hangup and refresh page to join.");
        }
        if(browserInfo.isSafari || browserInfo.isFireFox) {
            if (error.name == 'NotAllowedError') {
                    MessageService.sendMessage(GlobalConfig.MEDIA_PERMISSION, 'denied');
                }
        }
        if (error.name && error.name == 'NotFoundError') {
                MessageService.sendMessage(GlobalConfig.MEDIA_PERMISSION, 'prompt-no-Devices');
        }
        console.log('Media Service - Error Occured :: '+error);
    }

    // Segregates the media by type.
    sergigateMediaByKind(devices){
        devices.map(media => {
            this.mediaData[media.kind] = [];
        });
    }

    // Returns the list of media devices.
    getMediaList(){
        return this.mediaData;
    }

    getCurrentSpeakerDevice(){
        return this.speaker;
    }

    // Triggers when a device is plugged in or plugged out.
    onDeviceChange(event){
      console.log("DEVICE CHANGE EVENT TRIGGERED");
      if( !this.isDeviceChange ) {
          WebUI.log("info","device_pluggedIn_pluggedOut","event: A new device is plugged in or an existing device is plugged out inside conference page");
          if( !Utilities.isMobileDevice() ){
              MessageService.sendMessage(GlobalConfig.RESET_MEDIA_DEVICES, null);
              this.isDeviceChange = true;
              this.loadDeviceMediaData();
            } else {
              MessageService.sendMessage(GlobalConfig.RECONNECT_ON_DEVICE_CHANGE, null);
              this.isDeviceChange = true
          }
      }
    }

    // Chages the microphone on dropdown change.
    changeAudioDestination(speaker, dom='preview') {
      this.speaker = speaker;
      var audioDestination = speaker.deviceId;
      var videoElement = document.getElementById(dom);
      DeviceService.helperRingtoneStop();
      this.attachSinkId(videoElement, audioDestination);
    }

    // Attach audio output device to video element using device/sink ID.
    attachSinkId(element, sinkId) {
        WebUI.log("info","speaker_change_method_invoke","event: linking selected speaker device id to the video element");
        if (typeof element.sinkId !== 'undefined') {
        element.setSinkId(sinkId)
        .then(function() {
            WebUI.log("info","speaker_change_method_success","event: Success, speaker device id successfully linked to the video element: " + sinkId);
            console.log('Success, audio output device attached: ' + sinkId);
        })
        .catch(function(error) {
          var errorMessage = error;
          if (error.name === 'SecurityError') {
            errorMessage = 'You need to use HTTPS for selecting audio output ' +
                'device: ' + error;
          }
          else if(error.name == 'AbortError' || error.name=='NotFoundError'){
              MessageService.sendMessage(GlobalConfig.OPEN_MODAL, {
                  type:"denied",
                  heading: 'Unable to switch Speaker',
                  message : "There's an issue with your audio device, please refresh the page",
              });
          }
          else if(errorMessage == 'DOMException: Requested device not found' || errorMessage == 'DOMException: The operation could not be performed and was aborted'){
            // speaker is not compatible
            for(var i=this.mediaData['audiooutput'].length-1; i >=0; i--){
              const speaker = this.mediaData['audiooutput'][i];
              if( sinkId == speaker.deviceId ){
                this.mediaData['audiooutput'].splice(i,1);
              }
            }
            console.log('DEVICE GONE ABRUPTLY');
            // MessageService.sendMessage(GlobalConfig.UPDATE_MEDIA_DEVICES, this.mediaData);
          }
          WebUI.log("error","speaker_change_method_failure","event: Failed to link the speaker device id with video element. Error : " + errorMessage);
            // console.error(errorMessage);
        });
      } else {
        console.warn('Browser does not support output device selection.');
      }
    }

    // Starts the vide, audio and microphone stream.
    start(constrains) {
      if (window.stream) {
        window.stream.getTracks().forEach(function(track) {
          track.stop();
        });
      }
      this.state.selectedConstrain = constrains;
      var constraints = {
        audio: {deviceId: constrains.audioSource ? {exact: constrains.audioSource.deviceId} : undefined},
        video: {deviceId: constrains.videoSource ? {exact: constrains.videoSource.deviceId} : undefined}
      };
      navigator.mediaDevices.getUserMedia(constraints).then((stream)=>{
            this.gotStream(stream);
        }).catch((error)=>{
            this.handleError(error);
        });
    }

    // Stream success callback.
    gotStream(stream) {
        var videoElement = document.querySelector('video');
        window.stream = stream; // make stream available to console
        videoElement.srcObject = stream;
        videoElement.volume = 0;
        // Start audio block
        if(this.drawNewCanvas){
            DeviceService.addCanvas();
            this.drawNewCanvas = false;
        }
        DeviceService.micTest();
        // Refresh button list in case labels have become available
        return navigator.mediaDevices.enumerateDevices();
    }
    // Force stop of the stream
    stop(){
        if (window.stream) {
            window.stream.getTracks().forEach(function(track) {
                track.stop();
                DeviceService.helperRingtoneStop();
            });
        }
    }

    // Playback related code
    toggleMusic(canPlay){
        if(canPlay){
            DeviceService.helperRingtonePlay();
        } else {
            DeviceService.helperRingtoneStop();
        }
    }
    cameraPermissions(){
        var self = this;
        navigator.permissions.query(
            { name: 'camera' }
        ).then((permissionStatus)=>{
            console.log(permissionStatus.state); // granted, denied, prompt

            if(permissionStatus.state == 'granted'){
                self.state.cameraAllowed = true;
                localStorage.setItem('campermission', true);
                if(self.state.micAllowed==true) {
                    //MessageService.sendMessage(GlobalConfig.RENDER_VIDEO_DOM, true);
                }
            } else  if(permissionStatus.state == 'denied'){
                self.state.camBlocked = true;
                MessageService.sendMessage(GlobalConfig.MEDIA_PERMISSION, 'denied');
                localStorage.setItem('campermission', true);
            }
            else {
                MessageService.sendMessage(GlobalConfig.MEDIA_PERMISSION, 'prompt');
            }

            permissionStatus.onchange = (event)=>{
                const state = event.currentTarget.state;
                console.log("Permission changed to " + state);
                if(state == 'denied'){
                    MessageService.sendMessage(GlobalConfig.MEDIA_PERMISSION, 'denied');
                } else if(state == 'granted'){
                    var deniedError  = document.getElementsByClassName('selectIcon').length;
                    if(deniedError == 0){
                        MessageService.sendMessage(GlobalConfig.CLOSE_MODAL_AUTOMATICALLY, null);
                        //MessageService.sendMessage(GlobalConfig.RENDER_VIDEO_DOM, true);
                    }
                    this.isDeviceChange = true;
                    this.loadDeviceMediaData();
                    //MessageService.sendMessage(GlobalConfig.CLOSE_MODAL_AUTOMATICALLY, null);
                    //MessageService.sendMessage(GlobalConfig.RENDER_VIDEO_DOM, true);
                }
            }
        });
    }

    micPermissions(){
        var self = this;
        navigator.permissions.query(
            { name: 'microphone' }
        ).then((permissionStatus)=>{
            console.log(permissionStatus.state); // granted, denied, prompt

            if(permissionStatus.state === 'granted') {
                self.state.micAllowed=true;
                if(self.state.cameraAllowed==true) {
                    //MessageService.sendMessage(GlobalConfig.RENDER_VIDEO_DOM, true);
                }
            }
            else  if(permissionStatus.state == 'denied'){
                MessageService.sendMessage(GlobalConfig.MEDIA_PERMISSION, 'denied');
            }
            else {
                if(self.state.camBlocked != true) {
                    MessageService.sendMessage(GlobalConfig.MEDIA_PERMISSION, 'prompt');
                }
            }

            permissionStatus.onchange = (event)=>{
                const state = event.currentTarget.state;
                console.log("Permission changed to " + state);
                if(state == 'denied'){
                    MessageService.sendMessage(GlobalConfig.MEDIA_PERMISSION, 'denied');
                } else if(state == 'granted'){
                    var deniedError  = document.getElementsByClassName('selectIcon').length;
                    if(deniedError == 0){
                        MessageService.sendMessage(GlobalConfig.CLOSE_MODAL_AUTOMATICALLY, null);
                        //MessageService.sendMessage(GlobalConfig.RENDER_VIDEO_DOM, true);
                    }
                    //MessageService.sendMessage(GlobalConfig.CLOSE_MODAL_AUTOMATICALLY, null);
                    //MessageService.sendMessage(GlobalConfig.RENDER_VIDEO_DOM, true);
                }
            }
        });
    }

}
export default new MediaService();
