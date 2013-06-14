

<div id="join-now-modal" class="join-now-modal" style="display:none" title="Join Now">
	<%@ include file="joinNowModal.jsp" %>
</div>


<!--  Quit Meeting dialog -->
<div id="quitMeetingModal"  title="Quit Meeting">
	<div>
		<h2><span>Quit Meeting</span></h2>
		<p style="padding-top:20px">Are you sure you want to quit this meeting?</p>
		<div class="pagination">
			<ul>
				<li><a id="quitMeetingNo" class="button">No &rsaquo;&rsaquo;</a></li>
				<li><a id="quitMeetingYes" class="button" quitmeetingid="${param.meetingId}" memberName="${param.memberName}">Yes &rsaquo;&rsaquo;</a></li>
			</ul>
		</div>
	</div>
</div>