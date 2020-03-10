import React from 'react';
import Axios from 'axios-observable';
import GlobalConfig from './global.config';

var CryptoJS = require("crypto-js");

class UtilityService extends React.Component {

    constructor() {
        super();
        this.browserInfo = {};

        this.validateBrowser = this.validateBrowser.bind(this);
        this.validateBrowser();
    }

    // Validates the browser and saves the browser information.
    validateBrowser() {
        var bObj = {
            isSafari: /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor),
            isFireFox: navigator.userAgent.toLowerCase().indexOf('firefox') > -1,
            isIE: /MSIE|Trident/.test(navigator.userAgent),
            isEdge: /Edge/.test(navigator.userAgent),
            isChrome:/Chrome/.test(navigator.userAgent)
        }
        this.browserInfo = bObj;
    }

    // Returns the browser informaion.
    getBrowserInformation() {
        return this.browserInfo;
    }
    validateBrowserBlock(browserNames){
        let blockChrome = this.isMobileDevice() ? (browserNames.MOBILE_BLOCK_CHROME_BROWSER == 'true') : (browserNames.BLOCK_CHROME_BROWSER == 'true');
        let blockFF = this.isMobileDevice() ? (browserNames.MOBILE_BLOCK_FIREFOX_BROWSER == 'true') : (browserNames.BLOCK_FIREFOX_BROWSER == 'true');
        let blockSafari = this.isMobileDevice() ? (browserNames.MOBILE_BLOCK_SAFARI_BROWSER == 'true') : (browserNames.BLOCK_SAFARI_BROWSER == 'true');
        let blockEdge  = this.isMobileDevice() ? (browserNames.MOBILE_BLOCK_EDGE_BROWSER == 'true') : (browserNames.BLOCK_EDGE_BROWSER == 'true');
        let blockChromeVersion = this.isMobileDevice() ? MOBILE_BLOCK_CHROME_VERSION : browserNames.BLOCK_CHROME_VERSION;
        let blockFirefoxVersion  = this.isMobileDevice() ? MOBILE_BLOCK_FIREFOX_VERSION : browserNames.BLOCK_FIREFOX_VERSION;
        let blockEdgeVersion  = this.isMobileDevice() ? MOBILE_BLOCK_EDGE_VERSION : browserNames.BLOCK_EDGE_VERSION;
        let blockSafariVersion  = this.isMobileDevice() ? MOBILE_BLOCK_SAFARI_VERSION : browserNames.BLOCK_SAFARI_VERSION;
        let isBrowserBlockError = false;
        if (this.getBrowserInformation().isIE) {
            isBrowserBlockError = true;
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
        if (this.getBrowserInformation().isFirefox) {
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
            } else {
                // var majorMinorDot = navigator.userAgent.substring(agent.indexOf('Version/') + 8, agent.lastIndexOf('Safari')).trim();                
                // var versionNumber = parseFloat(majorMinorDot);
                // var nAgt = navigator.userAgent;
                var fullVersion  = ''+parseFloat(navigator.appVersion);
                var majorVersion = parseInt(navigator.appVersion,10);
                var verOffset;
                if ((verOffset=navigator.userAgent.indexOf("Safari"))!=-1) {
                    fullVersion = navigator.userAgent.substring(verOffset+7);
                if ((verOffset=navigator.userAgent.indexOf("Version"))!=-1)
                    fullVersion = navigator.userAgent.substring(verOffset+8);
                }
                majorVersion = parseInt(''+fullVersion,10);
                // Block access from Safari version 12.                
                if (majorVersion <= blockSafariVersion) {
                    isBrowserBlockError = true;
                }
            }
        }
        
        if (this.getBrowserInformation().isEdge) {
            if (blockEdge) {
                isBrowserBlockError = true;
            } else {
                var val = navigator.userAgent.split('Edge/');
                var edge_ver = val[1].slice(0, 2);
                //var edge_ver = Number(window.navigator.userAgent.match(/Edge\/\d+\.(\d+)/)[1], 10);
                if (edge_ver < blockEdgeVersion) {
                    isBrowserBlockError = true;
                }
            }
        }
        return isBrowserBlockError;
    }
    isMobileDevice() {
        var isMobile = false; //initiate as false
        // device detection
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
            isMobile = true;
        }
        return isMobile;
    }

    getAppOS() {
        //First, check for supported iOS devices, iPhone, iPod, and iPad
        var iOS = false,
            p = navigator.platform;

        if (p === 'iPad' || p === 'iPhone' || p === 'iPod' || p === 'iPhone Simulator' || p === 'iPad Simulator') {
            return "iOS";
        }
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
            str = Hour + ':' + Minutes + AMPM + ', ';
        } else {
            let week = String(DateObj).substring(0, 3);
            let monthstr = String(DateObj).substr(4, 6);
            let month = monthstr.replace("0", "");
            str = week + ', ' + month;
        }
        return str;
    }

    formatInMeetingRunningLateTime(runLateMeetingTime) {
        var meetingTime = new Date(parseInt(runLateMeetingTime));
        var minutes = (meetingTime.getMinutes() < 10) ? "0" + meetingTime.getMinutes() : meetingTime.getMinutes();
        var ampmval = (hours > 11) ? 'PM' : 'AM';
        var hours = (meetingTime.getHours() > 11) ? meetingTime.getHours() - 12 : meetingTime.getHours();
        hours = (hours == 0) ? 12 : hours;
        return hours + ':' + minutes + ' ' + ampmval
    }

    encrypt(actual) {
        var ciphertext = CryptoJS.AES.encrypt(actual, '');
        return ciphertext.toString();
    }

    decrypt(encrypted) {
        var bytes = CryptoJS.AES.decrypt(encrypted.toString(), '');
        return bytes.toString(CryptoJS.enc.Utf8);
    }

}
export default new UtilityService();