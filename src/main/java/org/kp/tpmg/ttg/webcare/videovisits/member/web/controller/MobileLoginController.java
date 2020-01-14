package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.WebAppContextCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.jwt.util.JwtUtil;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
import org.kp.tpmg.videovisit.model.meeting.VerifyMemberEnvelope;
import org.springframework.web.servlet.ModelAndView;

public class MobileLoginController extends SimplePageController {
	public static final Logger logger = Logger.getLogger(MobileLoginController.class);
	private static final String JSONMAPPING = "jsonData";

	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		logger.info(LOG_ENTERED);
		WebAppContext ctx = WebAppContext.getWebAppContext(request);
		if (ctx == null) {
			ctx = WebAppContextCommand.createContext(request, "0");
			WebAppContext.setWebAppContext(request, ctx);
		}
		String data = null;
		VerifyMemberEnvelope verifyMemberEnvelope = null;
		String output = null;
		try {
			verifyMemberEnvelope = MeetingCommand.verifyMember(request);
			response.setHeader(WebUtil.AUTH_TOKEN, JwtUtil.generateJwtToken(verifyMemberEnvelope.getMember()));
			logger.debug("data = " + verifyMemberEnvelope);
			output = WebUtil.prepareCommonOutputJson("submitlogin", "200", "success", verifyMemberEnvelope);
		} catch (Exception e) {
			logger.error("System Error : ", e);
		}
		modelAndView.setViewName(JSONMAPPING);
		modelAndView.addObject("data", output);
		logger.info(LOG_EXITING);
		return modelAndView;
	}
}
