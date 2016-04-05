package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.springframework.web.servlet.ModelAndView;

public class LaunchMemberProxyMeetingForMemberController extends SimplePageController {
	public static Logger logger = Logger.getLogger(LaunchMemberProxyMeetingForMemberController.class);
	private static String JSONMAPPING = "jsonData";

	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request, HttpServletResponse response) throws Exception
	{	
		logger.info("Entered LaunchMemberProxyMeetingForMemberController handlePageRequest");
		String data = null;
		try
		{
			 data = MeetingCommand.launchMemberOrProxyMeetingForMember(request, response);
		}
		catch (Exception e)
		{
			// log error
			logger.error("LaunchMemberProxyMeetingForMemberController -> System Error" + e.getMessage(),e);
		}
		//put data into buffer
		logger.info("Exiting LaunchMemberProxyMeetingForMemberController-handleRequest-data="+data);
		modelAndView.setViewName(JSONMAPPING);
		modelAndView.addObject("data", data);
		return (modelAndView);
	}
}
