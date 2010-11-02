package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import org.kp.tpmg.videovisit.member.serviceapi.webserviceobject.xsd.*;
import org.kp.tpmg.webservice.client.videovisit.member.*;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*;

import java.io.PrintWriter;
import java.util.Date;
import javax.servlet.http.*;
import org.apache.log4j.Logger;
import org.springframework.web.servlet.ModelAndView;

public class VisitController extends SimplePageController {
	public static Logger logger = Logger.getLogger(VisitController.class);
	//private CaseCommand caseCommand;


	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request, HttpServletResponse response) 
	{
		try 
		{
				String sessionID  	= request.getSession().getId();
				WebAppContext ctx  	= WebAppContext.getWebAppContext(request);
				PrintWriter out 	= response.getWriter();

				if (ctx != null && ctx.member != null && ctx.meeting != null)
				{
					//UpdateResponseWrapper result = updateMemberMeetingStatusJoining(ctx.meeting.getMeetingID,ctx.member.getMrn8Digit,  sessionID);
					
					System.out.println("LandingReadyController - handlePageRequest..");
					modelAndView.addObject("WebAppContext", ctx);
					out.println("http://www.youtube.com/watch?v=ASKnLj2Pp8I	");
				}
		}
		catch  (Exception e)
		{
			e.printStackTrace();
		}
												
		return modelAndView;
	}
}

