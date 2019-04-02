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

$(document).ready(function(){
  console.log("inside main-2");
  var videoElement = document.querySelector('video');

  audioInputSelect = document.querySelector('select#audioSource');
  audioOutputSelect = document.querySelector('select#speakerSource');
  videoSelect = document.querySelector('select#videoSource');
  selectors = [audioInputSelect, audioOutputSelect, videoSelect];
  

  navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

  audioOutputSelect.disabled = !('sinkId' in HTMLMediaElement.prototype);

  function gotDevices(deviceInfos) {
    console.log("inside GOT-DEVICES");
    // Handles being called several times to update labels. Preserve values.
    var values = selectors.map(function(select) {
      return select.value;
    });
    selectors.forEach(function(select) {
      while (select.firstChild) {
        select.removeChild(select.firstChild);
      }
    });
    for (var i = 0; i !== deviceInfos.length; ++i) {
      var deviceInfo = deviceInfos[i];
      var option = document.createElement('option');
      option.value = deviceInfo.deviceId;
      // console.log("deviceInfo.deviceKind: "+deviceInfo.deviceKind+ " deviceInfo.deviceId: " +option.value);

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
            mobileVideoSources.push(option.value);
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
      alert(noOfCameras+'\n'+cameras);
    // Testing
    selectors.forEach(function(select, selectorIndex) {
      if (Array.prototype.slice.call(select.childNodes).some(function(n) {
        return n.value === values[selectorIndex];
      })) {
        select.value = values[selectorIndex];
      }
    });

    //Get the Camera &  selected in the dropdown option and pass it to the WebRTC as a c
    audioSource = audioInputSelect.value;
    videoSource = videoSelect.value;
    cameraID = videoSource;

    // $("#vendorPluginName").val(videoSource);

    constraints = {
      audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
      video: {deviceId: videoSource ? {exact: videoSource} : undefined}
    };

    // navigator.mediaDevices.getUserMedia(constraints).catch(handleError);
    /*navigator.mediaDevices.getUserMedia(constraints).
        then(gotStream).catch(handleError);*/
    start();
  }

  $("#join-conf").on("click", function(){
    console.log("join-conf clicked");

    var reqscript1 = document.createElement('script');
      reqscript1.src = "js/site/pexip/complex/webui.js";
      reqscript1.type = "text/javascript";
      document.getElementsByTagName("head")[0].appendChild(reqscript1);

      //document.getElementById("container").appendChild(reqscript1);
      //document.body.appendChild(reqscript1);

    var reqscript2 = document.createElement('script');
    	//  reqscript2.src = "js/site/pexip/complex/pexrtc.js";
      reqscript2.src = "js/site/pexip/complex/pexrtcV20.js";
      reqscript2.type = "text/javascript";
      document.getElementsByTagName("head")[0].appendChild(reqscript2);

    reqscript1.onload = function(){
      console.log("reqscript1 loaded");
    };

    reqscript2.onload = function(){
      console.log("reqscript2 loaded");

      // var alias = "meet.NCAL_TEST5";
      var alias =  "M.NCAL.MED.0.369638..1234";
      var bandwidth = "1280";
      var source = "Join+Conference";
      var name = $("#guestName").val();

      // initialise("10.233.30.30", alias, bandwidth, name, "", source);
      // initialise("TTGSS-PEXIP-2.TTGTPMG.NET", alias, bandwidth, name, "", source);
      initialise("ttgpexip.ttgtpmg.net", alias, bandwidth, name, "", source);
//      initialise("ivv-dev.kp.org", "meet.NCAL_1000", bandwidth, name, "", source);
      
      // rtc.user_media_stream = stream;
    };
  });

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

  function gotStream(stream) {
    console.log("inside GOT-STREAM");
    window.stream = stream; // make stream available to console
    videoElement.srcObject = stream;
    
    // Refresh button list in case labels have become available
    // return navigator.mediaDevices.enumerateDevices();
  }

  function start() {
    console.log("inside main-2 START");
    if (window.stream) {
      window.stream.getTracks().forEach(function(track) {
        track.stop();
      });
    }

    audioSource = audioInputSelect.value;
    videoSource = videoSelect.value;
    cameraID = videoSource;

    constraints = {
      audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
      video: {deviceId: videoSource ? {exact: videoSource} : undefined}
    };
    
    //globalConstraints = constraints;
    
    if(webuiLoaded == true){
      navigator.mediaDevices.getUserMedia(constraints).
            then(gotStream).catch(handleError);
        // navigator.mediaDevices.getUserMedia(constraints).catch(handleError);
      switchDevices();
    } else{
      navigator.mediaDevices.getUserMedia(constraints).
            then(gotStream).catch(handleError);
    }
  }

  audioInputSelect.onchange = start;
  audioOutputSelect.onchange = changeAudioDestination;
  videoSelect.onchange = start;

  //start();

  function handleError(error) {
    console.log('navigator.getUserMedia error: ', error);
  }
});
