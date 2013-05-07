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
	        ajaxurl : 'mobilelogin.json'
	    },
	    guest : {
	        verify : 'verifyguest.json'
	    },
	    sessionTimeout : {
	        ajaxurl : 'sessiontimeout.json',
	        isValidUserSession: 'isValidUserSession.json',
	        isValidMeeting: 'isValidMeeting.json',
	    }
        ,
	    createGuestSession : {
	        ajaxurl : 'createguestsession.json'
	    }
        ,
	    createGuestSession : {
	        ajaxurl : 'createguestsession.json'
	    }
        ,
	    joinMeeting : {
	        ajaxurl : 'joinmeeting.json',
	        userPresentInMeeting:'userPresentInMeeting.json'
	    },
	    logout : {
	        logoutjson: 'logout.json',
	        logout_ui:'logout.htm'
	    },
	     guestlogout : {
	        logout_ui:'guestlogout.htm'
	    }
};

var request = {
   		 get: function(parameter)
   		 {
   		    var tmp = this.parameters()[parameter];
   		    return tmp;
   		 },
   		 parameters: function()
   		 {
   		    var result = {};
   		    var url = window.location.href;
   		    var parameters = url.slice(url.indexOf('?') + 1).split('&');
   		 
   		    for (var i = 0; i < parameters.length; i++)
   		    {
   		       var parameter = parameters[i].split('=');
   		       result[parameter[0]] = parameter[1];
   		    }
   		 return result;
   		 }
   	};
/*END - AJAX Server requests  */


/**
 * This is the main function which gets called when the document is ready and loaded in DOM
 */
