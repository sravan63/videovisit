var isRunningLate = true;
var runningLateRecursiveCall;
var newStartTimeRecursiveCall;
var meetingHostName = "";
var meetingPatientName = "";
var sidePaneMeetingDetails = {sortedParticipantsList: []};

$(document).ready(function() {
	$.ajax({
		type: "POST",
		url: VIDEO_VISITS.Path.visit.meetingDetails + '?meetingId=' + $('#meetingId').val(),
		cache: false,
		dataType: "json",
		data: {},
		success: function(result){
			console.log('=====================',result);
			if(!result || !result.host){
				meetingHostName = '';
				return;
			}else if(!result.host.lastName && !result.host.firstName){
				meetingHostName = '';
			}else if(result.host.lastName && result.host.firstName){
				meetingHostName = result.host.firstName + ' ' + result.host.lastName;
			}else if(!result.host.lastName){
				meetingHostName = result.host.firstName;
			}else if(!result.host.firstName){
				meetingHostName = result.host.lastName;
			}
			meetingHostName = meetingHostName.trim();
			sidePaneMeetingDetails = result;
			updateSideBarWithDetails(result);
		},
		error: function(result){
			console.log(result);
		},
		complete: function(returndata) {
        }
	});
	//$('html').css('overflow-y', 'hidden');
	var windowHeight = $(window).height();
	var windowWidth = $(window).width();
	
	var vvHeaderHeight = $("#vvHeader").outerHeight();
	var videoSidebarWidth = $("#video-sidebar").outerWidth() > 270 ? $("#video-sidebar").outerWidth()+1 : 270;
	var calculatedHeight = windowHeight - vvHeaderHeight;
	var calculatedWidth = windowWidth - videoSidebarWidth;
	
	$("#inCallPluginAndControlsWrap").height(calculatedHeight);
	$("#video-sidebar").height(calculatedHeight);
	$(".video-sidebar-content").height(calculatedHeight - 33);
	/*$("#waitingRoom").css("background-image","url('vidyoplayer/img/waiting_rm_bkgd.png')");*/

	var btnContainerWidth = $("#btnContainer").outerWidth();
	var calculatedWidthPluginContainer = calculatedWidth - btnContainerWidth;
	
	/* Mandar [DE7189] - Code changes for right side space */
	var calWidth = windowWidth - (260 + btnContainerWidth);
	$("#pluginContainer").width(calWidth);
	/* Mandar [DE7189] END */
	
	$("#pluginContainer").height(calculatedHeight);
	$("#btnContainer").height(calculatedHeight);
	
	$("#infoWrapper").height(calculatedHeight);
	$("#infoWrapper").width(calculatedWidthPluginContainer);
	
	$("#setupContents").height(calculatedHeight);
	$("#setupContents").width(calculatedWidthPluginContainer);

	// Returns the code on pre call load to avoid the errors.
	if($("#pluginContainer").length == 0){
		return;
	}

	/*var host = ($("#meetingHost").val().indexOf('&nbsp;') > -1)?$("#meetingHost").val().replace('&nbsp;',''):$("#meetingHost").val();
	var splittedHostName = host.trim().split(" ");
	for(var c=0;c<splittedHostName.length;c++){
		var char = splittedHostName[c].trim();
		if(char !== ""){
			meetingHostName += char+" ";
		}
	}
	meetingHostName = meetingHostName.trim();*/

	var patient = ($("#meetingPatient").val().indexOf('&nbsp;') > -1)?$("#meetingPatient").val().replace('&nbsp;',''):$("#meetingPatient").val();
	var splittedPatientName = patient.trim().split(" ");
	for(var c=0;c<splittedPatientName.length;c++){
		var char = splittedPatientName[c].trim();
		if(char !== ""){
			meetingPatientName += char+" ";
		}
	}
	meetingPatientName = meetingPatientName.trim();
	
	//make ajax call to KP Keep alive url
    var keepAliveUrl = $("#kpKeepAliveUrl").val();
    if(keepAliveUrl != null && keepAliveUrl != "" && keepAliveUrl.length > 0 && keepAliveUrl != "undefined")
    {
    	try
    	{
	    	$.ajax({
	    	    url: keepAliveUrl,
	    	    type: 'GET',
	    	    dataType: 'jsonp',
	    	    cache: false,
	    	    async: true,
	    	    crossDomain:true,
	    	    success: function(returndata){    	    	
	    	    },
	            error: function() {            	
	            }
	    	});
    	}
    	catch(e)
		{
			
		}
    }

    // US14832 - Displaying dynamic message in Waiting Room based on reccurent service call [START]
    // This service call will trigger for every 2 minutes
  //Start DE9501: VV_Provider_Member_Vidyo Page_"New Start" time is updating even if the Host joins the meeting
  //Start US18295: Running Late: Add time in player: add time in player
	
	var newStartTimeCheck = function(){
		if(VIDEO_VISITS.Path.IS_HOST_AVAILABLE == true){
			return;
		}
		$.ajax({
			type: "GET",
			url: VIDEO_VISITS.Path.visit.providerRunningLateInfo,
			cache: false,
			dataType: "json",
			data: {'meetingId':$("#meetingId").val()},
			success: function(result, textStatus){
				if(result.service.status.code == 200){
					isRunningLate = result.service.runningLateEnvelope.isRunningLate;
					if(isRunningLate == true){
						var newMeetingTimeStamp = result.service.runningLateEnvelope.runLateMeetingTime;
						var newTime = convertTimestampToDate(newMeetingTimeStamp, 'time_only');
							$('#displayMeetingNewStartTime').html('New Start '+newTime);
							$(".waitingroom-text").html("Your visit will now start at <b>"+newTime+"</b><span style='font-size:20px;line-height:29px;display:block;margin-top:24px;'>We're sorry, your doctor is running late.</span>");
					}else{
						$('#displayMeetingNewStartTime').html('');
							$(".waitingroom-text").html("Your visit will start once your doctor joins.");
					}
				}
			},
			error: function(textStatus){
				console.log("RUNNING LATE ERROR: "+textStatus);
				$('#displayMeetingNewStartTime').html('');
				$(".waitingroom-text").html("Your visit will start once your doctor joins.");
			}
		});
	};
	var newStartTimeCheckForOneTime = function(){
		$.ajax({
			type: "GET",
			url: VIDEO_VISITS.Path.visit.providerRunningLateInfo,
			cache: false,
			dataType: "json",
			data: {'meetingId':$("#meetingId").val()},
			success: function(result, textStatus){
				if(result != null && result.service.status.code == 200){
					isRunningLate = result.service.runningLateEnvelope.isRunningLate;
					if(isRunningLate == true){
						var newMeetingTimeStamp = result.service.runningLateEnvelope.runLateMeetingTime;
						var newTime = convertTimestampToDate(newMeetingTimeStamp, 'time_only');
						$('#displayMeetingNewStartTime').html('New Start '+newTime);
						if(VIDEO_VISITS.Path.IS_HOST_AVAILABLE == false){
							$(".waitingroom-text").html("Your visit will now start at <b>"+newTime+"</b><span style='font-size:20px;line-height:29px;display:block;margin-top:24px;'>We're sorry, your doctor is running late.</span>");
						}
					}else{
						$('#displayMeetingNewStartTime').html('');
						if(VIDEO_VISITS.Path.IS_HOST_AVAILABLE == false){
							$(".waitingroom-text").html("Your visit will start once your doctor joins.");
						}
					}
				}
			},
			error: function(textStatus){
				console.log("RUNNING LATE ERROR: "+textStatus);
				$('#displayMeetingNewStartTime').html('');
				$(".waitingroom-text").html("Your visit will start once your doctor joins.");
			}
		});
	};
	
	newStartTimeCheckForOneTime();
	newStartTimeRecursiveCall = window.setInterval(function(){
		newStartTimeCheck();
    },120000);
	
	//End DE9501: VV_Provider_Member_Vidyo Page_"New Start" time is updating even if the Host joins the meeting
	//End US18295: Running Late: Add time in player: add time in player


    // US14832 - Displaying dynamic message in Waiting Room based on recurrent service call [END]

	/*$('#meetingDisconnected').click(function() {
		closeDialog('dialog-block-meeting-disconnected');
		if ($('#pluginContainer').css('visibility') == 'hidden'){
			$('#pluginContainer').css({"visibility":"visible"});
		}
    });*/

    //DE9451 - Splash screen scroll issue fix
	$('html').addClass("no-scroll");
		
	setTimeout(function(){
		setSidePanParticipantsListHeight();
	}, 2000);
	
	VideoVisit.updatePatientGuestNameList();
	
});

