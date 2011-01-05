// dateExtensions_loader.js

// ========================

// Loads date prototype extension functions, and adds some custom parsing / formatting

// functions.



// DEPENDENCIES & PLUGIN

// This is from dateExtensions.js

Date.dayNames=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];Date.abbrDayNames=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];Date.monthNames=['January','February','March','April','May','June','July','August','September','October','November','December'];Date.abbrMonthNames=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];Date.firstDayOfWeek=7;Date.format='mm/dd/yyyy';Date.fullYearStart='20';(function(){function add(name,method){if(!Date.prototype[name]){Date.prototype[name]=method;}};add("isLeapYear",function(){var y=this.getFullYear();return(y%4==0&&y%100!=0)||y%400==0;});add("isWeekend",function(){return this.getDay()==0||this.getDay()==6;});add("isWeekDay",function(){return!this.isWeekend();});add("getDaysInMonth",function(){return[31,(this.isLeapYear()?29:28),31,30,31,30,31,31,30,31,30,31][this.getMonth()];});add("getDayName",function(abbreviated){return abbreviated?Date.abbrDayNames[this.getDay()]:Date.dayNames[this.getDay()];});add("getMonthName",function(abbreviated){return abbreviated?Date.abbrMonthNames[this.getMonth()]:Date.monthNames[this.getMonth()];});add("getDayOfYear",function(){var tmpdtm=new Date("1/1/"+this.getFullYear());return Math.floor((this.getTime()-tmpdtm.getTime())/86400000);});add("getWeekOfYear",function(){return Math.ceil(this.getDayOfYear()/7);});add("setDayOfYear",function(day){this.setMonth(0);this.setDate(day);return this;});add("addYears",function(num){this.setFullYear(this.getFullYear()+num);return this;});add("addMonths",function(num){var tmpdtm=this.getDate();this.setMonth(this.getMonth()+num);if(tmpdtm>this.getDate())
this.addDays(-this.getDate());return this;});add("addDays",function(num){this.setDate(this.getDate()+num);return this;});add("addHours",function(num){this.setHours(this.getHours()+num);return this;});add("addMinutes",function(num){this.setMinutes(this.getMinutes()+num);return this;});add("addSeconds",function(num){this.setSeconds(this.getSeconds()+num);return this;});add("zeroTime",function(){this.setMilliseconds(0);this.setSeconds(0);this.setMinutes(0);this.setHours(0);return this;});add("asString",function(format){var r=format||Date.format;return r.split('yyyy').join(this.getFullYear()).split('yy').join((this.getFullYear()+'').substring(2)).split('mmmm').join(this.getMonthName(false)).split('mmm').join(this.getMonthName(true)).split('mm').join(_zeroPad(this.getMonth()+1)).split('dd').join(_zeroPad(this.getDate()));});Date.fromString=function(s)
{var f=Date.format;var d=new Date('01/01/1977');s=s.replace(/^(\d)(\D)/,'0$1$2');s=s.replace(/(\D)(\d)(\D)/,'$10$2$3');s=s.replace(/(\D)(\d)$/,'$10$2');var mLength=0;var iM=f.indexOf('mmmm');if(iM>-1){for(var i=0;i<Date.monthNames.length;i++){var mStr=s.substr(iM,Date.monthNames[i].length);if(Date.monthNames[i]==mStr){mLength=Date.monthNames[i].length-4;break;}}
d.setMonth(i);}else{iM=f.indexOf('mmm');if(iM>-1){var mStr=s.substr(iM,3);for(var i=0;i<Date.abbrMonthNames.length;i++){if(Date.abbrMonthNames[i]==mStr)break;}
d.setMonth(i);}else{d.setMonth(Number(s.substr(f.indexOf('mm'),2))-1);}}
var iY=f.indexOf('yyyy');if(iY>-1){if(iM<iY)
{iY+=mLength;}
d.setFullYear(Number(s.substr(iY,4)));}else{if(iM<iY)
{iY+=mLength;}
d.setFullYear(Number(Date.fullYearStart+s.substr(f.indexOf('yy'),2)));}
var iD=f.indexOf('dd');if(iM<iD)
{iD+=mLength;}
d.setDate(Number(s.substr(iD,2)));if(isNaN(d.getTime())){return false;}
return d;};var _zeroPad=function(num){var s='0'+num;return s.substring(s.length-2)};})();








// Set dates to mm-dd-yyyy format

Date.format = 'mm-dd-yyyy';
Date.format = 'yyyy-mm-dd';







// Converts this date to a KWC display date - shows the date in mm-dd-yyyy format

// if it's more than a day old, otherwise shows the time as a hh:mm am/pm string.

Date.prototype.asKwcDisplayDate = function() {

    

    // If this date is today...

    var result;

    if ( this.asString() == new Date().asString() ) {

        

        // Determine 12-hour time and am/pm value

        var hour24 = this.getHours();

        var amPm, hour12;

        

        if ( hour24 == 0 ) {

            amPm = 'am';

            hour12 = 12;

        }

        if ( ( hour24 >= 1 ) && ( hour24 <= 11 ) ) {

            amPm = 'am';

            hour12 = hour24;

        }

        if ( hour24 == 12 ) {

            amPm = 'pm';

            hour12 = 12;

        }

        if ( hour24 >= 13 ) {

            amPm = 'pm';

            hour12 = hour24 - 12;

        }

        if (hour12 < 10) {
			hour12 = '0' + hour12;
        }


		// Determine minutes.
		var minutes = this.getMinutes();
		if (minutes < 10) {
			minutes = '0' + minutes
		}
		

        // Return date as a time

        result = hour12 + ':' + minutes + ' ' + amPm;

    }

    

    // Otherwise, if date isn't today...

    else {

    

        // Display it as a date

        result = this.asString( 'mm-dd-yyyy' );

    }

    

    // Return the result

    return result;

    

}; // end Date.prototype.asKwcDisplayDate()