$(document).ready(function() {
	
	detectDeviceCookie();
	hideAddressBar();
	
	// refresh the meetings page every one min
//	var refreshId = setInterval(function(){
//		var isUserLoggedInCookie = getCookie("isUserLoggedIn");
//		if (typeof isUserLoggedInCookie !== 'undefined' && isUserLoggedInCookie !=null && isUserLoggedInCookie !=""){
//			//alert("refreshing");
//			window.location.reload();
//		}
//		
//		
//	}, 60000);
		
	
	
	
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
	
	//removing the functionality as the modals lock themselves in Landscape mode (non-scrollable)
	/*$('.modal').on('touchmove', function (event) {
		// locking these elements, so they can't be moved when dragging the div
		event.preventDefault();
	});*/
	
	
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
	
	$("#btn-i-have-it, #btn-i-have-it_pg").click(function() {
		setCookie("APP_ALERT_COOKIE", "APP_ALERT_COOKIE");
		var targetId = event.target.id;
		if(targetId == 'btn-i-have-it'){
			hidesAppAlert();
		}
		if(targetId == 'btn-i-have-it_pg'){
			hidesAppAlertPatientGuest();
		}
		
	});
	
	
	$(".getAppButton, .getAppLink").click(function() {
		setCookie("APP_ALERT_COOKIE", "APP_ALERT_COOKIE");
		var iOSUrl = 'http://itunes.apple.com/us/app/video-visits/id622918437?mt=8';
		var androidUrl = 'https://play.google.com/store/apps/details?id=air.com.videoconferencinginfo.tpmg';
		
		
		var os = getAppOS();
		if(os == "iOS"){
			if(event.target.id == "getAppLink"){
				$(".getAppLink").attr("href", iOSUrl);
			}
			else{
				//window.location= iOSUrl;
				openTab(iOSUrl);
			}
		}
		else if(os == "Android"){	
			if(event.target.id == "getAppLink"){
				$(".getAppLink").attr("href", androidUrl);
			}
			else{
				//window.location= androidUrl;
				openTab(androidUrl);
			}
		}
		else{
			// we should never reach this condition
			alert("No device detected");
		}
	});

	$("#signInId, #logout-sign-in").click(function(event) {
		event.preventDefault();
		 $("#mrn").val('');
          $("#last_name").val('');
        $("#birth_month").val('');
        $("#birth_day").val('');
        $("#birth_year").val('');
		var targetId = event.target.id;
		// clear all errors
		clearAllErrors();
		if (typeof appAlertCookie !== 'undefined' && appAlertCookie !=null && appAlertCookie !=""){
			hidesAppAlert();
		}
		return false;
		
	});
	
	$("#signInIdPG, #signInIdPGHand").click(function(event) {
		event.preventDefault();
		
		var targetId = event.target.id;
		// clear all errors
		clearAllErrors();
		if (typeof appAlertCookie !== 'undefined' && appAlertCookie !=null && appAlertCookie !=""){
			hidesAppAlertPatientGuest();
		}
		return false;
		
	});
	
	
	// END--APP ALERT handling using cookie
	
	// Login button submit click
	$("#login-submit").click(function(event) {
		event.preventDefault();
		openPreloader();
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
		if(isLoginValiadtionSuccess()){
			loginSubmit();
		}
		else{
			closePreloader();
		}

	});
	
	// Login button submit click patient guest
	$("#login-submit-pg").click(function(event) {
		event.preventDefault();
		openPreloader();	
		// if client side validation successful
		if(validationPatientGuestLogin()){
			loginSubmitPG();
			
		}
		else{
			closePreloader();
		}


	});
	
	$(".button-launch-visit").click(function(event) {	
		event.preventDefault();
		openPreloader();
		var megaMeetingId = $(this).attr("megameetingid");
		var lastName = $(this).attr("lastname");
		var firstName = $(this).attr("firstname");
		var name = firstName + " " + lastName;
		var megaMeetingUrl = $(this).attr("megaMeetingUrl");
        var meetingId = $(this).attr("meetingId");
		
		// Check if the user session is active before launching the app
		
		var currentTime = new Date();
	    var n = currentTime.getTime();
		var postdata = "meetingId=" + meetingId + "&source=member&nocache=" + n;
		$.ajax({
			async:false,
	        type: "POST",
	        url: VIDEO_VISITS_MOBILE.Path.sessionTimeout.isValidMeeting,
	        data: postdata, 
	        success: function(returndata) {
	        	//console.log("returndata=" + returndata);
	        	try
	        	{
	        		returndata = $.parseJSON(returndata);
	        	}
	        	catch(e)
	        	{
	        		closePreloader();
        			window.location.replace("logout.htm");
	        	}
	        	var isValidUserSession =  returndata.isValidUserSession; 
	        	
	        	 if(returndata.success == true && isValidUserSession == true){
	        		 
	        		var meetingStatus = returndata.meetingStatus;
	             	if( meetingStatus == "finished" ||  meetingStatus == "host_ended" ||  meetingStatus == "cancelled" ){
	             		closePreloader();
	             		window.location.replace("meetingexpiredmember.htm");
	             	}
	             	else{
	             	// Get the meagmeeting username who joined the meeting. This will be passed to the API to check if the user has alredy joined the meeting from some other device.
		            	var postParaForUserPresentInMeeting = { "meetingId": meetingId, "megaMeetingDisplayName":name, 'nocache=' : n};
		            	$.post(VIDEO_VISITS_MOBILE.Path.joinMeeting.userPresentInMeeting, postParaForUserPresentInMeeting,function(userPresentInMeetingData){
		            		try
		            		{
			            		userPresentInMeetingData = jQuery.parseJSON(userPresentInMeetingData);
			            		
			            		if(userPresentInMeetingData.result == "true"){
			            			closePreloader();
			            			modalShow('modal-user-present');
			            		}
			            		else{
			            				closePreloader();
				            			joinMeeting(meetingId);
				    	        		launchVideoVisit(megaMeetingUrl, megaMeetingId, name);
			            			}
		            		}
		            		catch(e)
		            		{
		            			closePreloader();
		            			window.location.replace("logout.htm");
		            		}
		            	});
	             	}
	                
	            	
	                
	            }
	            else{
	            	closePreloader();
	            	window.location.replace("logout.htm");
	            }

	        },
	        error: function() {
	        	closePreloader();
	        	window.location.replace("logout.htm");
	        }
	    });
		
		
		
		

	});
    
    $(".button-launch-visit-pg").click(function(event) {	
		event.preventDefault();
		openPreloader();
		var megaMeetingId = $(this).attr("megameetingid");
		var lastName = $(this).attr("lastname");
		var firstName = $(this).attr("firstname");
		var email = $(this).attr("email");
		var megaMeetingUrl = $(this).attr("megaMeetingUrl");
    	
    	var currentTime = new Date();
	    var n = currentTime.getTime();
		var postdata = 'source=caregiver&nocache=' + n;
		$.ajax({
			async:false,
	        type: "POST",
	        url: VIDEO_VISITS_MOBILE.Path.sessionTimeout.isValidUserSession,
	        data: postdata, 
	        success: function(returndata) {
	        	//console.log("returndata=" + returndata);
	        	returndata = $.parseJSON(returndata);
	        	var isValidUserSession =  returndata.isValidUserSession; 
	        	//console.log("isValidUserSession=" + isValidUserSession);
	            if(isValidUserSession == true){
	            
	                launchPG(megaMeetingUrl, megaMeetingId, firstName, lastName,  email);
	            }
	            else{
	            	closePreloader();
	            	 window.location.replace(VIDEO_VISITS_MOBILE.Path.guestlogout.logout_ui);
	            }

	        },
	        error: function() {
	        	closePreloader();
	        	 window.location.replace(VIDEO_VISITS_MOBILE.Path.guestlogout.logout_ui);
	        }
	    });
    	
	   
	   
		 
		return false;
	});
	
	
    
    
    $('#logout-yes').click(function(){
        $.ajax({
            type: 'POST',
            url: VIDEO_VISITS_MOBILE.Path.logout.logoutjson,
            complete: function(returndata) {
            	//deleteCookie("isUserLoggedIn");
                window.location.replace(VIDEO_VISITS_MOBILE.Path.logout.logout_ui);
            }
        });
        return false;
    });
    
    $('#pg-logout-yes').click(function(){
        window.location.replace(VIDEO_VISITS_MOBILE.Path.guestlogout.logout_ui);
        return false;
    });
	
});



