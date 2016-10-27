<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*" %>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.command.*" %>
<%@ page import="org.kp.tpmg.videovisit.webserviceobject.xsd.*" %>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.*" %>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix='fn' uri='http://java.sun.com/jsp/jstl/functions' %>

<%
	MeetingCommand.retrieveMeeting(request, response);
	String timezone = WebUtil.getCurrentDateTimeZone();
%>

<%@ include file="userPresentInMeetingModal.jsp" %>

<div class="page-content" style="width:100%; height:100%; margin:0; padding:0;">

	<div class="visits patient" style="padding:6px; overflow:hidden;">
		<!--<h1>Video Visits You Can Join Now</h1>	-->
		<h1 style="text-align: left; border-bottom: 1px solid #D4D4D5; padding: 20px 10px;font-size: 25px;line-height: 30px;color: #333333;"> Your Video Visits for Today </h1>
		
		<c:choose>
			<c:when test="${WebAppContext.totalmeetings>0}">
				<c:forEach var="meeting" items="${WebAppContext.meetings}">
			      <div class="landing-portal-single-container">
			          <div class="meeting-details-container" style="font-size:14px;">
			            <div class="top">
			              <div class="time-display">
			                <span class="hide-me timestamp_${meeting.meetingId}">${meeting.scheduledTimestamp} </span>
			                <span class="time_${meeting.meetingId}" style="font-size:25px; padding-bottom:3px;"></span>
			                <script type="text/javascript">
							// convert time stamp to time
								meetingTimestamp = $('.timestamp_' + ${meeting.meetingId}).text();
								convertedTimestamp = convertTimestampToDate(meetingTimestamp, 'time_only').toUpperCase();
								$('.time_' + ${meeting.meetingId}).append(convertedTimestamp);
							</script>
			              </div>
			              <span>${meeting.member.firstName} ${meeting.member.lastName}</span>
			              <div class="accord-contents" style="display:block;margin-top:30px;">
			                  <c:if test="${meeting.participants != null && fn:length(meeting.participants) > 0 || meeting.caregivers != null && fn:length(meeting.caregivers) > 0}">
			                    <h2 class="label" style="float:none;">Additional Participants</h2>
			                  </c:if>
			                  <c:if test="${meeting.participants != null && fn:length(meeting.participants) > 0}">
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
			            <div class="middle">
				            <div class="image-holder">
				            	<img class="circle-image" src=${meeting.providerHost.imageUrl} alt="" />
				            </div>
				            <div class="info-holder">
				            	<span class="name-and-details">${meeting.providerHost.firstName} ${meeting.providerHost.lastName}<c:if test="${not empty meeting.providerHost.title}">, ${meeting.providerHost.title}</c:if></span><br>
				              <span class="department-details">${meeting.providerHost.departmentName}</span>
				            </div>
			            </div>
			            <div class="bottom">
			              	<div class="launch-button-handler only-tablets" style="float: none; box-shadow: none;padding:0px; min-height: 60px;text-align:right;">
                          		<button id="joinNowId" class="button-launch-visit btn joinNowButton" megaMeetingUrl="${WebAppContext.megaMeetingMobileURL}" megameetingid="${meeting.mmMeetingConId}" lastname="${meeting.member.lastName}" firstname="${meeting.member.firstName}" meetingId="${meeting.meetingId}" style="margin-bottom:0;">Join your visit</button>
	                        </div>
	                        <div class="launch-button-handler only-handsets">
	                        	<button id="joinNowId" class="button-launch-visit btn joinNowButton" megaMeetingUrl="${WebAppContext.megaMeetingMobileURL}" megameetingid="${meeting.mmMeetingConId}" lastname="${meeting.member.lastName}" firstname="${meeting.member.firstName}" meetingId="${meeting.meetingId}" style="margin-bottom:0;">Join your visit</button>
	                        </div>
	                        <p class="" style="margin-top:20px;">You may be joining before your clinician. Please be patient.</p>
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
						<p style=""><strong>You have no Video Visits scheduled for Today</strong></p>
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
					<div class="refresh_button" style="float:right;">
						<button style="width:136px; height:45px; color:#FFFFFF; background-color:#0061A9; padding:10px 5px; border-radius:4px; font-size:16px;"> Refresh Page </button>
					</div>
				</div>
				<!-- Refresh Page button and Time stamp - END -->
			</c:otherwise>

		</c:choose>
	</div>

	<div style="font-weight:bold; text-align:left; margin-top:60px; padding:0 32px;">
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