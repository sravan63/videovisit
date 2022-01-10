package org.kp.tpmg.ttg.webcare.videovisits.member.web.service;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import net.sourceforge.wurfl.core.Device;
import net.sourceforge.wurfl.core.WURFLEngine;

public class DeviceDetectionService {

	public static final Logger logger = LoggerFactory.getLogger(DeviceDetectionService.class);

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
