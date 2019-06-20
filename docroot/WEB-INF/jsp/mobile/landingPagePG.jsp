<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*" %>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.command.*" %>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.*" %>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix='fn' uri='http://java.sun.com/jsp/jstl/functions' %>


<%
	MeetingCommand.retrieveMeetingForCaregiver(request, response);
	String meetingHash = request.getParameter("meetingCode");
	String timezone = WebUtil.getCurrentDateTimeZone();
	
	
%>
<!-- Refresh page button and time stamp - to be reworked -->
				<div class="refresh-page" onClick="window.location.reload();">
		<h2>Tap here to refresh this page</h2>
			<p id="lastRefreshTimeId">
				<script type="text/javascript">
					refreshTimestamp();
				</script>
			</p>
		</div>

<!-- Refresh page button and timestamp - END -->

<div class="page-content">
	<div class="visits patient">
		<h1> Your Video Visits for Today </h1>
		<p id="globalError" class="globalfailmessage hide-me" style="background-color:#686A6C;"></p>
		<c:choose>
			<c:when test="${WebAppContext.totalmeetings>0}">
				<!--US15510 start -->
				<c:forEach var="meeting" items="${WebAppContext.myMeetings}">
					<div class="mobile-patient-guest-meeting-container">
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
			              <div class="accord-contents" style="display:block;margin-top:45px;">
			                  <c:if test="${meeting.participant != null && fn:length(meeting.participant) > 0 || meeting.caregiver != null && fn:length(meeting.caregiver) > 0 || meeting.sipParticipants != null && fn:length(meeting.sipParticipants) > 0}">
			                    <h2 class="label" style="float:none;font-size:16px;color:#333333">Additional Participants</h2>
			                  </c:if>
			                  <c:if test="${meeting.participant != null && fn:length(meeting.participant) > 0}">
			                    <div class="names-container-member" style="margin:0px;">
			                      <span class="names participants" style="margin-left:0;font-size:16px;">
			                        <c:forEach var="p" items="${meeting.participant}">
			                          <span style="font-size:16px;">${p.firstName} ${p.lastName}<c:if test="${not empty p.title}">, ${p.title}</c:if></span>
			                        </c:forEach>
			                      </span>
			                    </div>
			                  </c:if>
			                  <div class="names-container-member" style="margin:0px;">
			                   <c:choose>
			                    <c:when test="${meeting.caregiver != null && fn:length(meeting.caregiver) > 0 && meeting.vendor!='pexip'} ">
			                      	<span class="names patient-guests" style="margin-left:0;">
			                      		<c:set var="phoneNumsCount" value="0" scope="page" />
				                        <c:forEach var="p" items="${meeting.caregiver}">
				                        	<c:if test="${p.lastName == 'audio_participant'}">
				                        		<c:set var="phoneNumsCount" value="${phoneNumsCount + 1}" scope="page"/>
				                        		<span class="guest-is-ap" style="font-size:16px;" firstnameattr="${p.firstName}">Phone ${phoneNumsCount}</span>
				                        	</c:if>
				                        	<c:if test="${p.lastName != 'audio_participant'}">
				                        		<span class="guest-is-not-ap" style="font-size:16px;">${p.firstName} ${p.lastName}</span>
				                        	</c:if>
				                        </c:forEach>
			                      	</span>
			                    </c:when>
			                    <c:when test="${meeting.vendor == 'pexip'}">
			                    <span class="names patient-guests" style="margin-left:0;font-size:16px;">
			                    <c:set var="phoneNumsCount" value="0" scope="page" />
			                    <c:if test="${meeting.caregiver != null && fn:length(meeting.caregiver) > 0}">
			                    <c:forEach var="p" items="${meeting.caregiver}">
 								<span class="guest-is-not-ap" style="font-size:16px;">${p.firstName} ${p.lastName}</span>
 								</c:forEach>
			                   </c:if>
			                   <c:if test="${meeting.sipParticipants != null && fn:length(meeting.sipParticipants) > 0}">
			                   <c:forEach var="p" items="${meeting.sipParticipants}">	
			                   <c:set var="phoneNumsCount" value="${phoneNumsCount + 1}" scope="page"/>
			                    <span class="guest-is-ap-pexip" style="font-size:16px;" firstnameattr="${p.destination}">${p.displayName}</span>
			                    </c:forEach>
			                   </c:if>
			                    </span>
			                    </c:when>
			                </c:choose>
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
							<c:if test="${meeting.caregiver != null && fn:length(meeting.caregiver) > 0}">
								<c:forEach var="p" items="${meeting.caregiver}">
									<c:if test="${p.careGiverMeetingHash != null && fn:length(p.careGiverMeetingHash) > 0}">		
										<c:if test="${p.careGiverMeetingHash == param.meetingCode}">
											<div class="launch-button-handler only-tablets" style="float: none; box-shadow: none;padding:0px; min-height: 60px;text-align:right;">
					                          	<button class="button-launch-visit-pg btn joinNowButton" megaMeetingUrl="${WebAppContext.megaMeetingMobileURL}" megameetingid="${meeting.meetingVendorId}" lastname="${p.lastName}" firstname="${p.firstName}" email="${p.emailAddress}">Join your visit</button>
						                    </div>
						                    <div class="launch-button-handler only-handsets">
						                        <button class="button-launch-visit-pg btn joinNowButton" megaMeetingUrl="${WebAppContext.megaMeetingMobileURL}" megameetingid="${meeting.meetingVendorId}" lastname="${p.lastName}" firstname="${p.firstName}" email="${p.emailAddress}">Join your visit</button>
						                    </div>
										</c:if>
									</c:if>
								</c:forEach>
							</c:if>
			                <p class="patient-msg">You may be joining before your clinician. Please be patient.</p>
			            </div>
			          </div>
			      	</div>
				<!--US15510 end -->
				</c:forEach>
				
			</c:when>
			<c:otherwise>
	        	<!--  If no meetings are present -->
				
					<div class="alert alert-hero alert-no-visits">
						<div class="alert-hero-message">
						<div class="image"></div>
							<p><strong>You have no Video Visits scheduled for Today</strong></p>
						</div>
					</div>
		
	    	</c:otherwise>
			
		</c:choose>
			
		<c:choose>
			<c:when test="${WebAppContext.myMeetings.get(0).vendor == null}">
				<%@ include file="common/informationTwopg.jsp" %>
			</c:when>
		</c:choose>
	</div>
</div>
<script>
	$('.guest-is-ap').each(function(e){
		if($(this).children('a').length>0){
			//ios will add anchor tag automatically based on number
			var actualNum = $(this).find('a').html();
			var tempNum = $(this).find('a').html().trim().split('').reverse().join('').substr(0,10).split('').reverse().join('')+'';
			tempNum = tempNum.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
			$(this).html('<a href="tel:'+actualNum+'">'+tempNum+'</a>');
		}else{
			//desktop will not add any anchor tag inside span
			var tempNum = $(this).html().trim().split('').reverse().join('').substr(0,10).split('').reverse().join('')+'';
			tempNum = tempNum.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
			$(this).html(tempNum);	
		}		
	});
</script>