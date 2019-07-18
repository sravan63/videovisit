package org.kp.tpmg.ttg.webcare.videovisits.member.web.filter;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.service.WebService;

public class BackButtonFilter implements Filter {

	public static final Logger logger = Logger.getLogger(BackButtonFilter.class);

	private String[] includeURLs = null;
	private String[] excludeURLs = null;

	public void init(FilterConfig config) throws ServletException {
		logger.info(LOG_ENTERED);
		String strIncludeUrl = config.getInitParameter("includeURLs");
		includeURLs = StringUtils.split(strIncludeUrl, ",");

		String strExcludeUrl = config.getInitParameter("excludeURLs");
		excludeURLs = StringUtils.split(strExcludeUrl, ",");
		logger.info(LOG_EXITING);
	}

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws java.io.IOException, ServletException {

		logger.info(LOG_ENTERED);

		HttpServletRequest req;
		HttpServletResponse resp;

		req = (HttpServletRequest) request;
		resp = (HttpServletResponse) response;
		HttpSession ss = req.getSession(false);
		String requestUri = req.getRequestURI();
		logger.info("requestUri = " + requestUri);
		// Keeping (isVideoVisitGuestMeetingPage and
		// isVideoVisitMemberMeetingPage) separate from exclude url because this
		// is a case of refresh.
		// Refresh will be the case most probably in which meeting is halt and
		// user clicking the refresh
		// to rejoin the meeting. In this case notification sent from the user
		// to other participants that
		// user left and rejoined the meeting is good.
		// This flag will be used to call the attendMeeting to keep track of
		// user rejoined the meeting. Important for reporting.
		boolean isVideoVisitGuestMeetingPage = req.getRequestURI().contains("videoVisitGuestReady.htm");
		boolean isVideoVisitMemberMeetingPage = req.getRequestURI().contains("videoVisitReady.htm");

		// There are links on the page like HELP in which the request is sent to
		// the server. The response opens in another browser window.
		// User stays in the meeting. We need to tell the BackButtonFilter to
		// not process an
		boolean isExclude = isExcludeUrl(req);

		// User explicity clicked some button to leave the video page
		boolean explicitUserAction = request.getParameter("explicitActionNavigation") != null
				&& "true".equals(request.getParameter("explicitActionNavigation"));

		if (!isExclude && !explicitUserAction) {
			WebAppContext ctx = WebAppContext.getWebAppContext(req);

			if (ctx != null) {
				if (ctx.isHasJoinedMeeting()) {
					try {
						if (ctx.getMemberDO() == null && !isVideoVisitMemberMeetingPage) { 
							logger.info("Calling end Caregiver meeting session");
							MeetingCommand.endCaregiverMeetingSession(ctx.getMeetingCode(),
									ctx.getVideoVisit().getPatientLastName(), req.getSession().getId(), req);
						} else if (ctx.getMemberDO() != null && !isVideoVisitMemberMeetingPage ) {
							if (ctx.getVideoVisit() != null
									&& "Y".equalsIgnoreCase(ctx.getVideoVisit().getIsProxyMeeting())) {
								logger.info("Calling member leaving proxy meeting");
								WebService.memberLeaveProxyMeeting(ctx.getVideoVisit().getMeetingId(),
										ctx.getVideoVisit().getGuestName(), req.getSession().getId(),true,ctx.getBackButtonClientId());
							} else {
								logger.info("Calling member update end meeting logout");
								String memberName = ctx.getMemberDO().getLastName() + ", "
										+ ctx.getMemberDO().getFirstName();
								MeetingCommand.updateEndMeetingLogout(req, memberName, true);
							}
						}
					} catch (Exception ex) {
						logger.warn("Error while ending meeting session");
					}
					ctx.setHasJoinedMeeting(false);
				}

				if (isVideoVisitGuestMeetingPage || isVideoVisitMemberMeetingPage) {
					ctx.setHasJoinedMeeting(true);
				}
			}

			if (isIncludeUrl(req)) { // if the url is not in excluded list

				resp.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP
																						// 1.1.
				resp.setHeader("Pragma", "no-cache"); // HTTP 1.0.
				resp.setDateHeader("Expires", 0); // Proxies.

				if (ss == null) {
					// session expired, return expiration message
					logger.info("Session expired so forwarding to " + "/logout.htm");
					RequestDispatcher rd;

					if (req.getRequestURI().toUpperCase().contains("GUEST")) {
						rd = req.getRequestDispatcher("/guestlogout.htm");
					} else {
						rd = req.getRequestDispatcher("/logout.htm");
					}

					rd.forward(req, resp);

				} else if (WebAppContext.getWebAppContext(req) == null) {

					// user was logged out, return empty response
					logger.info("User is logged out, returning empty response");

					RequestDispatcher rd;

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
		logger.info(LOG_EXITING);
	}

	public void destroy() {
		includeURLs = null;
	}

	private boolean isIncludeUrl(HttpServletRequest req) {
		boolean isInclude = false;

		if (includeURLs != null && includeURLs.length > 0 && includeURLs[0] != null) {
			for (int i = 0; i < includeURLs.length; i++) {
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

		if (excludeURLs != null && excludeURLs.length > 0 && excludeURLs[0] != null) {
			for (int i = 0; i < excludeURLs.length; i++) {
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
