var isRunningLate = true;
var runningLateRecursiveCall;
var newStartTimeRecursiveCall;
var meetingHostName = "";
var meetingPatientName = "";
var sidePaneMeetingDetails = {
	sortedParticipantsList: []
};
var isPexip = false;

$(document).ready(function () {
	$('body').addClass('pexip-html-body');
	$.ajax({
		type: "POST",
		url: VIDEO_VISITS.Path.visit.meetingDetails + '?meetingId=' + $('#meetingId').val(),
		cache: false,
		dataType: "json",
		data: {},
		success: function (result) {
			if (!result || !result.host) {
				meetingHostName = '';
				return;
			} else if (!result.host.lastName && !result.host.firstName) {
				meetingHostName = '';
			} else if (result.host.lastName && result.host.firstName) {
				meetingHostName = result.host.lastName + ' ' + result.host.firstName;
			} else if (!result.host.lastName) {
				meetingHostName = result.host.firstName;
			} else if (!result.host.firstName) {
				meetingHostName = result.host.lastName;
			}
			if (result.host.title) {
				meetingHostName = meetingHostName + ' ' + result.host.title;
			}
			meetingHostName = meetingHostName.trim();
			sidePaneMeetingDetails = result;
			updateSideBarWithDetails(result);
			if ($("#container-videovisit").length !== 0) {
				if ($("#vendor").val() === 'pexip') {
					setTimeout(function () {
						configurePexipVideoProperties();
					}, 500);
				}
			}

		},
		error: function (result) {
			console.log(result);
		},
		complete: function (returndata) {}
	});
	isPexip = $('#vendor').val() === 'pexip';
	//$('html').css('overflow-y', 'hidden');
	var windowHeight = $(window).height();
	var windowWidth = $(window).width();

	var vvHeaderHeight = $("#vvHeader").outerHeight();
	var videoSidebarWidth = $("#video-sidebar").outerWidth() > 270 ? $("#video-sidebar").outerWidth() + 1 : 270;
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
	if (!$('#container').hasClass('pexip-main-container')) {
		$("#btnContainer").height(calculatedHeight);
	}

	$("#infoWrapper").height(calculatedHeight);
	$("#infoWrapper").width(calculatedWidthPluginContainer);

	$("#setupContents").height(calculatedHeight);
	$("#setupContents").width(calculatedWidthPluginContainer);

	// Returns the code on pre call load to avoid the errors.
	if ($("#pluginContainer").length == 0 && $('#vendor').val() != 'pexip') {
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

	var patient = ($("#meetingPatient").val().indexOf('&nbsp;') > -1) ? $("#meetingPatient").val().replace('&nbsp;', '') : $("#meetingPatient").val();
	var splittedPatientName = patient.trim().split(" ");
	for (var c = 0; c < splittedPatientName.length; c++) {
		var char = splittedPatientName[c].trim();
		if (char !== "") {
			meetingPatientName += char + " ";
		}
	}
	meetingPatientName = meetingPatientName.trim();

	//make ajax call to KP Keep alive url
	var keepAliveUrl = $("#kpKeepAliveUrl").val();
	if (keepAliveUrl != null && keepAliveUrl != "" && keepAliveUrl.length > 0 && keepAliveUrl != "undefined") {
		try {
			$.ajax({
				url: keepAliveUrl,
				type: 'GET',
				dataType: 'jsonp',
				cache: false,
				async: true,
				crossDomain: true,
				success: function (returndata) {},
				error: function () {}
			});
		} catch (e) {

		}
	}

	// US14832 - Displaying dynamic message in Waiting Room based on reccurent service call [START]
	// This service call will trigger for every 2 minutes
	//Start DE9501: VV_Provider_Member_Vidyo Page_"New Start" time is updating even if the Host joins the meeting
	//Start US18295: Running Late: Add time in player: add time in player

	var newStartTimeCheck = function () {
		if (VIDEO_VISITS.Path.IS_HOST_AVAILABLE == true) {
			return;
		}
		$.ajax({
			type: "GET",
			url: VIDEO_VISITS.Path.visit.providerRunningLateInfo,
			cache: false,
			dataType: "json",
			data: {
				'meetingId': $("#meetingId").val()
			},
			success: function (result, textStatus) {
				if (result.service.status.code == 200) {
					isRunningLate = result.service.runningLateEnvelope.isRunningLate;
					if (isRunningLate == true) {
						var newMeetingTimeStamp = result.service.runningLateEnvelope.runLateMeetingTime;
						var newTime = convertTimestampToDate(newMeetingTimeStamp, 'time_only');
						$('#displayMeetingNewStartTime').html('New Start ' + newTime);
						$(".waitingroom-text").html("Your visit will now start at <b>" + newTime + "</b><span style='font-size:20px;line-height:29px;display:block;'>We're sorry, your doctor is running late.</span>");
						$("#lateText span").css('margin', '0 0 0 17%');
						$("#halfWaitingRoom .waitingRoomMessageBlock").css('display', 'block');
						updateRunningLateTime(result.service.runningLateEnvelope);
					} else {
						$('#displayMeetingNewStartTime').html('');
						$(".waitingroom-text").html("Your visit will start once your doctor joins.");
						$("#halfWaitingRoom .waitingRoomMessageBlock").css('display', 'flex');
					}
				}
			},
			error: function (textStatus) {
				console.log("RUNNING LATE ERROR: " + textStatus);
				$('#displayMeetingNewStartTime').html('');
				$(".waitingroom-text").html("Your visit will start once your doctor joins.");
				$("#halfWaitingRoom .waitingRoomMessageBlock").css('display', 'flex');
			}
		});
	};
	var newStartTimeCheckForOneTime = function () {
		$.ajax({
			type: "GET",
			url: VIDEO_VISITS.Path.visit.providerRunningLateInfo,
			cache: false,
			dataType: "json",
			data: {
				'meetingId': $("#meetingId").val()
			},
			success: function (result, textStatus) {
				if (result != null && result.service.status.code == 200) {
					isRunningLate = result.service.runningLateEnvelope.isRunningLate;
					if (isRunningLate == true) {
						var newMeetingTimeStamp = result.service.runningLateEnvelope.runLateMeetingTime;
						var newTime = convertTimestampToDate(newMeetingTimeStamp, 'time_only');
						$('#displayMeetingNewStartTime').html('New Start ' + newTime);
						if (VIDEO_VISITS.Path.IS_HOST_AVAILABLE == false) {
							$(".waitingroom-text").html("Your visit will now start at <b>" + newTime + "</b><span style='font-size:20px;line-height:29px;display:block;'>We're sorry, your doctor is running late.</span>");
							$("#lateText span").css('margin', '0 0 0 17%');
							$("#halfWaitingRoom .waitingRoomMessageBlock").css('display', 'block');
						}
						updateRunningLateTime(result.service.runningLateEnvelope);
					} else {
						$('#displayMeetingNewStartTime').html('');
						if (VIDEO_VISITS.Path.IS_HOST_AVAILABLE == false) {
							$(".waitingroom-text").html("Your visit will start once your doctor joins.");
							$("#halfWaitingRoom .waitingRoomMessageBlock").css('display', 'flex');
						}
					}
				}
			},
			error: function (textStatus) {
				console.log("RUNNING LATE ERROR: " + textStatus);
				$('#displayMeetingNewStartTime').html('');
				$(".waitingroom-text").html("Your visit will start once your doctor joins.");
			}
		});
	};

	newStartTimeCheckForOneTime();
	newStartTimeRecursiveCall = window.setInterval(function () {
		newStartTimeCheck();
	}, 120000);

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
	if (!isPexip) {
		setTimeout(function () {
			setSidePanParticipantsListHeight();
		}, 1000);
	}

	VideoVisit.updatePatientGuestNameList();

	$("#selfview").on('click', function () {
		if (document.getElementById("presentation-view").style.display == "block") {
			$(this).addClass("togglesv");
			$("#presentation-view").addClass("togglepv");
			$("#presentation-view img").addClass("togglepvimg");
			var zindex = $("#presentation-view img").css("z-index");
			var zindexsv = $(this).css("z-index");
			if (zindex == 5) {
				$("#presentation-view img").css("z-index", "6");
			} else if (zindex == 6) {
				$("#presentation-view img").css("z-index", "7");
			} else if (zindexsv == 8) {
				$("#selfview").css("z-index", "6");
			}
			$(".remoteFeed").css("display", "none");
		}
	});
	$("#presentation-view").on('click', function () {
		$("#selfview").removeClass("togglesv");
		$("#selfview").css("cursor", "pointer");
		var zindex1 = $("#selfview").css("z-index");
		var zindexpv = $("#presentation-view img").css("z-index");
		if (zindex1 == 6) {
			$("#selfview").css("z-index", "7");
		} else if (zindexpv == 7) {
			$("#presentation-view img").css("z-index", "6");
		} else if (zindex1 == 7) {
			$("#selfview").css("z-index", "8");
		}
		$("#presentation-view").removeClass("togglepv");
		$("#presentation-view img").removeClass("togglepvimg");
	});
}).on('click', function (evt) {
	if (evt.target.className == "settings-btn" || $(evt.target).closest('.settings-btn').length > 0) {
		return;
	}
	if (evt.target.className == "videocontainer") {
		return;
	}
	if ($(evt.target).closest('.list-of-devices').length) {
		return;
	}
	if ($(evt.target).closest('.videocontainer').length) {
		if ($('.list-of-devices').css('display') == 'block') {
			$('.list-of-devices').toggle('slide', {
				direction: 'left'
			}, 500);
		}
		return;
	}
	if ($('.list-of-devices').css('display') == 'block') {
		$('.list-of-devices').toggle('slide', {
			direction: 'left'
		}, 500);
	}
});

var getPatientGuestNameList = function () {
	var pgNames = [];
	var patientGuestsLength = $('#meetingPatientGuest').children('p').length;
	for (var i = 0; i < patientGuestsLength; i++) {
		var lName = $($('#meetingPatientGuest').children('p')[i]).find(".lName").text().trim();
		var fName = $($('#meetingPatientGuest').children('p')[i]).find(".fName").text().trim();
		var email = $($('#meetingPatientGuest').children('p')[i]).find(".email").text().trim();
		//var isTelephony = isNumberString(changeFromTelePhoneToTenDigitNumber(fName));
		//isTelephony = false;//US35148: Telephony: Deactivate for Release 8.6
		var isTelephony = $($('#meetingPatientGuest').children('p')[i]).find(".lName").attr('lastnameattr') == "audio_participant";
		if (isTelephony) {
			//fName = changeFromTelePhoneToTenDigitNumber(fName);
			let firstnameattr = $($('#meetingPatientGuest').children('p')[i]).find(".fName").attr('firstnameattr');
			fName = firstnameattr.slice(-10);
		}
		pgNames.push({
			fname: fName,
			lname: lName,
			email: email,
			index: i,
			isAvailable: false,
			isTelePhony: isTelephony
		});
	}
	return pgNames;
}

var getAdditionalCliniciansNameList = function () {
	var additionalCliniciansNames = [];
	var additionalCliniciansLength = $('#meetingParticipant').children('p').length;
	for (var i = 0; i < additionalCliniciansLength; i++) {
		var clinicianName = $($('#meetingParticipant').children('p')[i]).find("span").text().trim();
		additionalCliniciansNames.push({
			name: clinicianName,
			index: i,
			isAvailable: false
		});
	}
	return additionalCliniciansNames;
}

var VideoVisit = {
	updatePatientGuestNameList: function () {
		var pgNames = [];
		var patientGuestsLength = $('#meetingPatientGuest').children('p').length;
		for (var i = 0; i < patientGuestsLength; i++) {
			var lName = $($('#meetingPatientGuest').children('p')[i]).find(".lName").text().trim();
			var fName = $($('#meetingPatientGuest').children('p')[i]).find(".fName").text().trim();
			var email = $($('#meetingPatientGuest').children('p')[i]).find(".email").text().trim();
			var activeUsrStateDisplayVal = $($('#meetingPatientGuest').children('p')[i]).find(".active-user-state").css('display');
			//var isTelephony = isNumberString(fName) === true;
			var isTelephony = $($('#meetingPatientGuest').children('p')[i]).find(".lName").attr('lastnameattr') == 'audio_participant';
			//isTelephony = false;//US35148: Telephony: Deactivate for Release 8.6
			if (isTelephony) {
				//var tele = fName.trim().split('').reverse().join('').substr(0,10).split('').reverse().join('');
				//var telePhoneNumber = changeFromNumberToTelephoneFormat(tele);
				//var newFName = telePhoneNumber;
				//var newLName = "";
				//$($('#meetingPatientGuest').children('p')[i]).find(".lName").text(newLName);
				//$($('#meetingPatientGuest').children('p')[i]).find(".fName").text(newFName);
				let lastnameattr = $($('#meetingPatientGuest').children('p')[i]).find(".lName").attr('lastnameattr');
				let firstnameattr = $($('#meetingPatientGuest').children('p')[i]).find(".fName").attr('firstnameattr');
				lastnameattr = lastnameattr ? lastnameattr : '';
				firstnameattr = firstnameattr ? firstnameattr : '';
				var str = '<span class="pg-with-ellipsis telephony-pg"><span class="lName" lastnameattr="' + lastnameattr + '"></span> <span class="fName" firstnameattr="' + firstnameattr + '">' + fName + '</span><span class="email" style="display:none;">' + email + '</span></span><i class="active-user-state"></i>'
				$($('#meetingPatientGuest').children('p')[i]).html(str);
			} else {
				var comStr = ', ';
				if (!lName || !fName) {
					comStr = '';
				}
				var testTxt = '<span class="pg-with-ellipsis pguest"><span class="lName">' + lName + '</span>' + comStr + '<span class="fName">' + fName + '</span><span class="email" style="display:none;">' + email + '</span></span><i class="active-user-state" style="display: ' + activeUsrStateDisplayVal + ';"></i>';
				$($('#meetingPatientGuest').children('p')[i]).html(testTxt);
			}
		}
		$('#meetingPatientGuest').css('display', 'block');
	},
	setShowPrecallTestingFlag: function (flag) {
		var val = (flag == true) ? "true" : "flag";
		$.ajax({
			type: "POST",
			url: VIDEO_VISITS.Path.visit.setPeripheralsFlag,
			cache: false,
			dataType: "json",
			data: {
				"showPeripheralsPage": val
			},
			success: function (result, textStatus) {
				console.log(result);
			},
			error: function (textStatus) {

			}
		});
	},
	addNewPartcipantsToSideBar: function (participant, isPatientGuest) {
		var data = {};
		var userType = '';
		if (isPatientGuest) {
			var isTelePhony = (participant.indexOf('@') === -1);
			//isTelePhony = false;//US35148: Telephony: Deactivate for Release 8.6
			if (isTelePhony) {
				var tele = participant.trim().split('').reverse().join('').substr(0, 10).split('').reverse().join('');
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
				var eStart = name[1].indexOf('(') + 1;
				var eEnd = name[1].indexOf(')');
				var email = name[1].substring(eStart, eEnd);
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
	updateContext: function (data, userType) {
		var cData;
		switch (userType) {
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

			case 'sip':
				cData = {
					userType: userType,
					meetingId: $('#meetingId').val(),
					destination: data.destination,
					displayName: data.displayName,
					participantType: "audio"
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
			success: function (result) {
				console.log('SUCCESS ::: ' + result);
			},
			error: function (textStatus) {
				console.log('ERROR ::: ' + error);
			}
		});
	},
	appendAddedParticipantToSidebar: function (data, showNotification) {
		if ($('#meetingParticipantContainer').length === 0) {
			if ($('#meetingPatientGuestContainer').length === 0) {
				$('#video-info').append('<dl id="meetingParticipantContainer"><dt>Add\'l Clinicians</dt></dl>');
				$('#meetingParticipantContainer').append('<dd id="meetingParticipant" style="word-wrap: break-word;"><span>' + data.inMeetingDisplayName + '<i class="active-user-state"></i></span></dd>');
			} else {
				$('#meetingPatientGuestContainer').before('<dl id="meetingParticipantContainer"><dt>Add\'l Clinicians</dt></dl>');
				$('#meetingParticipantContainer').append('<dd id="meetingParticipant" style="word-wrap: break-word;"><span>' + data.inMeetingDisplayName + '<i class="active-user-state"></i></span></dd>');
			}
		} else if ($('#meetingParticipantContainer').css('display') !== 'none') {
			$('#meetingParticipant').append('<span>' + data.inMeetingDisplayName + '<i class="active-user-state"></i></span>');
		}
	},
	appendInvitedGuestToSidebar: function (data, showNotification, isTelephony) {
		$('.participants-list').html('');
		if (data.participantType == "audio") {

			if (sidePaneMeetingDetails.sipParticipants) {
				sidePaneMeetingDetails.sipParticipants.push(data);
			} else {
				sidePaneMeetingDetails.sipParticipants = [data];
			}
		} else {
			if (sidePaneMeetingDetails.caregiver) {
				sidePaneMeetingDetails.caregiver.push(data);
			} else {
				sidePaneMeetingDetails.caregiver = [data];
			}
		}
		updateParticipantsAndGuestsList(sidePaneMeetingDetails);
		if (pexipParticipantsList) {
			VideoVisit.checkAndShowParticipantAvailableState(pexipParticipantsList, 'pexip');
		}
	},
	checkTelePhonyUser: function (phonenumber) {
		var patientGuestsLength = $('#meetingPatientGuest').children('p').length;
		var available = false;
		for (var i = 0; i < patientGuestsLength; i++) {
			var lName = $($('#meetingPatientGuest').children('p')[i]).find(".lName").text().trim();
			var fName = $($('#meetingPatientGuest').children('p')[i]).find(".fName").text().trim();
			var email = $($('#meetingPatientGuest').children('p')[i]).find(".email").text().trim();
			//var isTelephony = isNumberString(changeFromTelePhoneToTenDigitNumber(fName));
			var isTelephony = $($('#meetingPatientGuest').children('p')[i]).find(".lName").attr('lastnameattr') == "audio_participant";
			//isTelephony = false;//US35148: Telephony: Deactivate for Release 8.6
			if (isTelephony) {
				//var gName = changeFromTelePhoneToTenDigitNumber(fName).replace(/\s/g, '').split('').reverse().join('').substr(0,10);
				//var participant = phonenumber.split('').reverse().join('').substr(0,10);
				var gName = $($('#meetingPatientGuest').children('p')[i]).find(".fName").attr('firstnameattr').slice(-10);
				var participant = phonenumber.slice(-10);
				if (participant === gName) {
					available = true;
					break;
				}
			}
		}
		return available;
	},
	checkAndShowParticipantAvailableState: function (participants, vendorval) {
		if (participants) {
			var hostAvailable = false;
			for (var ini = 0; ini < sidePaneMeetingDetails.sortedParticipantsList.length; ini++) {
				sidePaneMeetingDetails.sortedParticipantsList[ini].availableInMeeting = false;
			}
			for (var i = 0; i < participants.length; i++) {
				var pData = participants[i];
				var prName = (vendorval == 'webrtc') ? participants[i].trim() : (vendorval == 'vidyo') ? pData.name.trim() : participants[i].display_name.trim();
				if (vendorval == 'pexip' && participants[i].protocol == "sip") {
					prName = participants[i].uri.substring(6, 16);
				}

				var participantName = prName.replace(/,/g, '').replace(/\s/g, '').toLowerCase();
				// Host Availability
				var hostName = meetingHostName.replace(/,/g, '').replace(/\s/g, '').toLowerCase();
				if (hostName.trim() === participantName.trim()) {
					hostAvailable = true;
				}
				//participants availability
				for (var pa = 0; pa < sidePaneMeetingDetails.sortedParticipantsList.length; pa++) {

					let inMeetingDisplayName1 = sidePaneMeetingDetails.sortedParticipantsList[pa].inMeetingDisplayName ? sidePaneMeetingDetails.sortedParticipantsList[pa].inMeetingDisplayName.trim() : '';;
					let displayName1 = sidePaneMeetingDetails.sortedParticipantsList[pa].displayName ? sidePaneMeetingDetails.sortedParticipantsList[pa].displayName.trim() : '';
					let destinationName = sidePaneMeetingDetails.sortedParticipantsList[pa].destination ? sidePaneMeetingDetails.sortedParticipantsList[pa].destination.trim() : '';
					if (inMeetingDisplayName1 == prName.trim() || displayName1 == prName.trim() || destinationName == prName.trim()) {
						sidePaneMeetingDetails.sortedParticipantsList[pa].availableInMeeting = true;
					}

				}
				//participants availability
			} //ending of participants for loop

			for (var sp = 0; sp < sidePaneMeetingDetails.sortedParticipantsList.length; sp++) {
				if (sidePaneMeetingDetails.sortedParticipantsList[sp].availableInMeeting) {
					$('.guest-part-' + sp + ' .participant-indicator').css('visibility', 'visible');
				} else {
					$('.guest-part-' + sp + ' .participant-indicator').css('visibility', 'hidden');
				}
			}
			// Host icon toggle
			if (hostAvailable) {
				$('#meetingHost .host-indicator').css('visibility', 'visible');
			} else {
				$('#meetingHost .host-indicator').css('visibility', 'hidden');
			}
		}
	},
	logVendorMeetingEvents: function (params) {
		var userId;
		var userType;
		var logType = params[0];
		var eventName = (params[1]) ? params[1] : '';
		var eventDesc = (params[2]) ? params[2] : '';
		var isCareGiver = ($("#caregiverId").val().trim() != "" && $("#meetingCode").val().trim() != "");
		console.log("sendEventNotification :: params :: " + params);
		if (isCareGiver == true) {
			userType = 'Caregiver';
			userId = $("#guestName").val().trim();
		} else {
			userId = $("#mrn").val().trim();
			//US31271
			userType = $('#isProxyMeeting').val() == 'Y' ? (userId ? 'Patient_Proxy' : 'Non_Patient_Proxy') : 'Patient';
			//US31271
		}
		console.log("sendEventNotification :: params :: " + params);
		var eventData = {
			'logType': logType,
			'meetingId': $("#meetingId").val(),
			'userType': userType,
			'userId': userId,
			'eventName': eventName,
			'eventDescription': eventDesc
		};

		$.ajax({
			type: "POST",
			url: VIDEO_VISITS.Path.visit.logVendorMeetingEvents,
			cache: false,
			dataType: "json",
			data: eventData,
			success: function (result, textStatus) {
				console.log("sendEventNotification :: result :: " + result);
			},
			error: function (textStatus) {
				console.log("sendEventNotification :: error :: " + textStatus);
			}
		});
	},
	setMinDimensions: function () {

		var btnContainerWidth = $("#btnContainer").width();
		var calculatedMinWidth = $('#clinician-name').outerWidth() + $('#leaveEndBtnContainer').outerWidth() + 10;

		/* Setting min-widths */
		$('#container-videovisit').css("min-width", calculatedMinWidth);
		var videoSidebarWidth = $("#video-sidebar").outerWidth() > 270 ? $("#video-sidebar").outerWidth() + 1 : 270;
		$("#video-main").css("min-width", calculatedMinWidth - 260);
		$("#pluginContainer").css("min-width", calculatedMinWidth - 260 - btnContainerWidth);


		/* Setting min-heights */
		//DE9498 Kranti--commented
		//var btnGroupHeight = $("#buttonGroup").outerHeight();
		//DE9498 Kranti--new line
		var windowHeight = $(window).height();
		var vvHeaderHeight = $("#vvHeader").outerHeight();
		var btnGroupHeight = windowHeight - vvHeaderHeight;

		$("#video-main").height(btnGroupHeight);
		$("#pluginContainer").height(btnGroupHeight);
		$("#video-main").css("min-height", btnGroupHeight);
		$("#pluginContainer").css("min-height", btnGroupHeight);
		//$("#video-sidebar").css("min-height", btnGroupHeight);
		if (!$('#container').hasClass('pexip-main-container')) {
			$("#btnContainer").css("min-height", btnGroupHeight);
		}

		if (navigator.appName.indexOf("Internet Explorer") != -1) {
			if (navigator.appVersion.indexOf("MSIE 8") != -1) {
				$("#vidyoPlugin").css("min-height", btnGroupHeight);
				//$("#vidyoPlugin").css("min-width", calculatedMinWidth-200-btnContainerWidth);
			}
		}
		if ($('#webrtc').val() == 'true') {
			$('#inCallContainer').css('min-width', '0');
			$('#inCallContainer').css('margin-top', '0');
		}
		if (isPexip) {
			setSidePanParticipantsListHeight();
		}
	}


}

function setSidePanParticipantsListHeight() {
	/*var ht = $('#video-sidebar').outerHeight() - $('.visit-info-container').outerHeight();
	$('.participant-details').css('height',ht);
	var listHt = $('.participant-details').outerHeight() - $('.participants-header').outerHeight() - 15;
	$('.participants-list').css('max-height',listHt);*/
	let calculatedHeight = $('#video-sidebar').outerHeight() - ($('.visit-info-container').outerHeight() + 65);
	$('.participants-list').css('max-height', calculatedHeight);
}

function updateSideBarWithDetails(meetingDetails) {
	updateHostDetails(meetingDetails.host);
	updateTimeAndDate(meetingDetails.meetingTime);
	updateRunningLateTime(meetingDetails);
	updateParticipantsAndGuestsList(meetingDetails);
}

function updateHostDetails(host) {
	if (!host) {
		$('#meetingHost').text('');
		return;
	}
	let hostFname = host.firstName ? host.firstName.toLowerCase() : '';
	let hostLname = host.lastName ? host.lastName.toLowerCase() : '';
	let hostFullName = hostFname + ' ' + hostLname;
	let hostTitle = host.title ? host.title.toLowerCase() : '';
	if (host.title) {
		hostFullName = hostFullName.trim() + ', ' + host.title;
	}
	$('#meetingHost').html('<img class="host-indicator" src="images/conference/svg/SVG/Connected.svg" /><span class="host-name">' + hostFullName.trim() + '</span><span class="three-dots"><img src="images/conference/svg/SVG/Action.svg" /></span>');
}

function updateTimeAndDate(meetingTime) {
	if (!meetingTime) {
		$('.meeting-time-date-info .time-display').text('');
		$('.meeting-time-date-info .date-display').text('');
		return;
	}
	var meetingTime = meetingTime ? new Date(parseInt(meetingTime)) : null;
	var hours = meetingTime.getHours();
	var minutes = meetingTime.getMinutes();
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	var ampmval = 'AM';
	if (hours > 11) {
		ampmval = 'PM';
		hours = hours - 12;
	}
	hours = (hours == 0) ? 12 : hours;
	$('.meeting-time-date-info .time-display').text('' + hours + ':' + minutes + ampmval + ', ');
	var weeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	$('.meeting-time-date-info .date-display').text('' + weeks[meetingTime.getDay()] + ', ' + months[meetingTime.getMonth()] + ' ' + meetingTime.getDate());
}

function updateRunningLateTime(meetingDetails) {
	if (!meetingDetails.isRunningLate || !meetingDetails.runLateMeetingTime) {
		$('.meeting-updated-time-date-info .time-display').text('');
		return;
	}
	var meetingTime = new Date(parseInt(meetingDetails.runLateMeetingTime));
	var hours = meetingTime.getHours();
	var minutes = meetingTime.getMinutes();
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	var ampmval = 'AM';
	if (hours > 11) {
		ampmval = 'PM';
		hours = hours - 12;
	}
	hours = (hours == 0) ? 12 : hours;
	$('.meeting-updated-time-date-info .time-display').text('updated: ' + hours + ':' + minutes + ampmval);
	$('.meeting-updated-time-date-info').show();
}

function updateParticipantsAndGuestsList(meetingList) {
	if (!meetingList.participant && !meetingList.caregiver && !meetingList.sipParticipants) {
		sidePaneMeetingDetails.sortedParticipantsList = [];
		return;
	}
	var participants = [];
	if (meetingList.participant && meetingList.caregiver) {
		var nonTelephonyGuests = meetingList.caregiver.filter(function (item) {
			return item.lastName != 'audio_participant';
		});
		participants = meetingList.participant.concat(nonTelephonyGuests);
	} else if (meetingList.participant) {
		participants = meetingList.participant;
	} else if (meetingList.caregiver) {
		participants = meetingList.caregiver.filter(function (item) {
			return item.lastName != 'audio_participant';
		});
	}
	//meetingList.participant.concat(meetingList.caregiver);
	let tempSortedArr = participants.sort(sortObjs('firstName'));
	let telephonyGuests = [];
	if (meetingList.sipParticipants) {
		telephonyGuests = meetingList.sipParticipants;
	}
	sidePaneMeetingDetails.sortedParticipantsList = tempSortedArr.concat(telephonyGuests);
	var tempArr = sidePaneMeetingDetails.sortedParticipantsList;
	var phoneNumCount = 0;
	for (let i = 0; i < tempArr.length; i++) {
		if (tempArr[i].nuid) {
			tempArr[i].title = tempArr[i].title ? tempArr[i].title : '';
			$('.participants-list').append('<div class="guest-participant guest-part-' + i + '"><img class="participant-indicator" src="images/conference/svg/SVG/Connected.svg" /><span class="name-of-participant">' + tempArr[i].firstName.toLowerCase() + ' ' + tempArr[i].lastName.toLowerCase() + ' ' + tempArr[i].title + '</span><span class="three-dots hide"><img src="images/conference/svg/SVG/Action.svg" /></span></div>');
		} else {
			if (tempArr[i].participantType == 'audio' || tempArr[i].protocol == "sip") {
				phoneNumCount++;
				var phoneName = tempArr[i].displayName ? tempArr[i].displayName : tempArr[i].display_name;
				var phoneNumb = tempArr[i].destination ? tempArr[i].destination : tempArr[i].uri.substring(6, 16);
				$('.participants-list').append('<div class="guest-participant guest-part-' + i + '"><img class="participant-indicator" src="images/conference/svg/SVG/Connected.svg" /><span class="name-of-participant pexipPhone" phonenumber="' + phoneNumb + '">' + phoneName + '</span><span class="three-dots hide"><img src="images/conference/svg/SVG/Action.svg" /></span></div>');
			} else {
				$('.participants-list').append('<div class="guest-participant guest-part-' + i + '"><img class="participant-indicator" src="images/conference/svg/SVG/Connected.svg" /><span class="name-of-participant">' + tempArr[i].firstName.toLowerCase() + ' ' + tempArr[i].lastName.toLowerCase() + '</span><span class="three-dots hide"><img src="images/conference/svg/SVG/Action.svg" /></span></div>');
			}
		}
	}
}

function sortObjs(prop) {
	return function (a, b) {
		return a[prop].toLowerCase() < b[prop].toLowerCase() ? -1 : (a[prop].toLowerCase() > b[prop].toLowerCase()) ? 1 : 0;
	}
}

function configurePexipVideoProperties() {
	console.log('========>>>> PEXIP AUTO START');
	console.log("join-conf clicked");

	var reqscript1 = document.createElement('script');
	reqscript1.src = "js/site/pexip/complex/webui.js";
	reqscript1.type = "text/javascript";
	document.getElementsByTagName("head")[0].appendChild(reqscript1);

	//document.getElementById("container").appendChild(reqscript1);
	//document.body.appendChild(reqscript1);

	var reqscript2 = document.createElement('script');
	var reqscript3 = document.createElement('script');
	reqscript3.src = "js/site/pexip/complex/EventSource.js";
	reqscript3.type = "text/javascript";
	document.getElementsByTagName("head")[0].appendChild(reqscript3);
	//  reqscript2.src = "js/site/pexip/complex/pexrtc.js";

	reqscript1.onload = function () {
		console.log("reqscript1 loaded");
		reqscript2.src = "js/site/pexip/complex/pexrtcV20.js";
		reqscript2.type = "text/javascript";
		document.getElementsByTagName("head")[0].appendChild(reqscript2);
	};

	reqscript2.onload = function () {
		console.log("reqscript2 loaded");
		startPexip();
	};
	reqscript3.onload = function () {
		console.log("reqscript3 loaded");
		//startPexip();
	};
}

function startPexip() {
	console.log(sidePaneMeetingDetails);
	//$('html').removeClass("no-scroll");
	var guestPin = sidePaneMeetingDetails.vendorGuestPin;
	$('#guestPin').val(guestPin);
	var roomUrl = $('#guestUrl').val();
	var alias = sidePaneMeetingDetails.meetingVendorId; // "M.NCAL.MED.0.0.419872.278914" // "M.NCAL.MED.0.369638..1234";
	var bandwidth = "1280"; // $('#bandwidth').val();
	var source = "Join+Conference";
	var name = $("#guestName").val();
	initialise(roomUrl, alias, bandwidth, name, "", source);
	VideoVisit.setMinDimensions();
}

function setConferenceStatus() {
	var isMember = $("#isMember").val();
	var meetingCode = $("#meetingCode").val();
	var meetingId = $('#meetingId').val();
	var isProxyMeeting = $('#isProxyMeeting').val();
	if (isMember == 'true' || isMember == true) {
		MemberVisit.SetKPHCConferenceStatus(meetingId, "J", isProxyMeeting, decodeURIComponent($('#guestName').val()));
	} else {
		MemberVisit.CaregiverJoinMeeting(meetingId, "J", meetingCode);
	}
}

$(window).resize(function () {
	$('#container-videovisit').css("min-width", "900px"); /*us13302*/

	/* Setting resize Widths */
	var windowWidth = $(window).width();
	var videoSidebarWidth = $("#video-sidebar").outerWidth() > 270 ? $("#video-sidebar").outerWidth() + 1 : 270;;
	var btnContainerWidth = $("#btnContainer").outerWidth();

	var width = $('#container-videovisit').width();

	console.log("vvHeader width: " + $('vvHeader').width());

	if ($('#video-sidebar').css('display') == 'none') {
		var calculatedWidthPluginContainer = width - btnContainerWidth;
		$("#pluginContainer").width(calculatedWidthPluginContainer);
		$("#infoWrapper").width(calculatedWidthPluginContainer);
	} else {
		var videoSidebarWidth = $("#video-sidebar").outerWidth() > 270 ? $("#video-sidebar").outerWidth() + 1 : 270;
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
	$("#video-main").css("min-height", calculatedHeight);
	$("#pluginContainer").css("min-height", calculatedHeight);
	$("#video-sidebar").height(calculatedHeight);
	$(".video-sidebar-content").height(calculatedHeight - 33);
	if (!$('#container').hasClass('pexip-main-container')) {
		$("#btnContainer").height(calculatedHeight);
	}
	setSidePanParticipantsListHeight();
});

function togglePeripherals() {
	$('.list-of-devices').toggle('slide', {
		direction: 'left'
	}, 500);
	$('#selectPeripheral1').css('display', 'block');
}