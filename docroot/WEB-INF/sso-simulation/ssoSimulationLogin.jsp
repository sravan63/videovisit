<input type="hidden" id="blockChrome" value="${WebAppContext.blockChrome}" />
<input type="hidden" id="blockFF" value="${WebAppContext.blockFF}" />

<h3 class="sso-page-title">Please sign on for your Video Visit </h3>
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
	    
	    <a href="login.htm" id="temp-access"> Temporary access </a>
  	</div> 
</form>
</div>
<div id="ssoLoginError" style="float: right">
    <p id="globalError">There was an error authenticating your account. Please sign in using temporary access.</p>
</div> 
<!--<p class="error error-login"><a name="errors"></a></p>-->

<script type="text/javascript">

	var browserInfo = getBrowserInfo();
	var browserVersion = (browserInfo.version).split(".")[0];
	var blockChrome = ($("#blockChrome").val() == 'true');
	var blockFF = ($("#blockFF").val() == 'true');
	
	var browserNotSupportedMsgForPatient = "<span style='font-size:14px;'>Video Visits does not support your browser.</span>";
	browserNotSupportedMsgForPatient += "<br /><br />";
	browserNotSupportedMsgForPatient += "<span style='font-size:14px;font-weight:normal;'>Please download the <a target='_blank' style='text-decoration:underline;' href='https://mydoctor.kaiserpermanente.org/ncal/mdo/presentation/healthpromotionpage/index.jsp?promotion=kppreventivecare'>My Doctor Online app</a> or use Chrome, Internet Explorer, or Safari.</span>";

    /* DE10832 - Validating autofill and enabling signon button on load */
    var validateAutoFill = function(){
    	//console.log("Testing Auto Fill");
    	 if($('#username').val() != "" && $('#password').val() != ""){
    		//console.log("====> Auto Fill Executed");
    	 	$('#ssologin').removeAttr('disabled');
	        $('#ssologin').css('cursor', 'pointer');
	        $('input#ssologin').css('opacity', '1.0');
    	 }else{
    		//console.log("====> Auto Fill Not Executed");
    		$('#username').val('');
    		$('#password').val('');
			$('#ssologin').attr('disabled', true);
			$('#ssologin').css('cursor', 'default');
			$('input#ssologin').css('opacity', '0.5');
    	 }
    };
    
    /* DE10832 - Validating autofill and enabling signon button on load */
    var validateChromeAutoFill = function(){
    	//console.log("Testing Chrome Auto Fill");
    	 if($('#username').css("background-color") == "rgb(250, 255, 189)" && $('#password').css("background-color") == "rgb(250, 255, 189)"){
    		//console.log("====> Auto Fill Executed");
    	 	$('#ssologin').removeAttr('disabled');
	        $('#ssologin').css('cursor', 'pointer');
	        $('input#ssologin').css('opacity', '1.0');
    	 }else{
    		//console.log("====> Chrome Auto Fill Not Executed");
    		$('#username').val('');
    		$('#password').val('');
			$('#ssologin').attr('disabled', true);
			$('#ssologin').css('cursor', 'default');
			$('input#ssologin').css('opacity', '0.5');
    	 }
    };
	
	/* US21400 - Browser Block Switch - front end (Externalized for Chrome and Firefox) */
	if(browserInfo.isChrome && blockChrome) {
		$('p#globalError').html(browserNotSupportedMsgForPatient);
		$('#ssoLoginError p').css("display", "block");
		
		document.getElementById("username").disabled = true;
		document.getElementById("password").disabled = true;

		$('#temp-access').css('cursor', 'default');
        $('#temp-access').css('opacity', '0.5');
        $('#temp-access').css('pointer-events', 'none');
	}else if(browserInfo.isFirefox && blockFF){
		$('p#globalError').html(browserNotSupportedMsgForPatient);
		$('#ssoLoginError p').css("display", "block");
		
		document.getElementById("username").disabled = true;
		document.getElementById("password").disabled = true;

		$('#temp-access').css('cursor', 'default');
        $('#temp-access').css('opacity', '0.5');
        $('#temp-access').css('pointer-events', 'none');
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
	}
	/* US21400 - Browser Block Switch - front end (Externalized for Chrome and Firefox) - END */
</script>
