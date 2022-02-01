package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.springframework.web.servlet.ModelAndView;

public class EndCaregiverSessionController extends SimplePageController {

	public static final Logger logger = Logger.getLogger(EndCaregiverSessionController.class);
	private static final String JSONMAPPING = "jsonData";

	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		logger.info(LOG_ENTERED);
		String data = null;
		try {
			data = MeetingCommand.endCaregiverMeetingSession(request);

			String refreshMeetings = request.getParameter("refreshMeetings");

			if ("true".equalsIgnoreCase(refreshMeetings)) {
				MeetingCommand.retrieveMeetingForCaregiver(request, response);
			}

			WebAppContext ctx = WebAppContext.getWebAppContext(request);
			ctx.setHasJoinedMeeting(false);
		} catch (Exception e) {
			logger.error("System Error" + e.getMessage(), e);
		}
		logger.debug("data=" + data);
		modelAndView.setViewName(JSONMAPPING);
		modelAndView.addObject("data", data);
		logger.info(LOG_EXITING);
		return modelAndView;
	}
}
