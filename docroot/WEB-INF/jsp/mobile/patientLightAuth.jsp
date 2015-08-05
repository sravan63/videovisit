<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<div id="lastNameErrorId" class="localfailmessage hide-me" style="background-color:#686A6C;">
	<p></p>
</div>
<div id="mrnErrorId" class="localfailmessage hide-me" style="background-color:#686A6C;">
	<p></p>
</div>
<div id="dateOfBirthErrorId" class="localfailmessage hide-me" style="background-color:#686A6C;">
	<p></p>
</div>
<div>
	<p id="globalError" class="globalfailmessage hide-me" style="background-color:#686A6C;"></p>
</div>

<div style="padding:10px;">
	
	<div id="login-form">
		<h1>Sign In to Video Visits</h1>	
		<form class="login-form" style="margin:10px 0 0;">
			<ul class="form-block">
				<li><input type="text" name="last_name" id="last_name" tabindex="1" placeholder="Last Name" autocorrect = "off" pattern="[a-zA-Z]+" required></li>
				<li><input type="text" name="mrn" id="mrn" maxlength="8" tabindex="2" placeholder="MRN" autocorrect = "off" pattern="[0-9]*" required></li>
				<li><input type="text" name="birth_date" title="mm/yyyy" id="birth_date" class="birth_date" maxlength="7" tabindex="3" placeholder="Date of Birth (mm/yyyy)" autocorrect = "off" required>
				</li>

				<button id="login-submit" class="off" tabindex="6" style="width:100%; height:35px; background-color:#0061A9; color:#FFFFFF; font-weight:bold; font-size:14px; margin:10px auto; border-radius:4px;" disabled="disabled">Sign In</button>
			</ul>
		</form>
		
		</div>
		<p class="disclaimer">Children age 11 and younger must have a parent present during the visit.</p>
	 	
	 	<%@ include file="common/informationTwo.jsp" %>

</div>
