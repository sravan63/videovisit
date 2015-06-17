package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import javax.servlet.http.*;

import org.apache.log4j.Logger;
import org.springframework.web.servlet.ModelAndView;

public class QuitMeetingController extends SimplePageController {
	public static Logger logger = Logger.getLogger(QuitMeetingController.class);
	private static String JSONMAPPING = "jsonData";

	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request, HttpServletResponse response) throws Exception
	{	
		String data = null;
		try
		{
			HttpSession session = (HttpSession)request.getSession();
			 session.setMaxInactiveInterval(22*60);
			String memberName = request.getParameter("memberName");
			String refreshMeetings = request.getParameter("refreshMeetings"); 
			
			logger.info("Entered QuiteetingController-received request parameters as [memberName=" + memberName + ", refreshMeetings="+refreshMeetings + "]");
			
			data = MeetingCommand.updateEndMeetingLogout(request, response, memberName, false);			
			
			if (refreshMeetings != null && refreshMeetings.equals("true")) {
				MeetingCommand.retrieveMeeting(request, response);
			}
		
			WebAppContext ctx = WebAppContext.getWebAppContext(request);
			ctx.setHasJoinedMeeting(false);
			
//			responseWrapper = MeetingCommand.quitMeeting(request, response);
//			if(responseWrapper != null && responseWrapper.getSuccess()){
//				data = MeetingCommand.updateEndMeetingLogout(request, response);
//			}
//			else{
//				data = JSONObject.fromObject(responseWrapper).toString();
//			}

			 
//			 // logout
//			 data = MeetingCommand.memberLogout (request, response);
		}
		catch (Exception e)
		{
			// log error
			logger.error("System Error" + e.getMessage(),e);
		}
		//put data into buffer
		logger.info("Exiting QuiteetingController-sending response as data="+data);
		modelAndView.setViewName(JSONMAPPING);
		modelAndView.addObject("data", data);
		return (modelAndView);
	}
}