var getPatientGuestNameList = function(){
	var pgNames = [];
	var patientGuestsLength = $('#meetingPatientGuest').children('p').length;
	for(var i=0; i<patientGuestsLength;i++){
		var lName = $($('#meetingPatientGuest').children('p')[i]).find(".lName").text().trim();
		var fName = $($('#meetingPatientGuest').children('p')[i]).find(".fName").text().trim();
		var email = $($('#meetingPatientGuest').children('p')[i]).find(".email").text().trim();
		//var isTelephony = isNumberString(changeFromTelePhoneToTenDigitNumber(fName));
		//isTelephony = false;//US35148: Telephony: Deactivate for Release 8.6
		var isTelephony = $($('#meetingPatientGuest').children('p')[i]).find(".lName").attr('lastnameattr') == "audio_participant";
		if(isTelephony){
			//fName = changeFromTelePhoneToTenDigitNumber(fName);
			let firstnameattr = $($('#meetingPatientGuest').children('p')[i]).find(".fName").attr('firstnameattr');
			fName = firstnameattr.slice(-10);
		}
		pgNames.push({fname:fName, lname:lName, email:email, index:i, isAvailable: false, isTelePhony: isTelephony});
	}
	return pgNames;
}

var getAdditionalCliniciansNameList = function(){
	var additionalCliniciansNames = [];
	var additionalCliniciansLength = $('#meetingParticipant').children('p').length;
	for(var i=0; i<additionalCliniciansLength;i++){
		var clinicianName = $($('#meetingParticipant').children('p')[i]).find("span").text().trim();
		additionalCliniciansNames.push({name:clinicianName, index:i, isAvailable: false});
	}
	return additionalCliniciansNames;
}

