$(document).ready(function() {
    $("#joinbutton").click(function(){
        $.ajax({
            type: 'POST',
            url: 'visit.htm',
            success: function(data) {
                console.log('Load was performed:', data);
            }
        });
        return false;
    })
});


