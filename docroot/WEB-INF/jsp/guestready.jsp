<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*"%>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.command.*"%>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.*" %>
<%@ page import="org.kp.tpmg.videovisit.webserviceobject.xsd.*"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="javax.servlet.*"%>
<%@ page import="javax.servlet.http.*"%>

<%
	MeetingCommand.retrieveMeetingForCaregiver(request, response);
	String timezone = WebUtil.getCurrentDateTimeZone();
	
	WebAppContext ctx = WebAppContext.getWebAppContext(request);
	
	String meetingCode = ctx.getMeetingCode();
	String patientLastName = ctx.getPatientLastName();
	String nocache = ctx.getNocache();
	String meetingId = ctx.getGuestMeetingId();

%>

<c:if test="${WebAppContext.totalmeetings>0}">
	<div id="landing-portal-ready">
		<c:forEach var="meeting" items="${WebAppContext.meetings}">
			<div class="landing-portal-single-container">
        <img src=${meeting.providerHost.imageUrl} alt="" />
				<div class="landing-portal-details">
					<div class="hidden timestamp">${meeting.scheduledTimestamp}</div>
					<h3>This visit is scheduled for </h3>
					<div class="meeting-with-container">
						<span>Meeting with:</span> 
						<span>&nbsp; 
							<a target="_blank" href="${meeting.providerHost.homePageUrl}">
							${meeting.providerHost.firstName} ${meeting.providerHost.lastName} 
								<c:if test="${not empty meeting.providerHost.title}">, ${meeting.providerHost.title}</c:if>
							</a>
						</span>
					</div>
					<div class="names-container">
						<span class="label">Patient Name:</span> 
						<span class="names patient-guests">${meeting.member.lastName}, ${meeting.member.firstName} ${meeting.member.middleName}</span>
					</div>
					<!-- Commented by Srini  08/27 -->
					<a class="btn" userName="${WebAppContext.careGiverName}" meetingid="${meeting.meetingId}"	href="${meeting.mmMeetingName}" caregiverId="${meeting.caregiver[0].careGiverID}">Click here to join now</a>
				<!-- 	<a class="btn" meetingid="${meeting.meetingId}"	href="${meeting.mmMeetingName}" caregiverId="${meeting.caregiver[0].careGiverID}">Click here to join now</a> -->
					<p class="smallprint">You may be joining before your clinician.	Please be patient.</p>
					<p class="error error-guest-login"></p>
				</div>
			</div>
		</c:forEach>
	</div>
</c:if>
<c:if test="${WebAppContext.totalmeetings<=0}">
	<div id="landing-portal-none">
		<p>You do not have a video visit scheduled in the next 15 minutes. Please check back later.</p>
	</div>
</c:if>
<input type="hidden" id="tz" value="<%=timezone%>" /> 
<input type="hidden" id="meetingCode" value="<%=meetingCode%>" /> 
<input type="hidden" id="patientLastName" value="<%=patientLastName%>" /> 
<input type="hidden" id="nocache" value="<%=nocache%>" /> 
<input type="hidden" id="meetingId" value="<%=meetingId%>" /> 
