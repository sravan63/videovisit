<!-- Splash screen -->
<div class="splash" style="height:100vh;display:block;" id="splash">
	<div><img src="images/conference/vv_splash.png" alt="Vidyo Logo" /></div>
	<div id="splashText" style="margin-top: 15px; visibility: hidden;">
		<h4>Video Visits - The Permanente Medical Group</h4>
	</div>
	<div style="visibility: hidden;"><img src="images/conference/loader-bar.gif" /></div>
</div>
<!-- End Splash screen -->

<div id="container-videovisit" class="container-videovisit-header" style="width:auto; visibility: hidden;">
	<div id="vvHeader">
		<ul id="clinician-name" style="">
			<li>
				<h3 id="patientTitle" class="page-title" style="">Video Visits |
					${WebAppContext.videoVisit.hostLastName}, ${WebAppContext.videoVisit.hostFirstName}
					${WebAppContext.videoVisit.hostTitle}</h3>
			</li>
		</ul>
		<ul id="leaveEndBtnContainer" class="btn-group"
			style="float:right; list-style:none; font-size:100%; margin:4px 0;">
			<li class="btn btn-leaveEnd btn-leave-meeting" href="#" title="Step Away" id="inCallButtonDisconnect"
				style="border-right:1px solid #D4D4D4;"></li>
			<li class="btnLast" style="display:inline-block; margin-left:10px; margin-right:10px;"><a href="mdohelp.htm"
					target="_blank">Help</a></li>
		</ul>
	</div>

	<div id="container-video" style="clear:both;width:100%;">
		<div id="video-main" style="clear:both; float:left;">
			<div id="withjs" class="hide">
				<!-- Central inCallContainer -->
				<div id="inCallContainer" class="container hide">

					<!-- Plugin and controls panel -->
					<div id="inCallPluginAndControlsWrap">
						<!-- Plugin wrapper -->
						<div style="display:inline-block; float:left;">
							<!--US13310 & US133102(iteration21) Satish Start-->
							<div id="waitingRoom" class="conference-waiting-room">
								<div class="waitingRoomMessageBlock">
									<img src="images/conference/TPMG_logo.png" class="waitingroom-logo" />
									<span class="waitingroom-text">Your visit will start once your doctor joins.</span>
								</div>
								<!-- US133102(iteration21) End-->
							</div>
							<div id="pluginContainer"
								style="background-color: black; display:inline-block; float:left;">
								<!-- Will autogenerate plugin tag -->
								<div class="video-frames" style="height:100%;">
									<div class="container" id="whole">
										<!-- <div class="videoWrapperFull" id="VidyoSplash" style="display:none;" align="center">
												<img src="images/conference/logo-big.jpg" style="padding-top: 75px;">
												<div id="loaderBar"><img src="images/conference/loader-bar.gif" alt="Loading"/></div>
											</div>-->

										<div class="videoWrapperSmall" id="VidyoArea" align="center">
											<div id="participantDiv0" class="participant-wrapper">
												<video id="remoteVideo0" autoplay=""
													class="remotevideo-default"></video>
												<span id="participant0" class="participant-title"></span>
											</div>

											<div id="participantDiv1" class="participant-wrapper">
												<video id="remoteVideo1" autoplay=""
													class="remotevideo-default"></video>
												<span id="participant1" class="participant-title"></span>
											</div>

											<div id="participantDiv2" class="participant-wrapper">
												<video id="remoteVideo2" autoplay=""
													class="remotevideo-default"></video>
												<span id="participant2" class="participant-title"></span>
											</div>

											<div id="participantDiv3" class="participant-wrapper">
												<video id="remoteVideo3" autoplay=""
													class="remotevideo-default"></video>
												<span id="participant3" class="participant-title"></span>
											</div>
											<div id="shareVideoDiv" class="sharevideo-wrapper">
												<video id="shareVideo0" autoplay="" class="remotevideo-default"></video>
												<span id="shareName" class="participant-title"></span>
											</div>

											<div id="selfViewDiv" class="local-participant-wrapper">
												<video id="localVideo" autoplay="" muted
													class="localvideo-default"></video>
												<span id="localNameDiv" class="local-participant-title">Self View</span>
											</div>
										</div>
									</div>
									<!--<div class="buttons" id="Buttons" align="center" style="display: none;">
											<button id="img_share_b"   onclick="toggleShare()">
												 <img id="img_share" height="15px" src="./images/share.png">
											</button>
											<button id="img_camera_b"   onclick="toggleCameraIcon()">
												 <img id="img_camera" height="15px" src="./images/camera.png">
											</button>
											<button id="img_mic_b"       onclick="toggleMicIcon()">
												 <img id="img_mic" height="15px" src="./images/mic.png">
											</button>
											<button id="img_speaker_b"   onclick="toggleSpeakerIcon()">
												 <img id="img_speaker" height="15px" src="./images/speaker.png">
												 </button>
											<button id="img_disconnect_b"onclick="sendLeaveEvent()">
												 <img id="img_speaker" height="15px" src="./images/disconnect.png">
											</button>
										</div>	-->
								</div>
							</div>
						</div>
						<!--Satish US13301 End -->


						<div id="btnContainer" class="vidyo-webrtc-btn-container" style="position:static;">
							<div id="buttonGroup" class="btn-group" style="width:100%; position:static;">
								<span style="display:block; width:100%; height:auto; background-color:#6A6A6A;">
									<a class="btn btn-large btn-hideDetails" title="Hide/Show Details"
										id="inCallButtonToggleDetails"
										style="width:100%; height:33px;cursor: pointer;"></a>
								</span>
								<!-- US22684 -->
								<!-- <a class="btn btn-large btn-config" title="Settings" id="inCallButtonToggleConfig" style="display:block;cursor: pointer;"></a> -->
								<!-- US22684 -->
								<!-- Configuration panel -->
								<div class="well hide" id="configurationWrap">
									<!-- See configurationTemplate in main.config.js-->
								</div>

								<!--US19792 Start-->
								<!--<a class="btn btn-large btn-local-share" data-toggle="dropdown" href="#" id="inCallButtonLocalShare" title="Share Desktop" style="display:block;"></a>
										<ul class="dropdown-menu" role="menu" id="inCallLocalShareList" style="max-height:400px;">
											<!-- Look at the inCallLocalSharesTemplate in main.config.js 
										</ul>-->

								<a class="btn btn-large btn-tmv-success" title="Disable Video"
									id="inCallButtonMuteVideo" style="display:block;cursor: pointer;"></a>
								<!--US18908 Swap Microphone and Speaker in Vidyo Player Start-->
								<a class="btn btn-large btn-tmm-success" title="Mute Mic"
									id="inCallButtonMuteMicrophone" style="display:block;cursor: pointer;"></a>


								<a class="btn btn-large btn-tms-success" title="Mute Speakers"
									id="inCallButtonMuteSpeaker"
									style="display:block;background-position:5px -290px;cursor: pointer;"></a>



								<!--<div style="clear:both; border-bottom:1px solid #6A6A6A;">
										
										<div id="volume-control-speaker" style="height: 35px; width: 3px; vertical-align: middle; margin: 12px; display: inline-block; background: grey;">
											<a id="slider-handle-speaker" class="ui-slider-handle ui-state-default ui-corner-all" href="#" style="border:1px solid #FFFFFF; width:9px; height:2px; margin-left:-4px; position:absolute;"></a>
										</div>
									</div>-->
								<!--US19792 End-->
								<a class="btn btn-large btn-tmc" href="#" title="Phone-A-Friend" id="inCallButtonCall"
									style="visibility:hidden;"></a>
							</div>

							<!-- END -->
						</div>

						<!-- End Plugin wrapper  -->
						<!-- Chat container -->
						<div id="inCallChatContainer" class="well well-small hide">

						</div>
						<!-- End chat container -->
					</div>
					<!-- End Plugin and Controls panel -->
				</div>
				<!-- End Central inCallContainer -->

				<!-- Configuration panel -->
				<div class="well hide" id="configurationWrap">
					<!-- See configurationTemplate in main.config.js-->
				</div>
				<!-- End of Configuration panel -->
				<input id="meetingExpiredTimerFlag" type="hidden" value="false">
				<input id="sendEmailPopUpFlag" type="hidden" value="false">
			</div>
			<!-- End of withjs div -->
			<!-- PROVIDER: START- meeting leave yes no dialog  -->
			<div id="dialog-block-override-meeting-leave" class="modal hide fade" tabindex="-1" role="dialog"
				aria-labelledby="userLoginLabel" aria-hidden="true">
				<div class="modal-header">
					<button type="button" id="leave_modal_cross_button" class="close" data-dismiss="modal"
						aria-hidden="true">x</button>
					<h3 id="">Step Away</h3>
				</div>
				<div class="modal-body">
					<div class="dialog-content-question">
						<p id="leave_meeting_question" class="question">You are temporarily leaving this meeting.<br>
							You can rejoin from the My Meetings page.<br>
							Are you sure you want to leave this meeting?</p>
						<div id="leave_meeting_error" class="error " style="padding:5px;"></div>
						<div class="pagination">
							<ul>
								<li>
									<input class="button" id="leave_meeting_button_yes" type="button"
										value="Yes &rsaquo;&rsaquo;" />
								</li>
								<li>
									<input class="button" id="leave_meeting_button_no" type="button"
										value="No &rsaquo;&rsaquo;" />
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<!-- END-  meeting leave yes no dialog  -->
			<!-- MEMBER AND GUEST: START - Quit Meeting Dialogs  -->
			<div id="quitMeetingModal" class="modal hide fade" tabindex="-1" role="dialog"
				aria-labelledby="userLoginLabel" aria-hidden="true">
				<div class="modal-header">
					<button type="button" id="quit_modal_cross_button" class="close" data-dismiss="modal"
						aria-hidden="true">x</button>
					<h3 id="">Step Away</h3>
				</div>
				<div class="modal-body">
					<div class="dialog-content-question">
						<p id="quit_meeting_question" class="question">You are temporarily leaving this meeting.<br>
							You can rejoin it.<br>
							Are you sure you want to leave this meeting?</p>
						<div id="quit_meeting_error" class="error " style="padding:5px;"></div>
						<div class="pagination">
							<ul>
								<li>
									<input class="button" id="quit_meeting_button_yes" type="button"
										value="Yes &rsaquo;&rsaquo;" />
								</li>
								<li>
									<input class="button" id="quit_meeting_button_no" type="button"
										value="No &rsaquo;&rsaquo;" />
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<!-- MEMBER AND GUEST: END - Quit Meeting Dialogs  -->
		</div>
		<div class="vidyo-webrtc-sidebar" id="video-sidebar">
			<div id="video-sidebar-banner"></div>
			<!-- video-sidebar-content START -->
			<div class="video-sidebar-content">
				<div id="video-info">
					<h3> Visit Details </h3>
					<dl>
						<dt>Appointment Date</dt>
						<dd id="displayMeetingDateTime">
							${WebAppContext.videoVisit.meetingDate}&nbsp;&nbsp;${WebAppContext.videoVisit.meetingTime}
						</dd>
						<dd id="displayMeetingNewStartTime" style="word-wrap: break-word;"></dd>
					</dl>
					<dl>
						<dt>Patient</dt>
						<dd id="meetingPatient"><span
								class="pateint-name-with-ellipsis">${WebAppContext.videoVisit.patientLastName.trim()},
								${WebAppContext.videoVisit.patientFirstName.trim()}</span><i id="patientActiveIcon"
								class="active-user-state"></i></dd>
					</dl>
					<dl>
						<dt>My Doctor</dt>
						<dd id="meetingHost">
							<span class="host-name-with-ellipsis">${WebAppContext.videoVisit.hostLastName},
								${WebAppContext.videoVisit.hostFirstName} ${WebAppContext.videoVisit.hostTitle}</span><i
								id="hostActiveIcon" class="active-user-state"></i></dd>
					</dl>

					<c:if test="${not empty WebAppContext.videoVisit.participant}">
						<dl id="meetingParticipantContainer">
							<dt>Add'l Clinicians</dt>
							<dd id="meetingParticipant">
								<c:forEach items="${WebAppContext.videoVisit.participant}" var="Provider">
									<p style="padding-bottom:10px;"><span
											class="additional-clinician-with-ellipsis">${Provider.lastName.trim()},
											${Provider.firstName.trim()} ${Provider.title.trim()}</span><i
											class="active-user-state"></i></p>
								</c:forEach>
							</dd>
						</dl>
					</c:if>
					<c:if test="${not empty WebAppContext.videoVisit.caregiver}">
						<dl id="meetingPatientGuestContainer">
							<dt>My Guests</dt>
							<dd id="meetingPatientGuest" style="display:none;">
								<c:set var="memVidyPhNumCount" value="0" scope="page" />
								<c:forEach items="${WebAppContext.videoVisit.caregiver}" var="Caregiver">
									<c:if test="${Caregiver.lastName == 'audio_participant'}">
										<c:set var="memVidyPhNumCount" value="${memVidyPhNumCount + 1}" scope="page" />
										<p><span class="pg-with-ellipsis"><span class="lName"
													lastnameattr="${Caregiver.lastName}"></span> <span class="fName"
													firstnameattr="${Caregiver.firstName}">Phone
													${memVidyPhNumCount}</span><span class="email"
													style="display:none;">${Caregiver.emailAddress.trim()}</span></span><i
												class="active-user-state"></i></p>
									</c:if>
									<c:if test="${Caregiver.lastName != 'audio_participant'}">
										<p><span class="pg-with-ellipsis"><span
													class="lName">${Caregiver.lastName.trim()}</span>, <span
													class="fName">${Caregiver.firstName.trim()}</span><span
													class="email"
													style="display:none;">${Caregiver.emailAddress.trim()}</span></span><i
												class="active-user-state"></i></p>
									</c:if>
								</c:forEach>
							</dd>
						</dl>
					</c:if>
					<!--<dl id="meetingNoteContainer">
							<dt>NOTES:</dt><dd id="meetingNote">Notes</dd>
						</dl> -->
				</div>
				<div id="refreshContainer">
					<p class="refresh-text"><span style="font-weight:bold;">Video issues?</span><br> Try refreshing</p>
					<input name="refresh" value="Refresh" class="refresh-button" type="button">
				</div>
			</div>
			<!-- video-sidebar-content END -->
		</div>
	</div>
