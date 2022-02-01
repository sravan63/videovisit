package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.springframework.web.servlet.ModelAndView;

public class QuitMeetingController extends SimplePageController {
	public static final Logger logger = Logger.getLogger(QuitMeetingController.class);
	private static final String JSONMAPPING = "jsonData";

	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		logger.info(LOG_ENTERED);
		String data = null;
		try {
			String memberName = request.getParameter("memberName");
			String refreshMeetings = request.getParameter("refreshMeetings");
			String isProxyMeeting = request.getParameter("isProxyMeeting");

			logger.debug("memberName=" + memberName);
			logger.info("refreshMeetings=" + refreshMeetings + ", isProxyMeeting=" + isProxyMeeting);
			if ("Y".equalsIgnoreCase(request.getParameter("isProxyMeeting"))) {
				data = MeetingCommand.memberLeaveProxyMeeting(request);
			} else {
				data = MeetingCommand.updateEndMeetingLogout(request, memberName, false);
			}
			WebAppContext ctx = WebAppContext.getWebAppContext(request);

			if (ctx != null) {
				ctx.setHasJoinedMeeting(false);
			}

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
