VIDEO_VISITS.Path = {
    IS_HOST_AVAILABLE: false,
    global : {
        error : 'error.htm',
        expired : 'logout.htm',
        guestexpired : 'guestlogout.htm',
        videovisitReady:'videoVisitReady.htm',
        videovisitGuestReady:'videoVisitGuestReady.htm',
        videovisitMobileReadyPexip:'videovisitmobileready.htm'
    },
    grid : {
        home : {
            test : 'data/home/test.json'
        }
    },
    login : {
        ajaxurl : 'submitlogin.json',
        ssologinurl : 'ssosubmitlogin.json',
        ssosimulationloginurl :     'ssosimulationsubmitlogin.json'
    },
    landingready : {
        visiturl : 'visit.htm',
        keepALive: 'keepalive.jsp',
        retrieveMeeting: 'retrievemeeting.json',
        videoVisit: 'videoVisit.htm',
        launchMemberProxyMeeting: 'launchMemberProxyMeeting.json',
        launchMeetingForMemberDesktop : 'launchMeetingForMemberDesktop.json',
        dataMemberMeetings : 'memberMeetings.json',
        mobileLaunchVideoVisit : 'mobilelaunchvv.htm'
    },    
    guestglobal : {
        error : 'guesterror.htm',
        expired : 'guestlogout.htm'
    },    
    guest : {
        visiturl : 'visit.htm',
        joinmeeting : 'verifyguest.json',
        keepALive: 'keepalive.jsp',
        retrieveMeeting: 'retrievemeeting.json'
    },    
    guestready : {
        visiturl : 'guestvisit.htm',
        joinmeeting : 'createguestsession.json',
        keepALive: 'keepalive.jsp',
        videoVisitGuest: 'videoVisitPG.htm',
        guestMeeting: 'guestMeeting.json'
    },    
    guestvisit : {
        quitmeeting : 'endguestsession.json',
        logout : 'guestlogout.htm'
    },    
    guestlogout : {
        logoutjson: 'endguestsession.json'
    },    
    visit : {
        quitmeeting : 'quitmeeting.json',
        createSetupWizardMeeting: 'createSetupWizardMeeting.json',
        terminateSetupWizardMeeting : 'terminateSetupWizardMeeting.json',
        logout : 'logout.htm',
        setKPHCConferenceStatus: 'setKPHCConferenceStatus.json',
        providerRunningLateInfo: 'providerRunningLateInfo.json',
        caregiverJoinMeeting: 'caregiverJoinMeeting.json',
        logVendorMeetingEvents : 'logVendorMeetingEvents.json',
        setPeripheralsFlag : 'setPeripheralsFlag.json',
        updateUserContext: 'updateUserContext.json',
        meetingDetails: 'meetingDetails.json',
        joinLeaveMeeting : 'joinLeaveMeeting .json'
    },
    logout : {
        logoutjson: 'logout.json'
    }
}
