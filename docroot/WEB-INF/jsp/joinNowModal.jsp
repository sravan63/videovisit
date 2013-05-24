<!-- Join Now modal for patient -->
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

	<c:forEach var="meeting" items="${WebAppContext.meetings}">
		<c:if test="${meeting.meetingId == param.meetingId}">	
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
			<li class="last"><a href="help.htm"  target="_blank">Help</a></li>
		</ul>
		<a id="quitMeeting" class="jqModal button" >Quit Meeting &rsaquo;&rsaquo;</a>
	</div>
                                
     <div id="video-main" style="width:100%">
         <iframe src ="blank.jsp" width="100%" height="550px">
             <p>Your browser does not support iframes.</p>
         </iframe>
     </div>

	

