$(document).ready(function() {
    var meetingTimestamp, convertedTimestamp, meetingIdData, hreflocation;
    
  //Disable the Login button unless all the fields are entered
	$(":input").on('keyup', function(){
        if($('#last_name').val() != ""){
        	$('#joinNowBtn').removeAttr('disabled');
            $('#joinNowBtn').css('cursor', 'pointer');
            $('input#joinNowBtn').css('opacity', '1.0');
        }
        else{
        	$('#joinNowBtn').attr('disabled', true);
            $('#joinNowBtn').css('cursor', 'default');
            $('input#joinNowBtn').css('opacity', '0.5');
        }
    });
	
	$("form :input").focus(function() {
		// clear all errors
		clearAllErrors();
	});
	
	// for focus on individual Input Fields
	$("#last_name").on('focus', function() {
		$("#last_name").css("color", "#000000");
	});
	
	// Join now Click Event
    $(".btn").click(function(e){
    	e.preventDefault();
    	
    	// if client side validation successful
		if(isLoginValidationSuccess()){
			loginSubmit();
		}
    });
    
    function isLoginValidationSuccess(){
    	var validationObj =
    		{
    			"last_name" : [
    				{
    					"METHOD_NAME" : METHODNAME_IS_LASTNAME_VALIDATION,
    					"PARAM_VALUE" : $("#last_name").val(),
                        "PARAM_MIN_VALUE" :2,
    					"ERROR_MESSAGE" : "Only Letters, Hyphens or Apostrophes allowed.",
    					"ERROR_ID" : "lastNameErrorId",
                        "INPUT_ELEMENT" : "last_name",
    					"HIGHLIGHT_PARENT_WHEN_ERROR": false
    				}
    			]
    		}
    	var  isValid = validate(validationObj);
    	return isValid;
    }
    
    function loginSubmit(){
        
        var currentTime = new Date();
	    var n = currentTime.getTime();
	    
        var mtgCode = gup("meetingCode");
        meetingIdData = 'meetingId=' + $.trim($("#meetingId").val()) + 
          '&meetingCode=' + mtgCode +
          '&patientLastName=' + $.trim($("#last_name").val()) + 
          '&nocache=' + n;
        
        hreflocation = $.trim($("#mmMeetingName").val());
        
        $.ajax({
            type: 'POST',
            data: meetingIdData,
            //url: VIDEO_VISITS.Path.guest.verifyguest,
            url: "verifyguest.json",
            success: function(returndata) {
            	try{
		            returndata = jQuery.parseJSON(returndata);
		            
		            console.log("response",returndata.status.code);
		           
		              
		            var errorHtml = "";
		              
		            if(returndata.status.code === '500'){
		            	errorHtml = '<label>No matching patient found. Please try again.</label><br/>';
		            	$("p#globalError").css("display", "inline").html(errorHtml);
		            	moveToit("p.error");              	
		            	return false;
		            } 
		            else if (returndata.status.code === '510') {  
		            	$("#layover").hide();
		            	errorHtml = '<label>The video visit you are trying to join is no longer available. The clinician has ended this visit.</label><br/>'; 
		            	$("p#globalError").css("display", "inline").html(errorHtml);
		            	moveToit("p.error");            	
		            	return false;  
		            }
		            else if (returndata.status.code === '900') {  
		            	$("#layover").hide();
		            	errorHtml = '<label>Some exception occurred while processing request.</label><br/>'; 
		            	$("p#globalError").css("display", "inline").html(errorHtml);
		            	moveToit("p.error");            	
		            	return false;  
		            }
		            else if (returndata.status.code === '400') { 
		            	$("#layover").hide();
		            	errorHtml = '<label>You have already joined this video visit from another device. You must first sign off from the other device before attempting to join this visit here.</label><br/>'; 
		            	$("p#globalError").css("display", "inline").html(errorHtml);
		            	moveToit("p.error");            	
		            	return false;  
		            }
		              
		            hreflocation = returndata.result;
		            window.location.replace("guestready.htm");
            	}
	            catch(e)
	            {
	            	window.location.replace(VIDEO_VISITS.Path.guestglobal.expired);
	            }
            },
            //error receives the XMLHTTPRequest object, a string describing the type of error and an exception object if one exists
            error: function(theRequest, textStatus, errorThrown) {
            	window.location.replace(VIDEO_VISITS.Path.guestglobal.expired);
            }
        });
        return false;
    }

    //Get the meeting timestamp, convert it and display it. Grabs the text contents of the element with the timestamp class,
    //converts it to the correct timestamp and then appends it to the next h3 in the code
    $('.timestamp').each(function(){
        meetingTimestamp = $(this).text();
        var tz = $("#tz").val();
        convertedTimestamp = convertTimestampToDate(meetingTimestamp, 'time_only') + ' ' + tz;

        $(this).next('h3').append(convertedTimestamp);
    })
});

