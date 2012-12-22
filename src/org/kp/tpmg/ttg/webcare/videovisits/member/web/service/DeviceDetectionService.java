package org.kp.tpmg.ttg.webcare.videovisits.member.web.service;

import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sourceforge.wurfl.core.Device;
import net.sourceforge.wurfl.core.WURFLHolder;
import net.sourceforge.wurfl.core.WURFLManager;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;


public class DeviceDetectionService {

	public static Logger logger = Logger.getLogger(DeviceDetectionService.class);
	private static String DEVICE_TYPE_COOKIE_NAME =  "isWirelessDeviceOrTablet";
	
	/**
	 * This method checks the cookie of the device type is set . If not then the device type is read from the request using the WURLF framework
	 * @param request
	 * @return
	 */
	public static boolean isWirelessDeviceorTablet(HttpServletRequest request){
		boolean isWirelessDeviceOrTablet = false;
		
		Cookie cookie = getCookie(request, DEVICE_TYPE_COOKIE_NAME);
		if(cookie != null){
			logger.info("DeviceDetectionService:isWirelessDeviceOrTablet:Device detected from cookie" );
			isWirelessDeviceOrTablet = Boolean.parseBoolean(cookie.getValue());
		}
		
		return isWirelessDeviceOrTablet;
	}
	
	
	
	/**
	 * Get cookie based on the cookie name
	 * @param httpRequest
	 * @param cookieName
	 * @return
	 */
	public static Cookie getCookie(HttpServletRequest httpRequest, String cookieName) {
		
        for (Cookie cookie : httpRequest.getCookies()) {
        	logger.info("DeviceDetectionService:getCookie: cookie name="+ cookie.getName());
            if (StringUtils.equalsIgnoreCase(cookie.getName(), cookieName)) {
                return cookie;
            }
        }
        return null;
    }
	
	
	
	
}
