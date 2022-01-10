package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MonitoringCommand;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class HealthMonitorController {
	public static final Logger logger = LoggerFactory.getLogger(HealthMonitorController.class);

	@RequestMapping(value = "/healthMonitor", method = { RequestMethod.POST, RequestMethod.GET })
	public ModelAndView handlePageRequest(final HttpServletRequest request, final HttpServletResponse response) {
		logger.info(LOG_ENTERED);

		String vvmapptstat = MonitoringCommand.testMApptService(request);

		String vvmconfstat = MonitoringCommand.testMConfService(request);

		String vvmintgstat = MonitoringCommand.testIntgService(request);
		
			ModelAndView modelAndView = new ModelAndView("healthMonitor");
			
			modelAndView.addObject("vvmapptstat", wrapReturn(vvmapptstat));
			modelAndView.addObject("vvmconfstat", wrapReturn(vvmconfstat));
			modelAndView.addObject("vvmintgstat", wrapReturn(vvmintgstat));
			
			logger.info(LOG_EXITING);
			return modelAndView;
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
