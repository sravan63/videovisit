<input type="hidden" id="blockChrome" value="${WebAppContext.blockChrome}" />
<input type="hidden" id="blockFF" value="${WebAppContext.blockFF}" />

<h3 class="page-title">Please sign on for your Video Visit</h3>
<p class="login" style="margin-bottom:43px;">Children age 11 or younger must have a parent or legal guardian with them during the Video Visit.</p>
<form id="loginForm" method="post" action="" style="overflow:auto;">
    <div style="float:left;">
	    <ul class="form-block" style="float:left;">
	        <li><label for="last_name">Patient's Last Name</label><input type="text" name="last_name" id="last_name" tabindex="1"></li>
	        <li><label for="mrn">Medical Record Number</label><input type="text" name="mrn" id="mrn" maxlength="8" tabindex="2"></li>
	        <li>
	            <label for="birth_date">Date of Birth</label>
	            <input type="text" name="birth_month" placeholder="mm" class="birth_month" id="birth_month" maxlength="2" tabindex="3">
	            <input type="text" name="birth_year" placeholder="yyyy" class="birth_year" id="birth_year" maxlength="4" tabindex="4">
	        </li>
	  	</ul>
	  	<div class="submit-block" style="overflow:auto;">
	        <input type="submit" name="login" value="Sign On" id="login" class="button" tabindex="4" style="" disabled="disabled">
	    </div>
  	</div>
  	<div style="float:right;">
		<p id="globalError" class="error hide-me" style="width:300px; height:35px; color:#ac5a41; font-weight:bold;"> </p>
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

	var browserInfo = getBrowserInfo();
	var browserVersion = (browserInfo.version).split(".")[0];
	var blockChrome = ($("#blockChrome").val() == 'true');
	var blockFF = ($("#blockFF").val() == 'true');
	//US32190 changes
	var browserNotSupportedMsgForPatient = "<span style='font-size:14px;'>Video Visits does not support your browser.</span>";
	browserNotSupportedMsgForPatient += "<br /><br />";
	browserNotSupportedMsgForPatient += "<span style='font-size: 14px;font-weight:normal;'>Please download the <a target='_blank' style='text-decoration:underline;' href='https://mydoctor.kaiserpermanente.org/ncal/mdo/presentation/healthpromotionpage/index.jsp?promotion=kppreventivecare'>My Doctor Online app</a> or use Chrome, Internet Explorer, or Safari.</span>";
	//US32190 changes
	/* DE10832 - Validating autofill and enabling login button on load */
	var validateAutoFill = function(){
		//console.log("====> Testing Auto Fill");
		if($('#last_name').val() != "" && $('#mrn').val() != "" && $('#birth_month').val() != "" && $('#birth_year').val() != ""){
			//console.log("====> Auto Fill Executed");
			$('#login').removeAttr('disabled');
	        $('#login').css('cursor', 'pointer');
	        $('input#login').css('opacity', '1.0');
		}else{
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
		if($('#last_name').css("background-color") == "rgb(250, 255, 189)" && $('#mrn').css("background-color") == "rgb(250, 255, 189)" && $('#birth_month').css("background-color") == "rgb(250, 255, 189)" && $('#birth_year').css("background-color") == "rgb(250, 255, 189)"){
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
	
	/* US21400 - Browser Block Switch - front end (Externalized for Chrome and Firefox) */
	if(browserInfo.isChrome && blockChrome) {
		//US32190 changes
		browserNotSupportedMsgForPatient.replace(' or use Chrome,', '');
		//US32190 changes
		$('p#globalError').html(browserNotSupportedMsgForPatient);
		$("p#globalError").removeClass("hide-me");

		document.getElementById("last_name").disabled = true;
		document.getElementById("mrn").disabled = true;
		document.getElementById("birth_month").disabled = true;
		document.getElementById("birth_year").disabled = true;
		document.getElementById("login").disabled = true;
	}
	else if(browserInfo.isFirefox && blockFF){
		$('p#globalError').html(browserNotSupportedMsgForPatient);
		$("p#globalError").removeClass("hide-me");

		document.getElementById("last_name").disabled = true;
		document.getElementById("mrn").disabled = true;
		document.getElementById("birth_month").disabled = true;
		document.getElementById("birth_year").disabled = true;
		document.getElementById("login").disabled = true;
	}else{
		if(browserInfo.isFirefox){
			setTimeout(function(){
				validateAutoFill();
			},1000);
		}else if(browserInfo.isChrome){
			setTimeout(function(){
				validateChromeAutoFill();
			},1000);
		}
		
		if(browserInfo.isSafari){
	    	var agent = navigator.userAgent;
	    	var splittedVersionStr = agent.split('Version/');
	    	var versionNumber = parseInt(splittedVersionStr[1].substr(0,2));
	    	var browserNotSupportedMsgForPatientInIEOrSafari = "<span style='font-size:14px;'>Video Visits does not support your browser.</span>";
			browserNotSupportedMsgForPatientInIEOrSafari += "<br /><br />";
			browserNotSupportedMsgForPatientInIEOrSafari += "<span style='font-size: 14px;font-weight:normal;'>Please download the <a target='_blank' style='text-decoration:underline;' href='https://mydoctor.kaiserpermanente.org/ncal/mdo/presentation/healthpromotionpage/index.jsp?promotion=kppreventivecare'>My Doctor Online app</a> or use Chrome, or Internet Explorer.</span>";
	    	// Block access from Safari version 12.
	    	if(versionNumber >= 12){
	    		$('p#globalError').html(browserNotSupportedMsgForPatientInIEOrSafari);
				$("p#globalError").removeClass("hide-me");

				document.getElementById("last_name").disabled = true;
				document.getElementById("mrn").disabled = true;
				document.getElementById("birth_month").disabled = true;
				document.getElementById("birth_year").disabled = true;
				document.getElementById("login").disabled = true;
	    	}
	    } else if (browserInfo.isIE){
	    	var agent = navigator.userAgent;
	    	var browserNotSupportedMsgForPatientInIEOrSafari = "<span style='font-size:14px;'>Video Visits does not support your browser.</span>";
			browserNotSupportedMsgForPatientInIEOrSafari += "<br /><br />";
			browserNotSupportedMsgForPatientInIEOrSafari += "<span style='font-size: 14px;font-weight:normal;'>Please download the <a target='_blank' style='text-decoration:underline;' href='https://mydoctor.kaiserpermanente.org/ncal/mdo/presentation/healthpromotionpage/index.jsp?promotion=kppreventivecare'>My Doctor Online app</a> or use Chrome, or Safari.</span>";
	    	// Block access for EDGE
	    	if(agent.indexOf('Edge/') > -1){
	    		$('p#globalError').html(browserNotSupportedMsgForPatientInIEOrSafari);
				$("p#globalError").removeClass("hide-me");

				document.getElementById("last_name").disabled = true;
				document.getElementById("mrn").disabled = true;
				document.getElementById("birth_month").disabled = true;
				document.getElementById("birth_year").disabled = true;
				document.getElementById("login").disabled = true;
	    	}
	    }
	}
	/* US21400 - Browser Block Switch - front end (Externalized for Chrome and Firefox) - END */
</script>
