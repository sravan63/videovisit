$(document).ready(function() {
    var meetingTimestamp, convertedTimestamp, meetingIdData, hreflocation;

	// Join now Click Event
    $(".btn").click(function(e){
        e.preventDefault();
        var mtgCode = gup("meetingCode");
        meetingIdData = 'meetingId=' + $(this).attr('meetingid') + 
          '&meetingCode=' + mtgCode +
          '&patientLastName=' + $.trim($("#patient_last_name").val());
        hreflocation = $(this).attr('href');
        
        $.ajax({
        	
            type: 'POST',
            data: meetingIdData,
            //url: VIDEO_VISITS.Path.guest.verifyguest,
            url: "verifyguest.json",
            success: function(returndata) {
              returndata = jQuery.parseJSON(returndata);
              if(returndata.result === '1'){
            	$("p.error").css("display", "inline").append('<label>No matching patient found. Please try again.</label><br/>');
                moveToit("p.error");              	
                return false;
              } else if (returndata.result === '2') {            	
            	$("p.error").css("display", "inline").append('<label>You cannot join the same video visit more than once.</label><br/>');
                moveToit("p.error");            	
                return false;  
              }
              hreflocation = returndata.result;
              //window.location.replace("visit.htm?iframedata=" + encodeURIComponent(hreflocation));
              window.location.replace("guestready.htm?meetingCode=" + mtgCode);
            },
            //error receives the XMLHTTPRequest object, a string describing the type of error and an exception object if one exists
            error: function(theRequest, textStatus, errorThrown) {
                window.location.replace(VIDEO_VISITS.Path.global.error);
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
