<div id="modal-login" class="modal">
	<div class="modal-window">
		<div id="close-modal" class="button-close"></div>
		<h1>To Join a Video Visit</h1>

		<div id="app-alert">
<!-- 			<p>To join a video visit from your mobile device, please install our Video Visits mobile app. </p> -->
				<p> Please install and open the latest version of the KP Preventive Care App. </p>
				<p> After downloading, return to this screen or your email to continue to sign on. </p>
				<div class="app-lockup getAppButton">
					<div class="app-icon"></div>
					<p> KP Preventive Care App </p>
				</div>
			<button id="patientLoginGetAppButtonId" class="button-primary getAppButton">Get the App</button>
			<button class="button-secondary" id="btn-i-have-it_pg">I Have it Installed</button>
		</div>
		
		<div id="patientguest-login-form" class="hide-me">

			<form class="login-form">
				<p id="globalError" class="globalfailmessage hide-me"></p>

				<ul class="form-block guest">
					<li><label>Patient Last Name</label><input type="text" name="last_name" id="last_name" maxlength="35" tabindex="1" placeholder="" autocorrect = "off" pattern="[a-zA-Z]+" required>
						<div id="lastNameErrorId" class="localfailmessage hide-me">
							<p></p>
						</div>
					</li>
					<button id="login-submit-pg" class="off" tabindex="6" >Sign In</button>
				</ul>

				<p class="disclaimer">Children age 11 or younger may not use this website alone. A parent or legal guardian may use this website and have the child with them during the visit.</p>
			</form>

		</div>
	</div>
</div>