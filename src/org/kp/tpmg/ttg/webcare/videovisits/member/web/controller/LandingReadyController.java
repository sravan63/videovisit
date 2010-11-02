package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import org.kp.tpmg.webservice.client.videovisit.member.*;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*;

import java.util.Date;
import javax.servlet.http.*;
import org.apache.log4j.Logger;
import org.springframework.web.servlet.ModelAndView;
import org.kp.tpmg.videovisit.member.serviceapi.webserviceobject.xsd.*;

public class LandingReadyController extends SimplePageController {
	public static Logger logger = Logger.getLogger(LandingReadyController.class);
	
	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request, HttpServletResponse response) 
	{
		try 
		{
			WebAppContext ctx  	= WebAppContext.getWebAppContext(request);
			
			if (ctx != null && ctx.member != null && ctx.meeting != null)
			{
				//MemberWSO member = (MemberWSO)request.getSession().getAttribute("MemberWSO");
				System.out.println("LandingReadyController - handlePageRequest..");
				modelAndView.addObject("WebAppContext", ctx);
				System.out.println("LandingNoneController: added object WebAppContext as WebAppContext");
			}
		}
		catch  (Exception e)
		{
			e.printStackTrace();
			modelAndView.setViewName("blank");

		}
												
		return modelAndView;
	}
}