// Hides address bar on page load
/mobile/i.test(navigator.userAgent)
&& !window.location.hash
&& setTimeout(function () {
window.scrollTo(0,0);
}, 0);

function launchPG(megaMeetingUrl, megaMeetingId, firstName, lastName, email)
{
		var meetingCode = request.get('meetingCode');
    	var patientLastName = request.get('patientLastName');
	 // Parameters sent to the server
	    var currentTime = new Date();
	    var n = currentTime.getTime();
	    // We are setting no cache in the url as safari is caching the url and returning the same results each time.
		var postdata = 'patientLastName=' + patientLastName + '&meetingCode=' + meetingCode  +  '&nocache=' + n;
		
			
	
		$.ajax({
	        type: "POST",
	        url: VIDEO_VISITS_MOBILE.Path.guest.verify,
	        data: postdata,  
	        success: function(returndata) {
	            returndata = $.trim(returndata);
	           
	            returndata = jQuery.parseJSON(returndata);
	            
	            if(returndata.result === '1'){
	            	closePreloader();  
	            	$("#globalError").text('No matching patient found. Please try again.');           	
	                 $("#globalError").removeClass("hide-me").addClass("error");  
	                 return false;
	              } 
	            else if (returndata.result === '2') { 
	            	closePreloader();
	            	window.location.replace("meetingexpiredmemberpg.htm");
	                return false;
	            	
	            }
	            else if (returndata.result === '3') {   
	            	closePreloader();  
	            	$("#globalError").text('Some exception occurred while processing request..');           	
	                 $("#globalError").removeClass("hide-me").addClass("error");  
	                 return false;
	            }
	            else if (returndata.result === '4') {   
	            	closePreloader();  
	            	$("#globalError").text('You have already joined this video visit from another device. You must first sign off from the other device before attempting to join this visit here.');           	
	                 $("#globalError").removeClass("hide-me").addClass("error");  
	                 return false;
	            }
	              
	            createGuestSession();
	            closePreloader();
				launchVideoVisitForPatientGuest(megaMeetingUrl, megaMeetingId, firstName + ' ' + lastName + ' (' + email + ')');
				clearAllErrors();
				
	
	        },
	        error: function() {
	        	
	        	//$("#globalError").text("There was an error submitting your login.");
	 	   		//$("#globalError").removeClass("hide-me").addClass("error");
	            
	            
	        }
	    });
}
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

