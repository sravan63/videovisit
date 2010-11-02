package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import java.io.PrintWriter;

import javax.servlet.http.*;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.springframework.web.servlet.ModelAndView;

public class LogoutController extends SimplePageController {

	public static Logger logger = Logger.getLogger(LogoutController.class);

	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request, HttpServletResponse response) {
		try 
		{
				String sessionID  	= request.getSession().getId();
				WebAppContext ctx  	= WebAppContext.getWebAppContext(request);
				PrintWriter out 	= response.getWriter();

				if (ctx != null && ctx.member != null && ctx.meeting != null)
				{
					//UpdateResponseWrapper memberLogout(ctx.member.getMrn8Digit(),  sessionID);
					System.out.println("LandingReadyController - handlePageRequest..");
					out.println("");
				}
		}
		catch  (Exception e)
		{
			e.printStackTrace();
		}
												

		return modelAndView;
	}

}
