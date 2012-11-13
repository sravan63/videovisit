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
	$(".modal-window .close-button, .modal-window #login-submit").click(modalHide);
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
});


$('#overlay, #modal').on('touchmove', function (event) {
// locking these elements, so they can't be moved when dragging the div
	event.preventDefault();
});


$("#btn-i-have-it").click(hidesAppAlert);

$("form :input").focus(function() {
	$(this).parent().addClass("form-focus");
	$("#modal").addClass("shifted");
	}).blur(function() {
		$("#modal").removeClass("shifted");
		$(this).parent().removeClass("form-focus");
		});