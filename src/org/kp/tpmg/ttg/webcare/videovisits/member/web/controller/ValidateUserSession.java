package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;



import javax.servlet.http.*;

import net.sf.json.JSONObject;

import org.apache.log4j.Logger;

import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;

import org.springframework.web.servlet.ModelAndView;

/**
 * This class is responsible for setting the session timeout for the web application or mobile context
 * @author arunwagle
 *
 */
public class ValidateUserSession extends SimplePageController {

	public static Logger logger = Logger.getLogger(ValidateUserSession.class);
	private static String JSONMAPPING = "jsonData";


	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request, HttpServletResponse response) 
		throws Exception
	{
		String data = "success";
		JSONObject result = new JSONObject();
		try
		{
			HttpSession session = request.getSession(false);
			
			result.put("isValidUserSession", false);
			result.put("success", false);
			if(session != null){
				
				WebAppContext context = WebAppContext.getWebAppContext(request);
				
				// session is active
				if ( request.getParameter("source") != null && request.getParameter("source").equalsIgnoreCase("member"))
				{
					logger.info("in validateUserSession member");
					if(context != null && context.getMember() != null){
						
						String meetingStatus = MeetingCommand.getMeetingStatus(request, response);
						result.put("meetingStatus", meetingStatus);
						result.put("isValidUserSession", true);
						result.put("success", true);	
					}
				}
				
				if ( request.getParameter("source") != null && request.getParameter("source").equalsIgnoreCase("caregiver"))
				{
					logger.info("in validateUserSession caregiver");
					if(context != null && context.getCareGiver() == true){
						result.put("isValidUserSession", true);
						result.put("success", true);	
					}
				}
			}
			
			
		}
		catch (Exception e)
		{
			// log error
			logger.error("System Error" + e.getMessage(),e);
		}
		//put data into buffer
		
		data = JSONObject.fromObject(result).toString();
		logger.info("ValidateUserSession-handleRequest-data="+data);
		modelAndView.setViewName(JSONMAPPING);
		modelAndView.addObject("data", data);
		return (modelAndView);

	}

	

}