package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import javax.servlet.http.*;
import org.apache.log4j.Logger;
import org.springframework.web.servlet.ModelAndView;

public class CreateMeetingSessionController extends SimplePageController {
	public static Logger logger = Logger.getLogger(CreateMeetingSessionController.class);
	private static String JSONMAPPING = "jsonData";

	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request, HttpServletResponse response) throws Exception
	{	
		String data = null;
		try
		{
			 data = MeetingCommand.createMeetingSession(request, response);
		}
		catch (Exception e)
		{
			// log error
			logger.error("System Error" + e.getMessage(),e);
		}
		//put data into buffer
		logger.info("CreateMeetingSessionController-handleRequest-data="+data);
		modelAndView.setViewName(JSONMAPPING);
		modelAndView.addObject("data", data);
		return (modelAndView);
	}
}

