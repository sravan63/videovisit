$(document).ready(function() {
    $("#joinbutton").click(function(){
        $.ajax({
            type: 'POST',
            url: VIDEO_VISITS.Path.landingready.visiturl,
            success: function(data) {
                data = "http://www.youtube.com/watch?v=ASKnLj2Pp8I";
                window.location.replace("visit.htm?iframedata=" + data);
            }
        });
        return false;
    })
});


