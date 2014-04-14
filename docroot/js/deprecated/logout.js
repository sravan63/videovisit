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
});

