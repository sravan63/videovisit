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

<c:if test="${WebAppContext.totalmeetings>0}">
<div id="landing-portal-ready" style="font-family:Avenir Next, sans-serif;">
<c:forEach var="meeting" items="${WebAppContext.meetings}">

    <div class="landing-portal-single-container">
        <img src=${meeting.providerHost.imageUrl} alt="" />
        <div class="landing-portal-details" style="width:380px;">
            <div class="names-container-member" style="margin-left:0; margin-bottom:5px; font-weight:bold;">
                <span class="label">Patient:</span>
                <span class="names patient-guests"><span>${meeting.member.firstName} ${meeting.member.lastName}</span></span>
            </div>
            <div class="hidden timestamp">${meeting.scheduledTimestamp} </div>
            <span> Appointment Time </span>

            <div id="${meeting.meetingId}" class="host-name-container" style="margin:15px 0;">
              <span>
                <span>Host Clinician:</span>
                <span>
                    ${meeting.providerHost.firstName} ${meeting.providerHost.lastName}<c:if test="${not empty meeting.providerHost.title}">, ${meeting.providerHost.title}</c:if>
                </span>
              </span>
              <span class="accord-ctrl-container" style="float:right; display:none;">
                <a class="accord-ctrl more" href="#" style="text-decoration:none;"> more </a>
                <img class="accord-ctrl-caret" src="images/global/caret-kp-midBlue.png" height="8" width"8" style="float:none; width:10px;">
              </span>
            </div>
            <div class="accord-contents" style="display:none; margin-left:12px;">
                <c:if test="${meeting.participants != null && fn:length(meeting.participants) > 0}">
                  <div class="names-container-member">
                    <div class="label" style="float:none;">Additional Clinicians:</div>
                    <span class="names participants" style="margin-left:0;">
                      <c:forEach var="p" items="${meeting.participants}">
                       	<span>${p.firstName} ${p.lastName}<c:if test="${not empty p.title}">, ${p.title}</c:if></span>
                      </c:forEach>

                    </span>
                  </div>
                </c:if>

                <div class="names-container-member">
                  <c:if test="${meeting.caregivers != null && fn:length(meeting.caregivers) > 0}">
                    <div class="label" style="float:none;">Patient Guests:</div>
                    <span class="names patient-guests" style="margin-left:0;">
                      <c:forEach var="p" items="${meeting.caregivers}">
                        <span>${p.firstName} ${p.lastName}</span>
                      </c:forEach>
                    </span>
                  </c:if>
                </div>
            </div>            
           	<c:choose>
           		<c:when test="${not WebAppContext.isNonMember()}">
           			     <c:choose>
		                		<c:when test="${meeting.mmMeetingConId == null || fn:length(meeting.mmMeetingConId) <= 0}">
		                			<div style="margin-top:30px;">
		                				<span style="width: 48%; float:right; margin-bottom:20px;">
											<a class="btn" href="javascript:location.reload()" style="margin-bottom:0;">Refresh</a>
										</span>
		        			        	<span style="clear:both; display:inline-block;"> <p class="smallprint">This visit will be available to join within 15 minutes of the appointment time.</p> </span>
	      	   	   			   		</div>
	      	   	   			   	</c:when>
		                      	<c:otherwise>
		                      		<div style="overflow:auto; margin-top:30px;">
		                      			<span style="float:left; width:50%;"> <p class="smallprint"  style="text-align:left;">You may be joining before your clinician. Please be patient.</p> </span>
		                				<span style="float:right; width:48%;">
					                    <c:choose>
					                      <c:when test="${WebAppContext.member.mrn8Digit == meeting.member.mrn8Digit}">
					        			          <a id="joinNowId" class="btn joinNowButton" userName="${WebAppContext.member.lastName}, ${WebAppContext.member.firstName}" meetingid="${meeting.meetingId}" isproxymeeting="N" href="#" style="margin-bottom:0;">Join your visit</a> 
					                      </c:when>
					        			  <c:otherwise>
					        			          <a id="joinNowId" class="btn joinNowButton" userName="${WebAppContext.member.lastName}, ${WebAppContext.member.firstName}, (dummy@dummy.com)" meetingid="${meeting.meetingId}" isproxymeeting="Y" href="#" style="margin-bottom:0;">Join your visit</a> 
					                      </c:otherwise>
					        		    </c:choose>
				        		   		</span>
				        		   </div>
				        	   </c:otherwise>
			        	</c:choose>		                	            	
	           </c:when>
	      	   <c:otherwise>
	      	   	<div style="margin-top:30px;">
	      	   		<span> <p class="smallprint">Caregivers must sign out and use Temporary Access to join the visit.</p> </span>
	      	   	</div>
	      	   </c:otherwise>
	        </c:choose>
			 
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
    	<p>You have no video visits scheduled within the next 15 minutes.</p>
		<p>Please check back again later.</p>
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
