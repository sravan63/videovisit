<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*" %>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.command.*" %>
<%@ page import="org.kp.tpmg.videovisit.webserviceobject.xsd.*" %>

<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix='fn' uri='http://java.sun.com/jsp/jstl/functions' %>


<%
	MeetingCommand.retrieveMeetingForCaregiver(request, response);
	String meetingHash = request.getParameter("meetingCode");
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
		<h1>Visits you can join now</h1>
		<p id="globalError" class="globalfailmessage hide-me"></p>
		<c:choose>
			<c:when test="${WebAppContext.totalmeetings>0}">
				<c:forEach var="meeting" items="${WebAppContext.meetings}">
			
					<div class="meeting well">
								
						<div class="pic-frame">
							<div class="pic">
								<img src="${meeting.providerHost.imageUrl}">
							</div>
						</div>

						<div class="launch-button-handler only-tablets">
							<button class="button-launch-visit-pg button-launch-visit" megaMeetingUrl="${WebAppContext.megaMeetingMobileURL}" megameetingid="${meeting.mmMeetingConId}" lastname="${p.lastName}" firstname="${p.firstName}" email="${p.emailAddress}">Launch Visit</button>
						</div>

						<div class="meeting-block-handler">

							<div class="hide-me timestamp_${meeting.meetingId}">${meeting.scheduledTimestamp}</div>
							<p class="time">Scheduled for <strong><span class="time_${meeting.meetingId}"></span></strong></p>
							<script type="text/javascript">
							// convert time stamp to time
								meetingTimestamp = $('.timestamp_' + ${meeting.meetingId}).text();
								convertedTimestamp = convertTimestampToDate(meetingTimestamp, 'time_only');
								$('.time_' + ${meeting.meetingId}).append(convertedTimestamp);
							
							</script>
							<p class="host-name">
								${meeting.providerHost.firstName} ${meeting.providerHost.lastName}
									<c:if test="${not empty meeting.providerHost.title}">
										, ${meeting.providerHost.title}
									</c:if>
							</p>
							<p class="time">
								${meeting.member.firstName} ${meeting.member.lastName}
							</p>
							<c:if test="${meeting.caregivers != null && fn:length(meeting.caregivers) > 0}">
									<c:forEach var="p" items="${meeting.caregivers}">
										<c:if test="${p.meetingHash != null && fn:length(p.meetingHash) > 0}">
											
											<c:if test="${p.meetingHash == param.meetingCode}">
												<button class="button-launch-visit-pg only-handsets" megaMeetingUrl="${WebAppContext.megaMeetingMobileURL}" megameetingid="${meeting.mmMeetingConId}" lastname="${p.lastName}" firstname="${p.firstName}" email="${p.emailAddress}">Launch Visit</button>
											</c:if>
										</c:if>
									</c:forEach>
								</c:if>
						</div>
					</div>

				</c:forEach>
				
				<div class="alert hideable">
					<p><strong>For security reasons, only visits scheduled for the next 15 minutes are being displayed.</strong></p>
				</div>
			</c:when>
			<c:otherwise>
	        	<!--  If no meetings are present -->
				
					<div class="alert alert-hero alert-no-visits">
						<div class="alert-hero-message">
						<div class="image"></div>
							<p><strong>You have no visits scheduled within the next 15 minutes.</strong> Please check back again later.</p>
						</div>
					</div>
		
	    	</c:otherwise>
			
		</c:choose>
			
		<ol class="well instructions">
		<h2>Be ready for your video visit:</h2>
			<li><div class="img-app"></div><span>Install the Video Visits mobile app. <a class="" href="https://itunes.apple.com/us/app/vci-mobile/id477260861?mt=8#" class="">Get it now</a></span></li>
			<li><div class="img-connection"></div><span>Make sure you have a good connection.</span></li>
			<li><div class="img-headphones"></div><span>For best results, use headphones during the call.</span></li>
		</ol>
	</div>
</div>