package org.kp.tpmg.ttg.webcare.videovisits.member.web.filter;

import javax.servlet.*;
import javax.servlet.http.*;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;

public class BackButtonFilter implements Filter  {

	public static Logger logger = Logger.getLogger(BackButtonFilter.class);

	private String[] includeURLs = null;
	private String[] excludeURLs = null;
	
	
	public void  init (FilterConfig config) throws ServletException {

		logger.info("Inside BackButtonFilter - init()->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

		String strIncludeUrl = config.getInitParameter("includeURLs");
		includeURLs = StringUtils.split(strIncludeUrl, ",");

		String strExcludeUrl = config.getInitParameter("excludeURLs");
		excludeURLs = StringUtils.split(strExcludeUrl, ",");

	}
	
	public void  doFilter(ServletRequest request, 
	              ServletResponse response,
	              FilterChain chain) 
	              throws java.io.IOException, ServletException {

		logger.info("Inside BackButtonFilter - doFilter()->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
		
		HttpServletRequest req;
		HttpServletResponse resp;
	
		req = (HttpServletRequest) request;
		resp = (HttpServletResponse) response;
		HttpSession ss = req.getSession(false);
		String requestUri = req.getRequestURI();
		logger.info("Inside BackButtonFilter requestUri = " + requestUri);
		// Keeping (isVideoVisitGuestMeetingPage and isVideoVisitMemberMeetingPage) separate from exclude url because this is a case of refresh.
		// Refresh will be the case most probably in which meeting is halt and user clicking the refresh
		// to rejoin the meeting. In this case notification sent from the user to other participants that
		// user left and rejoined the meeting is good.
		// This flag will be used to call the attendMeeting to keep track of user rejoined the meeting. Important for reporting.
		boolean isVideoVisitGuestMeetingPage = req.getRequestURI().contains("videoVisitGuestReady.htm");
		boolean isVideoVisitMemberMeetingPage = req.getRequestURI().contains("videoVisitReady.htm");
		
		// There are links on the page like HELP in which the request is sent to the server. The response opens in another browser window.
		// User stays in the meeting. We need to tell the BackButtonFilter to not process an
		boolean isExclude = isExcludeUrl (req);

		// User explicity clicked some button to leave the video page
		boolean explicitUserAction = (request.getParameter("explicitActionNavigation") != null && request.getParameter("explicitActionNavigation").equals("true"));

		if (!isExclude && !explicitUserAction) {
			WebAppContext ctx = WebAppContext.getWebAppContext(req);
	
			if (ctx  != null ) {
				if(ctx.isHasJoinedMeeting()) {
					try {
						
						if (ctx.getMember() == null && !isVideoVisitMemberMeetingPage) {
							MeetingCommand.endCaregiverMeetingSession(ctx.getMeetingCode(), ctx.getVideoVisit().getUserName());
						} 
						else if (!isVideoVisitGuestMeetingPage) {
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
						RequestDispatcher rd = null;
					
						if (req.getRequestURI().toUpperCase().contains("GUEST")) {
							rd = req.getRequestDispatcher("/guestlogout.htm");
						} else {
							rd = req.getRequestDispatcher("/logout.htm");
						}
						
						rd.forward(req, resp);
		
				} else if (WebAppContext.getWebAppContext(req)== null) {
					
					//user was logged out, return empty response
					logger.info("Inside BackButtonFilter.doFilter user is logged out, returning empty response");
					
					RequestDispatcher rd = null;
	
					if (req.getRequestURI().toUpperCase().contains("GUEST")) {
						rd = req.getRequestDispatcher("/guestlogout.htm");
					} else {
						rd = req.getRequestDispatcher("/logout.htm");
					}
					
					rd.forward(req, resp);
					
				} else {
					chain.doFilter(req, resp);
				}
			} else {
				chain.doFilter(req, resp);
			}
		} else {
			chain.doFilter(req, resp);
		}
			
	}
	
	public void destroy( ){
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

	private boolean isExcludeUrl(HttpServletRequest req) {
		boolean isExclude = false;
		
		if (excludeURLs != null && excludeURLs.length >0 && excludeURLs[0] != null) {
			for (int i=0;i<excludeURLs.length;i++) {
				boolean isMatch = req.getRequestURI().contains(excludeURLs[i]);
				
				if (isMatch) {
					isExclude = isMatch;
					break;
				}
			}
		}
		return isExclude;
	}
	
}
