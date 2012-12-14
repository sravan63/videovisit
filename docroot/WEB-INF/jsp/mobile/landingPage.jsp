<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*" %>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.command.*" %>
<%@ page import="org.kp.tpmg.videovisit.webserviceobject.xsd.*" %>

<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix='fn' uri='http://java.sun.com/jsp/jstl/functions' %>


<%

	MeetingCommand.retrieveMeeting(request, response);
%>

<div class="visits patient">
	<h1>Your Video Visits</h1>
	
	<c:choose>
		<c:when test="${WebAppContext.totalmeetings>0}">
			<c:forEach var="meeting" items="${WebAppContext.meetings}">
		
				<div class="meeting well">
							
					<div class="pic-frame">
						<div class="pic">
							<img src="${meeting.providerHost.imageUrl}">
						</div>
					</div>
					<div class="hide-me timestamp_${meeting.meetingId}">${meeting.scheduledTimestamp}</div>
					<p class="time">Scheduled for <strong><span class="time_${meeting.meetingId}"></span></strong></p>
					<script type="text/javascript">
					// convert time stamp to time
						meetingTimestamp = $('.timestamp_' + ${meeting.meetingId}).text();
						convertedTimestamp = convertTimestampToDate(meetingTimestamp, 'time_only');
						$('.time_' + ${meeting.meetingId}).append(convertedTimestamp);
					
					</script>
					<p class="host-name">
						${meeting.providerHost.firstName} ${meeting.providerHost.lastName}
							<c:if test="${not empty meeting.providerHost.title}">
								, ${meeting.providerHost.title}
							</c:if>
					</p>
					<button class="button-launch-visit" megaMeetingUrl="${WebAppContext.megaMeetingMobileURL}" megameetingid="${meeting.mmMeetingConId}" lastname="${meeting.member.lastName}" firstname="${meeting.member.firstName}">Launch Visit</button>
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
				</div>

			</c:forEach>
			
		</c:when>
		<c:otherwise>
        	<!--  If no meetings are present -->
			
				<div class="alert hero">
					<div class="no-visits-image"></div>
					<p><strong>You have no visits scheduled within the next 15 minutes.</strong></p>
					<p>Please check back again later.</p>
				</div>
	
    	</c:otherwise>
		
	</c:choose>
	


	<div class="alert concealable">
		<div class="button-close"></div>
		<p><strong>For security reasons, only visits scheduled for the next 15 minutes are being displayed.</strong></p>
	</div>
		
	<ol class="well instructions">
		<h2>Be ready for your video visit:</h2>
		<li><button class="button-get-app" onClick="window.location='https://itunes.apple.com/us/app/vci-mobile/id477260861?mt=8#'">Get App</button>Install the Video Visits app on your device.</li>
		<li><div class="img-connection"></div>Make sure you have a good connection.</li>
		<li>For best results, use headphones during the call.</li>
	</ol>
</div>