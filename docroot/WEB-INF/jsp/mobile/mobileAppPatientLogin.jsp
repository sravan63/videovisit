<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<div id="lastNameErrorId" class="localfailmessage hide-me">
	<p></p>
</div>
<div id="mrnErrorId" class="localfailmessage hide-me">
	<p></p>
</div>
<div id="monthOfBirthErrorId" class="localfailmessage hide-me">
	<p></p>
</div>
<div id="yearOfBirthErrorId" class="localfailmessage hide-me">
	<p></p>
</div>
<div id="dateOfBirthErrorId" class="localfailmessage hide-me">
	<p></p>
</div>
<div>
	<p id="globalError" class="globalfailmessage hide-me"></p>
</div>

<div style="height:100%; width:100%; background-color:#EBEBEB;">
	<div id="login-form" style="padding: 27px 18px 0 13px;">
		<h1 style="text-align:center;">Video Visits Temporary Access</h1>
		<form class="login-form" style="margin:23px 0 0;">
			<ul class="form-block">
				<li style="padding:0; height:30px; border-radius:2px;">
					<p style="width:100%; background-color:#706259; color:#FFFFFF; text-align:center; padding:5px 1px 5px 5px; border-top-left-radius:3px; border-top-right-radius:3px;">
						Enter Patient&#39s Information
					</p>
				</li>
				<li><input type="text" name="last_name" id="last_name" tabindex="1" placeholder="Last Name" autocorrect = "off" pattern="[a-zA-Z]+" required></li>
				<li><input type="text" name="mrn" id="mrn" maxlength="8" tabindex="2" placeholder="MRN" autocorrect = "off" pattern="[0-9]*" required></li>
				<li><input type="text" name="birth_date" title="mm/yyyy" id="birth_date" class="birth_date" tabindex="3" placeholder="Date of Birth (mm/yyyy)" autocorrect = "off" required>
				</li>
				<button id="mobile-login-submit" class="off" tabindex="6" style="width:100px; height:45px; float:right; background-color:#FFFFFF; color:#006BA6; font-size:18px; margin:10px -5px 10px 0; border-radius:3px; border:1px solid rgba(0,0,0,0.3);" disabled="disabled">Sign In</button>
			</ul>
		</form>
	</div>
	<!-- Fake Footer - to adjust the length of the Background image -->
	<div style="visibility:none; margin:75px 0;">
		<br/>
		<br/>
		<br/>
		<br/>
	</div>
	<!-- Disclaimer -->
	<div style="padding:20px 0 0 15px; height:98px; clear:both; background-color:#DAD4CD;">
		<p class="disclaimer" style="text-align:left; font-weight:bold; margin-bottom:10px;">If You&#39re a Patient&#39s Guest</p>
		<p class="disclaimer" style="text-align:left;">Guests of patients with a video visit, click the link in your email invitation.</p>
	</div>
</div>

<style>
	button#mobile-login-submit{
		opacity:0.5;
	}
</style>
