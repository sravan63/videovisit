package org.kp.tpmg.ttg.webcare.videovisits.member.web.service;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import net.sourceforge.wurfl.core.Device;
import net.sourceforge.wurfl.core.WURFLEngine;

public class DeviceDetectionService {

	public static final Logger logger = Logger.getLogger(DeviceDetectionService.class);
	private static String DEVICE_TYPE_COOKIE_NAME = "isWirelessDeviceOrTablet";

	/**
	 * This method checks the cookie of the device type is set . If not then the
	 * device type is read from the request using the WURLF framework
	 * 
	 * @param request
	 * @return
	 */
	public static boolean isWirelessDeviceorTablet(HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		boolean isWirelessDeviceOrTablet = false;
		Cookie cookie = getCookie(request, DEVICE_TYPE_COOKIE_NAME);
		if (cookie != null) {
			logger.info("Device detected from cookie");
			isWirelessDeviceOrTablet = Boolean.parseBoolean(cookie.getValue());
		} else {
			logger.info("Device detected using WURLF framework");
			isWirelessDeviceOrTablet = checkForDeviceType(request);
		}
		logger.info(LOG_EXITING);
		return isWirelessDeviceOrTablet;
	}

	/**
	 * Get cookie based on the cookie name
	 * 
	 * @param httpRequest
	 * @param cookieName
	 * @return
	 */
	public static Cookie getCookie(HttpServletRequest httpRequest, String cookieName) {

		if (httpRequest.getCookies() != null) {
			for (Cookie cookie : httpRequest.getCookies()) {
				logger.info("Cookie name=" + cookie.getName());
				if (StringUtils.equalsIgnoreCase(cookie.getName(), cookieName)) {
					return cookie;
				}
			}
		}
		return null;
	}

	private static boolean checkForDeviceType(HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		boolean isWirelessDeviceOrTablet = false;
		HttpSession session = request.getSession();

		WURFLEngine engine = (WURFLEngine) session.getServletContext().getAttribute(WURFLEngine.class.getName());
		Device device = engine.getDeviceForRequest(request);

		// WURFLHolder wurfl =
		// (WURFLHolder)session.getServletContext().getAttribute(WURFLHolder.class.getName());
		// WURFLManager manager = wurfl.getWURFLManager();
		// Device device = manager.getDeviceForRequest(request);

		Map<String, String> capabilities = device.getCapabilities();
		logger.debug("Device capabilities=" + capabilities);

		if ("true".equals(capabilities.get("is_wireless_device")) || "true".equals(capabilities.get("is_tablet"))) {
			isWirelessDeviceOrTablet = true;
		}
		logger.info("isWirelessDeviceOrTablet : " + isWirelessDeviceOrTablet);
		logger.info(LOG_EXITING);
		return isWirelessDeviceOrTablet;
	}

	public static Device checkForDevice(HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		boolean isWirelessDeviceOrTablet = false;
		HttpSession session = request.getSession();

		WURFLEngine engine = (WURFLEngine) session.getServletContext().getAttribute(WURFLEngine.class.getName());
		Device device = engine.getDeviceForRequest(request);

		Map<String, String> capabilities = device.getCapabilities();

		if ("true".equals(capabilities.get("is_wireless_device"))) {
			isWirelessDeviceOrTablet = true;
			logger.info("Device is Mobile");
		} else if ("true".equals(capabilities.get("is_tablet"))) {
			isWirelessDeviceOrTablet = true;
			logger.info("Device is tablet");
		}
		logger.info("User agent : " + device.getWURFLUserAgent() + ", isWirelessDeviceOrTablet : "
				+ isWirelessDeviceOrTablet);
		logger.info(LOG_EXITING);
		return device;
	}

}
