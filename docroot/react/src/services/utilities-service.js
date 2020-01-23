import React from 'react';
import Axios from 'axios-observable';
import GlobalConfig from './global.config';

class UtilityService extends React.Component {

    constructor() {
        super();
        this.browserInfo = {};
     	this.validateBrowser = this.validateBrowser.bind(this);
     	this.validateBrowser();
    }

    // Validates the browser and saves the browser information.
    validateBrowser(){
    	var bObj = {
	    	isSafari : /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor),
			isFireFox : navigator.userAgent.toLowerCase().indexOf('firefox') > -1,
			isIE : /MSIE|Trident/.test(navigator.userAgent),
			isEdge : /Edge/.test(navigator.userAgent)
    	}
		this.browserInfo = bObj;
    }

    // Returns the browser informaion.
    getBrowserInformation(){
    	return this.browserInfo;
    }

    // Returns formatted string based on (capitalize, upper and lower case).
    formatStringTo(str, format){
        let formatedStr = '';
        switch(format){
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

}
export default new UtilityService();