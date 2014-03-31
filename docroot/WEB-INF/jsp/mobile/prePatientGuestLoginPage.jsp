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
			
<!-- 			Commented by Mandar A. on 01/10/2014 - US3503 -->
			<!--<div class="pic-frame">
 					<div class="pic"><img src="images/mobile/vv-patient-welcome-image.jpg"></div>
	 			</div> -->
			
				<h1>Video Visits</h1>

				<div class="only-handsets">
					<p style="color:#666666; font-size:16px; font-weight:bold;">Welcome Patient Guest</p>
				</div>
		
				<div class="only-tablets">
					<p>Kaiser Permanente is pleased to offer you the opportunity to meet with your doctor from your smartphone or tablet.</p>
					<p>To attend a video visit, you will need a device with a front-facing camera, the KP Preventive Care App and a fast internet connection (4G or Wi-Fi highly recommended).</p>
				</div>
				<button id="getAppButton" class="button-main getAppButton only-tablets" >Get the App</button><br/>
				<button id="signInIdPG" class="button-main only-tablets" onclick="modalShow('modal-login')">Sign In</button>
			</div>
			
			
		
			<%@ include file="common/informationpg.jsp" %>
			
			<div style="text-align: center; margin-top:15px; margin-bottom:20px;">
				For more help use the Sign In Help link on the KP Preventive Care app.
			</div>
			
			<button id="getAppButton" class="button-main getAppButton only-handsets">Get the App</button>
			<!--	<br/>	-->
			<button id="signInIdPGHand" class="button-main only-handsets" onclick="modalShow('modal-login')">Sign In</button>
			
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