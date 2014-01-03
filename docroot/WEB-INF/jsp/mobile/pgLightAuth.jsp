<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<%
	String meetingCode = "";
	if ( request.getParameter("meetingCode") != null)
			meetingCode	= request.getParameter("meetingCode");
%>
<div class="page-content">
	<div id="patientguest-login-form">
			<h1>Sign On to Video Visits</h1>
			<form class="login-form">
				<p id="globalError" class="globalfailmessage hide-me"></p>

				<ul class="form-block guest">
					<li><input type="text" name="last_name" id="last_name" maxlength="35" tabindex="1" placeholder="" autocorrect = "off" pattern="[a-zA-Z]+" value="Patient Last Name" required>
						<div id="lastNameErrorId" class="localfailmessage hide-me">
							<p></p>
						</div>
					</li>
					<button id="login-submit-pg" class="off" tabindex="6">Sign In</button>
				</ul>
				<input type="hidden" id="meetingCode" value="<%=meetingCode%>"/> 
				<p class="disclaimer">Children age 11 and younger must have a parent present during the visit.</p>
			</form>

		</div>

	<%@ include file="common/informationpg.jsp" %>	
	

		

</div>

<!-- 
<div style="display:block; border-bottom: 1px solid #CCC; line-height:1 em; font-size: 16px; font-family: Helvetica, Neue; overflow: auto; height: auto; color:#78BE20;">
	
	</div>
	
	<div style="margin: 55px 0 0; text-align: center; color: #DA6426; font-size: 20px;">
		<h2> Video Visits Mobile </h2>
		<h2> Coming Soon </h2>
	</div>
	
	<div style="margin: 25px 0 40px; text-align: center; color: #666666;">
		<p style="word-wrap: break-word;"> Until then, please use a laptop or desktop computer to access Video Visits.
	</div>
</div> -->