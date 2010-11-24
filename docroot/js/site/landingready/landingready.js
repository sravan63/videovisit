$(document).ready(function() {
    var meetingTimestamp,convertedTimestamp,meetingIdData,hreflocation;

    $("#joinbutton").click(function(){
        meetingIdData = 'meetingId=' + $(this).attr('meetingid');
        hreflocation = $(this).attr('href');
        $.ajax({
            type: 'POST',
            data: meetingIdData,
            url: VIDEO_VISITS.Path.landingready.joinmeeting,
            //TODO - Change this from "complete" to "success"
            complete: function(returndata) {
                window.location.replace("visit.htm?iframedata=" + hreflocation);
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


