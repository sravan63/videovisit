package org.kp.tpmg.ttg.webcare.videovisits.member.web.utils;

import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.service.WebService;

public class WebUtil {

	public static Logger logger = Logger.getLogger(WebUtil.class);
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

}
