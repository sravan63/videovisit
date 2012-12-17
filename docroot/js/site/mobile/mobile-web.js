/* AJAX Server requests */
var VIDEO_VISITS_MOBILE = {
    jQueryDocument : $(document),
    jQueryWindow   : $(window)
};

VIDEO_VISITS_MOBILE.Path = {
	    global : {
	        error : 'error.htm',
	        expired : 'logout.htm'
	    },
	    login : {
	        ajaxurl : 'submitlogin.json'
	    },
	    setSessionTimeout : {
	        ajaxurl : 'sessiontimeout.json'
	    }
};
/*END - AJAX Server requests  */


/**
 * This is the main function which gets called when the document is ready and loaded in DOM
 */
$(document).ready(function() {
	
	detectDeviceCookie();
	
	$(".modal-window .button-close").click(modalHideByClass);
	
	$(".alert.hideable").click(hideSecurityAlert);
	
	$(".scrollup").click(scrollMe);
	// Shows and hides scroll to top button
	$(window).scroll(function(){
		if ($(this).scrollTop() > 320) {
			$('.scrollup').fadeIn();
		} else {
			$('.scrollup').fadeOut();
		}
	});
	// scrolls to top for anchor page states on load
	scrollMe();
	
	$('.modal').on('touchmove', function (event) {
		// locking these elements, so they can't be moved when dragging the div
		event.preventDefault();
	});
	
	
	// for focus and blur events
	$("form :input").focus(function() {
		$(this).parent().addClass("form-focus");
		
		// clear all errors
		clearAllErrors();
		
	}).blur(function() {
			$(this).parent().removeClass("form-focus");
	});

	
	
	// START--APP ALERT handling using cookie
	var appAlertCookie=getCookie("APP_ALERT_COOKIE");
	
	$("#preLoginGetAppButtonId, #btn-i-have-it, #patientLoginGetAppButtonId").click(function() {
		setCookie("APP_ALERT_COOKIE", "APP_ALERT_COOKIE");
		var targetId = event.target.id;
		if(targetId == 'btn-i-have-it'){
			hidesAppAlert();
		}
		
	});
	

	$("#signInId, #logout-sign-in").click(function(event) {
		event.preventDefault();
		
		var targetId = event.target.id;
		// clear all errors
		clearAllErrors();
		if (typeof appAlertCookie !== 'undefined' && appAlertCookie !=null && appAlertCookie !=""){
			hidesAppAlert();
		}
		return false;
		
	});
	
	
	
	// END--APP ALERT handling using cookie
	
	// Login button submit click
	$("#login-submit").click(function(event) {
		event.preventDefault();
			
		// if client side validation successful
		if(isLoginValiadtionSuccess()){
			loginSubmit();
			
		}

	});
	
	$(".button-launch-visit").click(function(event) {	
		event.preventDefault();
		
		// set the session timeout before launching the video visit
		setSessionTimeout();
		
		var megaMeetingId = $(this).attr("megameetingid");
		var lastName = $(this).attr("lastname");
		var firstName = $(this).attr("firstname");
		var megaMeetingUrl = $(this).attr("megaMeetingUrl");
		launchVideoVisit(megaMeetingUrl, megaMeetingId, lastName, firstName);
		

	});
	
});



// Hides address bar on page load
/mobile/i.test(navigator.userAgent)
&& !window.location.hash
&& setTimeout(function () {
window.scrollTo(0,0);
}, 0);


function modalShow(modalId){
	$("#" + modalId).removeClass("hideMe").hide().fadeIn(200);
	return false;
}

function modalHideByClass(){
	$(".modal").fadeOut(200);
	return false;
}

function modalHide(modalId){
	$("#" + modalId).fadeOut(200);
	return false;
}

function scrollMe(){
	$('html, body').animate({scrollTop:0}, 'slow');
	return false;
}

function hidesAppAlert (){
	$("#app-alert").addClass("hide-me");
	$("#login-form").removeClass("hide-me");

}

function hideable(){
	// Hides inline alerts (which have x on top right) on click
	$(this).addClass("hide-me");
	return false;
}


function hideSecurityAlert (){
	$(".alert").addClass("hide-me");
	return false;
}


/*
 * Function used to detect the device.
 * We need to add code to detect devices which needs to be supported here
 */
