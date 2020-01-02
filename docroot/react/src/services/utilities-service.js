import React from 'react';
import Axios from 'axios-observable';


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

    // returns the browser informaion.
    getBrowserInformation(){
    	return this.browserInfo;
    }

}
export default new UtilityService();