<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>


<div class="page-content">
	<div class="intro">
		<div class="pic-frame">
			<div class="pic">
				<img src="images/mobile/vv-patient-welcome-image.jpg">
			</div>
		</div>
		<h1>Video Visit</h1>
		<p>Meet with your doctor by video on your mobile device.</p>
	</div>

	<ol class="well instructions">
		<h2>Be ready for your video visit:</h2>
		<li id="getAppLiId"><button id="preLoginGetAppButtonId" class="button-get-app" onClick="window.location='https://itunes.apple.com/us/app/vci-mobile/id477260861?mt=8#'">Get App</button>Install the Video Visits app on your device.</li>
		<li><div class="img-connection"></div>Make sure you have a strong network connection.</li>
		<li>For best results, use headphones during the call.</li>
	</ol>

	<div>
		<button id="signInId" class="button-main" onclick="modalShow('modal-login');">Sign on here</button>
	</div>
</div>