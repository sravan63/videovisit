import React from 'react';
import Axios from 'axios-observable';


class BackendService extends React.Component {

    constructor() {
        super();
        this.state = { basePath: '' };
        if (window.location.origin.indexOf('localhost') > -1) {
            this.state.basePath = "https://localhost.kp.org";
        } else {
            this.state.basePath = '';
        }
    }

    getPreSSO() {
        return Axios.post(this.state.basePath + '/videovisit/ssoPreLogin.json', {});
    }

    getSSOLogin(username, password) {
        return Axios.post(this.state.basePath + '/videovisit/ssoSubmitLogin.json?username=' +
            username + '&password=' + password + '&loginType=sso', {});

    }

    getTempLogin(lastname, mrn, birth_month, birth_year) {
        return Axios.post(this.state.basePath + '/videovisit/submitLogin.json?last_name=' +
            lastname + '&mrn=' + mrn + '&birth_month=' +
            birth_month + '&birth_year=' + birth_year + '&loginType=tempAccess', {});
    }

    getMyMeetings(url, isProxy, headers, loginType) {
        return Axios.post(this.state.basePath + '/videovisit/' + url + '?getProxyMeetings=' + isProxy + '&loginType=' + loginType, {}, { headers: headers });
    }

    launchMemberVisit(url, meetingId, headers, loginType) {
        return Axios.post(this.state.basePath + '/videovisit/' + url + '?meetingId=' + meetingId + '&loginType=' + loginType, {}, { headers: headers });
    }

    getSetupMeeting(url) {
        return Axios.post(this.state.basePath + '/videovisit/' + url);
    }
    getMeetingDetails(url, meetingId) {
        return Axios.post(this.state.basePath + '/videovisit/' + url + '?meetingId=' + meetingId, {}, );
    }
    getRunningLateInfo(url, meetingId) {
        return Axios.post(this.state.basePath + '/videovisit/' + url + '?meetingId=' + meetingId, {}, );
    }
    logVendorMeetingEvents(params) {
        var logType = params[0],
            eventName = (params[1]) ? params[1] : '',
            eventDesc = (params[2]) ? params[2] : '',
            meetingId = (params[3]) ? params[3] : '',
            userType = (params[4]) ? params[4] : '',
            userId = (params[5]) ? params[5] : '',
            eventData = {
                'logType': logType,
                'meetingId': meetingId,
                'userType': userType,
                'userId': userId,
                'eventName': eventName,
                'eventDescription': eventDesc
            };
        Axios.post(this.state.basePath + '/videovisit/' + "logVendorMeetingEvents.json", eventData).subscribe((response) => {
                console.log("success");
            },
            (err) => {
                console.log("Error");
            });
    }
    setConferenceStatus(meetingId, careGiverName,isProxyMeeting) {
        var payloadData = {
            meetingId: meetingId,
            status: "J",
            isProxyMeeting: isProxyMeeting,
            careGiverName: careGiverName
        };
        Axios.post(this.state.basePath + '/videovisit/' + "setKPHCConferenceStatus.json", payloadData).subscribe((response) => {
                console.log("success");
            },
            (err) => {
                console.log("Error");
            });

    }

    quitMeeting(meetingId, memberName,isProxyMeeting) {
        var data = {
            meetingId: meetingId,
            memberName: memberName,
            refreshMeetings: false,
            isProxyMeeting: isProxyMeeting
        };
        return Axios.post(this.state.basePath + '/videovisit/' + "quitmeeting.json", data);
    }

}
export default new BackendService();