function openPreloader(){
	//modalShow("modal-preloader");
}

function closePreloader(){
	//modalHide("modal-preloader");
}

function modalClinician() {
	$(".alert-clinician").removeClass("hide-me");
	modalShow("videovisitLandingModalId");
}

function modalGuest(){
	$(".alert-guest").removeClass("hide-me");
	modalShow("videovisitLandingModalId");
}

function scrollMe(){
	$('html, body').animate({scrollTop:0}, 'slow');
	return false;
}

function hidesAppAlert (){
	$("#app-alert").addClass("hide-me");
	$("#login-form").removeClass("hide-me");

}

function hidesAppAlertPatientGuest (){
	$("#app-alert").addClass("hide-me");
	$("#patientguest-login-form").removeClass("hide-me");

}
function hideable(){
	// Hides inline alerts (which have x on top right) on click
	$(this).addClass("hide-me");
	return false;
}


function hideSecurityAlert (){
	$(".alert.hideable").addClass("hide-me");
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
 
    if( p === 'iPad' || p === 'iPhone' || p === 'iPod' || p==='iPhone Simulator' || p==='iPad Simulator'){
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


	
	
function hideAddressBar(){
	if (navigator.userAgent.match(/Android/i)) {
	window.scrollTo(0,0); // reset in case prev not scrolled
	var nPageH = $(document).height();
	var nViewH = window.outerHeight;
	if (nViewH > nPageH ) {
	nViewH = nViewH / window.devicePixelRatio;
	$('BODY').css('height',nViewH + 'px');
	}
	window.scrollTo(0,1);
	}else{
	addEventListener("load", function() {
	setTimeout(hideURLbar, 0);
	setTimeout(hideURLbar, 600);
	}, false);
	}
	function hideURLbar(){
	if(!pageYOffset){
	window.scrollTo(0,1);
	}
	}
	return this;
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

function deleteCookie(c_name){

	var cookie = getCookie(c_name);
	
	if (typeof cookie !== 'undefined' && cookie !=null && cookie !=""){
		var c_value=";expires=Thu, 01-Jan-1970 00:00:01 GMT";
		document.cookie=c_name + "=" + c_value;
	}
}


/**
 * Called on the click of the Launch button
 * @param megaMeetingId
 * @param lastName
 * @param firstName
 */
function launchVideoVisit(megaMeetingUrl, megaMeetingId, name){
	//var name = lastName + " " + firstName;
	
	var megaMeetingUrl = megaMeetingUrl + "/guest/&id=" + megaMeetingId  +  "&name=" + name + "&title=Video Visits&go=1&agree=1"; 
	//alert("megaMeetingUrl=" + megaMeetingUrl);
	//window.location.replace(megaMeetingUrl);
	openTab(megaMeetingUrl);
}


/**
 * Called on the click of the Launch button for patient guest
 * @param megaMeetingId
 * @param lastName
 * @param firstName
 */
function launchVideoVisitForPatientGuest(megaMeetingUrl, megaMeetingId, name){
	var megaMeetingUrl = megaMeetingUrl + "/guest/&id=" + megaMeetingId  +  "&name=" + name + "&title=Video Visits&go=1&agree=1"; 
	//alert("megaMeetingUrl=" + megaMeetingUrl);
	//window.location.replace(megaMeetingUrl);
	 openTab(megaMeetingUrl);
}


function openTab(url)
{
		var a = window.document.createElement("a");
	 a.target = '_blank';
	 a.href = url;

	    // Dispatch fake click
	 var e = window.document.createEvent("MouseEvents");
	 e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, true, false, false, false, 0, null);
	 a.dispatchEvent(e);
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
					"METHOD_NAME" : METHODNAME_IS_ALPHA_NUMERIC,
					"PARAM_VALUE" : $("#last_name").val(),
					"ERROR_MESSAGE" : "Last name is required and must contain only alphabets.",
					"ERROR_ID" : "lastNameErrorId",
					"HIGHLIGHT_PARENT_WHEN_ERROR": true
				}
			],
			"mrn"	:[
				{
					"METHOD_NAME" : METHODNAME_IS_VALUE_BETWEEN_MIN_AND_MAX,
					"PARAM_VALUE" : $("#mrn").val(),
					"PARAM_MIN_VALUE" :8,
					"PARAM_MAX_VALUE" :8,
					"ERROR_MESSAGE" : "MRN is required and should be 8 digits.",
					"ERROR_ID" : "mrnErrorId",
					"HIGHLIGHT_PARENT_WHEN_ERROR": true
					
				}
			],
            "birth_month"	:[
						{
							"METHOD_NAME" : METHODNAME_IS_BIRTHMONTH_VALIDATION,
							"PARAM_VALUE" : $("#birth_month").val(),
							"ERROR_MESSAGE" : "Please enter a valid birth month.",
							"ERROR_ID" : "dateOfBirthMonthErrorId",
							"HIGHLIGHT_PARENT_WHEN_ERROR": true
							
						}
					],
			"birth_day"	:[
				{
					"METHOD_NAME" : METHODNAME_IS_BIRTHDAY_VALIDATION,
					"PARAM_VALUE" : $("#birth_day").val(),
					"ERROR_MESSAGE" : "Please enter a valid birth day.",
					"ERROR_ID" : "dateOfBirthDayErrorId",
					"HIGHLIGHT_PARENT_WHEN_ERROR": true
				}
			],
			"birth_year"	:[
			            {
			            	
			            	"METHOD_NAME" : METHODNAME_IS_BIRTHYEAR_VALIDATION,
							"PARAM_VALUE" : $("#birth_year").val(),
							"ERROR_MESSAGE" : "Please enter a valid birth year.",
							"ERROR_ID" : "dateOfBirthYearErrorId",
							"HIGHLIGHT_PARENT_WHEN_ERROR": true
			            }
					]
	
		}
	
	var  isValid = validate(validationObj);

	return isValid;
	
}

