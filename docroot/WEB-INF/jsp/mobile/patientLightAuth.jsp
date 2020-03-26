<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<div>
	<p id="globalError" class="hide-me mobile-patient-light-authentication-error"></p>
</div>

<div class="mobile-patient-light-authentication">
	<div id="login-form">
		<p class="mobile-patient-light-authentication-sub-header"><img src="images/mobile/video-icon-blue.png" width="50" style="vertical-align:middle; padding-right:10px;">Video Visits Temporary Access</p>
		<p class="mobile-patient-light-authentication-info">Patient's Information</p>
		<form class="login-form" style="margin:6px 0 0;">
			<ul class="form-block">
				<li class="">
					<p class="mobile-patient-light-auth-label">LAST NAME</p>
					<input class="mobile-patient-light-auth-inputfield" type="text" name="last_name" id="last_name" tabindex="1" placeholder="i.e. Smith" autocorrect = "off" pattern="[a-zA-Z]+" required></li>
				<li class="">
					<p class="mobile-patient-light-auth-label">MEDICAL RECORD NO.</p>
					<input class="mobile-patient-light-auth-inputfield" type="text" name="mrn" id="mrn" maxlength="8" tabindex="2" placeholder="########" autocorrect = "off" pattern="[0-9]*" required></li>
				<li class="">
					<p class="mobile-patient-light-auth-label">DATE OF BIRTH</p>
					<input type="text" name="birth_month" id="birth_month" class="mobile-patient-light-auth-inputfield birth_month" maxlength="2" tabindex="3" placeholder="MM" autocorrect="off" pattern="[0-9]*" title="mm" required style="width: 15%;margin-right:12px;">
					<input type="text" name="birth_year" id="birth_year" class="mobile-patient-light-auth-inputfield birth_year" maxlength="4" tabindex="4" placeholder="YYYY" autocorrect="off" pattern="[0-9]*" title="mm/yyyy" required style="width: 80%;float: right;">
				</li>
				<div class="mobile-patient-light-auth-sigin-container">
					<button id="login-submit" class="off mobile-patient-light-auth-sigin-button" tabindex="6" disabled="disabled">Sign In</button>
				</div>
			</ul>
		</form>
		
		<p class="disclaimer mobile-patient-light-auth-disclaimer"><span style="padding-bottom:10px;display:block;font-weight: 600;">If You're a Patient's Guest</span>Guests of patients with a video visit,<br>click the link in your email invitation.</p>
	</div>
</div>

<style>
	button#login-submit{
		opacity: 0.5;
	}
	input::-webkit-input-placeholder{
		/*color: #000000;*/
	}
</style>
