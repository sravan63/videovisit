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
var speakerSource;

var cameraID;

var webuiLoaded = false;
var constraints;
var globalConstraints;
var removeJnotifyInterval = null;



$(document).ready(function(){
  console.log("inside main-2");
  var videoElement = document.querySelector('video');
  var selfvideo = document.getElementById('selfvideo');

  audioInputSelect = document.querySelector('select#audioSource');
  audioOutputSelect = document.querySelector('select#speakerSource');
  videoSelect = document.querySelector('select#videoSource');
  selectors = [audioInputSelect, audioOutputSelect, videoSelect];
  

  

  //audioOutputSelect.disabled = !('sinkId' in HTMLMediaElement.prototype);

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
          }
      } else {
        console.log('Some other kind of source/device: ', deviceInfo);
      }
    }

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
    speakerSource = audioOutputSelect.value;
    cameraID = videoSource;

    // $("#vendorPluginName").val(videoSource);

    constraints = {
      audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
      video: {deviceId: videoSource ? {exact: videoSource} : undefined},
      speaker: {deviceId: speakerSource ? {exact: speakerSource} : undefined}
    };
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
      var alias =  "M.NCAL.MED.0.369640..1234";
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

  navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

  // Attach audio output device to video element using device/sink ID.
  function attachSinkId(element, sinkId) {
	log("info","attachSinkId","console: attachSinkId - on changing the peripheral speaker dropdown");

    //console.log("inside ATTACH-SINK-ID");
    if (typeof element.sinkId !== 'undefined') {
      element.setSinkId(sinkId)
      .then(function() {
        log("info","attachSinkId","console: attachSinkId - Success, audio output device attached: " + sinkId);
        //console.log('Success, audio output device attached: ' + sinkId);
      })
      .catch(function(error) {
        var errorMessage = error;
        if (error.name === 'SecurityError') {
          errorMessage = 'You need to use HTTPS for selecting audio output ' +
              'device: ' + error;
        }
        log("error","attachSinkId","console: attachSinkId Error : " + errorMessage);
        //console.error(errorMessage);
        // Jump back to first output device in the list as it's the default.
        audioOutputSelect.selectedIndex = 0;
      });
    } else {
      console.warn('Browser does not support output device selection.');
    }
  }

  function changeAudioDestination() {
	
	 log("info","pexip_speaker_peripheral_change_action","event: peripheralsSpeakerChange - on changing the peripheral speaker dropdown");
    //console.log("inside CHANGE-AUDIO-DESTINATION");
    
    var audioDestination = audioOutputSelect.value;
    // var videoElement = document.querySelector('video');
    
    attachSinkId(videoElement, audioDestination);
  }

  function gotStream(stream) {
    // console.log("inside GOT-STREAM");
     window.stream = stream; // make stream available to console
    
     return navigator.mediaDevices.enumerateDevices();
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
    speakerSource = audioOutputSelect.value;
    cameraID = videoSource;

    constraints = {
      audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
      video: {deviceId: videoSource ? {exact: videoSource} : undefined},
      speaker: {deviceId: speakerSource ? {exact: speakerSource} : undefined}
    };
      
    navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(gotDevices).catch(handleError);
  }

  audioInputSelect.onchange = peripheralsAudioChange;
  audioOutputSelect.onchange = changeAudioDestination;
  videoSelect.onchange = peripheralsVideoChange;

  start();

  function peripheralsVideoChange(){
	log("info","pexip_video_peripheral_change_action","event: peripheralsVideoChange - on changing the peripheral camera dropdown");
    videoSource = videoSelect.value;
    rtc.call_type = 'video';
    rtc.video_source = videoSource;
    rtc.renegotiate('video');
  }

  function peripheralsAudioChange(){
	log("info","pexip_Microphone_peripheral_change_action","event: peripheralsAudioChange - on changing the peripheral mic dropdown");
    audioSource = audioInputSelect.value;
    rtc.call_type = 'audio';
    rtc.audio_source = audioSource;
    rtc.renegotiate('audio');
  }

  function handleError(error) {
	log("info","handleError","event: Error" + error);
    //console.log('navigator.getUserMedia error: ', error);
  }
});