function getAppOS(){
    //First, check for supported iOS devices, iPhone, iPod, and iPad
    var iOS = false,
    p = navigator.platform;
 
    if( p === 'iPad' || p === 'iPhone' || p === 'iPod' || p==='iPhone Simulator'){
        return "iOS";
    }
    
    //next, check if this is a supported AIR 3.1 Android device http://kb2.adobe.com/cps/923/cpsid_92359.html
    //Updated (3/5/2012) Advertize only to Android 2.2, 2.3, 3.0, 3.1 and 3.2 devices.
    //Updated (8/29/2012) Added Android 4.0 to the list of supported operating systems. 
    if (navigator.userAgent.match(/Android 2.2/i) || navigator.userAgent.match(/Android 2.3/i) || 
    navigator.userAgent.match(/Android 3.0/i) || navigator.userAgent.match(/Android 3.1/i) || 
    navigator.userAgent.match(/Android 3.2/i) || navigator.userAgent.match(/Android 4.0/i) ||
    navigator.userAgent.match(/Android 4.1/i) || navigator.userAgent.match(/Android 4.2/i)){
           return "Android";
    }
    
    //No supported app platform found.
    return "desktop";
}

/*
 * This method sets the isWirelessDeviceOrTablet cookie based on the device detected
 */
function detectDeviceCookie(){
	var appOS = getAppOS();
	
	// Check if cookie already set
	var isWirelessDeviceOrTabletCookie=getCookie("isWirelessDeviceOrTablet");
	
	if(typeof isWirelessDeviceOrTabletCookie != undefined && isWirelessDeviceOrTabletCookie !=null && isWirelessDeviceOrTabletCookie != ""){
		
		return;
	}
	
	if(appOS === 'iOS' || appOS === 'Android'){
		
		setCookie("isWirelessDeviceOrTablet", "true")
	}
	else{
		// for desktop
		setCookie("isWirelessDeviceOrTablet", "false")
	}
}
/**
 * This method is used to set the cookie value
 * @param c_name
 * @param value
 * @param exdays
 */
function setCookie(c_name,value){
	var exdate=new Date();
	var time = exdate.getTime();
	// expiry set to 20 years
	var addTime = 60*60*24*365*20*1000;
	
	exdate.setTime(time + addTime);
	
	//exdate.setDate(exdate.getDate() + days);
	var c_value=escape(value) +  ";expires="+exdate.toUTCString();
	
	document.cookie=c_name + "=" + c_value;
}

// Get the cookie value
function getCookie(c_name){
	var i,x,y,arrCookies=document.cookie.split(";");
	for (i=0;i<arrCookies.length;i++)
	{
		x=arrCookies[i].substr(0,arrCookies[i].indexOf("="));
		y=arrCookies[i].substr(arrCookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+$/g,"");
		if (x==c_name){
			return unescape(y);
		}
	}
}


/**
 * Called on the click of the Launch button
 * @param megaMeetingId
 * @param lastName
 * @param firstName
 */
function launchVideoVisit(megaMeetingUrl, megaMeetingId, lastName, firstName){
	var name = lastName + " " + firstName;
	var megaMeetingUrl = megaMeetingUrl + "/guest/&id=" + megaMeetingId  +  "&name=" + name + "&title=Video Visit&go=1&agree=1"; 
	//alert("megaMeetingUrl=" + megaMeetingUrl);
	window.location.replace(megaMeetingUrl);
	
}




/**
 * 
 * 	METHOD_NAME- an int value which determines which method to be called, 
 *	ERROR_MESSAGE - In case the validation fails
 *	ERROR_ID - Error Id that will display the error
 *	HIGHLIGHT_PARENT_WHEN_ERROR - Input that needs to be highlighted when the error occurs. For e.g if text field has error then highlight the text field
 *	PARAM_VALUE - value which needs to be validated.
 * 
 * @returns
 */
