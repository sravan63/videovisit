<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*" %>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.command.*" %>
<%@ page import="org.kp.tpmg.videovisit.webserviceobject.xsd.*" %>

<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix='fn' uri='http://java.sun.com/jsp/jstl/functions' %>

<%@ include file="patientguestLoginModal.jsp" %>


<%
	MeetingCommand.IsMeetingHashValid(request, response);
	
	//MeetingCommand.retrieveMeetingForCaregiver(request, response);
	String meetingHash = request.getParameter("meetingCode");
	
%>
<c:choose>
		<c:when test="${WebAppContext.totalmeetings > 0}">
			<div class="intro">
		<div class="pic-frame">
			<div class="pic">
				<img src="images/mobile/vv-patient-welcome-image.jpg">
			</div>
			</div>
			<h1>Video Visit</h1>
			<p>Meet with your doctor by video on your mobile device.</p>
		</div>
		
		<ol class="well instructions">
			<h2>Be ready for your video visit:</h2>
			<li id="getAppLiId"><button id="preLoginGetAppButtonId" class="button-get-app" onClick="window.location='https://itunes.apple.com/us/app/vci-mobile/id477260861?mt=8#'">Get App</button>Install the Video Visits app on your device.</li>
			<li><div class="img-connection"></div>Make sure you have a strong network connection.</li>
			<li>For best results, use headphones during the call.</li>
		</ol>
		
		<div>
			<button id="signInIdPG" class="button-main" onclick="modalShow('modal-login');">Sign on here</button>
		</div>
		</c:when>

<c:otherwise>
        	<!--  If no meetings are present -->
			
				<div class="alert hero">
					<div class="no-visits-image"></div>
					<p><strong>No scheduled Video Visits within the next 15 minutes. Please check back later.</strong></p>
					
				</div>
				<ol class="well instructions">
						<h2>Be ready for your video visit:</h2>
						<li id="getAppLiId"><button id="preLoginGetAppButtonId" class="button-get-app" onClick="window.location='https://itunes.apple.com/us/app/vci-mobile/id477260861?mt=8#'">Get App</button>Install the Video Visits app on your device.</li>
						<li><div class="img-connection"></div>Make sure you have a strong network connection.</li>
						<li>For best results, use headphones during the call.</li>
					</ol>
    	</c:otherwise>
</c:choose>
