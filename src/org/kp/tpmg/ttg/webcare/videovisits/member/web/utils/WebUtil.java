package org.kp.tpmg.ttg.webcare.videovisits.member.web.utils;

import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;
import java.util.regex.Pattern;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.service.WebService;

public class WebUtil {

	public static Logger logger = Logger.getLogger(WebUtil.class);
	private static Pattern DOB_PATTERN = Pattern.compile("\\d\\d\\d\\d-\\d[\\d]-\\d[\\d]");
	
	public static String getCurrentDateTimeZone()
	{
		logger.info("in getCurrentDateTimeZone");
		Calendar calToday =  Calendar.getInstance();
		calToday .setTime(new Date());
		TimeZone tz1 = calToday.getTimeZone();
		logger.info(" inDayLightSavings = " +tz1.inDaylightTime(new Date()) );
		if ( tz1.inDaylightTime(new Date()) ) 
			return "PDT";
		else
			return "PST";
	}
	
	public static boolean isDOBFormat(String value)
	{
		if (value == null) return false;
		else
		{
			value = value.trim();
			java.util.regex.Matcher m = DOB_PATTERN.matcher(value);
			return m.matches();
		}
		
	}

}
