package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.kp.tpmg.videovisit.webserviceobject.xsd.StringResponseWrapper;
import org.springframework.web.servlet.ModelAndView;

public class EndCaregiverSessionController extends SimplePageController   {
	
	public static Logger logger = Logger.getLogger(LogoutController.class);
	private static String JSONMAPPING = "jsonData";

	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request, HttpServletResponse response) 
			throws Exception {
		String data = null;
		StringResponseWrapper responseWrapper = null;
		try	{
			data = MeetingCommand.endCaregiverMeetingSession(request, response);
			
			String refreshMeetings = request.getParameter("refreshMeetings");
			
			if (refreshMeetings != null && refreshMeetings.equals("true")) {
				MeetingCommand.retrieveMeetingForCaregiver(request, response);
			}
			
/*			responseWrapper = MeetingCommand.quitMeeting(request, response);
			if(responseWrapper != null && responseWrapper.getSuccess()){
				data = MeetingCommand.endCaregiverMeetingSession(request, response);
			}
			else{
				data = JSONObject.fromObject(responseWrapper).toString();
			}*/
			
		} catch (Exception e) {
			// log error
			logger.error("System Error" + e.getMessage(),e);
		}
		//put data into buffer
		logger.info("EndCaregiverSessionController-handleRequest-data="+data);
		modelAndView.setViewName(JSONMAPPING);
		modelAndView.addObject("data", data);
		return (modelAndView);
	}	
}
