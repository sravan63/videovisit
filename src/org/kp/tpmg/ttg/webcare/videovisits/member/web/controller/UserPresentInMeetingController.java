package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.springframework.web.servlet.ModelAndView;


public class UserPresentInMeetingController extends SimplePageController {

	public static Logger logger = Logger.getLogger(UserPresentInMeetingController.class);
	private static String JSONMAPPING = "jsonData";
	

	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request, HttpServletResponse response) throws Exception
	{	
		try
		{
			//get JSON data from web services
			String data = MeetingCommand.userPresentInMeeting(request, response);
			
			//response.setHeader("P3P","CP=IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT");
			//put data into buffer
			modelAndView.setViewName(JSONMAPPING);
			modelAndView.addObject("data", data);
			
			System.out.println("UserPresentInMeetingController-handleRequest-data="+data);
			logger.info("UserPresentInMeetingController-handleRequest-data="+data);
			
		}
		catch (Exception e)
		{
			// log error
			logger.error("System Error" + e.getMessage(),e);
		}
		return (modelAndView);
	}
}
