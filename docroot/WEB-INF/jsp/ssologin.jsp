<link rel="stylesheet" type="text/css" href="css/site/global/structure.css" />
<link rel="stylesheet" type="text/css" href="css/site/sso/ssologin.css"/>
<link rel="stylesheet" type="text/css" href="css/site/mdo/styles.css" />

<h3 class="sso-page-title">Please sign on for your Video Visit</h3>
<div  style="width: 40%; margin-left: 84px;">
<p class="sso-login">Use your kp.org user name and password</p>
<form id="ssoLoginForm" method="post" action="" style="overflow:auto;">
    <div>
	    <ul class="sso-form-block">
	        <li><input type="text" name="username" id="username" placeholder="kp.org user name" tabindex="1"></li>
	        <li><input type="password" name="password" id="password" maxlength="8" placeholder="password" tabindex="2"></li>
	        
	  	</ul>
	  	<div class="sso-submit-block" style="overflow:auto;">
	        <input type="button" name="ssologin" value="Sign On" id="ssologin" class="button" tabindex="4" style="" >
	    </div>
	    <div id="ssoLoginError">
	    <p>There was an error authenticating your account.  Please sign in using temporary access.</p>
	    </div>
	    
	    <div class="sso-submit-block-forgot">
	        <p>Forgot your username or password? </p>
	    </div>
	    <div class="sso-submit-block-temp-access">
	        <label>Use temporary access</label>
	    </div>
  	</div>  	
    
</form>
</div>
<!--<p class="error error-login"><a name="errors"></a></p>-->
<script src="js/library/modernizr/modernizr_283.js" type="text/javascript"></script>
<script src="js/library/jquery/jquery-1.8.3.min.js" type="text/javascript"></script>
<script src="js/library/jquery/jquery-ui/jquery-ui-1.9.2.custom.min.js" type="text/javascript"></script>
<script src="js/site/global/commonScript.js" type="text/javascript"></script>
<script src="environment/path.js" type="text/javascript"></script>
<script src="js/site/global/global.js" type="text/javascript"></script>
<script src="js/site/global/plugins.js" type="text/javascript"></script>
<script src="js/site/login/login.js" type="text/javascript"></script>
<script src="js/site/validation/validate.js" type="text/javascript"></script>
<script type="text/javascript" src="js/site/ssologin/ssoLogin.js"></script>
