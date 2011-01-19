<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*" %>
<%@ page import="org.kp.tpmg.videovisit.member.serviceapi.webserviceobject.xsd.*" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<div id="landing-portal-ready">

<c:forEach var="meeting" items="${WebAppContext.meetings}">
    <div class="landing-portal-single-container">
        <img src=${meeting.host.imageUrl} alt="" />
        <div class="landing-portal-details">
            <div class="hidden timestamp">${meeting.scheduledTimestamp}</div>
            <h3>Your visit is scheduled for </h3>
            <p class="label">Meeting with:</p>
            <p class="name">${meeting.host.firstName} ${meeting.host.lastName}, DPM<br><a target="_blank" href="${meeting.host.homePageUrl}">Visit home page</a></p>
            <a class="btn" meetingid="${meeting.meetingId}" href="${meeting.mmMeetingName}">Click here to join now</a>
            <p class="smallprint">You may be joining before your clinician.  Please be patient.</p>
        </div>
    </div>
</c:forEach>

</div>


