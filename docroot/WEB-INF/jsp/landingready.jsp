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
  <div class="heading">Your Video Visits for Today</div>
  <div class="links">
    <a href="javascript:location.reload()">Refresh page</a>
    <span>|</span>
    <a href="mdohelp.htm" target="_blank">Help</a>
  </div>
</div>

<c:if test="${WebAppContext.totalmeetings>0}">
  <div id="landing-portal-ready" style="width:90%; margin-top:0px; font-family:Avenir Next, sans-serif;">
  <c:forEach var="meeting" items="${WebAppContext.myMeetings}">
      <div class="landing-portal-single-container">
          <div class="meeting-details-container" style="font-size:14px;">
            <div class="left">
              <div class="time-display">
                <span class="hidden timestamp">${meeting.meetingTime} </span>
                <span></span>
              </div>
              <span>${meeting.member.firstName} ${meeting.member.lastName}</span>
              <div class="accord-contents" style="display:block;margin-top:30px;">
                  <c:if test="${meeting.participant != null && fn:length(meeting.participant) > 0 || meeting.caregiver != null && fn:length(meeting.caregiver) > 0}">
                    <h2 class="label" style="float:none;margin-bottom: 15px;">Additional Participants</h2>
                  </c:if>
                  <c:if test="${meeting.participant != null && fn:length(meeting.participant) > 0}">
                    <div class="names-container-member" style="margin:0px;">
                      <span class="names participants" style="margin-left:0;">
                        <c:forEach var="p" items="${meeting.participant}">
                          <span>${p.firstName} ${p.lastName}<c:if test="${not empty p.title}">, ${p.title}</c:if></span>
                        </c:forEach>
                      </span>
                    </div>
                  </c:if>
                  <div class="names-container-member" style="margin:0px;">
                    <c:if test="${meeting.caregiver != null && fn:length(meeting.caregiver) > 0}">
                      <span class="names patient-guests" style="margin-left:0;">
                        <c:forEach var="p" items="${meeting.caregiver}">
                          <span>${p.firstName} ${p.lastName}</span>
                        </c:forEach>
                      </span>
                    </c:if>
                  </div>
              </div>
            </div>
            <div class="center">
              <img class="circle-image" src=${meeting.host.imageUrl} alt="" />
              <span class="name-and-details">${meeting.host.firstName} ${meeting.host.lastName}, ${meeting.host.title}</span>
              <span class="department-details">${meeting.host.departmentName}</span>
            </div>
            <div class="right">
              <c:choose>
                <c:when test="${not WebAppContext.isNonMember()}">
                   <c:choose>
                      <c:when test="${meeting.meetingVendorId == null || fn:length(meeting.meetingVendorId) <= 0}">
                        <div style="">
                          <p style="">
                              <button class="btn not-available" href="javascript:location.reload()" style="margin-bottom:0;">Join your visit</button> 
                          </p>
                          <p class="" style="margin-top:20px;">Your visit will be available within 15 minutes of the start time.</p>
                        </div>
                        </c:when>
                          <c:otherwise>
                            <div style="">
                                <c:choose>
                                  <c:when test="${WebAppContext.memberDO.mrn == meeting.member.mrn}">
                                    <p class="">
                                      <button id="joinNowId" class="btn joinNowButton" userName="${WebAppContext.memberDO.lastName}, ${WebAppContext.memberDO.firstName}" meetingid="${meeting.meetingId}" isproxymeeting="N" href="#" style="margin-bottom:0;">Join your visit</button> 
                                    </p>
                                    <p class="" style="margin-top:20px;">You may be joining before your clinician. Please be patient.</p>
                                  </c:when>
                                  <c:otherwise>
                                     <p style="">
                                        <button id="joinNowId" class="btn joinNowButton" userName="${WebAppContext.memberDO.lastName}, ${WebAppContext.memberDO.firstName}, (dummy@dummy.com)" meetingid="${meeting.meetingId}" isproxymeeting="Y" href="#" style="margin-bottom:0;">Join your visit</button> 
                                    </p>
                                    <p class="" style="margin-top:20px;">You may be joining before your clinician. Please be patient.</p>
                                  </c:otherwise>
                                </c:choose>
                         </div>
                   </c:otherwise>
                  </c:choose>                                   
               </c:when>
                <c:otherwise>
                   <c:choose>
                        <c:when test="${meeting.meetingVendorId == null || fn:length(meeting.meetingVendorId) <= 0}">
                          <div style="">
                            <p style="">
                                <button class="btn not-available" href="javascript:location.reload()" style="margin-bottom:0;">Join your visit</button> 
                            </p>
                            <p class="" style="margin-top:20px;">Your visit will be available within 15 minutes of the start time.</p>
                          </div>
                        </c:when>
                        <c:otherwise>
                          <div style="">
                            <p style="">
                                <button id="joinNowId" class="btn joinNowButton" userName="${WebAppContext.memberDO.lastName}, ${WebAppContext.memberDO.firstName}, (dummy@dummy.com)" meetingid="${meeting.meetingId}" isproxymeeting="Y" href="#" style="margin-bottom:0;">Join your visit</button> 
                            </p>
                            <p class="" style="margin-top:20px;">You may be joining before your clinician. Please be patient.</p>
                          </div>
                        </c:otherwise>
                     </c:choose>                      
                 </c:otherwise>
            </c:choose>
            </div>
            <p class="error error-guest-login" id="error_label_${meeting.meetingId}" style="margin-bottom:25px; font-size:16px;"></p>
          </div>
      </div>

     <script type="text/javascript">
        if(${meeting.participant != null} || ${meeting.caregiver != null}){
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
