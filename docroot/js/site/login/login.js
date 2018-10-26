$(document).ready(function() {
	
	//Disable the Login button unless all the fields are entered
	$(":input").on('keyup', function(){
        if($('#last_name').val() != "" && $('#mrn').val() != "" && $('#birth_month').val() != "" && $('#birth_year').val() != ""){
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
		clearAllErrors();
	});
	
	// for focus on individual Input Fields
	$("#last_name").on('focus', function() {
		$("#last_name").css("color", "#000000");
	});

	// for focus on individual Input Fields
	$("#mrn").on('focus', function() {
		$("#mrn").css("color", "#000000");
	}).on('input', function(){
		var inputvalue = $(this).val();
		if (inputvalue.search(/[^\d]+/) !== -1){
			var number = $(this).val().replace(/[^\d]/g, '');
			var start = this.selectionStart;
	      	var end = this.selectionEnd;
			$(this).val(number);
			var el = $(this)[0];
	      	el.setSelectionRange(start, end);
		}
	});


	// for focus on individual Input Fields
	$("#birth_month").on('focus', function() {
		$("#birth_month").css("color", "#000000");
	}).on('input', function(){
		var inputvalue = $(this).val();
		if (inputvalue.search(/[^\d]+/) !== -1){
			var number = $(this).val().replace(/[^\d]/g, '');
			var start = this.selectionStart;
	      	var end = this.selectionEnd;
			$(this).val(number);
			var el = $(this)[0];
	      	el.setSelectionRange(start, end);
		}
	});

	// for focus on individual Input Fields
	$("#birth_year").on('focus', function() {
		$("#birth_year").css("color", "#000000");
	}).on('input', function(){
		var inputvalue = $(this).val();
		if (inputvalue.search(/[^\d]+/) !== -1){
			var number = $(this).val().replace(/[^\d]/g, '');
			var start = this.selectionStart;
	      	var end = this.selectionEnd;
			$(this).val(number);
			var el = $(this)[0];
	      	el.setSelectionRange(start, end);
		}
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
        url: VIDEO_VISITS.Path.login.ajaxurl,
        data: prepdata, // alternatively: $(data).serialize() but this adds fields we don't need
        success: function(returndata) {
            returndata = $.trim(returndata);
            switch (returndata) {
                case "1":
                	// show the dialog 
                	console.log("1");
                    window.location.replace("landingready.htm");
                    break;

                case "2":
                	// show the dialog 
                	console.log("2");
                    window.location.replace("landingnone.htm");
                    break;

                case "3":
                	// show the dialog 
                	
                    $("p#globalError").removeClass("hide-me").html('We could not find this patient. Please try entering the information again.');
                    break;
                    console.log("3");
                case "4":
                	// show the dialog 
                	console.log("4");
                	$("p#globalError").removeClass("hide-me").html('The code entered did not match. Please try again (you can click the code image to generate a new one if needed).');
                    break;

                default:
                	// show the dialog 
                	console.log("5");
                	$("p#globalError").removeClass("hide-me").html('There was an error submitting your login. Please try again later.');
                    break;
            }

        },
        error: function() {
        	// show the dialog 
        	console.log("6");
            $("p#globalError").css("display", "inline").append('<li><label>There was an error submitting your login.</label></li>');
            moveToit("p#globalError");
        }
    });
    return false;
}
