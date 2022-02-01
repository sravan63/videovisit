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
    var cameras = [];
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
        if (deviceInfo.label != "WebPluginVirtualCamera") {
          option.text = deviceInfo.label || 'camera ' + (videoSelect.length + 1);
          videoSelect.appendChild(option);
          cameras.push({
            "deviceId": deviceInfo.deviceId,
            "deviceLabel": deviceInfo.label
          });
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
    var precallevent =  JSON.parse(localStorage.getItem('peripheralsStorageObject'));
    audioSource = audioInputSelect.value;
    
    speakerSource = audioOutputSelect.value;
    if(precallevent != null){
     
    cameras.forEach(function(item,index){
        if(item.deviceLabel == precallevent.camera){
        cameraID = item.deviceId;
        $("#videoSource").val(item.deviceId);
         
         var aSource = getValueByType(precallevent.camera, audioInputSelect, 'text');
         var audio = aSource ? aSource : audioSource;

         var sSource = getValueByType(precallevent.camera, audioOutputSelect, 'text');
         var speaker = aSource ? aSource : speakerSource;

         $("#audioSource").val(audio);
         $("#speakerSource").val(speaker);

        } else {
          videoSource = videoSelect.value;
          cameraID = videoSource;
        }
      });
      //videoSource = precallevent.deviceId;
  
      
      //peripheralsVideoChange();
    }else{
    videoSource = videoSelect.value;
    cameraID = videoSource;
    }
    // $("#vendorPluginName").val(videoSource);

    constraints = {
      audio: {
        deviceId: audioSource ? {
          exact: audioSource
        } : undefined
      },
      video: {
        deviceId: videoSource ? {
          exact: videoSource
        } : undefined
      },
      speaker: {
        deviceId: speakerSource ? {
          exact: speakerSource
        } : undefined
      }
    };
  }

  var browserUserAgent = navigator.userAgent;
  var blockEdge = ($("#blockEdge").val() == 'true');
  var blockIE = ($("#blockIE").val() == 'true');
  var blockFF = ($("#blockFF").val() == 'true');
  var blockSafari = ($("#blockSafari").val() == 'true');
  var isIE = /MSIE|Trident/.test(browserUserAgent);
  var isEdge = /Edge/.test(browserUserAgent);
  var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
  var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

  if (isEdge && blockEdge) {
    $('.provider-pre-call-testing-wrapper').css('display', 'none');
    $('.error-container').css('display', 'block');
    return;
  }
  if (isIE && blockIE) {
    $('.provider-pre-call-testing-wrapper').css('display', 'none');
    $('.error-container').css('display', 'block');
    return
  }
  if (isSafari && blockSafari) {
    $('.provider-pre-call-testing-wrapper').css('display', 'none');
    $('.error-container').css('display', 'block');
    return;
  }
  if (isFirefox && blockFF) {
    $('.provider-pre-call-testing-wrapper').css('display', 'none');
    $('.error-container').css('display', 'block');
    return;
  }
  var sendConstraints;
  if (navigator.userAgent.indexOf('Firefox') > -1 || (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1)) {
      sendConstraints = true;
  }
  //var appOS = getAppOS();
  if (sendConstraints) {
    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      })
      .then(function (stream) {
        console.log('Stream1 started with success');
        setDevice();
      })
      .catch(function () {
        console.log('Failed to start stream1')
      });
  } else {
    navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);
  }

 function setDevice(){
   navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);
  }

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
  
   log("info","speaker_peripheral_change_action","event: peripheralsSpeakerChange - on changing the peripheral speaker dropdown");
    //console.log("inside CHANGE-AUDIO-DESTINATION");
    
    var audioDestination = audioOutputSelect.value;
    // var videoElement = document.querySelector('video');
    
    attachSinkId(videoElement, audioDestination);
    // changeRespectivePeripheral(audioDestination, 'speaker');
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
      audio: {
        deviceId: audioSource ? {
          exact: audioSource
        } : undefined
      },
      video: {
        deviceId: videoSource ? {
          exact: videoSource
        } : undefined
      },
      speaker: {
        deviceId: speakerSource ? {
          exact: speakerSource
        } : undefined
      }
    };
      
    navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(gotDevices).catch(handleError);
  }

  audioInputSelect.onchange = peripheralsAudioChange;
  audioOutputSelect.onchange = changeAudioDestination;
  videoSelect.onchange = peripheralsVideoChange;

  // start();

  function peripheralsVideoChange(){
  log("info","video_peripheral_change_action","event: peripheralsVideoChange - on changing the peripheral camera dropdown");
    videoSource = videoSelect.value;
    cameraID = videoSource;
    changeRespectivePeripheral(videoSelect.selectedOptions[0].text, 'video');
  }

  function peripheralsAudioChange(){
  log("info","Microphone_peripheral_change_action","event: peripheralsAudioChange - on changing the peripheral mic dropdown");
    audioSource = audioInputSelect.value;
  }

  function handleError(error) {
  log("info","handleError","event: Error" + error);
    //console.log('navigator.getUserMedia error: ', error);
  }

  function changeRespectivePeripheral(value, type){
    var vSource;
    var aSource;
    var sSource;
    if(type == 'mic'){
      vSource = getValueByType(value, videoSelect);
      sSource = getValueByType(value, audioOutputSelect);
      videoSource = vSource ? vSource : videoSource;
      speakerSource = sSource ? sSource : videoSource;
      // Change respective video & mic
      if(vSource){
        cameraID = videoSource;
      }
      if(sSource){
        attachSinkId(videoElement, audioSource);
      }
    } else if(type == 'video') {
      // Change respective audio & speaker
      aSource = getValueByType(value, audioInputSelect, 'text');
      audioSource = aSource ? aSource : audioSource;
    } else {
      // Change respective audio & video
      aSource = getValueByType(value, audioInputSelect);
      vSource = getValueByType(value, videoSelect);
      audioSource = aSource ? aSource : audioSource;
      videoSource = vSource ? vSource : videoSource;
    }
  }

  function getValueByType(value, selectType, validate = 'value'){
    var list = selectType.children;
    var respectiveValue = '';
    for(var i=0; i<list.length; i++){
      var isInList = breakAndCompare(list[i][validate], value);
      if(list[i][validate] == value || isInList){
        respectiveValue = list[i].value;
        list[i].selected = true;
      }
    }
    return respectiveValue;
  }

  function breakAndCompare(lVal, rVal){
    var lhs = lVal.split(' ');
    var rhs = rVal.split(' ');
    var match = false;
    for(var l=0; l<lhs.length; l++){ 
      for(var r=0; r<rhs.length; r++){
      if(rhs[r].length > 2 && lhs[l] == rhs[r]){
          match = true;
        }
      }
    }
    return match;
  }
});

