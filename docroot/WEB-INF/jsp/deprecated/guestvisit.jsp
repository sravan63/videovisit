	
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*"%>
<%@ page import="javax.servlet.*"%>
<%@ page import="javax.servlet.http.*"%>

<%
	
	WebAppContext ctx = WebAppContext.getWebAppContext(request);
	
	String meetingCode = ctx.getMeetingCode();
	String patientLastName = ctx.getPatientLastName();
	String nocache = ctx.getNocache();
	String meetingId = ctx.getGuestMeetingId();

%>

<div id="guest-join-now-modal" class="join-now-modal" style="display:none" title="Join Now">
	<%@ include file="guestJoinNowModal.jsp" %>
</div>


<!--  Quit Meeting dialog -->
<div id="quitMeetingGuestModal"  title="Quit Meeting">
	<div class="modalWrapper">
		<h2><span>Quit Meeting</span></h2>
		<p class="modalParagraph">Are you sure you want to quit this meeting?</p>
		<div class="pagination">
			<ul>
				<li><a id="quitMeetingGuestNo" class="button">No &rsaquo;&rsaquo;</a></li>
				<li><a id="quitMeetingGuestYes" class="button" quitmeetingid="${WebAppContext.myMeetings[0].meetingId}" caregiverId="${param.caregiverId}">Yes &rsaquo;&rsaquo;</a></li>
			</ul>
		</div>
	</div>
</div>

<input type="hidden" id="meetingCode" value="<%=meetingCode%>" /> 
<input type="hidden" id="patientLastName" value="<%=patientLastName%>" /> 
<input type="hidden" id="nocache" value="<%=nocache%>" /> 
<input type="hidden" id="meetingId" value="<%=meetingId%>" /> 
