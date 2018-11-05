<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*"%>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.command.*"%>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.*" %>
<%-- <%@ page import="org.kp.tpmg.videovisit.webserviceobject.xsd.*"%> --%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="javax.servlet.*"%>
<%@ page import="javax.servlet.http.*"%>

<%
String timezone = WebUtil.getCurrentDateTimeZone();
%>
<c:if test="${WebAppContext.totalmeetings>0}">
	<div id="landing-portal-ready">
		<c:forEach var="meeting" items="${WebAppContext.myMeetings}">
			<p class="login" style="padding:0px;">Children age 11 or younger must have a parent or legal guardian with them during the Video Visit.</p>
	      	<p class="guest-config-info login" style="padding:0px;">To ensure your webcam and speakers are configured correctly, please use our <a href="setup.htm?isGuest=Y" target="_blank">Setup Wizard</a> before proceeding.</p>
			<div class="landing-portal-single-container">				
				<div class="landing-portal-details guest">
					<div class="hidden timestamp">${meeting.meetingTime}</div>
					<h3>Your visit is scheduled for </h3>
					<p class="guest-directive">Please enter the following information to join this visit:</p> 
					<label for="last_name">Patient Last Name
						  <input type="text" name="last_name" id="last_name" maxlength="35"></input>
	            	</label>
					<!-- <a id="joinNowBtn" class="btn" meetingid="${meeting.meetingId}" href="${meeting.meetingVendorId}">Click to Continue</a>-->
					<input type="button" name="joinNowBtn" value="Click to Continue" id="joinNowBtn" class="btn" tabindex="4" disabled="disabled">
				</div>				
			</div>
			<!-- <p class="error error-guest-login"></p>-->
			<p id="globalError" class="error hide-me" style="font-size:14px; text-align:center; clear:both; height:35px; color:#AC5A41; font-weight:bold;"> </p>
			
			<input type="hidden" id="meetingId" value="${meeting.meetingId}" />
			<input type="hidden" id="mmMeetingName" value="${meeting.meetingVendorId}" />
		</c:forEach>
	</div>
</c:if>

<c:if test="${WebAppContext.totalmeetings<=0}">
	<div id="landing-portal-none">
		<p> The video visit you are trying to join is not currently available. </p>
	</div>
</c:if>

<input type="hidden" id="tz" value="<%=timezone%>" />
<input type="hidden" id="blockChrome" value="${WebAppContext.blockChrome}" />
<input type="hidden" id="blockFF" value="${WebAppContext.blockFF}" />

<style>
	input#joinNowBtn{
		opacity: 0.5;
		filter: alpha(opacity=50);
		cursor: default;
		width: 345px;
		color: #FFFFFF;
	}
	#last_name{
		width: 220px;
		height: 20px;
	}
</style>

<script type="text/javascript">
	var browserInfo = getBrowserInfo();
	var browserVersion = (browserInfo.version).split(".")[0];
	var blockChrome = ($("#blockChrome").val() == 'true');
	var blockFF = ($("#blockFF").val() == 'true');
	
	var browserNotSupportedMsgForPatient = "Video Visits does not support your browser.";
	browserNotSupportedMsgForPatient += "<br /><br />";
	//US32190 changes
	browserNotSupportedMsgForPatient += "Please download the <a target='_blank' style='text-decoration:underline;' href='https://mydoctor.kaiserpermanente.org/ncal/mdo/presentation/healthpromotionpage/index.jsp?promotion=kppreventivecare'>My Doctor Online app</a>, or use Chrome or Internet Explorer.";
	//US32190 changes
	if(browserInfo.isChrome && blockChrome) {
		//US32190 changes
		browserNotSupportedMsgForPatient.replace(' or use Chrome,', '');
		//US32190 changes
		$('p#globalError').html(browserNotSupportedMsgForPatient);
		$("p#globalError").removeClass("hide-me");
		
		document.getElementById("last_name").disabled = true;
		$('#joinNowBtn').css('pointer-events', 'none');
        $('#joinNowBtn').css('cursor', 'default');
        $('#joinNowBtn').css('opacity', '0.5');
	}else if(browserInfo.isFirefox && blockFF) {
		$('p#globalError').html(browserNotSupportedMsgForPatient);
		$("p#globalError").removeClass("hide-me");
		
		document.getElementById("last_name").disabled = true;
		$('#joinNowBtn').css('pointer-events', 'none');
        $('#joinNowBtn').css('cursor', 'default');
        $('#joinNowBtn').css('opacity', '0.5');
	} else{
		if(browserInfo.isSafari){
	    	var agent = navigator.userAgent;
	    	var splittedVersionStr = agent.split('Version/');
	    	var versionNumber = parseInt(splittedVersionStr[1].substr(0,2));
	    	if(versionNumber >= 12){
	    		$('p#globalError').html(browserNotSupportedMsgForPatient);
				$("p#globalError").removeClass("hide-me");
				
				document.getElementById("last_name").disabled = true;
				$('#joinNowBtn').css('pointer-events', 'none');
		        $('#joinNowBtn').css('cursor', 'default');
		        $('#joinNowBtn').css('opacity', '0.5');
	    	}
	    } else if (browserInfo.isIE){
	    	var agent = navigator.userAgent;
	    	if(navigator.userAgent.indexOf('Edge/') > -1){
	    		$('p#globalError').html(browserNotSupportedMsgForPatient);
				$("p#globalError").removeClass("hide-me");
				
				document.getElementById("last_name").disabled = true;
				$('#joinNowBtn').css('pointer-events', 'none');
		        $('#joinNowBtn').css('cursor', 'default');
		        $('#joinNowBtn').css('opacity', '0.5');
	    	}
	    }
	}
	
</script>
