package org.kp.tpmg.ttg.webcare.videovisits.member.web.filter;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.jwt.util.JwtUtil;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.model.VVResponse;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class SSOSessionFilter implements Filter {
	public static final Logger logger = LoggerFactory.getLogger(SSOSessionFilter.class);

	@Override
	public void destroy() {
	}

	private String[] excludeURLs = null;

	@Override
	public void doFilter(ServletRequest sreq, ServletResponse sresp, FilterChain chain)
			throws IOException, ServletException {
		HttpServletRequest req;
		HttpServletResponse resp;

		req = (HttpServletRequest) sreq;
		resp = (HttpServletResponse) sresp;
		if (!isExcludeUrl(req)) {
			if (WebUtil.SSO.equalsIgnoreCase(req.getParameter(WebUtil.LOGIN_TYPE))) {
				validateSSOCookie(req, resp, chain);
			} else {
				String authToken = req.getHeader(WebUtil.AUTH_TOKEN);
				if (StringUtils.isNotBlank(authToken) && JwtUtil.validateAuthToken(authToken)) {
					updateAuthToken(req, resp);
					chain.doFilter(req, resp);
				} else {
					chain.doFilter(req, resp);
				}
			}
		} else {
			chain.doFilter(req, resp);
		}
	}

	@Override
	public void init(FilterConfig config) throws ServletException {
		String s = config.getInitParameter("excludeURLs");
		excludeURLs = StringUtils.split(s, ",");
	}

	private boolean isExcludeUrl(HttpServletRequest req) {
		logger.info(LOG_ENTERED);
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
		logger.info(LOG_EXITING);
		return isExclude;
	}

	private void updateAuthToken(final HttpServletRequest req, final HttpServletResponse resp) {
		logger.info(LOG_ENTERED);
		if (WebUtil.TEMP_ACCESS.equalsIgnoreCase(req.getParameter(WebUtil.LOGIN_TYPE))) {
			final String mrn = req.getHeader(WebUtil.MRN);
			if (StringUtils.isNotBlank(mrn)) {
				resp.setHeader(WebUtil.AUTH_TOKEN, JwtUtil.generateJwtToken(mrn));
			}
		} else if (WebUtil.GUEST.equalsIgnoreCase(req.getParameter(WebUtil.LOGIN_TYPE))) {
			final String meetingHash = req.getParameter("meetingCode");
			if (StringUtils.isNotBlank(meetingHash)) {
				resp.setHeader(WebUtil.AUTH_TOKEN, JwtUtil.generateJwtToken(meetingHash));
			}
		}
		logger.info(LOG_EXITING);
	}

	private void validateSSOCookie(final HttpServletRequest req, final HttpServletResponse resp,
			final FilterChain chain) {
		logger.info(LOG_ENTERED);
		try {
			Cookie ssoCookie = WebUtil.getCookie(req, WebUtil.getSSOCookieName());
			if (ssoCookie == null || ("loggedout".equalsIgnoreCase(ssoCookie.getValue())
					|| StringUtils.isBlank(ssoCookie.getValue()))) {
				if ("localhost".equalsIgnoreCase(req.getServerName()) || WebUtil.isSsoSimulation()) {
					logger.info("cookie validation not required for " + req.getServerName());
					chain.doFilter(req, resp);
				} else {
					logger.info(
							"Member signed on using SSO - session is not null, cookie in request is not valid due to SSO sign off either from KP.org or MDO");
					if (StringUtils.isNotBlank(req.getHeader(WebUtil.SSO_SESSION))) {
						MeetingCommand.performSSOSignOff(req, resp, req.getHeader(WebUtil.SSO_SESSION));
					}
					chain.doFilter(req, resp);
				}
			}
			if (ssoCookie != null && StringUtils.isNotBlank(ssoCookie.getValue())) {
				String responseCode = MeetingCommand.validateKpOrgSSOSession(req, ssoCookie.getValue());
				Gson gson = new GsonBuilder().serializeNulls().create();
				final VVResponse output = gson.fromJson(responseCode, VVResponse.class);
				if ("200".equalsIgnoreCase(output.getCode())) {
					logger.info("sso session token from request cookie valid");
					chain.doFilter(req, resp);
				} else {
					MeetingCommand.performSSOSignOff(req, resp, ssoCookie.getValue());
					chain.doFilter(req, resp);
				}
			}
		} catch (Exception e) {
			logger.error("Error while validating signon info");
		}
		logger.info(LOG_EXITING);
	}
}
