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

	public static String testDbRoundTrip(HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		String toRet = null;
		try {
			boolean success = WebService.initWebService(request);
			logger.info("initWebService: " + success);

			ServiceCommonOutputJson result = WebService.testDbRoundTrip();

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
			toRet = "failed in calling testDbRoundTrip - EXCEPTION";
			logger.error(toRet, th);
		}

		logger.info(LOG_EXITING + "[" + toRet + "]");
		return toRet;
	}

}
