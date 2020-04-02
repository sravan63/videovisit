package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MonitoringCommand;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class HealthMonitorController {
	public static final Logger logger = Logger.getLogger(HealthMonitorController.class);

	@RequestMapping(value = "/healthMonitor", method = { RequestMethod.POST, RequestMethod.GET })
	public ModelAndView handlePageRequest(final HttpServletRequest request, final HttpServletResponse response) {
		logger.info(LOG_ENTERED);
		boolean txtMode = "".equals(request.getParameter("text"));

		String db = MonitoringCommand.testDbRoundTrip(request);

		boolean allOk = isOk(db);

		if (txtMode) {
			int statusCode = 0;
			if (!allOk) {
				statusCode = 1;
			}

			ModelAndView toRet = new ModelAndView("simpleText");
			toRet.addObject("simpleText", "" + Integer.toString(statusCode));
			logger.info(LOG_EXITING);
			return toRet;
		} else {
			ModelAndView modelAndView = new ModelAndView("healthMonitor");
			modelAndView.addObject("db", wrapReturn(db));
			modelAndView.addObject("allOk", allOk);
			logger.info(LOG_EXITING);
			return modelAndView;
		}
	}

	protected boolean isOk(String val) {
		return "OK".equalsIgnoreCase(val);
	}

	protected String wrapReturn(String value) {
		if (isOk(value)) {
			return "<font color='green'>" + value + "</font>";
		} else
			return "<font color='red'>" + value + "</font>";
	}

}
