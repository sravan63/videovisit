<input type="hidden" id="blockChrome" value="${WebAppContext.blockChrome}" />
<input type="hidden" id="blockFF" value="${WebAppContext.blockFF}" />
<input type="hidden" id="blockPexipIE" value="${WebAppContext.blockPexipIE}" />
<!-- US35718 changes -->
<input type="hidden" id="blockEdge" value="${WebAppContext.blockEdge}" />
<input type="hidden" id="blockSafari" value="${WebAppContext.blockSafari}" />
<input type="hidden" id="blockSafariVersion" value="${WebAppContext.blockSafariVersion}" />
<!-- US35718 changes -->
<input type="hidden" id="blockPexipSafariVersion" value="${WebAppContext.pexBlockSafariVer}" />
<input type="hidden" id="blockChromeVersion" value="${WebAppContext.pexBlockChromeVer}" />
<input type="hidden" id="blockFirefoxVersion" value="${WebAppContext.pexBlockFirefoxVer}" />
<input type="hidden" id="blockEdgeVersion" value="${WebAppContext.pexBlockEdgeVer}" />

<h3 class="page-title">Please sign on for your Video Visit</h3>
<p class="login" style="margin-bottom:43px;">Children age 11 or younger must have a parent or legal guardian with them
	during the Video Visit.</p>
<!-- Block Message -->
<div class="special-message-banner-container" id="blockerMessage">
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

<form id="loginForm" method="post" action="" style="overflow:auto;">
	<div style="float:left;">
		<ul class="form-block" style="float:left;">
			<li><label for="last_name">Patient's Last Name</label><input type="text" name="last_name" id="last_name"
					tabindex="1"></li>
			<li><label for="mrn">Medical Record Number</label><input type="text" name="mrn" id="mrn" maxlength="8"
					tabindex="2"></li>
			<li>
				<label for="birth_date">Date of Birth</label>
				<input type="text" name="birth_month" placeholder="mm" class="birth_month" id="birth_month"
					maxlength="2" tabindex="3">
				<input type="text" name="birth_year" placeholder="yyyy" class="birth_year" id="birth_year" maxlength="4"
					tabindex="4">
			</li>
		</ul>
		<div class="submit-block" style="overflow:auto;">
			<input type="submit" name="login" value="Sign On" id="login" class="button" tabindex="4" style=""
				disabled="disabled">
		</div>
	</div>
	<div style="float:right;">
		<p id="globalError" class="error hide-me" style="width:300px; height:35px; color:#ac5a41; font-weight:bold;">
		</p>
	</div>
    
</form>
<!--<p class="error error-login"><a name="errors"></a></p>-->
<style>
	.error{
		width: 250px;
		height: 100px;
	}
	.hide-me{
		display: none;
	}
	input#login{
		opacity: 0.5;
		filter: alpha(opacity=50);
	}
	.login{
		margin-bottom: 43px;
		padding-left: 38px;
	}
	.page-title{
		margin-top: 100px;
		color: #000000;
		font-weight: bold;
		padding-left: 38px;
	}
	.form-block{
		margin-bottom: 43px;
		margin-left: 0;
		padding-left: 38px;
	}
	.form-block label{
		font-size: 13px;
	}
	.form-block input{
		width: 220px;
		height: 25px;
		padding: 0 0 0 5px;
	}
	.form-block .birth_month{
		width: 55px;
	}
	.form-block .birth_year{
		width: 80px;
	}
	.submit-block{
		padding-left: 38px;
		margin-left: 0;
	}
	.submit-block .button{
		font-size: 16px;
		width: 118px;
		height: 30px;
		float: right;
		cursor: default;
		color: #FFFFFF;
		background-color: #006ba6;
		margin: 0;
		padding: 0;
	}
</style>

