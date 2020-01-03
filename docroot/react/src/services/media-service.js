import React from 'react';
import Axios from 'axios-observable';
import DeviceService from './device-peripheral-service.js';
import Utilities from './utilities-service.js';

import { range } from 'rxjs';
import { map, filter } from 'rxjs/operators';

class MediaService extends React.Component {

    constructor() {
        super();
        this.state = { mediaData: {}, selectedConstrain : {} };
        this.mediaData = {};
        this.drawNewCanvas = true;
        this.loadDeviceMediaData = this.loadDeviceMediaData.bind(this);
        this.loadDeviceMediaData();
    }
    
    // Initiates the device load
    loadDeviceMediaData(){
      var browserInfo = Utilities.getBrowserInformation();
      if(browserInfo.isSafari || browserInfo.isFireFox) {
        navigator.mediaDevices.getUserMedia({audio:true,video:true}).then((stream)=>{
             console.log('Stream1 started with success');
             this.setDevice();
         }).catch((error)=>{ 
             this.handleError(error);
             console.log('Failed to start stream1');
         });
      } else {
        navigator.mediaDevices.enumerateDevices().then((list)=>{
            this.gotDevicesList(list);
        }).catch((error)=>{
            this.handleError(error);
        });
      }
      // Registers the devie change handler.
      navigator.mediaDevices.ondevicechange = this.onDeviceChange;
    }

    setDevice(){
     navigator.mediaDevices.enumerateDevices().then((list)=>{
       this.gotDevicesList(list)
     }).catch((error)=>{
       this.handleError(error)
     });
    }

    // Gets the list of devices on load.
    gotDevicesList(devices){
        this.sergigateMediaByKind(devices);
        devices.map(media => {
            this.mediaData[media.kind].push(media);
        });
        console.log('Media Service - List Of Media Devices :: ' + this.mediaData);
    }
  
  // Error call back.
    handleError(error){
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

    // Triggers when a device is plugged in or plugged out.
    onDeviceChange(event){
      if(browserInfo.OSName.toLowerCase() !== "windows"){
        console.log("DEVICE CHANGE EVENT TRIGGERED");
        navigator.mediaDevices.enumerateDevices();
        this.start(this.state.selectedConstrain);
      }
    }

    // Chages the microphone on dropdown change.
    changeAudioDestination(speaker) {
      var audioDestination = speaker.deviceId;
      var videoElement = document.getElementById('preview');
      DeviceService.helperRingtoneStop();
      this.attachSinkId(videoElement, audioDestination);
    }

    // Attach audio output device to video element using device/sink ID.
    attachSinkId(element, sinkId) {
      if (typeof element.sinkId !== 'undefined') {
        element.setSinkId(sinkId)
        .then(function() {
          console.log('Success, audio output device attached: ' + sinkId);
        })
        .catch(function(error) {
          var errorMessage = error;
          if (error.name === 'SecurityError') {
            errorMessage = 'You need to use HTTPS for selecting audio output ' +
                'device: ' + error;
          }
          console.error(errorMessage);
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

}
export default new MediaService();