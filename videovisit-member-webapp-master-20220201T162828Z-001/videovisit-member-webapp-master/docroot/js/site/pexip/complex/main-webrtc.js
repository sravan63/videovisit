/*
*  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
*
*  Use of this source code is governed by a BSD-style license
*  that can be found in the LICENSE file in the root of the source
*  tree.
*/

'use strict';
var cameraID;
var audioInputSelect;
var audioOutputSelect;
var videoSelect;
var selectors;
var videoElement = document.querySelector('video');
audioInputSelect = document.getElementById('audioSource');
  audioOutputSelect = document.getElementById('speakerSource');
  videoSelect = document.getElementById('videoSource');
  selectors = [audioInputSelect, audioOutputSelect, videoSelect];
var mobileVideoSources = [];

//audioOutputSelect.disabled = !('sinkId' in HTMLMediaElement.prototype);

function gotDevices(deviceInfos) {
  // Extracts video ids.
  for (var  i = 0; i < deviceInfos.length; i++) {
    var deviceInfo = deviceInfos[i];
    var option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'videoinput') {
      mobileVideoSources.push(option.value);
    } 
  }

  // Keeps only first and last camera ids, if device has more than 2 cameras.
  if(mobileVideoSources.length > 2){
    mobileVideoSources.splice(1,mobileVideoSources.length-2);
  }
  
  configurePexipVideoProperties();
}

$(window).load(function() {
  var appOS = getAppOS();
  if(appOS === 'iOS'){
    navigator.mediaDevices.getUserMedia({audio:true,video:true})
     .then(function(stream){
          console.log('Stream1 started with success');
          setDevice();
      })
      .catch(function(){ 
          console.log('Failed to start stream1')
      });
  }else{
    navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);
  }
});

function setDevice(){
  navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);
 }

// Attach audio output device to video element using device/sink ID.
function attachSinkId(element, sinkId) {
  if (typeof element.sinkId !== 'undefined') {
    element.setSinkId(sinkId)
      .then(() => {
        console.log(`Success, audio output device attached: ${sinkId}`);
      })
      .catch(error => {
        var errorMessage = error;
        if (error.name === 'SecurityError') {
          errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
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
  var audioDestination = audioOutputSelect.value;
  attachSinkId(videoElement, audioDestination);
}

function gotStream(stream) {
  window.stream = stream; // make stream available to console
  videoElement.srcObject = stream;
  // Refresh button list in case labels have become available
  return navigator.mediaDevices.enumerateDevices();
}

function handleError(error) {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
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
  navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(gotDevices).catch(handleError);
}

/*audioInputSelect.onchange = start;
audioOutputSelect.onchange = changeAudioDestination;

videoSelect.onchange = start;*/
