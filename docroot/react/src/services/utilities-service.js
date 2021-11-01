import React from 'react';
import Axios from 'axios-observable';
import GlobalConfig from './global.config';
import { MessageService } from './message-service.js';

var CryptoJS = require("crypto-js");

class UtilityService extends React.Component {

    constructor() {
        super();
        this.browserInfo = {};
        this.isInApp = false;
        this.showPromotion = false;
        this.minTime = null;
        this.meetingBeginsAt = null;
        this.isECVisit = false;
        this.ecData = null;
        this.surveyTimeout = null;
        this.lang='';
        this.isSafari15_1 = false;
        this.validateBrowser = this.validateBrowser.bind(this);
        this.validateBrowser();
    }

    // Validates the browser and saves the browser information.
    validateBrowser() {
        var bObj = {
            isSafari: /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor),
            isFireFox: navigator.userAgent.toLowerCase().indexOf('firefox') > -1,
            isIE: /MSIE|Trident/.test(navigator.userAgent),
            isEdge: /Edge|Edg/.test(navigator.userAgent),
            isChrome:/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor),
            isAlliPadCheck:  /iPad/.test(navigator.userAgent) 
        }
        this.browserInfo = bObj;
    }

    setSafariBlocked(val){
        this.isSafari15_1 = val;
    }

    getSafariBlocked(){
        return this.isSafari15_1;
    }

    // Returns the browser informaion.
    getBrowserInformation() {
        return this.browserInfo;
    }

    setLang(param){
        this.lang=param;
        MessageService.sendMessage(GlobalConfig.LANGUAGE_CHANGED, null);
    }

    getLang(){
        if(sessionStorage.getItem('Instant-Lang-selection')){
            let lang = sessionStorage.getItem('Instant-Lang-selection');
            let staticData = require('../lang/'+lang+'.json');
            return staticData;
        }
        else {
            let staticData = require('../lang/'+this.lang+'.json');
            return staticData;
        }
    }

    validateBrowserBlock(browserNames){
        let blockChrome = this.isMobileDevice() ? (browserNames.MOBILE_BLOCK_CHROME_BROWSER == 'true') : (browserNames.BLOCK_CHROME_BROWSER == 'true');
        let blockFF = this.isMobileDevice() ? (browserNames.MOBILE_BLOCK_FIREFOX_BROWSER == 'true') : (browserNames.BLOCK_FIREFOX_BROWSER == 'true');
        let blockSafari = this.isMobileDevice() ? (browserNames.MOBILE_BLOCK_SAFARI_BROWSER == 'true') : (browserNames.BLOCK_SAFARI_BROWSER == 'true');
        let blockEdge  = this.isMobileDevice() ? (browserNames.MOBILE_BLOCK_EDGE_BROWSER == 'true') : (browserNames.BLOCK_EDGE_BROWSER == 'true');
        let blockChromeVersion = this.isMobileDevice() ? browserNames.MOBILE_BLOCK_CHROME_VERSION : browserNames.BLOCK_CHROME_VERSION;
        let blockFirefoxVersion  = this.isMobileDevice() ? browserNames.MOBILE_BLOCK_FIREFOX_VERSION : browserNames.BLOCK_FIREFOX_VERSION;
        let blockEdgeVersion  = this.isMobileDevice() ? browserNames.MOBILE_BLOCK_EDGE_VERSION : browserNames.BLOCK_EDGE_VERSION;
        let blockSafariVersion  = this.isMobileDevice() ? browserNames.MOBILE_BLOCK_SAFARI_VERSION : browserNames.BLOCK_SAFARI_VERSION;
        let blockIosChromeVersion = browserNames.BLOCK_CHROME_BROWSER_IOS == 'true';
        let blockIosFFVersion = browserNames.BLOCK_FIREFOX_BROWSER_IOS == 'true';
        let isBrowserBlockError = false;
        if (this.getBrowserInformation().isIE) {
            isBrowserBlockError = true;
            return isBrowserBlockError;
        }
        if (this.getBrowserInformation().isChrome) {
            if (blockChrome) {
                   isBrowserBlockError = true;
            } else {                
                var chrome_ver = Number(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
                if (chrome_ver < blockChromeVersion) {
                   isBrowserBlockError = true;
                }
            }
        }
        if (this.getBrowserInformation().isFireFox) {
            if (blockFF) {
                isBrowserBlockError = true;
            } else {
                var firefox_ver = Number(window.navigator.userAgent.match(/Firefox\/(\d+)\./)[1], 10);
                if (firefox_ver < blockFirefoxVersion) {
                    isBrowserBlockError = true;
                }
            }
        }

        if (this.getBrowserInformation().isSafari) {
            if (blockSafari) {
                isBrowserBlockError = true;
            }
            else if(navigator.platform.toLowerCase() === GlobalConfig.IPHONE.toLowerCase()){
                let ver = this.iOSversion();
                let IOSMobileVersion = ver[0]+'.'+ver[1];
                if(IOSMobileVersion === GlobalConfig.IPHONE_VERSION){
                    isBrowserBlockError = true;
                    this.setSafariBlocked(true);
                }
            }
            else {
                var fullVersion  = ''+parseFloat(navigator.appVersion);
                var majorVersion = parseInt(navigator.appVersion,10);
                var verOffset;
                if ((verOffset=navigator.userAgent.indexOf("Safari"))!=-1) {
                    fullVersion = navigator.userAgent.substring(verOffset+7);
                if ((verOffset=navigator.userAgent.indexOf("Version"))!=-1)
                    fullVersion = navigator.userAgent.substring(verOffset+8);
                }
                majorVersion = parseInt(''+fullVersion,4);
                // Block access from Safari version 12.                
                if (fullVersion.substr(0, 4) < blockSafariVersion) {
                    isBrowserBlockError = true;
                }
            }
        }
        
        if (this.getBrowserInformation().isEdge) {
            if (blockEdge) {
                isBrowserBlockError = true;
            } else {
                var val = navigator.userAgent.split('Edge/');
                var edge_ver = '';
                if(val.length  == 1){
                    edge_ver = Number(window.navigator.userAgent.match(/Edg\/(\d+)\./)[1], 10);                         
                }else{
                    edge_ver = val[1].slice(0, 2); 
                }                
                //var edge_ver = Number(window.navigator.userAgent.match(/Edge\/\d+\.(\d+)/)[1], 10);
                if (edge_ver <= blockEdgeVersion) {
                    isBrowserBlockError = true;
                }
            }
        }
        //Chrome IOS (Mobile)
        if(navigator.userAgent.match('CriOS')){
            if(blockIosChromeVersion){
                isBrowserBlockError = true;
            }
        }
        //Firefox IOS(Mobile)
        if(navigator.userAgent.match('FxiOS')){
            if(blockIosFFVersion){
                isBrowserBlockError = true;
            }
        }
        //Chrome & Firefox (IOS Ipad)
        if(this.isMobileDevice() && this.getAppOS() == 'iOS'){
            let isGetUserMediaSupported = false;
            if (navigator.getUserMedia) {
                isGetUserMediaSupported = true;
            } else if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                isGetUserMediaSupported = true;
            }
            if(!isGetUserMediaSupported){
                isBrowserBlockError = true;
            }
        }
        //Ipad Safari browser check
        if(!this.getBrowserInformation().isIE){
            //Ipad Safari Normal Mode
            if(this.getBrowserInformation().isAlliPadCheck){
                var version;
                var safariVersionMatch = navigator.userAgent.match(/version\/([\d\.]+)/i);
                if(safariVersionMatch) {
                    version = safariVersionMatch[1].slice(0, 4);
                    if (version < browserNames.IPAD_OS_VERSION) {
                        isBrowserBlockError = true;
                    }
                    /*else if(version == GlobalConfig.IPHONE_VERSION){
                        isBrowserBlockError = true;
                    }*/
                }
            }
            //Ipad Safari Desktop Site
            let IpadOS = navigator.userAgent.indexOf("Macintosh") > -1;
            if(IpadOS && this.isMobileDevice()){
                var version;
                var safariVersionMatch = navigator.userAgent.match(/version\/([\d\.]+)/i);
                if(safariVersionMatch) {
                    version = safariVersionMatch[1].slice(0, 4);
                    if (version < browserNames.IPAD_OS_VERSION) {
                        isBrowserBlockError = true;
                    }
                    /*else if(version == GlobalConfig.IPHONE_VERSION){
                        isBrowserBlockError = true;
                    }*/
                }
            }
        }
        return isBrowserBlockError;
    }

    isMobileDevice() {
        var isMobile = false; 
        var iosMobile;
        if (navigator.maxTouchPoints > 1 && this.getAppOS() == 'iOS') {
            iosMobile = true;
        }
        //initiate as false
        // device detection
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || iosMobile ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
            isMobile = true;
        }
        return isMobile;
    }

    hasAllLegalCharacters(value){
    var isLegal = true;
    var illegalChars = ["!", "@", "#", "$", "%", "^", "`", "‘", "&", "*", "(", ")", "{", "}", ":", ";", '"' , "<", ">", ",", ".", "/", "?", "|", "[", "]", "\\", "+", "_", "=", "~", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "¡", "¢", "£", "¤", "¥", "¦", "§", "¨", "©", "ª", "«", "¬", "®", "ˉ", "°", "±", "²", "³", "´", "µ", "¶", "¸", "¹", "º", "»", "¼", "½", "¾", "¿", "÷", "‡", "•", "—", "–", "†", "‰", "€", "…", "ß", '₹', '€', '£', '₽', '§', '@', '”', '“', '„', '»', '«', 'è', 'é', 'ê', 'ë', 'ē', 'ė', 'ę', 'à', 'á', 'â', 'ä', 'æ', 'ã', 'å', 'ā', 'ś', 'š', 'ł', 'ô', 'ö', 'ò', 'ó', 'œ', 'ø', 'ō', 'õ', 'ñ', 'ń', 'ç', 'ć', 'č', 'ž', 'ź', 'ż', 'î', 'ï', 'í', 'ī', 'į', 'ì', 'û', 'ü', 'ù', 'ú', 'ū', 'ÿ', 'À', 'Á', 'Â', 'Ä', 'Æ', 'Ã', 'Å', 'Ā', 'Ś', 'Š', 'Ô', 'Ö', 'Ò', 'Ó', 'Œ', 'Ø', 'Ō', 'Õ', 'Ł', 'Ñ', 'Ń', 'Î', 'Ï', 'Í', 'Ī', 'Į', 'Ì', 'Ÿ', 'È', 'É', 'Ê', 'Ë', 'Ē', 'Ė', 'Ę', 'Ñ', 'Ń', 'Ç', 'Ć', 'Č', 'Ž', 'Ź', 'Ż', 'Û', 'Ü', 'Ù', 'Ú', 'Ū'];
    for(var i=0; i<value.length; i++){
        if(illegalChars.indexOf(value[i]) > -1){
            isLegal = false;
        }
    }
    return isLegal;
    }


    setInAppAccessFlag(flag){
        //this.isInApp = flag;
        sessionStorage.setItem('inApp',flag);
    }

    getInAppAccessFlag(){
        this.isInApp = sessionStorage.getItem('inApp');
        var inAppFlag = (this.isInApp == 'true');
        return inAppFlag;
    }

    getAppOS() {
        //First, check for supported iOS devices, iPhone, iPod, and iPad
        var iOS = false,
            p = navigator.platform;

        if (p === 'iPad' || p === 'iPhone' || p === 'iPod' || p === 'MacIntel' || p === 'iPhone Simulator' || p === 'iPad Simulator') {
            return "iOS";
        }
        if(navigator.userAgent.match(/Android/i)){
        return "Android";
        }
    }

    iOSversion() {
     // supports iOS 2.0 and later
        var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
        return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
    }

    getAndroidVersion(){
        return parseInt(navigator.userAgent.match(/Android\s([0-9\.]*)/i)[1], 10);
    }

    // Returns formatted string based on (capitalize, upper and lower case).
    formatStringTo(str, format) {
        let formatedStr = '';
        switch (format) {
            case GlobalConfig.STRING_FORMAT[0]:
                str = str.split(" ");
                for (var i = 0, x = str.length; i < x; i++) {
                    str[i] = str[i][0].toUpperCase() + str[i].substr(1);
                }
                formatedStr = str.join(" ");
                break;
            case GlobalConfig.STRING_FORMAT[1]:
                formatedStr = str.toUpperCase();
                break;
            case GlobalConfig.STRING_FORMAT[2]:
                formatedStr = str.toLowerCase();
                break;
        }
        return formatedStr;
    }

    formatInMeetingDateAndTime(DateObj, type) {
        let str = '';
        if (type == 'time') {
            let Hour = (DateObj.getHours() > 12 ? parseInt(DateObj.getHours()) - 12 : DateObj.getHours());
            let Minutes = (DateObj.getMinutes() <= 9) ? "0" + DateObj.getMinutes() : DateObj.getMinutes();
            let AMPM = DateObj.getHours() > 11 ? "PM" : "AM";
            Hour = (Hour == 0) ? 12 : Hour;
            switch(this.getLang().lang){
                case "spanish":                                    
                    str = Hour + ':' + Minutes + " " + (DateObj.getHours() > 11 ? 'p. m.' : 'a. m.') + ', ';
                    break;
                case "chinese":
                    str = (DateObj.getHours() > 11 ? '下午' : '上午') + ''+ Hour + ':' + Minutes + ', ';
                    break;
                    default:                    
                    str = Hour + ':' + Minutes + " " + AMPM + ', ';
                        break;        
            }
            
        } else {
            let week = GlobalConfig.WEEK_DAYS[this.getLang().lang][DateObj.getDay()];
            let month = GlobalConfig.MONTHS[this.getLang().lang][DateObj.getMonth()];
            let date = DateObj.getDate() < 10 ? String(DateObj.getDate()).replace("0", "") : DateObj.getDate();
            
            switch(this.getLang().lang){
                case "spanish":                                    
                    str = week + ', ' + date + ' de ' +  month;
                    break;
                case "chinese":
                    str = week + ', ' + month + '' +  date;
                    break;
                    default:                    
                    str = week + ', ' + month + ' ' +  date;
                        break;        
            }
        }
        return str;
    }
    formatDateAndTimeForEmails(DateObj, type,lang) {
        let str = '';
        if (type == 'time') {
            let Hour = (DateObj.getHours() > 12 ? parseInt(DateObj.getHours()) - 12 : DateObj.getHours());
            let Minutes = (DateObj.getMinutes() <= 9) ? "0" + DateObj.getMinutes() : DateObj.getMinutes();
            let AMPM = DateObj.getHours() > 11 ? "PM" : "AM";
            Hour = (Hour == 0) ? 12 : Hour;
            switch(lang){
                case "spanish":
                    str = Hour + ':' + Minutes + " " + (DateObj.getHours() > 11 ? 'p. m.' : 'a. m.');
                    break;
                case "chinese":
                    str = (DateObj.getHours() > 11 ? '下午' : '上午') + ''+ Hour + ':' + Minutes;
                    break;
                default:
                    str = Hour + ':' + Minutes + " " + AMPM;
                    break;
            }

        } else {
            let week = GlobalConfig.WEEK_DAYS[lang][DateObj.getDay()];
            let month = GlobalConfig.MONTHS[lang][DateObj.getMonth()];
            let date = DateObj.getDate() < 10 ? String(DateObj.getDate()).replace("0", "") : DateObj.getDate();

            switch(lang){
                case "spanish":
                    str = week + ', ' + month + ' ' +  date;
                    break;
                case "chinese":
                    str = week + ', ' + month + '' +  date;
                    break;
                default:
                    str = week + ', ' + month + ' ' +  date;
                    break;
            }
        }
        return str;
    }
    formatInMeetingRunningLateTime(runLateMeetingTime) {
        var meetingTime = new Date(parseInt(runLateMeetingTime));
        var minutes = (meetingTime.getMinutes() < 10) ? "0" + meetingTime.getMinutes() : meetingTime.getMinutes();        
        var hours = (meetingTime.getHours() > 11) ? meetingTime.getHours() - 12 : meetingTime.getHours();
        hours = (hours == 0) ? 12 : hours;
        var ampmval = (meetingTime.getHours() > 11) ? 'PM' : 'AM';
        switch(this.getLang().lang){
            case "spanish":                
                return hours + ':' + minutes + " " + (meetingTime.getHours() > 11 ? 'p. m.' : 'a. m.');
                break;
            case "chinese":
                return (meetingTime.getHours() > 11 ? '下午' : '上午') + ''+ hours + ':' + minutes;
                break;
                default:                    
                    return hours + ':' + minutes + " " + ampmval;
                    break;        
        }
    }

    encrypt(actual) {
        var ciphertext = CryptoJS.AES.encrypt(actual, '');
        return ciphertext.toString();
    }

    decrypt(encrypted) {
        var bytes = CryptoJS.AES.decrypt(encrypted.toString(), '');
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    setPromotionFlag(flag){
        this.showPromotion = flag;
    }

    getPromotionFlag(){
        return this.showPromotion;
    }

    setMinTimeToShowUserSurvey(minTime){
        this.minTime = parseInt(minTime);
        sessionStorage.setItem('minInMeetingTimeForSurvey',minTime);
    }

    getMinTimeToShowUserSurvey(){
        return this.minTime ? this.minTime : sessionStorage.getItem('minInMeetingTimeForSurvey') ? parseInt(sessionStorage.getItem('minInMeetingTimeForSurvey')) : 120;
    }

    setMeetingFeedbackTimeout(minFedbackTime){
        this.surveyTimeout = parseInt(minFedbackTime);
        sessionStorage.setItem('meetingFeedbackTimeout',minFedbackTime);
    }

    getMeetingFeedbackTimeout(){
        return this.surveyTimeout ? this.surveyTimeout * 1000 : sessionStorage.getItem('meetingFeedbackTimeout') ? parseInt(sessionStorage.getItem('meetingFeedbackTimeout')) * 1000 : 120000;
    }

    canShowUserSurvey() {
		const minTimeInMeeting = this.getMinTimeToShowUserSurvey();
		const now = new Date().getTime();
		const difference = now - this.meetingBeginsAt;
		const meetingDurationInSecs = Math.floor(difference/1000);
		return meetingDurationInSecs > minTimeInMeeting;
    }
    
    logMeetingStartTime(meetingId){
        if( sessionStorage.getItem('meetingTimeLog') ) {
            const meetingTimeLog = JSON.parse(sessionStorage.getItem('meetingTimeLog'));
            this.meetingBeginsAt = meetingTimeLog[meetingId] ? Number(meetingTimeLog[meetingId]) : new Date().getTime(); 
            if(!meetingTimeLog[meetingId]) {
                meetingTimeLog[meetingId] = Number(this.meetingBeginsAt);
                sessionStorage.setItem('meetingTimeLog', JSON.stringify(meetingTimeLog));
            }
        } else {
            this.meetingBeginsAt = new Date().getTime();
            const meetingTimeLog = {};
            meetingTimeLog[meetingId] = this.meetingBeginsAt;
            sessionStorage.setItem('meetingTimeLog', JSON.stringify(meetingTimeLog));
        }
    }   

    checkForValidMediaDevice(num){
        var Exp = /((^[0-9=+-]+[a-z=+-]+)|(^[a-z=+-]+[0-9=+-]+))+[0-9=+-a-z=+-]+$/i;
        var isValid = Exp.test(num);
        return isValid;
    }

    setECVisitFlag(flag){
        this.isECVisit = flag;
    }

    getECVisitFlag(){
        return this.isECVisit;
    }

    setECVisitDetails(ec){
        this.ecData = ec;
    }

    getECVisitDetails(){
        return this.ecData;
    }

    getVisitDetails(data, type = 'regular'){
        const meetingDetails = {};
        const mData = (type == 'regular') ? data : data.meeting;
        meetingDetails.meetingId = mData.meetingId;
        meetingDetails.meetingTime = mData.meetingTime;
        meetingDetails.roomJoinUrl = mData.roomJoinUrl;
        meetingDetails.meetingVendorId = (type == 'regular') ? mData.meetingVendorId : mData.meetingVMR;
        meetingDetails.vendorGuestPin = (type == 'regular') ? mData.vendorGuestPin : mData.confGuestPin;
        meetingDetails.vendorConfig = (type == 'regular') ? mData.vendorConfig : mData.platformConfig;
        meetingDetails.sipParticipants = mData.sipParticipants;
        meetingDetails.participant = type == 'regular' ? mData.participant : mData.participants;
        meetingDetails.caregiver = type == 'regular' ? mData.caregiver : mData.caregivers;
        const hprop = type == 'regular' ? 'host' : 'caller';
        meetingDetails.host = {};
        ['firstName', 'lastName', 'NUID', 'title', 'facilityName', 'departmentName'].map((prop)=>{
            const cprop = (type == !'regular' && prop == 'NUID') ? 'id' : prop;
            meetingDetails.host[prop] = mData[hprop][cprop];
        });
        meetingDetails.member = {};
        ['firstName', 'lastName', 'inMeetingDisplayName', 'mrn'].map((prop)=>{
            let value = (type == 'regular') ? mData['member'][prop] : data[prop];
            value = (prop == 'inMeetingDisplayName' && type !== 'regular') ? meetingDetails.member['lastName'] + ', ' + meetingDetails.member['firstName'] : value;
            meetingDetails.member[prop] = value;
        });
        if( type !== 'regular' ){
            this.parseInstantGuestName(meetingDetails.caregiver, meetingDetails.member);
        }
        return meetingDetails;
    }

    parseInstantGuestName(guests, member, isInstantGuest=false){
        guests.map((g)=>{
            if( g.lastName == member.lastName && g.firstName == member.firstName ){
                const contact = g.emailAddress ? g.emailAddress : g.phoneNumber;
                member.inMeetingDisplayName = member.inMeetingDisplayName + ', ('+contact+')';
                member.careGiverId = g.careGiverId;
                if(isInstantGuest){
                    member.meetingCode = g.careGiverMeetingHash;
                }
            }
        });
    }

}
export default new UtilityService();
