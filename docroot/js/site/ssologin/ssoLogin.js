$(document).ready(function() {

	$(":input").on('keyup', function(){	
		$("#ssoLoginError p").css("display", "none");
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
	
	$('.sso-submit-block-temp-access label').click(function() {
		window.location = "login.htm";
	});
	
	$("form :input").focus(function() {
		// clear all errors
		clearAllErrors();
	});
	
	// for focus on individual Input Fields
	$("#username").on('focus', function() {
		$("#username").css("color", "#000000");
	});

	// for focus on individual Input Fields
	$("#password").on('focus', function() {
		$("#password").css("color", "#000000");
	});

	$('#ssologin').click(function(e) {
		e.preventDefault();
			loginSubmit();
	});
});

function loginSubmit(){
	var postdata = 'username=' + $('input[name=username]').val() + '&password=' + $('input[name=password]').val();
	$.ajax({
        type: "POST",
        url: VIDEO_VISITS.Path.login.ssologinurl,
        data: postdata, // alternatively: $(data).serialize() but this adds fields we don't need
        success: function(returndata) {
            returndata = $.trim(returndata);
            switch (returndata) {
                case "200":
                	// show the dialog
                    window.location.replace("landingready.htm");
                    break;

                case "400":
                	// show error
                	$("#ssoLoginError p").css("display", "block");
                    break;
            }
        },
        error: function() {
        	$("#ssoLoginError p").css("display", "block");
        }
    });
    return false;
}

