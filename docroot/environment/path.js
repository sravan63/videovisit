VIDEO_VISITS.Path = {
    global : {
        error : 'error.htm',
        expired : 'logout.htm'
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
        joinmeeting : 'createmegameeting.json',
        keepALive: 'keepalive.jsp',
        retrieveMeeting: 'retrievemeeting.json'
    },
    guest : {
        visiturl : 'visit.htm',
        joinmeeting : 'verifyguest.json',
        keepALive: 'keepalive.jsp',
        retrieveMeeting: 'retrievemeeting.json'
    },
    visit : {
        quitmeeting : 'quitmeeting.json',
        logout : 'logout.htm'
    },
    logout : {
        logoutjson: 'logout.json'
    }
}
