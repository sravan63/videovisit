var METHODNAME_IS_REQUIRED = 0;
var METHODNAME_IS_ALPHA_NUMERIC = 1;
var METHODNAME_IS_VALUE_BETWEEN_MIN_AND_MAX = 2
var METHODNAME_IS_MAX_LENGTH = 3


/**
 * Data should be passed in the following JSON format. See example below
 * last_name - Id of the field to be validated
 * Each array element will have the 
 *			Required parameters: 
 *			METHOD_NAME- an int value which determines which method to be called, 
 *			ERROR_MESSAGE - In case the validation fails
 *			ERROR_ID - Error Id that will display the error
 *			HIGHLIGHT_PARENT_WHEN_ERROR - Input that needs to be highlighted when the error occurs. For e.g if text field has error then highlight the text field
 *			PARAM_VALUE - value which needs to be validated.
 *		 	Optional Parameters - Depending on the methods to be called additional parameters may be passed.
 * var validationObj = 
 *		{
 *			"last_name" : [
 *				{
 *					"METHOD_NAME" : METHODNAME_IS_REQUIRED,
 *					"PARAM_VALUE" : $("#last_name").val(),
 *					"METHOD_ERROR_MESSAGE" : "Please enter your last name.",
 *					"ERROR_ID" : "lastNameErrorId",
 *					"HIGHLIGHT_PARENT_WHEN_ERROR": true
 *					
 *					
 *				},
 *				{
 *					"METHOD_NAME" : METHODNAME_IS_ALPHA_NUMERIC,
 *					"PARAM_VALUE" : $("#last_name").val(),
 *					"ERROR_MESSAGE" : "Please enter your last name.",
 *					"ERROR_ID" : "lastNameErrorId",
 *					"HIGHLIGHT_PARENT_WHEN_ERROR": true 
 *
 *				}
 *			]
 * @param validationObj
 * @returns {Boolean}
 */
function validate(validationObj){
	
	var isValid = false;
	// returns true is all the validations are successful
	var isAllValid = true;
	// Iterate over outer collection which is a set of html input Ids. Each Id will have an array of validations that needs to be performed.
	
	$.each(validationObj, function(key, arrValidationItems) {
		
		var inputId = key;

		/* The inner collection will be an array of different validations methods that needs to be called. 
		 Each array element will have the 
 			Required parameters: 
 			METHOD_NAME- an int value which determines which method to be called, 
 			ERROR_MESSAGE - In case the validation fails
 			ERROR_ID - Error Id that will display the error
 			HIGHLIGHT_PARENT_WHEN_ERROR - Input that needs to be highlighted when the error occurs. For e.g if text field has error then highlight the text field
			PARAM_VALUE - value which needs to be validated.
		 	Optional Parameters - Depending on the methods to be called additional parameters may be passed.
		*/
		
	    $.each(arrValidationItems, function(index, methodObj){
	    	
	    	var methodName = methodObj.METHOD_NAME;
		    var errorMessage = methodObj.ERROR_MESSAGE;
		    var errorId = methodObj.ERROR_ID;
	    	var paramValue = methodObj.PARAM_VALUE;
	    	
	    	switch(methodName){
	    		case METHODNAME_IS_REQUIRED: 
	    			isValid = isRequired(paramValue);
	    			isAllValid = isAllValid && isValid;
	    			break;
	    			
	    		case METHODNAME_IS_ALPHA_NUMERIC: 
	    			isValid = isAlphaNumeric(paramValue);
	    			isAllValid = isAllValid && isValid;
	    			
	    			break;
	    		case METHODNAME_IS_VALUE_BETWEEN_MIN_AND_MAX: 
	    			var min = methodObj.PARAM_MIN_VALUE;
	    			var max = methodObj.PARAM_MAX_VALUE;
	    			isValid = isValueBetweenMinMax(paramValue, min, max);
	    			isAllValid = isAllValid && isValid;
	    			break;
	    		case METHODNAME_IS_MAX_LENGTH: 
	    			var max = methodObj.PARAM_MAX_VALUE;
	    			
	    			isValid = isMaxLength(paramValue, max);
	    			isAllValid = isAllValid && isValid;
	    			break;
	    				
	    		default:
	    			isValid = false;
	    			isAllValid = isAllValid && isValid;
	    			break;
	    	}
	    	
	    	if(!isValid){
	    		displayError(inputId, errorMessage, errorId);
	    	}
	    	
	    });
	    
	    
	});
	
	

	return isAllValid ;
}

/**
 * Returns true or false based on if the value is alphanumeric or not
 * @param element
 * @param value
 * @returns
 */
function isAlphaNumeric(value){
	var re = /^[a-z-.,()'\"\s]+$/i;
	return re.test(value);
}

/**
 * Returns true or false based on if the value is alphanumeric or not
 * @param element
 * @param value
 * @returns
 */
function isRequired(value){
	
	if(value == null || value.trim() == ''){
		return false;
	}
	else{
		return true;
	}
}


/**
 * Returns true or false based on if the min and max length is satisfied
 * @param element
 * @param value
 * @returns
 */
function isValueBetweenMinMax(value, min, max){
	
	if(value != null && value.length >= min &&  value.length <= max){
		return true;
	}
	else{
		return false;
	}
}

/**
 * Returns true or false based on if the max length is satisfied
 * @param element
 * @param value
 * @returns
 */
function isMaxLength(value, max){
	
	if(value != null &&  value.length == max){
		return true;
	}
	else{
		return false;
	}
}

// END VALIDATION APIS


/**
 * Display UI errors 
 * @param element
 * @param errorMessage
 */
function displayError(inputElementId, errorMessage, errorElementId){
	$("#" + errorElementId).text(errorMessage);
	$("#" +errorElementId).removeClass("hide-me");
	$("#" +inputElementId).parent().addClass("error");
}


/**
 * Clears all the errors
 */
function clearAllErrors(){
	
	// Clear global errors if any
	$("#globalError").addClass("hide-me").removeClass("error");
	
    $('.failmessage').each(function(){
    	$(this).addClass("hide-me");
    	$(this).parent().removeClass("error");
    })
	
}

