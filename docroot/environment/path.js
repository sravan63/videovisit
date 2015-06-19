VIDEO_VISITS.Path = {
    global : {
        error : 'error.htm',
        expired : 'logout.htm',
        guestexpired : 'guestlogout.htm',
        videovisitReady:'videoVisitReady.htm',
        videovisitGuestReady:'videoVisitGuestReady.htm'
    },
    grid : {
        home : {
            test : 'data/home/test.json'
        }
    },
    login : {
        ajaxurl : 'submitlogin.json'
    },
    landingready : {
        visiturl : 'visit.htm',
        joinmeeting : 'createmeeting.json',
        keepALive: 'keepalive.jsp',
        retrieveMeeting: 'retrievemeeting.json',
        userPresentInMeeting: 'userPresentInMeeting.json',
        videoVisit: 'videoVisit.htm'
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
        videoVisitGuest: 'videoVisitPG.htm'
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
        logout : 'logout.htm'
    },
    logout : {
        logoutjson: 'logout.json'
    }
}
