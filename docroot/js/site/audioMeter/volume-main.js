var audioContext = null;
var meter = null;
var canvasContext = null;
var WIDTH=100;
var HEIGHT=50;
var rafID = null;
var firefox;

$(document).ready(function(){
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
	
	if (Modernizr.getusermedia == true){
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
	else if (Modernizr.iswindows == true){
		console.log("This windows browser doesn't support Audio Meter.");
		$("#mic-demo").css('color', 'black');
		$("#mic-demo").html("<span style='text-align:left; padding:10px; width:auto;'> To adjust mic volume: <ul style='margin:0;'> <li>Go to Control Panel > Hardware and Sound.</li><li>Under Sound, go to <span style='font-weight:bold; display:inline;'>Manage audio</span> devices.</li><li>Click <span style='font-weight:bold; display:inline;'>Recording</span> tab</li><li>Click <span style='font-weight:bold; display:inline;'>Properties</span> button.</li><li>Click <span style='font-weight:bold; display:inline;'>Levels</span> tab</li> </ul> </span>");
		$("#mic-instructions").html(" ");
	}
	else if (Modernizr.ismacos == true){
		console.log("This Mac browser doesn't support Audio Meter.");
		$("#mic-demo").css('color', 'black');
		$("#mic-demo").html("<span style='text-align:left; padding:10px; width:auto;'> To adjust mic volume: <ul style='margin:0;'> <li>Go to Control Panel > Hardware and Sound.</li><li>Under Sound, go to <span style='font-weight:bold; display:inline;'>Manage audio</span> devices.</li><li>Click <span style='font-weight:bold; display:inline;'>Recording</span> tab</li><li>Click <span style='font-weight:bold; display:inline;'>Properties</span> button.</li><li>Click <span style='font-weight:bold; display:inline;'>Levels</span> tab</li> </ul> </span>");
		$("#mic-instructions").html(" ");
	}
	else{
		console.log("Unknown OS/browser combination.");
		$("#mic-demo").css('color', 'black');
		$("#mic-demo").html(" ");
		$("#mic-instructions").html(" ");
	}
});


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
    
    var osNameForAM = navigator.platform;

    // clear the background
    canvasContext.clearRect(0,0,WIDTH,HEIGHT);


    // change the color based on the input value
    // draw a bar based on the current volume
    if (osNameForAM.toUpperCase().indexOf('MAC')!==-1){
	    if (meter.volume > 0.1)
	        canvasContext.fillStyle = "green";
	    else
	        canvasContext.fillStyle = "red";

	    canvasContext.fillRect(0, 0, meter.volume*WIDTH*7.0, HEIGHT);
	}
	else if (osNameForAM.toUpperCase().indexOf('WIN')!==-1){
		if (meter.volume > 0.2)
	        canvasContext.fillStyle = "green";
	    else
	        canvasContext.fillStyle = "red";

	    canvasContext.fillRect(0, 0, meter.volume*WIDTH*3.8, HEIGHT);
	}

    // set up the next visual callback
    rafID = window.requestAnimationFrame( drawLoop );
}
