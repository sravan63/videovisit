/*
*  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
*
*  Use of this source code is governed by a BSD-style license
*  that can be found in the LICENSE file in the root of the source
*  tree.
*/

'use strict';

var videoElement = document.querySelector('video');
var audioInputSelect = document.querySelector('select#audioSource');
var audioOutputSelect = document.querySelector('select#audioOutput');
var videoSelect = document.querySelector('select#videoSource');
var selectors = [audioInputSelect, audioOutputSelect, videoSelect];
var isProvider = document.querySelector('#isProvider').value;

// audio output (speaker) elements
var audioOutputPlay = document.querySelector('#playAudio');
var audioOutputPause = document.querySelector('#pauseAudio');

var ringtoneAudio;
var audioFile = {
  audioIncomingCallMp3: '../../../videovisit/audio/incomingCall.mp3',
  audioIncomingCallOgg: '../../../videovisit/audio/incomingCall.ogg',
  audioIncomingCallWav: '../../../videovisit/audio/incomingCall.wav',
  audioSetupIncomingCallMp3: '../../../videovisit/audio/MoodyLoop.mp3',
  audioSetupIncomingCallOgg: '../../../videovisit/audio/MoodyLoop.ogg',
  audioSetupIncomingCallWav: '../../../videovisit/audio/MoodyLoop.wav'
};

// audio input (mic) elements
window.AudioContext = window.AudioContext || window.webkitAudioContext;
  
var audioContext = new AudioContext();
var meter = null;
var HEIGHT=200;
var WIDTH=10;
var rafID = null;
var mediaStreamSource = null;
var audioVisualBars = 7;

var prevVolume = 0;
var currentCount = 0;

audioOutputSelect.disabled = !('sinkId' in HTMLMediaElement.prototype);

function gotDevices(deviceInfos) {
  // Handles being called several times to update labels. Preserve values.
  var values = selectors.map(function(select) {
    return select.value;
  });
  selectors.forEach(function(select) {
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }
  });
  //var devicesLst = deviceInfos.filter(tempDevice => tempDevice.label != 'WebPluginVirtualCamera');
  //deviceInfos = devicesLst;
  for (var i = 0; i !== deviceInfos.length; ++i) {
    var deviceInfo = deviceInfos[i];
    var option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'audioinput') {
      option.text = deviceInfo.label ||
          'microphone ' + (audioInputSelect.length + 1);
      audioInputSelect.appendChild(option);
    } else if (deviceInfo.kind === 'audiooutput') {
      option.text = deviceInfo.label || 'speaker ' +
          (audioOutputSelect.length + 1);
      audioOutputSelect.appendChild(option);
    } else if (deviceInfo.kind === 'videoinput') {
    	//DE14663 fix
    	if(deviceInfo.label != 'WebPluginVirtualCamera'){
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
}

navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

// Attach audio output device to video element using device/sink ID.
function attachSinkId(element, sinkId) {
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
  var audioDestination = audioOutputSelect.value;
  attachSinkId(videoElement, audioDestination);
}

function addCanvas(){
  for(var j=0; j<25; j++){
    var canv = document.createElement('canvas');
    canv.width = 10;
    canv.height = 10;
    canv.id = "node_"+j;
    document.getElementById("playNodes").appendChild(canv);

    var ccontext = canv.getContext("2d");
    canv.style.marginRight = "2px";
    ccontext.fillStyle = "#E1E1E1";
    ccontext.fillRect(0, 0, 10, 10);
  }
}
if(isProvider == 'false'){
  addCanvas();
}

function drawLoop( time ) {

    var volume = Math.round(meter.volume*100);
    var lastClip = meter.lastClip;
    var index;
    var color;
    // console.log("prevVolume :: "+prevVolume);
    // console.log("volume :: "+volume);
    // console.log("IS INCREASING :: "+(volume > prevVolume));

    if(volume > prevVolume){
      color = "#4A7628";
      currentCount++;
      currentCount = (currentCount > 24)?24:currentCount;
      for(var i=0; i<=currentCount; i++){
        var cContext = document.getElementById( "node_"+i ).getContext("2d");
        cContext.clearRect(0,0,10,10);
        cContext.fillStyle = color;
        cContext.fillRect(0, 0, 10, 10);
      }
      
    } else if(prevVolume > volume){
      color = "#E1E1E1";
      for(var j=currentCount; j>=0; j--){
        var cContext = document.getElementById( "node_"+j ).getContext("2d");
        cContext.clearRect(0,0,10,10);
        cContext.fillStyle = color;
        cContext.fillRect(0, 0, 10, 10);
      }
     
      currentCount--;
      currentCount = (currentCount < 0)?0:currentCount;
    }
    prevVolume = volume;
    rafID = window.requestAnimationFrame( drawLoop );
    
}

function micTest(){
    mediaStreamSource = audioContext.createMediaStreamSource(stream);
    // Create a new volume meter and connect it.
    meter = createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);
    // kick off the visual updating
    drawLoop();
}

function gotStream(stream) {
  window.stream = stream; // make stream available to console
  videoElement.srcObject = stream;
  videoElement.volume = 0;
  // Mic test is only in member-webapp
  if(isProvider == 'false'){
    micTest();
  }
  // Refresh button list in case labels have become available
  return navigator.mediaDevices.enumerateDevices();
}

