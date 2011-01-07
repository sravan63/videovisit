$(document).ready(function() {

    $("#loginForm").validate({
        // Where do we want errors to appear?
        errorLabelContainer: $('p.error'),
        // Wrapp error messages in a list item
        wrapper: 'li',
        // Validation rules for each field in the form
        rules:  {
            last_name: {
                required: true,
                alphanumeric: true,
                minlength: 2
            },
            mrn: {
                required: true,
                digits: true,
                minlength: 8,
                maxlength: 8
            },
            birth_month: {
                required: true,
                digits: true,
                minlength: 1,
                maxlength: 2
            },
            birth_year: {
                required: true,
                digits: true,
                minlength: 4,
                maxlength: 4
            },
            captcha: {
                required: true
            },
            consentVersion: {
                required: true
            }
        },
        // Error messages for each field in the form (corresponds to Rules)
        messages: {
            last_name: {
                required: "Please enter your last name.",
                alphanumeric: "Please enter a valid name."
            },
            mrn: {
                required: "Please enter your Medical Record Number.",
                digits: "Please enter a valid Medical Record Number.",
                minlength: "Please enter a valid Medical Record Number.",
                maxlength: "Please enter a valid Medical Record Number."
            },
            birth_month: {
                required: "Please enter your birth month as a number.",
                digits: "Please enter your birth month as a number.",
                maxlength: "You cannot have more than 2 numbers for your birth month."
            },
            birth_year: {
                required: "Please enter your birth year.",
                digits: "Please enter your birth year as a number.",
                minlength: "You need 4 numbers for your birth month.",
                maxlength: "You need 4 numbers for your birth month."
            },
            captcha: {
                required: "You need to enter something in the captcha field."
            },
            consentVersion: {
                required: "You must agree to the terms of consent to proceed."
            }
        },
        submitHandler: function(data){
            // Clear the error field in case the form didn't submit properly.
            //$("p.error").html('');
            // Prepare data from pertinent fields for POSTing
            // Format birth_month
            var birth_month = $('input[name=birth_month]').val();
            if (birth_month.length == 1) {
            	birth_month = "0" + birth_month;
            }
            
            var prepdata = 'last_name=' + $('input[name=last_name]').val() + '&mrn=' + $('input[name=mrn]').val() + '&birth_month=' + birth_month + '&birth_year=' + $('input[name=birth_year]').val() + '&captcha=' + $('input[name=captcha]').val() + '&consentVersion=' + $('input[name=consentVersion]').val();
            var ep = $("p.error").position();
            $.ajax({
                type: "POST",
                url: VIDEO_VISITS.Path.login.ajaxurl,
                data: prepdata, // alternatively: $(data).serialize() but this adds fields we don't need
                success: function(returndata) {
                    returndata = $.trim(returndata);

                    switch (returndata)
                    {
                        case "1":
                            window.location.replace("landingready.htm");
                            break;

                        case "2":
                            window.location.replace("landingnone.htm");
                            break;

                        case "3":
                            $("p.error").css("display","inline").append('<li><label>Your username was invalid. Please try again.</label></li>');
                            moveToit("p.error");
                            break;

                        case "4":
                            $("p.error").css("display","inline").append('<li><label>The code entered did not match. Please try again (you can click the code image to generate a new one if needed).</label></li>');
                            moveToit("p.error");
                            break;

                        default:
                            $("p.error").css("display","inline").append('<li><label>There was an error submitting your login. Please try again later.</label></li>');
                            moveToit("p.error");
                            break;
                    }

                },
                error: function() {
                    $("p.error").css("display","inline").append('<li><label>There was an error submitting your login.</label></li>');
                    moveToit("p.error");
                }
            });
        }
    });

    // This is for reloading the captcha image onclick. Since the simplecaptcha code returns the actual contents of the image, I need to appened some random stuff to the img src so it knows the "location" has changed. Without it, this won't work
    $("#captchaImage").click(function(){
        $("#stickyImg").attr('src', 'stickyImg?' + (new Date().getTime()));
        return false;
    });

    // Clear/Display "hint" text for form input fields
    // Find all inputs with a populated title attribute and apply jquery.hint.js;
    $('input[title!=""]').hint();

    $('#terms').load($('#consentFormTXT').val());
});
