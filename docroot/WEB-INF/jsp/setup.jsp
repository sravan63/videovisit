
<!--<script src="js/library/jquery/jquery-1.8.3.min.js" type="text/javascript"></script>	-->
<!--	<script src="js/site/audioMeter/main.js" type="text/javascript"></script>
	<script src="js/site/audioMeter/volume-meter.js" type="text/javascript"></script>	-->
<!--Plugin Hidden variables -->
	<input type="hidden" id="pluginName" value="" /> 
	<input type="hidden" id="pluginNewVersion" value="" /> 
	<input type="hidden" id="pluginOldVesrions" value="" />
	
	<input type="hidden" id="guestName" value="" />
	<input type="hidden" id="isProvider" value="" />
	<input type="hidden" id="guestUrl" value="" />
	<input type="hidden" id="meetingId" value="" />
	<input type="hidden" id="vendorConfId" value="" />	
	
	<input type="hidden" id="caregiverId" value="" />
	<input type="hidden" id="meetingCode" value="" />
	<input type="hidden" id="isMember" value="true" />

    <div id="videoVisitSetupContainer">
	    <div class="videoVisitContainer">
	    	<div id="videoVisitSetupPageContents">
	    		<div id="setupPageTitle">
	   				<h2 style="display:inline-block;"> Video Visit Preparation </h2>
	   				<a href="mdohelp.htm" target="_blank" style="float:right; font-size:15px; margin-top:5px; text-decoration:none; color:#005580;"> Help </a>
	   				<!--<h3> You will need the 'Vidyo Web' plug-in for your visit. </h3>	-->
				</div>
				<!--<div id="helpButtonContent" class="buttons">
					<a href="mdohelp.htm" class="button" target="_blank" style=""> Get Help </a>
				</div>	-->
				<div id="setupMainContents" style="clear:both;">
				    <div id="browserNotSupportedDiv" Style="height: 100px;margin-top: 100px;display: none;">
				      	<p class="error error-guest-login"></p>
				    </div>
					<!--<iframe id="setupWizardiFrame" src="" width="725" height="600" frameborder="0" scrolling="no">
	                </iframe>	 -->
	                
	                <div id="displayDevices">
				    	<div id="titleBar">
					        <div id="settingsTitle">
					        	<span id="settingsLogo" class="icon"></span>
					        	<h3 style="vertical-align:top;"> Settings </h3>
					        </div>
					    </div>

						<div id="setup-main">


							<div id="withjs" class="hide">
						        <!-- Splash screen -->
						        <div class="splash" id="splash">
						            <div><img src="vidyoplayer/img/logo-big.jpg" width="300" alt="Vidyo Logo"/></div>
						            <div id="splashText" style="margin-top: 15px;"><h4>Video Visits - The Permanente Medical Group</h4></div>
						            <div><img src="vidyoplayer/img/loader-bar.gif"/></div>
						        </div>
						        <!-- End Splash screen -->
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
										    <td colspan="2"><h3 style="color:#AC5A41;">You will need the 'Vidyo Web' plug-in for your visit.</h3></td>
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
											<td style='vertical-align: middle;'><p style='color:#AC5A41; font-weight:bold;'>Run and Install the  installer file.</p>Double click to open the file, then follow the installer instructions.
						                       </td>
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

										    <table style="width=100%;">
										    	<tr class="accessory-header">
										    		<!--<th class="threeColumns firstColumn" id="inCallButtonToggleConfig">	-->
										    		<th class="threeColumns firstColumn" id="setupCameraButtonToggleConfig">
										    			<a href="#" title="Select Camera">
									                		<span id="selectCamera" class="vidyoSprite icon"></span>
									                    	<span style="display:inline-block; margin:12px 0 0;">Camera</span>
									                    	<span class="drop-down icon"></span>
										                </a>
								                        <div class="well hide setupAccessoryConfigContainer" id="setupCameraConfigContainer">
								                            <!-- See setupCameraConfigTemplate in main.config.js-->
								                        </div>
										            </th>
										            <th class="threeColumns" id="setupMicButtonToggleConfig">
										    			<a href="#" title="Select Microphone">
									                		<span id="selectMicrophone" class="vidyoSprite icon"></span>
									                    	<span style="display:inline-block; margin:12px 0 0;">Microphone</span>
									                    	<span class="drop-down icon"></span>
										                </a>
										                <div class="well hide setupAccessoryConfigContainer" id="setupMicConfigContainer">
								                            <!-- See setupMicConfigTemplate in main.config.js-->
								                        </div>
										            </th>
										            <th class="threeColumns" id="setupSpeakerButtonToggleConfig">
										    			<a href="#" title="Select Speaker">
									                		<span id="selectSpeaker" class="vidyoSprite icon"></span>
									                    	<span style="display:inline-block; margin:12px 0 0;">Speaker</span>
									                    	<span class="drop-down icon"></span>
										                </a>
										                 <div class="well hide setupAccessoryConfigContainer" id="setupSpeakerConfigContainer">
								                            <!-- See setupSpeakerConfigTemplate in main.config.js-->
								                        </div>
										            </th>
										    	</tr>
										    	<tr class="selected-accessory">
										    		<td id="selected-camera-name" class="threeColumns firstColumn">
										    			<span> Camera Placeholder </span>
										    		</td>
										    		<td id="selected-mic-name" class="threeColumns">
										    			<span> Mic Placeholder </span>
										    		</td>
										    		<td id="selected-speaker-name" class="threeColumns">
										    			<span> Speaker Placeholder </span>
										    		</td>
										    	</tr>
										    	<tr class="accessory-demo" style="">
										    		<td id="camera-demo" class="threeColumns firstColumn">

										    			<!--####################################################################-->
											                <!-- Plugin wrapper -->
											                <div id="pluginContainer" style="background-color: transparent;">
											                    <!-- Will autogenerate plugin tag -->
																		<br/>
											                </div>
											                <!-- End Plugin wrapper  -->
													    <!--####################################################################-->
										    		</td>
										    		<td id="mic-demo" class="threeColumns">
										    			<!--<span> Microsoft LifeCam Cinema </span>
										    			<a class="btn btn-large btn-tmm-success" href="#" title="Mute Mic" id="inCallButtonMuteMicrophone" style="border-bottom:none; width:40px; display:inline-block;"></a>	-->
										    			<div style="width:100%; text-align:center; margin:40px auto 10px;">
										    				<!-- <span class="setupSprite icon" id="" style="background-position:1px -80px;"></span> -->
										    				<!--<canvas id="meter" width="100" height="50" style="border:1px solid red;"></canvas> -->
										    				<a href="#" title="Play" class="" id="" style="background-image: url('vidyoplayer/img/volume-meter.png'); background-repeat:no-repeat; width:200px; height:38px; margin:5px auto 25px; display:inline-block;"></a>
										    			</div>
										    			<div style="text-align:center;">
															<div id="volume-control-mic" style="height:3px; width:120px; vertical-align:middle; margin:12px; display:inline-block; background: grey;" >
																<a id="slider-handle-mic" class="ui-slider-handle ui-state-default ui-corner-all" href="#" style="border:1px solid black; background:black; width:2px; height:12px; margin-left:-4px; position:absolute;"></a>
															</div>
														</div>
										    		</td>
										    		<td id="speaker-demo" class="threeColumns">
										    			<!--<span> Conexant Smart Audio HD </span>
										    			<a class="btn btn-large btn-tms-success" href="#" title="Mute Speakers" id="inCallButtonMuteSpeaker" style="width:40px; display:inline-block; border-bottom:none;"></a>		-->
										    			<div style="width:100%; text-align:center; margin:40px auto 10px;">
										    				<a href="#" title="Play" class="setupSprite playAudio" id="playMe" style="background-position:1px -80px; margin:5px auto; display:inline-block;"></a>
										    				<a href="#" title="Play" class="setupSprite pauseAudio" id="pauseMe" style="background-position:1px -152px; margin:5px auto; display:none;"></a>
										    			</div>
										    			<div style="text-align:center;">
															<div id="volume-control-speaker" style="height:3px; width:120px; vertical-align:middle; margin:12px; display:inline-block; background: grey;">						
																<a id="slider-handle-speaker" class="ui-slider-handle ui-state-default ui-corner-all" href="#" style="border:1px solid black; background:black; width:2px; height:12px; margin-left:-4px; position:absolute;"></a>
															</div>
														</div>
										    		</td>
										    	</tr>
										    	<tr class="accessory-instructions" style="">
										    		<td class="threeColumns firstColumn">
										    			<span> Make sure your face is well lit and there are no bright lights behind you. </span>
										    		</td>
										    		<td class="threeColumns">
										    			<span> Speak into your microphone and adjust the volume until you&#39;re in the good range. </span>
										    		</td>
										    		<td class="threeColumns">
										    			<span> Play the sound clip and adjust your speaker volume. </span>
										    		</td>
										    	</tr>
										    </table>
									        
									        <!--<div id="settingsMessage" style="clear:both;">
									            To change these selections, you can go to Settings once you are in the video visit.
									        </div>	-->
									    </div>


										<div id="btnContainer" style="display:none; position:static;">

							                <!-- Added by Mandar A.  on 12/03/2013 to address US3549
							                 START -->

						                    <!--	<div class="btn-group">
						                        <a class="btn btn-leaveEnd btn-leave-meeting" href="#" title="Leave Meeting" id="inCallButtonDisconnect" style="border-right:1px solid #D4D4D4;"></a>
						                        <a class="btn btn-leaveEnd btn-end-meeting" href="#" title="End Meeting" id="inCallButtonEndMeeting" style="border-right:1px solid #D4D4D4;"></a>
						                    </div>	-->

						                    <div class="btn-group" style="width:100%; position:inherit;">
						                    	<span style="display:block; width:100%; height:auto; background-color:#6A6A6A;">
						                    		<a class="btn btn-large btn-hideDetails" href="#" title="Hide Details" id="inCallButtonToggleDetails" style="width:100%; height:33px;"></a>
						                    	</span>
						                    	<a class="btn btn-large btn-config" href="#" title="Settings" id="inCallButtonToggleConfig" style="display:block;"></a>
							                        <!-- Configuration panel -->
							                        <div class="well hide" id="configurationWrap">
							                            <!-- See configurationTemplate in main.config.js-->
							                        </div>

							                    <!--	<a class="btn btn-large btn-toggle-preview" href="#" title="Toggle Preview ('None', 'PiP', 'Dock')" id="inCallButtonTogglePreview" style="display:block;"></a>	-->
												<a class="btn btn-large btn-local-share" data-toggle="dropdown" href="#" id="inCallButtonLocalShare" title="Share Desktop" style="display:block;"></a>
													<ul class="dropdown-menu" role="menu" id="inCallLocalShareList">
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
												<a class="btn btn-large btn-tmc" href="#" title="Phone-A-Friend" id="inCallButtonCall" style="display:none;"></a>
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
					                <h3 id="">Leave Meeting</h3>
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
					                <h3 id="">Leave Meeting</h3>
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
					                    <p id="smd_warning_message"  class="question" style="text-align:center;">You are about to share your desktop</p>
							    		<br>
					                    <p id="smd_warning_message_small" style="text-align:center;font-size: small">Make sure you are showing only <br> information intended for this patient.</p>
					                    <div id="smd_warning_message" class="error " style="padding:5px;"></div>
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
						    <script data-main="vidyoplayer/scripts/setupmain" src="vidyoplayer/scripts/libs/require.min.2.1.10.js"></script>


						</div>
	                
				    </div>
					<div id="setupLastNav" class="buttons">
					  <% String isGuest = request.getParameter("isGuest");
					      if(isGuest == null || (isGuest != null && !"Y".equalsIgnoreCase(isGuest))){
					   %>
						<a href="login.htm" class="button"> Join Your Video Visit </a>
					  <% } %>
					</div>
				</div>
		 	</div>
		</div>
	</div>
	<script type="text/javascript">	

		var browserInfo = getBrowserInfo();
		
		var browserNotSupportedMsg = "Video Visits is supported on 32 bit browsers only.";
		browserNotSupportedMsg += "<br /><br />";
		browserNotSupportedMsg += "Your current browser is unsupported.";
		browserNotSupportedMsg += "<br /><br />";
		browserNotSupportedMsg += "Please <a href='mdohelp.htm' target='_blank'>Download a 32 bit browser</a>";
		
		if(browserInfo.isIE) {
			if (((browserInfo.version == 8 || browserInfo.version == 9) && !browserInfo.is32Bit) || browserInfo.version <= 7) {
				 
				 //$('#setupWizardiFrame').css('display','none');	
				// $('#browserNotSupportedDiv').css('display','');				
				// $('p.error').html(browserNotSupportedMsg);
				 //$('#setupLastNav').css('display','none');
				 
			}
		}
</script>
