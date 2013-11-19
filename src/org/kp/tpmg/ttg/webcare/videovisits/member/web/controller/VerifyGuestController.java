package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.springframework.web.servlet.ModelAndView;

public class VerifyGuestController extends SimplePageController {

	private static Logger logger = Logger.getLogger(VerifyGuestController.class);
	
	private static String JSONMAPPING = "jsonData";
	
	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request, HttpServletResponse response) 
			throws Exception {			
		String data = null;
		try {
			data = MeetingCommand.verifyCaregiver(request, response);
			
			MeetingCommand.setupGuestInfo(request);
			
		} catch (Exception e) {
			logger.error("Error in VerifyGuest handlePageRequest - " + e.getMessage(), e);
		}
		
		logger.info("VerifyGuestController handleRequest data = " + data);
		modelAndView.setViewName(JSONMAPPING);
		modelAndView.addObject("data", data);
		
		return modelAndView;
	}
}
