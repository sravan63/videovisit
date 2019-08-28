
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


<!-- <script src="vidyoplayer/scripts/webrtc/precalltesting/adapter-latest.js"></script>
<script src="vidyoplayer/scripts/webrtc/precalltesting/main_peripherals.js"></script> -->
<script type="text/javascript" src="js/site/pexip/complex/desktop-main-webrtc.js"></script>

<link rel="stylesheet" href="vidyoplayer/css/main-webrtc.css">
<style>
	#setupContent-main{
		width: 100%;
		padding-bottom: 0px;
		height: auto;
	}
	.selfview {
	  position: absolute;
	  z-index: 2;
	  max-width: 100px;
	  max-height: 80px; 
	  bottom: 34px;
	  right: -55px;
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
<div class="pre-call-testing-header">
	<div class="tpmg-logo">
		<img src="vidyoplayer/img/TPMG_logo.png" alt="TPMG"/>
		<div class="precall-logo-text">
			<p class="precall-logo-vv-text">Video Visits</p>
			<p class="precall-logo-group-text">The Permanente Medical Group</p>
		</div>
	</div>
	<a class="help-link" href="mdohelp.htm" target="_blank">Help</a>
</div>
<div class="pre-call-testing-wrapper">
	<div class="pre-call-test-container">
		<!-- Peripherals container block starts -->
		<div class="video-visit-peripherals-block">
			<div class="select no-margin-top">
				<label for="videoSource">Camera</label>
                <span class="caret"></span>
				<select id="videoSource"></select>
			</div>
			<div class="select">
				<label for="audioSource">Microphone</label>
				<span class="caret"></span>
				<select id="audioSource"></select>
			</div>
			<!-- music nodes -->
			<div class="mic-nodes-container">
				<div class="background-nodes" id="playNodes"></div>
			</div>
			<div class="select">
				<label for="audioOutput">Speakers</label>
                <span class="caret"></span>
				<select id="speakerSource"></select>
			</div>
			<!-- audio controls -->
			<div class="music-button play-music" id="playAudio">
				<span class="play-icon"></span>
				<span class="text">Play Sound</span>
			</div>
			<div class="music-button pause-music" id="pauseAudio" style="display:none;">
				<span class="pause-icon"></span>
				<span class="text">Pause Sound</span>
			</div>
		</div>
		<!-- Peripherals container block ends -->
		<!-- webrtc video container block starts-->
		<div class="video-visit-peripherals-block" style="position:relative;">
			<video id="video" playsinline autoplay></video>
			<div id="selfview" class="selfview">
	          <video id="selfvideo" autoplay="autoplay" playsinline="playsinline" muted="true">
	          </video>
	        </div>
		</div>
		<!-- webrtc video container block ends-->
	</div>
	<!-- <div>
		<iframe src="" width="500" style="border:none;display:block !important" height="500" name="iframe_a"></iframe>
		<p><a href="https://test.webrtc.org/" target="iframe_a">Check Bandwidth</a></p>
	</div> -->
	<div class="precall-test-button-container">
		<button id="precall-backBtn" class="">Back</button>
		<button id="precall-retestBtn" class="">Retest</button>
		<button id="precall-joinBtn" class="add-margin">Join</button>
	</div>

</div>

<script type="text/javascript">
	
	$("#precall-joinBtn").on("click",function(){
		// JOIN CLICK
	});

	$("#precall-backBtn").on("click", function(){
		// BACK CLICK
	});

	$("#precall-retestBtn").on("click",function(){
		// RETEST CLICK
	});

</script>