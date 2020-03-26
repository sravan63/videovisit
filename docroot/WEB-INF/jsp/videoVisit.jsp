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
	<input type="hidden" id="mrn" value="${WebAppContext.memberDO.mrn}" />
	<input type="hidden" id="meetingPatient"
		value="${WebAppContext.videoVisit.patientLastName.trim()}, ${WebAppContext.videoVisit.patientFirstName.trim()}" />
	<input type="hidden" id="caregiverId" value="${WebAppContext.videoVisit.caregiverId}" />
	<input type="hidden" id="meetingCode" value="${WebAppContext.videoVisit.meetingCode}" />
	<input type="hidden" id="isMember" value="${WebAppContext.videoVisit.isMember}" />
	<input type="hidden" id="isProxyMeeting" value="${WebAppContext.videoVisit.isProxyMeeting}" />
	<input type="hidden" id="meetingHostName"
		value="${WebAppContext.videoVisit.hostLastName.toLowerCase()}, ${WebAppContext.videoVisit.hostFirstName.toLowerCase()} ${WebAppContext.videoVisit.hostTitle}" />
	<input type="hidden" id="kpKeepAliveUrl" value="${WebAppContext.kpKeepAliveUrl}" />
	<input type="hidden" id="vendor" value="${WebAppContext.videoVisit.vendor}" />
	<input type="hidden" id="guestPin" value="" />
	<!-- waiting room bg late load image issue fix start-->
	<img src="images/global/waiting_rm_bkgd.png" class="waitingRoomBgImg" />
	<!-- waiting room bg late load image issue fix end-->

	<c:choose>
		<c:when test="${WebAppContext.showPeripheralsPage == 'true'}">
			<%@ include file="preCallTesting.jsp" %>
		</c:when>
		<c:otherwise>
			<%@ include file="videoVisitContent.jsp" %>
		</c:otherwise>
	</c:choose>


	<script type="text/javascript">
		var browserInfo = getBrowserInfo();
		//var browserVersion = (browserInfo.version).split(".")[0];

		if (browserInfo.isChrome) {
			console.log("inside Chrome");
		} else if (browserInfo.isFirefox) {
			console.log("inside Firefox");
		} else {
			var reqscript = document.createElement('script');
			reqscript.setAttribute('data-main', "vidyoplayer/scripts/main");
			reqscript.setAttribute('src', "js/library/conference/libs/require.min.2.1.10.js");
			document.getElementById("withjs").appendChild(reqscript);
		}
	</script>

	<script language="javascript">
		//alert('in here');
		keepALiveDelay = (5 * 1000);
		keepALiveTimerId = '';

		$(".refresh-button").click(function () {
			var isWebRTC = ($('#webrtc').val() == 'true');
			if (isWebRTC) {
				$('html').addClass("no-scroll");
				$(".splash").css({
					"display": "block",
					"z-index": "9999999"
				});
			}
			var params = ['info', 'videoRefreshButtonAction', 'User clicked on refresh button in video visit page.'];
			VideoVisit.logVendorMeetingEvents(params);
			window.location.reload();
		});

		function keepALive() {
			keepALiveAction();
			//keepALiveClearTimeOut();
			//keepALiveTimerId = setTimeout( keepALiveAction, keepALiveDelay );
		}

		function keepALiveClearTimeOut() {
			if (keepALiveTimerId)
				clearTimeout(keepALiveTimerId);
		}

		function keepALiveAction() {
			$.post(VIDEO_VISITS.Path.landingready.keepALive, {}, function (data) {
				//alert('post');
			});
			//keepALive();
		}
		window.setInterval(function () {
			// call your function here
			//	alert('keepalive');
			keepALive();
		}, 3 * 60 * 1000);
	</script>