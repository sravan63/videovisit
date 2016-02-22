<link rel="stylesheet" type="text/css" href="css/site/global/structure.css" />
<h3 class="sso-page-title">Please sign on for Video Visit</h3>
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
	    
	    <div class="sso-submit-block" style="overflow:auto;">
	        <label>Forgot your username or password? </label>
	    </div>
	    <div class="sso-submit-block-temp-access" style="overflow:auto;">
	        <label>Use temporary access</label>
	    </div>
  	</div>  	
    
</form>
</div>
<!--<p class="error error-login"><a name="errors"></a></p>-->
<style>
	.error{
		width: 250px;
		height: 100px;
	}
	.hide-me{
		display: none;
	}
	input#ssologin{
		opacity: 0.5;
		filter: alpha(opacity=50);
	}
	.sso-login{
		font-size: 14px;
		margin-bottom: 15px;
		padding-left: 38px;
		color: #333333;
	}
	.sso-page-title{
		font-size: 28px;
		margin-top: 116px;
		margin-bottom: 54px;
		color: #333333;
		font-weight: bold;
		padding-left: 38px;
	}
	.sso-form-block{
		margin-bottom: 43px;
		margin-left: 0;
		border: 1px border #333333;
		padding-left: 38px;
		list-style-type:none;
	}
	.sso-submit-block-temp-access label{
		font-size: 14px;
		text-decoration: underline;
		color: #006ba6;
		cursor: pointer;
		margin-left: 38px;
	}
	.sso-form-block input{
		width: 265px;
		height: 30px;
		padding: 0 0 0 5px;
		font-size: 14px;
		color: #666666;
		margin-bottom: 13px;
	}
	.form-block .birth_month{
		width: 55px;
	}
	.form-block .birth_year{
		width: 80px;
	}
	.sso-submit-block{
		padding-left: 38px;
		margin-left: 0;
		font-size:14px;
		color: #333333;
		margin-bottom: 7px;
	}
	.sso-submit-block .button{
		font-size: 20px;
		width: 158px;
		height: 35px;
		float: right;
		cursor: default;
		color: #FFFFFF;
		background-color: #006ba6;
		margin: 0 0 38px 0;
		padding: 0;
	}
	
	.header-inner {
		display: none;
	}
</style>
<script type="text/javascript">
$('.sso-submit-block-temp-access label').click(function() {
	window.location = "login.htm";
});

$(document).ready(function() {
	
	//DE4286-Firefox fix (cache issue - it keeps the entries in the text box even after refresh)
	/*$("#last_name").val("");
	$("#mrn").val("");
	$("#birth_date").val("");*/
	
	//Disable the Login button unless all the fields are entered
	$(":input").on('keyup', function(){
		console.log("hi");
        if($('#username').val() != "" && $('#password').val() != ""){
            $('#ssologin').removeAttr('disabled');
            $('#ssologin').css('cursor', 'pointer');
            $('input#ssologin').css('opacity', '1.0');
        }
        else{
            $('#ssologin').attr('disabled', true);
            $('#ssologin').css('cursor', 'default');
            $('input#ssologin').css('opacity', '0.5');
        }
    });
	
	$("form :input").focus(function() {
		// clear all errors
		clearAllErrors();
	});
	
	// for focus on individual Input Fields
	$("#last_name").on('focus', function() {
		$("#last_name").css("color", "#000000");
	});

	// for focus on individual Input Fields
	$("#mrn").on('focus', function() {
		$("#mrn").css("color", "#000000");
	});

	// for focus on individual Input Fields
	$("#birth_month").on('focus', function() {
		$("#birth_month").css("color", "#000000");
	});

	// for focus on individual Input Fields
	$("#birth_year").on('focus', function() {
		$("#birth_year").css("color", "#000000");
	});
	
	$('#ssologin').click(function(e) {
		e.preventDefault();
		
		if ( $("#mrn").val().length > 0)
		{
			if ( $("#mrn").val().length < 8 )
	        {
	        	while ( $("#mrn").val().length < 8 )
	        	{
	        		$("#mrn").val('0' + $("#mrn").val());
	        	}
	        }
        }
		
		if ( $("#birth_month").val().length < 2 )
        {
        	while( $("#birth_month").val().length < 2 )
        	{
        		$("#birth_month").val('0' + $("#birth_month").val());
        	}
        }
		
		// if client side validation successful
		if(isLoginValidationSuccess()){
			loginSubmit();
		}
	});
});

