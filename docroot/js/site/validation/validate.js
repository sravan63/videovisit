var METHODNAME_IS_REQUIRED = 0;
var METHODNAME_IS_ALPHA_NUMERIC = 1;
var METHODNAME_IS_VALUE_BETWEEN_MIN_AND_MAX = 2;
var METHODNAME_IS_BIRTHDAY_VALIDATION = 3;
var METHODNAME_IS_BIRTHMONTH_VALIDATION = 4;
var METHODNAME_IS_BIRTHYEAR_VALIDATION = 5;
var METHODNAME_IS_MAX_LENGTH = 6;
var METHODNAME_IS_BIRTHDATE_VALIDATION = 7;


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
	var removeError = true;
	
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
                    isValid = isRequired(paramValue);
                    if ( isValid)
                        isValid = isAlphaNumeric(paramValue);
	    			isAllValid = isAllValid && isValid;
	    			
	    			break;
	    		case METHODNAME_IS_VALUE_BETWEEN_MIN_AND_MAX: 
	    			var min = methodObj.PARAM_MIN_VALUE;
	    			var max = methodObj.PARAM_MAX_VALUE;
	    			
	    			isValid = isRequired(paramValue); 
	    			if ( isValid )
                   	 isValid = isWhole(paramValue);
                    
                    if ( isValid)
                   	{
                        isValid = isValueBetweenMinMax(paramValue, min, max);   
                    }
	    			isAllValid = isAllValid && isValid;
	    			break;
                case METHODNAME_IS_BIRTHMONTH_VALIDATION:
                    isValid = isRequired(paramValue);
                    if ( isValid)
                        isValid = isWhole(paramValue);
                    if ( isValid)
                        isValid = isMonth(paramValue);
                    
                    if ( !isValid)
                    	removeError = false;
                    else
                    	if ( !removeError)
                    		clearErrorWithoutInput(inputId, errorMessage, errorId);
                   
                    isAllValid = isAllValid && isValid;
                    //alert('in month' + isValid);
	    			break;
                case METHODNAME_IS_BIRTHDAY_VALIDATION:
                    isValid = isRequired(paramValue);
                    if ( isValid)
                        isValid = isWhole(paramValue);
                    if ( isValid)
                        isValid = isDay(paramValue);
                    if ( !isValid)
                    	removeError = false;
                    else
                    	if ( !removeError)
                    		clearErrorWithoutInput(inputId, errorMessage, errorId);
                    
                    isAllValid = isAllValid && isValid;
                    // alert(isAllValid);
	    			break; 
                case METHODNAME_IS_BIRTHYEAR_VALIDATION:
                    var max = methodObj.PARAM_MAX_VALUE;
                    isValid = isRequired(paramValue);
                    if ( isValid)
                        isValid = isWhole(paramValue);
                    if ( isValid)
                        isValid = isYear(paramValue);
                    if ( !isValid)
                    	removeError = false;
                    else
                    	if ( !removeError)
                    		clearErrorWithoutInput(inputId, errorMessage, errorId);
                    isAllValid = isAllValid && isValid;
                   
	    			break;
	    		case METHODNAME_IS_MAX_LENGTH: 
	    			var max = methodObj.PARAM_MAX_VALUE;
	    			
	    			isValid = isMaxLength(paramValue, max);
	    			isAllValid = isAllValid && isValid;
	    			break;
	    		case METHODNAME_IS_BIRTHDATE_VALIDATION:
                    var max = methodObj.PARAM_MAX_VALUE;
                    isValid = isRequired(paramValue);
                    /*if ( isValid){
                        isValid = isWhole(paramValue);
                        alert("isWhole: "+isValid);
                    }*/
                    if ( isValid){
                        isValid = isDate(paramValue);
                    }
                    if ( !isValid)
                    	removeError = false;
                    else
                    	if ( !removeError)
                    		clearErrorWithoutInput(inputId, errorMessage, errorId);
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
            else
            	 if ( removeError)
               		 clearError(inputId, errorMessage, errorId);
	    	
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
 * Returns true or false based on if the value is numeric or not
 * @param element
 * @param value
 * @returns
 */


function isWhole (s) {
    var isWhole_re       = /^\s*\d+\s*$/;
   return String(s).search (isWhole_re) != -1
}

/**
 * Returns true or false based on if the value is valid month
 * @param element
 * @param value
 * @returns
 */
function isMonth (s) {
	 if (s.length == 1) {
	        s = "0" + s;
	 }
	 var is_month       = /^(0[1-9]|1[0-2])$/;
	 return String(s).search (is_month) != -1
}

/**
* Returns true or false based on if the value is valid day
* @param element
* @param value
* @returns
*/
function isDay (s) {
	if (s.length == 1) {
       s = "0" + s;
	}
	var is_day      = /^(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/;
	return String(s).search (is_day) != -1
}

/**
 * Returns true or false based on if the value is valid year
 * @param element
 * @param value
 * @returns
 */


function isYear (s) {
    var is_year      = /^\d{4}$/;
   return String(s).search (is_year) != -1
}

function isDate (s) {
    var is_date      = /^\d{1,2}\/\d{4}$/;
   return String(s).search (is_date) != -1
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
 * Clears UI errors 
 * @param element
 * @param errorMessage
 */
function clearError(inputElementId, errorMessage, errorElementId){
	$("#" + errorElementId).text(errorMessage);
	$("#" +errorElementId).addClass("hide-me");
	$("#" +inputElementId).parent().removeClass("error");
}

/**
 * Clears UI errors but not input selection
 * @param element
 * @param errorMessage
 */
function clearErrorWithoutInput(inputElementId, errorMessage, errorElementId){
	$("#" + errorElementId).text(errorMessage);
	$("#" +errorElementId).addClass("hide-me");
	//$("#" +inputElementId).parent().removeClass("error");
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
	
	$('.localfailmessage').each(function(){
    	$(this).addClass("hide-me");
    	$(this).parent().removeClass("error");
    })
}

