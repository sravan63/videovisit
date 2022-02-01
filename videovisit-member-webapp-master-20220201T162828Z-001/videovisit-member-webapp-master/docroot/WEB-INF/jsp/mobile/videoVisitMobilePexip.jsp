	<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
	<%@ taglib prefix='fn' uri='http://java.sun.com/jsp/jstl/functions' %>	
	
	<meta name="robots" content="noindex, nofollow" />
<meta name="robots" content="NONE,NOARCHIVE" />
<input type="hidden" id="guestName" value="${WebAppContext.videoVisit.guestName}" />
<input type="hidden" id="meetingHostName" value="${WebAppContext.videoVisit.hostLastName.toLowerCase()}, ${WebAppContext.videoVisit.hostFirstName.toLowerCase()} ${WebAppContext.videoVisit.hostTitle}"/>
<input type="hidden" id="meetingPatient" value="${WebAppContext.videoVisit.patientLastName.trim()}, ${WebAppContext.videoVisit.patientFirstName.trim()}"/>
<input type="hidden" id="mrn" value="${WebAppContext.memberDO.mrn}" />
<input type="hidden" id="caregiverId" value="${WebAppContext.videoVisit.caregiverId}" />
<input type="hidden" id="meetingCode" value="${WebAppContext.videoVisit.meetingCode}" />
<input type="hidden" id="patientLastName" value="${WebAppContext.videoVisit.patientLastName.trim()}"/>
<input type="hidden" id="meetingId" value="${WebAppContext.videoVisit.meetingId}" />
<input type="hidden" id="isProxyMeeting" value="${WebAppContext.videoVisit.isProxyMeeting}" />
<input type="hidden" id="isNative" value="${WebAppContext.isNative}" />
<input type="hidden" id="isMember" value="${WebAppContext.videoVisit.isMember}" />
<input type="hidden" id="bandwidth" value="${WebAppContext.bandwidth}" />
<input type="hidden" id="conferenceId" value="${WebAppContext.videoVisit.vendorConfId}" />
<input type="hidden" id="guestUrl" value="${WebAppContext.videoVisit.guestUrl}" />
<input type="hidden" id="guestPin" value="${WebAppContext.videoVisit.vendorGuestPin}" />
<input type="hidden" id="turnServers" value="${WebAppContext.videoVisit.vendorConfig.turnServers}" />
<input type="hidden" id="turnUserName" value="${WebAppContext.videoVisit.vendorConfig.turnUserName}" />
<input type="hidden" id="turnPassword" value="${WebAppContext.videoVisit.vendorConfig.turnPassword}" />

<link rel="stylesheet" type="text/css" href="js/site/pexip/complex/style.css" />
<!-- <link rel="stylesheet" media="€screen and (min-width:320px) and (max-width:550px)"€œ href="€js/site/pexip/complex/style-responsive.css" />  -->

	<!-- <script type="text/javascript" src="js/site/pexip/complex/main.js"></script> -->
<!-- <script type="text/javascript" src="js/site/pexip/complex/webui.js"></script>
<script type="text/javascript" src="js/site/pexip/complex/pexrtc.js"></script>	 -->
<script type="text/javascript" src="js/site/pexip/complex/main-webrtc.js"></script>

