package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import org.kp.tpmg.videovisit.member.serviceapi.webserviceobject.xsd.*;
import org.kp.tpmg.webservice.client.videovisit.member.*;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*;
import java.util.Date;
import javax.servlet.http.HttpServletRequest;
import org.apache.log4j.Logger;
import org.springframework.web.servlet.ModelAndView;

public class LoginController extends SimplePageController {
	public static Logger logger = Logger.getLogger(LoginController.class);
	//private CaseCommand caseCommand;


	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request) 
	{
		try 
		{
				String lastName  	= "";
				String mrn8Digit	= "";
				String birth_month 	= "";
				String birth_year  	= "";
				String consentVersion  = "";
				String sessionID  	= request.getSession().getId();
				WebAppContext ctx  	= WebAppContext.getWebAppContext(request);
				
				// DEBUG
				System.out.println("LoginController-handlePageReques 1...");
				if (request.getParameter("last_name") != null &&
						!request.getParameter("last_name").equals("")) {
					lastName = request.getParameter("last_name");
				} 
				if (request.getParameter("mrn") != null &&
						!request.getParameter("mrn").equals("")) {
					mrn8Digit = request.getParameter("mrn");
				} 
				if (request.getParameter("birth_month") != null &&
						!request.getParameter("birth_month").equals("")) {
					birth_month = request.getParameter("birth_month");
				} 
				if (request.getParameter("birth_year") != null &&
						!request.getParameter("birth_year").equals("")) {
					birth_year = request.getParameter("birth_year");
				} 
				if (request.getParameter("consentVersion") != null &&
						!request.getParameter("consentVersion").equals("")) {
					consentVersion = request.getParameter("consentVersion");
				}

				// Validation  

				// VerifyMemberResponseWrapper response = verifyMember(lastName, mrn8Digit,birth_month + "-" + birth_year,	consentVersion,	sessionID);
				System.out.println("LoginController-handlePageRequest 2...");

				// simulation
				VerifyMemberResponseWrapper member = new VerifyMemberResponseWrapper();
				member.setSuccess(true);
				member.setErrorMessage("");
				MemberWSO fakemember = new MemberWSO();
				member.setResult(fakemember);
				member.getResult().setLastName(lastName);	
				member.getResult().setFirstName("John");		
				member.getResult().setMrn8Digit(mrn8Digit);		

				// Analyse Results and forward.	
				//modelAndView.clear();
																	
				// invalid user
				if (member.getResult().getLastName().equals("one"))
				{
					System.out.println("LoginController-handlePageRequest 3...");
	
						modelAndView.setViewName("login");
						member.setErrorMessage("Invalid user name. Please try again.");
				}
				// valid user, but not NCAL members
				//else if (result.getErrorMessage() != 
				else if (member.getResult().getLastName().equals("SCAL"))
				{
					System.out.println("LoginController-handlePageRequest 4...");

						modelAndView.setViewName("help");
						member.setErrorMessage("Service is for NCAL user only.");
						//ctx.member = member.getResult();
				}
				// OK, proceed to getting meeting
				else if (member.getResult().getLastName().equals("two") ||
						member.getResult().getLastName().equals("three"))
				{
					System.out.println("LoginController-handlePageRequest 5...");

						//RetrieveMeetingResponseWrapper response = retrieveMeetingsForMember(member.getResult().getMrn8Digit(), pastMinutes, futureMinutes, sessionID);
						//MeetingWSO meetings[] = response.getResult();
						// loop through meetings 

						// simulation
						RetrieveMeetingResponseWrapper response = new RetrieveMeetingResponseWrapper();												// no meeting.
						response.setSuccess(true);
						MeetingWSO meeting = new MeetingWSO();
						ProviderWSO fakeprovider = new ProviderWSO();
						meeting.setHost(fakeprovider);
						
						meeting.getHost().setFirstName("John");
						meeting.getHost().setLastName("Lim");
						meeting.getHost().setImageUrl("http://www.permanente.net/kaiser/pictures/30290.jpg");
						meeting.getHost().setHomePageUrl("http://www.permanente.net/homepage/kaiser/pages/c13556-top.html");
						// end simulation
						
						// save data using WebAppContext
						ctx.member = member.getResult();
						ctx.meeting = meeting;
						
						// save data using Spring model and view
						modelAndView.addObject("member", member);

						// there is no meeting
						//if (response.getSuccess())
						if (member.getResult().getLastName().equals("two"))

						{
							System.out.println("LoginController-handlePageReques..8.");

							modelAndView.setViewName("landingnone");
						}
						// there is  meeting.
						else
						{
							System.out.println("LoginController-handlePageReques...9");
							modelAndView.addObject("meeting", meeting);
							modelAndView.addObject("host", meeting.getHost());
							modelAndView.setViewName("landingready");
						}
				}
		}
		catch  (Exception e)
		{
			e.printStackTrace();
			modelAndView.setViewName("blank");
		}
		getEnvironmentCommand().loadDependencies(modelAndView, getNavigation(), getSubNavigation());
		System.out.println("LoginController-handlePageReques...10");
												
		return modelAndView;
	}
}

