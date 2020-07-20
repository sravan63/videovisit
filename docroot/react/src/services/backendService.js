import React from 'react';
import Axios from 'axios-observable';
import $ from 'jquery';
import * as WebUI from '../pexip/complex/webui.js';


class BackendService extends React.Component {

    constructor() {
        super();
        this.state = { basePath: '' };
        if (window.location.origin.indexOf('localhost') > -1) {
            this.state.basePath = "http://localhost:8080";
        } else {
            this.state.basePath = '';
        }
    }

    getPreSSO() {
        return Axios.post(this.state.basePath + '/videovisit/ssoPreLogin.json', {});
    }

    logout(headers, loginType) {
        return Axios.post(this.state.basePath + '/videovisit/logout.json?loginType=' + loginType, {}, { headers: headers });
    }

    isMeetingValidGuest(meetingCode) {
        return Axios.post(this.state.basePath + '/videovisit/isMeetingHashValid.json?meetingCode=' + meetingCode + '&loginType=guest', {});
    }

    guestLogin(meetingCode, patientLastName,headers) {
        return Axios.post(this.state.basePath + '/videovisit/guestLoginJoinMeeting.json?meetingCode=' + meetingCode + '&patientLastName=' + patientLastName + '&loginType=guest', {}, { headers: headers });
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

    launchMemberVisit(url, meetingId, headers, loginType, isFromMobile) {
        return Axios.post(this.state.basePath + '/videovisit/' + url + '?meetingId=' + meetingId + '&loginType=' + loginType + '&isFromMobile=' + isFromMobile, {}, { headers: headers });
    }

    getSetupMeeting(url) {
        return Axios.post(this.state.basePath + '/videovisit/' + url);
    }
    getMeetingDetails(url, meetingId, loginType) {
        return Axios.post(this.state.basePath + '/videovisit/' + url + '?meetingId=' + meetingId + '&loginType=' + loginType, {}, );
    }
    getRunningLateInfo(url, meetingId, loginType) {
        return Axios.post(this.state.basePath + '/videovisit/' + url + '?meetingId=' + meetingId + '&loginType=' + loginType, {}, );
    }
    getBrowserBlockDetails(url,propertyName){
        return Axios.post(this.state.basePath + '/videovisit/' + url + '?propertyName=' + propertyName);
    }
    logVendorMeetingEvents(params) {
        var loginType,
            sessionInfo = JSON.parse(localStorage.getItem('sessionInfo'));
        if (sessionInfo != null) {
            loginType = sessionInfo.loginType;
        }
        else{
            loginType="guest";
        }
        var logType = params[0],
            meetingId = (params[3]) ? params[3] : '',
            userType = (params[4]) ? params[4] : '',
            userId =  (params[5]) ? params[5] : '',
            eventName = (params[1]) ? params[1] : '',
            eventDescription =  (params[2]) ? params[2] : ''
        
        Axios.post(this.state.basePath + '/videovisit/' + 'logVendorMeetingEvents.json' + '?loginType=' + loginType + '&logType=' + logType + '&meetingId=' + meetingId+ '&userType=' + userType + '&userId=' + userId + '&eventName=' + eventName + '&eventDescription=' + eventDescription,{}).subscribe((response) => {
                console.log("success");
            },
            (err) => {
                console.log("Error");
            });
    }
    setConferenceStatus(meetingId, careGiverName, isProxyMeeting) {
        var loginType,
            sessionInfo = JSON.parse(localStorage.getItem('sessionInfo'));
        if (sessionInfo != null) {
            loginType = sessionInfo.loginType;
        }
        let headers = {
            "careGiverName": careGiverName
        };
        Axios.post(this.state.basePath + '/videovisit/' + 'setKPHCConferenceStatus.json' + '?loginType=' + loginType + '&meetingId=' + meetingId + '&status=J' + '&isProxyMeeting=' + isProxyMeeting, {}, { headers: headers }).subscribe((response) => {
                console.log("success");
            },
            (err) => {
                console.log("Error");
            });

    }
    CaregiverJoinMeeting(meetingId,meetingCode){
        Axios.post(this.state.basePath + '/videovisit/' + 'caregiverJoinMeeting.json' + '?loginType=guest' + '&meetingId=' + meetingId + '&status=J' + '&meetingHash=' + meetingCode, {}).subscribe((response) => {
                console.log("success");
            },
            (err) => {
                console.log("Error");
            });

    }

    keepAliveCookie(url){
         //Axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';
         //Axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
        /*let headers = {
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Credentials':true,
            'Content-Type': 'application/json',
            crossorigin:true
        };

        Axios.get(url, {}, { headers: headers }).subscribe((response) => {
            console.log("success");
            },
            (err) => {
            console.log("Error");
        });*/
        $.ajax({
                url: url,
                type: 'GET',
                dataType: 'jsonp',
                cache: false,
                async: true,
                crossDomain:true,
                success: function(keepAliveData){               
                },
                error: function() {             
                }
            });

    }

    sendUserJoinLeaveStatus(meetingId,isPatient,joinLeaveMeeting,inMeetingDisplayName,loginType){
        let headers = {
            "inMeetingDisplayName": inMeetingDisplayName
        };
        return Axios.post(this.state.basePath + '/videovisit/' + 'joinLeaveReactMeeting.json' + '?loginType=' + loginType + '&meetingId=' + meetingId + '&isPatient=' + isPatient + '&joinLeaveMeeting=' + joinLeaveMeeting, {},{ headers: headers });
    }

    guestLogout(meetingCode,headers,isFromBackButton){
      return  Axios.post(this.state.basePath + '/videovisit/' + 'endGuestSession.json' + '?loginType=guest' +  '&meetingCode=' + meetingCode + '&isFromBackButton=' + isFromBackButton, {}, { headers: headers });
    }

    quitMeeting(meetingId, isProxyMeeting, headers, loginType, isFromBackButton) {

        return Axios.post(this.state.basePath + '/videovisit/' + 'quitMeeting.json' + '?loginType=' + loginType + '&meetingId=' + meetingId + '&isProxyMeeting=' + isProxyMeeting + '&isFromBackButton=' + isFromBackButton, {}, { headers: headers });
    }

    storeMediaStats(meetingId, meetingVmr, participantName, callUUID) {
        if(sessionStorage.getItem('UUID')) {
             callUUID = sessionStorage.getItem('UUID');
        }
        var mediaData = WebUI.getMediaStatsData();
        Axios.post(this.state.basePath + '/videovisit/' + 'insertVendorMeetingMediaCDR.json' + '?meetingId=' + meetingId + '&meetingVmr=' + meetingVmr + '&participantName=' + participantName + '&callUUID=' + callUUID, mediaData).subscribe((response) => {
                console.log("success",response);
            },
            (err) => {
                console.log("Error",err);
            });
    }

}
export default new BackendService();