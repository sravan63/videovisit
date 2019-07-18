package org.kp.tpmg.ttg.webcare.videovisits.member.web.filter;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import java.io.IOException;
import java.net.URLDecoder;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.service.DeviceDetectionService;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;

public class WebSessionFilter implements Filter {
	public static final Logger logger = Logger.getLogger(WebSessionFilter.class);

	private List<String> excludeUrlList = null;

	private Map<String, String> timeoutUrlMap = null;

	private Map<String, String> homePageUrlMap = null;

	public void destroy() {
		excludeUrlList = null;
		timeoutUrlMap = null;
		homePageUrlMap = null;
	}

	/**
	 * Method to handle the URL's, timeouts conditions
	 */
	public void doFilter(ServletRequest sreq, ServletResponse sresp, FilterChain chain)
			throws IOException, ServletException {
		logger.info(LOG_ENTERED);
		HttpServletRequest req;
		HttpServletResponse resp;

		req = (HttpServletRequest) sreq;
		resp = (HttpServletResponse) sresp;

		if (shouldExcludeUrl(req)) {

			/*
			 * Check if the user is accessing the app from mobile or web This
			 * case is handled to take care of patients or guests coming from
			 * email. The home page for patient is intro.htm
			 */
			logger.info("Exclude list");
			String requestUri = req.getRequestURI();
			logger.info("requestUri = " + requestUri);
			int startIndex = requestUri.lastIndexOf("/");
			int endIndex = requestUri.indexOf("?");

			if (endIndex != -1) {
				requestUri = requestUri.substring(startIndex + 1, endIndex);
			} else {
				requestUri = requestUri.substring(startIndex + 1);
			}
			String memberWebHomePageUrl1 = homePageUrlMap.get("homepage-member-web1");
			String memberWebHomePageUrl2 = homePageUrlMap.get("homepage-member-web2");
			String memberWebHomePageUrl3 = homePageUrlMap.get("homepage-member-web3");
//			String memberWebHomePageUrl4 = homePageUrlMap.get("homepage-member-web4");
			String memberMobileHomePageUrl = homePageUrlMap.get("homepage-member-mobile");
			String guestWebHomePageUrl = homePageUrlMap.get("homepage-guest-web");
			String guestMobileHomePageUrl = homePageUrlMap.get("homepage-guest-mobile");
			String guestMobileLoginPageUrl = homePageUrlMap.get("loginpage-guest-mobile");
			String memberWebSSOLoginPageUrl = homePageUrlMap.get("homepage-member-sso-web");
			String redirectToUrl;
			// Handle patient home page URL1
			logger.info("requesturi = " + requestUri + " memberWebHomePageUrl1 = " + memberWebHomePageUrl1
					+ " memberWebHomePageUrl2 = " + memberWebHomePageUrl2 + "  memberWebHomePageUrl3 = "
					+ memberWebHomePageUrl3 + " guestWebHomePageUrl = " + guestWebHomePageUrl);
			if (requestUri.contains(memberWebHomePageUrl1) || requestUri.contains(memberWebHomePageUrl2)
					|| requestUri.contains(memberWebHomePageUrl3)) {
				logger.info("memberwebpage");
				boolean isWirelessDeviceOrTablet = DeviceDetectionService.isWirelessDeviceorTablet(req);
				if (isWirelessDeviceOrTablet) {
					logger.info("before mobile redirect = " + memberMobileHomePageUrl);
					redirectToUrl = memberMobileHomePageUrl;
					resp.sendRedirect(redirectToUrl);
				} else {
					logger.info("before web redirect = " + memberWebHomePageUrl1);
					redirectToUrl = memberWebHomePageUrl1;
					req.getRequestDispatcher(redirectToUrl).forward(req, resp);
				}

			}
			// Handle guest home page URL
			else if (requestUri.equals(guestWebHomePageUrl)) {
				logger.info("patientguest ");
				boolean isWirelessDeviceOrTablet = DeviceDetectionService.isWirelessDeviceorTablet(req);
				String meetingCode = req.getParameter("meetingCode");
				if (isWirelessDeviceOrTablet) {
					String meetingVendorType = req.getParameter("vType");
					if ("v".equalsIgnoreCase(meetingVendorType)) {
						logger.info("before mobile home page redirect = " + memberMobileHomePageUrl);
						redirectToUrl = guestMobileHomePageUrl + "?meetingCode=" + meetingCode;
						resp.sendRedirect(redirectToUrl);
					} else {
						logger.info("before mobile login page redirect = " + guestMobileLoginPageUrl);
						redirectToUrl = guestMobileLoginPageUrl + "?meetingCode=" + meetingCode + "&vType="+meetingVendorType;
						resp.sendRedirect(redirectToUrl);
					}
					
				} else {
					redirectToUrl = guestWebHomePageUrl + "?meetingCode=" + meetingCode;
					req.getRequestDispatcher(redirectToUrl).forward(req, resp);
				}

			} else if ("setup.htm".equalsIgnoreCase(requestUri)) {
				logger.info("setup wizard request: " + requestUri);
				boolean isWirelessDeviceOrTablet = DeviceDetectionService.isWirelessDeviceorTablet(req);
				if (isWirelessDeviceOrTablet) {
					String meetingCode = req.getParameter("meetingCode");
					if (StringUtils.isNotBlank(meetingCode)) {
						redirectToUrl = memberMobileHomePageUrl + "?meetingCode=" + meetingCode;
						logger.info("before mobile guest home page redirect = " + redirectToUrl);
						resp.sendRedirect(redirectToUrl);
					} else {
						logger.info("before mobile member home page redirect = " + memberMobileHomePageUrl);
						redirectToUrl = memberMobileHomePageUrl;
						resp.sendRedirect(redirectToUrl);
					}
				} else {
					logger.info("before desktop member setup wizard");
					chain.doFilter(req, resp);
				}

			} else if ("mdohelp.htm".equalsIgnoreCase(requestUri)) {
				logger.info("help page request: " + requestUri);
				chain.doFilter(req, resp);
			} else {
				if (requestUri.contains("mobilepatientlightauth") || requestUri.contains("mobilepglightauth")) {
					Cookie memberContextCookie;
					Cookie cookies[] = req.getCookies();
					String value;
					boolean cookieNotFound = true;
					if (cookies != null) {
						logger.info("Cookies not null");
						for (int i = 0, n = cookies.length; i < n; i++) {
							memberContextCookie = cookies[i];
							if (memberContextCookie.getName().equals("memberContext")) {
								try {
									logger.info("memberContext cookie found");
									cookieNotFound = false;
									value = URLDecoder.decode(memberContextCookie.getValue(), "UTF-8");
									logger.info("memberContext cookie value " + value);
									String[] attrs = value.split("\\:");
									if (attrs != null && attrs.length > 0) {
										String isPatientGuest = attrs[0];
										String meetingCode = attrs[1];
										String location = attrs[2];
										logger.info(isPatientGuest + " " + meetingCode + " " + location);
										if ("false".equalsIgnoreCase(isPatientGuest)
												&& "landingPage".equalsIgnoreCase(location)) {
											logger.info("isPatientGuest is false and location is landingPage");
											req.getRequestDispatcher("mobilepatientlightauth.htm").forward(req, resp);
										} else if ("true".equalsIgnoreCase(isPatientGuest)
												&& "landingPagePG".equalsIgnoreCase(location)) {
											logger.info("isPatientGuest is true and location is landingPage "
													+ meetingCode);
											if (meetingCode != null && meetingCode.length() > 0) {
												req.setAttribute("meetingCode", meetingCode);
												resp.sendRedirect("mobilepglanding.htm?meetingCode=" + meetingCode);
											} else
												req.getRequestDispatcher("mobilevideovisitlanding.htm").forward(req,
														resp);
										}
									}
								} catch (Exception e) {
									logger.warn("Error while validating member context");
								}
								break;
							}
						}
					}

					if (cookieNotFound) {
						logger.info("cookie not found redirecting to mobile landing page");
						req.getRequestDispatcher("mobilevideovisitlanding.htm").forward(req, resp);
					}
				} else if (requestUri.contains(memberWebSSOLoginPageUrl)) {
					logger.info("memberWebSSOLoginPageUrl: " + memberWebSSOLoginPageUrl);
					boolean isWirelessDeviceOrTablet = DeviceDetectionService.isWirelessDeviceorTablet(req);
					if (isWirelessDeviceOrTablet) {
						logger.info("before mobile redirect = " + memberMobileHomePageUrl);
						redirectToUrl = memberMobileHomePageUrl;
						resp.sendRedirect(redirectToUrl);
					}
				}
				chain.doFilter(req, resp);
			}

		} else {
			HttpSession session = req.getSession(false);

			if (session == null)
				logger.info("session is null");
			else
				logger.info("session is not null");

			WebAppContext ctx = null;
			String timeoutUrl = getTimeoutUrl(req);
			String requestUri = req.getRequestURI();
			// Handle timeout condition
			if (session != null) {

				logger.info("session is not null timout: " + session.getMaxInactiveInterval());
				ctx = WebAppContext.getWebAppContext(req);
				// Timeout has not occurred, do normal processing
				if (ctx != null) {
					if (requestUri.contains("landingready") && ctx.getMemberDO() == null) {
						logger.info(
								"session is not null, webapp context is not null but member object in context is null, so redirecting to logout.");
						resp.sendRedirect("logout.htm");
					} else {
						// Handle the case of SSO sign off from kp.org or mdo
						if (ctx.getKpOrgSignOnInfo() != null) {
//							Cookie ssoCookie = WebUtil.getCookie(req, WebUtil.SSO_COOKIE_NAME);
							Cookie ssoCookie = WebUtil.getCookie(req, WebUtil.getSSOCookieName());
							if (ssoCookie == null
									|| ("loggedout".equalsIgnoreCase(ssoCookie.getValue())
											|| StringUtils.isBlank(ssoCookie.getValue()))) {
								if ("localhost".equalsIgnoreCase(req.getServerName()) || WebUtil.isSsoSimulation()) {
									logger.info("cookie validation not required for " + req.getServerName());
								} else {
									logger.info(
											"Member signed on using SSO - session is not null, webapp context is not null but cookie in request is not valid due to SSO sign off either from KP.org or MDO, so redirecting to SSO login.");
									boolean isSSOSignedOff = MeetingCommand.performSSOSignOff(req, resp);
									logger.info("isSSOSignedOff=" + isSSOSignedOff);
									resp.sendRedirect("logout.htm");
								}
							}

							if (ssoCookie != null && StringUtils.isNotBlank(ssoCookie.getValue())) {
								try {
									logger.info("sso cookie before decoding: " + ssoCookie.getValue());
									String ssoCookieVal = ssoCookie.getValue();//URLDecoder.decode(ssoCookie.getValue(), "UTF-8");
									logger.info("isAuthenticated in context: " + ctx.isAuthenticated());

									if (ctx.isAuthenticated()) {
										logger.info("already authenticated. validation is not required.");
										ctx.setAuthenticated(false);
									} else {
										logger.info("sso cookie: " + ssoCookieVal);
										String responseCode = MeetingCommand.validateKpOrgSSOSession(req,
												ssoCookieVal);
										if ("200".equalsIgnoreCase(responseCode)) {
											logger.info("sso session token from request cookie valid");
											// WebService.callKPKeepAliveUrl();
										} else {
											logger.info("invalid sso session token, navigating to SSO login page");
											boolean isSSOSignedOff = MeetingCommand.performSSOSignOff(req, resp);
											logger.info("isSSOSignedOff=" + isSSOSignedOff);
											if (requestUri.contains("videoVisit.htm")) {
												resp.sendError(HttpServletResponse.SC_FORBIDDEN);
											} else {
												resp.sendRedirect("logout.htm");
											}
										}
									}
								} catch (Exception ex) {
									logger.warn("Error while validating sso cookie");
								}
							}

						}
						chain.doFilter(req, resp);
					}
				} else {
					/*
					 * Based on mobile or web, redirect the user to the
					 * appropriate timeout URL Member Web - login.htm Member
					 * mobile- logout.htm
					 */

					logger.info("requestUri: " + requestUri);

					if (requestUri.contains("mobileAppPatientMeetings")) {
						resp.sendRedirect("mobileAppPatientLogin.htm");
					} else {
						logger.info("timeoutUrl: " + timeoutUrl);
						resp.sendRedirect(timeoutUrl);
					}
				}
			} else {
				// session is null
				logger.info("session is null");
				logger.info("requestUri: " + requestUri);

				if (requestUri.contains("mobileAppPatientMeetings")) {
					resp.sendRedirect("mobileAppPatientLogin.htm");
				} else {
					logger.info("timeoutUrl: " + timeoutUrl);
					resp.sendRedirect(timeoutUrl);
				}
			}

		}
		logger.info(LOG_EXITING);
	}

