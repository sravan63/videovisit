<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*" %>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.command.*" %>
<%@ page import="org.kp.tpmg.videovisit.webserviceobject.xsd.*" %>

<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix='fn' uri='http://java.sun.com/jsp/jstl/functions' %>


<%

	MeetingCommand.retrieveMeeting(request, response);
%>


<h1>Upcoming Video Visits</h1>

<!-- 
                	<c:if test="${meeting.providerHost.homePageUrl != null && fn:length(meeting.providerHost.homePageUrl) > 0}">
                		<a target="_blank" href="${meeting.providerHost.homePageUrl}">${meeting.providerHost.firstName} ${meeting.providerHost.lastName}
	                		<c:if test="${not empty meeting.providerHost.title}">
	                			, ${meeting.providerHost.title}
	                		</c:if>
                		</a>
                	</c:if>
                	
               		<c:if test="${meeting.providerHost.homePageUrl == null || fn:length(meeting.providerHost.homePageUrl) == 0}">
                  		${meeting.providerHost.firstName} ${meeting.providerHost.lastName}
                  		<c:if test="${not empty meeting.providerHost.title}">
                  			, ${meeting.providerHost.title}
                  		</c:if>
                  	</c:if>
                  	
                  	
                  	<c:forEach var="p" items="${meeting.participants}">
	                  	<c:if test="${p.homePageUrl != null && fn:length(p.homePageUrl) > 0}">
	                   		 <a target="_blank" href="${p.homePageUrl}">${p.firstName} ${p.lastName}<c:if test="${not empty p.title}">, ${p.title}</c:if></a>
	                   	</c:if>
	                   	<c:if test="${p.homePageUrl == null || fn:length(p.homePageUrl) == 0}">
	                   		${p.firstName} ${p.lastName}<c:if test="${not empty p.title}">, ${p.title}</c:if>
	                   	</c:if>
	                  </c:forEach>
                  	 -->
<c:if test="${WebAppContext.totalmeetings>0}">
	<c:forEach var="meeting" items="${WebAppContext.meetings}">
		<div class="meeting well">
			<div class="time-slot">
				<button class="button-launch-visit">Launch Visit</button>
				<div class="hidden timestamp">${meeting.scheduledTimestamp}</div>
		
				<p id="displayTime">Visit scheduled for <span class="time"></span></p>
				<!--  TODO - not a good way of handling -->
				<script type="text/javascript">
					// convert time stamp to time
					
					$('.timestamp').each(function(){
				        meetingTimestamp = $(this).text();
				        convertedTimestamp = convertTimestampToDate(meetingTimestamp, 'time_only');
				      
				        $('#displayTime').append(convertedTimestamp);
				    });
				
				</script>
			</div>
			<ul>
				<h2>Meeting With</h2>
				<li class="host">
					<div class="pic-frame">
						
	              
						<div class="pic">
							<img src="${meeting.providerHost.imageUrl}">
						</div>
					</div>
					<div class="name">
						
	                  	${meeting.providerHost.firstName} ${meeting.providerHost.lastName}
	               		<c:if test="${not empty meeting.providerHost.title}">
	               			, ${meeting.providerHost.title}
	               		</c:if>
					 </div>
				</li>
				<c:if test="${meeting.participants != null && fn:length(meeting.participants) > 0}">
	               <h2 class="guests">Participants</h2>
	                  <c:forEach var="p" items="${meeting.participants}">
						<li class="guest-clinician">${p.firstName} ${p.lastName}<c:if test="${not empty p.title}">, ${p.title}</c:if></li>
	                  </c:forEach>
            	</c:if>
				<c:if test="${meeting.caregivers != null && fn:length(meeting.caregivers) > 0}">
	                <h2 class="guests">Guest Clinicians</h2>
	                 <c:forEach var="p" items="${meeting.caregivers}">
	                 	<li class="guest-clinician">${p.firstName} ${p.lastName}</li>
	                  </c:forEach>
	            </c:if>
				
			</ul>
		</div>
	</c:forEach>
</c:if>

<c:if test="${WebAppContext.totalmeetings <= 0}">
     <div class="no-visits">
		<div class="no-visits-image"></div>
		<p><span class="strong">You have no visits scheduled within the next 15 minutes.</span></p>
		<p>Please check back again later.</p>
	</div>
</c:if>

<div class="instructions">
	<h2>Be ready for your Video Visit:</h2>
	<ul>
		<li><button class="button-get-app" onClick="window.location='https://itunes.apple.com/us/app/vci-mobile/id477260861?mt=8#'">Get the App</button>Install the Video Streaming app.</li>
		
		<li><div class="img-connection"></div>Make sure you have a strong network connection.</li>
	</ul>
</div>