<script type="text/javascript">
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
			$('#blockerMessage').css('display', 'block');
			$("#loginForm :input").prop("disabled", true);
		} else {
			var blockEdgeVersion = $("#blockEdgeVersion").val() ? Number($("#blockEdgeVersion").val()) : 18;
			var agentVal = navigator.userAgent;
			var val = agentVal.split('Edge/');
			var edge_ver = val[1].slice(0, 2);
			//var edge_ver = Number(window.navigator.userAgent.match(/Edge\/\d+\.(\d+)/)[1], 10);
			if (edge_ver < blockEdgeVersion) {
				$('#blockerMessage').css('display', 'block');
				$("#loginForm :input").prop("disabled", true);
			}
		}
	}
	if (isChrome) {
		if (blockChrome) {
			$('#blockerMessage').css('display', 'block');
			$("#loginForm :input").prop("disabled", true);
		} else {
			var blockChromeVersion = $("#blockChromeVersion").val() ? Number($("#blockChromeVersion").val()) : 61;
			var chrome_ver = Number(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
			if (chrome_ver < blockChromeVersion) {
				$('#blockerMessage').css('display', 'block');
				$("#loginForm :input").prop("disabled", true);
			}
		}
	}
	if (isFirefox) {
		if (blockFF) {
			$('#blockerMessage').css('display', 'block');
			$("#loginForm :input").prop("disabled", true);
		} else {
			var blockFirefoxVersion = $("#blockFirefoxVersion").val() ? Number($("#blockFirefoxVersion").val()) : 60;
			var firefox_ver = Number(window.navigator.userAgent.match(/Firefox\/(\d+)\./)[1], 10);
			if (firefox_ver < blockFirefoxVersion) {
				$('#blockerMessage').css('display', 'block');
				$("#loginForm :input").prop("disabled", true);
			}
		}
	}
	if (isSafari) {
		if (blockSafari) {
			$('#blockerMessage').css('display', 'block');
			$("#loginForm :input").prop("disabled", true);
		} else {
			var agent = navigator.userAgent;
			var majorMinorDot = agent.substring(agent.indexOf('Version/') + 8, agent.lastIndexOf('Safari')).trim();
			var majorVersion = majorMinorDot.split('.')[0];
			var versionNumber = parseFloat(majorMinorDot);
			// Block access from Safari version 12.
			var blockSafariVersion = $("#blockPexipSafariVersion").val() ? Number($("#blockPexipSafariVersion").val()) :
				11.1;
			if (versionNumber < blockSafariVersion) {
				$('#blockerMessage').css('display', 'block');
				$("#loginForm :input").prop("disabled", true);
			}
		}
	}
	if (isIE && blockIE) {
		$('#blockerMessage').css('display', 'block');
		$("#loginForm :input").prop("disabled", true);
	}
	var validateAutoFill = function () {
		//console.log("====> Testing Auto Fill");
		if ($('#last_name').val() != "" && $('#mrn').val() != "" && $('#birth_month').val() != "" && $('#birth_year')
			.val() != "") {
			//console.log("====> Auto Fill Executed");
			$('#login').removeAttr('disabled');
			$('#login').css('cursor', 'pointer');
			$('input#login').css('opacity', '1.0');
		} else {
			//console.log("====> Auto Fill Not Executed");
			//DE4286-Firefox fix (cache issue - it keeps the entries in the text box even after refresh)
			$("#last_name").val("");
			$("#mrn").val("");
			$("#birth_month").val("");
			$("#birth_year").val("");
			
			$('#login').attr('disabled', true);
		    $('#login').css('cursor', 'default');
		    $('input#login').css('opacity', '0.5');
		}
	};
	
	/* DE10832 - Validating autofill and enabling signon button on load */
	var validateChromeAutoFill = function(){
		//console.log("====> Testing Auto Fill");
		if ($('#last_name').css("background-color") == "rgb(250, 255, 189)" && $('#mrn').css("background-color") ==
			"rgb(250, 255, 189)" && $('#birth_month').css("background-color") == "rgb(250, 255, 189)" && $(
				'#birth_year').css("background-color") == "rgb(250, 255, 189)") {
			//console.log("====> Chrome Auto Fill Executed");
			$('#login').removeAttr('disabled');
	        $('#login').css('cursor', 'pointer');
	        $('input#login').css('opacity', '1.0');
		}else{
			//console.log("====> Chrome Auto Fill Not Executed");
			//DE4286-Firefox fix (cache issue - it keeps the entries in the text box even after refresh)
			$("#last_name").val("");
			$("#mrn").val("");
			$("#birth_month").val("");
			$("#birth_year").val("");
			
			$('#login').attr('disabled', true);
		    $('#login').css('cursor', 'default');
		    $('input#login').css('opacity', '0.5');
		}
	};

	if(browserInfo.isFirefox){
			setTimeout(function(){
				validateAutoFill();
			},1000);
		}else if(browserInfo.isChrome){
			setTimeout(function(){
				validateChromeAutoFill();
			},1000);
	}
</script>
