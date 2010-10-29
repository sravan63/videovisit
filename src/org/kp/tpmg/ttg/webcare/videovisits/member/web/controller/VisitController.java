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

				// Notify web services
				// VerifyMemberResponseWrapper response = verifyMember(lastName, mrn8Digit,birth_month + "-" + birth_year,	consentVersion,	sessionID);
				System.out.println("LoginController-handlePageRequest 2...");

				// simulation
								
				// Analyse Results and forward.	
				modelAndView.clear();
																	
				// invalid user
				//if (verifyResult.getSuccess() == false)
				if (false)
				{
					System.out.println("VisitController-handlePageRequest 3...");
	
						modelAndView.setViewName("blank");
						//member.setErrorMessage("Invalid user name. Please try again.");
				}
				// valid user, but not NCAL members
				//else if (result.getErrorMessage() != 
				else 
				{
					System.out.println("VisitController-handlePageRequest 4...");

						modelAndView.setViewName("visit");
						//member.setErrorMessage("Service is for NCAL user only.");
						//ctx.member = member.getResult();
			
				}
		}
		catch  (Exception e)
		{
			e.printStackTrace();
			modelAndView.setViewName("blank");
		}
		getEnvironmentCommand().loadDependencies(modelAndView, getNavigation(), getSubNavigation());
		System.out.println("VisitController-handlePageReques...10");
												
		return modelAndView;
	}
}

