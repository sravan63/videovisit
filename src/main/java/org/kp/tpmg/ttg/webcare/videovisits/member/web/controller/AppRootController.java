package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.WebAppContextCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class AppRootController {

	protected final Logger logger = LoggerFactory.getLogger(AppRootController.class);

	@RequestMapping(value = "/mobileAppPatientLogin.htm", method = { RequestMethod.POST, RequestMethod.GET })
	public ModelAndView mobileAppPatientLogin(HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		WebAppContext ctx = WebAppContext.getWebAppContext(request);
		if (ctx == null) {
			logger.info("context is null");
			ctx = WebAppContextCommand.createContext(request, "0");
			WebAppContext.setWebAppContext(request, ctx);
		} else {
			logger.info("Context is not null");
		}
		MeetingCommand.updateWebappContextWithPexipMobileBrowserDetails(ctx);
		WebUtil.updateWebappContextForAndroidSDK(ctx, request);
		ModelAndView modelAndView = new ModelAndView("mPatientLogin");
		logger.info(LOG_EXITING);
		return modelAndView;
	}
}
