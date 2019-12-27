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

}
export default new MediaService();