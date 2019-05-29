// global.js
// =========
// Client-side code available to all pages.


// DEPENDENCIES - GLOBAL
// $.kwcInclude( '~/js/plugins/project/jquery.kwcTooltips.js' );
//$.kwcInclude( '~/js/library/plugin/jquery.kwcHelpBox.js' );


/* Fix for undefined console object */
if (typeof console == "undefined" || typeof console.log == "undefined"){
	var console = {
		log: function(){}
	};
}


var SESSION_EXPIRED_PAGE = "";
var ERROR_PAGE = "";
var SESSION_GUEST_EXPIRED_PAGE = "";
// Number of idle milliseconds before redirecting to session timeout
var SESSION_TIMEOUT_DELAY = 1000 * 60 * 45; // 45 minutes

GUEST_IFRAME_URL = "";

function setCookie(c_name,value,exdays){
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value = escape(value) + ((exdays == null) ? "" : ";expires = " + exdate.toUTCString());
	document.cookie = c_name + "=" + c_value;
}

function getCookie(c_name){
	var c_value = document.cookie;
	var c_start = c_value.indexOf(" " + c_name + "=");
	if (c_start == -1){
		c_start = c_value.indexOf(c_name + "=");
	}
	if (c_start == -1){
		c_value = null;
	}
	else{
		c_start = c_value.indexOf("=", c_start) + 1;
		var c_end = c_value.indexOf(";", c_start);
		if (c_end == -1){
			c_end = c_value.length;
		}
		c_value = unescape(c_value.substring(c_start,c_end));
	}
	return c_value;
}


function getBrowserInfo(){
	var browserUserAgent = navigator.userAgent;

	var browserInfo = new Object();

	browserInfo.is32Bit = true;
	if (browserUserAgent.indexOf("x64") != -1){
		browserInfo.is32Bit = false;
	}

	browserInfo.is32BitOS = true;
	if (browserUserAgent.indexOf("WOW64") != -1 || browserUserAgent.indexOf("Win64") != -1 ){
		browserInfo.is32BitOS = false;
	}

    var isEdge = (navigator.appCodeName == 'Mozilla' && browserUserAgent.indexOf('Edge/') !== -1);

	browserInfo.isIE = false;
	browserInfo.isFirefox = false;
	browserInfo.isChrome = false;
	browserInfo.isSafari = false;

	var jqBrowserInfoObj = $.browser; 

	browserInfo.version = jqBrowserInfoObj.version;

	if (jqBrowserInfoObj.mozilla){
        if(browserUserAgent.indexOf('Edge/') !== -1 || browserUserAgent.indexOf("Trident") !== -1){
            browserInfo.isIE = true;
        }
		else{
            browserInfo.isFirefox = true;
        }
	}else if (jqBrowserInfoObj.msie || isEdge == true){
		browserInfo.isIE = true;
	}else if (jqBrowserInfoObj.chrome){
		browserInfo.isChrome = true;
	}else if (jqBrowserInfoObj.safari){
		browserInfo.isSafari = true;
	}

	switch(true){
		case navigator.appVersion.indexOf("Win") != -1:
			browserInfo.OSName = "Windows";
			break;
		case navigator.appVersion.indexOf("Mac") != -1:
			browserInfo.OSName = "MacOS";
			break;
		case navigator.appVersion.indexOf("X11") !=- 1:
			browserInfo.OSName = "UNIX";
			break;
		case navigator.appVersion.indexOf("Linux") != -1:
			browserInfo.OSName = "Linux";
			break;
		default:
			browserInfo.OSName = "Unknown OS";
			break;
	}

	browserInfo.gUM = Modernizr.getusermedia;

	return browserInfo;
}


/* Get URI params */
function gup(name) {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.href);
  if(results == null)
    return "";
  else
    return results[1];
}

/* Flash setup wizard */
function popUrl(url) {
  var load = window.open(url,'memberVideoWizard','width=500,height=350,status=0,toolbar=0,location=no,menubar=0,resizable=0,scrollbars=0,titlebar=no,statusbar=no'); 
  return false; 
}

