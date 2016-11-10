	<%@ page import="org.kp.tpmg.videovisit.webserviceobject.xsd.ProviderWSO" %>
	<%@ page import="org.kp.tpmg.videovisit.webserviceobject.xsd.CaregiverWSO" %>
	<%@ page import="org.kp.tpmg.videovisit.model.*"%>
	<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
	<%@ taglib prefix='fn' uri='http://java.sun.com/jsp/jstl/functions' %>	
	
	<!--Plugin Hidden variables -->
	<input type="hidden" id="pluginName" value="${WebAppContext.vendorPlugin.vendorPluginName}" />
	<input type="hidden" id="pluginNewVersion" value="${WebAppContext.vendorPlugin.vendorNewPlugin}" /> 
	<input type="hidden" id="pluginOldVesrions" value="${WebAppContext.vendorPlugin.vendorOldPlugin}" />
	
	<input type="hidden" id="guestName" value="${WebAppContext.videoVisit.guestName}" />
	<input type="hidden" id="isProvider" value="${WebAppContext.videoVisit.isProvider}" />
	<input type="hidden" id="guestUrl" value="${WebAppContext.videoVisit.guestUrl}" />
	<input type="hidden" id="meetingId" value="${WebAppContext.videoVisit.meetingId}" />
	
	<input type="hidden" id="caregiverId" value="${WebAppContext.videoVisit.caregiverId}" />
	<input type="hidden" id="meetingCode" value="${WebAppContext.videoVisit.meetingCode}" />
	<input type="hidden" id="isMember" value="${WebAppContext.videoVisit.isMember}" />
	<input type="hidden" id="isProxyMeeting" value="${WebAppContext.videoVisit.isProxyMeeting}" />
	
	<input type="hidden" id="kpKeepAliveUrl" value="${WebAppContext.kpKeepAliveUrl}" />
	<!-- waiting room bg late load image issue fix start-->
	<img src="images/global/waiting_rm_bkgd.png" class="waitingRoomBgImg" />
	<!-- waiting room bg late load image issue fix end-->

<!-- =========== Mandar 11/10/2016 US15507 START ===========  -->
<!-- Splash screen -->
<div class="splash" style="height:100vh;" id="splash">
    <div><img src="vidyoplayer/img/vv_splash.png" alt="Vidyo Logo"/></div>
    <div id="splashText" style="margin-top: 15px; visibility: hidden;"><h4>Video Visits - The Permanente Medical Group</h4></div>
    <div style="visibility: hidden;"><img src="vidyoplayer/img/loader-bar.gif"/></div>