function start() {
  if (window.stream) {
    window.stream.getTracks().forEach(function(track) {
      track.stop();
    });
  }
  var audioSource = audioInputSelect.value;
  var videoSource = videoSelect.value;
  var constraints = {
    audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
    video: {deviceId: videoSource ? {exact: videoSource} : undefined}
  };
  navigator.mediaDevices.getUserMedia(constraints).
      then(gotStream).then(gotDevices).catch(handleError);
}

audioInputSelect.onchange = start;
audioOutputSelect.onchange = changeAudioDestination;
videoSelect.onchange = start;

start();

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

function onDeviceChange(event){
  if(browserInfo.OSName.toLowerCase() !== "windows"){
    console.log("DEVICE CHANGE EVENT TRIGGERED");
    navigator.mediaDevices.enumerateDevices();
    start();
  }
}

navigator.mediaDevices.ondevicechange = onDeviceChange;

/* Speaker test related code */
function togglePlayAndPause(type){
  if(type == 'play'){
    $("#playAudio").css("display", "none");
    $("#pauseAudio").css("display", "inline-block");
  }else{
    $("#pauseAudio").css("display", "none");
    $("#playAudio").css("display", "inline-block");
  }
}

/**
* Start playing ringtone
* @return {Object} Application object
*/
function helperRingtonePlay(){
  try {
    if (window.Audio != undefined){
      if (ringtoneAudio == undefined){
        ringtoneAudio = new window.Audio();
        switch(true){
          case (typeof ringtoneAudio.canPlayType == 'function' && ringtoneAudio.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, '') != ""):
            ringtoneAudio.src = audioFile.audioSetupIncomingCallOgg;
            break;
          case (typeof ringtoneAudio.canPlayType == 'function' && ringtoneAudio.canPlayType('audio/mpeg;').replace(/no/, '') != ""):
            ringtoneAudio.src = audioFile.audioSetupIncomingCallMp3;
            break;
          case (typeof ringtoneAudio.canPlayType == 'function' && ringtoneAudio.canPlayType('audio/wav; codecs="1"').replace(/no/, '') != ''):
            ringtoneAudio.src = audioFile.audioSetupIncomingCallWav;
            break;
          case (typeof ringtoneAudio.canPlayType == 'function' && ringtoneAudio.canPlayType('audio/wave;').replace(/no/, '') != ''):
            ringtoneAudio.src = audioFile.audioSetupIncomingCallWav;
            break;
          default:
            ringtoneAudio.src = audioFile.audioSetupIncomingCallOgg;
            break;
        }

        console.log('info application helperRingtonePlay() - using: ,'+ ringtoneAudio.src);

        /* Not all browsers support loop, so check */
        ringtoneAudio.addEventListener('ended', function(){
          if (ringtoneAudio){
            ringtoneAudio.pause();
            ringtoneAudio.currentTime = 0;
            ringtoneAudio.play();
          }
        });
      }
      ringtoneAudio.play();
    }
    else{
      if (browserInfo.isIE && browserInfo.version == 8){
        // $('#main_audio_ie8')[0].Play();
      }
    }
  }catch(e){
    console.log('warning - helper_ring_tone_play_html5_audio_not_supported_action', "helperRingtonePlay() - html5 audio is not supported.");
  }
  togglePlayAndPause('play');
};

/**
* Stop playing ringtone
* @return {Object} Application object
*/
function helperRingtoneStop(){
  if (ringtoneAudio){
    ringtoneAudio.pause();
    //ringtoneAudio = undefined;
  }
  togglePlayAndPause('pause');
};

// Speaker test is only in member-webapp
if(isProvider == 'false'){
  audioOutputPlay.onclick = helperRingtonePlay;
  audioOutputPause.onclick = helperRingtoneStop;
}

/* MIC test related code */
function createAudioMeter(audioContext,clipLevel,averaging,clipLag) {
  var processor = audioContext.createScriptProcessor(512);
  processor.onaudioprocess = volumeAudioProcess;
  processor.clipping = false;
  processor.lastClip = 0;
  processor.volume = 0;
  processor.clipLevel = clipLevel || 0.98;
  processor.averaging = averaging || 0.95;
  processor.clipLag = clipLag || 750;

  // this will have no effect, since we don't copy the input to the output,
  // but works around a current Chrome bug.
  processor.connect(audioContext.destination);

  processor.checkClipping =
    function(){
      if (!this.clipping)
        return false;
      if ((this.lastClip + this.clipLag) < window.performance.now())
        this.clipping = false;
      return this.clipping;
    };

  processor.shutdown =
    function(){
      this.disconnect();
      this.onaudioprocess = null;
    };

  return processor;
}

function volumeAudioProcess( event ) {
  var buf = event.inputBuffer.getChannelData(0);
    var bufLength = buf.length;
  var sum = 0;
    var x;

  // Do a root-mean-square on the samples: sum up the squares...
    for (var i=0; i<bufLength; i++) {
      x = buf[i];
      if (Math.abs(x)>=this.clipLevel) {
        this.clipping = true;
        this.lastClip = window.performance.now();
      }
      sum += x * x;
    }

    // ... then take the square root of the sum.
    var rms =  Math.sqrt(sum / bufLength);

    // Now smooth this out with the averaging factor applied
    // to the previous sample - take the max here because we
    // want "fast attack, slow release."
    this.volume = Math.max(rms, this.volume*this.averaging);
}