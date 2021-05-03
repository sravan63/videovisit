package org.kp.tpmg.ttg.webcare.videovisits.member.web.command;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import javax.servlet.http.HttpServletRequest;

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
			ServiceCommonOutputJson result = WebService.testMApptService();
			if (result != null && result.getService() != null && result.getService().getStatus() != null) {
				if ("200".equals(result.getService().getStatus().getCode())) {
					toRet = "OK";
				} else {
					toRet = result.getService().getStatus().getMessage();
				}
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
			ServiceCommonOutputJson result = WebService.testMConfService();
			if (result != null && result.getService() != null && result.getService().getStatus() != null) {
				if ("200".equals(result.getService().getStatus().getCode())) {
					toRet = "OK";
				} else {
					toRet = result.getService().getStatus().getMessage();
				}
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
			ServiceCommonOutputJson result = WebService.testIntgService();
			if (result != null && result.getService() != null && result.getService().getStatus() != null) {
				if ("200".equals(result.getService().getStatus().getCode())) {
					toRet = "OK";
				} else {
					toRet = result.getService().getStatus().getMessage();
				}
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
