<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*" %>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.command.*" %>

<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix='fn' uri='http://java.sun.com/jsp/jstl/functions' %>

<input type="hidden" id="isPG" value="true" />

<div>
	<p id="globalError" class="globalfailmessage hide-me" style="background-color:#686A6C;"></p>
</div>
<%
	String vendorType = request.getParameter("vType");
	if("p".equalsIgnoreCase(vendorType)){
		MeetingCommand.IsMeetingHashValid(request);
	}
	
%>
<c:choose>
<c:when test="${WebAppContext.totalmeetings == 0}">
<!--  If no meetings are present and vendor is pexip -->
		
			<div class="alert alert-hero alert-expired">
				<div class="alert-hero-message">
					<div class="image"></div>
					<p> The video visit you are trying to join is not currently available. </p>
				</div>
			</div>
			
</c:when>

<c:otherwise>
		<div style="padding:10px;">
		<div id="login-form">
		<h1>Sign In as a Guest</h1>	
		<form class="login-form" style="margin:10px 0 0;">
			<ul class="form-block" style="padding-right:6px;">
				<!--<li style="padding-right:6px; height:30px; border-radius:2px;">
					<p style="width:100%; background-color:#706259; color:#FFFFFF; text-align:center; padding:5px 1px 5px 5px; border-top-left-radius:3px; border-top-right-radius:3px;">
						Enter Patient&#39s Information
					</p>
				</li>-->
				<li><input type="text" name="last_name" id="last_name" tabindex="1" placeholder="Patient Last Name" autocorrect = "off" pattern="[a-zA-Z]+" required></li>

				<button id="login-submit-pg" class="off" tabindex="6" style="width:100%; height:35px; background-color:#0061A9; color:#FFFFFF; font-weight:bold; font-size:14px; margin:10px auto; border-radius:4px;" disabled="disabled">Sign In</button>
			</ul>
		</form>
		
		</div>
		<p class="disclaimer" style="margin: 0 0 10px;">Children age 11 and younger must have a parent present during the visit.</p>

	 	<c:choose>
			<c:when test="${WebAppContext.myMeetings.get(0).vendor == null}">
				<%@ include file="common/informationpg.jsp" %>
			</c:when>
		</c:choose>	
		</div>
</c:otherwise>
</c:choose>

<style>
	button#login-submit-pg{
		opacity:0.7;
	}
</style>
