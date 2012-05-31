<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*"%>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.command.*"%>
<%@ page import="org.kp.tpmg.videovisit.member.serviceapi.webserviceobject.xsd.*"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="javax.servlet.*"%>
<%@ page import="javax.servlet.http.*"%>

<c:if test="${WebAppContext.totalmeetings>0}">
	<div id="landing-portal-ready">
		<c:forEach var="meeting" items="${WebAppContext.meetings}">
			<div class="landing-portal-single-container">				
				<div class="landing-portal-details guest">
					<div class="hidden timestamp">${meeting.scheduledTimestamp}</div>
					<h3>Your visit is scheduled for </h3>
						<p class="guest-directive">Please enter the following information to join this visit:</p> 
						<label for="patient_last_name">Patient last Name
						  <input type="text" name="patient_last_name" id="patient_last_name"></input>
            </label>
					<a class="btn" meetingid="${meeting.meetingId}"	href="${meeting.mmMeetingName}">Click to continue</a>					
				</div>
			</div>
		</c:forEach>

<script src="js/site/global/dateExtensions_loader.js"></script>

<script type="text/javascript">
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
            //url: VIDEO_VISITS.Path.guest.joinmeeting,
            url: "/videovisit/verifyguest.json",
            success: function(returndata) {
              returndata = jQuery.parseJSON(returndata);
              console.log(returndata.result);
              if(returndata.result === 'false'){
                alert("No matching patient found. Please try again.");
                return false;
              }
              hreflocation = returndata.result;
              //window.location.replace("visit.htm?iframedata=" + encodeURIComponent(hreflocation));
              window.location.replace("/videovisit/guestready.htm?meetingCode=" + mtgCode);
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
</script>
	</div>
</c:if>
<c:if test="${WebAppContext.totalmeetings<=0}">
	<div id="landing-portal-none">
		<p>You have no video visits scheduled within the next 15 minutes.</p>
		<p>Please check back again later.</p>
	</div>
</c:if>