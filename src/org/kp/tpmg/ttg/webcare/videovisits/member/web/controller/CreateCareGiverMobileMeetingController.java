package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.springframework.web.servlet.ModelAndView;


public class CreateCareGiverMobileMeetingController extends SimplePageController {

	public static Logger logger = Logger.getLogger(CreateCareGiverMobileMeetingController.class);
	private static String JSONMAPPING = "jsonData";
	

	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request, HttpServletResponse response) throws Exception
	{	
		try
		{
			logger.info("in CreateCareGiverMobileMeetingController");
			//get JSON data from web services
			String data = MeetingCommand.CreateCareGiverMobileMeeting(request, response);
		
			//put data into buffer
			modelAndView.setViewName(JSONMAPPING);
			modelAndView.addObject("data", data);
		
			//or write data out to requester
			//PrintWriter out = response.getWriter();
			logger.debug("CreateMobileMeetingController-handleRequest-data="+data);
			//out.println(data);
		}
		catch (Exception e)
		{
			// log error
			logger.error("System Error" + e.getMessage(),e);
		}
		return (modelAndView);
	}
}
