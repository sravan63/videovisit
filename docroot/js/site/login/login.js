$(document).ready(function() {

    $loginForm = $("#loginForm");
    
    $("#birth_date").mask("99/9999",{placeholder:"mm/yyyy"});
    $(":text").on('keyup', function(){
        //alert("disabled");
        if($('#last_name').val() != "" && $('#mrn').val() != "" && $('#birth_date').val() != ""){
            $('#login').removeAttr('disabled');
        }
        else{
            $('#login').attr('disabled', true);
        }
    });

    $('#login').click(function() {
    	// show the dialog 
    	
		
        $loginForm.validate({
            // Where do we want errors to appear?
            errorLabelContainer: $('p.error'),
            // Wrap error messages in a list item
            wrapper: 'li',
            // Validation rules for each field in the form
            rules:  {
                last_name: {
                    required: true,
                    letterswithbasicpunc: true,
                    minlength: 2
                },
                mrn: {
                    required: true,
                    digits: true,
                    minlength: 1,
                    maxlength: 8
                },
                /*birth_month: {
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
                birth_day: {
                    required: true,
                    digits: true,
                    minlength: 1,
                    maxlength: 2
                },
                captcha: {
                    required: true,
                    minlength: 5,
                    maxlength: 5
                }
                */
                birth_date: {
                	required: true,
                    minlength: 7,
                    maxlength: 7
                }
            },
            // Error messages for each field in the form (corresponds to Rules)
            messages: {
                last_name: {
                    required: "Please enter your last name.",
                    letterswithbasicpunc: "Please enter a valid name."
                },
                mrn: {
                    required: "Please enter your Medical Record Number.",
                    digits: "Please enter a valid Medical Record Number.",
                    minlength: "Please enter a valid Medical Record Number.",
                    maxlength: "Please enter a valid Medical Record Number."
                },
                birth_date: {
                    required: "Please enter your Birth Date.",
                    maxlength: "You cannot have more than 7 numbers for your Birth Date."
                }
            }
        }); //End validation

        if ($loginForm.valid()) {

            /* Removed consent requirement, 5/22/12 */
            
            $("p.error").html('');
            
            // Prepare data from pertinent fields for POSTing
            var birth_month = $("#birth_date").val().split("/")[0];
            var birth_year = $("#birth_date").val().split("/")[1];
            var birth_day = "";
            
            // Format birth_month
            /*var birth_month = $('input[name=birth_month]').val();
            if (birth_month.length == 1) {
                birth_month = "0" + birth_month;
            }
            // Format birth_day
            var birth_day = $('input[name=birth_day]').val();
            if (birth_day.length == 1) {
                birth_day = "0" + birth_day;
            }*/

            var prepdata = 'last_name=' + $('input[name=last_name]').val() + '&mrn=' + $('input[name=mrn]').val() + '&birth_month=' + birth_month + '&birth_year=' + birth_year + '&birth_day=' + birth_day + '&consentVersion=' + $('input[name=consentVersion]').val();

            $.ajax({
                type: "POST",
                url: VIDEO_VISITS.Path.login.ajaxurl,
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
                        	
                            $("p.error").css("display", "inline").append('<li><label>We could not find this patient.  Please try entering the information again.</label></li>');
                            moveToit("p.error");
                            $('#last_name').val("");
                            $('#mrn').val("");
                            $('#birth_date').val("");
                            $('#login').attr('disabled', true);
                            break;

                        case "4":
                        	// show the dialog 
                        	
                            $("p.error").css("display", "inline").append('<li><label>The code entered did not match. Please try again (you can click the code image to generate a new one if needed).</label></li>');
                            moveToit("p.error");
                            $('#last_name').val("");
                            $('#mrn').val("");
                            $('#birth_date').val("");
                            $('#login').attr('disabled', true);
                            break;

                        default:
                        	// show the dialog 
                        	
                            $("p.error").css("display", "inline").append('<li><label>There was an error submitting your login. Please try again later.</label></li>');
                            moveToit("p.error");
                            $('#last_name').val("");
                            $('#mrn').val("");
                            $('#birth_date').val("");
                            $('#login').attr('disabled', true);
                            break;
                    }

                },
                error: function() {
                	// show the dialog 
                	
                    $("p.error").css("display", "inline").append('<li><label>There was an error submitting your login.</label></li>');
                    moveToit("p.error");
                }
            });
            return false;
            
        } 
    });


});
