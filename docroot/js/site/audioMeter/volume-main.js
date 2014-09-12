var audioContext = null;
var meter = null;
var canvasContext = null;
var WIDTH=100;
var HEIGHT=50;
var rafID = null;
var firefox;

window.onload = function() {
	var browserInfoForAM = getBrowserInfo();
//	var browserInfo = new Object();
//	browserInfo.isIE = false;
//	
//	var jqBrowserInfoObj = $.browser; 
//
//	//browserInfo.version = jqBrowserInfoObj.version;
//	
//	if ( jqBrowserInfoObj.mozilla) {
//		browserInfo.isFirefox = true;
//	} else if ( jqBrowserInfoObj.msie){
//		browserInfo.isIE = true;
//	} else if ( jqBrowserInfoObj.chrome){
//		browserInfo.isChrome = true;
//	} else if ( jqBrowserInfoObj.safari){
//		browserInfo.isSafari = true;
//	}
	
	console.log("FF: "+browserInfoForAM.isFirefox);
	console.log("IE: "+browserInfoForAM.isIE);
	console.log("CH: "+browserInfoForAM.isChrome);
	console.log("SF: "+browserInfoForAM.isSafari);
	
	if (browserInfoForAM.isFirefox == true || browserInfoForAM.isChrome == true){
		console.log("Browser supported for Audio Meter");
		
	    // grab our canvas
		canvasContext = document.getElementById( "meter" ).getContext("2d");
	
	    // monkeypatch Web Audio
	    window.AudioContext = window.AudioContext || window.webkitAudioContext;
	
	    // grab an audio context
	    audioContext = new AudioContext();
	
	    // Attempt to get audio input
	    try {
	        // monkeypatch getUserMedia
	        navigator.getUserMedia = 
	        	navigator.getUserMedia ||
	        	navigator.webkitGetUserMedia ||
	        	navigator.mozGetUserMedia;
	        
	        firefox = /Firefox/i.test(navigator.userAgent);
	
	        // ask for an audio input
	        navigator.getUserMedia({audio:true}, gotStream, didntGetStream);
	    } catch (e) {
	        alert('getUserMedia threw exception :' + e);
	    }
	}
	else{
		console.log("Browser not supported for Audio Meter");
	}

};


function didntGetStream() {
    alert('Stream generation failed.');
}

function gotStream(stream) {
    // Create an AudioNode from the stream.
    var mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Create a new volume meter and connect it.
	meter = createAudioMeter(audioContext);
	mediaStreamSource.connect(meter);
	if (firefox){
		window.source = audioContext.createMediaStreamSource(stream);
		//source.connect(audioContext.destination);
	}
    // kick off the visual updating
    drawLoop();
}

function drawLoop( time ) {
    // clear the background
    canvasContext.clearRect(0,0,WIDTH,HEIGHT);

    // check if we're currently clipping
    if (meter.checkClipping())
        canvasContext.fillStyle = "red";
    else
        canvasContext.fillStyle = "green";

    // draw a bar based on the current volume
    canvasContext.fillRect(0, 0, meter.volume*WIDTH*7.4, HEIGHT);

    // set up the next visual callback
    rafID = window.requestAnimationFrame( drawLoop );
}