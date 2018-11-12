
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
	<input type="hidden" id="webrtc" value="${webrtc}" />
	<input type="hidden" id="webrtcSessionManager" value="${webrtcSessionManager}" />
	<input type="hidden" id="blockChrome" value="${blockChrome}" />
	<input type="hidden" id="blockFF" value="${blockFF}" />
	<!-- US35718 changes -->
	<input type="hidden" id="blockEdge" value="${blockEdge}" />
	<input type="hidden" id="blockSafari" value="${blockSafari}" />
	<!-- US35718 changes -->

	<%@ include file="../../vidyoplayer/setupWizard.html" %>

	
<script src="vidyoplayer/scripts/webrtc/vidyo.client.messages.js"></script>
<script src="vidyoplayer/scripts/webrtc/vidyo.client.private.messages.js"></script>
<script src="vidyoplayer/scripts/webrtc/vidyo.client.js"></script>