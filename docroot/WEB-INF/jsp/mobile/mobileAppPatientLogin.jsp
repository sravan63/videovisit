<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>

<div style="height:100%; width:100%; background-color:#EBEBEB;">
	<div id="login-form" style="padding: 27px 18px 0 13px;">
		<h1 style="text-align:center;">Video Visit Temporary Access</h1>
		<form class="login-form" style="margin:23px 0 0;">
			<p id="globalError" class="globalfailmessage hide-me"></p>
			<ul class="form-block">
				<li style="margin:0 0 4px; padding:0; height:30px; border-radius:2px;">
					<p style="width:100%; background-color:#706259; color:#FFFFFF; text-align:center; padding:5px 0 5px 5px;">
						Enter Patient&#39s Information
					</p>
				</li>
				<li><label>Last Name</label><input type="text" name="last_name" id="last_name" tabindex="1" placeholder="Last Name" autocorrect = "off" pattern="[a-zA-Z]+" required>
					<div id="lastNameErrorId" class="localfailmessage hide-me">
						<p></p>
					</div>
				</li>
				<li><label>Medical Record No.</label><input type="text" name="mrn" id="mrn" maxlength="8" tabindex="2" placeholder="MRN" autocorrect = "off" pattern="[0-9]*" required>
					<div id="mrnErrorId" class="localfailmessage hide-me">
						<p></p>
					</div>
				</li>
				<li>
					<label>Date of Birth</label>
					<input type="text" name="birth_month" title="mm" id="birth_month" class="birth_month" maxlength="2" tabindex="3" placeholder="MM" autocorrect = "off" pattern="[0-9]*" required>
					<input type="text" name="birth_day" title="dd" id="birth_day" class="birth_day" maxlength="2" tabindex="4" placeholder="DD" autocorrect = "off" pattern="[0-9]*"required>
					<input type="text" name="birth_year" title="yyyy" class="birth_year" id="birth_year" maxlength="4" tabindex="5" placeholder="YYYY" autocorrect = "off" pattern="[0-9]*"required>
					<div id="dateOfBirthDayErrorId" class="localfailmessage hide-me">
					<p></p>
					</div>
					<div id="dateOfBirthMonthErrorId" class="localfailmessage hide-me">
					<p></p>
					</div>
					<div id="dateOfBirthYearErrorId" class="localfailmessage hide-me">
						<p></p>
					</div>
				</li>
				<button id="mobile-login-submit" class="off" tabindex="6" style="width:100%; height:35px; background-color:#0061A9; color:#FFFFFF; font-weight:bold; font-size:18px; margin:10px auto; border-radius:3px;">Sign In</button>
			</ul>
		</form>
	</div>
	<div style="padding:20px 0 0 15px; height:98px;">
		<p class="disclaimer" style="text-align:left; font-weight:bold; margin-bottom:10px;">If You&#39re a Patient&#39s Guest</p>
		<p class="disclaimer" style="text-align:left;">Guests of patients with a video visit, click the link in your email invitation.</p>
	</div>
</div>