<div id="modal">
	<div class="modal-window">
		<div id="close-modal" class="button-close"></div>
		<h1>Patient Sign On</h1>

		<div id="app-alert">
			<p>To join a video visit from your mobile device, please install our Video Visits mobile app. </p>
				<div class="app-lockup" onClick="window.location='https://itunes.apple.com/us/app/vci-mobile/id477260861?mt=8#'">
					<div class="app-icon"></div>
					<p>Video Visits app</p>
				</div>
			<button id="patientLoginGetAppButtonId" class="button-primary" onClick="window.location='https://itunes.apple.com/us/app/vci-mobile/id477260861?mt=8#'">Get the app</button>
			<button class="button-secondary" id="btn-i-have-it">I have it installed!</button>
		</div>
		
		<div id="login-form" class="hide-me">

			<form class="login-form">
				<p id="globalError" class="globalfailmessage hide-me"></p>

				<ul class="form-block">
					<li><label for="last_name">Last Name</label><input type="text" name="last_name" id="last_name" tabindex="1" autocorrect = "off" pattern="[a-zA-Z]+" required>
						<div id="lastNameErrorId" class="localfailmessage hide-me">
							<p></p>
						</div>
					</li>
					<li><label for="mrn">Medical Record #</label><input type="text" name="mrn" id="mrn" maxlength="8" tabindex="2" autocorrect = "off" pattern="[0-9]*" required>
						<div id="mrnErrorId" class="localfailmessage hide-me">
							<p></p>
						</div>
					</li>
					<li>
						<label for="birth_month" for="birth_day">Date of Birth</label>
						<input type="text" name="birth_month" title="mm" id="birth_month" class="birth_month" maxlength="2" tabindex="3" placeholder="MM" autocorrect = "off" pattern="[0-9]*" required>
						<input type="text" name="birth_day" title="dd" id="birth_day" class="birth_day" maxlength="2" tabindex="4" placeholder="DD" autocorrect = "off" pattern="[0-9]*"required>
						<input type="text" name="birth_year" title="yyyy" class="birth_year" id="birth_year" maxlength="4" tabindex="5" placeholder="YYYY" autocorrect = "off" pattern="[0-9]*"required>
						<div id="dateOfBirthErrorId" class="localfailmessage hide-me">
							<p></p>
						</div>
					</li>
					<button id="login-submit" class="off" tabindex="6" >Sign On</button>
				</ul>

				<p class="disclaimer">Children under age 13 may not use this website. A parent or legal guardian may use this website and have the child with them during the conference.</p>
			</form>

		</div>
	</div>
</div>