function isLoginValidationSuccess(){
	
	var validationObj =
		{
			"last_name" : [
				{
					"METHOD_NAME" : METHODNAME_IS_LASTNAME_VALIDATION,
					"PARAM_VALUE" : $("#last_name").val(),
                    "PARAM_MIN_VALUE" :2,
					"ERROR_MESSAGE" : "Only Letters, Hyphens or Apostrophes allowed.",
					"ERROR_ID" : "lastNameErrorId",
                    "INPUT_ELEMENT" : "last_name",
					"HIGHLIGHT_PARENT_WHEN_ERROR": false
				}
			],
			"mrn"	:[
				{
					"METHOD_NAME" : METHODNAME_IS_VALUE_BETWEEN_MIN_AND_MAX,
					"PARAM_VALUE" : $("#mrn").val(),
					"PARAM_MIN_VALUE" :8,
					"PARAM_MAX_VALUE" :8,
					"ERROR_MESSAGE" : "Please enter a valid Medical Record Number.",
					"ERROR_ID" : "mrnErrorId",
                    "INPUT_ELEMENT" : "mrn",
					"HIGHLIGHT_PARENT_WHEN_ERROR": false
				}
			],
			"birth_month"	:[
	            {
	            	"METHOD_NAME" : METHODNAME_IS_BIRTHMONTH_VALIDATION,
					"PARAM_VALUE" : $("#birth_month").val(),
					"ERROR_MESSAGE" : "Please enter a valid Birth Month.",
					"ERROR_ID" : "monthOfBirthErrorId",
                    "INPUT_ELEMENT" : "birth_month",
					"HIGHLIGHT_PARENT_WHEN_ERROR": false
	            }
			],
			"birth_year"	:[
	            {
	            	"METHOD_NAME" : METHODNAME_IS_BIRTHYEAR_VALIDATION,
					"PARAM_VALUE" : $("#birth_year").val(),
					"ERROR_MESSAGE" : "Please enter a valid Birth Year.",
					"ERROR_ID" : "yearOfBirthErrorId",
                    "INPUT_ELEMENT" : "birth_year",
					"HIGHLIGHT_PARENT_WHEN_ERROR": false
	            }
			]
		}

	var  isValid = validate(validationObj);

	return isValid;
}

function loginSubmit(){
    var birth_day = "";

	var prepdata = 'last_name=' + $('input[name=last_name]').val() + '&mrn=' + $('input[name=mrn]').val() + '&birth_month=' + $('input[name=birth_month]').val() + '&birth_year=' + $('input[name=birth_year]').val() + '&birth_day=' + birth_day + '&consentVersion=' + $('input[name=consentVersion]').val();

	$.ajax({
        type: "POST",
        url: VIDEO_VISITS.Path.login.ssologinurl,
        data: prepdata, // alternatively: $(data).serialize() but this adds fields we don't need
        success: function(returndata) {
            returndata = $.trim(returndata);
            switch (returndata) {
                case "1":
                	// show the dialog 
                	
                    window.location.replace("landingready.htm");
                    break;

                case "2":
                	// show the dialog 
                	
                    window.location.replace("landingnone.htm");
                    break;

                case "3":
                	// show the dialog 
                	
                    $("p#globalError").removeClass("hide-me").html('We could not find this patient. Please try entering the information again.');
                    break;

                case "4":
                	// show the dialog 

                	$("p#globalError").removeClass("hide-me").html('The code entered did not match. Please try again (you can click the code image to generate a new one if needed).');
                    break;

                default:
                	// show the dialog 

                	$("p#globalError").removeClass("hide-me").html('There was an error submitting your login. Please try again later.');
                    break;
            }

        },
        error: function() {
        	// show the dialog 
        	
            $("p#globalError").css("display", "inline").append('<li><label>There was an error submitting your login.</label></li>');
            moveToit("p#globalError");
        }
    });
    return false;
}


</script>


