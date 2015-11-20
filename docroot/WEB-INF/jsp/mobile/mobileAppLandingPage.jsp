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

<div class="page-content" style="width:100%; height:100%; background:url('images/mobile/bkgrnd-faded.png') no-repeat center center; background-size:cover; margin:0; padding:0;">

	<div class="visits patient" style="padding:6px; overflow:hidden;">
		<!--<h1>Video Visits You Can Join Now</h1>	-->
		<h1 style="width:100%; padding:8px 0; text-align:center; color:#FFFFFF; background-color:#706259; border-radius:3px; margin:20px 0 2px;"> Video Visits </h1>
		
		<c:choose>
			<c:when test="${WebAppContext.totalmeetings>0}">
				
				<c:forEach var="meeting" items="${WebAppContext.meetings}">
			
					<div class="meeting well" style="min-height:85px; overflow:hidden; margin-bottom:5px; padding:20px; clear:both;">
	
						<div class="pic-frame">
							<div class="pic">
								<img src="${meeting.providerHost.imageUrl}">
							</div>
						</div>

						<div class="meeting-block-handler">
							<div class="hide-me timestamp_${meeting.meetingId}">${meeting.scheduledTimestamp}</div>
							<p class="time" style="padding-bottom:9px;">Scheduled Appointment</p>
							<p class="time_${meeting.meetingId}" style="font-size:22px; padding-bottom:3px;"></p>

							<script type="text/javascript">
							// convert time stamp to time
								meetingTimestamp = $('.timestamp_' + ${meeting.meetingId}).text();
								convertedTimestamp = convertTimestampToDate(meetingTimestamp, 'time_only').toLowerCase() + ' '+ '<%=timezone%>' ;
								$('.time_' + ${meeting.meetingId}).append(convertedTimestamp);
							</script>

							<p class="host-name" style="font-weight:normal;">
								${meeting.providerHost.firstName} ${meeting.providerHost.lastName}<c:if test="${not empty meeting.providerHost.title}">, ${meeting.providerHost.title}</c:if>
							</p>

							<c:if test="${(meeting.participants != null && fn:length(meeting.participants) > 0) || (meeting.caregivers != null && fn:length(meeting.caregivers) > 0)}">

								<ul class="additional-participants" style="margin-top:20px;">

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

					<div class="launch-button-handler only-tablets">
						<button class="button-launch-visit" megaMeetingUrl="${WebAppContext.megaMeetingMobileURL}" megameetingid="${meeting.mmMeetingConId}" lastname="${meeting.member.lastName}" firstname="${meeting.member.firstName}" meetingId="${meeting.meetingId}" style="float:right;">Join Visit</button>
					</div>

					<button class="button-launch-visit only-handsets" megaMeetingUrl="${WebAppContext.megaMeetingMobileURL}" megameetingid="${meeting.mmMeetingConId}" lastname="${meeting.member.lastName}" firstname="${meeting.member.firstName}" meetingId="${meeting.meetingId}" style="float:right; height:50px; margin-bottom:20px;">Join</button>

				</c:forEach>
				
			</c:when>
			<c:otherwise>
			<!--  If no meetings are present -->
				<div class="alert alert-hero alert-no-visits" style="background-color:#FFFFFF; box-shadow:none;">
					<div class="alert-hero-message">
						<div class="image" style="background:url('images/mobile/video-icon-gray.png') no-repeat center; margin:-10px 15px 0 0; background-size:contain;"></div>
						<p style=""><strong>You have no Video Visits scheduled within the next 15 minutes. Please check back again later.</strong></p>
					</div>
				</div>
				
				<!-- Refresh Page button and Time stamp - Start -->
				<div style="min-height:45px; padding-left:32px;">
					<div style="float:left; padding-top:5px;">
						<p id="lastUpdatedText"></p>
						<p id="lastUpdatedTime">
							<script type="text/javascript">
								refreshTimestamp();
							</script>
						</p>
					</div>
					<div class="refresh_button" style="float:right;">
						<button style="width:136px; height:45px; color:#FFFFFF; background-color:#0061A9; padding:10px 5px; border-radius:4px; font-size:16px;"> Refresh Page </button>
					</div>
				</div>
				<!-- Refresh Page button and Time stamp - END -->
			</c:otherwise>

		</c:choose>
	</div>

	<div style="font-weight:bold; text-align:left; margin-top:60px; padding:0 32px;">
		<p>Please make sure you have a strong Wi-Fi or 4G connection</p>
	</div>

	<!-- Fake Footer - to adjust the length of the Background image -->
	<div style="visibility:none; margin:100px 0;">
		<br/>
		<br/>
		<br/>
		<br/>
	</div>
	<!-- Fake Footer - to adjust the length of the Background image -->

</div>