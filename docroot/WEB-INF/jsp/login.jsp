

<h3 class="page-title">Member Login</h3>
<p class="login">Children age 11 or younger may not use this website alone. A parent or legal guardian may use this website and have the child with them during the visit.</p>
<p class="login">Please sign on by completing the fields below.</p>
<form id="loginForm" method="post" action="">
    <ul class="form-block">
        <li><label for="last_name">Last Name</label><input type="text" name="last_name" id="last_name" tabindex="1"></li>
        <li><label for="mrn">Medical Record Number</label><input type="text" name="mrn" id="mrn" maxlength="8" tabindex="2"></li>
        <li>
            <label>Date of Birth</label>
            <label class="label-month" for="birth_month">Month</label>
            <input type="text" name="birth_month" title="mm" id="birth_month" class="birth_month" maxlength="2" tabindex="3">

            <label class="label-day" for="birth_day">Day</label>
            <input type="text" name="birth_day" title="dd" id="birth_day" class="birth_day" maxlength="2" tabindex="4">

            <label class="label-year" for="birth_year">Year</label>
            <input type="text" name="birth_year" title="yyyy" class="birth_year" id="birth_year" maxlength="4" tabindex="5">
        </li>
        <!--  
        <li><label id="captchaLabel" for="captcha">Enter Code Shown</label><a id="captchaImage" href="#" tabindex="100"><img width="160" id="stickyImg" src="stickyImg" alt="captcha image" class="gfx-captcha" /></a><input type="text" name="captcha" id="captcha" class="captcha" maxlength="5" tabindex="6"></li>
        <li class="smallprint align-right">Click image to refresh. Letters are case sensitive</li>
        -->
  	</ul>
    <div class="submit-block">
        <input type="submit" name="login" value="Login &rsaquo;&rsaquo;" id="login" class="button" tabindex="7">
    </div>
</form>
<p class="error error-login"><a name="errors"></a></p>
<script type="text/javascript">

	var browserInfo = getBrowserInfo();
	var browserVersion = (browserInfo.version).split(".")[0];

	/*if(browserInfo.isIE) {
		if (((browserInfo.version == 8 || browserInfo.version == 9 || browserInfo.version == 10 || browserInfo.version == 11) && !browserInfo.is32Bit) || browserInfo.version <= 7){
			
			var browserNotSupportedMsg = "Video Visits is supported on 32 bit browsers only.";
			browserNotSupportedMsg += "<br /><br />";
			browserNotSupportedMsg += "Your current browser is unsupported."
			browserNotSupportedMsg += "<br /><br />";
			browserNotSupportedMsg += "Please <a href='mdohelp.htm' target='_blank'>Download a 32 bit browser</a>";
			
			$('p.error').html( browserNotSupportedMsg );
			
			document.getElementById("last_name").disabled = true;
			document.getElementById("mrn").disabled = true;
			document.getElementById("birth_month").disabled = true;
			document.getElementById("birth_day").disabled = true;
			document.getElementById("birth_year").disabled = true;
			document.getElementById("login").disabled = true;
		}
	}*/
	if(browserInfo.isChrome) {

		var browserNotSupportedMsgForPatient = "Video Visits does not currently support your browser version.";
		browserNotSupportedMsgForPatient += "<br /><br />";
		browserNotSupportedMsgForPatient += "Please try again using Internet Explorer for Windows or Safari for Mac.";

		if(navigator.appVersion.indexOf("Mac") != -1 && browserVersion >= 39) {
			$('p.error').html(browserNotSupportedMsgForPatient);

			document.getElementById("last_name").disabled = true;
			document.getElementById("mrn").disabled = true;
			document.getElementById("birth_month").disabled = true;
			document.getElementById("birth_day").disabled = true;
			document.getElementById("birth_year").disabled = true;
			document.getElementById("login").disabled = true;
		}
		else if(navigator.appVersion.indexOf("Win") != -1) {
			if((browserInfo.is32BitOS == false && browserVersion >= 40) || (browserVersion >= 42)){
				$('p.error').html(browserNotSupportedMsgForPatient);

				document.getElementById("last_name").disabled = true;
				document.getElementById("mrn").disabled = true;
				document.getElementById("birth_month").disabled = true;
				document.getElementById("birth_day").disabled = true;
				document.getElementById("birth_year").disabled = true;
				document.getElementById("login").disabled = true;
			}
		}
	}
</script>
