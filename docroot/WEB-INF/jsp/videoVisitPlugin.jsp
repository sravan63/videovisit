
<!-- =========== Mandar 11/10/2016 US15507 START ===========  -->
<!-- Splash screen -->
<div class="splash" style="height:100vh;" id="splash">
    <div><img src="vidyoplayer/img/vv_splash.png" alt="Vidyo Logo"/></div>
    <div id="splashText" style="margin-top: 15px; visibility: hidden;"><h4>Video Visits - The Permanente Medical Group</h4></div>
    <div style="visibility: hidden;"><img src="vidyoplayer/img/loader-bar.gif"/></div>
</div>
<!-- End Splash screen -->
<!-- =========== Mandar 11/10/2016 US15507 END ===========  -->
<div id="container-videovisit" class="container-videovisit" style="width:auto; visibility:none;">
	<div id="vvHeader">
		<ul id="clinician-name" style="">
			<li>		
				<h3 id="patientTitle" class="page-title" style="">Video Visits</h3>
			</li>
		</ul>
		<div class="right-container">
              <a href="mdohelp.htm" target="_blank"><span class="help">Help</span></a>
              <span class="reportIssue">Report an Issue</span>
              <span class="refresh-button">Refresh</span>
		</div>
	</div>

	<div id="container-video" class="conference-renderer">
		<div id="video-main">
		    <div id="withjs" class="hide">
		        <div id="errorWrapper" class="alert alert-error hide"></div>
		        <!-- End Error view -->
		        <!-- Info view -->
		        <div id="infoWrapper" class="alert alert-info hide"></div>
		        <!-- End Error view -->
		        <!-- Plugin Install Steps -->
				<div id="setupContents" class="hide">
					<table id="setupInstructions" width="50%" style="color:#000000;margin:auto;">
					    <tr style="vertical-align: top;">
						    <td colspan="2"><h3 style="text-align: center;">Please install the 'Vidyo Web' plug-in for your visit.</h3></td>
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
		                        	<!-- DE13926 -->
							    	 <span style="display:inline-block;cursor:pointer;" onclick="window.location.reload();" class="installbutton">Refresh Browser</span>
							    	<!-- DE13926 -->
		                        </p>
							</td>
						</tr>
						<!-- US30883 -->
						<tr><td colspan="2" style="padding-top:20px;text-align:center;"><a id="macWinDownloadPageBackBtn" href="javascript:void(0);" onclick="backBtnClick()" class="installbutton" style="padding:5px 35px;">Back</a></td></tr>
						<!-- US30883 -->
					</table>
				</div>
			    <!-- End Plugin Install Steps -->
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

						<div id="btnContainer" class="member-btn-container" style="position:static;">
		                    <div id="buttonGroup" class="btn-group" style="width:100%; position:static;">
		                    	<div id="inCallButtonMuteVideo">
		                          <div title="Disable Video" class="btns video-btn">&nbsp;</div>
		                           <div title="Enable Video" class="btns video-muted-btn">&nbsp;</div>
		                        </div>
		                        <div id="inCallButtonMuteSpeaker">
		                           <div title="Mute Speakers" class="btns speaker-btn">&nbsp;</div>
		                           <div title="Unmute Speakers" class="btns speaker-muted-btn">&nbsp;</div>
		                        </div>
		                        <div id="inCallButtonMuteMicrophone">
		                           <div title="Mute Mic" class="btns microphone-btn">&nbsp;</div>
		                           <div title="Unmute Mic" class="btns microphone-muted-btn">&nbsp;</div>
		                        </div>
			                    <div id="inCallButtonLocalShare">
		                           <div title="" class="btns smd-btn">&nbsp;</div>
		                           <div title="" class="btns smd-muted-btn">&nbsp;</div>
		                        </div>
		                        <!--<ul class="dropdown-menu" role="menu" id="inCallLocalShareList" style="max-height:400px;"></ul>-->
		                        <div id="inCallButtonExpand" style="display:none;">
		                           <div title="Expand" class="btns expand-btn">&nbsp;</div>
		                           <div title="Shrink" class="btns shrink-btn">&nbsp;</div>
		                        </div>
		                        <div id="inCallButtonToggleConfig">
		                          <div title="Settings" class="btns settings-btn">&nbsp;</div>
		                        </div>
		                        <!--<div class="well hide" id="configurationWrap"></div>-->
		                    	<!--<a class="btn btn-large btn-config" href="#" title="Settings" id="inCallButtonToggleConfig" style="display:block;"></a>
			                        <div class="well hide" id="configurationWrap">
			                        </div>
								<a class="btn btn-large btn-local-share" data-toggle="dropdown" href="#" id="inCallButtonLocalShare" title="Share Desktop" style="display:block;"></a>
									<ul class="dropdown-menu" role="menu" id="inCallLocalShareList" style="max-height:400px;">
									</ul>
								<a class="btn btn-large btn-tmv-success" href="#" title="Disable Video" id="inCallButtonMuteVideo" style="display:block;"></a>
								<a class="btn btn-large btn-tmm-success" href="#" title="Mute Mic" id="inCallButtonMuteMicrophone" style="display:block;"></a>
								<a class="btn btn-large btn-tms-success" href="#" title="Mute Speakers" id="inCallButtonMuteSpeaker" style="display:block;"></a>
								<a class="btn btn-large btn-tmc" href="#" title="Phone-A-Friend" id="inCallButtonCall" style="visibility:hidden;"></a>-->
							</div>
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
		        <!--<div class="well hide" id="configurationWrap">
		        </div>-->
		         <!-- End of Configuration panel -->
		        <input id="meetingExpiredTimerFlag" type="hidden" value="false">
		        <input id="sendEmailPopUpFlag" type="hidden" value="false">
		    </div>
		    <!-- End of withjs div -->
		
		    <!-- START - Leave and End Meeting Dialogs  -->
	        <!-- PROVIDER: START- meeting leave yes no dialog  -->
	        <div id="dialog-block-override-meeting-leave" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="userLoginLabel" aria-hidden="true">
	            <div class="modal-header">
	                <button type="button" id="leave_modal_cross_button" class="close" data-dismiss="modal" aria-hidden="true">x</button>
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
	                            <input class="button" id="leave_meeting_button_yes"  type="button"  value="Yes &rsaquo;&rsaquo;"/>
	                            </li>
	                            <li>
	                            <input class="button" id="leave_meeting_button_no"  type="button"  value="No &rsaquo;&rsaquo;"/>
	                            </li>
	                        </ul>
	                    </div>
	                 </div>
	            </div>
	        </div>
	        <!-- END-  meeting leave yes no dialog  -->

	        <!-- START-  meeting end yes no dialog  -->
	        <div id="dialog-block-override-meeting-end" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="userLoginLabel" aria-hidden="true">
	            <div class="modal-header">
	                <button type="button" id="end_modal_cross_button" class="close" data-dismiss="modal" aria-hidden="true">x</button>
	                <h3 id="">End Meeting</h3>
	            </div>
	            <div class="modal-body">
	                <div class="dialog-content-question">
	                    <p id="end_meeting_question"  class="question">Are you sure you want to end this meeting for all participants ?<br></p>
	                    <div id="end_meeting_error" class="error " style="padding:5px;"></div>
	                    <div class="pagination">
	                        <ul>
	                            <li>
	                            <input class="button" id="end_meeting_button_yes"  type="button"  value="Yes &rsaquo;&rsaquo;"/>
	                            </li>
	                            <li>
	                            <input class="button" id="end_meeting_button_no"  type="button"  value="No &rsaquo;&rsaquo;"/>
	                            </li>
	                        </ul>
	                    </div>
	                 </div>
	            </div>
	        </div>
	        <!-- END-  meeting end yes no dialog  -->
		    <!-- PROVIDER: END - Leave and End Meeting Dialogs  -->
		
		    <!-- MEMBER AND GUEST: START - Quit Meeting Dialogs  -->
	    	<div id="quitMeetingModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="userLoginLabel" aria-hidden="true">
	            <div class="modal-header">
	                <button type="button" id="quit_modal_cross_button" class="close" data-dismiss="modal" aria-hidden="true">x</button>
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
	                                <input class="button" id="quit_meeting_button_yes"  type="button"  value="Yes &rsaquo;&rsaquo;"/>
	                            </li>
	                            <li>
	                                <input class="button" id="quit_meeting_button_no"  type="button"  value="No &rsaquo;&rsaquo;"/>
	                            </li>
	                        </ul>
	                    </div>
	                 </div>
	            </div>
	        </div>
		    <!-- MEMBER AND GUEST: END - Quit Meeting Dialogs  -->
		
	        <!--Start PHI Sharing Dialog - SMD  -->
	        <div id="smdWarningModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="userLoginLabel" aria-hidden="true">
	            <div class="modal-header">
	                <button type="button" id="smd_warning_modal_cross_button" class="close" data-dismiss="modal" aria-hidden="true">x</button>
	                <h3 id="">Share My Desktop</h3>
	            </div>
	            <div class="modal-body">
	                <div class="dialog-content-question">
	                    <p class="question" style="text-align:center;">You are about to share your desktop</p>
	                    <p style="text-align:center; font-size:small;">Make sure you are showing only <br> information intended for this patient.</p>
	                    <div class="error"></div>
	                    <div class="pagination">
	                        <ul style="display:block;">
	                            <li>
	                                <input class="button" id="smd_warning_button_cancel"  type="button" value="Cancel &rsaquo;&rsaquo;"/>
	                            </li>
				    			<li>
	                                <input class="button" id="smd_warning_button_continue" type="button" value="Continue &rsaquo;&rsaquo;"/>
	                            </li>
	                        </ul>
	                    </div>
	                 </div>
	            </div>
	        </div>
	       	<!--End PHI Sharing Dialog - SMD  -->
	       	<!--Start Dialog - Plugin Installation failure  -->
	        <div id="pluginInstallFailureModal" class="modal hide fade" style="position:fixed;top:20%;left:10%;z-index:1050;width:300px;margin-left:120px;" tabindex="-1" role="dialog" aria-labelledby="userLoginLabel" aria-hidden="true">
	            <div class="modal-header">
	                <button type="button" id="plugin_failure_modal_cross_button" class="close" data-dismiss="modal" aria-hidden="true">x</button>
	                <h3 id=""></h3>
	            </div>
	            <div class="modal-body">
	                <div class="dialog-content-question">
	                    <p id="plugin_install_message"  class="question" style="text-align:center;">The installation was not successful.<br> Please try installing the plug-in again using a different browser.</p>
	                    <br>
	                </div>
	            </div>
	        </div>
	       <!--End Dialog - Plugin Installation failure   -->
	       <!--Start Dialog - Plugin Upgrade message -->
	        <div id="pluginUpgradeModal" class="modal hide fade" style="position:fixed;top:20%;left:10%;z-index:1050;width:400px;margin-left:120px;" tabindex="-1" role="dialog" aria-labelledby="userLoginLabel" aria-hidden="true">
	            <div class="modal-header">
	                <h3 id=""></h3>
	            </div>
	            <div class="modal-body">
	                <div class="dialog-content-question">
	                    <p id="plugin_upgrade_message"  class="question" style="text-align:center;">You need the latest version of the Vidyo Web plug-in.<br> Please download and install.<br></p>
		            <div>
	                            <button type="button" id="plugin_file_download_button" class="button" data-dismiss="modal" style="margin-left:40%;">Download</button>

	                    </div>
	                </div>
	            </div>
	        </div>
	       	<!--End Dialog - Plugin Upgrade Message   -->

		    <!-- Will stay if JavaScript is not enabled -->
		    <div id="withoutjs" class="hero-unit ">
		        <h1>JavaScript is not enabled!</h1>
		        <p>JavaScript is not enabled in your browser. For VidyoWeb Sample to work your browser should have JavaScript enabled.</p>
		    </div>

		   	<div id="notificationContainer" class='notifications top-left'></div>
		    <!-- Quickly check for JavaScript -->
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
		    <!-- Main application script -->
		    <!-- <script data-main="vidyoplayer/scripts/main" src="vidyoplayer/scripts/libs/require.min.2.1.10.js"></script> -->
	 	</div>
		<div class="video-details" id="video-sidebar">
			<div class="well hide" id="configurationWrap"></div>
			<ul class="dropdown-menu" role="menu" id="inCallLocalShareList" style="max-height:400px;"></ul>
			<div class="visit-info-container">
				<div class="visit-info">
					<button class="leave-conference" id="inCallButtonDisconnect">Leave Room</button>
					<h2>Visit Details</h2>
					<div class="host-details" id="meetingHost">${WebAppContext.videoVisit.hostFirstName.toLowerCase()} ${WebAppContext.videoVisit.hostLastName.toLowerCase()}, ${WebAppContext.videoVisit.hostTitle}</div>
					<div class="meeting-time-date-info">
					  <span class="time-display">${WebAppContext.videoVisit.meetingTime},</span>
					  <span class="date-display">${WebAppContext.videoVisit.meetingDate}</span>
					</div>
				</div>
			</div>
			<div class="participant-details">
				<div class="participants-header">
					<span class="guests">Guests</span>
					<button class="invite-guest">invite</button>
				</div>
				<div class="participants-list">
					<c:forEach items="${WebAppContext.videoVisit.participant}" var="Provider">
						<p class="participant">
		                  	<span class="participant-name">${Provider.lastName.trim().toLowerCase()}, ${Provider.firstName.trim().toLowerCase()} ${Provider.title.trim().toUpperCase()}</span>
		                  	<span class="participant-action">...</span>
	               		</p>
					</c:forEach>
					<c:forEach items="${WebAppContext.videoVisit.caregiver}" var="Caregiver">
						<c:if test="${Caregiver.lastName == 'audio_participant'}">
							<c:set var="memVidyPhNumCount" value="${memVidyPhNumCount + 1}" scope="page"/>
                    		<p class="participant">
			                  	<span class="participant-name">Phone ${memVidyPhNumCount}</span>
			                  	<span class="participant-action" email="${Caregiver.emailAddress.trim()}">...</span>
		               		</p>
                    	</c:if>
                    	<c:if test="${Caregiver.lastName != 'audio_participant'}">
                    		<p class="participant">
			                  	<span class="participant-name">${Caregiver.firstName.trim()} ${Caregiver.lastName.trim()}</span>
			                  	<span class="participant-action" email="${Caregiver.emailAddress.trim()}">...</span>
		               		</p>
                    	</c:if>
					</c:forEach>
				</div>
			</div>
		</div>
		
		
	</div>
</div>

<!-- US15318 - START [Popup displays after meeting disconnected] -->
<div id="dialog-block-meeting-disconnected" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="userLoginLabel" aria-hidden="true">
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
<script language="javascript">
    //US30883
    function backBtnClick(){
    	//$("#layover").show();
    	var memberFlg = $('#isMember').val();    	
    	if (memberFlg == 'true' || memberFlg == true) {
            window.location = '/videovisit/landingready.htm?explicitActionNavigation=true';
        }else{
            window.location = '/videovisit/guestready.htm?explicitActionNavigation=true';
        }    	
    }
    //US30883
</script>
