package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.WebAppContextCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;

import javax.servlet.http.*;
import org.apache.log4j.Logger;
import org.springframework.web.servlet.ModelAndView;

public class MobileLoginController extends SimplePageController {
	public static Logger logger = Logger.getLogger(MobileLoginController.class);
	private static String JSONMAPPING = "jsonData";

	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request, HttpServletResponse response) throws Exception
	{
		
		logger.info("Entering MobileLoginController:handlePageRequest");
		
		// Check if the context is active. This use case will be executed if the login controller is called for logoff > sign on
		WebAppContext ctx = WebAppContext.getWebAppContext(request);
		if (ctx == null){
			ctx = WebAppContextCommand.createContext(request, "0");
			WebAppContext.setWebAppContext(request, ctx);
		}		
		String data = null;
		try
		{
			//verify member from web service and perform meeting analysis.
			 data = MeetingCommand.verifyMember(request, response);			 
			 logger.info("MobileLoginController:handlePageRequest:data:" + data);
		}
		catch (Exception e)
		{
			// log error
			logger.error("System Error" + e.getMessage(),e);
		}
		//put data into buffer
		
		modelAndView.setViewName(JSONMAPPING);
		modelAndView.addObject("data", data);
		return (modelAndView);
	}
}

