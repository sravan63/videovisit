<div id="modal"> <!-- Modal - Proof of Concept -->
		<div class="inner-wrapper">
			<div class="modal-window">
				<div class="close-button"></div>
				<div class="message">
					<h1>Patient Login</h1>
					<div class="app-alert">
						<p class="intro">In order to attend a video visit from your device, you&#8217;ll need to install the following app:</p>
							<div class="app-lockup" onClick="window.location='https://itunes.apple.com/us/app/vci-mobile/id477260861?mt=8#'">
							<div class="app-icon"></div>
							<p><strong>Video Streaming app</strong><br>by The Permanente Medical Group</p>
						</div><!-- </a> -->
						<button class="button-pri" onClick="window.location='https://itunes.apple.com/us/app/vci-mobile/id477260861?mt=8#'">Get the app</button>
						<button id="btn-i-have-it" class="button-pri sec"><!-- I&#8217;ve installed it! -->I have it installed!</button>
					</div>
					<div id="login-form" class="hide-me">
						<form class="login-form" id="login-form">
							<ul class="form-block">
								<li><label for="last_name">Last Name</label><input type="text" name="last_name" id="last_name" tabindex="1" autocorrect = "off" pattern="[a-zA-Z]+" required></li>
								<li><label for="mrn">Medical Record #</label><input type="text" name="mrn" id="mrn" maxlength="8" tabindex="2" autocorrect = "off" pattern="[0-9]*" required></li>
								<li>
									<label for="birth_month" for="birth_day">Date of Birth</label>
									<input type="text" name="birth_month" title="mm" id="birth_month" class="birth_month" maxlength="2" tabindex="3" placeholder="MM" autocorrect = "off" pattern="[0-9]*" required>
									<input type="text" name="birth_day" title="dd" id="birth_day" class="birth_day" maxlength="2" tabindex="4" placeholder="DD" autocorrect = "off" pattern="[0-9]*"required>
									<input type="text" name="birth_year" title="yyyy" class="birth_year" id="birth_year" maxlength="4" tabindex="5" placeholder="YYYY" autocorrect = "off" pattern="[0-9]*"required>
								</li>
								
						</ul>
							<div>
								<button id="login-submit" name="login-submit"  tabindex="6">Login</button>
							</div>
							<p class="disclaimer">Children under age 13 may not use this website. A parent or legal guardian may use this website and have the child with them during the conference.</p>
						</form>
						<p class="error error-login"></p>
					</div>
				</div>
			</div>
		</div>
</div><!-- modal END -->