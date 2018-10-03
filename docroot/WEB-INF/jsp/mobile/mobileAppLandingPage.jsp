<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*" %>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.command.*" %>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.*" %>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix='fn' uri='http://java.sun.com/jsp/jstl/functions' %>

<%
	MeetingCommand.retrieveMeeting(request);
	String timezone = WebUtil.getCurrentDateTimeZone();
%>

<%@ include file="userPresentInMeetingModal.jsp" %>

<div class="page-content">
	<div class="visits patient" style="overflow:hidden;">
		<!--<h1>Video Visits You Can Join Now</h1>	-->
		<h1> Your Video Visits for Today</h1>
		<c:choose>
			<c:when test="${WebAppContext.totalmeetings>0}">
				<c:forEach var="meeting" items="${WebAppContext.myMeetings}">
			      <div class="landing-portal-single-container">
			    <!--US18235 Running Late: Patient My Meetings Notification UI start>-->
                     <c:if test="${meeting.isRunningLate == true}">
                     <!-- Kranti US19234 start -->
			           <div class="running-late-indicator" style="height:auto;"><span  style="font-size:16px;">We're sorry, your doctor is running late.<br/> New start time is </span><b style="font-size:20px;"class="running-late-timestamp-${meeting.meetingId}">${meeting.runLateMeetingTime}</b>.</div>
			         <!-- Kranti US19234 end -->
			            <script type="text/javascript">
			              var cls = ".running-late-timestamp-"+${meeting.meetingId};
			              var meetingTimestamp = $(cls).text();
			              var convertedTimestamp = convertTimestampToDate(meetingTimestamp, 'time_only');
			              $(cls).text(convertedTimestamp);
			            </script>
			          </c:if>
                    <!--US18235 Running Late: Patient My Meetings Notification UI end-->
			          <div class="meeting-details-container" style="font-size:14px;">
			            <div class="top" style="margin-top:30px;">
			              <div class="time-display">
			                <span class="hide-me timestamp_${meeting.meetingId}">${meeting.meetingTime} </span>
			                <span class="time_${meeting.meetingId}" style="font-size:24px; padding-bottom:3px;"></span>
			                <script type="text/javascript">
							// convert time stamp to time
								meetingTimestamp = $('.timestamp_' + ${meeting.meetingId}).text();
								convertedTimestamp = convertTimestampToDate(meetingTimestamp, 'time_only').toUpperCase();
								$('.time_' + ${meeting.meetingId}).append(convertedTimestamp);
							</script>
			              </div>
			              <span style="font-size:16px;">${meeting.member.firstName} ${meeting.member.lastName}</span>
			              <div class="accord-contents" style="display:block;margin-top:40px;">
			                  <c:if test="${meeting.participant != null && fn:length(meeting.participant) > 0 || meeting.caregiver != null && fn:length(meeting.caregiver) > 0}">
			                    <h2 class="label" style="float:none;font-size:16px;">Additional Participants</h2>
			                  </c:if>
			                  <c:if test="${meeting.participant != null && fn:length(meeting.participant) > 0}">
			                    <div class="names-container-member" style="margin:0px;">
			                      <span class="names participants" style="margin-left:0;font-size:16px;">
			                        <c:forEach var="p" items="${meeting.participant}">
			                          <span  style="font-size:16px;">${p.firstName} ${p.lastName}<c:if test="${not empty p.title}">, ${p.title}</c:if></span>
			                        </c:forEach>
			                      </span>
			                    </div>
			                  </c:if>
			                  <div class="names-container-member" style="margin:0px;">
			                    <c:if test="${meeting.caregiver != null && fn:length(meeting.caregiver) > 0}">
			                      <span class="names patient-guests" style="margin-left:0;font-size:16px;">
			                        <c:forEach var="p" items="${meeting.caregiver}">
			                          <span class="${p.lastName == 'audio_participant' ? 'guest-is-ap' : 'guest-is-not-ap'}" style="font-size:16px;">${p.firstName}<c:if test="${p.lastName != 'audio_participant'}"> ${p.lastName}</c:if></span>
			                        </c:forEach>
			                      </span>
			                    </c:if>
			                  </div>
			              </div>
			            </div>
			            <div class="middle">
				            <div class="image-holder">
				            	<img class="circle-image" src=${meeting.host.imageUrl} alt="" />
				            </div>
				            <div class="info-holder" style="float:left;margin-top:10px;">
				            	<span class="name-and-details camel-case">${meeting.host.firstName} ${meeting.host.lastName}<c:if test="${not empty meeting.host.title}">, ${meeting.host.title}</c:if></span><br>
				              <span class="department-details camel-case">${meeting.host.departmentName}</span>
				            </div>
			            </div>
			            <div class="bottom">
			              	<div class="launch-button-handler only-tablets" style="float: none; box-shadow: none;padding:0px; min-height: 60px;text-align:right;">
                          		<button id="joinNowId" class="button-launch-visit btn joinNowButton" megaMeetingUrl="${WebAppContext.megaMeetingMobileURL}" megameetingid="${meeting.meetingVendorId}" lastname="${meeting.member.lastName}" firstname="${meeting.member.firstName}" meetingId="${meeting.meetingId}">Join your visit</button>
	                        </div>
	                        <div class="launch-button-handler only-handsets">
	                        	<button id="joinNowId" class="button-launch-visit btn joinNowButton" megaMeetingUrl="${WebAppContext.megaMeetingMobileURL}" megameetingid="${meeting.meetingVendorId}" lastname="${meeting.member.lastName}" firstname="${meeting.member.firstName}" meetingId="${meeting.meetingId}">Join your visit</button>
	                        </div>
	                        <p class="patient-msg">You may be joining before your clinician. Please be patient.</p>
			            </div>
			          </div>
			      </div>
			  </c:forEach>
				
			</c:when>
			<c:otherwise>
			<!--  If no meetings are present -->
				<div class="alert alert-hero alert-no-visits" style="background-color:#FFFFFF; box-shadow:none;">
					<div class="alert-hero-message">
						<div class="image" style="background:url('images/mobile/video-icon-gray.png') no-repeat center; margin:-10px 15px 0 0; background-size:contain;"></div>
						<p style=""><strong>You have no meetings in the next 15 minutes.</strong></p>
					</div>
				</div>
				
				<!-- Refresh Page button and Time stamp - Start -->
				<div style="min-height:45px; padding-left:32px;">
					<div style="float:left; padding-top:5px;">
						<p id="lastUpdatedText"></p>
						<p id="lastUpdatedTime">
							<script type="text/javascript">
								refreshTimestamp();
							</script>
						</p>
					</div>
					<!-- US16197 hiding refresh button in KPPC Mobile app-->
					<!-- <div class="refresh_button" style="float:right;">
						<button style="width:136px; height:45px; color:#FFFFFF; background-color:#0061A9; padding:10px 5px; border-radius:4px; font-size:16px;"> Refresh Page </button>
					</div> -->
					<!-- US16197 hiding refresh button in KPPC Mobile app-->
				</div>
				<!-- Refresh Page button and Time stamp - END -->
			</c:otherwise>

		</c:choose>
	</div>

	<div style="font-weight:bold; text-align:left; margin-top:30px;">
		<p>Please make sure you have a strong Wi-Fi or 4G connection</p>
	</div>

	<!-- Fake Footer - to adjust the length of the Background image -->
	<div style="visibility:none; margin:100px 0;">
		<br/>
		<br/>
		<br/>
		<br/>
	</div>
	<!-- Fake Footer - to adjust the length of the Background image -->

</div>
<script>
	$('.guest-is-ap').each(function(e){
		if($(this).children('a').length>0){
			var actualNum = $(this).find('a').html();
			var tempNum = $(this).find('a').html().trim().split('').reverse().join('').substr(0,10).split('').reverse().join('')+'';
			tempNum = tempNum.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
			$(this).html('<a href="tel:'+actualNum+'">'+tempNum+'</a>');
		}else{
			var tempNum = $(this).html().trim().split('').reverse().join('').substr(0,10).split('').reverse().join('')+'';
			tempNum = tempNum.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
			$(this).html(tempNum);	
		}		
	});
</script>