// Converts the given Kaiser WebCare format date-string into a date object, 

// and returns it. 

Date.fromKwcDateTime = function( dateTimeString , format) {

    if (dateTimeString == '' || dateTimeString == '&nbsp;')
			return dateTimeString; 

    // Split the date into parts

    var DATE_PATTERN = /(\d{1,2})-(\d{1,2})-(\d{4}) (\d{1,2}):(\d{2}) ?(am|pm)/i;

    var parts = DATE_PATTERN.exec( dateTimeString );

    

    // Set up each part, adjusting as necessary for JS formats 

    var year = parts[ 3 ];

    var month = parts[ 1 ] - 1;

    var day = parts[ 2 ];

    var amPm = parts[ 6 ].toLowerCase();

    var hour12 = parts[ 4 ];

    var hour24 = parseInt( hour12 );

    if ( ( amPm == 'am' ) && ( hour24 == 12 ) ) {

        hour24 = 0;

    }

    if ( ( amPm == 'pm' ) && ( hour24 < 12 ) ) {

        hour24 += 12;

    }

    var minute = parts[ 5 ];

    

    // Create a date using these values

    var result = new Date( 

        year, 

        month,

        day,

        hour24, 

        minute

    );
		if (format)
			return result.asString( format );
		else
			return result.asString( 'mm-dd-yyyy' );
        

    // Return the result

    //return result;

    

}; // end Date.fromKwcDateTime()

function convertTimestampToDate(timestamp, format)
{
	var DateObj = new Date(parseFloat(timestamp));
	//var d = DateObj.toLocaleString(); 
	//10-01-2010 10:23 AM
	//10-11-2010 20:19
	Hour = (DateObj.getHours() > 12 ? parseInt(DateObj.getHours()) - 12 : DateObj.getHours());
	if (Hour == 0) {
		Hour = 12;
	}

	Minute = DateObj.getMinutes();
	AMPM = (DateObj.getHours() > 11 ? "PM" : "AM");
	Month = DateObj.getMonth() + 1;
	DateNum = DateObj.getDate();
	Year = DateObj.getFullYear();
	Day = DateObj.getDay();
	
	DayName = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
	monthNames=['January','February','March','April','May','June','July','August','September','October','November','December'];
	
	newDateFormat = display2Digit(Month) + "-" + display2Digit(DateNum) + "-" + Year + " " + display2Digit(Hour) + ":" + display2Digit(Minute) + " " + AMPM;
	
	switch(format) {
	case 'date_only':
		return display2Digit(Month) + "-" + display2Digit(DateNum) + "-" + Year;
		break;
	case 'month':
		return display2Digit(Month);
		break;
	case 'year':
		return display2Digit(Year);
		break;
	case 'time_only':
		return display2Digit(Hour) + ":" + display2Digit(Minute) + " " + AMPM;
		break;
	case 'hours_min':
		return 	display2Digit(Hour) + (Hour?" hrs " : "") + display2Digit(Minute) + (Minute?" min" : "");
		break;
	case 'day_month_date_year':
		return 	DayName[Day] + ", " + monthNames[Month-1] + " " + display2Digit(DateNum) + ", " + Year;
		break;
	case 'mm_dd_yyyy':
		return 	display2Digit(Month) + "-" + display2Digit(DateNum) + "-" + Year;
		break;
	case 'full_date':
		return 	newDateFormat;
		break;
	case 'json_submit':
		return Year + "-" + display2Digit(Month) + "-" + display2Digit(DateNum) + " 00:00:00";
	case 'date_diff':
		
		diff = ((timestamp - (new Date()).getTime()) / 1000);
		
		if (diff > 0)
		{
			var days = Math.floor(diff / 86400); 
			var hours = Math.floor((diff - (days * 86400)) / 3600); 
			var minutes = Math.floor((diff - ((hours * 3600) + (days * 86400))) / 60);
			
			return (days ? display2Digit(days) + " day" : '')  + " " + (hours ? display2Digit(hours) + " hrs" : '') + " " + (minutes ? display2Digit(minutes) + " min" : '');
		}		
		return '';		
		
		
		
	default:
		return newDateFormat;
		break;			
	}
	
	
}
function formatDateFromDatePicker(dtPickerDate, format)
{
   var DateObj = new Date(dtPickerDate);
	 return convertTimestampToDate(DateObj.getTime(),format);
}
function convertDateIntoTimestamp(dateVal)
{
	dateVal = dateVal.replace("-", "/");
	dateVal = dateVal.replace("-", "/");
	dateVal = dateVal.replace("-", "/");
	dateVal = dateVal.replace("-", "/");
	
	var DateObj = new Date(dateVal);
	return DateObj.getTime();
}
function getDateDiff(timestamp)
{
	
}
function displayHours(hours)
{
	hours = parseInt(hours);
	hours = (hours > 12 ? (hours - 12) : hours);
	return display2Digit(hours);
}
function display2Digit(number)
{
	number = parseInt(number);
	if (number <=9)
		return "0" + number;
	return number;
}