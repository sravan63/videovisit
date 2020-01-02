import React from 'react';
import Axios from 'axios-observable';

import incomingCallMP3 from '../assets/audio/incomingCall.mp3';
import incomingCallOGG from '../assets/audio/incomingCall.ogg';
import incomingCallWAV from '../assets/audio/incomingCall.wav';
import MoodyLoopMP3 from '../assets/audio/MoodyLoop.mp3';
import MoodyLoopOGG from '../assets/audio/MoodyLoop.ogg';
import MoodyLoopWAV from '../assets/audio/MoodyLoop.wav';

class DeviceService extends React.Component {
	constructor() {
        super();
        this.state = { mediaData: {} };

        // MIC variables
        this.audioContext = null;
		this.meter = null;
		this.rafID = null;
		this.mediaStreamSource = null;
		this.prevVolume = 0;
		this.currentCount = 0;

		//Playback variables
		this.ringtoneAudio = undefined;

        this.createAudioMeter = this.createAudioMeter.bind(this);
        this.drawLoop = this.drawLoop.bind(this);
    }

	// MIC related logic
    addCanvas(){
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

    drawLoop( time ) {
        var volume = Math.round(this.meter.volume*100);
        var lastClip = this.meter.lastClip;
        var index;
        var color;

        if(volume > this.prevVolume){
          color = "#4A7628";
          this.currentCount++;
          this.currentCount = (this.currentCount > 24)?24:this.currentCount;
          for(var i=0; i <= this.currentCount; i++){
            var cContext = document.getElementById( "node_"+i ).getContext("2d");
            cContext.clearRect(0,0,10,10);
            cContext.fillStyle = color;
            cContext.fillRect(0, 0, 10, 10);
          }
          
        } else if(this.prevVolume > volume){
          color = "#E1E1E1";
          for(var j = this.currentCount; j>=0; j--){
            var cContext = document.getElementById( "node_"+j ).getContext("2d");
            cContext.clearRect(0,0,10,10);
            cContext.fillStyle = color;
            cContext.fillRect(0, 0, 10, 10);
          }
         
          this.currentCount--;
          this.currentCount = (this.currentCount < 0)?0:this.currentCount;
        }
        this.prevVolume = volume;
        this.rafID = window.requestAnimationFrame( this.drawLoop );
        
    }

    micTest(){
    	this.audioContext= new AudioContext();
        this.mediaStreamSource = this.audioContext.createMediaStreamSource(stream);
        // Create a new volume meter and connect it.
        this.meter = this.createAudioMeter(this.audioContext);
        this.mediaStreamSource.connect(this.meter);
        // kick off the visual updating
        this.drawLoop();
    }

    /* MIC test related code */
	createAudioMeter(audioContext,clipLevel,averaging,clipLag) {
	  var processor = audioContext.createScriptProcessor(512);
	  processor.onaudioprocess = this.volumeAudioProcess;
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

	volumeAudioProcess( event ) {
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

	// Playback related code
	/**
	* Start playing ringtone
	* @return {Object} Application object
	*/
	helperRingtonePlay(){
	  try {
	    if (window.Audio != undefined){
	      if (this.ringtoneAudio == undefined){
	        this.ringtoneAudio = new window.Audio();
	        switch(true){
	          case (typeof this.ringtoneAudio.canPlayType == 'function' && this.ringtoneAudio.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, '') != ""):
	            var src = require('../assets/audio/MoodyLoop.ogg');
	            this.ringtoneAudio.src = src;
	            break;
	          case (typeof this.ringtoneAudio.canPlayType == 'function' && this.ringtoneAudio.canPlayType('audio/mpeg;').replace(/no/, '') != ""):
	            var src = require('../assets/audio/MoodyLoop.mp3');
	            this.ringtoneAudio.src = src;
	            break;
	          case (typeof this.ringtoneAudio.canPlayType == 'function' && this.ringtoneAudio.canPlayType('audio/wav; codecs="1"').replace(/no/, '') != ''):
	            var src = require('../assets/audio/MoodyLoop.wav');
	            this.ringtoneAudio.src = src;
	            break;
	          case (typeof this.ringtoneAudio.canPlayType == 'function' && this.ringtoneAudio.canPlayType('audio/wave;').replace(/no/, '') != ''):
	          	var src = require('../assets/audio/MoodyLoop.wav');
	            this.ringtoneAudio.src = src;
	            break;
	          default:
	          	var src = require('../assets/audio/MoodyLoop.ogg');
	            this.ringtoneAudio.src = src;
	            break;
	        }

	        console.log('info application helperRingtonePlay() - using: ,'+ this.ringtoneAudio.src);

	        /* Not all browsers support loop, so check */
	        this.ringtoneAudio.addEventListener('ended', function(){
	          if (this.ringtoneAudio){
	            this.ringtoneAudio.pause();
	            this.ringtoneAudio.currentTime = 0;
	            this.ringtoneAudio.play();
	          }
	        });
	      }
	      this.ringtoneAudio.play();
	    }
	    else{
	      // if (browserInfo.isIE && browserInfo.version == 8){
	        // $('#main_audio_ie8')[0].Play();
	      // }
	    }
	  }catch(e){
	    console.log('warning - helper_ring_tone_play_html5_audio_not_supported_action', "helperRingtonePlay() - html5 audio is not supported.");
	  }
	};

	/**
	* Stop playing ringtone
	* @return {Object} Application object
	*/
	helperRingtoneStop(){
	  if (this.ringtoneAudio){
	    this.ringtoneAudio.pause();
	    this.ringtoneAudio = undefined;
	  }
	}
}
export default new DeviceService();