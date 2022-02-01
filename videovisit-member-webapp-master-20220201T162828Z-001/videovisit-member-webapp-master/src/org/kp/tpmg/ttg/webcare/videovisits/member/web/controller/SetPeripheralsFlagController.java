package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.springframework.web.servlet.ModelAndView;

public class SetPeripheralsFlagController extends SimplePageController {

	public static final Logger logger = Logger.getLogger(SetPeripheralsFlagController.class);
	private static final String JSONMAPPING = "jsonData";

	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		logger.info(LOG_ENTERED);
		try {
			WebAppContext ctx = WebAppContext.getWebAppContext(request);
			if (ctx != null) {
				final String peripheralsFlag = request.getParameter("showPeripheralsPage");
				ctx.setShowPeripheralsPage("true".equalsIgnoreCase(peripheralsFlag) ? true : false);
				modelAndView.addObject("data", ctx.isShowPeripheralsPage());
			}
		} catch (Exception e) {
			logger.error("System Error : " + e.getMessage(), e);
		}
		modelAndView.setViewName(JSONMAPPING);
		logger.info(LOG_EXITING);
		return modelAndView;
	}
}	