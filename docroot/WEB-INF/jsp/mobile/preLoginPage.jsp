<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>

<div class="page-content">
	<div class="intro">
		<div class="pic-frame">
			<div class="pic">
				<img src="images/mobile/vv-patient-welcome-image.jpg">
			</div>
		</div>
		<h1>Video Visits</h1>
		<div class="only-handsets">
			<p> Meet with your doctor by video on your mobile device. </p>
		</div>
		
		<div id="modal-login" class="modal">
			<div class="modal-window">
				<div id="close-modal" class="button-close"></div>
				<h1>To Join a Video Visit</h1>
		
				<div id="app-alert">
					
						<div class="app-lockup getAppButton">
							<div class="app-icon"></div>
							<p>Please install and open the latest version of the KP Preventive Care app. </p>
						</div>
					<button id="patientLoginGetAppButtonId" class="button-primary getAppButton">Get the App</button>
					<button class="button-secondary" id="btn-i-have-it">I have it Installed</button>
				</div>
			</div>
		</div>
	
		<div class="only-tablets">
			<p>Kaiser Permanente is pleased to offer you the opportunity to meet with your doctor from your smartphone or tablet.</p>
			<p>To attend a video visit, you will need a device with a front-facing camera, the Video Visits app and a fast internet connection (4G or Wi-fi highly recommended).</p>
		</div>
		<button id="getAppButton" class="button-main getAppButton only-tablets" >Get the App</button><br/><br/>
		 <button id="signInId" class="button-main only-tablets"  >Sign on here</button>
		
	</div>

	<%@ include file="common/information.jsp" %>	

		<button id="getAppButton" class="button-main getAppButton only-handsets" >Get the App</button><br/>
		<button id="signInId" class="button-main only-handsets" >Sign In</button>
		

</div>

<!-- 
<div style="display:block; border-bottom: 1px solid #CCC; line-height:1 em; font-size: 16px; font-family: Helvetica, Neue; overflow: auto; height: auto; color:#78BE20;">
	
	</div>
	
	<div style="margin: 55px 0 0; text-align: center; color: #DA6426; font-size: 20px;">
		<h2> Video Visits Mobile </h2>
		<h2> Coming Soon </h2>
	</div>
	
	<div style="margin: 25px 0 40px; text-align: center; color: #666666;">
		<p style="word-wrap: break-word;"> Until then, please use a laptop or desktop computer to access Video Visits.
	</div>
</div> -->