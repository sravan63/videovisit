package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.springframework.web.servlet.ModelAndView;

public class LogVendorMeetingErrorsController extends SimplePageController {

	public static Logger logger = Logger.getLogger(LogVendorMeetingErrorsController.class);
	private static String JSONMAPPING = "jsonData";

	@Override
	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request,
			HttpServletResponse response) {
		logger.info("Entered handlePageRequest");
		try {

			String data = MeetingCommand.logVendorMeetingErrors(request, response);
			modelAndView.setViewName(JSONMAPPING);
			modelAndView.addObject("data", data);
			logger.debug("handleRequest data=" + data);
		} catch (Exception e) {
			logger.error("handleRequest : System Error", e);
		}
		logger.info("Exiting handlePageRequest");
		return modelAndView;
	}

}
