
	<!-- <link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/start/jquery-ui.css"> -->
	<link rel="stylesheet" href="vidyoplayer/css/main-webrtc.css">
	<link rel="chrome-webstore-item" href="https://chrome.google.com/webstore/detail/fadjebjcpiiklefiadeicakcnkhgbaoo">
	<!-- <script src="./lib/jquery-1.12.2.min.js"></script>
	<script src="./lib/jquery-ui.min.js"></script> -->

<!-- <script src="../../scripts/webrtc/vidyo.client.messages.js"></script>
<script src="./scripts/vidyowebrtc/vidyo.client.private.messages.js"></script>
<script src="./scripts/vidyowebrtc/vidyo.client.js"></script> -->

<!-- <script src="./scripts/main.js"></script> -->

<script src="vidyoplayer/scripts/webrtc/vidyo.client.messages.js"></script>
    <script src="vidyoplayer/scripts/webrtc/vidyo.client.private.messages.js"></script>
    <script src="vidyoplayer/scripts/webrtc/vidyo.client.js"></script> 
    <script src="vidyoplayer/scripts/main-webrtc.js"></script>






	<script type="text/javascript">
					bodyLoaded();
			</script>

	<script type="text/javascript">
					(function () {
							/* jQuery is not available yet so use native JavaScript */
							document.getElementById("withjs").className ="";
							document.getElementById("withoutjs").className += "hide";
					})();
					// IE sometimes does not have console defined. Define it for in this case.
					if (typeof console === 'undefined') {
							console = {
									log: function() {},
									error: function() {},
									debug: function() {},
									warn: function() {}
							}
					}
					</script>
			
	<!-- Splash screen -->
	<div class="splash" style="height:100vh;display:none;" id="splash">
			<div><img src="vidyoplayer/img/vv_splash.png" alt="Vidyo Logo"/></div>
			<div id="splashText" style="margin-top: 15px; visibility: hidden;"><h4>Video Visits - The Permanente Medical Group</h4></div>
			<div style="visibility: hidden;"><img src="vidyoplayer/img/loader-bar.gif"/></div>
	</div>
	<!-- End Splash screen -->

	<div id="container-videovisit" style="width:auto; visibility:visible;">
		<div id="vvHeader">
			<ul id="clinician-name" style="">
				<li>    
					<h3 id="patientTitle" class="page-title" style="">Video Visits | ${WebAppContext.videoVisit.hostLastName}, ${WebAppContext.videoVisit.hostFirstName} ${WebAppContext.videoVisit.hostTitle}</h3>
				</li>
			</ul>
			<ul id="leaveEndBtnContainer" class="btn-group" style="float:right; list-style:none; font-size:100%; margin:4px 0;">
						<li class="btn btn-leaveEnd btn-leave-meeting" href="#" title="Step Away" id="inCallButtonDisconnect" style="border-right:1px solid #D4D4D4;"></li>
						<li class="btn btn-leaveEnd btn-end-meeting" href="#" title="End Meeting" id="inCallButtonEndMeeting" style="border-right:1px solid #D4D4D4;"></li>
						<li class="btnLast" style="display:inline-block; margin-left:10px; margin-right:10px;"><a href="mdohelp.htm" target="_blank">Help</a></li>
				</ul>
		</div>

		<div id="container-video" style="clear:both;width:100%;">
			<div id="video-main" style="background-color: #FFFF00;min-height: 500px;clear:both; float:left;">
					<div id="withjs" class="hide">
							<!-- Error view -->
							<div id="errorWrapper" class="alert alert-error hide"></div>
							<!-- End Error view -->
							<!-- Info view -->
							<div id="infoWrapper" class="alert alert-info hide"></div>
							<!-- End Error view -->
							<!-- Plugin Install Steps -->
					<div id="setupContents" class="hide">
						
						<table id="setupInstructions" width="50%" style="color:#000000;">
								<tr style="vertical-align: top;">
									<td colspan="2"><h3>Please install the 'Vidyo Web' plug-in for your visit.</h3></td>
							</tr>
							<tr height="75px" style="vertical-align: top; background-color: #E9E9E9;">
								<td width="100px" style="vertical-align: middle;"><img src="vidyoplayer/img/step_1.png" style="margin-left: 35px; margin-right: auto"/></td>
								<td>
														<br>
															<p style='color: #AC5A41; font-weight:bold;'>Download the 'Vidyo Web' plug-in installer.<br><br>
											<a id="macWinPluginFile" href="" class="installbutton">Download</a>
															</p>
								</td>
							</tr>
											<tr height="3px;"></tr>
								<tr height="100px" style="vertical-align: top; background-color: #E9E9E9;">
								<td style="vertical-align: middle;"><img src="vidyoplayer/img/step_2.png" style="margin-left: 35px; margin-right: auto"/></td>
								<td style='vertical-align: middle;'><p style='color:#AC5A41; font-weight:bold;'>Run and Install the  installer file.</p>Double click to open the file, then follow the installer instructions.</td>
							</tr>
											<tr height="3px;"></tr>
							<tr height="75px" style="vertical-align: top; background-color: #E9E9E9;">
								<td style="vertical-align: middle;"><img src="vidyoplayer/img/step_3.png" style="margin-left: 35px; margin-right: auto"/></td>
								<td>
														<br>
															<p>If you do not see an image in the video player in 10 to 15 seconds after installation, <br>please refresh your browser.<br><br>
											<a href="javascript:window.location.reload();" class="installbutton">Refresh Browser</a>
															</p>
								</td>
							</tr>
						</table>
					</div>
						
							<!-- Login as user modal window -->
							<div id="userLoginPopup" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="userLoginLabel" aria-hidden="true">
									<div class="modal-header">
											<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>
											<h3 id="userLoginLabel">Login info</h3>
									</div>
									<div class="modal-body">
											<div id="userLoginErrorWrapper" class="alert alert-error hide">
													<p id="userLoginError"></p>
											</div>
			
											<form class="form-inline">
													<fieldset>
															<label>Portal</label>
			
															<div class="input-medium">
																	<input id="userLoginPortal" type="url" placeholder="http://portalAddress" class="userLoginInput">
															</div>
															<label>Username</label>
			
															<div class="input-medium">
																	<input id="userLoginUsername" type="text" placeholder="username" class="userLoginInput">
															</div>
															<label>Password</label>
															<div class="input-medium">
																	<input id="userLoginPassword" type="password" placeholder="password" class="userLoginInput">
															</div>
													</fieldset>
											</form>
											<div id="userLoginProgressBarContainer" class="progress progress-info progress-striped active hide">
													<div id="userLoginProgressBar" class="bar" style="width: 0%;"></div>
											</div>
									</div>
									<div class="modal-footer">
											<button class="btn btn-primary" id="userLoginButton">Login</button>
									</div>
							</div>
							<!-- End Login as user modal window -->
			
							<!-- Join enter PIN dialog -->
							<div id="preCallJoinConferencePinDialog" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="preCallJoinConferencePinDialogLabel" aria-hidden="true">
									<div class="modal-header">
											<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>
											<h3 id="preCallJoinConferencePinDialogLabel">This room is PIN protected</h3>
									</div>
									<div class="modal-body">
											<div id="preCallJoinConferencePinDialogErrorWrapper" class="alert alert-error hide">
													<p id="preCallJoinConferencePinDialogError"></p>
											</div>
											<form class="form-inline" onsubmit="return false;">
													<fieldset>
															<div class="clearfix">
																	<label>PIN code</label>
																	<div class="input-medium">
																			<input id="preCallJoinConferencePinDialogPIN" type="password" tabindex="1">
																	</div>
															</div>
													</fieldset>
											</form>
									</div>
									<div class="modal-footer">
											<a class="btn btn-primary" id="preCallJoinConferencePinDialogButton" tabindex="2">Join with PIN</a>
									</div>
							</div>
							<!-- Join enter PIN dialog end -->
							<!-- Login as guest modal window -->
							<div id="guestLoginPopup" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="guestLoginLabel" aria-hidden="true">
									<div class="modal-header">
											<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>
											<h3 id="guestLoginLabel">Credentials</h3>
									</div>
									<div class="modal-body">
											<div id="guestLoginErrorWrapper" class="alert alert-error hide">
													<p id="guestLoginError"></p>
											</div>
											<form class="form-inline">
													<fieldset>
															<em>
																	<div class="clearfix">
																			<label>Guest link</label>
			
																			<div class="input-xxlarge">
																					<input class="input-xxlarge guestLoginInput" id="guestURL" type="url" placeholder="http://PORTAL_ADDRESS/flex.html?roomdirect.html&amp;key=U2AnrCjEaMBx" tabindex="1">
																			</div>
																	</div>
																	<div class="clearfix">
																			<label>Your name</label>
			
																			<div class="input-medium">
																					<input id="guestName" type="text" placeholder="Your Name" class="guestLoginInput" tabindex="2">
																			</div>
																	</div>
																	<div class="clearfix">
																			<label>PIN code if provided</label>
																			<div class="input-medium">
																					<input id="guestPIN" type="password" placeholder="PIN" tabindex="3">
																			</div>
																	</div>
															</em>
													</fieldset>
											</form>
											<div id="guestLoginProgressBarContainer" class="progress progress-info progress-striped active hide">
													<div id="guestLoginProgressBar" class="bar" style="width: 0%;"></div>
											</div>
									</div>
									<div class="modal-footer">
											<button class="btn btn-primary" id="guestLoginButton" tabindex="4">Join room</button>
									</div>
							</div>
							<!-- End Login as guest modal window -->
							<!-- Pre-call container -->
							<div id="preCallContainer" class="container well well-large hide">
									<h5 id="preCallUserInfo" class="muted"><span id="preCallUserDisplayName" class="text-info"></span>, you are @ <span id="preCallPortalName" class="text-info"></span></h5>
									<div class="navbar">
											<div class="navbar-inner">
													<!-- <form class="navbar-search pull-left"> -->
													<input type="text" class="navbar-search pull-left input input-large search-query" placeholder="Search" id="preCallSearchField">
													<!-- </form> -->
													<button class="btn btn-primary pull-left" id="preCallJoinMyRoomButton" title="In my room"><i class="icon-home"></i>  Go to my room</button>
													<button class="btn btn-danger pull-right" id="preCallLogoutButton" title="Logout"><i class="icon-off"></i>  Logout</button>
											</div>
									</div>
									<ul class="nav nav-tabs nav-stacked" id="preCallSearchNavigationList">
									</ul>
									<hr>
							</div>
							<!-- End Pre-call container -->
							
							<!-- Central inCallContainer -->
							<div id="inCallContainer" class="container hide">

									<!-- Plugin and controls panel -->
									<div id="inCallPluginAndControlsWrap">
											<!-- Plugin wrapper -->
											<div style="display:inline-block; float:left;">
											 <!--US13310 & US133102(iteration21) Satish Start-->
												<div id="waitingRoom">
													<div class="waitingRoomMessageBlock">
												<img src="vidyoplayer/img/TPMG_logo.png" class="waitingroom-logo" />
													<span class="waitingroom-text">Your visit will start once your doctor joins.</span>
													</div>
												<!-- US133102(iteration21) End--> 
												</div>
												<div id="pluginContainer" style="background-color: black; display:inline-block; float:left;">
									<!-- Will autogenerate plugin tag -->
									<br/>
											</div>
										</div>
										<!--Satish US13301 End -->

							<div id="btnContainer" style="position:static;">
								<div id="buttonGroup" class="btn-group" style="width:100%; position:static;">
									<span style="display:block; width:100%; height:auto; background-color:#6A6A6A;">
										<a class="btn btn-large btn-hideDetails" href="#" title="Hide/Show Details" id="inCallButtonToggleDetails" style="width:100%; height:33px;"></a>
									</span>
									<a class="btn btn-large btn-config" href="#" title="Settings" id="inCallButtonToggleConfig" style="display:block;"></a>
											<!-- Configuration panel -->
											<div class="well hide" id="configurationWrap">
													<!-- See configurationTemplate in main.config.js-->
											</div>
									<a class="btn btn-large btn-local-share" data-toggle="dropdown" href="#" id="inCallButtonLocalShare" title="Share Desktop" style="display:block;"></a>
										<ul class="dropdown-menu" role="menu" id="inCallLocalShareList" style="max-height:400px;">
											<!-- Look at the inCallLocalSharesTemplate in main.config.js  -->
										</ul>

									<a class="btn btn-large btn-tmv-success" href="#" title="Disable Video" id="inCallButtonMuteVideo" style="display:block;"></a>
																			 <!--US18908 Swap Microphone and Speaker in Vidyo Player Start-->
									<a class="btn btn-large btn-tmm-success" href="#" title="Mute Mic" id="inCallButtonMuteMicrophone" style="display:block;"></a>
									<div style="clear:both; border-bottom:1px solid #6A6A6A;">
										<a class="btn btn-large btn-tms-success" href="#" title="Mute Speakers" id="inCallButtonMuteSpeaker" style="width:40px; display:inline-block; border-bottom:none;"></a> 
										<div id="volume-control-speaker" style="height: 35px; width: 3px; vertical-align: middle; margin: 12px; display: inline-block; background: grey;">            
											<a id="slider-handle-speaker" class="ui-slider-handle ui-state-default ui-corner-all" href="#" style="border:1px solid #FFFFFF; width:9px; height:2px; margin-left:-4px; position:absolute;"></a>
										</div>
									</div>
									<a class="btn btn-large btn-tmc" href="#" title="Phone-A-Friend" id="inCallButtonCall" style="visibility:hidden;"></a>
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
					<div class="video-frames">
						<div class="container" id="whole">
						<div class="videoWrapperFull" id="VidyoSplash" style="display:none;" align="center">
							 <img src="vidyoplayer/img/logo-big.jpg"
									style="padding-top: 75px;">

							 <div id="loaderBar"><img src="vidyoplayer/img/loader-bar.gif" alt="Loading"/></div>

