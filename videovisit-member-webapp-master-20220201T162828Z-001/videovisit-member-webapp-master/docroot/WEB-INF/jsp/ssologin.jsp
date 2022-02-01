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

<h3 class="sso-page-title">Please sign on for your Video Visit</h3>
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
<div style="width: 40%; margin-left: 84px;float: left">
	<p class="sso-login">Use your kp.org user name and password</p>

	<form id="ssoLoginForm" method="post" action="" style="overflow:auto;">
		<div>
			<ul class="sso-form-block">
				<li><input type="text" name="username" id="username" placeholder="kp.org user name" tabindex="1"></li>
				<li><input type="password" name="password" id="password" placeholder="password" tabindex="2"></li>
			</ul>
			<div class="sso-submit-block" style="overflow:auto;">
				<input type="submit" name="ssologin" value="Sign on" id="ssologin" class="button" tabindex="3"
					disabled="disabled">
			</div>

			<a href="login.htm" id="temp-access"> Temporary access </a>
		</div>
	</form>
</div>
<div id="ssoLoginError" style="float: right">
    <p id="globalError">There was an error authenticating your account. Please sign in using temporary access.</p>
</div> 
<!--<p class="error error-login"><a name="errors"></a></p>-->

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
			$("#ssoLoginForm :input").prop("disabled", true);
			$('#temp-access').click(function (e) {
				e.preventDefault();
			});
			$('#temp-access').css('color', '#A9A9A9').css('cursor', 'default');
		} else {
			var blockEdgeVersion = $("#blockEdgeVersion").val() ? Number($("#blockEdgeVersion").val()) : 18;
			var agentVal = navigator.userAgent;
			var val = agentVal.split('Edge/');
			var edge_ver = val[1].slice(0, 2);
			//var edge_ver = Number(window.navigator.userAgent.match(/Edge\/\d+\.(\d+)/)[1], 10);
			if (edge_ver < blockEdgeVersion) {
				$('#blockerMessage').css('display', 'block');
				$("#ssoLoginForm :input").prop("disabled", true);
				$('#temp-access').click(function (e) {
					e.preventDefault();
				});
				$('#temp-access').css('color', '#A9A9A9').css('cursor', 'default');
			}
		}
	}
	if (isChrome) {
		if (blockChrome) {
			$('#blockerMessage').css('display', 'block');
			$("#ssoLoginForm :input").prop("disabled", true);
			$('#temp-access').click(function (e) {
				e.preventDefault();
			});
			$('#temp-access').css('color', '#A9A9A9').css('cursor', 'default');
		} else {
			var blockChromeVersion = $("#blockChromeVersion").val() ? Number($("#blockChromeVersion").val()) : 61;
			var chrome_ver = Number(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
			if (chrome_ver < blockChromeVersion) {
				$('#blockerMessage').css('display', 'block');
				$("#ssoLoginForm :input").prop("disabled", true);
				$('#temp-access').click(function (e) {
					e.preventDefault();
				});
				$('#temp-access').css('color', '#A9A9A9').css('cursor', 'default');
			}
		}
	}
	if (isFirefox) {
		if (blockFF) {
			$('#blockerMessage').css('display', 'block');
			$("#ssoLoginForm :input").prop("disabled", true);
			$('#temp-access').click(function (e) {
				e.preventDefault();
			});
			$('#temp-access').css('color', '#A9A9A9').css('cursor', 'default');
		} else {
			var blockFirefoxVersion = $("#blockFirefoxVersion").val() ? Number($("#blockFirefoxVersion").val()) : 60;
			var firefox_ver = Number(window.navigator.userAgent.match(/Firefox\/(\d+)\./)[1], 10);
			if (firefox_ver < blockFirefoxVersion) {
				$('#blockerMessage').css('display', 'block');
				$("#ssoLoginForm :input").prop("disabled", true);
				$('#temp-access').click(function (e) {
					e.preventDefault();
				});
				$('#temp-access').css('color', '#A9A9A9').css('cursor', 'default');
			}
		}
	}
	if (isSafari) {
		if (blockSafari) {
			$('#blockerMessage').css('display', 'block');
			$("#ssoLoginForm :input").prop("disabled", true);
			$('#temp-access').click(function (e) {
				e.preventDefault();
			});
			$('#temp-access').css('color', '#A9A9A9').css('cursor', 'default');
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
				$("#ssoLoginForm :input").prop("disabled", true);
				$('#temp-access').click(function (e) {
					e.preventDefault();
				});
				$('#temp-access').css('color', '#A9A9A9').css('cursor', 'default');
			}
		}
	}
	if (isIE && blockIE) {
		$('#blockerMessage').css('display', 'block');
		$("#ssoLoginForm :input").prop("disabled", true);
		$('#temp-access').click(function (e) {
			e.preventDefault();
		});
		$('#temp-access').css('color', '#A9A9A9').css('cursor', 'default');
	}

	/* DE10832 - Validating autofill and enabling signon button on load */
	var validateAutoFill = function () {
		//console.log("Testing Auto Fill");
		if ($('#username').val() != "" && $('#password').val() != "") {
			//console.log("====> Auto Fill Executed");
			$('#ssologin').removeAttr('disabled');
			$('#ssologin').css('cursor', 'pointer');
			$('input#ssologin').css('opacity', '1.0');
		} else {
			//console.log("====> Auto Fill Not Executed");
			$('#username').val('');
			$('#password').val('');
			$('#ssologin').attr('disabled', true);
			$('#ssologin').css('cursor', 'default');
			$('input#ssologin').css('opacity', '0.5');
		}
	};

	/* DE10832 - Validating autofill and enabling signon button on load */
	var validateChromeAutoFill = function () {
		//console.log("Testing Chrome Auto Fill");
		if ($('#username').css("background-color") == "rgb(250, 255, 189)" && $('#password').css("background-color") ==
			"rgb(250, 255, 189)") {
			//console.log("====> Auto Fill Executed");
			$('#ssologin').removeAttr('disabled');
			$('#ssologin').css('cursor', 'pointer');
			$('input#ssologin').css('opacity', '1.0');
		} else {
			//console.log("====> Chrome Auto Fill Not Executed");
			$('#username').val('');
			$('#password').val('');
			$('#ssologin').attr('disabled', true);
			$('#ssologin').css('cursor', 'default');
			$('input#ssologin').css('opacity', '0.5');
		}
	};

	if (browserInfo.isFirefox) {
		setTimeout(function () {
			validateAutoFill();
		}, 1000);
	} else if (browserInfo.isChrome) {
		setTimeout(function () {
			validateChromeAutoFill();
		}, 1000);
	}
</script>
