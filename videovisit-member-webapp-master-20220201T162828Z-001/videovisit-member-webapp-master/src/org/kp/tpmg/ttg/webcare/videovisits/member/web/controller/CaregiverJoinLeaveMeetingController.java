package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.springframework.web.servlet.ModelAndView;

public class CaregiverJoinLeaveMeetingController extends SimplePageController {

	public static final Logger logger = Logger.getLogger(CaregiverJoinLeaveMeetingController.class);
	private static final String JSONMAPPING = "jsonData";

	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		logger.info(LOG_ENTERED);
		String data = null;
		try {
			data = MeetingCommand.caregiverJoinLeaveMeeting(request);

			modelAndView.setViewName(JSONMAPPING);
			modelAndView.addObject("data", data);
		} catch (Exception e) {
			logger.error("System Error" + e.getMessage(), e);
		}
		logger.info(LOG_EXITING);
		return modelAndView;
	}

}
