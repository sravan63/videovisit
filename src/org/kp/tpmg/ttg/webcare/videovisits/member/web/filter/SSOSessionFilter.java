package org.kp.tpmg.ttg.webcare.videovisits.member.web.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.jwt.util.JwtUtil;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.model.VVResponse;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class SSOSessionFilter implements Filter {
	public static final Logger logger = Logger.getLogger(SSOSessionFilter.class);

	@Override
	public void destroy() {
	}

	private String[] excludeURLs = null;
	private String[] ssoURLs = { "retrieveActiveMeetingsForMemberAndProxies.json", "ssosignoff.json" };

	@Override
	public void doFilter(ServletRequest sreq, ServletResponse sresp, FilterChain chain)
			throws IOException, ServletException {
		HttpServletRequest req;
		HttpServletResponse resp;

		req = (HttpServletRequest) sreq;
		resp = (HttpServletResponse) sresp;
		boolean isValidSession = false;
		if (!isExcludeUrl(req)) {
			if (isSSOUrls(req)) {
				try {
					String ssoSession = req.getHeader("ssoSession");
					if (StringUtils.isNotBlank(ssoSession)) {
						String responseCode = MeetingCommand.validateKpOrgSSOSession(req, ssoSession);
						Gson gson = new GsonBuilder().serializeNulls().create();
						final VVResponse output = gson.fromJson(responseCode, VVResponse.class);
						if ("200".equalsIgnoreCase(output.getCode())) {
							logger.info("sso session token from request cookie valid");
							isValidSession = true;
						}
					}
				} catch (Exception e) {
					logger.error("Error while validating signon info");
				}
				if (isValidSession) {
					chain.doFilter(req, resp);
				} else {
					resp.sendError(HttpServletResponse.SC_UNAUTHORIZED);
				}
			} else {
				String authToken = req.getHeader(WebUtil.AUTH_TOKEN);
				if (JwtUtil.validateAuthToken(authToken)) {
					chain.doFilter(req, resp);
				} else {
					resp.sendError(HttpServletResponse.SC_UNAUTHORIZED);
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

	private boolean isSSOUrls(HttpServletRequest req) {
		boolean isExclude = false;
		if (ssoURLs != null && ssoURLs.length > 0 && ssoURLs[0] != null) {
			for (int i = 0; i < ssoURLs.length; i++) {
				boolean isMatch = req.getRequestURI().contains(ssoURLs[i]);
				if (isMatch) {
					isExclude = isMatch;
					break;
				}
			}
		}
		return isExclude;
	}
}
