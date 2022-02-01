package org.kp.tpmg.ttg.webcare.videovisits.member.web.ssosimulation;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.controller.SimplePageController;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
import org.springframework.web.servlet.ModelAndView;

public class SSOSimulationLoginController extends SimplePageController {

	public static final Logger logger = Logger.getLogger(SSOSimulationLoginController.class);

	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.info(LOG_ENTERED);
		final ModelAndView modelAndView;
		if (WebUtil.isSsoSimulation()) {
			modelAndView = new ModelAndView(getViewName());
			getEnvironmentCommand().loadDependencies(modelAndView, getNavigation(), getSubNavigation());
		} else {
			logger.info("SSO Simulation is turned off, so redirecting to ssologin.");
			modelAndView = new ModelAndView("redirect:ssologin.htm");
		}
		logger.info(LOG_EXITING);
		return modelAndView;
	}

}
