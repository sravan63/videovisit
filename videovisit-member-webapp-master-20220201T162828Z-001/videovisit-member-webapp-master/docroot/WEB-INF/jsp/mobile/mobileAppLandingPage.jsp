<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*" %>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.command.*" %>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.*" %>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix='fn' uri='http://java.sun.com/jsp/jstl/functions' %>
<input type="hidden" id="blockSafariVersion" value="${WebAppContext.pexMobBlockSafariVer }" />
<input type="hidden" id="blockChromeVersion" value="${WebAppContext.pexMobBlockChromeVer }" />
<input type="hidden" id="blockFirefoxVersion" value="${WebAppContext.pexMobBlockFirefoxVer }" />
<input type="hidden" id="isAndroidSDK" value="${WebAppContext.isAndroidSDK()}" />

<%
	MeetingCommand.retrieveMeeting(request);
	String timezone = WebUtil.getCurrentDateTimeZone();
%>

<%@ include file="userPresentInMeetingModal.jsp" %>



<div class="page-content">
	<div class="visits patient" style="overflow:hidden;">
		<!--<h1>Video Visits You Can Join Now</h1>	-->
		<h1> Your Video Visits for Today</h1>
		<div class="special-message-banner-container" id="blockerMessage">
			<div class="special-message-header">
				<span class="warning-icon"></span>
				<p class="warning-text">Video Visits does not support your browser.</p>
			</div>
			<div class="special-message-content">
				<div class="special-message-container">
					<div class="mdo-logo"></div>
					<div class="special-message">
						<p><b id="browser-block-message">Join on your mobile device using the My Doctor Online app, or use Chrome.</b></p>
					</div>
				</div>
				<div class="app-store-container">
					<span class="ios-appstore"><a class="icon-link" href="https://itunes.apple.com/us/app/my-doctor-online-ncal-only/id497468339?mt=8" target="_blank"></a></span>
					<span class="android-playstore"><a href="https://play.google.com/store/apps/details?id=org.kp.tpmg.preventivecare&hl=en_US" class="icon-link" target="_blank"></a></span>
				</div>
			</div>
		</div>
		<c:choose>
			<c:when test="${WebAppContext.totalmeetings>0}">
				<c:forEach var="meeting" items="${WebAppContext.myMeetings}">
			      <div class="landing-portal-single-container">
			    <!--US18235 Running Late: Patient My Meetings Notification UI start>-->
                     <c:if test="${meeting.isRunningLate == true}">
                     <!-- Kranti US19234 start -->
			           <div class="running-late-indicator" style="height:auto;"><span  style="font-size:16px;">We're sorry, your doctor is running late.<br/> New start time is </span><b style="font-size:20px;"class="running-late-timestamp-${meeting.meetingId}">${meeting.runLateMeetingTime}</b>.</div>
			         <!-- Kranti US19234 end -->
			            <script type="text/javascript">
			              var cls = ".running-late-timestamp-"+${meeting.meetingId};
			              var meetingTimestamp = $(cls).text();
			              var convertedTimestamp = convertTimestampToDate(meetingTimestamp, 'time_only');
			              $(cls).text(convertedTimestamp);
			            </script>
			          </c:if>
                    <!--US18235 Running Late: Patient My Meetings Notification UI end-->
			          <div class="meeting-details-container" style="font-size:14px;">
			            <div class="top" style="margin-top:30px;">
			              <div class="time-display">
			                <span class="hide-me timestamp_${meeting.meetingId}">${meeting.meetingTime} </span>
			                <span class="time_${meeting.meetingId}" style="font-size:24px; padding-bottom:3px;"></span>
			                <script type="text/javascript">
							// convert time stamp to time
								meetingTimestamp = $('.timestamp_' + ${meeting.meetingId}).text();
								convertedTimestamp = convertTimestampToDate(meetingTimestamp, 'time_only').toUpperCase();
								$('.time_' + ${meeting.meetingId}).append(convertedTimestamp);
							</script>
			              </div>
			              <span style="font-size:16px;">${meeting.member.firstName} ${meeting.member.lastName}</span>
			              <div class="accord-contents" style="display:block;margin-top:40px;">
			                  <c:if test="${meeting.participant != null && fn:length(meeting.participant) > 0 || meeting.caregiver != null && fn:length(meeting.caregiver) > 0 || meeting.sipParticipants != null && fn:length(meeting.sipParticipants) > 0}">
			                    <h2 class="label" style="float:none;font-size:16px;">Additional Participants</h2>
			                  </c:if>
			                  <c:if test="${meeting.participant != null && fn:length(meeting.participant) > 0}">
			                    <div class="names-container-member" style="margin:0px;">
			                      <span class="names participants" style="margin-left:0;font-size:16px;">
			                        <c:forEach var="p" items="${meeting.participant}">
			                          <span  style="font-size:16px;">${p.firstName} ${p.lastName}<c:if test="${not empty p.title}">, ${p.title}</c:if></span>
			                        </c:forEach>
			                      </span>
			                    </div>
			                  </c:if>
			                  <div class="names-container-member" style="margin:0px;">
			                  	<c:choose>
			                    <c:when test="${meeting.caregiver != null && fn:length(meeting.caregiver) > 0 && meeting.vendor!='pexip'} ">
			                      <span class="names patient-guests" style="margin-left:0;font-size:16px;">
			                      	<c:set var="phoneNumsCount" value="0" scope="page" />
			                        <c:forEach var="p" items="${meeting.caregiver}">
			                        	<c:if test="${p.lastName == 'audio_participant'}">
			                        		<c:set var="phoneNumsCount" value="${phoneNumsCount + 1}" scope="page"/>
			                        		<span class="guest-is-ap" style="font-size:16px;" firstnameattr="${p.firstName}">Phone ${phoneNumsCount}</span>
			                        	</c:if>
			                        	<c:if test="${p.lastName != 'audio_participant'}">
			                        		<span class="guest-is-not-ap" style="font-size:16px;">${p.firstName} ${p.lastName}</span>
			                        	</c:if>
			                        </c:forEach>
			                      </span>
			                    </c:when>
			                    <c:when test="${meeting.vendor == 'pexip'}">
			                    <span class="names patient-guests" style="margin-left:0;font-size:16px;">
			                    <c:set var="phoneNumsCount" value="0" scope="page" />
			                    <c:if test="${meeting.caregiver != null && fn:length(meeting.caregiver) > 0}">
			                    <c:forEach var="p" items="${meeting.caregiver}">
 								<span class="guest-is-not-ap" style="font-size:16px;">${p.firstName} ${p.lastName}</span>
 								</c:forEach>
			                   </c:if>
			                   <c:if test="${meeting.sipParticipants != null && fn:length(meeting.sipParticipants) > 0}">
			                   <c:forEach var="p" items="${meeting.sipParticipants}">	
			                   <c:set var="phoneNumsCount" value="${phoneNumsCount + 1}" scope="page"/>
			                    <span class="guest-is-ap-pexip" style="font-size:16px;" firstnameattr="${p.destination}">${p.displayName}</span>
			                    </c:forEach>
			                   </c:if>
			                    </span>
			                    </c:when>
			                </c:choose>
			                  </div>
			              </div>
			            </div>
			            <div class="middle">
				            <div class="image-holder">
				            	<img class="circle-image" src=${meeting.host.imageUrl} alt="" />
				            </div>
				            <div class="info-holder" style="float:left;margin-top:10px;">
				            	<span class="name-and-details camel-case">${meeting.host.firstName} ${meeting.host.lastName}<c:if test="${not empty meeting.host.title}">, ${meeting.host.title}</c:if></span><br>
				              <span class="department-details camel-case">${meeting.host.departmentName}</span>
				            </div>
			            </div>
			            <div class="bottom">
			              	<div class="launch-button-handler only-tablets" style="float: none; box-shadow: none;padding:0px; min-height: 60px;text-align:right;">
                          		<button id="joinNowId" class="button-launch-visit btn joinNowButton" megaMeetingUrl="${WebAppContext.megaMeetingMobileURL}" megameetingid="${meeting.meetingVendorId}" lastname="${meeting.member.lastName}" firstname="${meeting.member.firstName}" vendor="${meeting.vendor}" meetingId="${meeting.meetingId}">Join your visit</button>
	                        </div>
	                        <div class="launch-button-handler only-handsets">
	                        	<button id="joinNowId" class="button-launch-visit btn joinNowButton" megaMeetingUrl="${WebAppContext.megaMeetingMobileURL}" megameetingid="${meeting.meetingVendorId}" lastname="${meeting.member.lastName}" firstname="${meeting.member.firstName}" vendor="${meeting.vendor}" meetingId="${meeting.meetingId}">Join your visit</button>
	                        </div>
	                        <p class="patient-msg">You may be joining before your clinician. Please be patient.</p>
			            </div>
			          </div>
			      </div>
			  </c:forEach>
				
			</c:when>
			<c:otherwise>
			<!--  If no meetings are present -->
				<div class="alert alert-hero alert-no-visits" style="background-color:#FFFFFF; border-top:1px solid #D4D4D5; box-shadow:none;">
					<div class="alert-hero-message">
						<div class="image" style="background:url('images/mobile/video-icon-gray.png') no-repeat center; margin:-10px 15px 0 0; background-size:contain;"></div>
						<p style=""><strong>You have no meetings in the next 15 minutes.</strong></p>
					</div>
				</div>
				
				<!-- Refresh Page button and Time stamp - Start -->
				<div style="min-height:45px; padding-left:32px;">
					<div style="float:left; padding-top:5px;">
						<p id="lastUpdatedText"></p>
						<p id="lastUpdatedTime">
							<script type="text/javascript">
								refreshTimestamp();
							</script>
						</p>
					</div>
					<!-- US16197 hiding refresh button in KPPC Mobile app-->
					<!-- <div class="refresh_button" style="float:right;">
						<button style="width:136px; height:45px; color:#FFFFFF; background-color:#0061A9; padding:10px 5px; border-radius:4px; font-size:16px;"> Refresh Page </button>
					</div> -->
					<!-- US16197 hiding refresh button in KPPC Mobile app-->
				</div>
				<!-- Refresh Page button and Time stamp - END -->
			</c:otherwise>

		</c:choose>
	</div>

	<div style="font-weight:bold; text-align:left; margin-top:30px;">
		<p>Please make sure you have a strong Wi-Fi or 4G connection</p>
	</div>

	<!-- Fake Footer - to adjust the length of the Background image -->
	<div style="visibility:none; margin:100px 0;">
		<br/>
		<br/>
		<br/>
		<br/>
	</div>
	<!-- Fake Footer - to adjust the length of the Background image -->