</div>
<!-- End Splash screen -->
<!-- =========== Mandar 11/10/2016 US15507 END ===========  -->
<div id="container-videovisit" style="width:auto; visibility:none;">
	<div id="vvHeader">
		<ul id="clinician-name" style="">
			<li>		
				<h3 id="patientTitle" class="page-title" style="">Video Visits | ${WebAppContext.videoVisit.hostLastName}, ${WebAppContext.videoVisit.hostFirstName} ${WebAppContext.videoVisit.hostTitle}</h3>
			</li>
		</ul>
		<ul id="leaveEndBtnContainer" class="btn-group" style="float:right; list-style:none; font-size:100%; margin:4px 0;">
	        <li class="btn btn-leaveEnd btn-leave-meeting" href="#" title="Step Away" id="inCallButtonDisconnect" style="border-right:1px solid #D4D4D4;">
	        <li class="btn btn-leaveEnd btn-end-meeting" href="#" title="End Meeting" id="inCallButtonEndMeeting" style="border-right:1px solid #D4D4D4;">
	        <li class="btnLast" style="display:inline-block; margin-left:10px; margin-right:10px;"><a href="mdohelp.htm" target="_blank">Help</a></li>
	    </ul>
	</div>

	<div id="container-video">
		<div id="video-main" style="clear:both; float:left;">
		    <div id="withjs" class="hide">
		        <!-- Splash screen -->
		        <!--<div class="splash" style="height:100vh;" id="splash">
		            <div><img src="vidyoplayer/img/vv_splash.png" alt="Vidyo Logo"/></div>
		            <div id="splashText" style="margin-top: 15px; visibility: hidden;"><h4>Video Visits - The Permanente Medical Group</h4></div>
		            <div style="visibility: hidden;"><img src="vidyoplayer/img/loader-bar.gif"/></div>
		        </div>-->
		        <!-- End Splash screen -->
		        <!-- Error view -->
		        <div id="errorWrapper" class="alert alert-error hide"></div>
		        <!-- End Error view -->
		        <!-- Info view -->
		        <div id="infoWrapper" class="alert alert-info hide"></div>
		        <!-- End Error view -->
		        <!-- Plugin Install Steps -->
				<div id="setupContents" class="hide">
					
					<!-- <div style="margin-top:50px; overflow:auto;">
						<p id="installationTitle" style="text-align:center; font-size:18px; color:#555555;">Downloads are required for your visit</p>
					</div>
					<div style="margin-top:50px; overflow:auto;">
						<div id="downloadStep1" class="downloadSteps" style="display:inline-block; margin:10px 20px; vertical-align:top;">
							<span style="display:inline-block; margin:0 10px;">
								<img width="50" height="60" src="vidyoplayer/img/step_1.png" style="margin-left:30px; margin-right:auto;"/>
							</span>
							<span class="addExtensionContainer" style="display:inline-block; width:145px; margin:0 10px; vertical-align:middle;">
								<a id="addExtension" href="javascript:void(0)" class="" style="font-size:20px; color:#0088cc;" onclick="addExtension();">Download Vidyo extension</a>
							</span>
						</div>
						<div id="downloadStep2" class="downloadSteps" style="display:inline-block; margin:10px 20px; vertical-align:top; opacity:0.4;">
							<span style="display:inline-block; margin:0 10px;">
								<img width="50" height="60" src="vidyoplayer/img/step_2.png" style="margin-left:30px; margin-right:auto;"/>
							</span>
							<span style="display:inline-block; width:145px; margin:0 10px; vertical-align:middle;">
								<a id="macWinPluginFile" href="" class="" style="font-size:20px; color:#0088cc;" onclick="downloadPlugin();">Download Vidyo plug-in</a>
								<a id="winChromePluginFile" href="vidyoplayer/files/VidyoClientForWeb-win32-1.3.1.0062.msi" class="hide" style="font-size:20px; color:#0088cc;" onclick="downloadPlugin();">Download Vidyo plug-in Win</a>
								<a id="macChromePluginFile" href="vidyoplayer/files/VidyoClientForWeb-macosx-x86-1.3.1.0062.pkg" class="hide" style="font-size:20px; color:#0088cc;" onclick="downloadPlugin();">Download Vidyo plug-in Mac</a>
							</span>
						</div>
						<div id="downloadStep3" class="downloadSteps" style="display:inline-block; margin:10px 20px; vertical-align:top; opacity:0.4;">
							<span style="display:inline-block; margin:0 10px; vertical-align:top;">
								<img width="50" height="60" src="vidyoplayer/img/step_3.png" style="margin-left:30px; margin-right:auto;"/>
							</span>
							<span style="display:inline-block; width:145px; margin:10px; vertical-align:middle; color:#555555;">
								<p style="font-size:20px;">Find and install plug-in</p>
							</span>
						</div>
					</div>	-->
					
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
			    <!-- End Plugin Install Steps -->
		        <!-- Main Menu -->
		        <!--   Below div tag is commented by Srini.P on 09/11/2013
		
		        <div class="hero-unit hide text-center" id="mainMenu">
		            <h1>VidyoWeb API sample</h1>
		            <h3>Choose the type of interaction</h3>
		            <p>
		                <a href="#userLoginPopup" class="btn btn-primary btn-large" role="button" data-toggle="modal">
		                  Login as <i>Registered</i> User
		                </a>
		                <a href="#guestLoginPopup" class="btn btn-primary btn-large" role="button" data-toggle="modal">
		                  Join room as a <i>Guest</i>
		                </a>
		            </p>
		        </div>
		         -->
		        <!-- End Main Menu -->
		
		        <!-- Join as user modal window 
		        <div id="preCallJoinAsUserPopup" class="modal hide fade" tabindex="-1" role="dialog">
		            <div class="modal-header">
		                <h3>Joining to conference...</h3>
		            </div>
		            <div class="modal-body">
		                <div id="preCallJoinProgressBarContainer" class="progress progress-info progress-striped active">
		                    <div id="preCallJoinProgressBar" class="bar" style="width: 0%;"></div>
		                </div>
		            </div>
		        </div>
		        <div id="preCallIntitePopup" class="modal hide fade" tabindex="-1" data-controls-modal="preCallIntitePopup" data-backdrop="static" data-keyboard="false">
		            <div class="modal-header" id="preCallIntitePopupInvitee">
		                <!-- Incoming call dialog template placeholder -->
		            <!--</div>
		            <div class="modal-body">
		                <button class="btn btn-primary" id="preCallIntitePopupButtonAccept">Accept</button>
		                <button class="btn btn-warning" id="preCallIntitePopupButtonReject">Reject</button>
		            </div>
		        </div>-->
		        <!-- End join as user modal window -->
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

			                <!-- Added by Mandar A.  on 12/03/2013 to address US3549
			                 START -->

		                    <!--	<div class="btn-group">
		                        <a class="btn btn-leaveEnd btn-leave-meeting" href="#" title="Leave Meeting" id="inCallButtonDisconnect" style="border-right:1px solid #D4D4D4;"></a>
		                        <a class="btn btn-leaveEnd btn-end-meeting" href="#" title="End Meeting" id="inCallButtonEndMeeting" style="border-right:1px solid #D4D4D4;"></a>
		                    </div>	-->

		                    <div id="buttonGroup" class="btn-group" style="width:100%; position:static;">
		                    	<span style="display:block; width:100%; height:auto; background-color:#6A6A6A;">
		                    		<a class="btn btn-large btn-hideDetails" href="#" title="Hide/Show Details" id="inCallButtonToggleDetails" style="width:100%; height:33px;"></a>
		                    	</span>
		                    	<a class="btn btn-large btn-config" href="#" title="Settings" id="inCallButtonToggleConfig" style="display:block;"></a>
			                        <!-- Configuration panel -->
			                        <div class="well hide" id="configurationWrap">
			                            <!-- See configurationTemplate in main.config.js-->
			                        </div>

			                    <!--	<a class="btn btn-large btn-toggle-preview" href="#" title="Toggle Preview ('None', 'PiP', 'Dock')" id="inCallButtonTogglePreview" style="display:block;"></a>	-->
								<a class="btn btn-large btn-local-share" data-toggle="dropdown" href="#" id="inCallButtonLocalShare" title="Share Desktop" style="display:block;"></a>
									<ul class="dropdown-menu" role="menu" id="inCallLocalShareList" style="max-height:400px;">
										<!-- Look at the inCallLocalSharesTemplate in main.config.js  -->
									</ul>

								<a class="btn btn-large btn-tmv-success" href="#" title="Disable Video" id="inCallButtonMuteVideo" style="display:block;"></a>
								<div style="clear:both; border-bottom:1px solid #6A6A6A;">
									<a class="btn btn-large btn-tms-success" href="#" title="Mute Speakers" id="inCallButtonMuteSpeaker" style="width:40px; display:inline-block; border-bottom:none;"></a>					
									<div id="volume-control-speaker" style="height: 35px; width: 3px; vertical-align: middle; margin: 12px; display: inline-block; background: grey;">						
										<a id="slider-handle-speaker" class="ui-slider-handle ui-state-default ui-corner-all" href="#" style="border:1px solid #FFFFFF; width:9px; height:2px; margin-left:-4px; position:absolute;"></a>
									</div>
								</div>
								
								<div style="clear:both; border-bottom:1px solid #6A6A6A;">
									<a class="btn btn-large btn-tmm-success" href="#" title="Mute Mic" id="inCallButtonMuteMicrophone" style="border-bottom:none; width:40px; display:inline-block;"></a>
									<div id="volume-control-mic" style="height:35px; width:3px; vertical-align:middle; margin:12px; display:inline-block; background: grey;" >
										<a id="slider-handle-mic" class="ui-slider-handle ui-state-default ui-corner-all" href="#" style="border:1px solid #FFFFFF; width:9px; height:2px; margin-left:-4px; position:absolute;"></a>
									</div>
								</div>
								<a class="btn btn-large btn-tmc" href="#" title="Phone-A-Friend" id="inCallButtonCall" style="visibility:hidden;"></a>
							</div>

							<!-- END -->
						</div>

		                <!-- End Plugin wrapper  -->
	                    <!-- Chat container -->
	                    <div id="inCallChatContainer" class="well well-small hide">
	                        <!--<ul class="nav nav-tabs" id="inCallChatTabs">
	                          <li data-uri="group"><a href="#" id="inCallChatMinimizeLink" data-uri="group"><i class="icon-chevron-down"></i></a></li>
	                          <li class="active" data-uri="group" id="inCallChatGroupTab"><a href="#inCallChatGroupPane" id="inCallChatGroupTabLink" data-missed="0">Everyone&nbsp;<span class="badge badge-info hide">0</span></a></li>
	                        </ul>
	                        <div id="inCallChatPanes" class="tab-content">
	                          <div class="tab-pane active" id="inCallChatGroupPane">
	                            <ul>
	                                <!-- Will have chat panes -->
	                           <!-- </ul>
	                          </div>
	                        </div>
	                        <div>
	                            <form class="form-inline" id="inCallChatForm" autocomplete="off">
	                              <input type="text" class="input-xxlarge" placeholder="Type a message" id="inCallChatTextField" autocomplete="off">
	                              <button type="submit" class="btn" id="inCallChatTextSend">Send</button>
	                            </form>
	                        </div>-->
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
		    <script data-main="vidyoplayer/scripts/main" src="vidyoplayer/scripts/libs/require.min.2.1.10.js"></script>
	 	</div>
		
		
		<div id="video-sidebar">
			<div id="video-sidebar-banner"></div>
			<!-- video-sidebar-content START -->	
			<div class="video-sidebar-content">
				<div id="video-info">
					<h3> Visit Details </h3>
					<dl>
					    <dt>APPOINTMENT DATE</dt><dd id="displayMeetingDateTime">${WebAppContext.videoVisit.meetingDate}&nbsp;&nbsp;${WebAppContext.videoVisit.meetingTime}</dd>
					</dl>
					<dl>
						<dt>PATIENT</dt><dd id="meetingPatient">${WebAppContext.videoVisit.patientLastName}, ${WebAppContext.videoVisit.patientFirstName}</dd>
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
					</dl>	-->
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
                //alert('in here');
                keepALiveDelay =( 5 * 1000);
                keepALiveTimerId ='';
                
        $(".refresh-button").click(function(){
			window.location.href = window.location.href;
		});
        
        function        keepALive()
                {
                        keepALiveAction();
                        //keepALiveClearTimeOut();
                        //keepALiveTimerId = setTimeout( keepALiveAction, keepALiveDelay );
                }
                function keepALiveClearTimeOut()
                {
                        if (keepALiveTimerId)
                                clearTimeout( keepALiveTimerId );
                }
                function keepALiveAction()
                {
                        $.post(VIDEO_VISITS.Path.landingready.keepALive, {},function(data){
                        //alert('post');
                        });
                        //keepALive();
                }
                window.setInterval(function(){
                          /// call your function here
   //                       alert('keepalive');
                               keepALive();
                  }, 3 * 60 * 1000);
</script>
