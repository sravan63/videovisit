package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class JoinLeaveMobileMeetingController {

	public static final Logger logger = LoggerFactory.getLogger(JoinLeaveMobileMeetingController.class);
	private static final String JSONMAPPING = "jsonData";

	@RequestMapping(value = "/joinLeaveMeeting.json", method = { RequestMethod.POST, RequestMethod.GET })
	public ModelAndView joinLeaveMeeting(ModelAndView modelAndView, HttpServletRequest request,
			HttpServletResponse response) {
		logger.info(LOG_ENTERED);
		try {
			final String data = MeetingCommand.joinLeaveMobileMeeting(request);
			modelAndView.setViewName(JSONMAPPING);
			modelAndView.addObject("data", data);
			logger.debug("data = " + data);
		} catch (Exception e) {
			logger.error("System Error : ", e);
		}
		logger.info(LOG_EXITING);
		return modelAndView;
	}

}
