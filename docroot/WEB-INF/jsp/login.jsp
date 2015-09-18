
<h3 class="page-title">Member Login</h3>
<p class="login">Children age 11 or younger may not use this website alone. A parent or legal guardian may use this website and have the child with them during the visit.</p>
<p class="login">Please sign on by completing the fields below.</p>
<form id="loginForm" method="post" action="">
    <ul class="form-block" style="float:left;">
        <li><label for="last_name">Last Name</label><input type="text" name="last_name" id="last_name" tabindex="1"></li>
        <li><label for="mrn">Medical Record Number</label><input type="text" name="mrn" id="mrn" maxlength="8" tabindex="2"></li>
        <li>
            <label for="birth_date">Date of Birth</label>
            <input type="text" name="birth_month" placeholder="mm" class="birth_month" id="birth_month" maxlength="2" tabindex="3" style="width:90px;">
            <input type="text" name="birth_year" placeholder="yyyy" class="birth_year" id="birth_year" maxlength="4" tabindex="4" style="width:108px;">
        </li>
  	</ul>
  	<div style="float:right;">
		<p id="globalError" class="error hide-me" style="width:300px; height:35px; color:#ac5a41; font-weight:bold;"> </p>
	</div>
    <div class="submit-block" style="overflow:auto;">
        <input type="submit" name="login" value="Login &rsaquo;&rsaquo;" id="login" class="button" tabindex="4" style="float:right; cursor:default;" disabled="disabled">
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
	}
</style>

<script type="text/javascript">

	var browserInfo = getBrowserInfo();
	var browserVersion = (browserInfo.version).split(".")[0];
	
	if(browserInfo.isChrome) {

		var browserNotSupportedMsgForPatient = "Video Visits does not currently support your browser version.";
		browserNotSupportedMsgForPatient += "<br /><br />";
		browserNotSupportedMsgForPatient += "Please try again using Internet Explorer for Windows or Safari for Mac.";

		if(navigator.appVersion.indexOf("Mac") != -1 && browserVersion >= 39) {
			$('p.error').html(browserNotSupportedMsgForPatient);

			document.getElementById("last_name").disabled = true;
			document.getElementById("mrn").disabled = true;
			document.getElementById("birth_month").disabled = true;
			document.getElementById("birth_year").disabled = true;
			document.getElementById("login").disabled = true;
		}
		else if(navigator.appVersion.indexOf("Win") != -1) {
			if((browserInfo.is32BitOS == false && browserVersion >= 40) || (browserVersion >= 42)){
				$('p.error').html(browserNotSupportedMsgForPatient);

				document.getElementById("last_name").disabled = true;
				document.getElementById("mrn").disabled = true;
				document.getElementById("birth_month").disabled = true;
				document.getElementById("birth_year").disabled = true;
				document.getElementById("login").disabled = true;
			}
		}
	}
</script>
