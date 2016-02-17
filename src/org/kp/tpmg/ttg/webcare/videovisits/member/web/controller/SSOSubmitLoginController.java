package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.springframework.web.servlet.ModelAndView;

public class SSOSubmitLoginController extends SimplePageController
{

	public static Logger logger = Logger.getLogger(SSOSubmitLoginController.class);
	private static String JSONMAPPING = "jsonData";

	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request, HttpServletResponse response) throws Exception
	{		
		logger.info("Entering SSOSubmitLoginController");
		String data = null;		
		try
		{
			//Perform SSO sign on and authorization
			 data = MeetingCommand.performSSOSignOn(request, response);
			 
			 logger.info("SubmitLoginController:data:" + data);
		}
		catch (Exception e)
		{
			// log error
			logger.error("SSOSubmitLoginController -> System Error" + e.getMessage(),e);
		}
		//put data into buffer
		logger.info("SSOSubmitLoginController -> handleRequest-data="+data);
		modelAndView.setViewName(JSONMAPPING);
		modelAndView.addObject("data", data);
		return (modelAndView);
	}

}
