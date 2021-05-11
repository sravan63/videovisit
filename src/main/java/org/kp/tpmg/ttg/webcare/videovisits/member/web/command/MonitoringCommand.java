package org.kp.tpmg.ttg.webcare.videovisits.member.web.command;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.service.WebService;
import org.kp.tpmg.videovisit.model.ServiceCommonOutputJson;

public class MonitoringCommand {

	private MonitoringCommand() {
	}

	public static final Logger logger = Logger.getLogger(MonitoringCommand.class);

	public static String testMApptService(HttpServletRequest request) {

		logger.info(LOG_ENTERED);
		String toRet = null;
		try {
			String result = WebService.testMApptService();
			if (StringUtils.isNotBlank(result) && result.equalsIgnoreCase("success")) {
				toRet = "OK";
			} else {
				toRet = "Failure";
			}
		} catch (Exception th) {
			toRet = "failed in calling testMApptService - EXCEPTION";
			logger.error(toRet, th);
		}
		logger.info(LOG_EXITING + "[" + toRet + "]");
		return toRet;
	}

	public static String testMConfService(HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		String toRet = null;
		try {
			String result = WebService.testMConfService();
			if (StringUtils.isNotBlank(result) && result.equalsIgnoreCase("success")) {
				toRet = "OK";
			} else {
				toRet = "Failure";
			}
		} catch (Exception th) {
			toRet = "failed in calling testMConfService - EXCEPTION";
			logger.error(toRet, th);
		}
		logger.info(LOG_EXITING + "[" + toRet + "]");
		return toRet;
	}

	public static String testIntgService(HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		String toRet = null;
		try {
			String result = WebService.testIntgService();
			if (StringUtils.isNotBlank(result) && result.equalsIgnoreCase("success")) {
				toRet = "OK";
			} else {
				toRet = "Failure";
			}
		} catch (Exception th) {
			toRet = "failed in calling testIntgService - EXCEPTION";
			logger.error(toRet, th);
		}
		logger.info(LOG_EXITING + "[" + toRet + "]");
		return toRet;
	}

}
