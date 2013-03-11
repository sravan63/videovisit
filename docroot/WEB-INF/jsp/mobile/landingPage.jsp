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
		<h1>Visits you can join now</h1>
		
		<c:choose>
			<c:when test="${WebAppContext.totalmeetings>0}">
				<div class="alert hideable">
					<p><strong>For security reasons, only visits scheduled for the next 15 minutes are displayed.</strong></p>
				</div>
				<c:forEach var="meeting" items="${WebAppContext.meetings}">
			
					<div class="meeting well">
	
						<div class="pic-frame">
							<div class="pic">
								<img src="${meeting.providerHost.imageUrl}">
							</div>
						</div>

						<div class="launch-button-handler only-tablets">
							<button class="button-launch-visit" megaMeetingUrl="${WebAppContext.megaMeetingMobileURL}" megameetingid="${meeting.mmMeetingConId}" lastname="${meeting.member.lastName}" firstname="${meeting.member.firstName}" meetingId="${meeting.meetingId}">Launch visit</button>
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

							<button class="button-launch-visit only-handsets" megaMeetingUrl="${WebAppContext.megaMeetingMobileURL}" megameetingid="${meeting.mmMeetingConId}" lastname="${meeting.member.lastName}" firstname="${meeting.member.firstName}" meetingId="${meeting.meetingId}">Launch visit</button>

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



		

		<%@ include file="common/information.jsp" %>		
	</div>
</div>