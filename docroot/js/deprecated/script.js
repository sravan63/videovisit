$(document).ready (function () {
	//Clinician Accordian Nav
	  $('#sidebar-main h2').click(function() {
			 $(this).toggleClass("show");
			 $(this).next().animate({ height: "toggle", opacity: "toggle"}, 500 );
			return false;
		}).next().hide();
	  
});







