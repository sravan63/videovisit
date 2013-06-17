<!-- Join Now modal for patient guest -->
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<div style="float:left">
	<h3 class="page-title">Video Visit for ${WebAppContext.meetings[0].member.firstName} 
		${WebAppContext.meetings[0].member.lastName} 
	</h3>
</div>
<div id="nav-user">
	<ul>
		<li class="last"><a href="guesthelp.htm" target="_blank">Help</a></li>
	</ul>
	<a id="quitMeetingGuestId" class="button">Quit Meeting &rsaquo;&rsaquo;</a>
</div>

<div id="video-main" style="width:100%">
    <iframe id="joinNowIframeGuest"  src ="blank.jsp" width="100%" height="600">
        <p>Your browser does not support iframes.</p>
    </iframe>
</div>

