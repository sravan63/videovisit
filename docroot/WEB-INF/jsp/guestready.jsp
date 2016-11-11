<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*"%>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.command.*"%>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.*" %>
<%@ page import="org.kp.tpmg.videovisit.model.*"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix='fn' uri='http://java.sun.com/jsp/jstl/functions' %>
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

<div class="sub-banner">
  <div class="heading">Your Video Visits for Today</div>
  <div class="links">
    <a href="javascript:location.reload()">Refresh page</a>
    <span>|</span>
    <a href="mdohelp.htm" target="_blank">Help</a>
  </div>
</div>

<c:if test="${WebAppContext.totalmeetings>0}">
<!--satish US15509 start>-->
	<div id="landing-portal-ready" class="guestPortalReady" style="width:90%; margin-top:0px; font-family:Avenir Next, sans-serif;">
		<c:forEach var="meeting" items="${WebAppContext.myMeetings}">
		<div class="landing-portal-single-container" style="padding-bottom:23px;">
            <!--<img src=${meeting.host.imageUrl} alt="" />-->
				<div class="meeting-details-container" style="font-size:14px;">

	                 <div class="left">
		                 <div class="time-display">
		                    <span class="timestamp">${meeting.meetingTime} </span>
		                    <span></span>
		                  </div>
		                   <span>${meeting.member.firstName} ${meeting.member.lastName}</span>
		                   <div class="accord-contents" style="display:block;margin-top:30px;">
		                  <c:if test="${meeting.participant != null && fn:length(meeting.participant) > 0 || meeting.caregiver != null && fn:length(meeting.caregiver) > 0}">
		                    <h2 class="label" style="float:none;margin-bottom:10px;">Additional Participants</h2>
		                  </c:if>
		                  <c:if test="${meeting.participant != null && fn:length(meeting.participant) > 0}">
		                    <div class="names-container-member" style="margin:0px;">
		                      <span class="names participants" style="margin-left:0;">
		                        <c:forEach var="p" items="${meeting.participant}">
		                          <span>${p.firstName} ${p.lastName}<c:if test="${not empty p.title}">, ${p.title}</c:if></span>
		                        </c:forEach>
		                      </span>
		                    </div>
		                  </c:if>
		                  <div class="names-container-member" style="margin:0px;">
		                    <c:if test="${meeting.caregiver != null && fn:length(meeting.caregiver) > 0}">
		                      <span class="names patient-guests" style="margin-left:0;">
		                        <c:forEach var="p" items="${meeting.caregiver}">
		                          <span>${p.firstName} ${p.lastName}</span>
		                        </c:forEach>
		                      </span>
		                    </c:if>
		                  </div>
		              </div>
	    			</div>
	    			<!--left end-->
			 		<div class="center">
		              <img class="circle-image" src=${meeting.host.imageUrl} alt="" />
		               <c:choose>
					    <c:when test="${not empty meeting.host.homePageUrl}">
					        <a target="_blank" class="name-and-details camel-case" style="font-weight:bold" href="${meeting.host.homePageUrl}">
								${meeting.host.firstName} ${meeting.host.lastName} 
								<c:if test="${not empty meeting.host.title}">, ${meeting.host.title}</c:if>
							</a>
					    </c:when>
					    <c:otherwise>
					        <div class="name-and-details camel-case" style="font-weight:bold">
								${meeting.host.firstName} ${meeting.host.lastName}
								<c:if test="${not empty meeting.host.title}">, ${meeting.host.title}</c:if>
							</div>
					    </c:otherwise>
					  </c:choose>
		              <div class="department-details camel-case" style="width: 180px;">${meeting.host.departmentName}</div>
			         </div>
         			<!--center end-->
					<div class="right">
						<!-- Added by Ranjeet for same guest login issue 01/06/2014 -->
						<c:forEach var="caregiver" items="${meeting.caregiver}">		
							<c:if test="${WebAppContext.meetingCode == caregiver.careGiverMeetingHash}">
							  <button id="joinNowId" class="btn joinNowButton"userName="${caregiver.lastName}, ${caregiver.firstName}, (${caregiver.emailAddress})" meetingid="${meeting.meetingId}" href="${meeting.meetingVendorId}" caregiverId="${caregiver.careGiverId}">Join your visit</button>
							 </c:if>
						</c:forEach>	
						<p class="" style="margin-top:20px;">You may be joining before your clinician. Please be patient.</p>
						<p class="error error-guest-login"></p>
					</div>
				</div>
			</div>
		</c:forEach>
	</div>
	<!--satish US15509 end-->
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
