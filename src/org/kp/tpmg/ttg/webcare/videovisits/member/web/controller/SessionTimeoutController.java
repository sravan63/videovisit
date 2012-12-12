package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;


import javax.servlet.http.*;
import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.*;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.springframework.web.servlet.ModelAndView;

/**
 * This class is responsible for setting the session timeout for the web application or mobile context
 * @author arunwagle
 *
 */
public class SessionTimeoutController extends SimplePageController {

	public static Logger logger = Logger.getLogger(SessionTimeoutController.class);
	private static String JSONMAPPING = "jsonData";
	
	private int sessionTimeoutInSeconds = 0;	

	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request, HttpServletResponse response) 
		throws Exception
	{
		String data = "success";
		try
		{
			HttpSession session = request.getSession(false);
			if(session != null){
				
				WebAppContext context = WebAppContext.getWebAppContext(request);
				
				// session is active
				if(context != null){
					logger.info("=====SessionTimeoutController:handlePageRequest=======");
					session.setMaxInactiveInterval(sessionTimeoutInSeconds);
				}
			}
			
			
		}
		catch (Exception e)
		{
			// log error
			logger.error("System Error" + e.getMessage(),e);
		}
		//put data into buffer
		logger.info("LogoutController-handleRequest-data="+data);
		modelAndView.setViewName(JSONMAPPING);
		modelAndView.addObject("data", data);
		return (modelAndView);

	}

	public int getSessionTimeoutInSeconds() {
		return sessionTimeoutInSeconds;
	}

	public void setSessionTimeoutInSeconds(int sessionTimeoutInSeconds) {
		this.sessionTimeoutInSeconds = sessionTimeoutInSeconds;
	}

	

}