	/**
	 * Returns true if the request URI matches any of the excluded URL in the
	 * list
	 * 
	 * @param req
	 * @return true if the request URL matches the URL in the list
	 */
	private boolean shouldExcludeUrl(HttpServletRequest req) {
		boolean shouldExcludeUrl = false;

		if (!excludeUrlList.isEmpty()) {
			for (String excludeUrl : excludeUrlList) {
				boolean isMatch = req.getRequestURI().contains(excludeUrl);
				if (isMatch) {
					shouldExcludeUrl = isMatch;
					break;
				}
			}
		}
		return shouldExcludeUrl;
	}

	/**
	 * Get the login url based on the cookie set for the device type
	 * 
	 * @param request
	 * @return
	 */
	private String getTimeoutUrl(HttpServletRequest request) {

		logger.info(LOG_ENTERED);
		boolean isWirelessDeviceOrTablet = DeviceDetectionService.isWirelessDeviceorTablet(request);

		String showFullSite = request.getParameter("showFullSite");
		logger.info("showFullSite=" + showFullSite);

		String timeoutUrl = null;

		String mobileMemberTimeoutUrl = timeoutUrlMap.get("timeout-member-mobile");
		String webMemberLoginUrl = timeoutUrlMap.get("timeout-member-web");

		if (isWirelessDeviceOrTablet) {

			if (showFullSite != null && "true".equals(showFullSite)) {
				timeoutUrl = generateUrl(request, webMemberLoginUrl);
			} else {
				// Mobile Login url
				timeoutUrl = generateUrl(request, mobileMemberTimeoutUrl);
			}
		} else {
			// Web Application login Url
			timeoutUrl = generateUrl(request, webMemberLoginUrl);
		}

		logger.info(LOG_EXITING + "timeoutUrl=" + timeoutUrl);
		return timeoutUrl;

	}

