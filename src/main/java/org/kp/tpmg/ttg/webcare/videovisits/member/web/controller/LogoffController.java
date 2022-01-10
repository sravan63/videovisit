package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class LogoffController {

	public static final Logger logger = LoggerFactory.getLogger(LogoffController.class);

	@RequestMapping(value = "/logout.htm", method = { RequestMethod.POST, RequestMethod.GET })
	public ModelAndView logout(ModelAndView modelAndView, HttpServletRequest request, HttpServletResponse response) {
		logger.info(LOG_ENTERED);
		request.getSession().invalidate();
		if (WebAppContext.getWebAppContext(request) != null) {
			logger.info("Setting context to null");
			WebAppContext.setWebAppContext(request, null);
		}
		logger.info(LOG_EXITING);
		return new ModelAndView("redirect:mobileAppPatientLogin.htm");
	}
}
