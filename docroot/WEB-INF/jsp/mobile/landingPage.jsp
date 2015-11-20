<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*" %>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.command.*" %>
<%@ page import="org.kp.tpmg.videovisit.webserviceobject.xsd.*" %>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.*" %>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix='fn' uri='http://java.sun.com/jsp/jstl/functions' %>


<%

	MeetingCommand.retrieveMeeting(request, response);
	String timezone = WebUtil.getCurrentDateTimeZone();
	
	
%>

<%@ include file="userPresentInMeetingModal.jsp" %>

<!--  Code for Spinner Animation -->
<style type='text/css'>@-webkit-keyframes uil-default-anim { 0% { opacity: 1} 100% {opacity: 0} }@keyframes uil-default-anim { 0% { opacity: 1} 100% {opacity: 0} }.uil-default-css > div:nth-of-type(1){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.5s;animation-delay: -0.5s;}.uil-default-css { position: relative;background:none;width: 450px;height: 700px;}.uil-default-css > div:nth-of-type(2){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.4s;animation-delay: -0.4s;}.uil-default-css { position: relative;background:none;width: 450px;height: 700px;}.uil-default-css > div:nth-of-type(3){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.3s;animation-delay: -0.3s;}.uil-default-css { position: relative;background:none;width: 450px;height: 700px;}.uil-default-css > div:nth-of-type(4){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.2s;animation-delay: -0.2s;}.uil-default-css { position: relative;background:none;width: 450px;height: 700px;}.uil-default-css > div:nth-of-type(5){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.09999999999999998s;animation-delay: -0.09999999999999998s;}.uil-default-css { position: relative;background:none;width: 450px;height: 700px;}.uil-default-css > div:nth-of-type(6){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: 0s;animation-delay: 0s;}.uil-default-css { position: relative;background:none;width: 450px;height: 700px;}.uil-default-css > div:nth-of-type(7){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: 0.09999999999999998s;animation-delay: 0.09999999999999998s;}.uil-default-css { position: relative;background:none;width: 450px;height: 700px;}.uil-default-css > div:nth-of-type(8){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: 0.19999999999999996s;animation-delay: 0.19999999999999996s;}.uil-default-css { position: relative;background:none;width: 450px;height: 700px;}.uil-default-css > div:nth-of-type(9){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: 0.30000000000000004s;animation-delay: 0.30000000000000004s;}.uil-default-css { position: relative;background:none;width: 450px;height: 700px;}.uil-default-css > div:nth-of-type(10){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: 0.4s;animation-delay: 0.4s;}.uil-default-css { position: relative;background:none;width: 450px;height: 700px;}</style>
<input type="hidden" id="inAppBrowserFlag" value='<%=request.getParameter("inAppBrowserFlag")%>' />
<div id="layover" style=" position: fixed; width:100%; height:100%;	background-color:rgba(126, 126, 126, 0.5);	z-index: 10;display:none">
	<div class='uil-default-css' style='-webkit-transform:scale(0.28)'><div style='top:83px;left:93px;width:14px;height:34px;background:#706259;-webkit-transform:rotate(0deg) translate(0,-50px);transform:rotate(0deg) translate(0,-50px);border-radius:10px;position:absolute;'></div><div style='top:83px;left:93px;width:14px;height:34px;background:#706259;-webkit-transform:rotate(36deg) translate(0,-50px);transform:rotate(36deg) translate(0,-50px);border-radius:10px;position:absolute;'></div><div style='top:83px;left:93px;width:14px;height:34px;background:#706259;-webkit-transform:rotate(72deg) translate(0,-50px);transform:rotate(72deg) translate(0,-50px);border-radius:10px;position:absolute;'></div><div style='top:83px;left:93px;width:14px;height:34px;background:#706259;-webkit-transform:rotate(108deg) translate(0,-50px);transform:rotate(108deg) translate(0,-50px);border-radius:10px;position:absolute;'></div><div style='top:83px;left:93px;width:14px;height:34px;background:#706259;-webkit-transform:rotate(144deg) translate(0,-50px);transform:rotate(144deg) translate(0,-50px);border-radius:10px;position:absolute;'></div><div style='top:83px;left:93px;width:14px;height:34px;background:#706259;-webkit-transform:rotate(180deg) translate(0,-50px);transform:rotate(180deg) translate(0,-50px);border-radius:10px;position:absolute;'></div><div style='top:83px;left:93px;width:14px;height:34px;background:#706259;-webkit-transform:rotate(216deg) translate(0,-50px);transform:rotate(216deg) translate(0,-50px);border-radius:10px;position:absolute;'></div><div style='top:83px;left:93px;width:14px;height:34px;background:#706259;-webkit-transform:rotate(252deg) translate(0,-50px);transform:rotate(252deg) translate(0,-50px);border-radius:10px;position:absolute;'></div><div style='top:83px;left:93px;width:14px;height:34px;background:#706259;-webkit-transform:rotate(288deg) translate(0,-50px);transform:rotate(288deg) translate(0,-50px);border-radius:10px;position:absolute;'></div><div style='top:83px;left:93px;width:14px;height:34px;background:#706259;-webkit-transform:rotate(324deg) translate(0,-50px);transform:rotate(324deg) translate(0,-50px);border-radius:10px;position:absolute;'></div></div>
