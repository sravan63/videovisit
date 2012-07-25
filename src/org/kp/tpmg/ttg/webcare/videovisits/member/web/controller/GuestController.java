package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import java.util.ResourceBundle;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.WebAppContextCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.springframework.web.servlet.ModelAndView;

public class GuestController extends SimplePageController {

	private final static Logger logger = Logger.getLogger(GuestController.class);
	
	private final static String GUEST_PAGE = "guest";
		
	private String megaMeetingURL = null;
	
	public GuestController() {
		ResourceBundle rbInfo = ResourceBundle.getBundle("configuration");
		megaMeetingURL = rbInfo.getString ("MEGA_MEETING_URL");		
	}
	
	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request, HttpServletResponse response) 
			throws Exception {									
		initializeWebappContext(request);
		
		String data = null;
		try {			
			data = MeetingCommand.retrieveMeetingForCaregiver(request, response);
		} catch (Exception e) {
			logger.error("GuestController handleRequest error - " + e.getMessage(), e);
		}		
		logger.info("GuestController handleRequest data - " + data);
		modelAndView.setViewName(GUEST_PAGE);
		modelAndView.addObject("data", data);		
		return modelAndView;
	}
	
	private void initializeWebappContext(HttpServletRequest request) throws Exception {
		WebAppContext ctx = WebAppContext.getWebAppContext(request);
		if (ctx == null){
			ctx = WebAppContextCommand.createContext(request, "0");
			WebAppContext.setWebAppContext(request, ctx);
			ctx.setMegaMeetingURL(megaMeetingURL);			
		}
	}
}
