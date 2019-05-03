/*
*  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
*
*  Use of this source code is governed by a BSD-style license
*  that can be found in the LICENSE file in the root of the source
*  tree.
*/

'use strict';

var audioInputSelect;
var audioOutputSelect;
var videoSelect;
var selectors;

var audioSource;
var videoSource;

var cameraID;

var webuiLoaded = false;
var constraints;
var globalConstraints;

var mobileVideoSources = [];
var gotStreamed = false;
var devicesList = [];
var checkForDevices;

function devicesLoaded(deviceInfos) {
  for (var i = 0; i < deviceInfos.length; i++) {
    var deviceInfo = deviceInfos[i];
    if (deviceInfo.kind === 'videoinput') {
      mobileVideoSources.push(deviceInfo.deviceId);
    }
  }

  devicesList = deviceInfos;
  cameraID = mobileVideoSources[0];
}

function handleError(error) {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

navigator.mediaDevices.enumerateDevices().then(devicesLoaded).catch(handleError);

window.addEventListener('load', function(){
  checkForDevices = window.setInterval(function(){
    if(devicesList.length > 0){
      loadDevicesListInSelectDropdowns();
      window.clearInterval(checkForDevices);
    }
  },1000);

  console.log("inside main-2");
  var videoElement = document.querySelector('video');
  audioInputSelect = document.querySelector('select#audioSource');
  audioOutputSelect = document.querySelector('select#speakerSource');
  videoSelect = document.querySelector('select#videoSource');
  selectors = [audioInputSelect, audioOutputSelect, videoSelect];
  

  audioOutputSelect.disabled = !('sinkId' in HTMLMediaElement.prototype);

  function loadDevicesListInSelectDropdowns() {
    console.log("inside GOT-DEVICES");
    
    var values = selectors.map(function(select) {
      return select.value;
    });

    selectors.forEach(function(select) {
      while (select.firstChild) {
        select.removeChild(select.firstChild);
      }
    });

    for (var i = 0; i < devicesList.length; i++) {
      var deviceInfo = devicesList[i];
      var option = document.createElement('option');
      option.value = deviceInfo.deviceId;

      if (deviceInfo.kind === 'audioinput') {
          option.text = deviceInfo.label || 'microphone ' + (audioInputSelect.length + 1);
          audioInputSelect.appendChild(option);
      } else if (deviceInfo.kind === 'audiooutput') {
          option.text = deviceInfo.label || 'speaker ' + (audioOutputSelect.length + 1);
          audioOutputSelect.appendChild(option);
      } else if (deviceInfo.kind === 'videoinput') {
          if(deviceInfo.label != "WebPluginVirtualCamera"){
            option.text = deviceInfo.label || 'camera ' + (videoSelect.length + 1);
            videoSelect.appendChild(option);
          }
      } else {
        console.log('Some other kind of source/device: ', deviceInfo);
      }
    }
    // Testing
      var noOfCameras = 'Number of attached Cameras '+mobileVideoSources.length;
      var cameras = 'List of Cameras '+'\n';
      for(var i=0; i<mobileVideoSources.length;i++){
        cameras += (i+1)+') '+mobileVideoSources[i]+'\n';
      }
      console.log(noOfCameras+'\n'+cameras);
    // Testing

    selectors.forEach(function(select, selectorIndex) {
      if (Array.prototype.slice.call(select.childNodes).some(function(n) {
        return n.value === values[selectorIndex];
      })) {
        select.value = values[selectorIndex];
      }
    });

    start();
  }

  // Attach audio output device to video element using device/sink ID.
  function attachSinkId(element, sinkId) {
    console.log("inside ATTACH-SINK-ID");
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
        // Jump back to first output device in the list as it's the default.
        audioOutputSelect.selectedIndex = 0;
      });
    } else {
      console.warn('Browser does not support output device selection.');
    }
  }

  function changeAudioDestination() {
    console.log("inside CHANGE-AUDIO-DESTINATION");
    var audioDestination = audioOutputSelect.value;
    // var videoElement = document.querySelector('video');
    attachSinkId(videoElement, audioDestination);
  }

  function gotDevicesOnChange(devices){
    console.log('Devices list on change');
  }

  function gotStream(stream) {
    console.log("inside GOT-STREAM");
    window.stream = stream; // make stream available to console
    videoElement.srcObject = stream;
    if(!gotStreamed) {
      configurePexipVideoProperties();
      gotStreamed = true;
    }
    // Refresh button list in case labels have become available
    return navigator.mediaDevices.enumerateDevices();
  }

  function start() {
    if (window.stream) {
      window.stream.getTracks().forEach(track => {
        track.stop();
      });
    }
    var audioSource = audioInputSelect.value;
    var videoSource = videoSelect.value;
    cameraID = videoSource;

    var constraints = {
      audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
      video: {deviceId: videoSource ? {exact: videoSource} : undefined}
    };
    navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(gotDevicesOnChange).catch(handleError);
  }

  audioInputSelect.onchange = start;
  audioOutputSelect.onchange = changeAudioDestination;
  videoSelect.onchange = start;
});
