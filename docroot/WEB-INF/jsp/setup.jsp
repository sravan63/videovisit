
<script src="js/library/jquery/jquery-1.8.3.min.js" type="text/javascript"></script>
    <input type="hidden" id="pluginName" value="" /> 
	<input type="hidden" id="pluginNewVersion" value="" /> 
	<input type="hidden" id="pluginOldVesrions" value="" /> 
    <div id="videoVisitSetupContainer">
     <div class="videoVisitContainer" style="padding:0 0;">
    	<div id="videoVisitSetupPageContents">
    		<div id="setupPageTitle" style="float:left; width:60%;">
   				<h2> Video Visit Preparation </h2>
   				<h3> You will need the 'Vidyo Web' plug-in for your visit. </h3>
			</div>
			<div id="helpButtonContent" class="buttons" style="float:right; width:40%;">
				<a href="mdohelp.htm" class="button" target="_blank" style="margin-top: 9px;"> Get Help </a>
			</div>
			<div id="setupMainContents">
			    <div id="browserNotSupportedDiv" Style="height: 100px;margin-top: 100px;display: none;">
			      	<p class="error error-guest-login"></p>
			    </div>
			<!--     <iframe id="setupWizardiFrame" src="" width="725" height="600" frameborder="0" scrolling="no">
                </iframe>	 -->
                
                
                	 <div id="withjs" class="hide">        
      
				        <!-- Central in call container -->
				        <div id="inCallContainer" class="container hide">
				
				            <!-- Plugin and controls panel -->
				            <div id="inCallPluginAndControlsWrap">
				                <!-- Plugin wrapper -->
				                <div id="btnContainer" style="display:none;">
				
				                   
				                </div>
				                
				                <div id="pluginContainer" style="background-color: transparent;">
				                    <!-- Will autogenerate plugin tag -->
											<br/>
				                </div>
				                <!-- End Plugin wrapper  -->
				            </div>
				            <!-- End Control buttons -->
				        </div>
				        <!-- End Plugin and controls panel -->
				        <!-- End Central container -->
				
				        <div id="setupContents">
				                   
				            <table id="setupInstructions" width="100%" >
				                <tr height="75px" style="vertical-align: top; background-color: #E9E9E9;">
				                    <td width="100px" style="vertical-align: middle;"><img src="vidyoplayer/img/step_1.png" style="margin-left: 35px; margin-right: auto"/></td>
				                    <td>
				                        <br>
				                        <p style="color:#AC5A41; font-weight:bold;">Download the 'Vidyo Web' plug-in installer.<br><br>
				                        <a id="macWinPluginFile" href="" class="button">Download</a></p>
				                    </td>
				                </tr>
				                <tr height="3px;"></tr>               
				                <tr height="100px" style="vertical-align: top; background-color: #E9E9E9;">
				                    <td style="vertical-align: middle;"><img src="vidyoplayer/img/step_2.png" style="margin-left: 35px; margin-right: auto"/></td>
				                    <td style="vertical-align:middle;">
				                    	<p style="color:#AC5A41; font-weight:bold;">Run and Install the installer file.</p>
				                        <p> Double click to open the file, then follow the installer instructions. </p>
				                    </td>
				                </tr>
				                <tr height="3px;"></tr>               
				                <tr height="75px" style="vertical-align: top; background-color: #E9E9E9;">
				                    <td style="vertical-align: middle;"><img src="vidyoplayer/img/step_3.png" style="margin-left: 35px; margin-right: auto"/></td>
				                    <td>
				                        <br>
				                        <p style="color:#AC5A41; font-weight:bold;">Refresh when installation is complete.</p>
				                        <p>To display your video, microphone and speaker defaults, refresh your browser.<br><br>
				                        <a href="javascript:window.location.reload();" class="button">Refresh Browser</a></p>
				                    </td>
				                </tr>
				            </table>
				            
				    </div>
				
				    <div id="displayDevices" style="display:none">
				        <div>
				            <h3 style=""> Default Selections
				                <img src="vidyoplayer/img/settings.png" alt="Settings" style="display:inline;"/>
				            </h3>
				        </div>
				        <div class="threeColumns">
				            <table id="vdevices">
				                <tr>
				                    <th colspan="2"> Video </th>
				                </tr>
				            </table>
				        </div>
				        <div class="threeColumns">
				            <table id="mpdevices">
				                <tr>
				                    <th colspan="2"> Microphone </th>
				                </tr>
				            </table>
				        </div>
				        <div class="threeColumns" style="border:none;">
				            <table id="spdevices">
				                <tr>
				                    <th colspan="2"> Speaker </th>
				                </tr>
				            </table>
				        </div>
				        
				        <div id="settingsMessage" style="clear:both;">
				            To change these selections, you can go to Settings once you are in the video visit.
				        </div>
				    </div>
				</div>
				
				    <!-- End of withjs div -->
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
				       <!--Start Dialog - Plugin Success message  -->
				         <div id="pluginSuccessModal" class="modal hide fade" style="position:fixed;top:20%;left:10%;z-index:1050;width:300px;margin-left:120px;" tabindex="-1" role="dialog" aria-labelledby="userLoginLabel" aria-hidden="true">
				            <div class="modal-header">
				                <button type="button" id="plugin_success_modal_cross_button" class="close" data-dismiss="modal" aria-hidden="true">x</button>
				                <h3 id=""></h3>
				            </div>
				            <div class="modal-body">
				                <div class="dialog-content-question">
				                    <p id="plugin_success_message"  class="question" style="text-align:center;">Plug-in installed successfully !</p>
				                    <br>
				                </div>
				            </div>
				        </div>
				       <!--End Dialog - Plugin Success message   -->
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
				
				    <!-- Quickly check for JavaScript -->
				    <script type="text/javascript">
				    (function () {
				        /* jQuery is not available yet so use native JavaScript */
				        document.getElementById("withjs").className ="";
				        document.getElementById("withoutjs").className += "hide";
				    })();
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
	<script type="text/javascript">

	function getBrowserInfo() {

		var browserUserAgent = navigator.userAgent;
		
		var browserInfo = new Object();
		
		browserInfo.is32Bit = true;
	
		if (browserUserAgent.indexOf("x64") != -1) {
			browserInfo.is32Bit = false;
		}
		browserInfo.is32BitOS = true;
	
		if (browserUserAgent.indexOf("WOW64") != -1 || browserUserAgent.indexOf("Win64") != -1 ){
			browserInfo.is32BitOS = false;
		} 
	
		browserInfo.isIE = false;
		browserInfo.isFirefox = false;
		browserInfo.isChrome = false;
		browserInfo.isSafari = false;
		
		var jqBrowserInfoObj = $.browser; 
	
		browserInfo.version = jqBrowserInfoObj.version;
		
		if ( jqBrowserInfoObj.mozilla) {
			browserInfo.isFirefox = true;
		} else if ( jqBrowserInfoObj.msie){
			browserInfo.isIE = true;
		} else if ( jqBrowserInfoObj.chrome){
			browserInfo.isChrome = true;
		} else if ( jqBrowserInfoObj.safari){
			browserInfo.isSafari = true;
		}
	
		return browserInfo;
		}

		var browserInfo = getBrowserInfo();
		
		var browserNotSupportedMsg = "Video Visits is supported on 32 bit browsers only.";
		browserNotSupportedMsg += "<br /><br />";
		browserNotSupportedMsg += "Your current browser is unsupported.";
		browserNotSupportedMsg += "<br /><br />";
		browserNotSupportedMsg += "Please <a href='mdohelp.htm' target='_blank'>Download a 32 bit browser</a>";
		
		if(browserInfo.isIE) {
			if (((browserInfo.version == 8 || browserInfo.version == 9) && !browserInfo.is32Bit) || browserInfo.version <= 7) {
				 
				 $('#setupWizardiFrame').css('display','none');	
				 $('#browserNotSupportedDiv').css('display','');				
				 $('p.error').html(browserNotSupportedMsg);
				 $('#setupLastNav').css('display','none');
				 
			} else{
		                $('#setupWizardiFrame').attr('src','../vidyoplayer/setupWizard.html');
			}
		}else{		     
		      $('#setupWizardiFrame').attr('src','../vidyoplayer/setupWizard.html');
		}
</script>
