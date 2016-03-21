<h3 class="sso-page-title">Please sign on for your Video Visit</h3>
<div  style="width: 40%; margin-left: 84px;float: left">
<p class="sso-login">Use your kp.org user name and password</p>
<form id="ssoLoginForm" method="post" action="" style="overflow:auto;">
    <div>
	    <ul class="sso-form-block">
	        <li><input type="text" name="username" id="username" placeholder="kp.org user name" tabindex="1"></li>
	        <li><input type="password" name="password" id="password" placeholder="password" tabindex="2"></li>
	        
	  	</ul>
	  	<div class="sso-submit-block" style="overflow:auto;">
	        <input type="submit" name="ssologin" value="Sign on" id="ssologin" class="button" tabindex="3" disabled="disabled" >
	    </div>
	    
	    <div class="sso-submit-block-temp-access">
	        <label  tabindex="4">Temporary access</label>
	    </div>
  	</div> 
</form>
</div>
<div id="ssoLoginError" style="float: right">
	    <p id="globalError" style="width:300px; height:35px; color:#ac5a41; font-weight:bold;margin-top: 28px;">There was an error authenticating your account.  Please sign in using temporary access.</p>
</div> 
<!--<p class="error error-login"><a name="errors"></a></p>-->

<script type="text/javascript">

	var browserInfo = getBrowserInfo();
	var browserVersion = (browserInfo.version).split(".")[0];
	
	if(browserInfo.isChrome) {

		var browserNotSupportedMsgForPatient = "Video Visits does not currently support your browser version.";
		browserNotSupportedMsgForPatient += "<br /><br />";
		browserNotSupportedMsgForPatient += "Please try again using Internet Explorer for Windows or Safari for Mac.";

		if(navigator.appVersion.indexOf("Mac") != -1 && browserVersion >= 39) {
			$('p#globalError').html(browserNotSupportedMsgForPatient);
			$("p#globalError").removeClass("hide-me");

			document.getElementById("last_name").disabled = true;
			document.getElementById("mrn").disabled = true;
			document.getElementById("birth_month").disabled = true;
			document.getElementById("birth_year").disabled = true;
			document.getElementById("login").disabled = true;
		}
		else if(navigator.appVersion.indexOf("Win") != -1) {
			if((browserInfo.is32BitOS == false && browserVersion >= 40) || (browserVersion >= 42)){
				$('p#globalError').html(browserNotSupportedMsgForPatient);
				$("p#globalError").removeClass("hide-me");

				document.getElementById("last_name").disabled = true;
				document.getElementById("mrn").disabled = true;
				document.getElementById("birth_month").disabled = true;
				document.getElementById("birth_year").disabled = true;
				document.getElementById("login").disabled = true;
			}
		}
	}
</script>
