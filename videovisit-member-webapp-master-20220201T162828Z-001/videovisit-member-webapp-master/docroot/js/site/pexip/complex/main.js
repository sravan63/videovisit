/*window.onload = function(){
	getStarted();
}*/

function getStarted(){
	// alert("inside main/getStarted()");
 	var audioSelect = document.querySelector('select#audioSource');
	var videoSelect = document.querySelector('select#videoSource');
	var speakerSelect = document.querySelector('select#speakerSource');
	
	navigator.mediaDevices.enumerateDevices()
	  .then(gotDevices).then(getStream).catch(handleError);
	
	audioSelect.onchange = getStream;
	videoSelect.onchange = getStream;
	speakerSelect.onchange = getStream;
	
	//clear the list before starting
	removeOptions(document.getElementById("audioSource"));
	removeOptions(document.getElementById("videoSource"));
	removeOptions(document.getElementById("speakerSource"));
	
	function gotDevices(deviceInfos) {
		console.log("deviceInfos"+JSON.stringify(deviceInfos));
		for (var i = 0; i !== deviceInfos.length; ++i) {
			var deviceInfo = deviceInfos[i];
			var option = document.createElement('option');
			option.value = deviceInfo.deviceId;
	    
			if (deviceInfo.kind === 'audioinput') {
				if(!(deviceInfo.label.indexOf("Default")==0 ||deviceInfo.label.indexOf("Communications")==0)){
					option.text = deviceInfo.label;
					audioSelect.appendChild(option);
				}
			} else if (deviceInfo.kind === 'videoinput') {  
				option.text = deviceInfo.label;
				videoSelect.appendChild(option);
			} else if (deviceInfo.kind === 'audiooutput') {
				if(!(deviceInfo.label.indexOf("Default")==0 ||deviceInfo.label.indexOf("Communications")==0)){	  	   
					option.text = deviceInfo.label;
					speakerSelect.appendChild(option);
				}
		       
			} else {
				console.log('Found one other kind of source/device: ', deviceInfo);
			}
		}
	}
	 
	function getStream() {
		if (window.stream) {
		    window.stream.getTracks().forEach(function(track) {
		      track.stop();
		    });
		}
	
		var constraints = {
			audio: {
				deviceId: {exact: audioSelect.value}
			},
		    video: {
		      deviceId: {exact: videoSelect.value}
		    }
		};
	
		navigator.mediaDevices.getUserMedia(constraints).
	    then(gotStream).catch(handleError);
	}
	
	function gotStream(stream) {
		window.stream = stream; // make stream available to console
		// videoElement.srcObject = stream;
	}
	
	function handleError(error) {
		console.log('Error: ', error);
	}
}

navigator.mediaDevices.ondevicechange = function(event) {
  	getStarted();	 
}

function removeOptions(selectbox)
{
    var i;
    for(i = selectbox.options.length - 1 ; i >= 0 ; i--)
    {
        selectbox.remove(i);
    }
}
 
/*$('#videoSource').change(function () {
	var conceptName = $('#videoSource').find(":selected").text();
	alert(conceptName);
    
});*/


/*element.setSinkId(sinkId)
	.then(function() {
  	console.log('Audio output device attached: ' + sinkId);
})
.catch(function(error) {
  	// ...
});*/
