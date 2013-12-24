<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*" %>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.command.*" %>
<%@ page import="org.kp.tpmg.videovisit.webserviceobject.xsd.*" %>

<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix='fn' uri='http://java.sun.com/jsp/jstl/functions' %>




<%
	MeetingCommand.IsMeetingHashValid(request, response);
	
	//MeetingCommand.retrieveMeetingForCaregiver(request, response);
	String meetingHash = request.getParameter("meetingCode");
	
%>
<div class="page-content">
	<c:choose>
		<c:when test="${WebAppContext.totalmeetings > 0}">
			<div class="intro">
				<div class="pic-frame">
					<div class="pic"><img src="images/mobile/vv-patient-welcome-image.jpg"></div>
				</div>
			
			<h1>Video Visits</h1>

				<div class="only-handsets">
					<p>Meet with your doctor by video on your mobile device.</p>
				</div>

				<div id="modal-login" class="modal">
					<div class="modal-window">
						<div id="close-modal" class="button-close"></div>
						<h1>Sign on to Video Visits</h1>
				
						<div id="app-alert">
							<p>To join a video visit from your mobile device, please install our Video Visits mobile app. </p>
								<div class="app-lockup getAppButton">
									<div class="app-icon"></div>
									<p>Video Visits app</p>
								</div>
							<button id="patientLoginGetAppButtonId" class="button-primary getAppButton">Get the app</button>
							<button class="button-secondary" id="btn-i-have-it">I have it installed!</button>
						</div>
					</div>
				</div>
		
				<div class="only-tablets">
					<p>Kaiser Permanente is pleased to offer you the opportunity to meet with your doctor from your smartphone or tablet.</p>
					<p>To attend a video visit, you will need a device with a front-facing camera, the Video Visits app and a fast internet connection (4G or Wi-fi highly recommended).</p>
				</div>
				<button id="getAppButton" class="button-get-app only-tablets" >Get App</button><br/>
				<button id="signInIdPG" class="button-main only-tablets" >Sign on here</button>
			</div>
			
			
		
			<%@ include file="common/information.jsp" %>	
			<button id="getAppButton" class="button-get-app only-handsets" >Get App</button><br/>
			<button id="signInIdPGHand" class="button-main only-handsets" >Sign on here</button>
			
		</c:when>

		<c:otherwise>
		<!--  If no meetings are present -->

			<div class="alert alert-hero alert-expired">
				<div class="alert-hero-message">
					<div class="image"></div>
					<p> The video visit you are trying to join is not currently available. </p>
				</div>
			</div>

			<%@ include file="common/information.jsp" %>	
		</c:otherwise>
	</c:choose>

</div>