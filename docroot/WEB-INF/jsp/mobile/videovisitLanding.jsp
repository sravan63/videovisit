<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>


<%@ include file="videovisitLandingClinicianModal.jsp" %>
<%@ include file="videovisitLandingGuestModal.jsp" %>
<%@ include file="almostThereClinicianPopupModal.jsp" %>


<div class="page-content app-landing-page">
	<div  class="landing-page-wrapper">
		<h1>You are almost there!</h1>
		<p>Thanks for installing the Video Visits app. To get started, please choose one of the following options:</p>
		<ol>
			<li class="button-main" href="javascript:void(0)" onclick="window.location='mobilepatientlanding.htm'">I&rsquo;m a Patient</li>
			<li class="button-main" href="javascript:void(0)" onclick="modalShow('modalGuestId');">I&rsquo;m a Patient&rsquo;s Guest</li>
<%-- 			<li class="button-main" href="javascript:void(0)" onclick="window.location='${WebAppContext.clinicianSingleSignOnURL}';">I&rsquo;m a clinician</li> --%>
		</ol>
	</div>
</div>