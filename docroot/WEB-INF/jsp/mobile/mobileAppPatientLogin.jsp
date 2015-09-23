<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
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
				<li><input type="text" name="last_name" id="last_name" tabindex="1" placeholder="Last Name" autocorrect="off" pattern="[a-zA-Z]+" required></li>
				<li><input type="text" name="mrn" id="mrn" maxlength="8" tabindex="2" placeholder="MRN" autocorrect="off" pattern="[0-9]*" required></li>
				<li style="border:1px solid rgba(0,0,0,0.3); border-top:none; border-radius:0; margin-right:-6px; overflow:auto; background-color:#FFFFFF; border-bottom-left-radius:3px; border-bottom-right-radius:3px;">
					<label style="padding-left:4px; float:left; margin-top:5px; color:#000000;">Date of Birth</label>
					<span style="float:right; margin:3px 10px 3px 0;">
						<input type="text" name="birth_month" id="birth_month" class="birth_month" maxlength="2" tabindex="3" placeholder="mm" autocorrect="off" pattern="[0-9]*" title="mm" required style="border:none; background-color:#F1F1F1; padding:0 20px; border-radius:0;">
						<label style="margin:0 10px;"> / </label>
						<input type="text" name="birth_year" id="birth_year" class="birth_year" maxlength="4" tabindex="4" placeholder="yyyy" autocorrect="off" pattern="[0-9]*" title="mm/yyyy" required style="border:none; background-color:#F1F1F1; width:35px; padding:0 20px; border-radius:0;">
					</span>
				</li>
				<button id="mobile-login-submit" class="off" tabindex="6" style="width:100px; height:45px; float:right; background-color:#FFFFFF; color:#006BA6; font-size:18px; margin:10px -5px 10px 0; border-radius:3px; border:1px solid rgba(0,0,0,0.3); clear:both;" disabled="disabled">Sign In</button>
			</ul>
		</form>
	</div>
	<!-- Disclaimer -->
	<div style="padding:27px 18px 0 13px; height:98px; clear:both;">
		<p class="disclaimer" style="text-align:left; font-weight:bold; margin-bottom:10px;">If You&#39re a Patient&#39s Guest</p>
		<p class="disclaimer" style="text-align:left;">Guests of patients with a video visit, click the link in your email invitation.</p>
	</div>
	<!-- END - Disclaimer -->
	
	<!-- Fake Footer - to adjust the length of the Background image -->
	<!-- <div style="visibility:hidden; margin:75px 0;">
		<br/>
	</div> -->
	<!-- END - Fake Footer -->
</div>

<style>
	button#mobile-login-submit{
		opacity: 0.5;
	}
	input::-webkit-input-placeholder{
		color: #000000;
	}
</style>