</div>
<script>
	 $("#blockerMessage").css("display","none");
	 $('.landing-portal-single-container:first').css("border-top","1px solid #D4D4D5");
	checkAndBlockMeetings();
	$('.guest-is-ap').each(function(e){
		if($(this).children('a').length>0){
			//ios will add anchor tag automatically based on number
			var actualNum = $(this).find('a').html();
			var tempNum = $(this).find('a').html().trim().split('').reverse().join('').substr(0,10).split('').reverse().join('')+'';
			tempNum = tempNum.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
			$(this).html('<a href="tel:'+actualNum+'">'+tempNum+'</a>');
		}else{
			//desktop will not add any anchor tag inside span
			var tempNum = $(this).html().trim().split('').reverse().join('').substr(0,10).split('').reverse().join('')+'';
			tempNum = tempNum.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
			$(this).html(tempNum);	
		}		
	});



function checkAndBlockMeetings(){
    var showBlockMessage = false;
    $('.joinNowButton').each(function(){
        var vendor = $(this).attr('vendor');
        var allow = allowToJoin(vendor);
        if(allow == false){
            showBlockMessage = true;
            $(this).removeClass('joinNowButton button-launch-visit').addClass('not-available');
        }
    });
    if(showBlockMessage){
        $("#blockerMessage").css("display","block");
    }
}