var VideoVisit =
{
	updatePatientGuestNameList: function(){
		var pgNames = [];
		var patientGuestsLength = $('#meetingPatientGuest').children('p').length;
		for(var i=0; i<patientGuestsLength;i++){
			var lName = $($('#meetingPatientGuest').children('p')[i]).find(".lName").text().trim();
			var fName = $($('#meetingPatientGuest').children('p')[i]).find(".fName").text().trim();
			var email = $($('#meetingPatientGuest').children('p')[i]).find(".email").text().trim();
			var activeUsrStateDisplayVal = $($('#meetingPatientGuest').children('p')[i]).find(".active-user-state").css('display');
			//var isTelephony = isNumberString(fName) === true;
			var isTelephony = $($('#meetingPatientGuest').children('p')[i]).find(".lName").attr('lastnameattr') == 'audio_participant';
			//isTelephony = false;//US35148: Telephony: Deactivate for Release 8.6
			if(isTelephony){
				//var tele = fName.trim().split('').reverse().join('').substr(0,10).split('').reverse().join('');
	            //var telePhoneNumber = changeFromNumberToTelephoneFormat(tele);
				//var newFName = telePhoneNumber;
				//var newLName = "";
				//$($('#meetingPatientGuest').children('p')[i]).find(".lName").text(newLName);
				//$($('#meetingPatientGuest').children('p')[i]).find(".fName").text(newFName);
				let lastnameattr = $($('#meetingPatientGuest').children('p')[i]).find(".lName").attr('lastnameattr');
				let firstnameattr = $($('#meetingPatientGuest').children('p')[i]).find(".fName").attr('firstnameattr');
				lastnameattr = lastnameattr?lastnameattr:'';
				firstnameattr = firstnameattr?firstnameattr:'';
				var str = '<span class="pg-with-ellipsis telephony-pg"><span class="lName" lastnameattr="'+lastnameattr+'"></span> <span class="fName" firstnameattr="'+firstnameattr+'">'+fName+'</span><span class="email" style="display:none;">'+email+'</span></span><i class="active-user-state"></i>'
				$($('#meetingPatientGuest').children('p')[i]).html(str);
			}else{
				var comStr = ', ';
				if(!lName || !fName){
					comStr = '';
				}				
				var testTxt = '<span class="pg-with-ellipsis pguest"><span class="lName">'+lName+'</span>'+comStr+'<span class="fName">'+fName+'</span><span class="email" style="display:none;">'+email+'</span></span><i class="active-user-state" style="display: '+activeUsrStateDisplayVal+';"></i>';
				$($('#meetingPatientGuest').children('p')[i]).html(testTxt);
			}
		}
		$('#meetingPatientGuest').css('display','block');
	},
	setShowPrecallTestingFlag: function(flag){
		var val = (flag == true)?"true":"flag";
		$.ajax({
			type: "POST",
			url: VIDEO_VISITS.Path.visit.setPeripheralsFlag,
			cache: false,
			dataType: "json",
			data: {"showPeripheralsPage":val},
			success: function(result, textStatus){
				console.log(result);
			},
			error: function(textStatus){
				
			}
		});
	},
	addNewPartcipantsToSideBar: function(participant, isPatientGuest){
		var data = {};
		var userType = '';
		if(isPatientGuest){
			var isTelePhony = (participant.indexOf('@') === -1);
			//isTelePhony = false;//US35148: Telephony: Deactivate for Release 8.6
			if (isTelePhony) {
				var tele = participant.trim().split('').reverse().join('').substr(0,10).split('').reverse().join('');
				var telePhoneNumber = changeFromNumberToTelephoneFormat(tele);
				userType = 'telephony';
				data = {
					lastName: '',
					firstName: telePhoneNumber,
					emailAddress: 'dummy@dummy.com',
					careGiverId: '',
					fullNumber: participant
				};
				telephonyUserAvailable = true;
			} else {
				var nameWithoutSpaces = participant.replace(/\s/g, '');
				var name = nameWithoutSpaces.split(',');
				var lname = name[0];
				var fname = name[1].split('(')[0];
				var eStart = name[1].indexOf('(')+1;
				var eEnd = name[1].indexOf(')');
				var email = name[1].substring(eStart,eEnd);
				userType = 'patientguest';
				data = {
					lastName: lname,
					firstName: fname,
					emailAddress: email,
					careGiverId: ''
				};
			}

			VideoVisit.appendInvitedGuestToSidebar(data, false, isTelePhony);
		} else {
			userType = 'clinician';
			data = {
				inMeetingDisplayName: participant
			};
			VideoVisit.appendAddedParticipantToSidebar(data, false);
		}
		// Service call
		VideoVisit.updateContext(data, userType);
	},
	updateContext: function(data, userType){
		var cData;
		switch(userType){
			case 'telephony':
				cData = {
					userType: userType,
					firstName: data.fullNumber, 
					lastName: data.lastName, 
					email: data.emailAddress,
					meetingId: $('#meetingId').val()
				}
			break;

			case 'patientguest':
				cData = {
					userType: userType,
					firstName: data.firstName, 
					lastName: data.lastName, 
					email: data.emailAddress,
					meetingId: $('#meetingId').val()
				}
			break;

			case 'clinician':
				// var nameWithoutSpaces = data.inMeetingDisplayName.replace(/\s/g, '');
				var name = data.inMeetingDisplayName.split(',');
				cData = {
					userType: userType,
					firstName: name[1].trim(), 
					lastName: name[0].trim(), 
					email: '',
					meetingId: $('#meetingId').val()
				}
			break;
		}
		// make AJAX call here
		$.ajax({
			type: "POST",
			url: VIDEO_VISITS.Path.visit.updateUserContext,
			cache: false,
			dataType: "json",
			data: cData,
			success: function(result){
				console.log('SUCCESS ::: '+result);
			},
			error: function(textStatus){
				console.log('ERROR ::: '+error);
			}
		});
	},
	appendAddedParticipantToSidebar: function(data, showNotification){
  		if($('#meetingParticipantContainer').length === 0){
  			if($('#meetingPatientGuestContainer').length === 0){
  				$('#video-info').append('<dl id="meetingParticipantContainer"><dt>Add\'l Clinicians</dt></dl>');
  				$('#meetingParticipantContainer').append('<dd id="meetingParticipant" style="word-wrap: break-word;"><span>'+data.inMeetingDisplayName+'<i class="active-user-state"></i></span></dd>');
  			}else{
  				$('#meetingPatientGuestContainer').before('<dl id="meetingParticipantContainer"><dt>Add\'l Clinicians</dt></dl>');
  				$('#meetingParticipantContainer').append('<dd id="meetingParticipant" style="word-wrap: break-word;"><span>'+data.inMeetingDisplayName+'<i class="active-user-state"></i></span></dd>');
  			}
  		}else if($('#meetingParticipantContainer').css('display') !== 'none'){
  			$('#meetingParticipant').append('<span>'+data.inMeetingDisplayName+'<i class="active-user-state"></i></span>');
  		}
  	},
  	appendInvitedGuestToSidebar: function(data, showNotification, isTelephony){
  		var name = '';
  		var str = '';
  		var emailstr = '';
  		var successMessage = '';
  		var iconstr = (showNotification == false)?'<i class="active-user-state" style="display:inline-block;"></i>':'<i class="active-user-state"></i>';
  		if(isTelephony == false) {
  			successMessage="Your invitation has been sent.";
	  		emailstr = (data.emailAddress.toLowerCase() === "dummy@dummy.com")?' <a href="javascript:void(0)" class="sendemail_patientGuest sendemail" style="display:none;" title="Email">(email)</a>':' <a href="javascript:void(0)" class="sendemail addPartcipantGuestEmail" onclick="VideoVisit.openEmailPopup(event)" title="Email">(email)</a>';
	  		str += '<p><span class="pg-with-ellipsis">'+emailstr+'<span class="lName">' + data.lastName + '</span>' +
	                  ', <span class="fName">' + data.firstName + '</span>' +
	                  ' <span class="email">' + data.emailAddress + '</span>' +
	                  ' <span class="guestID">' + data.careGiverId + '</span></span>' +  iconstr +
	                  '</p>';
  		} else {
  			let maxPhoneNum = '';
  			for(let i=$('#meetingPatientGuest').children('p').length;i>=0;i--){
  				let fnameVal = $($('#meetingPatientGuest').children('p')[i]).find(".fName").attr('firstnameattr');
  				if(fnameVal){
  					maxPhoneNum = $($('#meetingPatientGuest').children('p')[i]).find(".fName").text()
  					break;
  				}
  			}
  			maxPhoneNum = maxPhoneNum?parseInt(maxPhoneNum.replace('Phone ', '')):0;
  			maxPhoneNum = maxPhoneNum + 1;
  			emailstr = '<a href="javascript:void(0)" class="sendemail_patientGuest sendemail" style="display:none;" title="Email">(email)</a>';
	  		str += '<p><span class="pg-with-ellipsis">'+emailstr+'<span class="lName" lastnameattr="audio_participant"></span>' +
	                  '<span class="fName" firstnameattr="09'+data.fullNumber+'">Phone ' + maxPhoneNum + '</span>' +
	                  ' <span class="email" style="display:none;">' + data.emailAddress + '</span>' +
	                  ' <span class="guestID">' + data.careGiverId + '</span></span>' +  iconstr +
	                  '</p>';
  		}
  		if($('#meetingPatientGuestContainer').length === 0){
  			$('#video-info').append('<dl id="meetingPatientGuestContainer"><dt>My Guests</dt></dl>');
  			$('#meetingPatientGuestContainer').append('<dd id="meetingPatientGuest" style="word-wrap: break-word;">'+str+'</dd>');
  		}else if($('#meetingPatientGuestContainer').css('display') !== 'none'){
  			$('#meetingPatientGuest').append(str);
  		}
  	},
  	checkTelePhonyUser: function(phonenumber){
      	var patientGuestsLength = $('#meetingPatientGuest').children('p').length;
      	var available = false;
		for(var i=0; i<patientGuestsLength;i++){
			var lName = $($('#meetingPatientGuest').children('p')[i]).find(".lName").text().trim();
			var fName = $($('#meetingPatientGuest').children('p')[i]).find(".fName").text().trim();
			var email = $($('#meetingPatientGuest').children('p')[i]).find(".email").text().trim();
			//var isTelephony = isNumberString(changeFromTelePhoneToTenDigitNumber(fName));
			var isTelephony = $($('#meetingPatientGuest').children('p')[i]).find(".lName").attr('lastnameattr') == "audio_participant";
			//isTelephony = false;//US35148: Telephony: Deactivate for Release 8.6
			if(isTelephony){
				//var gName = changeFromTelePhoneToTenDigitNumber(fName).replace(/\s/g, '').split('').reverse().join('').substr(0,10);
				//var participant = phonenumber.split('').reverse().join('').substr(0,10);
				var gName = $($('#meetingPatientGuest').children('p')[i]).find(".fName").attr('firstnameattr').slice(-10);				
				var participant = phonenumber.slice(-10);
				if(participant === gName){
    				available = true;
					break;
    			}
			}
		}
		return available;
      },
	checkAndShowParticipantAvailableState: function(participants,isWebRTC){
		if(participants){
			//var patientGuests = getPatientGuestNameList();
			//var additinalClinicians = getAdditionalCliniciansNameList();
			var hostAvailable = false;
			//var patientAvailable = false;
			for(var ini=0;ini<sidePaneMeetingDetails.sortedParticipantsList.length;ini++){
				sidePaneMeetingDetails.sortedParticipantsList[ini].availableInMeeting = false;
			}
        	for(var i=0;i<participants.length;i++){
        		var pData = participants[i];
        		var pName = (isWebRTC)?participants[i].trim():pData.name.trim();
        		var participantName = pName.replace(/,/g, '').replace(/\s/g, '').toLowerCase();
				//var isTelephony = isNumberString(participantName);
				//commenting isTelephony = false;//US35148: Telephony: Deactivate for Release 8.6
        		// Host Availability
        		var hostName = meetingHostName.replace(/,/g, '').replace(/\s/g, '').toLowerCase();
        		if(hostName === participantName){
        			hostAvailable = true;
        		}
        		//participants availability
        		for(var pa=0;pa<sidePaneMeetingDetails.sortedParticipantsList.length;pa++){
        			let tPart = sidePaneMeetingDetails.sortedParticipantsList[pa];
        			let tPartName = '';
        			if(!tPart.firstName && !tPart.lastName){
        				tPartName = '';
        			}else if(tPart.firstName && tPart.lastName){
        				tPartName = tPart.firstName + ' ' + tPart.lastName;
        			}else if(!tPart.firstName){
        				tPartName = tPart.lastName;
        			}else if(!tPart.lastName){
        				tPartName = tPart.firstName;
        			}
        			if(tPart.title){
        				tPartName = tPartName + ' ' + tPart.title;//assuming title exixts only for clinician
        			}
        			if(tPart.careGiverId){
        				tPartName = tPartName + ' ' + tPart.emailAddress;//assuming careGiverId exixts only for guest
        			}
        			tPartName = tPartName.replace(/,/g, '').replace(/\s/g, '').toLowerCase();
        			if(participantName == tPartName){
        				sidePaneMeetingDetails.sortedParticipantsList[pa].availableInMeeting = true;
        			}
        		}
        		//participants availability
        		/*for(var pg=0;pg<patientGuests.length;pg++){
        			var guest = patientGuests[pg];
        			var gName;
        			var participant;
        			if (isTelephony) {
        				//gName = guest.fname.replace(/\s/g, '').split('').reverse().join('').substr(0,10);
        				//participant = participantName.split('').reverse().join('').substr(0,10);
        				gName = guest.fname.slice(-10);
        				participant = participantName.slice(-10);
        				if(participant === gName){
	        				guest.isAvailable = true;
	        			}
        			} else {
        				participant = participantName;
        				gName = guest.lname.replace(/\s/g, '').toLowerCase()+guest.fname.replace(/\s/g, '').toLowerCase()+'('+guest.email.replace(/\s/g, '').toLowerCase()+')';
	        			if(participant === gName){
	        				guest.isAvailable = true;
	        			}
        			}
        		}*/
	  			// Additional Clinicians Availability
	  			/*for(var c=0;c<additinalClinicians.length;c++){
        			var clinician = additinalClinicians[c];
        			var cName = clinician.name.replace(/,/g, '').replace(/\s/g, '').toLowerCase();
        			if(cName === participantName){
        				clinician.isAvailable = true;
        			}
        		}*/
        		// Adding participant to side bar dynamically only for telephonic users
        		/*if(isTelephony){
					var isNumberAvailableOnSideBar = VideoVisit.checkTelePhonyUser(participantName);
					if(isNumberAvailableOnSideBar === false){
						VideoVisit.addNewPartcipantsToSideBar(participantName, true);
						addedUserDynamically = true;
					}
        		}*/
        	}//ending of participants for loop

        	for(var sp=0;sp<sidePaneMeetingDetails.sortedParticipantsList.length;sp++){
        		if(sidePaneMeetingDetails.sortedParticipantsList[sp].availableInMeeting){
    				$('.guest-part-'+sp+' .participant-indicator').css('display', 'inline-block');
    			}else{
    				//$('.guest-part-'+sp+' .participant-indicator').css('display', 'none');
    			}
        	}

        	// Host icon toggle
        	/*if(hostAvailable){
    			$('#meetingHost .host-indicator').css('display', 'inline-block');
    		}else{
    			$('#meetingHost .host-indicator').css('display', 'none');
    		}
    		for(var pg=0;pg<patientGuests.length;pg++){
    			var guest = patientGuests[pg];
    			if(guest.isAvailable == true){
    				$($('#meetingPatientGuest').children('p')[pg]).find("i").css("display","inline-block");
    			} else{
    				$($('#meetingPatientGuest').children('p')[pg]).find("i").css("display","none");
    			}
    		}

  			// Additional Clinicians icon toggle
  			for(var c=0;c<additinalClinicians.length;c++){
    			var clinician = additinalClinicians[c];
    			if(clinician.isAvailable == true){
    				$($('#meetingParticipant').children('p')[c]).find("i").css("display","inline-block");
    			} else{
    				$($('#meetingParticipant').children('p')[c]).find("i").css("display","none");
    			}
    		}*/
    	}
	},
	logVendorMeetingEvents: function(params){
		var userId;
		var userType;
		var logType = params[0];
		var eventName = (params[1])?params[1]:'';
		var eventDesc = (params[2])?params[2]:'';
		var isCareGiver = ($("#caregiverId").val().trim() != "" && $("#meetingCode").val().trim() != "");
		console.log("sendEventNotification :: params :: "+params);
		if(isCareGiver == true){
	       	userType = 'Caregiver';
	       	userId = $("#guestName").val().trim();
		}else{
			userId = $("#mrn").val().trim();
			//US31271
			userType = $('#isProxyMeeting').val() == 'Y'?(userId?'Patient_Proxy':'Non_Patient_Proxy'):'Patient';
			//US31271
		}
		console.log("sendEventNotification :: params :: "+params);
		var eventData = {
			'logType': logType,
			'meetingId':$("#meetingId").val(),
			'userType': userType,
			'userId': userId,
			'eventName':eventName,
			'eventDescription':eventDesc
		};

		$.ajax({
			type: "POST",
			url: VIDEO_VISITS.Path.visit.logVendorMeetingEvents,
			cache: false,
			dataType: "json",
			data: eventData,
			success: function(result, textStatus){
				console.log("sendEventNotification :: result :: "+result);
			},
			error: function(textStatus){
				console.log("sendEventNotification :: error :: "+textStatus);
			}
		});
	},
	setMinDimensions: function(){

		var btnContainerWidth = $("#btnContainer").width();
		var calculatedMinWidth = $('#clinician-name').outerWidth() + $('#leaveEndBtnContainer').outerWidth() +10;

		/* Setting min-widths */
		$('#container-videovisit').css("min-width", calculatedMinWidth);
		var videoSidebarWidth = $("#video-sidebar").outerWidth() > 270 ? $("#video-sidebar").outerWidth()+1 : 270;
		$("#video-main").css("min-width", calculatedMinWidth-260);
		$("#pluginContainer").css("min-width", calculatedMinWidth-260-btnContainerWidth);

		
		/* Setting min-heights */
		//DE9498 Kranti--commented
		//var btnGroupHeight = $("#buttonGroup").outerHeight();
		//DE9498 Kranti--new line
		var btnGroupHeight = 550;

		$("#video-main").css("min-height", btnGroupHeight);
		$("#pluginContainer").css("min-height", btnGroupHeight);
		//$("#video-sidebar").css("min-height", btnGroupHeight);
		$("#btnContainer").css("min-height", btnGroupHeight);
		
		if (navigator.appName.indexOf("Internet Explorer")!=-1){
			if(navigator.appVersion.indexOf("MSIE 8")!=-1){
				$("#vidyoPlugin").css("min-height", btnGroupHeight);
				//$("#vidyoPlugin").css("min-width", calculatedMinWidth-200-btnContainerWidth);
			}
		}
		if($('#webrtc').val() == 'true'){
			$('#inCallContainer').css('min-width', '0');
			$('#inCallContainer').css('margin-top', '0');
		}
	}

	
}

