package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import java.io.PrintWriter;

import javax.servlet.http.*;
import java.io.*;
import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.*;
import org.springframework.web.servlet.ModelAndView;

public class LogoutController extends SimplePageController {

	public static Logger logger = Logger.getLogger(LogoutController.class);
	private static String JSONMAPPING = "jsonData";

	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request, HttpServletResponse response) 
		throws Exception
	{
		PrintWriter out = response.getWriter();
		String data = null;
		try
		{
			 data = MeetingCommand.memberLogout(request, response);
		}
		catch (Exception e)
		{
			// log error
			logger.error("System Error" + e.getMessage(),e);
		}
		//put data into buffer
		logger.info("LogoutController-handleRequest-data="+data);
		out.println(data);
		modelAndView.setViewName(JSONMAPPING);
		modelAndView.addObject("data", data);
		return (modelAndView);

	}

}
