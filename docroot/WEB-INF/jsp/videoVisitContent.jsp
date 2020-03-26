	<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
	<%@ taglib prefix='fn' uri='http://java.sun.com/jsp/jstl/functions' %>
	<meta name="robots" content="noindex, nofollow" />
	<meta name="robots" content="NONE,NOARCHIVE" />

	<link rel="stylesheet" type="text/css" href="js/site/pexip/complex/style.css" />
	<!-- <link rel="stylesheet" media="€screen and (min-width:320px) and (max-width:550px)"€œ href="€js/site/pexip/complex/style-responsive.css" />  -->

	<link rel="stylesheet" type="text/css" href="css/library/conference/jNotify.jquery.css" media="screen" />

	<script src="js/site/videovisit/videoVisit.js" type="text/javascript"></script>

	<script src="js/library/conference/libs/bootstrap.min.2.3.2.js"></script>
	<script src="js/library/conference/libs/bootstrap-notify.1.0.js"></script>
	<script src="js/library/conference/libs/jnotify/jNotify.jquery.js"></script>
	<script src="js/library/conference/libs/jquery.countdown.min.js"></script>

	<script type="text/javascript" src="js/site/pexip/complex/desktop-main-webrtc.js"></script>
	<!--	<script type="text/javascript" src="js/site/pexip/complex/main.js"></script>
<script type="text/javascript" src="js/site/pexip/complex/webui.js"></script>
<script type="text/javascript" src="js/site/pexip/complex/pexrtc.js"></script>	-->

	<!-- <input type="hidden" id="confName" value="" />
