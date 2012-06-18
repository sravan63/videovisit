<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*"%>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.command.*"%>
<%@ page import="org.kp.tpmg.videovisit.member.serviceapi.webserviceobject.xsd.*"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="javax.servlet.*"%>
<%@ page import="javax.servlet.http.*"%>


<c:if test="${WebAppContext.totalmeetings>0}">
	<div id="landing-portal-ready">
		<c:forEach var="meeting" items="${WebAppContext.meetings}">
      <p class="guest-config-info">To ensure your webcam and speakers are configured correctly, please use our <a href="javascript:void(0)" onclick="popUrl('http://kaiserm3.videoconferencinginfo.com/guest/meetingSetup.swf');">Setup Wizard</a>, and please make sure you have the latest version of <a href="http://www.adobe.com/software/flash/about" target="_blank">Adobe Flash</a> before proceeding.</p>

			<div class="landing-portal-single-container">				
				<div class="landing-portal-details guest">
					<div class="hidden timestamp">${meeting.scheduledTimestamp}</div>
					<h3>Your visit is scheduled for </h3>
						<p class="guest-directive">Please enter the following information to join this visit:</p> 
						<label for="patient_last_name">Patient last Name
						  <input type="text" name="patient_last_name" id="patient_last_name"></input>
            </label>
					<a class="btn" meetingid="${meeting.meetingId}"	href="${meeting.mmMeetingName}">Click to continue</a>										
				</div>				
			</div>
			<p class="error error-guest-login"><a name="errors"></a></p>
		</c:forEach>


	</div>
</c:if>
<c:if test="${WebAppContext.totalmeetings<=0}">
	<div id="landing-portal-none">
		<p>You have no video visits scheduled within the next 15 minutes.</p>
		<p>Please check back again later.</p>
	</div>
</c:if>