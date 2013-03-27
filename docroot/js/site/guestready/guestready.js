$(document).ready(function() {
	
	
    var meetingTimestamp,convertedTimestamp,meetingIdData,hreflocation,meetingId,patientLastName, verifyData;

	// Join now Click Event
    $(".btn").click(function(e){
        e.preventDefault();
       
        
        meetingIdData = 'meetingCode=' + gup("meetingCode"); //$(this).attr('meetingCode');
        meetingId = gup("meetingId");
        patientLastName = gup("patientLastName");
        verifyData= 'meetingId=' + meetingId+ 
          '&meetingCode=' + gup("meetingCode")+
          '&patientLastName=' + patientLastName ;
        
       
       //hreflocation = $(this).attr('href');
       
        $.ajax({
        	
        	type: 'POST',
            data: verifyData,
            url: VIDEO_VISITS.Path.guestready.joinmeeting,
            success: function(returndata) {
              returndata = jQuery.parseJSON(returndata);
              
              if(returndata.result === '1'){
            	 
            	$("p.error").css("display", "inline").html('<label>The video visit you are trying to join is no longer available. The clinician has ended this visit.</label><br/>');
                moveToit("p.error");
                return false;
              } else if (returndata.result === '2') { 
            	 
            	$("p.error").css("display", "inline").html('<label>You have already joined this video visit from another device. You must first sign off from the other device before attempting to join this visit here.</label><br/>');
                moveToit("p.error");            	
                return false;  
              }
              hreflocation = returndata.result;
              window.location.replace("guestvisit.htm?meetingCode=" +  gup("meetingCode") + "&iframedata=" + encodeURIComponent(hreflocation));
              //hreflocation = returndata.result;
              //window.location.replace("visit.htm?iframedata=" + encodeURIComponent(hreflocation));
              //window.location.replace("guestready.htm?meetingCode=" + mtgCode+ "&patientLastName=" + $.trim($("#patient_last_name").val() + "&meetingId=" + $(this).attr('meetingid'));
              
              
            },
            //error receives the XMLHTTPRequest object, a string describing the type of error and an exception object if one exists
            error: function(theRequest, textStatus, errorThrown) {
                window.location.replace(VIDEO_VISITS.Path.guestglobal.error);
            }
        })

           /* type: 'POST',
            data: meetingIdData,
            url: VIDEO_VISITS.Path.guestready.joinmeeting,
            success: function(returndata) {
                returndata = jQuery.parseJSON(returndata);
                
                hreflocation = returndata.result;
                window.location.replace("guestvisit.htm?meetingCode=" +  gup("meetingCode") + "&iframedata=" + encodeURIComponent(hreflocation));
            },
            //error receives the XMLHTTPRequest object, a string describing the type of error and an exception object if one exists
            error: function(theRequest, textStatus, errorThrown) {
                window.location.replace(VIDEO_VISITS.Path.guestglobal.error);
            }*/
        });

    //Get the meeting timestamp, convert it and display it. Grabs the text contents of the element with the timestamp class,
    //converts it to the correct timestamp and then appends it to the next h3 in the code
    $('.timestamp').each(function(){
        meetingTimestamp = $(this).text();
        var tz = $("#tz").val();
        convertedTimestamp = convertTimestampToDate(meetingTimestamp, 'time_only')  + " " + tz;

        $(this).next('h3').append(convertedTimestamp);
    })
});



