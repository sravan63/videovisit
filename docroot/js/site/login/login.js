$(document).ready(function() {

    $loginForm = $("#loginForm");
    $consentModal = $('#consentModal');

    $('#login').click(function() {
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
                birth_day: {
                    required: true,
                    digits: true,
                    minlength: 1,
                    maxlength: 2
                }
                /*
                ,
                captcha: {
                    required: true,
                    minlength: 5,
                    maxlength: 5
                }
                */
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
                birth_month: {
                    required: "Please enter your birth month as a number.",
                    digits: "Please enter your birth month as a number.",
                    maxlength: "You cannot have more than 2 numbers for your birth month."
                },
                birth_year: {
                    required: "Please enter your birth year.",
                    digits: "Please enter your birth year as a number.",
                    minlength: "You need 4 numbers for your birth year.",
                    maxlength: "You need 4 numbers for your birth year."
                },
                birth_day: {
                    required: "Please enter your birth day.",
                    digits: "Please enter your birth day as a number.",
                    maxlength: "You cannot have more than 2 numbers for your birth day."
                }
                /*
                ,
                captcha: {
                    required: "You need to enter something in the captcha field.",
                    minlength: "You must have 5 characters in the captcha field.",
                    maxlength: "You must have 5 characters in the captcha field."
                }
                */
            }
        }); //End validation

        if ($loginForm.valid()) {

            var agetype;
            var monthAdjusted = parseInt($('input[name=birth_month]').val(), 10) - 1;
            var birthdate = new Date($('input[name=birth_year]').val(), monthAdjusted, $('input[name=birth_day]').val());
            var patientAge = getAge(birthdate.getTime());

            var $parental_consent_fields = $('#parental-consent-fields');

            if (patientAge >= (18)) {
                agetype = 1; //adult
            } else if (patientAge < (18) && patientAge >= (13)) {
                agetype = 2; //teen
            } else {
                agetype = 3; //child
            }
            /* Remove consent requirement, 5/22/12 */
            if (false /*agetype == 1 || agetype == 3 */) { 

                $('.pcf-child').hide();
                $('.pcf-adult').hide();

                var addFields = '<input type="hidden" name="last_name" value="' + $('input[name=last_name]').val() + '">'
                    + '<input type="hidden" name="mrn" value="' + $('input[name=mrn]').val() + '">'
                    + '<input type="hidden" name="birth_year" value="' + $('input[name=birth_year]').val() + '">'
                    + '<input type="hidden" name="birth_month" value="' + $('input[name=birth_month]').val() + '">'
                    + '<input type="hidden" name="birth_day" value="' + $('input[name=birth_day]').val() + '">'
                    //+ '<input type="hidden" name="captcha" value="' + $('input[name=captcha]').val() + '">'
                    + '<input type="hidden" name="consentVersion" value="' + $('input[name=consentVersion]').val() + '">';
                $parental_consent_fields.append($(addFields));
                if (agetype == 3) {
                     $('#parent_first_name').removeAttr('disabled');
                    $('#parent_last_name').removeAttr('disabled');
                    $('#relationship').removeAttr('disabled');
                    $('.pcf-child').show();
                    $('.jqHandle span').text('Consent on Behalf of a Minor');
                } else {
                    $('#parent_first_name').attr('disabled', 'disabled');
                    $('#parent_last_name').attr('disabled', 'disabled');
                    $('#relationship').attr('disabled', 'disabled');
                    $('#relationship').val("None");
                    $('.pcf-adult').show();
                    $('.jqHandle span').text('Consent to Participate');
                }
                //$consentModal.jqmShow();
                return false;
            } else {
                $("p.error").html('');
                // Prepare data from pertinent fields for POSTing
                // Format birth_month
                var birth_month = $('input[name=birth_month]').val();
                if (birth_month.length == 1) {
                    birth_month = "0" + birth_month;
                }
                // Format birth_day
                var birth_day = $('input[name=birth_day]').val();
                if (birth_day.length == 1) {
                    birth_day = "0" + birth_day;
                }

                var prepdata = 'last_name=' + $('input[name=last_name]').val() + '&mrn=' + $('input[name=mrn]').val() + '&birth_month=' + birth_month + '&birth_year=' + $('input[name=birth_year]').val() + '&birth_day=' + birth_day + '&consentVersion=' + $('input[name=consentVersion]').val();


                $.ajax({
                    type: "POST",
                    url: VIDEO_VISITS.Path.login.ajaxurl,
                    data: prepdata, // alternatively: $(data).serialize() but this adds fields we don't need
                    success: function(returndata) {
                        returndata = $.trim(returndata);

                        switch (returndata) {
                            case "1":
                                window.location.replace("landingready.htm");
                                break;

                            case "2":
                                window.location.replace("landingnone.htm");
                                break;

                            case "3":
                                $("p.error").css("display", "inline").append('<li><label>Your username was invalid. Please try again.</label></li>');
                                moveToit("p.error");
                                break;

                            case "4":
                                $("p.error").css("display", "inline").append('<li><label>The code entered did not match. Please try again (you can click the code image to generate a new one if needed).</label></li>');
                                moveToit("p.error");
                                break;

                            default:
                                $("p.error").css("display", "inline").append('<li><label>There was an error submitting your login. Please try again later.</label></li>');
                                moveToit("p.error");
                                break;
                        }

                    },
                    error: function() {
                        $("p.error").css("display", "inline").append('<li><label>There was an error submitting your login.</label></li>');
                        moveToit("p.error");
                    }
                });
                return false;
            }
        } else {
            //return false;
        }
    });

    $('#consentLink').click(function() {

        $('#consentForm').validate({
            // Where do we want errors to appear?
            //errorLabelContainer: $('p.error'),
			errorPlacement: function(error, element) {
     			error.appendTo( element.parent("li"));
   			},
            // Wrap error messages in a list item
            wrapper: 'div',
            // Validation rules for each field in the form
            rules:  {
                parent_first_name: {
                    required: true,
                    letterswithbasicpunc: true,
                    minlength: 2
                },
                parent_last_name: {
                    required: true,
                    letterswithbasicpunc: true,
                    minlength: 2
                },
                relationship: {
                    required: true
                },
                consentVersion: {
                    required: true
                }
            },
            // Error messages for each field in the form (corresponds to Rules)
            messages: {
                parent_first_name: {
                    required: "Please enter your first name.",
                    letterswithbasicpunc: "Please enter a valid name."
                },
                parent_last_name: {
                    required: "Please enter your last name.",
                    letterswithbasicpunc: "Please enter a valid name."
                },
                relationship: {
                    required: "This field is required."
                },
                consentVersion: {
                    required: "You must agree to the terms of consent to proceed."
                }
            }
        }); //End validation

        if ($('#consentForm').valid()) {
        $("p.error").html('');

        var birth_month = $('input[name=birth_month]').val();
        if (birth_month.length == 1) {
            birth_month = "0" + birth_month;
        }
        // Format birth_day
        var birth_day = $('input[name=birth_day]').val();
        if (birth_day.length == 1) {
            birth_day = "0" + birth_day;
        }
		
		var relationship = $('#relationship').val();
		if(relationship == null){
			relationship = 'Adult';
		}
	
    //If the fields for adult consent are visible we are dealing with an adult, otherwise this is a child 
    if($('.pcf-adult').is(":visible")){
      //exclude the parent first and last name fields from the prepared data
      var prepdata = 'last_name=' + $('input[name=last_name]').val() + '&mrn=' + $('input[name=mrn]').val() + '&birth_month=' + birth_month + '&birth_year=' + $('input[name=birth_year]').val() + '&birth_day=' + birth_day + '&consentVersion=' + $('input[name=consentVersion]').val() + '&relationship=' + relationship;
    }else{
      var prepdata = 'last_name=' + $('input[name=last_name]').val() + '&mrn=' + $('input[name=mrn]').val() + '&birth_month=' + birth_month + '&birth_year=' + $('input[name=birth_year]').val() + '&birth_day=' + birth_day + '&consentVersion=' + $('input[name=consentVersion]').val() + '&relationship=' + relationship + '&parent_first_name=' + $('input[name=parent_first_name]').val() + '&parent_last_name=' + $('input[name=parent_last_name]').val();
    };

        $.ajax({
            type: "POST",
            url: VIDEO_VISITS.Path.login.ajaxurl,
            data: prepdata, // alternatively: $(data).serialize() but this adds fields we don't need
            success: function(returndata) {
                returndata = $.trim(returndata);
                switch (returndata) {
                    case "1":
                        window.location.replace("landingready.htm");
                        break;

                    case "2":
                        window.location.replace("landingnone.htm");
                        break;

                    case "3":
                        //$consentModal.jqmHide();
                        $("p.error").css("display", "inline").append('<li><label>Your username was invalid. Please try again.</label></li>');
                        moveToit("p.error");
                        break;

                    case "4":
                        //$consentModal.jqmHide();
                        $("p.error").css("display", "inline").append('<li><label>The code entered did not match. Please try again (you can click the code image to generate a new one if needed).</label></li>');
                        moveToit("p.error");
                        break;

                    default:
                        //$consentModal.jqmHide();
                        $("p.error").css("display", "inline").append('<li><label>There was an error submitting your login. Please try again later.</label></li>');
                        moveToit("p.error");
                        break;
                }

            },
            error: function() {
                //$consentModal.jqmHide();
                $("p.error").css("display", "inline").append('<li><label>There was an error submitting your login.</label></li>');
                moveToit("p.error");
            }
        });
            return false;
        } else {
            //return false;
        }
    });

    // This is for reloading the captcha image onclick. Since the simplecaptcha code returns the actual contents of the image, I need to append some random data to the img src so it knows the "location" has changed. Without it, this won't work
    /*
    $("#captchaImage").click(function() {
        $("#stickyImg").attr('src', 'stickyImg?' + (new Date().getTime()));
        return false;
    });
    */

    // Clear/Display "hint" text for form input fields
    // Find all inputs with a populated title attribute and apply jquery.hint.js;
    $('input[title!=""]').hint();

	$.get(
		$('#consentFormTXT').val(), 
		function(data) {
			mydata = data;
			mydata = mydata.replace(/\r\n/g, "\r");
			$('#terms').text(mydata);
		}, 
		'text'
	);

    // Move the modal outside of the rest of the containers on the page and append to body (fixes some IE modal bugs)
    //$('body').append($consentModal);

    // Setup the modal and make it draggable
    //$consentModal.jqm().jqDrag('.jqDrag');

    // Function to calculate today from perspective of given timezone offset, assume approximate US daylight savings time
    function getToday(offset) {
      if(offset == null){
        offset = -8;
      }
      var today = new Date();
      var month = today.getMonth();
      // rough approximation for daylight savings time (goes by month so if this is critical need to calculate down to the day for each year)
      if(month > 1 && month < 9){
        offset = offset + 1;
      }
      var utcTime = today.getTime() + (today.getTimezoneOffset() * 60000);
      var todayAdjusted = new Date(utcTime + (3600000*offset));

      return todayAdjusted;
    }

    // Function to calculate age
    function getAge(dateString) {
    //if unix rather than javascript date object
      //var dateString = dateString * 1000;
    // end if unix
    var today = getToday();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

});
