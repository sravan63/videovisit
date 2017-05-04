
	<!--Plugin Hidden variables -->
	<input type="hidden" id="pluginName" value="" />
	<input type="hidden" id="pluginNewVersion" value="" />
	<input type="hidden" id="pluginOldVesrions" value="" />

	<input type="hidden" id="guestName" value="" />
	<input type="hidden" id="isProvider" value="false" />
	<input type="hidden" id="guestUrl" value="" />
	<input type="hidden" id="meetingId" value="" />
	<input type="hidden" id="vendorConfId" value="" />

	<input type="hidden" id="caregiverId" value="" />
	<input type="hidden" id="meetingCode" value="" />
	<input type="hidden" id="isMember" value="" />
	<input type="hidden" id="webrtc" value="true" />
	<input type="hidden" id="webrtcSessionManager" value="" />

	<%@ include file="../../vidyoplayer/setupWizard.html" %>
	
	<%-- <c:choose>
	    <c:when test="${WebAppContext.videoVisit.webrtc == 'true'}">
	        <%@ include file="videoVisitWebRTC.jsp" %>
	    </c:when>    
	    <c:otherwise>
	        <%@ include file="videoVisitPlugin.jsp" %>
	    </c:otherwise>
	</c:choose> --%>	
	<%-- <%@ include file="../../vidyoplayer/setupWizardWebRTC.html" %> --%>
	
<script src="vidyoplayer/scripts/webrtc/vidyo.client.messages.js"></script>
    <script src="vidyoplayer/scripts/webrtc/vidyo.client.private.messages.js"></script>
    <script src="vidyoplayer/scripts/webrtc/vidyo.client.js"></script>
<script type="text/javascript">
		console.log("SETUP START");
		var isProvider = $("#isProvider").val();
		var is64BitFlag = $('#is64BitFlag').val();
		var browserInfo = getBrowserInfo();
		var browserVersion = (browserInfo.version).split(".")[0];

		function closeBrowser(){
        	window.location.href = "logout.htm";
        }

		var browserNotSupportedMsgForClinician = "Video Visits does not currently support your browser version.";
		browserNotSupportedMsgForClinician += "<br /><br />";
		browserNotSupportedMsgForClinician += "Please try again using Internet Explorer for Windows or Safari for Mac.";
		browserNotSupportedMsgForClinician += "<br /><br />";
		browserNotSupportedMsgForClinician += "<button onclick='closeBrowser()'> Logout </button>";
        
		if(is64BitFlag == "true"){
				console.log("64 BIT ALERT");
				$('#displayDevices').css('display','none');
				$('#browserNotSupportedDiv').css('display','');
				$('p.error').html(browserNotSupportedMsgForClinician);
				$('#setupLastNav').css('display','none');
		}else{		
			console.log("NOT 64 BIT ALERT and WEBRTC VALUE IS "+$('#webrtc').val());
			if($('#webrtc').val() == 'true') {
				console.log('--- chrome browser');
				console.log("WEBRTC BROWSER START , isProvider value is "+isProvider);
				if (isProvider == 'true'){
					console.log("THIS IS FOR PROVIDER");
					$('p.error').html(browserNotSupportedMsgForClinician);
					$('#displayDevices').css('display','none');
					$('#browserNotSupportedDiv').css('display','');
					$('#setupLastNav').css('display','none');
				}
				else{
					console.log("THIS IS FOR MEMBER");
					var webRTCContent = '';
					console.log("WEBRTC BROWSER - inside else");
					webRTCContent += '<div class="video-frames" style="height:100%;">' +
											'<div class="container" id="whole" style="min-height: 100px; min-width: 100px;max-height: 100px; max-width: 100px;">' + 						
												'<div class="videoWrapperSmall" id="VidyoArea" align="center">' + 
												   	'<div id="participantDiv0" class="participant-wrapper">' + 
												      	'<video id="remoteVideo0" autoplay="" class="remotevideo-default"></video>' +
												      	'<span id="participant0" class="participant-title"></span>' +
												   	'</div>' +
													'<div id="shareVideoDiv" class="sharevideo-wrapper">' +
														'<video id="shareVideo0" autoplay="" class="remotevideo-default"></video>' +
														'<span id="shareName" class="participant-title"></span>' +
													'</div>'+												 
													'<div id="selfViewDiv" class="local-participant-wrapper">'+
														'<video id="localVideo" autoplay="" muted class="localvideo-default"></video>'+
													'</div>'+
												'</div>'+
											'</div>'+
										'</div>';
					$('#pluginContainer').html(webRTCContent);
					
					var reqscript = document.createElement('script');
					reqscript.setAttribute( 'type',"text/javascript");
					reqscript.setAttribute( 'src',"vidyoplayer/scripts/main-webrtc.js");
					document.getElementById("withjs").appendChild(reqscript);
					setTimeout(function(){
						bodyLoaded();
					}, 3000);
					
				}
			}else{
					console.log("PLUGIN BROWSER START");
					var reqscript = document.createElement( 'script' );
					reqscript.setAttribute( 'data-main',"vidyoplayer/scripts/setupmain");
					reqscript.setAttribute( 'src',"vidyoplayer/scripts/libs/require.min.2.1.10.js");
					document.getElementById("withjs").appendChild(reqscript);

			}
		}

	</script>
<%--<script src="vidyoplayer/scripts/webrtc/vidyo.client.messages.js"></script>
    <script src="vidyoplayer/scripts/webrtc/vidyo.client.private.messages.js"></script>
    <script src="vidyoplayer/scripts/webrtc/vidyo.client.js"></script>
   <script src="vidyoplayer/scripts/main-webrtc.js"></script> --%>