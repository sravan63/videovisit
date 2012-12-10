<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*" %>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.command.*" %>
<%@ page import="org.kp.tpmg.videovisit.webserviceobject.xsd.*" %>

<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix='fn' uri='http://java.sun.com/jsp/jstl/functions' %>


<%

	MeetingCommand.retrieveMeeting(request, response);
%>


<h1>Your Video Visits</h1>

<c:if test="${WebAppContext.totalmeetings>0}">
	<c:forEach var="meeting" items="${WebAppContext.meetings}">
		<div class="meeting well">
			<div class="time-slot">
				
				<button class="button-launch-visit" megaMeetingUrl="${WebAppContext.megaMeetingMobileURL}" megameetingid="${meeting.mmMeetingConId}" lastname="${meeting.member.lastName}" firstname="${meeting.member.firstName}">Launch Visit</button>
				<div class="hide-me timestamp_${meeting.meetingId}">${meeting.scheduledTimestamp}</div>
		
				<p id="displayTime">Visit scheduled for <span class="time"> <span class="time_${meeting.meetingId}"></span></span></p>
				<!--  TODO - not a good way of handling -->
				<script type="text/javascript">
					// convert time stamp to time
					 	meetingTimestamp = $('.timestamp_' + ${meeting.meetingId}).text();
					 	
				        convertedTimestamp = convertTimestampToDate(meetingTimestamp, 'time_only');
				      
				        $('.time_' + ${meeting.meetingId}).append(convertedTimestamp);
					
				</script>
			</div>
			<ul>
				<h2>Host Clinician</h2>
				<li class="host">
					<div class="pic-frame">
						
	              
						<div class="pic">
							<img src="${meeting.providerHost.imageUrl}">
						</div>
					</div>
					<div class="name">
						
	                  	${meeting.providerHost.firstName} ${meeting.providerHost.lastName}
	               		<c:if test="${not empty meeting.providerHost.title}">
	               			, ${meeting.providerHost.title}
	               		</c:if>
					 </div>
				</li>
				<c:if test="${meeting.participants != null && fn:length(meeting.participants) > 0}">
	               <h2 class="guests">Participants</h2>
	                  <c:forEach var="p" items="${meeting.participants}">
						<li class="guest-clinician">${p.firstName} ${p.lastName}<c:if test="${not empty p.title}">, ${p.title}</c:if></li>
	                  </c:forEach>
            	</c:if>
				<c:if test="${meeting.caregivers != null && fn:length(meeting.caregivers) > 0}">
	                <h2 class="guests">Guest Clinicians</h2>
	                 <c:forEach var="p" items="${meeting.caregivers}">
	                 	<li class="guest-clinician">${p.firstName} ${p.lastName}</li>
	                  </c:forEach>
	            </c:if>
				
			</ul>
		</div>
	</c:forEach>
</c:if>

<c:if test="${WebAppContext.totalmeetings <= 0}">
	<div class="alert hero">
		<div class="no-visits-image"></div>
		<p><strong>You have no visits scheduled within the next 15 minutes.</strong></p>
		<p>Please check back again later.</p>
	</div>
</c:if>

<ol class="well instructions">
	<h2>Be ready for your Video Visit:</h2>
	<li><button class="button-get-app" onClick="window.location='https://itunes.apple.com/us/app/vci-mobile/id477260861?mt=8#'">Get the App</button>Install the Video Visits app on your device.</li>
	<li><div class="img-connection"></div>Make sure you have a good connection.</li>
	<li>For best results, use headphones during the call.</li>
</ol>