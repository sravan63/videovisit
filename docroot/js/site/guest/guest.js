$(document).ready(function() {
    var meetingTimestamp, convertedTimestamp, meetingIdData, hreflocation;
    
 
    
//    detectDeviceCookie();
//    var isWirelessDeviceOrTabletCookie=false;
//    
//    isWirelessDeviceOrTabletCookie = getCookie("isWirelessDeviceOrTablet");
//    
//   if ( isWirelessDeviceOrTabletCookie == "false")
//   {
//       
//   }
//   else
//    {
//        
//        //var url = "http://localhost:8080/videovisitmember/mobilepglanding.htm?meetingCode=" + request.get('meetingCode');
//         var url = getRootUrl(window.location.href) + "/videovisit/mobilepglanding.htm?meetingCode=" + request.get('meetingCode');
//        //alert(url);
//        window.location.href = url; 
//    }
	// Join now Click Event
    $(".btn").click(function(e){
        e.preventDefault();
       
        
        var mtgCode = gup("meetingCode");
        meetingIdData = 'meetingId=' + $(this).attr('meetingid') + 
          '&meetingCode=' + mtgCode +
          '&patientLastName=' + $.trim($("#patient_last_name").val());
        hreflocation = $(this).attr('href');
        //alert(meetingIdData);
        $.ajax({
        	
            type: 'POST',
            data: meetingIdData,
            //url: VIDEO_VISITS.Path.guest.verifyguest,
            url: "verifyguest.json",
            success: function(returndata) {
              returndata = jQuery.parseJSON(returndata);
              if(returndata.result === '1'){
            	
            	$("p.error").css("display", "inline").append('<label>No matching patient found. Please try again.</label><br/>');
                moveToit("p.error");              	
                return false;
              } else if (returndata.result === '2') {  
            	 
            	$("p.error").css("display", "inline").html('<label>You have already joined this video visit from another device. You must first sign off from the other device before attempting to join this visit here.</label><br/>');
                moveToit("p.error");            	
                return false;  
              }
              hreflocation = returndata.result;
              //window.location.replace("visit.htm?iframedata=" + encodeURIComponent(hreflocation));
              window.location.replace("guestready.htm?" + meetingIdData);
            },
            //error receives the XMLHTTPRequest object, a string describing the type of error and an exception object if one exists
            error: function(theRequest, textStatus, errorThrown) {
            	
                window.location.replace(VIDEO_VISITS.Path.global.error);
            }
        });
        return false;
    })

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
    if( p.toLowerCase().indexOf('ipad') != -1 || p.toLowerCase().indexOf('iphone') != -1 || p.toLowerCase().indexOf('ipod') != -1 || p.indexOf('iPhone Simulator') != -1 ){
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