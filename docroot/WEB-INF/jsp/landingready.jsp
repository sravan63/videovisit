<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*" %>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.command.*" %>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.*" %>
<%-- <%@ page import="org.kp.tpmg.videovisit.webserviceobject.xsd.*" %> --%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix='fn' uri='http://java.sun.com/jsp/jstl/functions' %>
<%@ page import="javax.servlet.*" %>
<%@ page import="javax.servlet.http.*" %>

<input type="hidden" id="kpKeepAliveUrl" value="${WebAppContext.kpKeepAliveUrl}" />
<!--US31767-->
<input type="hidden" id="isNonMember" value="${WebAppContext.isNonMember()}" />
<input type="hidden" id="memberDOmrn" value="${WebAppContext.memberDO.mrn}" />
<input type="hidden" id="memberDOlastName" value="${WebAppContext.memberDO.lastName}" />
<input type="hidden" id="memberDOfirstName" value="${WebAppContext.memberDO.firstName}" />
<input type="hidden" id="memberDOmiddleName" value="${WebAppContext.memberDO.middleName}" />
<!--US31767-->
<input type="hidden" id="caregiverId" value="${WebAppContext.videoVisit.caregiverId}" />
<input type="hidden" id="meetingCode" value="${WebAppContext.videoVisit.meetingCode}" />
<input type="hidden" id="guestName" value="${WebAppContext.videoVisit.guestName}" />

<input type="hidden" id="blockChrome" value="${WebAppContext.blockChrome}" />
<input type="hidden" id="blockFF" value="${WebAppContext.blockFF}" />
<input type="hidden" id="blockEdge" value="${WebAppContext.blockEdge}" />
<input type="hidden" id="blockSafari" value="${WebAppContext.blockSafari}" />
<input type="hidden" id="blockPexipIE" value="${WebAppContext.blockPexipIE}" />
<input type="hidden" id="blockSafariVersion" value="${WebAppContext.blockSafariVersion}" />
<input type="hidden" id="blockPexipSafariVersion" value="${WebAppContext.pexBlockSafariVer}" />
<input type="hidden" id="blockChromeVersion" value="${WebAppContext.pexBlockChromeVer}" />
<input type="hidden" id="blockFirefoxVersion" value="${WebAppContext.pexBlockFirefoxVer}" />
<input type="hidden" id="blockEdgeVersion" value="${WebAppContext.pexBlockEdgeVer}" />
<%

  //MeetingCommand.retrieveActiveMeetingsForMemberAndProxies(request);
  String timezone = WebUtil.getCurrentDateTimeZone();

%>

<div class="sub-banner">
  <div class="heading">Your Video Visits for Today</div>
  <div class="links">
  <!--US31767-->
    <a href="javascript:refreshGrid()">Refresh page</a>
  <!--US31767-->
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
<!--US31767-->
<div class="my-meetings-no-meetings-grid my-meets-grid">
  <div id="landing-portal-ready" class="my-meetings-grid" style="width:90%; margin-top:0px; font-family:Avenir Next, sans-serif;">
  
  </div>
  <div id="landing-portal-none" class="no-meetings-grid display-none-cls">
        <p>You have no meetings in the next 15 minutes.</p>
  </div>
</div>

<div id="user-in-meeting-modal"  title="User Already Present In Meeting">
  <div  class="modalWrapper">
    <h2><span>User already signed on</span></h2>
    <p>
      You have already joined this video visit from another device. You must first sign off from the other device before attempting to join this visit here.
    </p>
    <div class="pagination">
      <input class="button" id="user-in-meeting-modal-ok"  type="button"  value="OK" />
    </div>
  </div>
</div>

<div id="join-meeting-fail-modal"  title="Join Meeting Error">
  <div class="modalWrapper" style="text-align: center;margin-top: 15px">
    <p style="font-weight: 500; font-size: 20px;">Oops!</p><div><p style="margin-top: 15px;font-size: 16px;margin-left: 20px;margin-right: 20px;">We're sorry. There is a problem with the connection.</p><p style="margin-top: 15px; margin-bottom: 25px;font-size: 16px;margin-left: 20px;margin-right: 20px;">Please try refreshing.
    </p></div>
    <div class="pagination">
      <input class="button" id="join-meeting-fail-modal-cancel"  type="button"  value="Cancel"/>
      <input class="button" id="join-meeting-fail-modal-refresh"  type="button"  value="Refresh"/>
    </div>
  </div>
</div>
  
<input type="hidden" id="tz" value="<%=timezone%>" />
