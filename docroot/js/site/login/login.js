$(document).ready(function() {
	//$("#birth_date").mask("99/9999",{placeholder:"mm/yyyy"});
    $("#birth_date").mask("99/9999",{placeholder:""});
	
	//Disable the Login button unless all the fields are entered
	$(":input").on('keyup', function(){
        if($('#last_name').val() != "" && $('#mrn').val() != "" && ($('#birth_date').val() != "mm/yyyy" && $('#birth_date').val() != "")){
            $('#login').removeAttr('disabled');
            $('#login').css('cursor', 'pointer');
            $('input#login').css('opacity', '1.0');
        }
        else{
            $('#login').attr('disabled', true);
            $('#login').css('cursor', 'default');
            $('input#login').css('opacity', '0.5');
        }
    });
	
	$("form :input").focus(function() {
		// clear all errors
		clearAllErrorFields();
	});
	
	$('#login').click(function(e) {
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
		
		// if client side validation successful
		if(isLoginValidationSuccess()){
			loginSubmit();
		}
	});
});

function isLoginValidationSuccess(){
	var birth_month = $("#birth_date").val().split("/")[0];
    var birth_year = $("#birth_date").val().split("/")[1];
	
	var validationObj =
		{
			"last_name" : [
				{
					"METHOD_NAME" : METHODNAME_IS_ALPHA_NUMERIC,
					"PARAM_VALUE" : $("#last_name").val(),
					"ERROR_MESSAGE" : "Only Letters, Hyphens or Apostrophes allowed",
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
					"ERROR_MESSAGE" : "Please enter a valid Medical Record Number",
					"ERROR_ID" : "mrnErrorId",
                    "INPUT_ELEMENT" : "mrn",
					"HIGHLIGHT_PARENT_WHEN_ERROR": false
				}
			],
			"birth_month"	:[
	            {
	            	"METHOD_NAME" : METHODNAME_IS_BIRTHMONTH_VALIDATION,
					"PARAM_VALUE" : birth_month,
					"ERROR_MESSAGE" : "Please enter a valid Birth Month",
					"ERROR_ID" : "monthOfBirthErrorId",
                    "INPUT_ELEMENT" : "birth_date",
					"HIGHLIGHT_PARENT_WHEN_ERROR": false
	            }
			],
			"birth_year"	:[
	            {
	            	"METHOD_NAME" : METHODNAME_IS_BIRTHYEAR_VALIDATION,
					"PARAM_VALUE" : birth_year,
					"ERROR_MESSAGE" : "Please enter a valid Birth Year",
					"ERROR_ID" : "yearOfBirthErrorId",
                    "INPUT_ELEMENT" : "birth_date",
					"HIGHLIGHT_PARENT_WHEN_ERROR": false
	            }
			]
		}

	var  isValid = validate(validationObj);

	if(isValid){
		var currentDate = new Date();
		var currentMonth = currentDate.getMonth() + 1;
		var currentYear = currentDate.getFullYear();

		var selectedMonth = birth_month;
	    var selectedYear = birth_year;

	    //The entered Month of current year should not be in future
	    if(selectedYear == currentYear){
    		if(selectedMonth <= currentMonth){
    			return true;
    		}
	    }
	    else{
	    	return true;
	    }

	    $('#dateOfBirthErrorId').html("Please enter a valid Birth Date").removeClass("hide-me");
        $('#birth_date').css("color", "#FF0000");
	    return false;
	}

	return isValid;
}

function loginSubmit(){
    var birth_month = $("#birth_date").val().split("/")[0];
    var birth_year = $("#birth_date").val().split("/")[1];
    var birth_day = "";

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
                	
                    $("p#global-Error").removeClass("hide-me").html('We could not find this patient. Please try entering the information again.');
                    break;

                case "4":
                	// show the dialog 

                	$("p#global-Error").removeClass("hide-me").html('The code entered did not match. Please try again (you can click the code image to generate a new one if needed).');
                    break;

                default:
                	// show the dialog 

                	$("p#global-Error").removeClass("hide-me").html('There was an error submitting your login. Please try again later.');
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

function clearAllErrorFields(){
    $("#last_name").css("color", "#000000");
	$("#lastNameErrorId").html("").addClass("hide-me");

    $("#mrn").css("color", "#000000");
	$("#mrnErrorId").html("").addClass("hide-me");

    $("#birth_date").css("color", "#000000");
	$("#monthOfBirthErrorId").html("").addClass("hide-me");

	$("#yearOfBirthErrorId").html("").addClass("hide-me");

	$("#dateOfBirthErrorId").html("").addClass("hide-me");

	$("#global-Error").html("").addClass("hide-me");

}
