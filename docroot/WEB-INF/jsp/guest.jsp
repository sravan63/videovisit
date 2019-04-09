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
			<input type="hidden" id="vendor" value="${meeting.vendor}" />
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
<!-- US35718 changes -->
<input type="hidden" id="blockEdge" value="${WebAppContext.blockEdge}" />
<input type="hidden" id="blockSafari" value="${WebAppContext.blockSafari}" />
<input type="hidden" id="blockPexipIE" value="${WebAppContext.blockPexipIE}" />
<input type="hidden" id="blockSafariVersion" value="${WebAppContext.blockSafariVersion}" />
<!-- US35718 changes -->

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
	var blockSafari = ($("#blockSafari").val() == 'true');//US35718 changes
	var blockEdge = ($("#blockEdge").val() == 'true');//US35718 changes
	var blockPexipIE = ($("#blockPexipIE").val() == 'true');
	var meetingVendor = $('#vendor').val();

	var browserNotSupportedMsgForPatient = "Video Visits does not support your browser.";
	browserNotSupportedMsgForPatient += "<br /><br />";
	//US32190 changes
	browserNotSupportedMsgForPatient += "Please download the <a target='_blank' style='text-decoration:underline;' href='https://mydoctor.kaiserpermanente.org/ncal/mdo/presentation/healthpromotionpage/index.jsp?promotion=kppreventivecare'>My Doctor Online app</a>, or use Chrome or Internet Explorer.";

	function displayBlockMessage(){
		$('p#globalError').html(browserNotSupportedMsgForPatient);
		$("p#globalError").removeClass("hide-me");
		
		document.getElementById("last_name").disabled = true;
		$('#joinNowBtn').css('pointer-events', 'none');
        $('#joinNowBtn').css('cursor', 'default');
        $('#joinNowBtn').css('opacity', '0.5');
	};

	
	if(meetingVendor == 'pexip'){
		if (browserInfo.isIE){
	    	var agent = navigator.userAgent;
	    	if(navigator.userAgent.indexOf('Edge/') === -1){
	    		if(blockPexipIE){
		    		browserNotSupportedMsgForPatient = browserNotSupportedMsgForPatient.replace(' or Internet Explorer.', ', Safari, Firefox, or Edge.');
		    		displayBlockMessage();
	    		}
	    	}
	    }
	} else {
		//US32190 changes
		if(browserInfo.isChrome && blockChrome) {
			//US32190 changes
			browserNotSupportedMsgForPatient.replace(' or use Chrome,', '');
			//US32190 changes
			displayBlockMessage();
		}else if(browserInfo.isFirefox && blockFF) {
			displayBlockMessage();
		} else{
			if(browserInfo.isSafari){
				var agent = navigator.userAgent;
		    	//var splittedVersionStr = agent.split('Version/');
		    	//var versionNumber = parseInt(splittedVersionStr[1].substr(0,2));
		    	var majorMinorDot = agent.substring(agent.indexOf('Version/')+8, agent.lastIndexOf('Safari')).trim();
		    	var majorVersion = majorMinorDot.split('.')[0];
		    	var versionNumber = parseInt(majorVersion);
		    	var blockSafariVersion = $("#blockSafariVersion").val()?parseInt($("#blockSafariVersion").val()):12;//US35718 changes
		    	if(versionNumber >= blockSafariVersion && blockSafari){//US35718 changes
		    		displayBlockMessage();
		    	}
		    } else if (browserInfo.isIE){
		    	var agent = navigator.userAgent;
		    	if(navigator.userAgent.indexOf('Edge/') > -1 && blockEdge){//US35718 changes
		    		displayBlockMessage();
		    	}
		    }
		}
	}
	
	
	
</script>
