	<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
	<%@ taglib prefix='fn' uri='http://java.sun.com/jsp/jstl/functions' %>	
	<meta name="robots" content="noindex, nofollow" />
<meta name="robots" content="NONE,NOARCHIVE" />

<link rel="stylesheet" type="text/css" href="js/site/pexip/complex/style.css" />
<!-- <link rel="stylesheet" media="€screen and (min-width:320px) and (max-width:550px)"€œ href="€js/site/pexip/complex/style-responsive.css" />  -->

<script type="text/javascript" src="js/site/pexip/complex/main-webrtc.js"></script>
<!--	<script type="text/javascript" src="js/site/pexip/complex/main.js"></script>
<script type="text/javascript" src="js/site/pexip/complex/webui.js"></script>
<script type="text/javascript" src="js/site/pexip/complex/pexrtc.js"></script>	-->

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
	}
</script>

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
	<div id="vvHeader">
		<ul id="clinician-name" style="">
			<li>    
				<h3 id="patientTitle" class="page-title" style="">Video Visits | ${WebAppContext.videoVisit.hostLastName}, ${WebAppContext.videoVisit.hostFirstName} ${WebAppContext.videoVisit.hostTitle}</h3>
			</li>
		</ul>
		<ul id="leaveEndBtnContainer" class="btn-group" style="float:right; list-style:none; font-size:100%; margin:4px 0;">
			<li class="btn btn-leaveEnd btn-leave-meeting" href="#" title="Step Away" id="inCallButtonDisconnect" onclick="disconnect();" style="border-right:1px solid #D4D4D4; cursor:pointer; display:inline-block;"></li>
			<!-- <li class="btnLast" style="display:inline-block; margin-left:10px; margin-right:10px;"><a href="mdohelp.htm" target="_blank">Help</a></li> -->
		</ul>
	</div>
	<!-- PEXIP Container - START -->
	<div id="container" class="site">
	    <!-- Header -->
	    <!-- <header id="header" class="branding" role="banner">
	        <img src="js/site/pexip/complex/img/logo.png" alt="Pexip">
	        <h1>Infinity</h1>
	    </header> -->
	    <!-- END Header -->

	    <!-- Content -->
	    
	  	<div id="enterDetails" class="main site join">
		    <!-- <label for="id_alias" class="vh">Enter the conference alias</label>
		    <input type="text" value="meet.NCAL_TEST5" name="alias" id="id_alias" placeholder="Enter the conference alias" required class="webrtcinput">

		    <label for="id_name" class="vh">Enter your name</label>
		    <input type="text" value="Guest" name="name" id="id_name" placeholder="Enter your name" required class="webrtcinput"> -->

		    <select name="bandwidth" class="webrtcinput" id="id_bandwidth">
		        <option value="1920">Maximum Bandwidth (1920kbps)</option>
		        <option value="1280" selected>High Bandwidth (1280kbps)</option>
		        <option value="576">Medium Bandwidth (576kbps)</option>
		        <option value="192">Low Bandwidth (192kbps)</option>
		    </select>

		    <input type="submit" value="Join Conference" name="join" id="join-conf" class="webrtcbutton">
		    <input type="submit" value="Present Screen Only" name="join_pres" id="id_join_pres" class="webrtcbutton">
		</div>
		<div id="selectPeripheral" class="main site join">
			<div class="select">
		    	<label for="videoSource">Video source: </label><select id="videoSource"></select>
		  	</div>
			<div class="select">
				<label for="audioSource">Mic source: </label><select id="audioSource"></select>
			</div>
			<div class="select">
				<label for="speakerSource">Speaker source: </label><select id="speakerSource"></select>
			</div>
		<!-- <input type="submit" value="Join Conference" name="join" id="join-conf" class="webrtcbutton">
	    <input type="submit" value="Present Screen Only" name="join_pres" id="join-conf-smd" class="webrtcbutton"> -->
	  </div>

	    <!-- END Content -->

	  <div id="selectrole" class="main site join hidden">
	    <h2>Select your role for this conference:</h2>
	    <form>
	    	<div class="cf">
	            <input type="radio" value="2" name="role" id="id_host" class="webrtcinput" checked>
	            <label for="id_host">Host</label>
	        </div>
	        <div class="cf">
	            <input type="radio" value="1" name="role" id="id_guest" class="webrtcinput">
	            <label for="id_guest">Guest</label>
	        </div>

	        <input type="button" value="Join Conference" name="join" id="id_join" class="webrtcbutton" onClick="submitSelectRole();">
	        <!-- <input type="button" value="Join Conference" name="join" id="roleSelected" class="webrtcbutton" onClick="submitSelectRole();"> -->
	    </form>
	  </div>


	  <div id="pinentry" class="main site join hidden">
	    <form onSubmit="return submitPinEntry();">
	        <label for="id_pin" class="vh">Enter the conference PIN</label>
	        <input type="password" value="1234" name="pin" id="id_pin" placeholder="Enter the conference PIN" required class="webrtcinput">

	        <input type="button" value="Join Conference" name="join" id="id_join" class="webrtcbutton" onClick="submitPinEntry();">
	    </form>
	  </div>


	  <div id="ivrentry" class="main site join hidden">
	    <form onSubmit="return submitIVREntry();">
	        <label for="id_room" class="vh">Enter the target extension</label>
	        <input type="text" value="" name="room" id="id_room" placeholder="Enter the target extension" required class="webrtcinput">

	        <input type="button" value="Join Conference" name="join" id="id_join" class="webrtcbutton" onClick="submitIVREntry();">
	    </form>
	  </div>

	 
	  <div id="maincontent" class="main cf hidden">
	    <section class="top">
	      <aside class="participants"><!-- List of participants -->
	        <h2 id="rosterheading">Participants</h2>
	        <div id="rosterlist" class="rosterlist">
	          <ul id="rosterul">
	          </ul>
	        </div>

	        <!-- SIP Dial Out - START -->
	        <div id="sipDialOut-container" class="site join">
	        	<!-- <form onSubmit="return sipDialOut();"> -->
		        <h2> Invite by Phone </h2>
		        <input type="text" value="" name="sipDialOut" id="id_join" placeholder="Enter 10 digit phone number" maxlength="10" class="webrtcinput" style="display:block;">
		        <input type="button" value="Call" name="join" id="id_join" class="webrtcbutton" onClick="sipDialOut();" style="display:block; width:100%;">
			    <!-- </form> -->
		    </div>
	        <!-- SIP Dial Out - END -->

	        <div id="info-button-container" class="site join">
	        	<input type="button" value="Info" name="join" id="info-button" class="webrtcbutton" onClick="getMediaStats();" style="display:block; width:100%;">
	        </div>

	        <div id="selfview" class="selfview" hidden>
	          <video id="selfvideo" autoplay="autoplay" playsinline="playsinline" muted="true">
	          </video>
	        </div>
	      </aside>
	      <div id="videocontainer" class="videocontainer">
	        <video width="100%" height="100%" id="video" autoplay="autoplay" playsinline="playsinline" poster="img/spinner.gif"></video>
	        
	        <div id="stat-window-container">
	        	<table id="stat-window">
	        		<!-- <tr>
		        		<th> Outgoing Audio </th>
		        		<th> Outgoing Video </th>
		        		<th> Input Audio </th>
		        		<th> Input Video </th>
		        	</tr>
		        	<tr>
		        		<td></td>
		        		<td></td>
		        		<td></td>
		        		<td></td>
		        	</tr> -->
	        	</table>
	        </div>
	      </div>
	    </section>

	    <footer id="controls" class="controls cf">
	      <ul>
	        <li><a id="id_selfview" class="webrtcbutton btn-selfview" onclick="toggleSelfview();">Show Selfview</a></li>
	        <li><a id="id_muteaudio" class="webrtcbutton btn-audio" onclick="muteAudioStreams();">Mute Audio</a></li>
	        <li><a id="id_mutevideo" class="webrtcbutton btn-video" onclick="muteVideoStreams();">Mute Video</a></li>
	        <li><a id="id_fullscreen" class="webrtcbutton btn-fullscreen inactive" onclick="goFullscreen();">Fullscreen</a></li>
	        <li><a id="id_screenshare" class="webrtcbutton btn-presentscreen" onclick="presentScreen();">Present Screen</a></li>
	        <li><a id="id_presentation" class="webrtcbutton btn-presentation inactive" onclick="togglePresentation();">No Presentation Active</a></li>
	        <!-- <li><a id="id_disconnect" class="webrtcbutton btn-disconnect" onclick="window.location='index.html';">Disconnect</a></li> -->
	        <li><a id="id_disconnect" class="webrtcbutton btn-disconnect" onclick="disconnect();">Disconnect</a></li>
	      </ul>
	    </footer>
	  </div>
	</div>
	<!-- PEXIP Container - END -->
</div>