$(document).ready(function() {

	// Set with Path Vars
	SESSION_EXPIRED_PAGE = VIDEO_VISITS.Path.global.expired;
	ERROR_PAGE = VIDEO_VISITS.Path.global.error;
	SESSION_GUEST_EXPIRED_PAGE = VIDEO_VISITS.Path.global.guestexpired;
	VIDEO_VISIT_PAGE = VIDEO_VISITS.Path.global.videovisitReady;
	VIDEO_VISIT_GUEST_PAGE = VIDEO_VISITS.Path.global.videovisitGuestReady;
	try {
        $("td:empty").html("&nbsp;");
    }
    catch(e) {
    }
});

var loading_Threshold;

// Hide private members
( function() {

    // Clear search boxes on focus, reload default text if nothing entered...
    


    // Called when an ajax request completes - checks the responses for any
    // error
    // messages and handles them appropriately.
    var Ajax_Complete = function( xhr ) {
        
        // Reset the session timer
        ResetTimer();
        
        // Extract the reponse
        var response = xhr.responseText;
        
        response = response.replace( /\n/g, '' );
        response = response.replace( /\r/g, '' );
        var responseMatches = response.match( '<response>(.*)</response>' );
        
        if ( responseMatches ) {
            response = responseMatches[ 1 ];
        }

        response = $.trim( response );
        
        // If the session is expired, redirect to the expired page
        if ( response.toLowerCase() == 'session expired' || response.toLowerCase() == 'expired' ) {
            GoToExpiredPage();
            return;
        }
        
        // If the system returns an error, redirect to the error page
        if ( response.toLowerCase() == 'service error returned') {
            GoToErrorPage();
            return;
        }

    //everything A-OK - do nothing
        
    }; // end Ajax_Complete()
    
    
    
    // PRIVATE METHODS
    
    // Redirects to the "session expired" page.
    var GoToExpiredPage = function() {
    	if ( location.href.indexOf('guest') != -1)
    		location.href = SESSION_GUEST_EXPIRED_PAGE;
    	else
    		location.href = SESSION_EXPIRED_PAGE;
    };
    
    // Redirects to the "session expired" page.
    var GoToErrorPage = function() {
        location.href = ERROR_PAGE;
    };
    
    
    // Restarts the session-expiration timer.
    var ResetTimer = function() {
    	
        // Cancel any existing timer
        if ( m_sessionTimeoutId ) {
            clearTimeout( m_sessionTimeoutId );
        }
        
        // Restart the timer if we're not already on the expired page
        if ( !location.href.match( SESSION_EXPIRED_PAGE ) && !location.href.match( VIDEO_VISIT_PAGE ) && !location.href.match( VIDEO_VISIT_GUEST_PAGE )) {
            m_sessionTimeoutId = setTimeout( GoToExpiredPage, SESSION_TIMEOUT_DELAY );
        }
    };
    
    
    
    // PRIVATE DATA
    
    
    // Timer ID for later cancelling
    var m_sessionTimeoutId;


    $( function (){

        // Set ajax defaults (no caching, error handling)
        $.ajaxSetup( { 
            cache: false,
            complete: Ajax_Complete
        } );
        
        // Start the session timer
        ResetTimer();


        $( '.search-box input' ).focus( function(){
            $( this ).val( '' );
        } );

        $( '.part .text' ).each( function(){
            $( this ).blur(function(){
                if($( this ).val() === '' ){
                    $( '#searchPatients' ).val( 'Name or MRN' );
                    $( '#searchProviders' ).val( 'Name' );
                }
            });
        });
        // Should probably integrate this with the above bit to make it more generic and reusable
        $( '.part .txt1' ).each( function(){
            $( this ).blur(function(){
                if($( this ).val() === '' ){
                    $( '#search' ).val( 'Enter Last Name, First name or MRN' );
                    $( '#searchProvidersInPage' ).val( 'Last name, First name' );
                }
            });
        });

		
        // Add submit/reset methods for forms
        $( '.submit_form' ).click( function() {
            $('#' + $(this).attr("form_id")).submit();
            return false;
        });

        $( '.clear_form' ).click( function() {
            $('#' + $(this).attr("form_id")).find(':input').each(function() {
                switch(this.type) {
                    case 'password':
                    case 'select-multiple':
                    case 'select-one':
                    case 'text':
                    case 'textarea':
                        $(this).val('');
                        break;
                    case 'checkbox':
                    case 'radio':
                        this.checked = false;
                }
            });

            return false;
        });

    // Assign help-box handlers
    //$( '.help-link' ).kwcHelpBox();

    });


    
    
} )(); // end hide private members


