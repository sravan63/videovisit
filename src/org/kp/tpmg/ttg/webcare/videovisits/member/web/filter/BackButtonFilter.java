package org.kp.tpmg.ttg.webcare.videovisits.member.web.filter;

import javax.servlet.*;
import javax.servlet.http.*;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;

public class BackButtonFilter implements Filter  {

	public static Logger logger = Logger.getLogger(BackButtonFilter.class);

	private FilterConfig config = null;
	private String[] includeURLs = null;
	
	
	public void  init (FilterConfig config) throws ServletException {

		logger.info("Inside DataSessionFilter - init()->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
		this.config = config;

		String s = config.getInitParameter("includeURLs");
		includeURLs = StringUtils.split(s, ",");

	}
	
	public void  doFilter(ServletRequest request, 
	              ServletResponse response,
	              FilterChain chain) 
	              throws java.io.IOException, ServletException {

		HttpServletRequest req;
		HttpServletResponse resp;
	
		req = (HttpServletRequest) request;
		resp = (HttpServletResponse) response;
		HttpSession ss = req.getSession(false);

		boolean isVideoVisitGuestMeetingPage = req.getRequestURI().contains("videoVisitGuestReady.htm");
		boolean isVideoVisitMemberMeetingPage = req.getRequestURI().contains("videoVisitReady.htm");

		WebAppContext ctx = WebAppContext.getWebAppContext(req);

		if (ctx  != null ) {
			if(ctx.isHasJoinedMeeting()) {
				try {
					
					if (ctx.getMember() == null) {
						MeetingCommand.endCaregiverMeetingSession(ctx.getMeetingCode(), ctx.getVideoVisit().getUserName());
					} else {
						String memberName = ctx.getMember().getLastName() + ", " + ctx.getMember().getFirstName();
						MeetingCommand.updateEndMeetingLogout(req, resp, memberName, true);
					}
					
				} catch (Exception ex) {}
				ctx.setHasJoinedMeeting(false);
			}
			
			if (isVideoVisitGuestMeetingPage || isVideoVisitMemberMeetingPage) {
				ctx.setHasJoinedMeeting(true);
			} 
		}
		
		if (isIncludeUrl(req)) {  //if the url is not in excluded list

			resp.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
			resp.setHeader("Pragma", "no-cache"); // HTTP 1.0.
			resp.setDateHeader("Expires", 0); // Proxies.

			if (ss == null) {
				//session expired, return expiration message
					logger.info("Inside BackButtonFilter.doFilter Session expired forwarding to>>>>>>>>>>>>>>>>>>>>"
							+ "/logout.htm");
					RequestDispatcher rd = req.getRequestDispatcher("/logout.htm");
					rd.forward(req, resp);
					
	
			} else if (WebAppContext.getWebAppContext(req)== null) {

				//user was logged out, return empty response
				logger.info("Inside BackButtonFilter.doFilter user is logged out, returning empty response");
				RequestDispatcher rd = req.getRequestDispatcher("/logout.htm");
				rd.forward(req, resp);
				
			} else {
				chain.doFilter(req, resp);
			}
		} else {
			chain.doFilter(req, resp);
		}
			
		
	}
	public void destroy( ){
		config = null;
		includeURLs = null;
	}
	
	private boolean isIncludeUrl(HttpServletRequest req) {
		boolean isInclude = false;
		
		if (includeURLs != null && includeURLs.length >0 && includeURLs[0] != null) {
			for (int i=0;i<includeURLs.length;i++) {
				boolean isMatch = req.getRequestURI().contains(includeURLs[i]);
				
				if (isMatch) {
					isInclude = isMatch;
					break;
				}
			}
		}
		return isInclude;
	}
	
}