</div>
<!-- US15318 - START [Popup displays after meeting disconnected] -->
<div id="dialog-block-meeting-disconnected" class="modal hide fade" tabindex="-1" role="dialog"
	aria-labelledby="userLoginLabel" aria-hidden="true">
	<div class="modal-body">
		<div class="dialog-content-question">
			<p id="start_meeting_question" style="padding:15px;font-weight:bold;text-align:center;" class="question">
				Your video visit has ended.
			</p>
			<div class="pagination">
				<input type="button" style="width:150px;" value="Leave visit" id="meetingDisconnected" class="button">
			</div>
		</div>
	</div>
</div>
<!-- US15318 - END -->
<link rel="stylesheet" type="text/css" href="css/library/conference/jNotify.jquery.css" media="screen" />

<!-- <link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/start/jquery-ui.css"> -->
<link rel="stylesheet" href="css/library/conference/main-webrtc.css">
<link rel="chrome-webstore-item" href="https://chrome.google.com/webstore/detail/fadjebjcpiiklefiadeicakcnkhgbaoo">

<!-- <script src="./lib/jquery-1.12.2.min.js"></script>
	<script src="./lib/jquery-ui.min.js"></script>
	<script src="../../scripts/webrtc/vidyo.client.messages.js"></script>
	<script src="./scripts/vidyowebrtc/vidyo.client.private.messages.js"></script>
	<script src="./scripts/vidyowebrtc/vidyo.client.js"></script>
	<script src="./scripts/main.js"></script> -->

