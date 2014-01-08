<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*"%>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.command.*"%>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.*" %>
<%@ page import="org.kp.tpmg.videovisit.webserviceobject.xsd.*"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="javax.servlet.*"%>
<%@ page import="javax.servlet.http.*"%>

<%
String timezone = WebUtil.getCurrentDateTimeZone();
%>
<c:if test="${WebAppContext.totalmeetings>0}">
	<div id="landing-portal-ready">
		<c:forEach var="meeting" items="${WebAppContext.meetings}">
			<p class="login" style="padding:0px;">Children age 11 or younger may not use this website alone. A parent or legal guardian may use this website and have the child with them during the visit.</p>
	      	<!--<p class="guest-config-info">To ensure your webcam and speakers are configured correctly, please use our <a href="javascript:void(0)" onclick="popUp=window.open('http://kaiserm3test.videoconferencinginfo.com/setup/', 'width=725', 'height=507');">Setup Wizard</a>, and please make sure you have the latest version of <a href="http://www.adobe.com/software/flash/about" target="_blank">Adobe Flash</a> before proceeding.</p>-->
			<div class="landing-portal-single-container">				
				<div class="landing-portal-details guest">
					<div class="hidden timestamp">${meeting.scheduledTimestamp}</div>
					<h3>Your visit is scheduled for </h3>
					<p class="guest-directive">Please enter the following information to join this visit:</p> 
					<label for="patient_last_name">Patient Last Name
						  <input type="text" name="patient_last_name" id="patient_last_name" maxlength="35"></input>
	            	</label>
					<a id="joinNowBtn" class="btn" meetingid="${meeting.meetingId}"	href="${meeting.mmMeetingName}">Click to continue</a>										
				</div>				
			</div>
			<p class="error error-guest-login"></p>
		</c:forEach>
	</div>
</c:if>

<c:if test="${WebAppContext.totalmeetings<=0}">
	<div id="landing-portal-none">
		<p> The video visit you are trying to join is not currently available. </p>
	</div>
</c:if>

<input type="hidden" id="tz" value="<%=timezone%>" /> 

<script type="text/javascript">

	function getBrowserInfo() {
	
		var browserUserAgent = navigator.userAgent;
		
		
		var browserInfo = new Object();
		
		browserInfo.is32Bit = true;
	
		if (browserUserAgent.indexOf("x64") != -1) {
			browserInfo.is32Bit = false;
		}
		browserInfo.is32BitOS = true;
	
		if (browserUserAgent.indexOf("WOW64") != -1 || browserUserAgent.indexOf("Win64") != -1 ){
			browserInfo.is32BitOS = false;
		} 
	
		browserInfo.isIE = false;
		browserInfo.isFirefox = false;
		browserInfo.isChrome = false;
		browserInfo.isSafari = false;
		
		var jqBrowserInfoObj = $.browser; 
	
		browserInfo.version = jqBrowserInfoObj.version;
		
		if ( jqBrowserInfoObj.mozilla) {
			browserInfo.isFirefox = true;
		} else if ( jqBrowserInfoObj.msie){
			browserInfo.isIE = true;
		} else if ( jqBrowserInfoObj.chrome){
			browserInfo.isChrome = true;
		} else if ( jqBrowserInfoObj.safari){
			browserInfo.isSafari = true;
		}
	
		return browserInfo;
	}	

	var browserInfo = getBrowserInfo();
	
	var browserNotSupportedMsg = "Video Visit is currently supported on 32 bit browsers only.";
	browserNotSupportedMsg += "<br /><br />";
	browserNotSupportedMsg += "You are currently running an unsupported browser.";
	browserNotSupportedMsg += "<br /><br />";
	browserNotSupportedMsg += "Click <a href='mdohelp.htm' target='_blank'>Help</a> to find out more about supported browsers.";
	
	if(browserInfo.isIE) {
		if (((browserInfo.version == 8 || browserInfo.version == 9) && !browserInfo.is32Bit) || browserInfo.version <= 7) {
			$('p.error').html( browserNotSupportedMsg );
			
			document.getElementById("patient_last_name").disabled = true;

			document.getElementById("joinNowBtn").disabled = true;
		} 
	}
	
</script>
