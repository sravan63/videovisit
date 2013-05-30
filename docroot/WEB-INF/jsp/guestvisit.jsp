	
<div id="guest-join-now-modal" class="join-now-dialog jqmWindow" style="display:none" title="Join Now">
	<%@ include file="guestJoinNowModal.jsp" %>
</div>

<div id="quitMeetingModal" class="jqmWindow jqmTopMost" style="position:absolute; display:none" title="Quit Meeting">
	<div class="dialog-content-question">
                         <h2 class="jqHandle jqDrag"><span style="padding-left:8px">Quit Meeting</span></h2>
		<p class="question">Are you sure you want to quit this meeting?</p>
		<div class="pagination">
			<ul>
				<li><a id="dialogclose" class="button">No &rsaquo;&rsaquo;</a></li>
				<li><a id="quitMeetingLink" class="button" quitmeetingid="${WebAppContext.meetings[0].meetingId}" caregiverId="${param.caregiverId}">Yes &rsaquo;&rsaquo;</a></li>
			</ul>
		</div>
	</div>
</div>