function validationPatientGuestLogin(){
	
	var validationObj = 
	{
		"last_name" : [
			{
				"METHOD_NAME" : METHODNAME_IS_ALPHA_NUMERIC,
				"PARAM_VALUE" : $("#last_name").val(),
				"ERROR_MESSAGE" : "Last name is required and must contain only alphabets.",
				"ERROR_ID" : "lastNameErrorId",
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
                	// set the cookie for logged in user
                	//setCookie("isUserLoggedIn", true);
                	window.location.replace("mobilepatientmeetings.htm");
                    break;

               case LOGIN_STATUS_PATIENT_NOT_FOUND_ERROR:
            	   closePreloader();
            	   $("#globalError").text("We could not find this patient.  Please try entering the information again.");
            	   $("#globalError").removeClass("hide-me").addClass("error");

                    break;
                // TODO- Do we ge this value ?
                case LOGIN_STATUS_CODE_ERROR:
                	closePreloader();
                	$("#globalError").text("The code entered did not match. Please try again (you can click the code image to generate a new one if needed).");
             	   	$("#globalError").removeClass("hide-me").addClass("error");
                    break;
                default:
                	closePreloader();
                	$("#globalError").text("There was an error submitting your login.");
         	   		$("#globalError").removeClass("hide-me").addClass("error");
                   
                    break;
            }

        },
        error: function() {
        	closePreloader();
        	$("#globalError").text("There was an error submitting your login.");
 	   		$("#globalError").removeClass("hide-me").addClass("error");
            
            
        }
    });
	

	return false;
}

