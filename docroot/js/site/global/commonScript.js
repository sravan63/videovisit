var VIDEO_VISITS = {
    jQueryDocument : $(document),
    jQueryWindow   : $(window)
};

$(document).ready(function() {
	$('#logoutLink').click(function(){
        $.ajax({
            type: 'POST',
            url: VIDEO_VISITS.Path.logout.logoutjson,
            complete: function(returndata) {
                window.location.replace(VIDEO_VISITS.Path.visit.logout);
            }
        });
        return false;
    });
    $('#guestLogoutLink').click(function(){
         window.location.replace(VIDEO_VISITS.Path.guestvisit.logout);          
    });
    

    $('#sidebar-main h2').click(function() {
    	$(this).toggleClass("show");
    	$(this).next().animate({ height: "toggle", opacity: "toggle"}, 500 );
		return false;
	}).next().hide();    
    
    
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
});