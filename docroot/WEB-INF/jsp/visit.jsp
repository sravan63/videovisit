<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

	<div style="float:left">
		<h3 class="page-title">Video Visit with ${WebAppContext.meetings[0].providerHost.firstName} 
			${WebAppContext.meetings[0].providerHost.lastName}<c:if test="${not empty WebAppContext.meetings[0].providerHost.title}">, ${WebAppContext.meetings[0].providerHost.title}</c:if>
		</h3>
	</div>
	<div id="nav-user">
		<ul>
			<li>${WebAppContext.member.lastName}, ${WebAppContext.member.firstName} ${WebAppContext.member.middleName}</li>
			<li><a href="help.htm" target="_blank">Help</a></li>
		</ul>
		<a href="#" id="quitMeeting" class="jqModal button">Quit Meeting &rsaquo;&rsaquo;</a>
	</div>
                                
     <div id="video-main" style="width:100%">
         <iframe src ="blank.jsp" width="100%" height="600">
             <p>Your browser does not support iframes.</p>
         </iframe>
     </div>

	<div id="quitMeetingModal" class="jqmWindow dialog-block2" style="position:absolute; display:none" title="Quit Meeting">
		<div class="dialog-content-question">
                           <h2 class="jqHandle jqDrag"><span style="padding-left:8px">Quit Meeting</span></h2>
			<p class="question">Are you sure you want to quit this meeting?</p>
			<div class="pagination">
				<ul>
					<li><a id="dialogclose" class="jqmClose" href="#">No &rsaquo;&rsaquo;</a></li>
					<li><a id="quitMeetingLink" quitmeetingid="${WebAppContext.meetings[0].meetingId}" href="#">Yes &rsaquo;&rsaquo;</a></li>
				</ul>
			</div>
		</div>
	</div>

