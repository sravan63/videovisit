
	<!--Plugin Hidden variables -->
	<input type="hidden" id="pluginName" value="" />
	<input type="hidden" id="pluginNewVersion" value="" />
	<input type="hidden" id="pluginOldVesrions" value="" />

	<input type="hidden" id="guestName" value="" />
	<input type="hidden" id="isProvider" value="false" />
	<input type="hidden" id="guestUrl" value="" />
	<input type="hidden" id="meetingId" value="" />
	<input type="hidden" id="vendorConfId" value="" />

	<input type="hidden" id="caregiverId" value="" />
	<input type="hidden" id="meetingCode" value="" />
	<input type="hidden" id="isMember" value="" />
	<input type="hidden" id="webrtc" value="${webrtc}" />
	<input type="hidden" id="webrtcSessionManager" value="${webrtcSessionManager}" />
	<input type="hidden" id="blockChrome" value="${blockChrome}" />
	<input type="hidden" id="blockFF" value="${blockFF}" />
	<!-- US35718 changes -->
	<input type="hidden" id="blockEdge" value="${blockEdge}" />
	<input type="hidden" id="blockSafari" value="${blockSafari}" />
	<input type="hidden" id="blockSafariVersion" value="${blockSafariVersion}" />
	<!-- US35718 changes -->
	<input type="hidden" id="loggedUserRole" value="${loggedUserRole}" />

	<script type="text/javascript" src="js/site/pexip/setup/main-webrtc.js"></script>

	<link rel="stylesheet" href="vidyoplayer/css/main-webrtc.css">
	<style>
		.application-content .main-content{
			padding-bottom: 0px!important;
		}
		.no-background{
			background: none!important;
		}
		.disable-access{
			pointer-events: none;
			opacity: 0.5;
		}
		.video-visit-peripherals-block{
			position: relative;	
		}
		/*.provider-pre-call-testing-wrapper{
			background-color: #F1F4F7;
			margin: -50px -20px -10px -20px;
		}*/
		.provider-pre-call-testing-wrapper>.pre-call-test-container{
			background: none!important;
		}
		.provider-pre-call-testing-wrapper>.pre-call-test-container>div.video-visit-peripherals-block{
			width: 400px!important;
		}
		.provider-pre-call-testing-wrapper>.pre-call-test-container>.video-visit-peripherals-block>div.select{
			margin-bottom: 50px;
		}
		.provider-pre-call-testing-wrapper>.pre-call-test-container>.video-visit-peripherals-block>div.select>select{
			text-indent: 10px;
			width: 380px!important;
		}
		.provider-pre-call-testing-wrapper>.pre-call-test-container>.video-visit-peripherals-block>div.select>span.caret{
			top: 30px!important;
		}
		.video-preview-block{
			background-color: #DADADA;
			height: 250px!important;
    		margin-top: 93px!important;
		}
		.video-preview-block #video{
			width: 440px!important;
		}
		.caret{
			background: none !important;
		}
		.selfview {
		  position: absolute;
		  z-index: 2;
		  max-width: 100px;
		  max-height: 80px; 
		  bottom: -3px;
    	  right: -40px;
		  background-size: cover;
		  background-position: center;
		}
		.selfview video {
		  z-index: 3;
		  top: 0;
		  right: 0;
		  bottom: 0;
		  left: 0;
		  width: 100%;
		  height: 100%;
		}
		.video-preview-block button {
			margin: 10px;
			text-align: center;
			height:30px;
			width:100px;
			background-color: #018921;
			font-size: 16px;
			color: #FFFFFF;
			border: none;
			margin: 25% 38%;
		}
		@media only screen and (max-width : 950px) {
		  .selfview {
		    position: absolute;
		    bottom: 0;
		    right: 0;
		    /*width: 20%;
		    height: 20%;*/
		  }
		}
		@media only screen and (max-width : 550px) {
		  .selfview {
		    position: absolute;
		    bottom: 0;
		    right: 1%;
		    width: 20%;
		    height: auto;
		  }
		}
	</style>

<div class="provider-pre-call-testing-wrapper">
	<div class="pre-call-test-container">
		<!-- Peripherals container block starts -->
		<div class="video-visit-peripherals-block">
			<div class="select">
				<label for="videoSource">Camera</label>
                <span class="caret"></span>
				<select id="videoSource"></select>
			</div>
			<div class="select">
				<label for="audioSource">Microphone</label>
				<span class="caret"></span>
				<select id="audioSource"></select>
			</div>
			<div class="select">
				<label for="audioOutput">Speakers</label>
                <span class="caret"></span>
				<select id="speakerSource"></select>
			</div>
		</div>
		<!-- Peripherals container block ends -->
		<!-- webrtc video container block starts-->
		<div class="video-visit-peripherals-block video-preview-block">
			<button id="precall-start" class="">Start</button>
			<video id="video" playsinline autoplay></video>
			<div id="selfview" class="selfview">
	          <video id="selfvideo" autoplay="autoplay" playsinline="playsinline" muted="true">
	          </video>
	        </div>
		</div>
		<!-- webrtc video container block ends-->
	</div>

</div>
	

	<script type="text/javascript">
	
		$("#precall-start").click(function(){
			// JOIN CLICK
			console.log('Start Test VMR');
			$(this).css('display','none');
			$('#video').css('visibility','visible');
        	$('#selfvideo').css('visibility','visible');
        	$('.video-preview-block').addClass('no-background');
        	toggleDropDownAccess(false);
			VideoVisitSetupWizard.createMeeting();
		});

		function toggleDropDownAccess(clickable){
			if(clickable){
				$('#videoSource').removeClass('disable-access');
				$('#audioSource').removeClass('disable-access');
				$('#speakerSource').removeClass('disable-access');
			}else{
				$('#videoSource').addClass('disable-access');
				$('#audioSource').addClass('disable-access');
				$('#speakerSource').addClass('disable-access');
			}
		}

	</script>
