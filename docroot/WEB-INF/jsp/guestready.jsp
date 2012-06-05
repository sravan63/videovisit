<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*"%>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.command.*"%>
<%@ page import="org.kp.tpmg.videovisit.member.serviceapi.webserviceobject.xsd.*"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="javax.servlet.*"%>
<%@ page import="javax.servlet.http.*"%>

<%
	MeetingCommand.retrieveMeetingForCaregiver(request, response);
%>

<c:if test="${WebAppContext.totalmeetings>0}">
	<div id="landing-portal-ready">
		<c:forEach var="meeting" items="${WebAppContext.meetings}">
			<div class="landing-portal-single-container">
        <img src=${meeting.host.imageUrl} alt="" />
				<div class="landing-portal-details">
					<div class="hidden timestamp">${meeting.scheduledTimestamp}</div>
					<h3>This visit is scheduled for </h3>
					<div class="meeting-with-container">
						<span>Meeting with:</span> 
						<span>&nbsp; 
							${meeting.host.firstName} ${meeting.host.lastName} 
								<c:if test="${not empty meeting.host.title}">, ${meeting.host.title}</c:if>
						</span>
					</div>
					<div class="names-container">
						<span class="label">Patient name:</span> 
						<span class="names patient-guests">${meeting.member.firstName} ${meeting.member.lastName}</span>
					</div>
					<a class="btn" meetingid="${meeting.meetingId}"	href="${meeting.mmMeetingName}">Click here to join now</a>
					<p class="smallprint">You may be joining before your clinician.	Please be patient.</p>
				</div>
			</div>
		</c:forEach>
	</div>
</c:if>
<c:if test="${WebAppContext.totalmeetings<=0}">
	<div id="landing-portal-none">
		<p>You have no video visits scheduled within the next 15 minutes.</p>
		<p>Please check back again later.</p>
	</div>
</c:if>