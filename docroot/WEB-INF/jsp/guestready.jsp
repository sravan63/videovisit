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
<c:if test="${WebAppContext.totalmeetings>0}">
<!--satish US15509 start>-->
	<div id="landing-portal-ready" class="guestPortalReady">
		<c:forEach var="meeting" items="${WebAppContext.myMeetings}">
		<div class="landing-portal-single-container" style="padding-bottom:23px;border-top:1px solid rgb(181, 181, 181)">
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
                    <h2 class="label" style="float:none;margin-bottom: 15px;">Additional Participants</h2>
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
                 <!--left end-->
    </div>
 <div class="center">
              <img class="circle-image" src=${meeting.host.imageUrl} alt="" />
              <!--<span class="name-and-details">${meeting.host.firstName} ${meeting.host.lastName}, ${meeting.host.title}</span>-->
               <c:choose>
						    <c:when test="${not empty meeting.host.homePageUrl}">
						        <a target="_blank" style="font-weight:bold" href="${meeting.host.homePageUrl}">
									${meeting.host.firstName} ${meeting.host.lastName} 
									<c:if test="${not empty meeting.host.title}">, ${meeting.host.title}</c:if>
								</a>
						    </c:when>
						    <c:otherwise>
						        ${meeting.host.firstName} ${meeting.host.lastName} 
								<c:if test="${not empty meeting.host.title}">, ${meeting.host.title}</c:if>
						    </c:otherwise>
						 </c:choose>
              <div class="" style="">${meeting.host.departmentName}</div>
         <!--center end--></div>
					<div class="right">
					<!-- Added by Ranjeet for same guest login issue 01/06/2014 -->
					<c:forEach var="caregiver" items="${meeting.caregiver}">		
						<c:if test="${WebAppContext.meetingCode == caregiver.careGiverMeetingHash}">
						  <button id="joinNowId" class="btn joinNowButton"userName="${caregiver.lastName}, ${caregiver.firstName}, (${caregiver.emailAddress})" meetingid="${meeting.meetingId}" href="${meeting.meetingVendorId}" caregiverId="${caregiver.careGiverId}">Click here to join now</button>
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
