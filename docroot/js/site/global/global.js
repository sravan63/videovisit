// global.js
// =========
// Client-side code available to all pages.

// DEPENDENCIES - GLOBAL
// $.kwcInclude( '~/js/plugins/project/jquery.kwcTooltips.js' );
//$.kwcInclude( '~/js/library/plugin/jquery.kwcHelpBox.js' );


/* fx for IE6 and 7 for empty cells and borders */
if (typeof console == "undefined" || typeof console.log == "undefined") var console = {
    log: function() {}
};

var SESSION_EXPIRED_PAGE = "";
var ERROR_PAGE = "";

// Number of idle milliseconds before redirecting to session timeout
var SESSION_TIMEOUT_DELAY = 1000 * 60 * 45; // 45 minutes

$(document).ready(function() {

	// Set with Path Vars
	SESSION_EXPIRED_PAGE = VIDEO_VISITS.Path.global.expired;
	ERROR_PAGE = VIDEO_VISITS.Path.global.error;
	
	
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
        if ( !location.href.match( SESSION_EXPIRED_PAGE ) ) {
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

function ModalNotifyUser (hash) {
    // This function calls NotifyUser from a jqModal hide event
    NotifyUser ();
    hash.w.hide();
    hash.o.remove();
}


function name_formatter(first, last, middle, title, format) {
    if (first == '' && last == '') {
        return '';
    }
	
    var first_short = first.charAt(0);
    var middle_short = middle.charAt(0);
	
    switch(format) {
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
    } // End case
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