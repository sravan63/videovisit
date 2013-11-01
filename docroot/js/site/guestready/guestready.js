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
        
       var cargiverId = $(this).attr('caregiverId');
       var name = $(this).attr('userName');
       
        $.ajax({
        	
        	type: 'POST',
            data: verifyData,
            url: VIDEO_VISITS.Path.guestready.joinmeeting,
            success: function(returndata) {
            
              try
              {
            	  returndata = jQuery.parseJSON(returndata);
            	  //MEETING_FINISHED_EXCEPTION
            	  if(returndata.result === '2'){
            		  window.location.replace("guest?meetingCode=" +  gup("meetingCode"));
                      return false;
                    }
            	  //CAREGIVER JOINED FROM DIFFERENT DEVICE
            	  else if (returndata.result === '4') { 
                  	 
                  	$("p.error").css("display", "inline").html('<label>You have already joined this video visit from another device. You must first sign off from the other device before attempting to join this visit here.</label><br/>');
                      moveToit("p.error");            	
                      return false;  
                    }
            	  hreflocation = returndata.result;
            	 
            	//  hreflocation = "http://localhost:8080/vidyoplayer/player.html?guestName="+name+"&guestUrl=" +encodeURIComponent(hreflocation);
            	  hreflocation = "/vidyoplayer/player.html?guestName="+name+"&guestUrl=" +encodeURIComponent(hreflocation);
                  window.location.replace("guestvisit.htm?meetingCode=" +  gup("meetingCode") + "&iframedata=" + encodeURIComponent(hreflocation) + "&caregiverId=" + cargiverId) + + "&meetingId=" + meetingId ;
              }
              catch(e)
              {
            	  window.location.replace(VIDEO_VISITS.Path.guestglobal.expired);
              }
 
            },
            //error receives the XMLHTTPRequest object, a string describing the type of error and an exception object if one exists
            error: function(theRequest, textStatus, errorThrown) {
            	 window.location.replace(VIDEO_VISITS.Path.guestglobal.expired);
            }
        })

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



