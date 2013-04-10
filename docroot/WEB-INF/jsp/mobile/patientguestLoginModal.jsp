<div id="modal-login" class="modal">
	<div class="modal-window">
		<div id="close-modal" class="button-close"></div>
		<h1>Sign on to Video Visits</h1>

		<div id="app-alert">
			<p>To join a video visit from your mobile device, please install our Video Visits mobile app. </p>
				<div class="app-lockup getAppButton">
					<div class="app-icon"></div>
					<p>Video Visits app</p>
				</div>
			<button id="patientLoginGetAppButtonId" class="button-primary getAppButton">Get the app</button>
			<button class="button-secondary" id="btn-i-have-it_pg">I have it installed!</button>
		</div>
		
		<div id="patientguest-login-form" class="hide-me">

			<form class="login-form">
				<p id="globalError" class="globalfailmessage hide-me"></p>

				<ul class="form-block guest">
					<li><label>Patient last name</label><input type="text" name="last_name" id="last_name" maxlength="35" tabindex="1" placeholder="" autocorrect = "off" pattern="[a-zA-Z]+" required>
						<div id="lastNameErrorId" class="localfailmessage hide-me">
							<p></p>
						</div>
					</li>
					<button id="login-submit-pg" class="off" tabindex="6" >Sign On</button>
				</ul>

				<p class="disclaimer">Children age 11 or younger may not use this website alone. A parent or legal guardian may use this website and have the child with them during the visit.</p>
			</form>

		</div>
	</div>
</div>