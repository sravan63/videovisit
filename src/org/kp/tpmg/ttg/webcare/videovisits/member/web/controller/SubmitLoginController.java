package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;

import java.io.*;
import javax.servlet.http.*;
import org.apache.log4j.Logger;
import org.springframework.web.servlet.ModelAndView;

public class SubmitLoginController extends SimplePageController {
	public static Logger logger = Logger.getLogger(SubmitLoginController.class);
	private static String JSONMAPPING = "jsonData";

	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request, HttpServletResponse response) throws Exception
	{	
		PrintWriter out = response.getWriter();
		String data = null;
		WebAppContext ctx  	= WebAppContext.getWebAppContext(request);

		try
		{
			//verify member from web service and perform meeting analysis.
			 data = MeetingCommand.verifyMember(request, response);
			
			//if not valid user, return error immediately
			if (!data.equals("4") && !data.equals("3"))
			{
				// success login in.  retrieve meetings 
				data = MeetingCommand.retrieveMeeting(request, response);
				System.out.println("RetrieveMeeting-handleRequest-data="+data);

				// return JSON code: one - there is meeting, two - no meeting, three - invalid user, four - captcha mismatched
				if (ctx.getTotalmeetings() >= 1)
					data = "1";
				else 
					data = "2";
			}
		}
		catch (Exception e)
		{
			// log error
			logger.error("System Error" + e.getMessage(),e);
		}
		//put data into buffer
		System.out.println("SubmitLoginController-handleRequest-data="+data);
		out.println(data);
		modelAndView.setViewName(JSONMAPPING);
		modelAndView.addObject("data", data);
		return (modelAndView);
	}
}