function isLoginValiadtionSuccess(){
	
	var validationObj = 
		{
			"last_name" : [
				{
					"METHOD_NAME" : METHODNAME_IS_REQUIRED,
					"PARAM_VALUE" : $("#last_name").val(),
					"METHOD_ERROR_MESSAGE" : "Please enter your last name.",
					"ERROR_ID" : "lastNameErrorId",
					"HIGHLIGHT_PARENT_WHEN_ERROR": true
					
					
				},
				{
					"METHOD_NAME" : METHODNAME_IS_ALPHA_NUMERIC,
					"PARAM_VALUE" : $("#last_name").val(),
					"ERROR_MESSAGE" : "Please enter your last name.",
					"ERROR_ID" : "lastNameErrorId",
					"HIGHLIGHT_PARENT_WHEN_ERROR": true

				}
			],
			"mrn"	:[
				{
					"METHOD_NAME" : METHODNAME_IS_VALUE_BETWEEN_MIN_AND_MAX,
					"PARAM_VALUE" : $("#mrn").val(),
					"PARAM_MIN_VALUE" :1,
					"PARAM_MAX_VALUE" :8,
					"ERROR_MESSAGE" : "Please enter a valid Medical Record Number.",
					"ERROR_ID" : "mrnErrorId",
					"HIGHLIGHT_PARENT_WHEN_ERROR": true
					
				}
			],
			"birth_day"	:[
				{
					"METHOD_NAME" : METHODNAME_IS_REQUIRED,
					"PARAM_VALUE" : $("#birth_day").val(),
					"ERROR_MESSAGE" : "Please enter a valid date of birth.",
					"ERROR_ID" : "dateOfBirthErrorId",
					"HIGHLIGHT_PARENT_WHEN_ERROR": true
					
				}
			],
			"birth_month"	:[
						{
							"METHOD_NAME" : METHODNAME_IS_REQUIRED,
							"PARAM_VALUE" : $("#birth_month").val(),
							"ERROR_MESSAGE" : "Please enter a valid date of birth.",
							"ERROR_ID" : "dateOfBirthErrorId",
							"HIGHLIGHT_PARENT_WHEN_ERROR": true
							
						}
					],
			"birth_year"	:[
			            {
			            	
			            	"METHOD_NAME" : METHODNAME_IS_REQUIRED,
							"PARAM_VALUE" : $("#birth_year").val(),
							"ERROR_MESSAGE" : "Please enter a valid date of birth.",
							"ERROR_ID" : "dateOfBirthErrorId",
							"HIGHLIGHT_PARENT_WHEN_ERROR": true
			            },
						{
							"METHOD_NAME" : METHODNAME_IS_MAX_LENGTH,
							"PARAM_VALUE" : $("#birth_year").val(),
							"PARAM_MAX_VALUE" :4,
							"ERROR_MESSAGE" : "Please enter a valid date of birth.",
							"ERROR_ID" : "dateOfBirthErrorId",
							"HIGHLIGHT_PARENT_WHEN_ERROR": true
							
						}
					]
	
		}
	
	var  isValid = validate(validationObj);

	return isValid;
	
}

/**
 * Called on the click of the Sign in button
 * @param megaMeetingId
 * @param lastName
 * @param firstName
 */
function loginSubmit(){
	
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
    
    // Parameters sent to the server
    var currentTime = new Date();
    var n = currentTime.getTime();
    // We are setting no cache in the url as safari is caching the url and returning the same results each time.
	var postdata = 'last_name=' + $('input[name=last_name]').val() + '&mrn=' + $('input[name=mrn]').val() + '&birth_month=' 
								+ birth_month + '&birth_year=' + $('input[name=birth_year]').val() + '&birth_day=' + birth_day + '&nocache=' + n;

	$.ajax({
        type: "POST",
        url: VIDEO_VISITS_MOBILE.Path.login.ajaxurl,
        data: postdata, 
        success: function(returndata) {
            returndata = $.trim(returndata);
           
            var LOGIN_STATUS_SUCCESS = "1";
        	var LOGIN_STATUS_PATIENT_NOT_FOUND_ERROR = "3";
        	var LOGIN_STATUS_CODE_ERROR = "4";
        	
            switch (returndata) {
                case LOGIN_STATUS_SUCCESS:
                	window.location.replace("mobilepatientmeetings.htm");
                    break;

               case LOGIN_STATUS_PATIENT_NOT_FOUND_ERROR:
            	  
            	   $("#globalError").text("We could not find this patient.  Please try entering the information again.");
            	   $("#globalError").removeClass("hide-me").addClass("error");

                    break;
                // TODO- Do we ge this value ?
                case LOGIN_STATUS_CODE_ERROR:
                	$("#globalError").text("The code entered did not match. Please try again (you can click the code image to generate a new one if needed).");
             	   	$("#globalError").removeClass("hide-me").addClass("error");
                    break;
                default:
                	$("#globalError").text("There was an error submitting your login.");
         	   		$("#globalError").removeClass("hide-me").addClass("error");
                   
                    break;
            }

        },
        error: function() {
        	$("#globalError").text("There was an error submitting your login.");
 	   		$("#globalError").removeClass("hide-me").addClass("error");
            
            
        }
    });
	
	return false;
}


function setSessionTimeout(){
	
	var currentTime = new Date();
    var n = currentTime.getTime();
    // We are setting no cache in the url as safari is caching the url and returning the same results each time.
	var postdata = 'nocache=' + n;
	
	$.ajax({
        type: "POST",
        url: VIDEO_VISITS_MOBILE.Path.setSessionTimeout.ajaxurl,
        data: postdata, 
        success: function(returndata) {
           returndata = $.trim(returndata);
        },
        error: function() {
        	$("#globalError").text("There was an error submitting your login.");
 	   		$("#globalError").removeClass("hide-me").addClass("error");
            
            
        }
    });
	
	return false;
}


