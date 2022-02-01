<!-- <div class="page-content">
	<div class="alert alert-hero alert-expired">
		<div class="alert-hero-message">
			<div class="image"></div>
			<p>The Video Visit you are trying to join is no longer available as the meeting has ended or expired.</p>
			<div style="text-align:center">
				<button class="button-main" onclick="window.location='mobileAppPatientMeetings.htm'">Go Back</button>
			</div>
		</div>
	</div>
</div>-->

<div class="page-content" style="width:100%; height:100%; background:url('images/mobile/bkgrnd-faded.png') no-repeat center center; background-size:cover; margin:0; padding:0;">

	<div class="visits patient" style="padding:6px; overflow:hidden;">
		<h1 style="width:100%; padding:8px 0; text-align:center; color:#FFFFFF; background-color:#706259; border-radius:3px; margin:20px 0 2px;"> Video Visits </h1>
		
		<!-- If Meeting Expired -->
		<div class="alert alert-hero alert-expired" style="background-color:#FFFFFF; box-shadow:none;">
			<div class="alert-hero-message">
				<!-- <div class="image" style="background:url('images/mobile/video-icon-gray.png') no-repeat center; margin:-10px 15px 0 0; background-size:contain;"></div>
				<p style=""><strong>You have no Video Visits scheduled within the next 15 minutes. Please check back again later.</strong></p>	 -->
				
				<div class="image"></div>
				<p><strong>The Video Visit you are trying to join is no longer available as the meeting has ended or expired.</strong></p>
			</div>
		</div>
		
		<!-- Go Back button - Start -->
		<div style="min-height:45px; padding-left:32px;">
			<div style="float:right;">
				<button onclick="window.location='mobileAppPatientMeetings.htm?inAppBrowserFlag=true'" style="width:136px; height:45px; color:#FFFFFF; background-color:#0061A9; padding:10px 5px; border-radius:4px; font-size:16px;"> Go Back </button>
			</div>
		</div>
	</div>

	<!-- Fake Footer - to adjust the length of the Background image -->
	<div style="visibility:none; margin:150px 0;">
		<br/>
		<br/>
		<br/>
		<br/>
	</div>
	<!-- Fake Footer - to adjust the length of the Background image -->

</div>