<link rel="stylesheet" href="css/library/conference/main-webrtc.css">
<div class="pre-call-testing-header">
	<div class="tpmg-logo">
		<img src="images/conference/TPMG_logo.png" alt="TPMG" />
		<div class="precall-logo-text">
			<p class="precall-logo-vv-text">Video Visits</p>
			<p class="precall-logo-group-text">The Permanente Medical Group</p>
		</div>
	</div>
	<a class="help-link" href="mdohelp.htm" target="_blank">Help</a>
</div>
<!-- pre call testing webrtc starts -->
<!-- <div class="connectivity-test-indicator">
	<span class="connectivity-inprogress">Checking Video Quality...</span>
	<span class="connectivity-weak"><b>Weak</b> Video Quality <span class="weak-signal"></span></span>
	<span class="connectivity-strong"><b>Strong</b> Video Quality <span class="strong-signal"></span></span>
</div>
<div class="mdo-app-message-container">
	<div class="mdo-logo"></div>
	<div class="mdo-message">
		<p>We recommend joining your visit using <b>My Doctor Online</b> App.</p>
		<p><span class="ios-appstore"></span><span class="android-playstore"></span></p>
	</div>
</div> -->
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
				<select id="audioOutput"></select>
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
		<div class="video-visit-peripherals-block">
			<video id="video" playsinline autoplay></video>
		</div>
		<!-- webrtc video container block ends-->
	</div>
	<!-- <div>
		<iframe src="" width="500" style="border:none;display:block !important" height="500" name="iframe_a"></iframe>
		<p><a href="https://test.webrtc.org/" target="iframe_a">Check Bandwidth</a></p>
	</div> -->
	<div class="precall-test-button-container">
		<button id="precall-backBtn" class="">Back</button>
		<button id="precall-joinBtn" class="add-margin">Join</button>
	</div>

</div>

<script src="js/site/videovisit/videoVisit.js" type="text/javascript"></script>
<!-- pre call testing webrtc ends -->
<link rel="stylesheet" type="text/css" href="css/library/conference/jNotify.jquery.css" media="screen" />
<link rel="chrome-webstore-item" href="https://chrome.google.com/webstore/detail/fadjebjcpiiklefiadeicakcnkhgbaoo">

<!-- <script src="js/site/meeting/videoVisitPexip.js" type="text/javascript"></script> -->
<script src="js/site/videovisit/videoVisit.js" type="text/javascript"></script>

<script src="js/library/conference/libs/bootstrap.min.2.3.2.js"></script>
<script src="js/library/conference/libs/bootstrap-notify.1.0.js"></script>
<script src="js/site/precalltesting/adapter-latest.js"></script>
<script src="js/site/precalltesting/main_peripherals.js"></script>
<script type="text/javascript">
	$("#precall-joinBtn").on("click", function () {
		var browserUserAgent = navigator.userAgent;
		var isSafari = false;
		var isFirefox = false;
		if (/Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)) {
			isSafari = true;
		} else if (browserUserAgent.indexOf('Firefox/') !== -1) {
			isFirefox = true;
		}
		var vendor = $("#vendor").val();
		if (vendor == "pexip" && !$(".video-visit-peripherals-block").find("select#videoSource  option:selected")
			.text() && (isSafari || isFirefox)) {
			$('#dialog-block-meeting-browser').modal({
				'backdrop': 'static'
			});
			return;
		}
		var peripheralsStorageObject = {
			'camera': $(".video-visit-peripherals-block").find("select#videoSource  option:selected").text(),
			'mic': $(".video-visit-peripherals-block").find("select#audioSource  option:selected").text(),
			'speakers': $(".video-visit-peripherals-block").find("select#audioOutput  option:selected").text()
		};
		// Put the object into storage
		peripheralsStorageObject.attachedPreferredCamera = false;
		localStorage.setItem('peripheralsStorageObject', JSON.stringify(peripheralsStorageObject));
		localStorage.setItem('isPeripheralsAssigned', true);
		localStorage.setItem('isPeripheralsAssignedAutomatically', false);
		$("#layover").show();

		// AJAX call
		$.ajax({
			type: "POST",
			url: VIDEO_VISITS.Path.visit.setPeripheralsFlag,
			cache: false,
			dataType: "json",
			data: {
				"showPeripheralsPage": "false"
			},
			success: function (result, textStatus) {
				console.log(result);
				var params = ['info', 'preCallJoinEvent',
					"Pre-call screen displayed to user, who selected join"
				];
				VideoVisit.logVendorMeetingEvents(params);
				window.location.reload();
			},
			error: function (textStatus) {
				$("#layover").hide();
			}
		});

	});

	$("#precall-backBtn").on("click", function () {
		var params = ['info', 'preCallBackEvent', "Pre-call screen displayed to user, who selected cancel"];
		VideoVisit.logVendorMeetingEvents(params);
		//window.history.back();
		if ($("#isMember").val() == "true") {
			window.location.href = 'landingready.htm';
		} else {
			window.location.href = 'guestready.htm';
		}
	});

	function disconnect() {
		window.location.href = 'landingready.htm';
	}
</script>

<div id="dialog-block-meeting-browser" class="modal hide fade" tabindex="-1" role="dialog"
	aria-labelledby="userLoginLabel" aria-hidden="true">
	<div class="modal-title" style="background: #ccc;padding: 1%;">Unable to access your camera or microphone</div>
	<div class="modal-body">
		<div class="dialog-content-question">
			<p id="start_meeting_question" style="padding:15px;font-weight:bold;text-align:center;" class="question">
				Check that your camera is properly connected or not being actively used by another application.
			</p>
			<div class="pagination">
				<input type="button" style="width:150px;" value="OK" onclick="return disconnect()"
					id="meetingDisconnected" class="button">
			</div>
		</div>
	</div>
</div>