</div>

<div class="videoWrapperSmall" id="VidyoArea" align="center">
   <div id="participantDiv0" class="participant-wrapper">
      <video id="remoteVideo0" autoplay="" class="remotevideo-default"></video>
      <span id="participant0" class="participant-title"></span>
   </div>
   
   <div id="participantDiv1" class="participant-wrapper">
      <video id="remoteVideo1" autoplay="" class="remotevideo-default"></video>
      <span id="participant1" class="participant-title"></span>
   </div>
   
   <div id="participantDiv2" class="participant-wrapper">
      <video id="remoteVideo2" autoplay="" class="remotevideo-default"></video>
      <span id="participant2" class="participant-title"></span>
   </div>
   
   <div id="participantDiv3" class="participant-wrapper">
      <video id="remoteVideo3" autoplay="" class="remotevideo-default"></video>
      <span id="participant3" class="participant-title"></span>
   </div>


							 <div id="shareVideoDiv" class="sharevideo-wrapper">
									<video id="shareVideo0" autoplay="" class="remotevideo-default"></video>
									<span id="shareName" class="participant-title"></span>
							 </div>
							 
							 <div id="selfViewDiv" class="local-participant-wrapper">
									<video id="localVideo" autoplay="" muted class="localvideo-default"></video>
									<span id="localNameDiv" class="local-participant-title">Self View</span>
							 </div>
							 
						</div>
						</div>
						<div class="buttons" id="Buttons" align="center" style="display: none;">
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
						</div>
						
					</div>
					<div class="video-controls">
						
					</div>
			</div>
			<div id="video-sidebar">
				<div id="video-sidebar-banner"></div>
				<!-- video-sidebar-content START -->  
				<div class="video-sidebar-content">
					<div id="video-info">
						<h3> Visit Details </h3>
						<dl>
								<dt>APPOINTMENT DATE</dt><dd id="displayMeetingDateTime">${WebAppContext.videoVisit.meetingDate}&nbsp;&nbsp;${WebAppContext.videoVisit.meetingTime}</dd>
								<dd id="displayMeetingNewStartTime" style="word-wrap: break-word;"></dd>
						</dl>
						<dl>
							<dt>PATIENT</dt><dd id="meetingPatient">${WebAppContext.videoVisit.patientLastName}, ${WebAppContext.videoVisit.patientFirstName} ${WebAppContext.videoVisit.patientMiddleName}</dd>
						</dl>
						<dl>
							<dt>MY DOCTOR</dt><dd id="meetingHost"> 
							${WebAppContext.videoVisit.hostLastName}, ${WebAppContext.videoVisit.hostFirstName} ${WebAppContext.videoVisit.hostTitle}</dd>
						</dl>
						
						<c:if test="${not empty WebAppContext.videoVisit.participant}">
							<dl id="meetingParticipantContainer">
								<dt>ADD'L CLINICIAN(S)</dt>
								<dd id="meetingParticipant">
									<table>     
										 <c:forEach items="${WebAppContext.videoVisit.participant}" var="Provider">        
												<tr>
														<td style="padding-bottom:10px;">${Provider.lastName}, ${Provider.firstName} ${Provider.title}</td>            
												</tr>
											 </c:forEach>
										</table>
								</dd>
							</dl>
						</c:if>
						
						<c:if test="${not empty WebAppContext.videoVisit.caregiver}">
							<dl id="meetingPatientGuestContainer">
								<dt>MY GUEST(S)</dt>
								<dd id="meetingPatientGuest">
									 <table>   
										<c:forEach items="${WebAppContext.videoVisit.caregiver}" var="Caregiver">        
												<tr>
														<td style="padding-bottom:10px;">${Caregiver.lastName}, ${Caregiver.firstName}</td>            
												</tr>
											 </c:forEach>       
										 </table>
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