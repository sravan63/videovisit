<link rel="stylesheet" href="vidyoplayer/css/main-webrtc.css">
<!-- pre call testing webrtc starts -->
<div class="pre-call-testing-wrapper">
	<div class="tpmg-logo"><img src="vidyoplayer/img/TPMG_logo.png" alt="TPMG"/><span class="precall-logo-vv-text">Video Visits</span></div>
	<div class="pre-call-test-container">
		<!-- Peripherals container block starts -->
		<div class="video-visit-peripherals-block">
			<div class="select">
				<label for="videoSource">Camera</label>
                <span class="caret"></span>
				<select id="videoSource"></select>
			</div>
			<div class="select">
				<label for="audioSource">Mic</label>
				<span class="caret"></span>
				<select id="audioSource"></select>
			</div>
			<div class="select">
				<label for="audioOutput">Speakers</label>
                <span class="caret"></span>
				<select id="audioOutput"></select>
			</div>
		</div>
		<!-- Peripherals container block ends -->
		<!-- webrtc video container block starts-->
		<div class="video-visit-peripherals-block">
			<video id="video" playsinline autoplay></video>
		</div>
		<!-- webrtc video container block ends-->
	</div>
	<div class="precall-test-button-container">
		<button id="precall-backBtn" class="">Back</button>
		<button id="precall-joinBtn" class="">Join</button>
	</div>

</div>
<!-- pre call testing webrtc ends -->

<script src="vidyoplayer/scripts/webrtc/precalltesting/adapter-latest.js"></script>
<script src="vidyoplayer/scripts/webrtc/precalltesting/main_peripherals.js"></script>
<script type="text/javascript">
	
	$("#precall-joinBtn").on("click",function(){
		var peripheralsStorageObject = {
		'camera': $(".video-visit-peripherals-block").find("select#videoSource  option:selected" ).text(),
		'mic': $(".video-visit-peripherals-block").find("select#audioSource  option:selected" ).text(),
		'speakers':$(".video-visit-peripherals-block").find("select#audioOutput  option:selected" ).text()
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
			data: {"showPeripheralsPage":"false"},
			success: function(result, textStatus){
				console.log(result);
				var params = ['info','preCallJoinEvent',"Pre-call screen displayed to user, who selected join"];
            	VideoVisit.logVendorMeetingEvents(params);
				window.location.reload();
			},
			error: function(textStatus){
				$("#layover").hide();
			}
		});

});

$("#precall-backBtn").on("click", function(){
	var params = ['info','preCallBackEvent',"Pre-call screen displayed to user, who selected cancel"];
    VideoVisit.logVendorMeetingEvents(params);
	//window.history.back();
	if($("#isMember").val() == "true"){
	 window.location.href =  'landingready.htm';
	} else {
	 window.location.href =  'guestready.htm';
	}
});

</script>