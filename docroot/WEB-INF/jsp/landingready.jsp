<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*" %>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.command.*" %>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.*" %>
<%@ page import="org.kp.tpmg.videovisit.webserviceobject.xsd.*" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix='fn' uri='http://java.sun.com/jsp/jstl/functions' %>
<%@ page import="javax.servlet.*" %>
<%@ page import="javax.servlet.http.*" %>

<input type="hidden" id="kpKeepAliveUrl" value="${WebAppContext.kpKeepAliveUrl}" /> 
<%

	MeetingCommand.retrieveActiveMeetingsForMemberAndProxies(request, response);
	String timezone = WebUtil.getCurrentDateTimeZone();

%>

<div class="sub-banner">
  <h1>Your Video Visits for Today</h1>
  <div class="links">
    <a href="javascript:location.reload()">Refresh page</a>
    <span>|</span>
    <a href="mdohelp.htm" target="_blank">Help</a>
  </div>
</div>

<c:if test="${WebAppContext.totalmeetings>0}">
  <div id="landing-portal-ready" style="width:90%; margin-top:0px; font-family:Avenir Next, sans-serif;">
  <c:forEach var="meeting" items="${WebAppContext.meetings}">
      <div class="landing-portal-single-container">
          <div class="meeting-details-container" style="font-size:14px;">
            <div class="left">
              <h1 class="">
                <span class="hidden timestamp">${meeting.scheduledTimestamp} </span>
                <span></span>
              </h1>
              <span>${meeting.member.firstName} ${meeting.member.lastName}</span>
              <div class="accord-contents" style="display:block;">
                  <c:if test="${meeting.participants != null && fn:length(meeting.participants) > 0}">
                  <h2 class="label" style="float:none;margin:10px 0px;">Additional Participants</h2>
                    <div class="names-container-member" style="margin:0px;">
                      <span class="names participants" style="margin-left:0;">
                        <c:forEach var="p" items="${meeting.participants}">
                          <span>${p.firstName} ${p.lastName}<c:if test="${not empty p.title}">, ${p.title}</c:if></span>
                        </c:forEach>
                      </span>
                    </div>
                  </c:if>
                  <div class="names-container-member" style="margin:0px;">
                    <c:if test="${meeting.caregivers != null && fn:length(meeting.caregivers) > 0}">
                      <span class="names patient-guests" style="margin-left:0;">
                        <c:forEach var="p" items="${meeting.caregivers}">
                          <span>${p.firstName} ${p.lastName}</span>
                        </c:forEach>
                      </span>
                    </c:if>
                  </div>
              </div>
            </div>
            <div class="center">
              <img src=${meeting.providerHost.imageUrl} alt="" />
              <span class="name-and-details">${meeting.providerHost.firstName} ${meeting.providerHost.lastName}, ${meeting.providerHost.title}</span>
              <span class="department-details">${meeting.providerHost.departmentName}</span>
            </div>
            <div class="right">
              <c:choose>
                <c:when test="${not WebAppContext.isNonMember()}">
                   <c:choose>
                      <c:when test="${meeting.mmMeetingConId == null || fn:length(meeting.mmMeetingConId) <= 0}">
                        <div style="margin-top:5px;">
                          <p style="">
                              <button class="btn not-available" href="javascript:location.reload()" style="margin-bottom:0;">Join your visit</button> 
                          </p>
                          <p class="" style="margin-top:10px;">Your visit will be available within 15 minutes of the start time.</p>
                        </div>
                        </c:when>
                          <c:otherwise>
                            <div style="margin-top:5px;">
                                <c:choose>
                                  <c:when test="${WebAppContext.member.mrn8Digit == meeting.member.mrn8Digit}">
                                    <p class="">
                                      <button id="joinNowId" class="btn joinNowButton" userName="${WebAppContext.member.lastName}, ${WebAppContext.member.firstName}, (dummy@dummy.com)" meetingid="${meeting.meetingId}" isproxymeeting="Y" href="#" style="margin-bottom:0;">Join your visit</button> 
                                    </p>
                                    <p class="" style="margin-top:10px;">You may be joining before your clinician. Please be patient.</p>
                                  </c:when>
                                  <c:otherwise>
                                     <p style="">
                                        <button id="joinNowId" class="btn joinNowButton" userName="${WebAppContext.member.lastName}, ${WebAppContext.member.firstName}, (dummy@dummy.com)" meetingid="${meeting.meetingId}" isproxymeeting="Y" href="#" style="margin-bottom:0;">Join your visit</button> 
                                    </p>
                                    <p class="" style="margin-top:10px;">You may be joining before your clinician. Please be patient.</p>
                                  </c:otherwise>
                                </c:choose>
                         </div>
                   </c:otherwise>
                  </c:choose>                                   
               </c:when>
                <c:otherwise>
                   <c:choose>
                        <c:when test="${meeting.mmMeetingConId == null || fn:length(meeting.mmMeetingConId) <= 0}">
                          <div style="margin-top:30px;">
                            <p style="">
                                <button class="btn not-available" href="javascript:location.reload()" style="margin-bottom:0;">Join your visit</button> 
                            </p>
                            <p class="" style="margin-top:10px;">Your visit will be available within 15 minutes of the start time.</p>
                          </div>
                        </c:when>
                        <c:otherwise>
                          <div style="margin-top:5px;">
                            <p style="">
                                <button id="joinNowId" class="btn joinNowButton" userName="${WebAppContext.member.lastName}, ${WebAppContext.member.firstName}, (dummy@dummy.com)" meetingid="${meeting.meetingId}" isproxymeeting="Y" href="#" style="margin-bottom:0;">Join your visit</button> 
                            </p>
                            <p class="" style="margin-top:10px;">You may be joining before your clinician. Please be patient.</p>
                          </div>
                        </c:otherwise>
                     </c:choose>                      
                 </c:otherwise>
            </c:choose>
            </div>
            <p class="error error-guest-login" id="error_label_${meeting.meetingId}" style="margin-top:20px; font-size:16px;"></p>
          </div>
      </div>

     <script type="text/javascript">
        if(${meeting.participants != null} || ${meeting.caregivers != null}){
            $('#${meeting.meetingId}').find($(".accord-ctrl-container")).css("display", "inline-block");
        } else{
            $('#${meeting.meetingId}').find($(".accord-ctrl-container")).css("display", "none");
        }
      </script>

  </c:forEach>
  </div>
</c:if>

<c:if test="${WebAppContext.totalmeetings<=0}">

  <div id="landing-portal-none">
      <p>You have no Video Visits scheduled for Today</p>
  </div>

</c:if>
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