/*
 * This method sets the isWirelessDeviceOrTablet cookie based on the device detected
 */
function detectDeviceCookie(){
	var appOS = getAppOS();
	
	// Check if cookie already set
	var isWirelessDeviceOrTabletCookie=getCookie("isWirelessDeviceOrTablet");
	
	if(typeof isWirelessDeviceOrTabletCookie != undefined && isWirelessDeviceOrTabletCookie !=null && isWirelessDeviceOrTabletCookie != ""){
		
		return;
	}
	
	if(appOS === 'iOS' || appOS === 'Android'){
		
		setCookie("isWirelessDeviceOrTablet", "true")
	}
	else{
		// for desktop
		setCookie("isWirelessDeviceOrTablet", "false")
	}
}

/*
 * Function used to detect the device.
 * We need to add code to detect devices which needs to be supported here
 */
function getAppOS(){
    //First, check for supported iOS devices, iPhone, iPod, and iPad
    var iOS = false,
    p = navigator.platform;
   // alert(p);
    if( p.toLowerCase().indexOf('ipad') != -1 || p.toLowerCase().indexOf('iphone') != -1 || p.toLowerCase().indexOf('MacIntel') != -1 || p.toLowerCase().indexOf('ipod') != -1 || p.indexOf('iPhone Simulator') != -1 ){
        return "iOS";
    }
    
    //next, check if this is a supported AIR 3.1 Android device http://kb2.adobe.com/cps/923/cpsid_92359.html
    //Updated (3/5/2012) Advertize only to Android 2.2, 2.3, 3.0, 3.1 and 3.2 devices.
    //Updated (8/29/2012) Added Android 4.0 to the list of supported operating systems. 
    if (navigator.userAgent.match(/Android 2.2/i) || navigator.userAgent.match(/Android 2.3/i) || 
    navigator.userAgent.match(/Android 3.0/i) || navigator.userAgent.match(/Android 3.1/i) || 
    navigator.userAgent.match(/Android 3.2/i) || navigator.userAgent.match(/Android 4.0/i) ||
    navigator.userAgent.match(/Android 4.1/i) || navigator.userAgent.match(/Android 4.2/i)){
           return "Android";
    }
    
    //No supported app platform found.
    return "desktop";
}

// Get the cookie value
function getCookie(c_name){
	var i,x,y,arrCookies=document.cookie.split(";");
	for (i=0;i<arrCookies.length;i++)
	{
		x=arrCookies[i].substr(0,arrCookies[i].indexOf("="));
		y=arrCookies[i].substr(arrCookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+$/g,"");
		if (x==c_name){
			return unescape(y);
		}
	}
}

function getRootUrl(url) {
  return url.toString().replace(/^(.*\/\/[^\/?#]*).*$/,"$1");
}


/**
 * This method is used to set the cookie value
 * @param c_name
 * @param value
 * @param exdays
 */
function setCookie(c_name,value){
	var exdate=new Date();
	var time = exdate.getTime();
	// expiry set to 20 years
	var addTime = 60*60*24*365*20*1000;
	
	exdate.setTime(time + addTime);
	
	//exdate.setDate(exdate.getDate() + days);
	var c_value=escape(value) +  ";expires="+exdate.toUTCString();
	
	document.cookie=c_name + "=" + c_value;
}

var request = {
   		 get: function(parameter)
   		 {
   		    var tmp = this.parameters()[parameter];
   		    return tmp;
   		 },
   		 parameters: function()
   		 {
   		    var result = {};
   		    var url = window.location.href;
   		    var parameters = url.slice(url.indexOf('?') + 1).split('&');
   		 
   		    for (var i = 0; i < parameters.length; i++)
   		    {
   		       var parameter = parameters[i].split('=');
   		       result[parameter[0]] = parameter[1];
   		    }
   		 return result;
   		 }
   	};
