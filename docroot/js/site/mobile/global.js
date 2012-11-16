// Hides address bar on page load
/mobile/i.test(navigator.userAgent)
&& !window.location.hash
&& setTimeout(function () {
window.scrollTo(0,0);
}, 0);


function modalShow(){
	$("#modal").removeClass("hideMe").hide().fadeIn(200);
	return false;
}

function modalHide(){
	$("#modal").fadeOut(200);
	return false;
}

function scrollMe(){
	$('html, body').animate({scrollTop:0}, 'slow');
	return false;
}

function hidesAppAlert (){

$(".app-alert").addClass("hide-me");
$("#login-form").removeClass("hide-me");
	// return false;
}

$(document).ready(function() {
	$(".modal-window .close-button").click(modalHide);
	$(".scrollup").click(scrollMe);
	// Shows and hides scroll to top button
	$(window).scroll(function(){
		if ($(this).scrollTop() > 160) {
			$('.scrollup').fadeIn();
		} else {
			$('.scrollup').fadeOut();
		}
	});
	// scrolls to top for anchor page states on load
	scrollMe();
	
	$('#overlay, #modal').on('touchmove', function (event) {
		// locking these elements, so they can't be moved when dragging the div
			event.preventDefault();
	});
	
	$("form :input").focus(function() {
		alert("form input=");
		$(this).parent().addClass("form-focus");
		$("#modal").addClass("shifted");
		}).blur(function() {
			$("#modal").removeClass("shifted");
			$(this).parent().removeClass("form-focus");
			});




	$("#last_name").keyup(function () {
		var value = $(this).val();
		alert("value=" + value);
		var errorMessage = "name entered doesn't match our records (sample message)";
		if (value == "error" || value == "Error") {
			alert("error");
			$(this).next(".failmessage").text(errorMessage);
			$(this).next(".failmessage").removeClass("hide-me");
			$(this).parent().addClass("error");
		}
		else {
			$(this).next(".failmessage").addClass("hide-me");
			$(this).parent().removeClass("error");
		}
	});

	$("#mrn").keyup(function () {
		var value = $(this).val();
		var errorMessage = "invalid number (sample message)";
		if (value == "99") {
			$(this).next(".failmessage").text(errorMessage);
			$(this).next(".failmessage").removeClass("hide-me");
			$(this).parent().addClass("error");
		}
		else {
			$(this).next(".failmessage").addClass("hide-me");
			$(this).parent().removeClass("error");
		}
	});

	$("#birth_year").keyup(function () {
		var value = $(this).val();
		var errorMessage = "Please enter year in a 4-digit format (for example: 1952) (sample msg)";
		if (value == "99") {
			$(this).next(".failmessage").text(errorMessage);
			$(this).next(".failmessage").removeClass("hide-me");
			$(this).parent().addClass("error");
		}
		else {
			$(this).next(".failmessage").addClass("hide-me");
			$(this).parent().removeClass("error");
		}
	});
	
	
	// Click of "I have it Installed button"
	$("#btn-i-have-it").click(hidesAppAlert);
	
	
	$("#login-submit").click(function(event) {
		
		event.preventDefault();
		
		var validationSuccessful = true;
		if(validationSuccessful){
			loginSubmit();
		}


	});
	
	
	
	
});

function loginSubmit(){
	
	$("p.error").html('');
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
	var postdata = 'last_name=' + $('input[name=last_name]').val() + '&mrn=' + $('input[name=mrn]').val() + '&birth_month=' + birth_month + '&birth_year=' + $('input[name=birth_year]').val() + '&birth_day=' + birth_day ;

	$.ajax({
        type: "POST",
        url: VIDEO_VISITS.Path.login.ajaxurl,
        data: postdata, 
        success: function(returndata) {
            returndata = $.trim(returndata);
           
            var LOGIN_STATUS_SUCCESS = "1";
        	var LOGIN_STATUS_ERROR = "3";
        	var LOGIN_STATUS_CODE_ERROR = "4";
        	
            switch (returndata) {
                case LOGIN_STATUS_SUCCESS:
                	
                    window.location.replace("mobilepatientmeetings.htm");
                    break;

               case LOGIN_STATUS_ERROR:
                    $("p.error").css("display", "inline").append('<li><label>We could not find this patient.  Please try entering the information again.</label></li>');
                   
                    break;
                // TODO- Do we ge this value ?
                case LOGIN_STATUS_CODE_ERROR:
                    $("p.error").css("display", "inline").append('<li><label>The code entered did not match. Please try again (you can click the code image to generate a new one if needed).</label></li>');
                    
                    break;
                default:
                    $("p.error").css("display", "inline").append('<li><label>There was an error submitting your login. Please try again later.</label></li>');
                   
                    break;
            }

        },
        error: function() {
            //$("p.error").css("display", "inline").append('<li><label>There was an error submitting your login.</label></li>');
            
        }
    });
	
	return false;
}