</div>
<!-- End of code for Spinner Animation -->

<!-- Refresh page button and time stamp - to be reworked -->
				<div class="refresh-page" onClick="window.location.reload();">
		<h2>Tap here to refresh this page</h2>
			<p id="lastRefreshTimeId">
				<script type="text/javascript">
					refreshTimestamp();
				</script>
			</p>
		</div>

<!-- Refresh page button and timestamp - END -->

<div class="page-content">

	<div class="visits patient">
		<h1>Video Visits You Can Join Now</h1>
		
		<c:choose>
			<c:when test="${WebAppContext.totalmeetings>0}">
				
				<c:forEach var="meeting" items="${WebAppContext.meetings}">
			
					<div class="meeting well">
	
						<div class="pic-frame">
							<div class="pic">
								<img src="${meeting.providerHost.imageUrl}">
							</div>
						</div>

						<div class="launch-button-handler only-tablets">
							<button class="button-launch-visit" megaMeetingUrl="${WebAppContext.megaMeetingMobileURL}" megameetingid="${meeting.mmMeetingConId}" lastname="${meeting.member.lastName}" firstname="${meeting.member.firstName}" meetingId="${meeting.meetingId}">Join Visit</button>
						</div>

						<div class="meeting-block-handler">
							<div class="hide-me timestamp_${meeting.meetingId}">${meeting.scheduledTimestamp}</div>
							<p class="time">Scheduled for <strong><span class="time_${meeting.meetingId}"></span></strong></p>

							<script type="text/javascript">
							// convert time stamp to time
								meetingTimestamp = $('.timestamp_' + ${meeting.meetingId}).text();
								convertedTimestamp = convertTimestampToDate(meetingTimestamp, 'time_only').toLowerCase() + ' '+ '<%=timezone%>' ;
								$('.time_' + ${meeting.meetingId}).append(convertedTimestamp);
							</script>

							<p class="host-name">
								${meeting.providerHost.firstName} ${meeting.providerHost.lastName}<c:if test="${not empty meeting.providerHost.title}">, ${meeting.providerHost.title}</c:if>
							</p>

							<button class="button-launch-visit only-handsets" megaMeetingUrl="${WebAppContext.megaMeetingMobileURL}" megameetingid="${meeting.mmMeetingConId}" lastname="${meeting.member.lastName}" firstname="${meeting.member.firstName}" meetingId="${meeting.meetingId}">Join Visit</button>

							<c:if test="${(meeting.participants != null && fn:length(meeting.participants) > 0) || (meeting.caregivers != null && fn:length(meeting.caregivers) > 0)}">

								<ul class="additional-participants">

								<c:if test="${meeting.participants != null && fn:length(meeting.participants) > 0}">

									<li class="section">Additional Clinicians:</li>

									<c:forEach var="p" items="${meeting.participants}">
										<li>${p.firstName} ${p.lastName}<c:if test="${not empty p.title}">, ${p.title}</c:if></li>
									</c:forEach>

								</c:if>

								<c:if test="${meeting.caregivers != null && fn:length(meeting.caregivers) > 0}">
										<li class="section">Guest:</li>
										<c:forEach var="p" items="${meeting.caregivers}">
											<li>${p.firstName} ${p.lastName}</li>
										</c:forEach>
								</c:if>

								</ul>
							</c:if>
						</div>
					</div>

				</c:forEach>
				
			</c:when>
			<c:otherwise>
			<!--  If no meetings are present -->

				<div class="alert alert-hero alert-no-visits">
					<div class="alert-hero-message">
					<div class="image"></div>
						<p><strong>You do not have a video visit scheduled in the next 15 minutes. Please check back later.</strong></p>
					</div>
				</div>

			</c:otherwise>

		</c:choose>

		<%@ include file="common/informationTwo.jsp" %>
				
	</div>
</div>