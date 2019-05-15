<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*"%>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.command.*"%>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.*" %>
<%@ page import="org.kp.tpmg.videovisit.model.*"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix='fn' uri='http://java.sun.com/jsp/jstl/functions' %>
<%@ page import="javax.servlet.*"%>
<%@ page import="javax.servlet.http.*"%>

<%
	//MeetingCommand.retrieveMeetingForCaregiver(request, response);
	String timezone = WebUtil.getCurrentDateTimeZone();
	
	WebAppContext ctx = WebAppContext.getWebAppContext(request);
	
	String meetingCode = ctx.getMeetingCode();
	String patientLastName = ctx.getPatientLastName();
	String nocache = ctx.getNocache();
	String meetingId = ctx.getGuestMeetingId();
  String guestName = ctx.getCareGiverName();

%>

<div class="sub-banner">
  <div class="heading">Your Video Visits for Today</div>
  <div class="links">
  	<!-- US31770 -->
    <a href="javascript:refreshGrid();">Refresh page</a>
    <!-- US31770 -->
    <span>|</span>
    <a href="mdohelp.htm" target="_blank">Help</a>
  </div>
  <!-- UDP Test Results -->
  <div class="special-message-banner-container" id="udp-test-container">
	  <div class="special-message-header">
	    <span class="warning-icon"></span>
	    <p class="warning-text">Unable to establish a connection to your visit</p>
	  </div>
	  <div class="special-message-content">
	    <div class="special-message-container">
	      <div class="mdo-logo"></div>
	      <div class="special-message">
	        <p>Join on your mobile device using</p>
	        <p><b>My Doctor Online</b> App using your cellular network.</p>
	      </div>
	    </div>
	    <div class="app-store-container">
	      <span class="ios-appstore"><a class="icon-link" href="https://itunes.apple.com/us/app/my-doctor-online-ncal-only/id497468339?mt=8" target="_blank"></a></span>
        <span class="android-playstore"><a href="https://play.google.com/store/apps/details?id=org.kp.tpmg.preventivecare&hl=en_US" class="icon-link" target="_blank"></a></span>
	    </div>
	   </div>
 </div>
 <!-- UDP Test Results -->
 <!-- Block Message -->
 <div class="special-message-banner-container" id="blockerMessage">
    <div class="special-message-header">
      <span class="warning-icon"></span>
      <p class="warning-text">Video Visits does not support your browser.</p>
    </div>
    <div class="special-message-content">
      <div class="special-message-container">
        <div class="mdo-logo"></div>
        <div class="special-message">
          <p><b id="browser-block-message">Join on your mobile device using the My Doctor Online app, or use Chrome or Internet Explorer.</b></p>
        </div>
      </div>
      <div class="app-store-container">
        <span class="ios-appstore"><a class="icon-link" href="https://itunes.apple.com/us/app/my-doctor-online-ncal-only/id497468339?mt=8" target="_blank"></a></span>
        <span class="android-playstore"><a href="https://play.google.com/store/apps/details?id=org.kp.tpmg.preventivecare&hl=en_US" class="icon-link" target="_blank"></a></span>
      </div>
     </div>
 </div>
 <!-- Block Message -->
</div>
<!-- US31768 -->
<div class="my-meetings-no-meetings-grid my-meets-grid">
  <div id="landing-portal-ready" class="guestPortalReady my-meetings-grid" style="width:90%; margin-top:0px; font-family:Avenir Next, sans-serif;">
  
  </div>
  <div id="landing-portal-none" class="no-meetings-grid display-none-cls">
		<p>You do not have a video visit scheduled in the next 15 minutes. Please check back later.</p>
	</div>
</div>
<!-- US31768 -->
<input type="hidden" id="tz" value="<%=timezone%>" /> 
<input type="hidden" id="meetingCode" value="<%=meetingCode%>" /> 
<input type="hidden" id="patientLastName" value="<%=patientLastName%>" /> 
<input type="hidden" id="nocache" value="<%=nocache%>" /> 
<input type="hidden" id="meetingId" value="<%=meetingId%>" /> 
<input type="hidden" id="guestName" value="<%=guestName%>" /> 
