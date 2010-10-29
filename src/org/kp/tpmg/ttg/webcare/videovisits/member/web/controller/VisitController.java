package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import org.kp.tpmg.videovisit.member.serviceapi.webserviceobject.xsd.*;
import org.kp.tpmg.webservice.client.videovisit.member.*;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*;
import java.util.Date;
import javax.servlet.http.HttpServletRequest;
import org.apache.log4j.Logger;
import org.springframework.web.servlet.ModelAndView;

public class VisitController extends SimplePageController {
	public static Logger logger = Logger.getLogger(VisitController.class);
	//private CaseCommand caseCommand;


	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request) 
	{
		try 
		{
				String sessionID  	= request.getSession().getId();
				WebAppContext ctx  	= WebAppContext.getWebAppContext(request);
				
				// DEBUG
				System.out.println("VisitController-handlePageReques 1...");

		}
		catch  (Exception e)
		{
			e.printStackTrace();
		}
												
		return modelAndView;
	}
}