	private String generateUrl(HttpServletRequest request, String prependUrl) {

		final StringBuilder sbUrl = new StringBuilder();

		String scheme = request.getScheme();
		String serverName = request.getServerName();
		int serverPort = request.getServerPort();
		String contextPath = request.getContextPath();

		sbUrl.append(scheme).append("://").append(serverName).append(":").append(serverPort).append(contextPath)
				.append("/");

		sbUrl.append(prependUrl);

		return sbUrl.toString();
	}

	/**
	 * This will contain a list of URL;s that needs to be excluded from
	 * processing by the filter
	 * 
	 * @return List of excluded URL's
	 */
	public List<String> getExcludeUrlList() {
		return excludeUrlList;
	}

	/**
	 * Set a list of URLs to be excluded by this filter This is set in the
	 * action-servlet.xml file
	 * 
	 * @param excludeUrlList
	 */
	public void setExcludeUrlList(List<String> urlList) {
		if (urlList == null) {
			this.excludeUrlList = Collections.emptyList();
		} else {
			this.excludeUrlList = urlList;
		}
	}

	/**
	 * Map containing timeout URLs for mobile and web for member and guest This
	 * is set in the action-servlet.xml file Member Web - login.htm Member
	 * mobile- logout.htm
	 * 
	 * @return map of timeout URLS
	 * @author arunwagle
	 */
	public Map<String, String> getTimeoutUrlMap() {
		return timeoutUrlMap;
	}

	/**
	 * Map containing timeout URLs for mobile and web for member and guest This
	 * is set in the action-servlet.xml file
	 * 
	 * @param timeoutUrlMap
	 * @author arunwagle
	 */
	public void setTimeoutUrlMap(Map<String, String> timeoutUrlMap) {
		this.timeoutUrlMap = timeoutUrlMap;
	}

	/**
	 * Map containing the home page url's for member and guest
	 * 
	 * @return
	 * @author arunwagle
	 */
	public Map<String, String> getHomePageUrlMap() {
		return homePageUrlMap;
	}

	public void setHomePageUrlMap(Map<String, String> homePageUrlMap) {
		this.homePageUrlMap = homePageUrlMap;
	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
		// TODO Auto-generated method stub

	}

}
