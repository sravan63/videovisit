<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*" %>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.command.*" %>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.*" %>
<%@ page import="org.kp.tpmg.videovisit.webserviceobject.xsd.*" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix='fn' uri='http://java.sun.com/jsp/jstl/functions' %>
<%@ page import="javax.servlet.*" %>
<%@ page import="javax.servlet.http.*" %>

<%

	MeetingCommand.retrieveMeeting(request, response);
	String timezone = WebUtil.getCurrentDateTimeZone();

%>

<c:if test="${WebAppContext.totalmeetings>0}">



<div id="landing-portal-ready">
<c:forEach var="meeting" items="${WebAppContext.meetings}">

    <div class="landing-portal-single-container">
        <img src=${meeting.providerHost.imageUrl} alt="" />
        <div class="landing-portal-details">
            <div class="hidden timestamp">${meeting.scheduledTimestamp} </div>
            <h3>Your visit is scheduled for </h3>
            <div class="meeting-with-container">
              <span>Meeting with:</span>
              <span>&nbsp;
                <c:if test="${meeting.providerHost.homePageUrl != null && fn:length(meeting.providerHost.homePageUrl) > 0}">
                <a target="_blank" href="${meeting.providerHost.homePageUrl}">${meeting.providerHost.firstName} ${meeting.providerHost.lastName}<c:if test="${not empty meeting.providerHost.title}">, ${meeting.providerHost.title}</c:if>
                </a>
                </c:if>
               	<c:if test="${meeting.providerHost.homePageUrl == null || fn:length(meeting.providerHost.homePageUrl) == 0}">
                  		${meeting.providerHost.firstName} ${meeting.providerHost.lastName}<c:if test="${not empty meeting.providerHost.title}">, ${meeting.providerHost.title}</c:if>
                  	</c:if>
              </span>
            </div>

            <c:if test="${meeting.participants != null && fn:length(meeting.participants) > 0}">
              <div class="names-container">
                <span class="label">Participants:</span>
                <span class="names participants">
                  <c:forEach var="p" items="${meeting.participants}">
                  	<c:if test="${p.homePageUrl != null && fn:length(p.homePageUrl) > 0}">
                   		 <a target="_blank" href="${p.homePageUrl}">${p.firstName} ${p.lastName}<c:if test="${not empty p.title}">, ${p.title}</c:if></a>
                   	</c:if>
                   	<c:if test="${p.homePageUrl == null || fn:length(p.homePageUrl) == 0}">
                   		${p.firstName} ${p.lastName}<c:if test="${not empty p.title}">, ${p.title}</c:if>
                   	</c:if>
                  </c:forEach>

                </span>
              </div>
            </c:if>

            <div class="names-container">
              <c:if test="${meeting.caregivers != null && fn:length(meeting.caregivers) > 0}">
                <span class="label">Patient Guests:</span>
                <span class="names patient-guests">
                  <c:forEach var="p" items="${meeting.caregivers}">
                    <span>${p.firstName} ${p.lastName}</span>
                  </c:forEach>
                </span>
              </c:if>
            </div>

            <a class="btn" meetingid="${meeting.meetingId}" href="${meeting.mmMeetingName}">Click here to join now</a>
            <p class="smallprint">You may be joining before your clinician.  Please be patient.</p>
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

<%@ include file="preloader.jsp" %>

<div id="dialog-block-user-in-meeting-modal" class="jqmWindow dialog-block2" style="display:none" title="Quit Meeting">
	<div class="dialog-content-question">
		<h2 class="jqHandle jqDrag"><span style="padding-left:8px">User already signed on</span></h2>
		<p>You have already joined this video visit from another device. You must first sign off from the other device before attempting to join this visit here.
		</p>
		<div class="jqmClose" align="center"><input class="button" id="ok"  type="button"  value="OK" /></div>
	</div>
</div>	
<input type="hidden" id="tz" value="<%=timezone%>" /> 

<%--  
<div id="join-now-modal" class="join-now-dialog jqmWindow" style="display:none" title="Join Now">
	<%@ include file="visit.jsp" %>
	
</div>
--%>