<!-- <input type="hidden" id="confName" value="" />
<input type="hidden" id="name" value="" />
<input type="hidden" id="bandwidth" value="" /> -->
<script type='text/javascript'>
	window.onload = function(){
	    var chrome_ver = 0;
	    var firefox_ver = 0;
	    var edge_ver = 0;
	    var safari_ver = 0;
	
	    if (navigator.userAgent.indexOf("Chrome") != -1) {
	        chrome_ver = parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
	    }
	
	    if (navigator.userAgent.indexOf("Firefox") != -1) {
	        firefox_ver = parseInt(window.navigator.userAgent.match(/Firefox\/(\d+)\./)[1], 10);
	    }
	
	    if (navigator.userAgent.indexOf("Edge") != -1) {
	        edge_ver = parseInt(window.navigator.userAgent.match(/Edge\/\d+\.(\d+)/)[1], 10);
	        chrome_ver = 0;
	    }
	
	    if (self.chrome_ver == 0 && navigator.userAgent.indexOf("Safari") != -1) {
	        safari_ver = parseInt(window.navigator.appVersion.match(/Safari\/(\d+)\./)[1], 10);
	    }
	
	    var is_explorer = navigator.userAgent.indexOf('MSIE') > -1 || navigator.userAgent.indexOf('Trident') > -1;
	
	    var id_form = document.getElementById('id_form');
	    if (is_explorer || (safari_ver > 0 && safari_ver < 604)) {
	        // id_form.action = "conference-flash.html";
	    }   
	
	    var id_join_pres = document.getElementById('id_join_pres');
	    if (!(chrome_ver > 38|| firefox_ver > 51)) {
	        id_join_pres.hidden = true;
	    }
	 
	    var bw;
	    if (navigator.userAgent.indexOf("Mobile") == -1) {
	        bw = "1280";
	    } else {
	        bw = "192";
	    }
	    
	    var id_bandwidth = document.getElementById('id_bandwidth');
	    for (var i = 0; i < id_bandwidth.children.length; i++) {
	        if (id_bandwidth.children[i].value == bw) {
	            id_bandwidth.children[i].selected = true;
	        }
	    }
		// setTimeout(function(){
		// 	configurePexipVideoProperties();
		// },1500);
	}	
</script>
<script type='text/javascript'>function switchImage() { document.getElementById('presimage').src.src = document.getElementById('loadimage').src; }</script>
<style>
	html{
		padding: 0;
	}
	ul{
		margin-left: 0;
	}
	#stat-window-container{
		display: none;
		color: white;
		position: absolute;
		top: 10%;
		left: 10%;
		padding: 10px;
		background-color: black;
		opacity: 0.5;
		border: 1px solid black;
		border-radius: 5px;
	}
	#stat-window-container table{
		/*border: 1px solid white;*/
	}
	#stat-window th, #stat-window td{
		border: 1px solid white;
		width: 20%;
	}
	#stat-window tr{
		height: 20px;
	}
</style>

