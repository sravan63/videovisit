package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
import org.springframework.web.servlet.ModelAndView;

public class SubmitLoginController extends SimplePageController {
	public static final Logger logger = Logger.getLogger(SubmitLoginController.class);
	private static final String JSONMAPPING = "jsonData";

	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		logger.info(LOG_ENTERED);
		String data = null;
		final WebAppContext ctx = WebAppContext.getWebAppContext(request);
		try {
			if (ctx != null) {
				ctx.setClientId(WebUtil.VV_MBR_WEB);
				ctx.setBackButtonClientId(WebUtil.VV_MBR_BACK_BUTTON);
				ctx.setNonMember(false);
				ctx.setKpOrgSignOnInfo(null);
			}
			data = MeetingCommand.verifyMember(request);
			MeetingCommand.updateWebappContextWithBrowserFlags(ctx);
		} catch (Exception e) {
			logger.error("System Error" + e.getMessage(), e);
		}
		modelAndView.setViewName(JSONMAPPING);
		modelAndView.addObject("data", data);
		logger.debug("data=" + data);
		logger.info(LOG_EXITING);
		return modelAndView;
	}
}
