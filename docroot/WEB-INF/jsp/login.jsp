

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

	function getBrowserInfo() {
	
		var browserUserAgent = navigator.userAgent;
		
		
		var browserInfo = new Object();
		
		browserInfo.is32Bit = true;
	
		if (browserUserAgent.indexOf("x64") != -1) {
			browserInfo.is32Bit = false;
		}
		browserInfo.is32BitOS = true;
	
		if (browserUserAgent.indexOf("WOW64") != -1 || browserUserAgent.indexOf("Win64") != -1 ){
			browserInfo.is32BitOS = false;
		} 
	
		browserInfo.isIE = false;
		browserInfo.isFirefox = false;
		browserInfo.isChrome = false;
		browserInfo.isSafari = false;
		
		var jqBrowserInfoObj = $.browser; 
	
		browserInfo.version = jqBrowserInfoObj.version;
		
		if ( jqBrowserInfoObj.mozilla) {
			browserInfo.isFirefox = true;
		} else if ( jqBrowserInfoObj.msie){
			browserInfo.isIE = true;
		} else if ( jqBrowserInfoObj.chrome){
			browserInfo.isChrome = true;
		} else if ( jqBrowserInfoObj.safari){
			browserInfo.isSafari = true;
		}
	
		return browserInfo;
	}	

	var browserInfo = getBrowserInfo();
	
	var browserNotSupportedMsg = "Video Visit is currently supported on 32 bit browsers only.";
	browserNotSupportedMsg += "<br /><br />";
	browserNotSupportedMsg += "You are currently running an unsupported browser.";
	browserNotSupportedMsg += "<br /><br />";
	browserNotSupportedMsg += "Click <a href='mdohelp.htm' target='_blank'>Help</a> to find out more about supported browsers.";
	
	if(browserInfo.isIE) {
		if (((browserInfo.version == 8 || browserInfo.version == 9) && !browserInfo.is32Bit) || browserInfo.version <= 7) {
			$('p.error').html( browserNotSupportedMsg );
			
			document.getElementById("last_name").disabled = true;
			document.getElementById("mrn").disabled = true;
			document.getElementById("birth_month").disabled = true;
			document.getElementById("birth_day").disabled = true;
			document.getElementById("birth_year").disabled = true;

			document.getElementById("login").disabled = true;
		} 
	}
	
</script>