<div id="container-videovisit" class="container-videovisit">
	<!-- PEXIP Container - START -->
	<div id="container" class="site">
	    
	  	<div id="enterDetails" class="main site join" style="display: none;" >

		    <select name="bandwidth" class="webrtcinput" id="id_bandwidth">
		        <option value="1920">Maximum Bandwidth (1920kbps)</option>
		        <option value="1280" selected>High Bandwidth (1280kbps)</option>
		        <option value="576">Medium Bandwidth (576kbps)</option>
		        <option value="192">Low Bandwidth (192kbps)</option>
		    </select>

		    <input type="submit" value="Join Conference" name="join" id="join-conf" class="webrtcbutton">
		    <input type="submit" value="Present Screen Only" name="join_pres" id="id_join_pres" class="webrtcbutton">
		</div>
		<div id="selectPeripheral" class="main site join" style="display: none;" >
			<div class="select">
		    	<label for="videoSource">Video source: </label><select id="videoSource"></select>
		  	</div>
			<div class="select">
				<label for="audioSource">Mic source: </label><select id="audioSource"></select>
			</div>
			<div class="select">
				<label for="speakerSource">Speaker source: </label><select id="speakerSource"></select>
			</div>
	  </div>

	    <!-- END Content -->

	  <div id="selectrole" class="main site join hidden" style="display: none;">
	    <h2>Select your role for this conference:</h2>
	    <form>
	    	<div class="cf">
	            <input type="radio" value="2" name="role" id="id_host" class="webrtcinput">
	            <label for="id_host" class="host_pexip">Host</label>
	        </div>
	        <div class="cf">
	            <input type="radio" value="1" name="role" id="id_guest" class="webrtcinput" checked>
	            <label for="id_guest" class="guest_pexip">Guest</label>
	        </div>

	        <input type="button" value="Join Conference" name="join" id="id_join" class="webrtcbutton" onClick="submitSelectRole();">
	    </form>
	  </div>


	  <div id="pinentry" class="main site join hidden"style="display: none;">
	    <form onSubmit="return submitPinEntry();">
	        <label for="id_pin" class="vh">Enter the conference PIN</label>
	        <input type="password" value="1234" name="pin" id="id_pin" placeholder="Enter the conference PIN" required class="webrtcinput">

	        <input type="button" value="Join Conference" name="join" id="id_join" class="webrtcbutton" onClick="submitPinEntry();">
	    </form>
	  </div>


	  <div id="ivrentry" class="main site join hidden" style="display: none;">
	    <form onSubmit="return submitIVREntry();">
	        <label for="id_room" class="vh">Enter the target extension</label>
	        <input type="text" value="" name="room" id="id_room" placeholder="Enter the target extension" required class="webrtcinput">

	        <input type="button" value="Join Conference" name="join" id="id_join" class="webrtcbutton" onClick="submitIVREntry();">
	    </form>
	  </div>

	 
	  <div id="maincontent" class="main cf hidden">
	    <section class="video-top">
	      <div class="waiting-room">
	      	<div class="logo"></div>
	      	<div class="waiting-text">Waiting for your doctor to join.</div>
	      </div>
	      
	      <div id="videocontainer" class="mobileconferenceview" >
	        <video width="100%" height="100%" id="video" autoplay="autoplay" playsinline="playsinline"></video>
	      </div>
	      <div id="selfview" class="mobileselfview">
	          <video width="100%" height="100%" id="selfvideo" autoplay="autoplay" playsinline="playsinline" muted="true">
	          </video>
	      </div>
	      <div id="presentation-view" class="presentation-view"></div>
	    </section>

	    <footer id="controls" class="controls-bar">
	      <ul class="video-controls">
	        <!-- <li><a id="id_selfview" class="webrtcbutton btn-selfview" onclick="toggleSelfview();">Show Selfview</a></li> -->
	        <li><span class="white-circle"><span id="camera" class="icon-holder unmutedcamera" onclick="muteVideoStreams()"></span></span></li>
	        <li class="camera-switch-disable-ios"><span class="white-circle"><span id="cameraSwitch" class="icon-holder" onclick="toggleCamera()"></span></span></li>
	        <li><span class="red-circle"><span id="endCall" class="icon-holder" onclick="disconnect();"></span></span></li>
	        <li><span class="white-circle"><span id="speaker" class="icon-holder unmutedspeaker" onclick="muteUnmuteSpeaker()"></span></span></li>
	        <li><span class="white-circle"><span id="mic" class="icon-holder unmutedmic" onclick="muteMicStreams()"></span></span></li>
	        
	      </ul>
	    </footer>
	    <footer id="controls" class="landscape-controlbar">
	      <ul class="video-controls">
	        <!-- <li><a id="id_selfview" class="webrtcbutton btn-selfview" onclick="toggleSelfview();">Show Selfview</a></li> -->
	        <li><span class="white-circle"><span id="mic" class="icon-holder unmutedmic" onclick="muteMicStreams()"></span></span></li>
	        <li><span class="white-circle"><span id="speaker" class="icon-holder unmutedspeaker" onclick="muteUnmuteSpeaker()"></span></span></li>
	        <li><span class="red-circle"><span id="endCall" class="icon-holder" onclick="disconnect();"></span></span></li>
	        <li class="camera-switch-disable-ios"><span class="white-circle"><span id="cameraSwitch" class="icon-holder" onclick="toggleCamera()"></span></span></li>
	        <li><span class="white-circle"><span id="camera" class="icon-holder unmutedcamera" onclick="muteVideoStreams()"></span></span></li>
	        
	      </ul>
	    </footer>
	  </div>
	</div>
	<!-- PEXIP Container - END -->
</div>

