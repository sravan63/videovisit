<!-- Join Now modal for patient -->
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

	<c:forEach var="meeting" items="${WebAppContext.myMeetings}">
		<c:if test="${meeting.meetingId == WebAppContext.meetingId}">	
			<div style="float:left">
				<h3 class="page-title">Video Visit with ${meeting.host.firstName} 
					${meeting.host.lastName}
					<c:if test="${not empty meeting.host.title}">, ${meeting.host.title}</c:if>
				</h3>
			</div>
		</c:if>
	</c:forEach>

	<div id="nav-user">
		<ul>
			<li>${WebAppContext.memberDO.lastName}, ${WebAppContext.memberDO.firstName} ${WebAppContext.memberDO.middleName}</li>
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

	

