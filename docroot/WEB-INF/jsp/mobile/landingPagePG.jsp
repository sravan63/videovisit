<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*" %>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.command.*" %>
<%@ page import="org.kp.tpmg.videovisit.webserviceobject.xsd.*" %>
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
		<h1>Video Visits You Can Join Now</h1>
		<p id="globalError" class="globalfailmessage hide-me" style="background-color:#686A6C;"></p>
		<c:choose>
			<c:when test="${WebAppContext.totalmeetings>0}">
				
				<c:forEach var="meeting" items="${WebAppContext.myMeetings}">
			
					<div class="meeting well">
								
						<div class="pic-frame">
							<div class="pic">
								<img src="${meeting.host.imageUrl}">
							</div>
						</div>

						<div class="launch-button-handler only-tablets">
							<c:if test="${meeting.caregiver != null && fn:length(meeting.caregiver) > 0}">
								<c:forEach var="p" items="${meeting.caregiver}">
									<c:if test="${p.careGiverMeetingHash != null && fn:length(p.careGiverMeetingHash) > 0}">
										
										<c:if test="${p.careGiverMeetingHash == param.meetingCode}">
											<button class="button-launch-visit-pg only-tablets" megaMeetingUrl="${WebAppContext.megaMeetingMobileURL}" megameetingid="${meeting.meetingVendorId}" lastname="${p.lastName}" firstname="${p.firstName}" email="${p.emailAddress}">Join Visit</button>
										</c:if>
									</c:if>
								</c:forEach>
							</c:if>
						</div>

						<div class="meeting-block-handler">
							<div class="hide-me timestamp_${meeting.meetingId}">${meeting.meetingTime}</div>
							<p class="time">Scheduled for <strong><span class="time_${meeting.meetingId}"></span></strong></p>
							
							<script type="text/javascript">
							// convert time stamp to time
								meetingTimestamp = $('.timestamp_' + ${meeting.meetingId}).text();
								convertedTimestamp = convertTimestampToDate(meetingTimestamp, 'time_only').toLowerCase() + ' '+ '<%=timezone%>';
								$('.time_' + ${meeting.meetingId}).append(convertedTimestamp);
							</script>
							
							<p class="host-name">
								${meeting.host.firstName} ${meeting.host.lastName}<c:if test="${not empty meeting.host.title}">, ${meeting.host.title}</c:if>	
							</p>
							<p class="time">
								${meeting.member.lastName}, ${meeting.member.firstName} ${meeting.member.middleName}
							</p>
							<c:if test="${meeting.caregiver != null && fn:length(meeting.caregiver) > 0}">
								<c:forEach var="p" items="${meeting.caregiver}">
									<c:if test="${p.careGiverMeetingHash != null && fn:length(p.careGiverMeetingHash) > 0}">
										
										<c:if test="${p.careGiverMeetingHash == param.meetingCode}">
											<button class="button-launch-visit-pg only-handsets" megaMeetingUrl="${WebAppContext.megaMeetingMobileURL}" megameetingid="${meeting.meetingVendorId}" lastname="${p.lastName}" firstname="${p.firstName}" email="${p.emailAddress}">Join Visit</button>
										</c:if>
									</c:if>
								</c:forEach>
							</c:if>
						</div>
					</div>

				</c:forEach>
				
			</c:when>
			<c:otherwise>
	        	<!--  If no meetings are present -->
				
					<div class="alert alert-hero alert-no-visits">
						<div class="alert-hero-message">
						<div class="image"></div>
							<p><strong>You do not have a video visit scheduled in the next 15 minutes. Please check back later.</strong></p>
						</div>
					</div>
		
	    	</c:otherwise>
			
		</c:choose>
			
		<%@ include file="common/informationTwopg.jsp" %>
	</div>
</div>