// This function updated the HTML of the notification container and then fades the message out
var userMessage = '';

function NotifyUser (message, selector) {
    var fadeoutDelay = 5000; //milliseconds
    var fadoutDuration = 5000; //milliseconds

    if (selector == '' || typeof(selector) == 'undefined') {
        selector = '.user-notification .message';
    }

    if (typeof(message) == 'undefined') {
        message = userMessage;
    }

    $(selector).html(message);
    $(selector).show();
    var to = window.setTimeout(
        function() {
            $(selector).fadeOut(fadoutDuration);
        }, fadeoutDelay);
}



function name_formatter(first, last, middle, title, format){
	if (first == '' && last == '') {
		return '';
	}

	var first_short = first.charAt(0);
	var middle_short = middle.charAt(0);

	switch(format){
		case 'standard':
			return first + ' ' + middle_short + ' ' + last + ' ' + title;
			break;
		case 'reverse':
			return last + ', ' + first + ' ' + middle_short + ' ' + title;
			break;
		case 'short':
			return first_short + ' ' + last;
			break;
		case 'shortReverse':
			return last + ', ' + first_short;
			break;
		case 'shortTitle':
			return first_short + ' ' + last + ' ' + title;
			break;
		case 'shortTitleReverse':
			return last + ', ' + first_short + ' ' + title;
			break;
		default:
			return first + ' ' + middle_short + ' ' + last + ' ' + title;
			break;
	}
}

/**
 * moveToit moves the viewport to a specified location. Good for smaller screens to jump to see important notifications.
 * @param {String} location This is a specific location in the dom - ex. moveToit('p.errors');
 * @author Stuart Tannehill
 */
function moveToit(location){
	var el = $(location).position();
	window.scrollTo(el.left, el.top);
}

Modernizr.addTest('getUserMedia', function(){
	var gUm = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
	return typeof gUm === 'function';
});

Modernizr.addTest('isMacOS', function(){
	var testMacOS = (navigator.appVersion.indexOf("Mac") != -1 ? true : false);
	return testMacOS;
});

Modernizr.addTest('isWindows', function(){
	var testWindows = (navigator.appVersion.indexOf("Win") != -1 ? true : false);
	return testWindows;
});

Modernizr.addTest('isWindowedPlugin', function(){
	var testWindowedPlugin = $('body').hasClass('ie8');
	return testWindowedPlugin;
});


function changeFromNumberToTelephoneFormat(number){
    var telephoneNumber = number.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
     return telephoneNumber;
      
}

function changeFromTelePhoneToTenDigitNumber(number){
    var tenDigitNumber = number.replace(/[- )(]/g,'');
    return tenDigitNumber;
}

function isNumberString(str){
    var onlyNumbers = /^\d+$/;
    return (onlyNumbers.test(str));
}

// changes lastname, firstname to firstname lastname.
function changeConferenceParticipantNameFormat(name){
	var formattedName = '';
	var narr = name.split(',');
	if(narr.length == 1){
	    return narr[0];
	}
	var lastname = String(narr[0]).trim();
	var firstname = narr[narr.length-1].trim();
	if(firstname.indexOf(' ') > -1){
		// lastname, firstname title.
		if(firstname.split(' ').length > 2){
			var splittedNameWithTitle = firstname.split(' ');
			var title = splittedNameWithTitle.splice(splittedNameWithTitle.length-1)
			var fname = splittedNameWithTitle.join(' ');			
			formattedName = fname+' '+lastname+', '+title;
		}else{
			var splittedNameWithTitle = firstname.split(' ');
			var fname = splittedNameWithTitle[0];
			var title = splittedNameWithTitle[splittedNameWithTitle.length-1];
			formattedName = fname+' '+lastname+', '+title;
		}		
	} else {
		formattedName = firstname+' '+lastname;
	}
	return formattedName;
}