function setSidePanParticipantsListHeight(){
	/*var ht = $('#video-sidebar').outerHeight() - $('.visit-info-container').outerHeight();
	$('.participant-details').css('height',ht);
	var listHt = $('.participant-details').outerHeight() - $('.participants-header').outerHeight() - 15;
	$('.participants-list').css('max-height',listHt);*/
	let calculatedHeight = 0;
	if($('.meeting-updated-time-date-info').outerHeight()){
		calculatedHeight = $('#video-sidebar').outerHeight() - ($('.visit-info').outerHeight() + $('.participants-header').outerHeight() + 40);
	}else{
		calculatedHeight = $('#video-sidebar').outerHeight() - ($('.visit-info').outerHeight() + $('.participants-header').outerHeight() - $('.meeting-updated-time-date-info').outerHeight());
	}
	$('.participants-list').css('max-height',calculatedHeight);
}

function updateSideBarWithDetails(meetingDetails){
	updateHostDetails(meetingDetails.host);
	updateTimeAndDate(meetingDetails.meetingTime);
	updateRunningLateTime(meetingDetails);
	updateParticipantsAndGuestsList(meetingDetails);
}
function updateHostDetails(host){
	if(!host){
		$('#meetingHost').text('');
		return;
	}
	let hostFullName = host.firstName+' '+host.lastName;
	if(host.title){
		hostFullName = hostFullName + ', ' + host.title;
	}
	$('#meetingHost').html('<span class="host-indicator"></span><span class="host-name">'+hostFullName+'</span><span class="three-dots"><img src="vidyoplayer/img/vidyo-redesign/svg/SVG/Action.svg" /></span>');
}
function updateTimeAndDate(meetingTime){
	if(!meetingTime){
		$('.meeting-time-date-info .time-display').text('');
		$('.meeting-time-date-info .date-display').text('');
		return;
	}
	var meetingTime = meetingTime?new Date(parseInt(meetingTime)):null;
	var hours = meetingTime.getHours();
	var minutes = meetingTime.getMinutes();
	if(minutes<10){
		minutes = minutes + "0";
	}
	var ampmval = 'AM';
	if(hours>11){
		ampmval = 'PM';
		hours = hours - 12;
	}
	hours = (hours == 0)?12:hours;
	$('.meeting-time-date-info .time-display').text(''+hours+':'+minutes+ampmval+', ');
	var weeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	$('.meeting-time-date-info .date-display').text(''+weeks[meetingTime.getDay()]+', '+months[meetingTime.getMonth()]+' '+meetingTime.getDate());
}
function updateRunningLateTime(meetingDetails){
	if(!meetingDetails.isRunningLate || !meetingDetails.runLateMeetingTime){
		$('.meeting-updated-time-date-info .time-display').text('');
		return;
	}
	var meetingTime = new Date(parseInt(meetingDetails.runLateMeetingTime));
	var hours = meetingTime.getHours();
	var minutes = meetingTime.getMinutes();
	if(minutes<10){
		minutes = minutes + "0";
	}
	var ampmval = 'AM';
	if(hours>11){
		ampmval = 'PM';
		hours = hours - 12;
	}
	hours = (hours == 0)?12:hours;
	$('.meeting-updated-time-date-info .time-display').text('updated: '+hours+':'+minutes+ampmval);
	$('.meeting-updated-time-date-info').show();
}
function updateParticipantsAndGuestsList(meetingList){
	if(!meetingList.participant && !meetingList.caregiver){
		sidePaneMeetingDetails.sortedParticipantsList = [];
		return;
	}
	var participants =  [];
	if(meetingList.participant && meetingList.caregiver){
		var nonTelephonyGuests = meetingList.caregiver.filter(function(item){
			return item.lastName != 'audio_participant';
		});
		participants = meetingList.participant.concat(nonTelephonyGuests);
	}else if(!meetingList.participant){
		participants = meetingList.caregiver.filter(function(item){
			return item.lastName != 'audio_participant';
		});;
	}else if(!meetingList.caregiver){
		participants = meetingList.participant;
	}
	//meetingList.participant.concat(meetingList.caregiver);
	let tempSortedArr = participants.sort(sortObjs('firstName'));
	let telephonyGuests = [];
	if(meetingList.caregiver){
		telephonyGuests = meetingList.caregiver.filter(function(item){
			return item.lastName == 'audio_participant';
		});
	}	
	sidePaneMeetingDetails.sortedParticipantsList = tempSortedArr.concat(telephonyGuests);	
	var tempArr = sidePaneMeetingDetails.sortedParticipantsList;
	var phoneNumCount = 0;
	for(let i=0;i<tempArr.length;i++){
		if(tempArr[i].title){
			$('.participants-list').append('<div class="guest-participant guest-part-'+i+'"><span class="participant-indicator"></span><span class="name-of-participant">'+tempArr[i].firstName.toLowerCase()+' '+tempArr[i].lastName.toLowerCase()+' '+tempArr[i].title+'</span><span class="three-dots"><img src="vidyoplayer/img/vidyo-redesign/svg/SVG/Action.svg" /></span></div>');
		}else{
			if(tempArr[i].lastName == 'audio_participant'){
				phoneNumCount++;
				$('.participants-list').append('<div class="guest-participant guest-part-'+i+'"><span class="participant-indicator"></span><span class="name-of-participant" phonenumber="'+tempArr[i].firstName+'">Phone '+phoneNumCount+'</span><span class="three-dots"><img src="vidyoplayer/img/vidyo-redesign/svg/SVG/Action.svg" /></span></div>');
			}else{
				$('.participants-list').append('<div class="guest-participant guest-part-'+i+'"><span class="participant-indicator"></span><span class="name-of-participant">'+tempArr[i].firstName.toLowerCase()+' '+tempArr[i].lastName.toLowerCase()+'</span><span class="three-dots"><img src="vidyoplayer/img/vidyo-redesign/svg/SVG/Action.svg" /></span></div>');
			}
		}		
	}
}
function sortObjs(prop){
	return function(a, b){
		return a[prop] < b[prop] ? -1 :(a[prop]>b[prop]) ? 1: 0;
	}
}