<script src="js/site/videovisit/videoVisit.js" type="text/javascript"></script>

<script src="vidyoplayer/scripts/webrtc/vidyo.client.messages.js"></script>
<script src="vidyoplayer/scripts/webrtc/vidyo.client.private.messages.js"></script>
<script src="vidyoplayer/scripts/webrtc/vidyo.client.js"></script>
<!-- <script src="vidyoplayer/scripts/libs/jquery.1.11.0.min.js"></script> -->
<script src="vidyoplayer/scripts/libs/bootstrap.min.2.3.2.js"></script>
<script src="vidyoplayer/scripts/libs/bootstrap-notify.1.0.js"></script>
<script src="vidyoplayer/scripts/libs/jnotify/jNotify.jquery.js"></script>
<script src="vidyoplayer/scripts/main-webrtc.js"></script>


<script type="text/javascript">
	bodyLoaded();

	$(".refresh-button").click(function () {
		window.location.href = window.location.href;
	});

	(function () {
		/* jQuery is not available yet so use native JavaScript */
		document.getElementById("withjs").className = "";
		//document.getElementById("withoutjs").className += "hide";
	})();
	// IE sometimes does not have console defined. Define it for in this case.
	if (typeof console === 'undefined') {
		console = {
			log: function () {},
			error: function () {},
			debug: function () {},
			warn: function () {}
		}
	}
</script>