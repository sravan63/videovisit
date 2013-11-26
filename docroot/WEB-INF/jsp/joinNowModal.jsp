<!-- Join Now modal for patient -->
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

	<c:forEach var="meeting" items="${WebAppContext.meetings}">
		<c:if test="${meeting.meetingId == WebAppContext.meetingId}">	
			<div style="float:left">
				<h3 class="page-title">Video Visit with ${meeting.providerHost.firstName} 
					${meeting.providerHost.lastName}
					<c:if test="${not empty meeting.providerHost.title}">, ${meeting.providerHost.title}</c:if>
				</h3>
			</div>
		</c:if>
	</c:forEach>

	<div id="nav-user">
		<ul>
			<li>${WebAppContext.member.lastName}, ${WebAppContext.member.firstName} ${WebAppContext.member.middleName}</li>
			<li class="last"><a href="mdohelp.htm"  target="_blank">Help</a></li>
		</ul>
		 <!-- Below buttons are commented By Srini.P 09/12/2013 -->
		 <!--Start 
		<a id="quitMeetingId" class="button" >Quit Meeting &rsaquo;&rsaquo;</a>
		end -->
	</div>
                                
     <div id="video-main" style="width:100%">
         <iframe id="joinNowIframe" src ="blank.jsp" scrolling="no" width="100%" height="600">
             <p>Your browser does not support iframes.</p>
         </iframe>
     </div>

	

