$(document).ready(function() {

    // To access the GET variable
    function $_GET(q,s) {
        s = (s) ? s : window.location.search;
        var re = new RegExp('&'+q+'=([^&]*)','i');
        return (s=s.replace(/^\?/,'&').match(re)) ? s=s[1] : s='';
    }

    // Grab the GET variable
    var iframedata = $_GET('iframedata');

    // Load it into the iframe's source attribute'
    $("iframe").attr('src', iframedata);

    // Setup the quit meeting modal and make it draggable
    $( '#quitMeetingModal' ).jqm().jqDrag('.jqDrag');
});

