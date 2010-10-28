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
                minlength: 2,
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
            visible: {
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
                minlength: "You need 2 numbers for your birth month.",
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
            visible: {
                required: "You must agree to the terms of consent to proceed."
            }
        },
        submitHandler: function(data){
            // Clear the error field in case the form didn't submit properly.'
            $("p.error").html('');
            // Prepare data from pertinent fields for POSTing
            var prepdata = 'last_name=' + $('input[name=last_name]').val() + '&mrn=' + $('input[name=mrn]').val() + '&birth_month=' + $('input[name=birth_month]').val() + '&birth_year=' + $('input[name=birth_year]').val() + '&captcha=' + $('input[name=captcha]').val() + '&visible=' + $('input[name=visible]').val();

            $.ajax({
                type: "POST",
                url: VIDEO_VISITS.Path.login.ajaxurl,
                data: prepdata, // alternatively: $(data).serialize() but this adds fields we don't need'
                success: function(returndata) {
                    console.log('Success', returndata);
                    // Success! Redirect to the landing page
                    window.location.replace("landing.htm");

                },
                error: function(res) {
                    console.log('Ajax request failed: ', res.statusText);
                    $("p.error").css("display","inline").append('There was an error submitting your login.');
                }
            });
        }
    });

});
