$(document).ready(function() {
    var meetingTimestamp,convertedTimestamp,meetingIdData,hreflocation;

	// Join now Click Event
    $(".btn").click(function(e){
        e.preventDefault();
        meetingIdData = 'meetingCode=' + gup("meetingCode"); //$(this).attr('meetingCode');
        hreflocation = $(this).attr('href');
        
        $.ajax({
            type: 'POST',
            data: meetingIdData,
            url: VIDEO_VISITS.Path.guestready.joinmeeting,
            success: function(returndata) {
                returndata = jQuery.parseJSON(returndata);
                
                hreflocation = returndata.result;
                window.location.replace("guestvisit.htm?" +  gup("meetingCode") + "&iframedata=" + encodeURIComponent(hreflocation));
            },
            //error receives the XMLHTTPRequest object, a string describing the type of error and an exception object if one exists
            error: function(theRequest, textStatus, errorThrown) {
                window.location.replace(VIDEO_VISITS.Path.guestglobal.error);
            }
        });
        return false;
    })

    //Get the meeting timestamp, convert it and display it. Grabs the text contents of the element with the timestamp class,
    //converts it to the correct timestamp and then appends it to the next h3 in the code
    $('.timestamp').each(function(){
        meetingTimestamp = $(this).text();
        convertedTimestamp = convertTimestampToDate(meetingTimestamp, 'time_only');

        $(this).next('h3').append(convertedTimestamp);
    })
});