function loginSubmitPG(){
	
    // Prepare data from pertinent fields for POSTing
    
    var meetingCode = request.get('meetingCode');
    
    // Parameters sent to the server
    var currentTime = new Date();
    var n = currentTime.getTime();
    // We are setting no cache in the url as safari is caching the url and returning the same results each time.
	var postdata = 'patientLastName=' + $('input[name=last_name]').val() + '&meetingCode=' + meetingCode  +  '&nocache=' + n;

	$.ajax({
        type: "POST",
        url: VIDEO_VISITS_MOBILE.Path.guest.verify,
        data: postdata,  
        success: function(returndata) {
            returndata = $.trim(returndata);
            
            returndata = jQuery.parseJSON(returndata);
            if(returndata.result === '1'){
            	closePreloader();  
            	$("#globalError").text('No matching patient found. Please try again.');           	
                 $("#globalError").removeClass("hide-me").addClass("error");  
                 return false;
              } 
            else if (returndata.result === '2') { 
            	closePreloader();
            	window.location.replace("meetingexpiredmemberpg.htm");
                return false;
            	
            }
            else if (returndata.result === '3') {   
            	closePreloader();  
            	$("#globalError").text('Some exception occurred while processing request..');           	
                 $("#globalError").removeClass("hide-me").addClass("error");  
                 return false;
            }
            else if (returndata.result === '4') {   
            	closePreloader();  
            	$("#globalError").text('You have already joined this video visit from another device. You must first sign off from the other device before attempting to join this visit here.');           	
                 $("#globalError").removeClass("hide-me").addClass("error");  
                 return false;
            }
            
            
             window.location.replace("mobilepatientguestmeetings.htm?meetingCode=" + meetingCode + "&patientLastName=" + $('input[name=last_name]').val());

        },
        error: function() {
        	closePreloader();
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
        url: VIDEO_VISITS_MOBILE.Path.sessionTimeout.ajaxurl,
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

function createGuestSession(){
	
	var currentTime = new Date();
    var n = currentTime.getTime();
    // We are setting no cache in the url as safari is caching the url and returning the same results each time.
    var meetingCode = request.get('meetingCode');
    var patientLastName = request.get('patientLastName');
	var postdata = 'patientLastName=' + patientLastName + '&meetingCode=' + meetingCode  +  '&nocache=' + n;	

	$.ajax({
        type: "POST",
        url: VIDEO_VISITS_MOBILE.Path.createGuestSession.ajaxurl,
        data: postdata, 
        success: function(returndata) {
           returndata = $.trim(returndata);
        },
        error: function() {
        	//$("#globalError").text("There was an error submitting your login.");
 	   		//$("#globalError").removeClass("hide-me").addClass("error");
            
            
        }
    });
	
	return false;
}

function joinMeeting(meetingId){
	
	var currentTime = new Date();
    var n = currentTime.getTime();
    // We are setting no cache in the url as safari is caching the url and returning the same results each time.
    
	var postdata = 'meetingId=' + meetingId   +  '&nocache=' + n;	
	$.ajax({
        type: "POST",
        url: VIDEO_VISITS_MOBILE.Path.joinMeeting.ajaxurl,
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

function refreshTimestamp(){

	
	var currentTime = new Date();
	var month = currentTime.getMonth() + 1;
	var day = currentTime.getDate();
	var year = (currentTime.getFullYear() + '').substring(2, 4);
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();

	if (minutes < 10){
		minutes = "0" + minutes;
	}

	var suffix = "am";
	if (hours >= 12) {
		suffix = "pm";
		hours = hours - 12;
	}
	if (hours == 0) {
		hours = 12;
	}

	var refreshTimeText = "Last updated: " + month + "/" + day + "/" + year + " at " + hours + ":" + minutes + " " + suffix;

	$("#lastRefreshTimeId").text(refreshTimeText);
	

}