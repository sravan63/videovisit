/* AJAX Server requests */
var VIDEO_VISITS_MOBILE = {
    jQueryDocument : $(document),
    jQueryWindow   : $(window)
};

var isMobileDevice;
var isRearCamera = false;
var newStartTimeRecursiveCall;
var hostDirtyThisMeeting = false;
var waitingTextClass = 'wating-room-late-message';

var urlVal = window.location.href.indexOf("videovisitmobileready") > -1;
if(!urlVal) {
	history.pushState(null, null, location.href);
	window.onpopstate = function () {
		history.go(1);
	};
}


VIDEO_VISITS_MOBILE.Path = {
	    global : {
	        error : 'error.htm',
	        expired : 'logout.htm'
	    },
	    login : {
	        ajaxurl : 'mobilelogin.json'
	    },
	    guest : {
	        verify : 'verifyguest.json',
	        launchMeetingForMemberGuest: 'launchMeetingForMemberGuest.json'
	        	
	    },
	    sessionTimeout : {
	        ajaxurl : 'sessiontimeout.json'
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
	        userPresentInMeeting:'userPresentInMeeting.json',
	        launchMeetingforMember:'launchMeetingforMember.json'	        	
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

	function setMemberContext()
	{
		if ( window.location.href.indexOf('mobilepatientlanding.htm') != -1)
		{
			deleteCookie('memberContext');
			setCookieWithTime('memberContext','false::landingPage',60*60*24*13);
		}

		if ( window.location.href.indexOf('mobilepglanding.htm') != -1)
		{
			var meetingCode = request.get('meetingCode');
			deleteCookie('memberContext');
			setCookieWithTime('memberContext','true:' + meetingCode +':landingPagePG',60*60*24*13);
		}

	}
/*END - AJAX Server requests  */

$( window ).on( "orientationchange", function( event ) {
	setTimeout(function(){
		setVideoFeedHeight();
		setOrientationMode();
	}, 1000);
});

/**
 * This is the main function which gets called when the document is ready and loaded in DOM
 */
$(document).ready(function() {
	var inAppBrowserFlag = $('#inAppBrowserFlag').val();
	var isPgFlag = $('#isPG').val();
	
	detectDeviceCookie();
	hideAddressBar();
	setMemberContext();
	
	//Block Special Characters in Last Name, MRN & DOB fields on Login Screens
	$(document).delegate(':input:visible', 'keypress', function(e) {
        var legalChars = /[\w\d\s\t\b\(\)\[\]\{\}\-.@#,\'\"\:]/gi;
        var cCode = !e.charCode ? e.which : e.charCode;
        var key = String.fromCharCode(cCode);
        if(cCode !== 9 && cCode !== 0) { // Allow normal tab functionality
        	if (!(legalChars.test(key))) {
        		e.preventDefault();
        		return false;
        	}
        }
    });

    /* Grabs the text contents of the element with class name 'camel-case' and converts it into 'camel case format' (Ex:Camel Case) */
    $('.camel-case').each(function(){
        var existingText = $(this).text().toLowerCase().trim();
        var splittedText = existingText.split(' ');
        var isClinician = (existingText.indexOf(',') > 0);
        var convertedCamelCaseText = '';

        for(var i=0;i<splittedText.length;i++){
            var s = (isClinician && i == splittedText.length-1)?splittedText[i].toUpperCase():splittedText[i];
            if(s !== ''){
                convertedCamelCaseText += s.charAt(0).toUpperCase() + s.slice(1)+' ';
            }
        }
        $(this).html(convertedCamelCaseText.trim());
    });
	
	//Block Numbers in Last Name field on Login Screens
    $("#last_name").on("keypress", function(e){
        var nonLegalChars = /[\D]/gi;
        var charCode = !e.charCode ? e.which : e.charCode;
        var key = String.fromCharCode(charCode);
        if (!(nonLegalChars.test(key))) {
            e.preventDefault();
            console.log("return false");
            return false;
        }
    });    
	//Block Alphabets in MRN & DOB fields on Login Screens
    $("#mrn, #birth_month, #birth_year").on("keypress", function(e){
        var charCode = !e.charCode ? e.which : e.charCode;
        if(charCode > 31 && (charCode < 48 || charCode > 57)){
            return false;
        }
        return true;
    });

    /* DE7934 - restricting MM and YYYY fields in android web app*/
	$("#birth_month, #birth_year").on("input", function(e) {
	    var max = this.getAttribute('maxlength');
	    if (this.value.length > max) {
	        this.value = this.value.substring(0, max);
	    }
	});
	
	$(":input").on('keyup', function(){
		if(isPgFlag == "true"){
			if($('#last_name').val() != ""){
				$('#login-submit-pg').removeAttr('disabled');
	            $('#login-submit-pg').css('cursor', 'pointer');
	            $('button#login-submit-pg').css('opacity', '1.0');
			}
			else{
				$('#login-submit-pg').attr('disabled', true);
				$('#login-submit-pg').css('cursor', 'default');
	            $('button#login-submit-pg').css('opacity', '0.7');
			}
		}
		else{
			if($('#last_name').val() != "" && $('#mrn').val() != "" && $('#birth_month').val() != "" && $('#birth_year').val() != ""){
				$('#login-submit').removeAttr('disabled');
	            $('#login-submit').css('cursor', 'pointer');
	            $('button#login-submit').css('opacity', '1.0');

				$('#mobile-login-submit').removeAttr('disabled');
				$('#mobile-login-submit').css('cursor', 'pointer');
	            $('button#mobile-login-submit').css('opacity', '1.0');
			}
			else{
				$('#login-submit').attr('disabled', true);
				$('#login-submit').css('cursor', 'default');
	            $('button#login-submit').css('opacity', '0.5');

				$('#mobile-login-submit').attr('disabled', true);
				$('#mobile-login-submit').css('cursor', 'default');
				//US28334 Mobile Temp Access Sign in Page: Update color of disabled state sign in button -Fix
	            $('button#mobile-login-submit').css('opacity', '0.7');
			}
		}
	});

	// for focus and blur events
	$("form :input").focus(function() {
		// clear all errors
		clearAllErrors();
	}).blur(function() {
		$(this).parent().removeClass("form-focus");
	});

	// for focus on individual Input Fields
	$("#last_name").on('focus', function() {
		$("#last_name").css("color", "#000000");
	});

	// for focus on individual Input Fields
	$("#mrn").on('focus', function() {
		$("#mrn").css("color", "#000000");
	});

	// for focus on individual Input Fields
	$("#birth_month").on('focus', function() {
		$("#birth_month").css("color", "#000000");
	});

	// for focus on individual Input Fields
	$("#birth_year").on('focus', function() {
		$("#birth_year").css("color", "#000000");
	});

	$(".modal-window .button-close").click(modalHideByClass);
	$("#close-modal").click(function(){
		modalHide('modal-login');
	});
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


	// START--APP ALERT handling using cookie
	var appAlertCookie=getCookie("APP_ALERT_COOKIE");

	$("#btn-i-have-it, #btn-i-have-it_pg").click(function() {
		setCookie("APP_ALERT_COOKIE", "APP_ALERT_COOKIE");
		//var targetId = event.target.id;
		/*if(targetId == 'btn-i-have-it'){
			//hidesAppAlert();
			modalHide('modal-login');
		}
		if(targetId == 'btn-i-have-it_pg'){
			hidesAppAlertPatientGuest();
		}*/
		modalHide('modal-login');
		window.location.href = window.location.href;
	});


	$(".getAppButton, .getAppLink").click(function(event) {
		setCookie("APP_ALERT_COOKIE", "APP_ALERT_COOKIE");
		var iOSUrl = 'https://itunes.apple.com/us/app/KPPC/id497468339?mt=8';
		var androidUrl = 'https://play.google.com/store/apps/details?id=org.kp.tpmg.preventivecare&hl=en';


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
		window.location.href = window.location.href;
	});

	$("#signInId, #logout-sign-in").click(function(event) {
		$("#app-alert").addClass("hide-me");
		$("#login-form").addClass("hide-me");
		$("#modal-window").addClass("hide-me");
		var appOS = getAppOS();
		if (typeof appAlertCookie == 'undefined' || appAlertCookie ==null || appAlertCookie ==""){

			modalShow('modal-login');
			$("#app-alert").removeClass("hide-me");
			return false;
		}
		else
		{
			modalHide('modal-login');
			$("#app-alert").addClass("hide-me");
		}
		//if (/iP(hone|od|ad)/.test(navigator.platform)) {
		if(appOS === 'iOS'){

		    var iOSver = iOSversion();
		    //alert('iOS ver: ' + iOSver);
		    //Fix for the ios 7 issue with openTab function
			if (iOSver[0] >= 7) {
			  //alert('This is running iOS 7 or later.');
			  window.location.replace('kppc://videovisit?signon=true');
			}else{
				openTab('kppc://videovisit?signon=true');
			}
		}
		else{
			openTab('kppc://videovisit?signon=true');

		}
	});

	/*$("#signInIdPG, #signInIdPGHand").click(function(event) {
		event.preventDefault();
		
		var targetId = event.target.id;
		// clear all errors
		clearAllErrors();
		if (typeof appAlertCookie !== 'undefined' && appAlertCookie !=null && appAlertCookie !=""){
			hidesAppAlertPatientGuest();
		}
		
		return false;
		
	});*/
	
	$("#signInIdPG, #signInIdPGHand").click(function(event) {
		event.preventDefault();
		var meetingCode = $("#meetingCode").val();
		window.location.replace("mobilepglogin.htm?meetingCode=" +meetingCode);
	});
	
	// END--APP ALERT handling using cookie

	// Login button submit click
	$("#login-submit").click(function(event) {
		event.preventDefault();

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
	
	// Login button submit click
	$("#mobile-login-submit").click(function(event) {
		event.preventDefault();

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
			mobileloginSubmit();
		}

	});

	// Login button submit click patient guest
	$("#login-submit-pg").click(function(event) {
		event.preventDefault();

		// if client side validation successful
		if(validationPatientGuestLogin()){
			loginSubmitPG();

		}

	});
	
	$(".refresh_button").click(function(event){
		console.log("Refresh button clicked");
		var postdata = "inAppBrowserFlag=" +inAppBrowserFlag;
		// This ajax call is deprecated as part of backend code cleanup in Iteration 10, 2018.
		$.ajax({
			async: false,
			type: "POST",
			url: VIDEO_VISITS_MOBILE.Path.sessionTimeout.isValidMeeting,
	        data: postdata,
	        success: function(returndata) {
	        	try{
	        		returndata = $.parseJSON(returndata);
	        	}
	        	catch(e){
	            	window.location.replace("mobileAppPatientLogin.htm");
	        	}

	        	var isValidUserSession =  returndata.isValidUserSession;

	        	if(returndata.success == true && isValidUserSession == true){
	        		window.location.reload();
	        	}
	        	else{
	            	window.location.replace("mobileAppPatientLogin.htm");
	        	}
	        },
	        error: function() {
            	window.location.replace("mobileAppPatientLogin.htm");
	        }
		});
	});
	
	//temp launch video function for guest
	
	 $(".button-launch-visit").click(function(event) {
		//var inAppBrowserFlag = $('#inAppBrowserFlag').val();
		event.preventDefault();

		var megaMeetingId = $(this).attr("megameetingid");
		var lastName = $(this).attr("lastname");
		var firstName = $(this).attr("firstname");
		//var name = firstName + " " + lastName;
		var inMeetingDisplayName = lastName + ", " + firstName;
		var megaMeetingUrl = $(this).attr("megaMeetingUrl");
        var meetingId = $(this).attr("meetingId");

		// Check if the user session is active before launching the app

		var currentTime = new Date();
	    var n = currentTime.getTime();
		var postdata = "meetingId=" + meetingId + "&inMeetingDisplayName=" + inMeetingDisplayName + "&source=member&nocache=" + n;
		$.ajax({
	        type: "POST",                                                        
	        url: VIDEO_VISITS_MOBILE.Path.joinMeeting.launchMeetingforMember,
	        data: postdata,
	        success: function(data) {
	        	try
	        	{
	        		data = $.parseJSON(data);
	        		//console.log("response",data.status.code);
	        	
	   
	        		//validationData= $.parseJSON(validationData)
	        	}
	        	catch(e)
	        	{
	        		if (inAppBrowserFlag == "true")
	            		window.location.replace("mobileAppPatientLogin.htm");

	            	else
	            		window.location.replace("logout.htm");
	        	}
	        	var isValidUserSession =  data.isValidUserSession;

	        	 if(data.success == true && isValidUserSession == true){

	        		var meetingStatus = data.service.launchMeetingEnvelope.launchMeeting.meetingStatus;
	             	if( meetingStatus == "finished" ||  meetingStatus == "host_ended" ||  meetingStatus == "cancelled" ){
	             		if (inAppBrowserFlag == "true")
    	            		window.location.replace("mobileAppPatientMeetingExpired.htm");
	             		else
	             			window.location.replace("meetingexpiredmember.htm");
	             	}
	             	else{
		             	// Get the meagmeeting username who joined the meeting. This will be passed to the API to check if the user has alredy joined the meeting from some other device.
			            		try
			            		{
				            		var userPresentInMeetingData = data.service.launchMeetingEnvelope.launchMeeting.inMeeting;

				            		if(userPresentInMeetingData == true){
				            			$("#layover").hide();
				            			modalShow('modal-user-present');
				            		}
				            		else{
				            			launchVideoVisitMember(data);
				            			}
			            		}
			            		catch(e)
			            		{
			            			if (inAppBrowserFlag == "true")
			    	            		window.location.replace("mobileAppPatientLogin.htm");
			    	            	else
			    	            		window.location.replace("logout.htm");
			            		}
			            	
		             	}
		            }
		            else{
		            	if (inAppBrowserFlag == "true")
		            		window.location.replace("mobileAppPatientLogin.htm");
		            	else
		            		window.location.replace("logout.htm");
		            }

		        },
		        error: function() {
		        	if (inAppBrowserFlag == "true")
	            		window.location.replace("mobileAppPatientLogin.htm");
	            	else
	            		window.location.replace("logout.htm");
	            		 },
		        beforeSend: function () {		        	
		        	$("#layover").show();		        	
	        	}
		    });
		});
	             	

	$("#btnPatient").click(function(event) {
		deleteCookie('memberContext');
		setCookieWithTime('memberContext','false::landingPage',60*60*24*13);
		window.location.href = "mobilepatientlightauth.htm";
	});

	$(".button-launch-visit-pg").click(function(event) {
		event.preventDefault();

		var megaMeetingId = $(this).attr("megameetingid");
		var lastName = $(this).attr("lastname");
		var firstName = $(this).attr("firstname");
		var email = $(this).attr("email");
		var megaMeetingUrl = $(this).attr("megaMeetingUrl");
		var meetingCode = request.get('meetingCode');
    	var patientLastName = request.get('patientLastName');
    	var isMobileFlow= true;
    	

    	var currentTime = new Date();
	    var n = currentTime.getTime();
		var postdata = 'patientLastName=' + patientLastName + '&meetingCode=' + meetingCode  +'&isMobileFlow='+ isMobileFlow +'&source=caregiver&nocache=' + n;
		
		$.ajax({			
	        type: "POST",
	        url: VIDEO_VISITS_MOBILE.Path.guest.launchMeetingForMemberGuest,
	        data: postdata,
	        success: function(returndata) {
	        	try{
		        	returndata = $.parseJSON(returndata);		        	
		        	console.log("response",returndata);	        	
		        	var isValidUserSession =  returndata.isValidUserSession;
		        	console.log("isValidUserSession: "+isValidUserSession)
		            if(isValidUserSession == true){
		            	 var delay=1000; //1 seconds
	
	                     setTimeout(function(){
		                     //your code to be executed after 1 seconds
	                    	 console.log("calling launchMemberGuest");
		                     launchMemberGuest(returndata,megaMeetingUrl, megaMeetingId, firstName, lastName,  email);
	                     }, delay);
		        	}
		            else{
		            	window.location.replace(VIDEO_VISITS_MOBILE.Path.guestlogout.logout_ui);
		            }
	        	}
	        	catch(e)
	         	{
	        		window.location.replace(VIDEO_VISITS_MOBILE.Path.guestlogout.logout_ui);
	         	}
	        },
	        error: function() {
	        	window.location.replace(VIDEO_VISITS_MOBILE.Path.guestlogout.logout_ui);
	        },
	        beforeSend: function () {	        	
	        	$("#layover").show();		        	
        	}
	    });

		return false;
	});




    $('#logout-yes').click(function(){
    	deleteCookie('memberContext');
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
    	deleteCookie('memberContext');
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

//new function launchPatientGuest for guest to join vidyo

function launchMemberGuest(returndata,megaMeetingUrl, megaMeetingId, firstName, lastName,  email){
	
	 if(returndata.status.code === '500'){
		 $("#layover").hide();
     	$("#globalError").text('No matching patient found. Please try again.');
          $("#globalError").removeClass("hide-me").addClass("error");
          window.location.replace("logout.htm");
                   
       }
     else if (returndata.status.code === '510') {

     	window.location.replace("meetingexpiredmemberpg.htm");
         return false;

     }
     else if (returndata.status.code === '900') {
    	 $("#layover").hide();
     	$("#globalError").text('Some exception occurred while processing request..');
          $("#globalError").removeClass("hide-me").addClass("error");
          return false;          
     }
     else if (returndata.status.code === '400') {
    	 $("#layover").hide();
     	$("#globalError").text('You have already joined this video visit from another device. You must first sign off from the other device before attempting to join this visit here.');
          $("#globalError").removeClass("hide-me").addClass("error");          
          return false;          
     }
	 
	 try
 	{
 		//data = jQuery.parseJSON(data);
 		//if ( returndata.errorIdentifier == 1){
 			//window.location.replace("logout.htm");
 		//}

 		//if (returndata.errorMessage) {
 		//	window.location.replace("logout.htm");
 		//}
 		var mObj = returndata.launchMeetingEnvelope.launchMeeting;
		var vendor = returndata.launchMeetingEnvelope.launchMeeting.vendor;
 		url = returndata.launchMeetingEnvelope.launchMeeting.roomJoinUrl;
 		console.log("url:"+url)
 		launchVideoVisitForPatientGuest(mObj,vendor,url, megaMeetingId, lastName + ', ' + firstName + ', (' + email + ')');
			clearAllErrors();

 	}
 	catch(e)
 	{
 		window.location.replace("logout.htm");
 	}
	
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

    if( p === 'iPad' || p === 'iPhone' || p === 'iPod' || p === 'MacIntel' || p==='iPhone Simulator' || p==='iPad Simulator'){
        return "iOS";
    }

   
    //next, check if this is a supported AIR 3.1 Android device http://kb2.adobe.com/cps/923/cpsid_92359.html
    //Updated (3/5/2012) Advertize only to Android 2.2, 2.3, 3.0, 3.1 and 3.2 devices.
    //Updated (8/29/2012) Added Android 4.0 to the list of supported operating systems.
 /*   if (navigator.userAgent.match(/Android 2.2/i) || navigator.userAgent.match(/Android 2.3/i) ||
    navigator.userAgent.match(/Android 3.0/i) || navigator.userAgent.match(/Android 3.1/i) ||
    navigator.userAgent.match(/Android 3.2/i) || navigator.userAgent.match(/Android 4.0/i) ||
    navigator.userAgent.match(/Android 4.1/i) || navigator.userAgent.match(/Android 4.2/i)  || navigator.userAgent.match(/Android 4.3/i)  || navigator.userAgent.match(/Android 4.4/i)){
           return "Android";
    }*/
    
    if(navigator.userAgent.match(/Android/i)){
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
function setCookieWithTime(c_name,value,t){
	var exdate=new Date();
	var time = exdate.getTime();
	// expiry set to 20 years
	var addTime = t;

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


function launchVideoVisitMember(data){
		//add logic to differentiate vidyo/pexip
	
		//var name = lastName + " " + firstName;
		try{
			//data = jQuery.parseJSON(data);
			if ( data.service.status.code != 200){
				window.location.replace("logout.htm");
			}

//			if (data.errorMessage) {
//				window.location.replace("logout.htm");
//			}
//			console.log("launchVideoVisitMember")
			url = data.service.launchMeetingEnvelope.launchMeeting.roomJoinUrl;
			//window.location.href = 'videovisitmobileready.htm';
			//return;
//			console.log("url",url);
		    var mObj = data.service.launchMeetingEnvelope.launchMeeting;
		    var vendor = data.service.launchMeetingEnvelope.launchMeeting.vendor;
            var appOS = getAppOS();
            var isAndroidSDK = $('#isAndroidSDK').val();

		    if(appOS === 'iOS'){
                 window.location.replace(url);
			}
			else {
				if(isAndroidSDK=="true"){
				 openTab(url);
				}
				else {
				var newurl = new URL(url);
				var roomJoinPexip = mObj.roomKey; // newurl.searchParams.get('roomUrl');
              var mobileMeetingObj = {
                    "meetingId": mObj.meetingId,
                    "meetingCode": null,
                    "caregiverId": null,
                    "roomUrl": roomJoinPexip,
                    "guestName": mObj.member.inMeetingDisplayName,
                    "isProvider": 'false',
                    "isMember": "Y",
                    "isProxyMeeting": "N",
                    "guestUrl": roomJoinPexip
                }
                $.ajax({
                   type: 'POST',
                   url: 'videoVisitMobile.htm',
                   cache: false,
                   async: false,
                   data: mobileMeetingObj,
                   success: function(){
                       //add logic to differentiate vidyo/pexip
                       window.location.href = 'videovisitmobileready.htm';
                   },
                   error: function(err) {
                       window.location.href="logout.htm";//DE15797 changes, along with backend back button filter changes
                   }
               });
            }
		    }
		    
	}
		catch(e)
		{
			window.location.replace("logout.htm");
		}
	}

	//var megaMeetingUrl = megaMeetingUrl + "/guest/&id=" + megaMeetingId  +  "&name=" + name + "&title=Video Visits&go=1&agree=1";

	//alert("megaMeetingUrl=" + megaMeetingUrl);
	//window.location.replace(megaMeetingUrl);




/**
 * Called on the click of the Launch button for patient guest
 * @param megaMeetingId
 * @param lastName
 * @param firstName
 */
function launchVideoVisitForPatientGuest(mObj,vendor,megaMeetingUrl, meetingId, name){
	//add logic to differentiate vidyo/pexip
	
	//var megaMeetingUrl = megaMeetingUrl + "/guest/&id=" + megaMeetingId  +  "&name=" + name + "&title=Video Visits&go=1&agree=1";
	var appOS = getAppOS();
	var meetingCode = request.get('meetingCode');
	var caregiverId = $('#caregiverId').val();
	//if (/iP(hone|od|ad)/.test(navigator.platform)) {
	if(vendor == 'pexip'){	
              var mobileMeetingObj = {
                    "meetingId": mObj.meetingId,
                    "meetingCode": meetingCode ? meetingCode : null,
                    "caregiverId": caregiverId ? caregiverId : name,
                    "roomUrl": megaMeetingUrl,
                    "guestName": name,
                    "isProvider": 'false',
                    "isMember": "N",
                    "isProxyMeeting": "N",
                    "guestUrl": megaMeetingUrl
                }
                $.ajax({
                   type: 'POST',
                   url: 'videoVisitMobile.htm',
                   cache: false,
                   async: false,
                   data: mobileMeetingObj,
                   success: function(){
                       window.location.href = 'videovisitmobileready.htm';
                   },
                   error: function(err) {
                       window.location.href="logout.htm";//DE15797 changes, along with backend back button filter changes
                   }
               });
	
    }
	else if(appOS === 'iOS'){
	    var iOSver = iOSversion();
	    //Fix for the ios 7 issue with openTab function
		if (iOSver[0] >= 7) {
			this.timer = setTimeout(this.openWebApp, 500);
			window.location.replace(megaMeetingUrl);
		}else{
			this.timer = setTimeout(this.openWebApp, 500);
			openTab(megaMeetingUrl);
		}
	}
	else{
		openTab(megaMeetingUrl);
	}
}

function checkIOS(url){
	var iOSver = iOSversion();
		if (iOSver[0] >= 7) {					
			window.location.replace(url);
		    setTimeout(function(){
				$("#layover").hide();
			}, 1500);
		}else{
			openTab(url);
		}
}

function openWebApp(){
    var os = getAppOS();    
    if(os == "iOS"){
        window.location.replace("https://itunes.apple.com/us/app/kp-preventive-care-for-northern/id497468339?mt=8");
    }
    else if(os == "Android"){
        window.location.replace("https://play.google.com/store/apps/details?id=org.kp.tpmg.preventivecare&hl=en");
    }
    else{
        // we should never reach this condition
        alert("No device detected");
    }
    //window.location.replace("https://itunes.apple.com/us/app/kp-preventive-care-for-northern/id497468339?mt=8");
    $("#layover").hide();
}

function openTab(url)
{
	/*//DE13545
	if(navigator.platform == "iPhone" && navigator.appVersion.indexOf("iPhone OS 10_")>-1){
		window.open(url, '_blank');
		$("#layover").hide();
		return;
	}
	//DE13545*/
	 var a = window.document.createElement("a");
	 a.target = '_blank';
	 a.href = url;

	    // Dispatch fake click
	 var e = window.document.createEvent("MouseEvents");
	 e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	 a.dispatchEvent(e);
	 $("#layover").hide();
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
function isLoginValidationSuccess(){
	
	var validationObj =
		{
			"last_name" : [
				{
					"METHOD_NAME" : METHODNAME_IS_LASTNAME_VALIDATION,
					"PARAM_VALUE" : $("#last_name").val(),
					"PARAM_MIN_VALUE" :2,
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
					"INPUT_ELEMENT" : "mrn",
					"HIGHLIGHT_PARENT_WHEN_ERROR": false
				}
			],
            "birth_month"	:[
				{
					"METHOD_NAME" : METHODNAME_IS_BIRTHMONTH_VALIDATION,
					"PARAM_VALUE" : $("#birth_month").val(),
					"INPUT_ELEMENT" : "birth_month",
					"HIGHLIGHT_PARENT_WHEN_ERROR": true

				}
			],
			"birth_year"	:[
	            {
	            	"METHOD_NAME" : METHODNAME_IS_BIRTHYEAR_VALIDATION,
					"PARAM_VALUE" : $("#birth_year").val(),
					"INPUT_ELEMENT" : "birth_year",
					"HIGHLIGHT_PARENT_WHEN_ERROR": true
	            }
			]
		}

	var  isValid = validate(validationObj);

	if(!isValid){
		$('html, body').animate({scrollTop:-100}, "slow");
	}
	
	return isValid;
}

function validationPatientGuestLogin(){
	var validationObj =
	{
		"last_name" : [
			{
				"METHOD_NAME" : METHODNAME_IS_LASTNAME_VALIDATION,
				"PARAM_VALUE" : $("#last_name").val(),
				"PARAM_MIN_VALUE" :2,
				"INPUT_ELEMENT" : "last_name",
				"HIGHLIGHT_PARENT_WHEN_ERROR": false
			}
		]
	}

	var isValid = validate(validationObj);

	if(!isValid){
		$('html, body').animate({scrollTop:0}, "slow");
	}

	return isValid;
}

/**
 * Called on the click of the Sign in button
 * @param megaMeetingId
 * @param lastName
 * @param firstName
 */
function loginSubmit(){
    var birth_day = "";

    // Parameters sent to the server
    var currentTime = new Date();
    var n = currentTime.getTime();
    // We are setting no cache in the url as safari is caching the url and returning the same results each time.
	var postdata = 'last_name=' + $('input[name=last_name]').val() + '&mrn=' + $('input[name=mrn]').val() + '&birth_month='
								+ $('input[name=birth_month]').val() + '&birth_year=' + $('input[name=birth_year]').val() + '&birth_day=' + birth_day + '&nocache=' + n;
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
            	    $("#globalError").text("We could not find this patient.  Please try entering the information again.");
            	    $('html, body').animate({scrollTop:-100}, "slow");
                    break;

                // TODO- Do we ge this value ?
                case LOGIN_STATUS_CODE_ERROR:
                	$("#globalError").text("The code entered did not match. Please try again (you can click the code image to generate a new one if needed).");
             	   	$("#globalError").removeClass("hide-me").addClass("error");
             	   	$('html, body').animate({scrollTop:0}, "slow");
                    break;

                default:
                	$("#globalError").text("There was an error submitting your login.");
         	   		$("#globalError").removeClass("hide-me").addClass("error");
         	   		$('html, body').animate({scrollTop:0}, "slow");
                    break;
            }
        },
        error: function() {
        	$("#globalError").text("There was an error submitting your login.");
 	   		$("#globalError").removeClass("hide-me").addClass("error");
 	   		$('html, body').animate({scrollTop:0}, "slow");
        }
    });

	return false;
}

/**
 * Called on the click of the Sign in button
 * @param megaMeetingId
 * @param lastName
 * @param firstName
 */
function mobileloginSubmit(){
    var birth_day = "";

    // Parameters sent to the server
    var currentTime = new Date();
    var n = currentTime.getTime();
    // We are setting no cache in the url as safari is caching the url and returning the same results each time.
	var postdata = 'last_name=' + $('input[name=last_name]').val() + '&mrn=' + $('input[name=mrn]').val() + '&birth_month='
								+ $('input[name=birth_month]').val() + '&birth_year=' + $('input[name=birth_year]').val() + '&birth_day=' + birth_day + '&nocache=' + n;

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
                	window.location.replace("mobileAppPatientMeetings.htm?inAppBrowserFlag=true");
                    break;

               case LOGIN_STATUS_PATIENT_NOT_FOUND_ERROR:
            	   	$("#globalError").text("We could not find this patient. Please try entering the information again.");
            	   	$("#globalError").removeClass("hide-me").addClass("error");
            	   	$("html, body").animate({scrollTop:-100}, "slow");
                    break;

                // TODO- Do we ge this value ?
                case LOGIN_STATUS_CODE_ERROR:
                	$("#globalError").text("The code entered did not match. Please try again (you can click the code image to generate a new one if needed).");
             	   	$("#globalError").removeClass("hide-me").addClass("error");
             	   	$('html, body').animate({scrollTop:0}, "slow");
                    break;

                default:
                	$("#globalError").text("There was an error submitting your login.");
         	   		$("#globalError").removeClass("hide-me").addClass("error");
         	   		$('html, body').animate({scrollTop:0}, "slow");
                    break;
            }
        },
        error: function() {
        	$("#globalError").text("There was an error submitting your login.");
 	   		$("#globalError").removeClass("hide-me").addClass("error");
 	   		$('html, body').animate({scrollTop:0}, "slow");
        }
    });
	
	return false;
}

function loginSubmitPG(){
    // Prepare data from pertinent fields for POSTing
    var meetingCode = request.get('meetingCode') || $('#meetingCode').attr("value");

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
            console.log("response",returndata);
            console.log("responseStatus",returndata.status.code);
            if(returndata.status.code === '500'){
            	$("#globalError").text('No matching patient found. Please try again.');
            	$("#globalError").removeClass("hide-me").addClass("error");
                 return false;
              }
            else if (returndata.status.code === '510') {
            	window.location.replace("meetingexpiredmemberpg.htm");
                return false;
            }
            else if (returndata.status.code === '900') {
            	$("#globalError").text('Some exception occurred while processing request..');
            	$("#globalError").removeClass("hide-me").addClass("error");
                 return false;
            }
            else if (returndata.status.code === '400') {
            	$("#globalError").text('You have already joined this video visit from another device. You must first sign off from the other device before attempting to join this visit here.');
            	$("#globalError").removeClass("hide-me").addClass("error");
            	$("#layover").hide();
            	return false;
            }
            
            window.location.replace("mobilepatientguestmeetings.htm?meetingCode=" + meetingCode + "&patientLastName=" + $('input[name=last_name]').val());
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

function createGuestSession(isMobileFlow){

	var currentTime = new Date();
    var n = currentTime.getTime();
    // We are setting no cache in the url as safari is caching the url and returning the same results each time.
    var meetingCode = request.get('meetingCode');
    var patientLastName = request.get('patientLastName');
    var postdata = 'patientLastName=' + patientLastName + '&meetingCode=' + meetingCode  +  '&isMobileFlow=' + isMobileFlow + '&nocache=' + n;

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

	/* For MobileInAppBrowser */
	var lastUpdatedText = "Last updated: ";
	var lastUpdatedTime = month + "/" + day + "/" + year + " at " + hours + ":" + minutes + " " + suffix;

	$("#lastUpdatedText").text(lastUpdatedText);
	$("#lastUpdatedTime").text(lastUpdatedTime);
	/* End */
}

function iOSversion() {
	 // supports iOS 2.0 and later
	 var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
	 return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
}

function configurePexipVideoProperties(){
	console.log('========>>>> PEXIP AUTO START');
	console.log("join-conf clicked");

    var reqscript1 = document.createElement('script');
      reqscript1.src = "js/site/pexip/complex/webui.js";
      reqscript1.type = "text/javascript";
      document.getElementsByTagName("head")[0].appendChild(reqscript1);

    var reqscript2 = document.createElement('script');
      
    reqscript1.onload = function(){
		console.log("reqscript1 loaded");
		reqscript2.src = "js/site/pexip/complex/pexrtcV20.js";
		reqscript2.type = "text/javascript";
		document.getElementsByTagName("head")[0].appendChild(reqscript2);
    };

    reqscript2.onload = function(){
		console.log("reqscript2 loaded");
		startPexip();
    };
}

function startPexip() {
	setTimeout(function(){
		setVideoFeedHeight();
		setOrientationMode();
	}, 1500);
	var alias =  $("#conferenceId").val(); // "M.NCAL.MED.0.369640..1234";
	var bandwidth = $('#bandwidth').val(); // "1280";
	var source = "Join+Conference";
	var name = $("#guestName").val();
	var roomUrl = $("#guestUrl").val();
	var isMember = $("#isMember").val();
	var meetingId = $('#meetingId').val();
	var meetingCode = $("#meetingCode").val();
	var isProxyMeeting = $('#isProxyMeeting').val();
	isMobileDevice = true;
	initialise(roomUrl, alias, bandwidth, name, "", source);
	var os = getAppOS();
	if(os == "iOS"){
		$('.camera-switch-disable-ios').css('display','none');
		$('.video-controls li:first').addClass('moveLeft');
	}
	newStartTimeCheckForOneTime();
	if(isMember == 'true' || isMember == true){
//		setKPHCConferenceStatus(meetingId, "J", isProxyMeeting, decodeURIComponent($('#guestName').val()));
	}
}

function setKPHCConferenceStatus(meetingId, status, isProxyMeeting, careGiverName){
			var postParaKPHC = 'meetingId=' + meetingId + '&status=' + status + '&isProxyMeeting=' + isProxyMeeting + '&careGiverName=' + careGiverName;

	         $.ajax({
	            type: 'POST',
	            url: "setKPHCConferenceStatus.json",
	            cache: false,
			    async: true,
	            data: postParaKPHC,
	            success: function(returndata) {
	            	console.log("SetKPHCConferenceStatus: success returndata=" + returndata);
	            },
	            //error receives the XMLHTTPRequest object, a string describing the type of error and an exception object if one exists
	            error: function(theRequest, textStatus, errorThrown) {
	            	console.log("SetKPHCConferenceStatus: error");           
	            }
	        });
}

function setOrientationMode(){
	var isLandscape = window.matchMedia("(orientation:landscape)").matches;
	if(isLandscape){
		$('.logo').addClass('landscape-logo-change');
		var os = getAppOS();
	    if(os == "iOS"){
		$('.landscape-controlbar .video-controls li:first').addClass('moveDown');
	    }
		if($(".waiting-room").css("display") == "block"){
            $(".waiting-room").css('height','100%');
        }
        //if($(".mobileconferenceview").css("display") == "block"){
            $(".mobileconferenceview").addClass('full-mobile-view');
        //}
        $(".mobileselfview").addClass("mobilesv");
        /*if($("#presentation-view").css('display') == "block" ){
			$(".mobileselfview").addClass("mobilesv");
		}*/
	} else {
		$('.logo').removeClass('landscape-logo-change');
		$(".mobileconferenceview").removeClass('full-mobile-view');
	}
}

function setVideoFeedHeight(){
	var isLandscape = window.matchMedia("(orientation:landscape)").matches;
	var windowHeight = $(window).height();
	var topHeight = isLandscape ? windowHeight : top.innerHeight - 50; // 
	if(!isLandscape){
		$(".video-top").outerHeight(topHeight);
		$(".waiting-room").height(topHeight/2);
		$(".mobileconferenceview").height(topHeight/2);
		$(".mobileselfview").height(topHeight/2);
	} else {
		$(".video-top").css('height','100vh');
	}
}

var participantList = [];
var participantsData = [];

var updateParticipantList = function(participant, status){
	if(status === 'join'){
		// Join
		if(participantList.indexOf(participant.display_name) === -1){
			participantList.push(participant.display_name);
			participantsData.push(participant);
			// var isPatientLoggedIn = isPatient(participant.display_name);
			// if(participant.role == 'guest'){
			// 	sendUserJoinLeaveStatus(participant.display_name, isPatientLoggedIn, 'J');
			// }
		}
	} else {
		// Left
		for(var i=participantsData.length-1; i>=0; i--){
			var pData = participantsData[i];
			if(participant.uuid === pData.uuid) {
				if(participantList.indexOf(pData.display_name) > -1){
					// var isPatientLoggedIn = isPatient(pData.display_name);
					// if(participant.role == 'guest'){
					// 	sendUserJoinLeaveStatus(pData.display_name, isPatientLoggedIn, 'L');
					// }
					participantList.splice(participantList.indexOf(pData.display_name),1);
					participantsData.splice(i,1);
				}
			}
		}
	}
	toggleMobileWaitingRoom();
}

function hostInMeeting(element, index, array) {
  return element.role == 'chair';
}

var toggleMobileWaitingRoom = function(){
	// var isHostAvailable =  validateMobileHostAvailability();
	var isHostAvail = participantsData.some(hostInMeeting);
	if(!hostDirtyThisMeeting && isHostAvail){
        hostDirtyThisMeeting = true;
    }
	if(isHostAvail){
		$('.waiting-room').css('display','none');
		$('#videocontainer').css('display','block');
		if(hostDirtyThisMeeting){
            //Half waiting room
            $('.mobileconferenceview').removeClass('float-mobileconferenceview');
            $('#videocontainer #video').removeClass('pip-mobile-view');
            $('.wating-room-late-message').removeClass('small-late-message');
            $('.wating-room').removeClass('small-waiting-room');
            waitingTextClass = 'wating-room-late-message';
            $('.waiting-room .logo').removeClass('waiting-room-small-top-gap');
        }
	} else {
		$('.waiting-room').css('display','block');
		if(participantsData.length == 1){
			$('#videocontainer').css('display','none');
            $('.mobileconferenceview').removeClass('float-mobileconferenceview');
            $('#videocontainer #video').removeClass('pip-mobile-view');
            $('.wating-room-late-message').removeClass('small-late-message');
            $('.wating-room').removeClass('small-waiting-room');
            $('.waiting-room .logo').removeClass('waiting-room-small-top-gap');
            waitingTextClass = 'wating-room-late-message';
        } else if(participantsData.length > 1){
            if(hostDirtyThisMeeting){
                //Half waiting room
                $('.mobileconferenceview').addClass('float-mobileconferenceview');
                $('#videocontainer #video').addClass('pip-mobile-view');
                $('.wating-room-late-message').addClass('small-late-message');
                $('.wating-room').addClass('small-waiting-room');
                $('.waiting-room .logo').addClass('waiting-room-small-top-gap');
                waitingTextClass = 'wating-room-late-message small-late-message';
            } else {
                // Full waiting room
                $('.mobileconferenceview').removeClass('float-mobileconferenceview');
                $('#videocontainer #video').removeClass('pip-mobile-view');
                $('.wating-room-late-message').removeClass('small-late-message');
                $('.wating-room').removeClass('small-waiting-room');
                $('.waiting-room .logo').removeClass('waiting-room-small-top-gap');
                waitingTextClass = 'wating-room-late-message';
            }
        }
	}
}

var validateMobileHostAvailability = function(){
	var host = $("#meetingHostName").val().replace(/,/g, '').replace(/\s/g, '');
	var isAvailable = false;
	for(var i = 0; i<participantList.length; i++){
		var participant = participantList[i].replace(/,/g, '').replace(/\s/g, '');
		if(host.toLowerCase() === participant.toLowerCase()){
			isAvailable = true;
			break;
		}
	}
	return isAvailable;
}

var validatePatientAvailability = function(){
	var patient = $("#meetingPatient").val().replace(/,/g, '').replace(/\s/g, '');
	var isAvailable = false;
	for(var i = 0; i<participantList.length; i++){
		var participant = participantList[i].replace(/,/g, '').replace(/\s/g, '');
		if(patient.toLowerCase() === participant.toLowerCase()){
			isAvailable = true;
			break;
		}
	}
	return isAvailable;
}

var isHost = function(guestName){
	var isHost = false;
	var host = $("#meetingHostName").val().replace(/,/g, '').replace(/\s/g, '');
	if(host.toLowerCase() === guestName.replace(/,/g, '').replace(/\s/g, '').toLowerCase()){
		isHost = true;
	}
	return isHost;
}

var isPatient = function(guestName){
	var isPatient = false;
	var patient = $("#meetingPatient").val().replace(/,/g, '').replace(/\s/g, '');
	if(patient.toLowerCase() === guestName.replace(/,/g, '').replace(/\s/g, '').toLowerCase()){
		isPatient = true;
	}
	return isPatient;
}

var sendUserJoinLeaveStatus = function(guestName, isPatient, status){
	var userData = {
		inMeetingDisplayName : guestName,
		isPatient : isPatient,
		joinLeaveMeeting : status,
		meetingId: $('#meetingId').val()
	};
	$.ajax({
        type: "POST",
        url: 'joinLeaveMeeting.json',// VIDEO_VISITS.Path.visit.joinLeaveMeeting,
        cache: false,
        dataType: "json",
        data: userData,
        success: function(result, textStatus){
            console.log("joinLeaveMeeting :: result :: "+result);
        },
        error: function(textStatus){
            console.log("joinLeaveMeeting :: error :: "+textStatus);
        }
    });
}

function setMemberOrCareGiverStatus(){
	var isMember = $("#isMember").val();
	if(isMember == 'true' || isMember == true){
		var guestName = $("#guestName").val();
	    var patientName =$("#meetingPatient").val();
	    var isPatientLoggedIn;
	    if(guestName.toLowerCase() == patientName.toLowerCase()){
	        isPatientLoggedIn = true;
	    } else {
	        isPatientLoggedIn = false;
	    }
		sendUserJoinLeaveStatus(guestName,isPatientLoggedIn,"J");
	} else{
		if($('#isProxyMeeting').val() == 'true' || $('#isProxyMeeting').val() == true){
			sendUserJoinLeaveStatus($("#guestName").val(),false,"J");
		} else {			
			var meetingId = $('#meetingId').val();
			var meetingCode = $('#meetingCode').val();
			CaregiverJoinMeeting(meetingId, "J", meetingCode);
		}
	}
}

function CaregiverJoinMeeting(meetingId, status, meetingHash){
	var postData = 'meetingId=' + meetingId + '&status=' + status + '&meetingHash=' + meetingHash;

	$.ajax({
		type: 'POST',
		url: 'caregiverJoinMeeting.json',
		cache: false,
		async: true,
		data: postData,
		success: function(returndata) {
			console.log("CaregiverJoinMeeting: success returndata=" + returndata);
		},
	            //error receives the XMLHTTPRequest object, a string describing the type of error and an exception object if one exists
	            error: function(theRequest, textStatus, errorThrown) {
	            	console.log("CaregiverJoinMeeting: error");           
	            }
	        });
}

function toggleCamera(){
	 var videoSource, callType = 'video';
	videoSource = isRearCamera ? mobileVideoSources[0] : mobileVideoSources[1];
	isRearCamera = !isRearCamera;
	if(isRearCamera){
		document.getElementById('selfview').style.transform = "none";
	}else{
		document.getElementById('selfview').style.transform = "scaleX(-1)";
	}
	updateCall(callType, videoSource);
}
function updateCall(callType, videoSource = null, audioSource = null) {
        rtc.call_type = callType;

        if (videoSource) {
            const {exact} = videoSource;
            if (exact) {
                rtc.video_source = exact;
            }
            else {
                rtc.video_source = videoSource;
            }
        }

        if (audioSource) {
            const {exact} = audioSource;
            if (exact) {
                rtc.audio_source = exact;
            }
            else {
                rtc.audio_source = audioSource;
            }
        }

        rtc.renegotiate(callType);
    }
var newStartTimeCheck = function(){
		var isHostAvailable =  validateMobileHostAvailability();
	     if(isHostAvailable){ 
			return;
		}
		$.ajax({
			type: "GET",
			url: "providerRunningLateInfo.json",
			cache: false,
			dataType: "json",
			data: {'meetingId':$("#meetingId").val()},
			success: function(result, textStatus){
				if(result.service.status.code == 200){
					isRunningLate = result.service.runningLateEnvelope.isRunningLate;
					if(isRunningLate == true){
						var newMeetingTimeStamp = result.service.runningLateEnvelope.runLateMeetingTime;
						var newTime = convertTimestampToDate(newMeetingTimeStamp, 'time_only');
							$(".waiting-text").html("Your visit will now start at <b>"+newTime+"</b><span class='"+waitingTextClass+"' style='font-size:20px;line-height:29px;display:block;margin-top:0px;'>We're sorry, your doctor is running late.</span>");
					}else{
							$(".waiting-text").html("Waiting for your doctor to join.");
					}
				}
			},
			error: function(textStatus){
				console.log("RUNNING LATE ERROR: "+textStatus);
				$(".waiting-text").html("Waiting for your doctor to join.");
			}
		});
	};

	var newStartTimeCheckForOneTime = function(){
		var isHostAvailable =  validateMobileHostAvailability();
		$.ajax({
			type: "GET",
			url: "providerRunningLateInfo.json",
			cache: false,
			dataType: "json",
			data: {'meetingId':$("#meetingId").val()},
			success: function(result, textStatus){
				if(result != null && result.service.status.code == 200){
					isRunningLate = result.service.runningLateEnvelope.isRunningLate;
					if(isRunningLate == true){
						var newMeetingTimeStamp = result.service.runningLateEnvelope.runLateMeetingTime;
						var newTime = convertTimestampToDate(newMeetingTimeStamp, 'time_only');
						if(isHostAvailable == false){
							$(".waiting-text").html("Your visit will now start at <b>"+newTime+"</b><span class='"+waitingTextClass+"' style='font-size:20px;line-height:29px;display:block;margin-top:0px;'>We're sorry, your doctor is running late.</span>");
						}
					}else{
						if(isHostAvailable == false){
							$(".waiting-text").html("Waiting for your doctor to join.");
						}
					}
				}
			},
			error: function(textStatus){
				console.log("RUNNING LATE ERROR: "+textStatus);
				$(".waiting-text").html("Waiting for your doctor to join.");
			}
		});
	};

	newStartTimeRecursiveCall = window.setInterval(function(){
	newStartTimeCheck();
    },120000);



function logoutFromMDOApp(){
	console.log('calling from MDO app');
	// if(typeof webuiLoaded !== 'undefined'){
	// 	disconnect();
	// } 
	// else if(typeof rtc !== 'undefined'){
 //    		rtc.disconnect();
	// } else {
		var MediaStream = window.MediaStream;
		if (typeof MediaStream === 'undefined' && typeof webkitMediaStream !== 'undefined') {
			MediaStream = webkitMediaStream;
		}
		/*global MediaStream:true */
		if (typeof MediaStream !== 'undefined') {
			MediaStream.prototype.stop = function() {
				this.getTracks().forEach(function(track) {
					track.stop();
				});
			};
		}
	// }
	
}

var VideoVisit = {
	logVendorMeetingEvents: function(params){
		var userId;
		var userType;
		var logType = params[0];
		var eventName = (params[1])?params[1]:'';
		var eventDesc = (params[2])?params[2]:'';
		var isCareGiver = ($("#caregiverId").val().trim() != "" && $("#meetingCode").val().trim() != "");
		console.log("sendEventNotification :: params :: "+params);
		if(isCareGiver == true){
	       	userType = 'Caregiver';
	       	userId = $("#guestName").val().trim();
		}else{
			userId = $("#mrn").val().trim();
			//US31271
			userType = $('#isProxyMeeting').val() == 'Y'?(userId?'Patient_Proxy':'Non_Patient_Proxy'):'Patient';
			//US31271
		}
		console.log("sendEventNotification :: params :: "+params);
		var eventData = {
			'logType': logType,
			'meetingId':$("#meetingId").val(),
			'userType': userType,
			'userId': userId,
			'eventName':eventName,
			'eventDescription':eventDesc
		};

		$.ajax({
			type: "POST",
			url: "logVendorMeetingEvents.json",
			cache: false,
			dataType: "json",
			data: eventData,
			success: function(result, textStatus){
				console.log("sendEventNotification :: result :: "+result);
			},
			error: function(textStatus){
				console.log("sendEventNotification :: error :: "+textStatus);
			}
		});
	},
}
