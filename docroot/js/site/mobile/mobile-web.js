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
	        userPresentInMeeting:'userPresentInMeeting.json',
	        mobileCreateSession:'createMobileMeeting.json',
	        mobileCareGiverCreateSession:'createCareGiverMobileMeeting.json'
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


/**
 * This is the main function which gets called when the document is ready and loaded in DOM
 */
$(document).ready(function() {
	var inAppBrowserFlag = $('#inAppBrowserFlag').val();

	$("#birth_date").mask("99/9999",{placeholder:"mm/yyyy"});
	
	detectDeviceCookie();
	hideAddressBar();
	setMemberContext();
	
	$(":input").on('keyup', function(){
		//alert("disabled");
		if($('#last_name').val() != "" && $('#mrn').val() != "" && ($('#birth_date').val() != "mm/yyyy" && $('#birth_date').val() != "")){
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
            $('button#mobile-login-submit').css('opacity', '0.5');
		}
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


	// for focus and blur events
	$("form :input").focus(function() {
		//$(this).parent().addClass("form-focus");

		// clear all errors
		clearAllErrors();

	}).blur(function() {
			$(this).parent().removeClass("form-focus");
	});



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
		/*event.preventDefault();
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
		return false;*/

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
	
	$(".button-launch-visit").click(function(event) {
		//var inAppBrowserFlag = $('#inAppBrowserFlag').val();
		event.preventDefault();

		var megaMeetingId = $(this).attr("megameetingid");
		var lastName = $(this).attr("lastname");
		var firstName = $(this).attr("firstname");
		//var name = firstName + " " + lastName;
		var name = lastName + ", " + firstName;
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
	        		if (inAppBrowserFlag == "true")
	            		window.location.replace("mobileAppPatientLogin.htm");

	            	else
	            		window.location.replace("logout.htm");
	        	}
	        	var isValidUserSession =  returndata.isValidUserSession;

	        	 if(returndata.success == true && isValidUserSession == true){

	        		var meetingStatus = returndata.meetingStatus;
	             	if( meetingStatus == "finished" ||  meetingStatus == "host_ended" ||  meetingStatus == "cancelled" ){
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
			            			modalShow('modal-user-present');
			            		}
			            		else{
				            			joinMeeting(meetingId);
				    	        		launchVideoVisit(megaMeetingUrl, meetingId, name);
			            			}
		            		}
		            		catch(e)
		            		{
		            			if (inAppBrowserFlag == "true")
		    	            		window.location.replace("mobileAppPatientLogin.htm");
		    	            	else
		    	            		window.location.replace("logout.htm");
		            		}
		            	});
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
	            	 var delay=1000; //1 seconds

                     setTimeout(function(){
	                     //your code to be executed after 1 seconds
	                     launchPG(megaMeetingUrl, megaMeetingId, firstName, lastName,  email);
                     }, delay);
	        	}
	            else{
	            	window.location.replace(VIDEO_VISITS_MOBILE.Path.guestlogout.logout_ui);
	            }
	        },
	        error: function() {
	        	window.location.replace(VIDEO_VISITS_MOBILE.Path.guestlogout.logout_ui);
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

	            	$("#globalError").text('No matching patient found. Please try again.');
	                 $("#globalError").removeClass("hide-me").addClass("error");
	                 return false;
	              }
	            else if (returndata.result === '2') {

	            	window.location.replace("meetingexpiredmemberpg.htm");
	                return false;

	            }
	            else if (returndata.result === '3') {

	            	$("#globalError").text('Some exception occurred while processing request..');
	                 $("#globalError").removeClass("hide-me").addClass("error");
	                 return false;
	            }
	            else if (returndata.result === '4') {

	            	$("#globalError").text('You have already joined this video visit from another device. You must first sign off from the other device before attempting to join this visit here.');
	                 $("#globalError").removeClass("hide-me").addClass("error");
	                 return false;
	            }

	            createGuestSession("true");
	            $.post(VIDEO_VISITS_MOBILE.Path.joinMeeting.mobileCareGiverCreateSession, postdata,function(data){
	            	try
	            	{
	            		data = jQuery.parseJSON(data);
	            		if ( data.errorIdentifier == 1){
	            			window.location.replace("logout.htm");
	            		}

	            		if (data.errorMessage) {
	            			window.location.replace("logout.htm");
	            		}
	            		url = data.result;
	            		launchVideoVisitForPatientGuest(url, megaMeetingId, lastName + ', ' + firstName + ', (' + email + ')');
	    				clearAllErrors();

	            	}
	            	catch(e)
	            	{
	            		window.location.replace("logout.htm");
	            	}
	            	});



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


/**
 * Called on the click of the Launch button
 * @param megaMeetingId
 * @param lastName
 * @param firstName
 */
function launchVideoVisit(megaMeetingUrl, meetingId, name){
	//var name = lastName + " " + firstName;
	var postPara = { meetingId: meetingId};
	var url;
	$.post(VIDEO_VISITS_MOBILE.Path.joinMeeting.mobileCreateSession, postPara,function(data){
	try
	{
		data = jQuery.parseJSON(data);
		if ( data.errorIdentifier == 1){
			window.location.replace("logout.htm");
		}

		if (data.errorMessage) {
			window.location.replace("logout.htm");
		}
		url = data.result;
		//alert('kppc url = ' + url);
		//alert('prefix = ' +url);
		var appOS = getAppOS();
		//if (/iP(hone|od|ad)/.test(navigator.platform)) {
		if(appOS === 'iOS'){

		    var iOSver = iOSversion();
		    //alert('iOS ver: ' + iOSver);
		    //Fix for the ios 7 issue with openTab function
			if (iOSver[0] >= 7) {
			  //alert('This is running iOS 7 or later.');
			  window.location.replace(url);
			}else{
				openTab(url);
			}
		}
		else{
			openTab(url);

		}


	}
	catch(e)
	{
		window.location.replace("logout.htm");
	}
	});
	//var megaMeetingUrl = megaMeetingUrl + "/guest/&id=" + megaMeetingId  +  "&name=" + name + "&title=Video Visits&go=1&agree=1";

	//alert("megaMeetingUrl=" + megaMeetingUrl);
	//window.location.replace(megaMeetingUrl);

}


/**
 * Called on the click of the Launch button for patient guest
 * @param megaMeetingId
 * @param lastName
 * @param firstName
 */
function launchVideoVisitForPatientGuest(megaMeetingUrl, meetingId, name){
	//var megaMeetingUrl = megaMeetingUrl + "/guest/&id=" + megaMeetingId  +  "&name=" + name + "&title=Video Visits&go=1&agree=1";
	//alert("megaMeetingUrl=" + megaMeetingUrl);
	//window.location.replace(megaMeetingUrl);
	var appOS = getAppOS();
	//alert('kppc url = ' + megaMeetingUrl);
	//if (/iP(hone|od|ad)/.test(navigator.platform)) {
	if(appOS === 'iOS'){

	    var iOSver = iOSversion();
	    //alert('iOS ver: ' + iOSver);
	    //Fix for the ios 7 issue with openTab function
		if (iOSver[0] >= 7) {
		  //alert('This is running iOS 7 or later.');
		  window.location.replace(megaMeetingUrl);
		}else{
			openTab(megaMeetingUrl);
		}
	}
	else{
		openTab(megaMeetingUrl);

	}


}


function openTab(url)
{
	 var a = window.document.createElement("a");
	 a.target = '_blank';
	 a.href = url;

	    // Dispatch fake click
	 var e = window.document.createEvent("MouseEvents");
	 e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
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
function isLoginValidationSuccess(){
	
	var birth_month = $("#birth_date").val().split("/")[0];
    var birth_year = $("#birth_date").val().split("/")[1];
	
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
					"PARAM_VALUE" : birth_month,
					"ERROR_MESSAGE" : "Please enter a valid Birth Month.",
					"ERROR_ID" : "monthOfBirthErrorId",
					"INPUT_ELEMENT" : "birth_date",
					"HIGHLIGHT_PARENT_WHEN_ERROR": true

				}
			],
			"birth_year"	:[
	            {
	            	"METHOD_NAME" : METHODNAME_IS_BIRTHYEAR_VALIDATION,
					"PARAM_VALUE" : birth_year,
					"ERROR_MESSAGE" : "Please enter a valid Birth Year.",
					"ERROR_ID" : "yearOfBirthErrorId",
					"INPUT_ELEMENT" : "birth_date",
					"HIGHLIGHT_PARENT_WHEN_ERROR": true
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

	    $('#dateOfBirthErrorId').html("Please enter a valid Date of Birth.").removeClass("hide-me");
	    $('#birth_date').css("color", "#D0021B");
	    return false;
	}
	
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
    var birth_month = $("#birth_date").val().split("/")[0];
    var birth_year = $("#birth_date").val().split("/")[1];
    var birth_day = "";

    // Parameters sent to the server
    var currentTime = new Date();
    var n = currentTime.getTime();
    // We are setting no cache in the url as safari is caching the url and returning the same results each time.
	var postdata = 'last_name=' + $('input[name=last_name]').val() + '&mrn=' + $('input[name=mrn]').val() + '&birth_month='
								+ birth_month + '&birth_year=' + birth_year + '&birth_day=' + birth_day + '&nocache=' + n;
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
            	    $("#globalError").removeClass("hide-me").addClass("error");
            	    $("#login-submit").attr('disabled', true);
                    break;

                // TODO- Do we ge this value ?
                case LOGIN_STATUS_CODE_ERROR:
                	$("#globalError").text("The code entered did not match. Please try again (you can click the code image to generate a new one if needed).");
             	   	$("#globalError").removeClass("hide-me").addClass("error");
            	    $("#login-submit").attr('disabled', true);
                    break;

                default:
                	$("#globalError").text("There was an error submitting your login.");
         	   		$("#globalError").removeClass("hide-me").addClass("error");
            	    $("#login-submit").attr('disabled', true);
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

/**
 * Called on the click of the Sign in button
 * @param megaMeetingId
 * @param lastName
 * @param firstName
 */
function mobileloginSubmit(){
    var birth_month = $("#birth_date").val().split("/")[0];
    var birth_year = $("#birth_date").val().split("/")[1];
    var birth_day = "";

    // Parameters sent to the server
    var currentTime = new Date();
    var n = currentTime.getTime();
    // We are setting no cache in the url as safari is caching the url and returning the same results each time.
	var postdata = 'last_name=' + $('input[name=last_name]').val() + '&mrn=' + $('input[name=mrn]').val() + '&birth_month='
								+ birth_month + '&birth_year=' + birth_year + '&birth_day=' + birth_day + '&nocache=' + n;

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
            	   	$("#globalError").text("We could not find this patient.  Please try entering the information again.");
            	   	$("#globalError").removeClass("hide-me").addClass("error");
            	    $("#mobile-login-submit").attr('disabled', true);
                    break;

                // TODO- Do we ge this value ?
                case LOGIN_STATUS_CODE_ERROR:
                	$("#globalError").text("The code entered did not match. Please try again (you can click the code image to generate a new one if needed).");
             	   	$("#globalError").removeClass("hide-me").addClass("error");
            	    $("#mobile-login-submit").attr('disabled', true);
                    break;

                default:
                	$("#globalError").text("There was an error submitting your login.");
         	   		$("#globalError").removeClass("hide-me").addClass("error");
            	    $("#mobile-login-submit").attr('disabled', true);
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

function loginSubmitPG(){

    // Prepare data from pertinent fields for POSTing

    var meetingCode = request.get('meetingCode') || $('#meetingCode').attr("value");;

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

            	$("#globalError").text('No matching patient found. Please try again.');
                 $("#globalError").removeClass("hide-me").addClass("error");
                 return false;
              }
            else if (returndata.result === '2') {

            	window.location.replace("meetingexpiredmemberpg.htm");
                return false;

            }
            else if (returndata.result === '3') {

            	$("#globalError").text('Some exception occurred while processing request..');
                 $("#globalError").removeClass("hide-me").addClass("error");
                 return false;
            }
            else if (returndata.result === '4') {

            	$("#globalError").text('You have already joined this video visit from another device. You must first sign off from the other device before attempting to join this visit here.');
                 $("#globalError").removeClass("hide-me").addClass("error");
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