function allowToJoin(vendor){
	var browserUserAgent = navigator.userAgent;
	var jqBrowserInfoObj = $.browser; 
	if (jqBrowserInfoObj.mozilla){
        if(browserUserAgent.indexOf('Edge/') !== -1 || browserUserAgent.indexOf("Trident") !== -1){
            var isIE = true;
        }
		else{
            var isFirefox = true;
        }
    }
    var allow = true;
    var appOS = getAppOS();
    if(vendor === 'pexip' && appOS=='Android'){
            if (jqBrowserInfoObj.chrome){
        	var blockChromeVersion = $("#blockChromeVersion").val()?Number($("#blockChromeVersion").val()):61;
	        var chrome_ver = Number(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
	        if(chrome_ver < blockChromeVersion){
	        	allow= false;
	        }
        }
        else if(isFirefox){
        	var blockFirefoxVersion = $("#blockFirefoxVersion").val()?Number($("#blockFirefoxVersion").val()):67;
        	var firefox_ver = Number(window.navigator.userAgent.match(/Firefox\/(\d+)\./)[1], 10);
        	if(firefox_ver < blockFirefoxVersion){
        		allow = false;
        	}
        }
    }
    return allow;
}

function getAppOS(){
    p = navigator.platform;
    if( p === 'iPad' || p === 'iPhone' || p === 'iPod' || p === 'MacIntel' || p==='iPhone Simulator' || p==='iPad Simulator'){
        return "iOS";
    }
    if(navigator.userAgent.match(/Android/i)){
    	return "Android";
    }
    return "desktop";
}
</script>
