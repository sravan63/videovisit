import React from 'react';
import Axios from 'axios-observable';

class MediaService extends React.Component {

    constructor() {
        super();
        this.state = { mediaData: {} };
        this.mediaData = {};
        this.loadDeviceMediaData = this.loadDeviceMediaData.bind(this);
        this.loadDeviceMediaData();
    }

    loadDeviceMediaData(){
        navigator.mediaDevices.enumerateDevices().then((list)=>{
            this.gotDevicesList(list);
        }).catch((error)=>{
            this.handleError(error);
        });
    }

    gotDevicesList(devices){
        this.sergigateMediaByKind(devices);
        devices.map(media => {
            this.mediaData[media.kind].push(media);
        });
        console.log('Media Service - List Of Media Devices :: ' + this.mediaData);
    }

    handleError(error){
        console.log('Media Service - Error Occured :: '+error);
    }

    sergigateMediaByKind(devices){
        devices.map(media => {
            this.mediaData[media.kind] = [];
        });
    }

    getMediaList(){
        return this.mediaData;
    }

    start(constrains) {
      if (window.stream) {
        window.stream.getTracks().forEach(function(track) {
          track.stop();
        });
      }
      var constraints = {
        audio: {deviceId: constrains.audioSource ? {exact: constrains.audioSource.deviceId} : undefined},
        video: {deviceId: constrains.videoSource ? {exact: constrains.videoSource.deviceId} : undefined}
      };
      navigator.mediaDevices.getUserMedia(constraints).then((stream)=>{
            this.gotStream(stream);
        }).catch((error)=>{
            this.handleError(error);
        });
        // .then(gotStream).then(gotDevices).catch(handleError);
    }

    gotStream(stream) {
      var videoElement = document.querySelector('video');
      window.stream = stream; // make stream available to console
      videoElement.srcObject = stream;
      videoElement.volume = 0;
      // Mic test is only in member-webapp
      // micTest();
      // Refresh button list in case labels have become available
      return navigator.mediaDevices.enumerateDevices();
    }

}
export default new MediaService();