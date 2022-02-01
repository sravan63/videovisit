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
<input type="hidden" id="blockChrome" value="${blockChrome}" />
<input type="hidden" id="blockFF" value="${blockFF}" />
<input type="hidden" id="blockPexipIE" value="${blockPexipIE}" />
<!-- US35718 changes -->
<input type="hidden" id="blockEdge" value="${blockEdge}" />
<input type="hidden" id="blockSafari" value="${blockSafari}" />
<input type="hidden" id="blockSafariVersion" value="${blockSafariVersion}" />
<!-- US35718 changes -->
<input type="hidden" id="blockPexipSafariVersion" value="${WebAppContext.pexBlockSafariVer}" />
<input type="hidden" id="blockChromeVersion" value="${WebAppContext.pexBlockChromeVer}" />
<input type="hidden" id="blockFirefoxVersion" value="${WebAppContext.pexBlockFirefoxVer}" />
<input type="hidden" id="blockEdgeVersion" value="${WebAppContext.pexBlockEdgeVer}" />
<input type="hidden" id="loggedUserRole" value="${loggedUserRole}" />

<script type="text/javascript" src="js/site/pexip/setup/main-webrtc.js"></script>

<link rel="stylesheet" href="css/library/conference/main-webrtc.css">
<style>
	.application-content .main-content {
		padding-bottom: 0px !important;
	}

	.no-background {
		background: none !important;
	}

	.disable-access {
		pointer-events: none;
		opacity: 0.5;
	}

	.video-visit-peripherals-block {
		position: relative;
	}

	/*.provider-pre-call-testing-wrapper{
			background-color: #F1F4F7;
			margin: -50px -20px -10px -20px;
		}*/
	.provider-pre-call-testing-wrapper>.pre-call-test-container {
		background: none !important;
	}

	.provider-pre-call-testing-wrapper>.pre-call-test-container>div.video-visit-peripherals-block {
		width: 400px !important;
	}

	.provider-pre-call-testing-wrapper>.pre-call-test-container>.video-visit-peripherals-block>div.select {
		margin-bottom: 50px;
	}

	.provider-pre-call-testing-wrapper>.pre-call-test-container>.video-visit-peripherals-block>div.select>select {
		text-indent: 10px;
		width: 380px !important;
	}

	.provider-pre-call-testing-wrapper>.pre-call-test-container>.video-visit-peripherals-block>div.select>span.caret {
		top: 30px !important;
	}

	.video-preview-block {
		background-color: #DADADA;
		height: 250px !important;
		margin-top: 93px !important;
	}

	.video-preview-block #video {
		width: 440px !important;
	}

	.caret {
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
		height: 30px;
		width: 100px;
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
<div class="pre-call-testing-header">
	<a class="help-link" href="mdohelp.htm" target="_blank"
		style="margin-top:10px; margin-right:0px; right:-65px;">Help</a>
</div>
<div class="provider-pre-call-testing-wrapper" style="display: none;">
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
<!-- <div class="error-container" style="display: none;text-align: center;margin-top: 10rem;font-size: 23px;">
	<h1>This browser is not supported. Use Google Chrome to join Video Visits.</h1>
</div> -->
<!-- Block Message -->
<div class="special-message-banner-container" id="blockerMessage" style="margin-top:150px">
	<div class="special-message-header">
		<span class="warning-icon"></span>
		<p class="warning-text">Video Visits does not support your browser.</p>
	</div>
	<div class="special-message-content">
		<div class="special-message-container">
			<div class="mdo-logo"></div>
			<div class="special-message">
				<p><b id="browser-block-message">Join on your mobile device using the My Doctor Online app, or try a
						different browser.</b></p>
			</div>
		</div>
		<div class="app-store-container">
			<span class="ios-appstore"><a class="icon-link"
					href="https://itunes.apple.com/us/app/my-doctor-online-ncal-only/id497468339?mt=8"
					target="_blank"></a></span>
			<span class="android-playstore"><a
					href="https://play.google.com/store/apps/details?id=org.kp.tpmg.preventivecare&hl=en_US"
					class="icon-link" target="_blank"></a></span>
		</div>
	</div>
</div>


<script type="text/javascript">
	$('.provider-pre-call-testing-wrapper').css('display', 'block');
	var browserUserAgent = navigator.userAgent;
	var browserInfo = getBrowserInfo();
	var blockEdge = ($("#blockEdge").val() == 'true');
	var blockIE = ($("#blockPexipIE").val() == 'true');
	var blockFF = ($("#blockFF").val() == 'true');
	var blockSafari = ($("#blockSafari").val() == 'true');
	var blockChrome = ($("#blockChrome").val() == 'true');
	var isIE = /MSIE|Trident/.test(browserUserAgent);
	var isEdge = /Edge/.test(browserUserAgent);
	var isChrome = /Chrome/.test(browserUserAgent);
	var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
	var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

	if (isEdge) {
		if (blockEdge) {
			$('.provider-pre-call-testing-wrapper').css('display', 'none');
			$('.special-message-banner-container').css('display', 'block');
		} else {
			var blockEdgeVersion = $("#blockEdgeVersion").val() ? Number($("#blockEdgeVersion").val()) : 18;
			var agentVal = navigator.userAgent;
			var val = agentVal.split('Edge/');
			var edge_ver = val[1].slice(0, 2);
			//var edge_ver = Number(window.navigator.userAgent.match(/Edge\/\d+\.(\d+)/)[1], 10);
			if (edge_ver < blockEdgeVersion) {
				$('.provider-pre-call-testing-wrapper').css('display', 'none');
				$('.special-message-banner-container').css('display', 'block');
			}
		}
	}
	if (isChrome) {
		if (blockChrome) {
			$('.provider-pre-call-testing-wrapper').css('display', 'none');
			$('.special-message-banner-container').css('display', 'block');
		} else {
			var blockChromeVersion = $("#blockChromeVersion").val() ? Number($("#blockChromeVersion").val()) : 61;
			var chrome_ver = Number(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
			if (chrome_ver < blockChromeVersion) {
				$('.provider-pre-call-testing-wrapper').css('display', 'none');
				$('.special-message-banner-container').css('display', 'block');
			}
		}
	}
	if (isFirefox) {
		if (blockFF) {
			$('.provider-pre-call-testing-wrapper').css('display', 'none');
			$('.special-message-banner-container').css('display', 'block');
		} else {
			var blockFirefoxVersion = $("#blockFirefoxVersion").val() ? Number($("#blockFirefoxVersion").val()) : 60;
			var firefox_ver = Number(window.navigator.userAgent.match(/Firefox\/(\d+)\./)[1], 10);
			if (firefox_ver < blockFirefoxVersion) {
				$('.provider-pre-call-testing-wrapper').css('display', 'none');
				$('.special-message-banner-container').css('display', 'block');
			}
		}
	}
	if (isSafari) {
		if (blockSafari) {
			$('.provider-pre-call-testing-wrapper').css('display', 'none');
			$('.special-message-banner-container').css('display', 'block');
		} else {
			var agent = navigator.userAgent;
			var majorMinorDot = agent.substring(agent.indexOf('Version/') + 8, agent.lastIndexOf('Safari')).trim();
			var majorVersion = majorMinorDot.split('.')[0];
			var versionNumber = parseFloat(majorMinorDot);
			// Block access from Safari version 12.
			var blockSafariVersion = $("#blockPexipSafariVersion").val() ? Number($("#blockPexipSafariVersion").val()) :
				11.1;
			if (versionNumber < blockSafariVersion) {
				$('.provider-pre-call-testing-wrapper').css('display', 'none');
				$('.special-message-banner-container').css('display', 'block');
			}
		}
	}
	if (isIE && blockIE) {
		$('.provider-pre-call-testing-wrapper').css('display', 'none');
		$('.special-message-banner-container').css('display', 'block');
	}

	$("#precall-start").click(function () {
		// JOIN CLICK
		if (browserUserAgent.indexOf('Firefox/') !== -1) {
			video.src = '';
			selfvideo.src = '';
		}
		console.log('Start Test VMR');
		$(this).css('display', 'none');
		$('#video').css('visibility', 'visible');
		$('#selfvideo').css('visibility', 'visible');
		$('.video-preview-block').addClass('no-background');
		toggleDropDownAccess(false);
		VideoVisitSetupWizard.createMeeting();
	});

	function toggleDropDownAccess(clickable) {
		if (clickable) {
			$('#videoSource').removeClass('disable-access');
			$('#audioSource').removeClass('disable-access');
			$('#speakerSource').removeClass('disable-access');
		} else {
			$('#videoSource').addClass('disable-access');
			$('#audioSource').addClass('disable-access');
			$('#speakerSource').addClass('disable-access');
		}
	}
</script>
