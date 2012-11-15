<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>

<%@ include file="patientLoginModal.jsp" %>

<div class="intro">
	<div class="pic-frame">
		<div class="pic">
			<img src="images/mobile/vv-patient-welcome-image.jpg">
		</div>
	</div>
	<h1>Video Visit</h1>
	<p>Meet with your doctor by video on your mobile device.</p>
</div>


<div class="instructions">
	<h2>Be ready for your Video Visit:</h2>
	<ul>
		<li><button class="button-get-app" onClick="window.location='https://itunes.apple.com/us/app/vci-mobile/id477260861?mt=8#'">Get the App</button>Install the Video Streaming app.</li>
		
		<li><div class="img-connection"></div>Make sure you have a strong network connection.</li>
	</ul>
</div>
<div>
	<button class="button-main" onclick="modalShow();">Sign in Here</button>
</div>


