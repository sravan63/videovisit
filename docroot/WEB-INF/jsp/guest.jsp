<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*"%>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.command.*"%>
<%@ page import="org.kp.tpmg.videovisit.member.serviceapi.webserviceobject.xsd.*"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="javax.servlet.*"%>
<%@ page import="javax.servlet.http.*"%>

<c:if test="${WebAppContext.totalmeetings>0}">
	<div id="landing-portal-ready">
		<c:forEach var="meeting" items="${WebAppContext.meetings}">
			<div class="landing-portal-single-container">				
				<div class="landing-portal-details">
					<div class="hidden timestamp">${meeting.scheduledTimestamp}</div>
					<h3>Your visit is scheduled for</h3>
					<div class="meeting-with-container">
						<span>Please enter the following information to join this visit:</span> 
						<span>&nbsp; 
						<label for="patient_last_name">Patient last Name</label>
						<input type="text" name="patient_last_name" id="patient_last_name"></input>
						</span>
					</div>					
					<a class="btn" meetingid="${meeting.meetingId}"	href="${meeting.mmMeetingName}">Click to continue</a>					
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