$(window).resize(function(){
	$('#container-videovisit').css("min-width", "900px");/*us13302*/

	/* Setting resize Widths */
	var windowWidth = $(window).width();
	var videoSidebarWidth = $("#video-sidebar").outerWidth() > 270 ? $("#video-sidebar").outerWidth()+1 : 270;;
	var btnContainerWidth = $("#btnContainer").outerWidth();

	var width = $('#container-videovisit').width();

	console.log("vvHeader width: " + $('vvHeader').width());

	if($('#video-sidebar').css('display') == 'none'){
		var calculatedWidthPluginContainer = width - btnContainerWidth;
		$("#pluginContainer").width(calculatedWidthPluginContainer);
		$("#infoWrapper").width(calculatedWidthPluginContainer);
	}
	else{
		var videoSidebarWidth = $("#video-sidebar").outerWidth() > 270 ? $("#video-sidebar").outerWidth()+1 : 270;
		var calculatedWidthPluginContainer = width - (260 + btnContainerWidth);
		$("#pluginContainer").width(calculatedWidthPluginContainer);
		$("#infoWrapper").width(calculatedWidthPluginContainer);
	}

	/* Setting resize Heights */
	var windowHeight = $(window).height();
	var vvHeaderHeight = $("#vvHeader").outerHeight();
	var calculatedHeight = windowHeight - vvHeaderHeight;

	//$('#container-videovisit').height(calculatedHeight);
	$("#video-main").height(calculatedHeight);
	$("#pluginContainer").height(calculatedHeight);
	$("#video-sidebar").height(calculatedHeight);
	$(".video-sidebar-content").height(calculatedHeight - 33);
	$("#btnContainer").height(calculatedHeight);
	setSidePanParticipantsListHeight();
});
