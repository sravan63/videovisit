package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.springframework.web.servlet.ModelAndView;

public class ProviderRunningLateInfoController extends SimplePageController {

	public static Logger logger = Logger.getLogger(ProviderRunningLateInfoController.class);
	private static String JSONMAPPING = "jsonData";

	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		logger.info("Entered handlePageRequest");
		String data = null;
		try {
			data = MeetingCommand.getProviderRunningLateDetails(request, response);

			modelAndView.setViewName(JSONMAPPING);
			modelAndView.addObject("data", data);
		} catch (Exception e) {
			logger.error("handlePageRequest -> System Error" + e.getMessage(), e);
		}
		logger.info("Exiting handlePageRequest");
		return (modelAndView);
	}

}
