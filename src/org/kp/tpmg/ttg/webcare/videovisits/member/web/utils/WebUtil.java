package org.kp.tpmg.ttg.webcare.videovisits.member.web.utils;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;
import java.util.regex.Pattern;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

public class WebUtil {

	public static Logger logger = Logger.getLogger(WebUtil.class);
	private static Pattern DOB_PATTERN = Pattern.compile("\\d\\d\\d\\d-\\d[\\d]-\\d[\\d]");
	private static Pattern DOB_MMYYYY_PATTERN = Pattern.compile("\\d[\\d]/\\d\\d\\d\\d");
	public static final String SSO_COOKIE_NAME = "ObSSOCookie";
	
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
	
	/**
	 * Get cookie based on the cookie name
	 * @param httpRequest
	 * @param cookieName
	 * @return
	 */
	public static Cookie getCookie(HttpServletRequest httpRequest, String cookieName) 
	{		
		if (httpRequest.getCookies() != null && StringUtils.isNotBlank(cookieName))
		{
			for (Cookie cookie : httpRequest.getCookies()) 
			{
	        	logger.info("getCookie: cookie name="+ cookie.getName());
	            if (StringUtils.equalsIgnoreCase(cookie.getName(), cookieName)) 
	            {
	                return cookie;
	            }
			}
		}
        return null;
    }
	
	public static void readAllCookies(HttpServletRequest httpRequest) 
	{		
		if (httpRequest.getCookies() != null)
		{
			for (Cookie cookie : httpRequest.getCookies()) 
			{
	        	logger.info("getCookie: cookie name="+ cookie.getName());
	        	logger.info("getCookie: cookie value="+ cookie.getValue());
	        	logger.info("getCookie: cookie domain="+ cookie.getDomain());
	        	logger.info("getCookie: cookie maxage="+ cookie.getMaxAge());
	        	logger.info("getCookie: cookie path="+ cookie.getPath());
	        	logger.info("getCookie: cookie secure="+ cookie.getSecure());
	        	logger.info("getCookie: cookie version="+ cookie.getVersion());
	        	logger.info("getCookie: cookie comment="+ cookie.getComment());
	        	logger.info("getCookie: -------------------------");
			}
		}
        
    }
	
	public static void setCookie(HttpServletResponse response, String cookieName, String cookieValue)
	{
		 logger.info("setCookie: cookie name="+ cookieName + ", cookie value=" + cookieValue);
		 Cookie cookie;
		try {
			cookie = new Cookie(cookieName, URLEncoder.encode(cookieValue, "UTF-8"));
			cookie.setPath("/");
			cookie.setDomain(".kaiserpermanente.org");
			cookie.setSecure(true);
		    response.addCookie(cookie);
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			logger.warn("setCookie: error while adding a coockie="+ cookieName + ", cookie value=" + cookieValue);
		}
         
	}
	
	public static void removeCookie(HttpServletRequest httpRequest, HttpServletResponse response, String cookieName)
	{
		logger.info("removeCookie: cookie name="+ cookieName);
		Cookie[] cookies = httpRequest.getCookies();
		if (cookies != null)
		{
			for (Cookie cookie : cookies) 
			{
				if (StringUtils.equalsIgnoreCase(cookie.getName(), cookieName)) 
	            {
	            	cookie.setValue(null);
	            	cookie.setMaxAge(0); 
	        		cookie.setPath("/");
	        		cookie.setDomain(".kaiserpermanente.org");
	        		cookie.setSecure(true);
	        		response.addCookie(cookie);
	        		logger.info("removeCookie: removed cookie name="+ cookie.getName());
	            }
			}
		}
			
	}

}