<input type="hidden" id="name" value="" />
<input type="hidden" id="bandwidth" value="" /> -->

	<script type='text/javascript'>
		window.onload = function () {
			var chrome_ver = 0;
			var firefox_ver = 0;
			var edge_ver = 0;
			var safari_ver = 0;

			if (navigator.userAgent.indexOf("Chrome") != -1) {
				chrome_ver = parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
				$('#inCallButtonLocalShare').css('display', 'block');
			}

			if (navigator.userAgent.indexOf("Firefox") != -1) {
				firefox_ver = parseInt(window.navigator.userAgent.match(/Firefox\/(\d+)\./)[1], 10);
				$('#inCallButtonLocalShare').css('display', 'block');
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
			if (!(chrome_ver > 38 || firefox_ver > 51)) {
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
			var browserUserAgent = navigator.userAgent;
			if (navigator.appCodeName == 'Mozilla') {
				if (browserUserAgent.indexOf('Safari/') > -1 && browserUserAgent.indexOf('Chrome/') == -1) {
					var isSafari = true;
				} else if (browserUserAgent.indexOf('Firefox/') !== -1) {
					var isFirefox = true;
				}
			}
			if (isSafari || isFirefox) {
				$('#inCallButtonToggleConfig').css('display', 'none');
			}
		}
	</script>

	<script type='text/javascript'>
		function switchImage() {
			document.getElementById('presimage').src.src = document.getElementById('loadimage').src;
		}
	</script>

	<style>
		html {
			padding: 0;
		}

		ul {
			margin-left: 0;
		}

		#stat-window-container {
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

		#stat-window-container table {
			/*border: 1px solid white;*/
		}

		#stat-window th,
		#stat-window td {
			border: 1px solid white;
			width: 20%;
		}

		#stat-window tr {
			height: 20px;
		}

		#inCallButtonLocalShare {
			display: none;
		}
	</style>

	<div id="container-videovisit" class="container-videovisit">
		<div id="vvHeader">
			<ul id="clinician-name" style="">
				<li>
					<h3 id="patientTitle" class="page-title" style="">Video Visits</h3>
				</li>
			</ul>
			<div class="right-container">
				<a href="mdohelp.htm" target="_blank"><span class="help">Help</span></a>
				<span class="refresh-button">Refresh</span>
			</div>

			<!-- <ul id="leaveEndBtnContainer" class="btn-group" style="float:right; list-style:none; font-size:100%; margin:4px 0;">
			<li class="btn btn-leaveEnd btn-leave-meeting" href="#" title="Step Away" id="inCallButtonDisconnect" onclick="disconnect();" style="border-right:1px solid #D4D4D4; cursor:pointer; display:inline-block;"></li> -->
			<!-- <li class="btnLast" style="display:inline-block; margin-left:10px; margin-right:10px;"><a href="mdohelp.htm" target="_blank">Help</a></li> -->
			<!-- </ul> -->
		</div>
		<!-- PEXIP Container - START -->
		<div id="container" class="site pexip-main-container">
			<!-- Header -->
			<!-- <header id="header" class="branding" role="banner">
	        <img src="js/site/pexip/complex/img/logo.png" alt="Pexip">
	        <h1>Infinity</h1>
	    </header> -->
			<!-- END Header -->

			<!-- Content -->

			<div id="enterDetails" class="main site join" style="display: none;">

				<select name="bandwidth" class="webrtcinput" id="id_bandwidth">
					<option value="1920">Maximum Bandwidth (1920kbps)</option>
					<option value="1280" selected>High Bandwidth (1280kbps)</option>
					<option value="576">Medium Bandwidth (576kbps)</option>
					<option value="192">Low Bandwidth (192kbps)</option>
				</select>

				<input type="submit" value="Join Conference" name="join" id="join-conf" class="webrtcbutton">
				<input type="submit" value="Present Screen Only" name="join_pres" id="id_join_pres" class="webrtcbutton">
			</div>

			<!-- END Content -->

			<!-- <div id="selectrole" class="main site join hidden" style="display: none;">
	    <h2>Select your role for this conference:</h2>
	    <form>
	    	<div class="cf">
	            <input type="radio" value="2" name="role" id="id_host" class="webrtcinput">
	            <label for="id_host">Host</label>
	        </div>
	        <div class="cf">
	            <input type="radio" value="1" name="role" id="id_guest" class="webrtcinput" checked>
	            <label for="id_guest">Guest</label>
	        </div>

	        <input type="button" value="Join Conference" name="join" id="id_join" class="webrtcbutton" onClick="submitSelectRole();">
	    </form>
	  </div> -->


			<div id="pinentry" class="main site join hidden" style="display: none;">
				<form onSubmit="return submitPinEntry();">
					<label for="id_pin" class="vh">Enter the conference PIN</label>
					<input type="password" value="1234" name="pin" id="id_pin" placeholder="Enter the conference PIN"
						required class="webrtcinput">

					<input type="button" value="Join Conference" name="join" id="id_join" class="webrtcbutton"
						onClick="submitPinEntry();">
				</form>
			</div>


			<div id="ivrentry" class="main site join hidden">
				<form onSubmit="return submitIVREntry();">
					<label for="id_room" class="vh">Enter the target extension</label>
					<input type="text" value="" name="room" id="id_room" placeholder="Enter the target extension" required
						class="webrtcinput">

					<input type="button" value="Join Conference" name="join" id="id_join" class="webrtcbutton"
						onClick="submitIVREntry();">
				</form>
			</div>


			<div id="maincontent" class="main cf hidden">
				<section class="conference-renderer">
					<div class="provider-btn-container" id="btnContainer">
						<div class="btn-group" id="buttonGroup" style="width: 100%; position: static;">
							<div id="inCallButtonMuteVideo">
								<div title="Enable Video" id="id_video_unmute" class="btns video-muted-btn"
									onclick="muteUnmuteVideo()">&nbsp;</div>
								<div title="Disable Video" id="id_video_mute" class="btns video-btn"
									onclick="muteUnmuteVideo()">&nbsp;</div>
							</div>
							<div id="inCallButtonMuteSpeaker">
								<div title="Mute Speakers" id="id_speaker_mute" class="btns speaker-btn"
									onclick="muteSpeaker()">&nbsp;</div>
								<div title="Unmute Speakers" id="id_speaker_unmute" class="btns speaker-muted-btn"
									onclick="muteSpeaker()">&nbsp;</div>
							</div>
							<div id="inCallButtonMuteMicrophone">
								<div title="Mute Mic" id="id_mic_mute" class="btns microphone-btn"
									onclick="muteUnmuteMic()">&nbsp;</div>
								<div title="Unmute Mic" id="id_mic_unmute" class="btns microphone-muted-btn"
									onclick="muteUnmuteMic()">&nbsp;</div>
							</div>
							<!--<div id="inCallButtonLocalShare">
	                   <div title="" id="id_screenshare" class="btns smd-btn" onclick="presentScreen();">&nbsp;</div>
	                   <div title="" id="id_screen_unshare" class="btns smd-muted-btn"onclick="stopSharing();">&nbsp;</div>
	                </div>-->
							<!-- To do later - Full Screen Implementation-->
							<!-- <div id="inCallButtonExpand" onclick="goFullscreen()">
	                   <div title="Expand" class="btns expand-btn">&nbsp;</div>
	                </div> -->
							<div id="inCallButtonToggleConfig" onclick="togglePeripherals()">
								<div title="Settings" class="btns settings-btn">&nbsp;</div>
							</div>
						</div>
					</div>
					<div id="pluginContainer" class="videocontainer">
						<div id="selectPeripheral1" class="list-of-devices"
							style="position:absolute;width:260px;display:none;">
							<div id="close-button" onclick="togglePeripherals()"></div>
							<div class="settings-txt">Settings</div>
							<div id="selectContainer">
								<div class="select">
									<label for="videoSource"
										style="font-family: Arial;font-size: 16px;cursor: default;">Camera: </label><select
										id="videoSource"></select>
								</div>
								<div class="select">
									<label for="audioSource"
										style="font-family: Arial;font-size: 16px;cursor: defaultvideov;">Microphone:
									</label><select id="audioSource"></select>
								</div>
								<div class="select">
									<label for="speakerSource"
										style="font-family: Arial;font-size: 16px;cursor: default;">Speaker:
									</label><select id="speakerSource"></select>
								</div>
								<!-- <input type="submit" value="Join Conference" name="join" id="join-conf" class="webrtcbutton">
				<input type="submit" value="Present Screen Only" name="join_pres" id="join-conf-smd" class="webrtcbutton"> -->
							</div>
							<div><button class="done-btn" onclick="togglePeripherals()">Done</button></div>
						</div>
						<div class="full-waiting-room" id="fullWaitingRoom">
							<div id="waitingRoom" class="conference-waiting-room">
								<div class="waitingRoomMessageBlock">
									<img src="images/conference/TPMG_logo.png" class="waitingroom-logo" />
									<span class="waitingroom-text" id="lateText">Your visit will start once your doctor
										joins.</span>
								</div>
							</div>
						</div>
						<div id="halfWaitingRoom" class="conference-waiting-room">
							<div class="waitingRoomMessageBlock">
								<img src="images/conference/TPMG_logo.png" class="waitingroom-logo" />
								<span class="waitingroom-text">Your visit will start once your doctor joins.</span>
							</div>
						</div>
						<video class="remoteFeed" width="100%" height="100%" id="video" autoplay="autoplay"
							playsinline="playsinline"></video>

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
						<div id="selfview" class="selfview">
							<video id="selfvideo" autoplay="autoplay" playsinline="playsinline" muted="true">
							</video>
						</div>
						<div id="presentation-view" class="presentation-view"></div>
					</div>

					<aside class="participants">
						<!-- List of participants -->
						<div class="video-details" id="video-sidebar">
							<div class="well hide" id="configurationWrap" style="display: none;"> <a class="close"
									id="configurationCross" href="#" data-hide="alert">×</a>
								<h3 class="text-left">Settings</h3>
								<div class="control-group">
									<label class="control-label" for="configurationCamera">Camera</label>
									<div class="controls" id="configurationCamera"></div>
								</div>
								<div class="control-group">
									<label class="control-label" for="configurationSpeaker">Speaker</label>
									<div class="controls" id="configurationSpeaker"></div>
								</div>
								<div class="control-group">
									<label class="control-label" for="configurationMicrophone"
										onclick="muteAudioStreams();">Microphone</label>
									<div class="controls" id="configurationMicrophone"></div>
								</div>
							</div>
							<ul class="dropdown-menu" id="inCallLocalShareList" role="menu"
								style="max-height: 400px;display:none;"></ul>
							<div class="visit-info-container">
								<div class="visit-info">
									<button class="leave-conference" id="inCallButtonDisconnect"
										onclick="disconnect();">Leave Room</button>
									<div class="visit-detail-txt">Visit Details</div>
									<div class="host-details" id="meetingHost"><img class="host-indicator"
											style="visibility: hidden;" src="images/conference/svg/SVG/Connected.svg"><span
											class="member-name">bob billy, MD</span><span class="three-dots"><img
												src="images/conference/svg/SVG/Action.svg"></span></div>
									<div class="meeting-time-date-info">
										<span class="time-display">2:15AM, </span>
										<span class="date-display">Mon, Apr 1</span>
									</div>
									<div class="meeting-updated-time-date-info">
										<span class="time-display"></span>
									</div>
								</div>
							</div>
							<div class="participant-details">
								<div class="participants-header">
									<span class="guests">Guests</span>
								</div>
								<div class="participants-list"></div>
							</div>
						</div>
					</aside>
				</section>

				<!--<footer id="controls" class="controls cf">
	      <ul>
	        <li><a id="id_selfview" class="webrtcbutton btn-selfview" onclick="toggleSelfview();">Show Selfview</a></li>
	        <li><a id="id_muteaudio" class="webrtcbutton btn-audio" onclick="muteAudioStreams();">Mute Audio</a></li>
	        <li><a id="id_mutevideo" class="webrtcbutton btn-video" onclick="muteVideoStreams();">Mute Video</a></li>
	        <li><a id="id_fullscreen" class="webrtcbutton btn-fullscreen inactive" onclick="goFullscreen();">Fullscreen</a></li>
	        <li><a id="id_screenshare" class="webrtcbutton btn-presentscreen" onclick="presentScreen();">Present Screen</a></li>
	        <li><a id="id_presentation" class="webrtcbutton btn-presentation inactive" onclick="togglePresentation();">No Presentation Active</a></li>
	        <li><a id="id_disconnect" class="webrtcbutton btn-disconnect" onclick="disconnect();">Disconnect</a></li>
	      </ul>
	    </footer>-->
			</div>
		</div>
		<!-- PEXIP Container - END -->
		<div id="dialog-block-meeting-disconnected00" class="modal hide fade" tabindex="-1" role="dialog"
			aria-labelledby="userLoginLabel" aria-hidden="true">
			<div class="modal-title" style="
    background: #ccc;
    padding: 1%;
">Unable to access your camera or microphone</div>
			<div class="modal-body">
				<div class="dialog-content-question">
					<p id="start_meeting_question" style="padding:15px;font-weight:bold;text-align:center;"
						class="question">
						Check that your camera is properly connected or not being actively used by another application.
					</p>
					<div class="pagination">
						<input type="button" style="width:150px;" value="OK" onclick="return disconnect()"
							id="meetingDisconnected" class="button">
					</div>
				</div>
			</div>
		</div>
	</div>