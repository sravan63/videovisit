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
<!--US31767-->
<input type="hidden" id="caregiverId" value="${WebAppContext.videoVisit.caregiverId}" />
<input type="hidden" id="meetingCode" value="${WebAppContext.videoVisit.meetingCode}" />
<input type="hidden" id="guestName" value="${WebAppContext.videoVisit.guestName}" />
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
</div>
<!--US31767-->
<!-- UDP Test Results -->
<div class="udp-test-container">
  <div class="upd-test-header">
    <span class="warning-icon"></span>
    <p class="warning-text">Unable to establish a connection</p>
  </div>
  <div class="upd-test-content">
    <div class="udp-message-container">
      <div class="mdo-logo"></div>
      <div class="udp-message">
        <p>Join on your mobile device using</p>
        <p><b>My Doctor Online</b> App</p>
      </div>
    </div>
    <div class="app-store-container">
      <span class="ios-appstore"></span><span class="android-playstore">
    </div>
  </div>
</div>
<!-- UDP Test Results -->
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
