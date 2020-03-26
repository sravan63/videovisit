<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*" %>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.command.*" %>

<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix='fn' uri='http://java.sun.com/jsp/jstl/functions' %>

<%
	MeetingCommand.IsMeetingHashValid(request);
	
	//MeetingCommand.retrieveMeetingForCaregiver(request, response);
	String meetingHash = request.getParameter("meetingCode");
	
%>

<input type="hidden" id="meetingCode" name="meetingCode" value="<%=meetingHash%>">

<div class="page-content" style="padding:10px;">
	<c:choose>
		<c:when test="${WebAppContext.totalmeetings > 0}">
			<div class="intro">
			
				<div class="pic-frame only-tablets">
 					<div class="pic" style="width:325px; height:225px;">
 						<img src="images/mobile/vv-patient-welcome-image.jpg" width="325" height="225">
 					</div>
	 			</div>
			
				<h1>Video Visits</h1>

				<div class="only-handsets">
					<p style="color:#666666; font-size:16px; font-weight:bold;">Welcome Patient Guest</p>
				</div>
		
				<div class="only-tablets">
					<p style="color:#666666; font-size:24px; font-weight:bold;">Welcome Patient Guest</p><br/>
					<p>Follow the steps below to get ready for your visit.</p>
					<p>You can join a Video Visit within 15 minutes of the appointment time.</p>
				</div>
				
			</div>
			<c:choose>
			<c:when test="${WebAppContext.myMeetings.get(0).vendor == null}">
				<%@ include file="common/informationpg.jsp" %>
			</c:when>
			</c:choose>
			<div class="only-tablets" style="text-align:center; margin-top:12px;">
				<button id="getAppButton" class="button-main getAppButton only-tablets" >Get the App</button>
				<button id="signInIdPG" class="button-main only-tablets" onclick="modalShow('modal-login')">Sign In</button>
			</div>
			
			<div style="text-align: center; margin-top:15px; margin-bottom:20px;">
				 For more help use the Sign In Help link on the My Doctor Online App.
			</div>
			
			<button id="getAppButton" class="button-main getAppButton only-handsets">Get the App</button>
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
			<c:choose>
			<c:when test="${WebAppContext.myMeetings.get(0).vendor == null}">
				<%@ include file="common/informationpg.jsp" %>
			</c:when>
			</c:choose>	
		</c:otherwise>
	</c:choose>

</div>