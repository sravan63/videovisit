import React from 'react';
import Axios from 'axios-observable';
import $ from 'jquery';
import * as WebUI from '../pexip/complex/webui.js';
import GlobalConfig from './global.config.js';


class BackendService extends React.Component {

    constructor() {
        super();
        this.state = { basePath: '' };
        if (window.location.origin.indexOf('localhost') > -1) {
            this.state.basePath = "http://localhost:8080";
        } else {
            this.state.basePath = '';
        }
        this.counter = 0;
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

    guestLogin(meetingCode, patientLastName,authTokenValue) {
        let headers = {
            authToken: authTokenValue,
            patientLastName:patientLastName
        };
        return Axios.post(this.state.basePath + '/videovisit/guestLoginJoinMeeting.json?meetingCode=' + meetingCode + '&loginType=guest', {}, { headers: headers });
    }

    getSSOLogin(username, password) {
        let headers = {
            username:username,
            password: password
        }
        return Axios.post(this.state.basePath + '/videovisit/ssoSubmitLogin.json?loginType=sso', {}, { headers: headers });

    }

    getTempLogin(lastname, mrn, birth_month, birth_year) {
        let headers = {
            last_name:  lastname,
            mrn:mrn,
            birth_month:birth_month,
            birth_year:birth_year
        };
        return Axios.post(this.state.basePath + '/videovisit/submitLogin.json?loginType=tempAccess', {}, { headers: headers });

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
    getMeetingDetails(url, meetingId, loginType, isFromMobile) {
        if( loginType == GlobalConfig.LOGIN_TYPE.EC ){
            const headers = { meetingId: meetingId };
            return Axios.post(this.state.basePath + '/videovisit/' + url + '?loginType=' + loginType + '&isFromMobile=' + isFromMobile, {}, { headers: headers} );
        } else {
            return Axios.post(this.state.basePath + '/videovisit/' + url + '?meetingId=' + meetingId + '&loginType=' + loginType, {} );
        }
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
        let headers = {
            logType:  params[0],
            meetingId : (params[3]) ? params[3] : '',
            userType : (params[4]) ? params[4] : '',
            userId :  (params[5]) ? params[5] : '',
            eventName : (params[1]) ? params[1] : '',
            eventDescription :  (params[2]) ? params[2] : ''
        };
        
        Axios.post(this.state.basePath + '/videovisit/' + 'logVendorMeetingEvents.json' + '?loginType=' + loginType,{},{ headers: headers }).subscribe((response) => {
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
    launchMeetingForInstantMember(data, isEC=false) {
        let headers;
        const url = isEC ? 'updateGuestParticipant.json' : 'launchMeetingForInstantMember.json';
        let params = '';
        if( isEC ){
            headers = {
                meetingId : data.meetingId,
                joinLeaveStatus : 'J',
                firstName : data.firstName,
                lastName : data.lastName,
                careGiverId : data.careGiverId
            }
            params = '?loginType=ec_instant_join' + '&isFromMobile=' + data.isFromMobile;
        } else {
            headers = {
                megaMeetingDisplayName: data.displayName,
                isProxyMeeting: data.isProxyMeeting,
                mrn: data.mrn,
                "Content-Type": "application/json"
            };
            params = '?loginType=instant_join' + '&meetingId=' + data.meetingId + '&isFromMobile=' + data.isFromMobile;
        }
        Axios.post(this.state.basePath + '/videovisit/' + url + params, {}, { headers: headers }).subscribe((response) => {
                console.log("Patient joined from Instant join");
            },
            (err) => {
                console.log("Error-launchMeetingForInstantMember");
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

    guestLogout(meetingCode,headers,isFromBackButton,isInstantPG){
        const url = isInstantPG ? 'endInstantGuestSession.json' : 'endGuestSession.json';
        return  Axios.post(this.state.basePath + '/videovisit/' + url + '?loginType=guest' +  '&meetingCode=' + meetingCode + '&isFromBackButton=' + isFromBackButton, {}, { headers: headers });
    }

    quitMeeting(meetingId, isProxyMeeting, headers, loginType, isFromBackButton, isFromMobile ) {
        const isEC = loginType == GlobalConfig.LOGIN_TYPE.EC;
        const url = isEC ? 'updateGuestParticipant.json' : 'quitMeeting.json';
        let params = '';
        if(isEC){
            params = "?loginType=" + loginType + "&isFromMobile="+isFromMobile;
        } else {
            params = '?loginType=' + loginType + '&meetingId=' + meetingId + '&isProxyMeeting=' + isProxyMeeting + '&isFromBackButton=' + isFromBackButton;
        }
        return Axios.post(this.state.basePath + '/videovisit/' + url + params, {}, { headers: headers });
    }

    storeMediaStats(meetingId, meetingVmr, participantName, callUUID) {
        if(sessionStorage.getItem('UUID')) {
             callUUID = sessionStorage.getItem('UUID');
        }
        let headers = {
            meetingId: meetingId,
            meetingVmr:meetingVmr,
            participantName:participantName,
            callUUID:callUUID
        };
        var mediaData = WebUI.getMediaStatsData();
        console.log("Calling insertVendorMeetingMediaCDR: " + "Time: " + new Date() + " Count: " + ++this.counter);
        Axios.post(this.state.basePath + '/videovisit/' + 'insertVendorMeetingMediaCDR.json', mediaData,{ headers: headers }).subscribe((response) => {
                console.log("success",response);
            },
            (err) => {
                console.log("Error",err);
            });
    }

    validateInstantJoin(isFromMobile,data,isInstantJoin=true){
        let headers ={
            authtoken:data
        };
        let loginType = isInstantJoin ? 'instant_join' : 'ec_instant_join';
        let path = isInstantJoin ? 'authorizeVVCode.json' : 'authorizeECCode.json';
        return Axios.post(this.state.basePath + '/videovisit/' + path + '?loginType='+ loginType + '&isFromMobile=' + isFromMobile, {},{ headers: headers });
        
    }

    getSurveyDetails(meetingId, userType, userValue) {
        let headers = {
            meetingId:meetingId,
            userType:userType,
            userValue:userValue
        };
        return Axios.post(this.state.basePath + '/videovisit/' + 'getSurveyQuestions.json', {},{ headers: headers });
    }

    submitSurvey(survey) {
        return Axios.post(this.state.basePath + '/videovisit/' + 'submitSurvey.json', survey);
    }

}
export default new BackendService();
