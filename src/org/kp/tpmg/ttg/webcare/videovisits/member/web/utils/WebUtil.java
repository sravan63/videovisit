package org.kp.tpmg.ttg.webcare.videovisits.member.web.utils;

import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

public class WebUtil {

	public static Logger logger = Logger.getLogger(WebUtil.class);
	private static Pattern DOB_PATTERN = Pattern.compile("\\d\\d\\d\\d-\\d[\\d]-\\d[\\d]");
	private static Pattern DOB_MMYYYY_PATTERN = Pattern.compile("\\d[\\d]/\\d\\d\\d\\d");
	
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
	
	public static boolean isDOBMMYYYYFormat(String value)
	{
		if (value == null) return false;
		else
		{
			value = value.trim();
			java.util.regex.Matcher m = DOB_MMYYYY_PATTERN.matcher(value);
			return m.matches();
		}
		
	}
	
	public static String fillToLength(String src, char fillChar, int total_length) {
		String ret=null;
		if (StringUtils.isNotBlank(src) && src.length()<total_length) {
			int count=total_length-src.length();
			StringBuffer sb=new StringBuffer();
			for (int i=0; i<count; i++) {
				sb.append(fillChar);
			}
			sb.append(src);
			ret=sb.toString();
		} else {
			ret=src;
		}				
		return ret;
	}	

}
