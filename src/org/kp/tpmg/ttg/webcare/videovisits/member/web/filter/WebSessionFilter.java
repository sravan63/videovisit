package org.kp.tpmg.ttg.webcare.videovisits.member.web.filter;

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
import org.kp.tpmg.ttg.webcare.videovisits.member.web.service.WebService;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;

public class WebSessionFilter implements Filter
{
	public static Logger logger = Logger
		.getLogger(WebSessionFilter.class);

	
	
	private List<String> excludeUrlList = null;
	
	private Map<String, String> timeoutUrlMap = null;
	
	private Map<String, String> homePageUrlMap = null;
	
	

	
	public void destroy(){
		excludeUrlList = null;
		timeoutUrlMap = null;
		homePageUrlMap = null;
	}
	
	/**
	 * Method to handle the URL's, timeouts conditions
	 */
	public void doFilter(ServletRequest sreq, ServletResponse sresp,
			FilterChain chain) throws IOException, ServletException
	{
		logger.info("WebSessionFilter" );
		HttpServletRequest req;
		HttpServletResponse resp;
	
		req = (HttpServletRequest) sreq;
		resp = (HttpServletResponse) sresp;
		
		
		
		if (shouldExcludeUrl(req)){
			
			/*
			 *  Check if the user is accessing the app from mobile or web
			 *  This case is handled to take care of patients or guests coming from email.
			 *  The home page for patient is intro.htm
			 */
			logger.info("WebSessionFilter exclude list" );
			String requestUri = req.getRequestURI();
			logger.info("requestUri = " + requestUri);
			int startIndex = requestUri.lastIndexOf("/");
			int endIndex = requestUri.indexOf("?");
			
			if(endIndex != -1){
				requestUri = requestUri.substring(startIndex + 1, endIndex);
			}
			else{
				requestUri = requestUri.substring(startIndex + 1);
			}
			logger.info("======Request URI:" + requestUri);
			String memberWebHomePageUrl1= homePageUrlMap.get("homepage-member-web1");
			String memberWebHomePageUrl2= homePageUrlMap.get("homepage-member-web2");
			String memberWebHomePageUrl3= homePageUrlMap.get("homepage-member-web3");
			String memberWebHomePageUrl4= homePageUrlMap.get("homepage-member-web4");
			String memberMobileHomePageUrl = homePageUrlMap.get("homepage-member-mobile");
			String guestWebHomePageUrl = homePageUrlMap.get("homepage-guest-web");
			String guestMobileHomePageUrl = homePageUrlMap.get("homepage-guest-mobile");
			String memberWebSSOLoginPageUrl = homePageUrlMap.get("homepage-member-sso-web");
			String redirectToUrl = null;
			// Handle patient home page URL1
			logger.info("WebSessionFilter requesturi = " + requestUri + " memberWebHomePageUrl1 = " + memberWebHomePageUrl1 + " memberWebHomePageUrl2 = " + memberWebHomePageUrl2 + "  memberWebHomePageUrl3 = " + memberWebHomePageUrl3 + " guestWebHomePageUrl = " + guestWebHomePageUrl);
			if(requestUri.contains(memberWebHomePageUrl1) || requestUri.contains(memberWebHomePageUrl2) || requestUri.contains(memberWebHomePageUrl3) ){
				logger.info("WebSessionFilter memberwebpage" );
				boolean isWirelessDeviceOrTablet = DeviceDetectionService.isWirelessDeviceorTablet(req);
				if(isWirelessDeviceOrTablet){
					logger.info("before mobile redirect = " + memberMobileHomePageUrl);
					redirectToUrl = memberMobileHomePageUrl;
					resp.sendRedirect(redirectToUrl);
				}
				else{
					logger.info("before web redirect = " + memberWebHomePageUrl1);
					redirectToUrl = memberWebHomePageUrl1;
					req.getRequestDispatcher(redirectToUrl).forward(req, resp);
				}
				
				//req.getRequestDispatcher(redirectToUrl).forward(req, resp);
			}
			// Handle guest home page URL
			else if(requestUri.equals(guestWebHomePageUrl)){
				logger.info("WebSessionFilter patientguest " );
				boolean isWirelessDeviceOrTablet = DeviceDetectionService.isWirelessDeviceorTablet(req);
				String meetingCode = req.getParameter("meetingCode");
				if(isWirelessDeviceOrTablet){
					redirectToUrl = guestMobileHomePageUrl + "?meetingCode=" + meetingCode;
					resp.sendRedirect(redirectToUrl);
				}
				else{
					redirectToUrl = guestWebHomePageUrl + "?meetingCode=" + meetingCode;
					req.getRequestDispatcher(redirectToUrl).forward(req, resp);	
				}
				//req.getRequestDispatcher(redirectToUrl).forward(req, resp);	
				
			}
			else if("setup.htm".equalsIgnoreCase(requestUri)){
				logger.info("WebSessionFilter setup wizard request: " +  requestUri);
				boolean isWirelessDeviceOrTablet = DeviceDetectionService.isWirelessDeviceorTablet(req);				
				if(isWirelessDeviceOrTablet){
					String meetingCode = req.getParameter("meetingCode");
					if(StringUtils.isNotBlank(meetingCode))
					{
						redirectToUrl = memberMobileHomePageUrl + "?meetingCode=" + meetingCode;
						logger.info("WebSessionFilter before mobile guest home page redirect = " + redirectToUrl);
						resp.sendRedirect(redirectToUrl);
					}
					else{
						logger.info("WebSessionFilter before mobile member home page redirect = " + memberMobileHomePageUrl);
						redirectToUrl = memberMobileHomePageUrl;
						resp.sendRedirect(redirectToUrl);
					}
				}
				else{
					logger.info("WebSessionFilter before desktop member setup wizard");
					chain.doFilter(req, resp);
				}	
				
			}
			else if("mdohelp.htm".equalsIgnoreCase(requestUri)){
				logger.info("WebSessionFilter help page request: " +  requestUri);
				chain.doFilter(req, resp);					
			}
			else{
				logger.info("WebSessionFilter in else");
				if(requestUri.contains("mobilepatientlightauth") || requestUri.contains("mobilepglightauth"))
				{
					//boolean isWirelessDeviceOrTablet = DeviceDetectionService.isWirelessDeviceorTablet(req);
					Cookie memberContextCookie = null;
					Cookie cookies[] = req.getCookies();
					String value;
					boolean cookieNotFound = true;
					if (cookies != null) {
					  logger.info("WebSessionFilter ---> Cookies not null");
					  for(int i=0, n=cookies.length; i < n; i++) {
						  memberContextCookie = cookies[i];
					    if (memberContextCookie.getName().equals("memberContext")) {
					      try {
					    	  logger.info("memberContext cookie found");
					    	  cookieNotFound = false;
					    	  value = URLDecoder.decode(memberContextCookie.getValue(), "UTF-8");
					    	  logger.info("memberContext cookie value "+ value);
					    	  String[] attrs = value.split("\\:");
					    	  if (attrs != null && attrs.length > 0)
					    	  {
					    		  String isPatientGuest = attrs[0];
					    		  String meetingCode = attrs[1];
					    		  String location = attrs[2];
					    		  logger.info(isPatientGuest + " " + meetingCode + " " + location);
					    		  if (isPatientGuest.equalsIgnoreCase("false") && location.equalsIgnoreCase("landingPage"))
					    		  {
					    			  logger.info("isPAtientGuest is false and location is landingPage");
					    			  req.getRequestDispatcher("mobilepatientlightauth.htm").forward(req, resp);
					    		  }
					    		  else if (isPatientGuest.equalsIgnoreCase("true") && location.equalsIgnoreCase("landingPagePG"))
					    		  {
					    			  logger.info("isPAtientGuest is true and location is landingPage " + meetingCode);
					    			  if ( meetingCode != null && meetingCode.length() > 0)
					    			  {
					    				  req.setAttribute("meetingCode", meetingCode);
					    				  //req.getRequestDispatcher("mobilepglightauth.htm?meetingCode=" + meetingCode).forward(req, resp);
					    				 // req.getRequestDispatcher("mobilepglanding.htm?meetingCode=" + meetingCode).forward(req, resp);
					    				  resp.sendRedirect("mobilepglanding.htm?meetingCode=" + meetingCode);
					    			  }
					    			  else
					    				  req.getRequestDispatcher("mobilevideovisitlanding.htm").forward(req, resp);
					    		  }
					    	  }
					      } catch (Exception e) {
					       
					      }
					      break;
					    }
					  }
					}
					
					if ( cookieNotFound)
					{
						logger.info("cookie not found redirecting to mobile landing page");
						req.getRequestDispatcher("mobilevideovisitlanding.htm").forward(req, resp);
					}
				}
				else if(requestUri.contains(memberWebSSOLoginPageUrl))
				{
					logger.info("WebSessionFilter memberWebSSOLoginPageUrl: " + memberWebSSOLoginPageUrl );
					boolean isWirelessDeviceOrTablet = DeviceDetectionService.isWirelessDeviceorTablet(req);
					if(isWirelessDeviceOrTablet){
						logger.info("before mobile redirect = " + memberMobileHomePageUrl);
						redirectToUrl = memberMobileHomePageUrl;
						resp.sendRedirect(redirectToUrl);
					}					
				}
				chain.doFilter(req, resp);
			}
	
		}
		else{
			logger.info(" in the else WebSessionFilter");
			HttpSession session = req.getSession(false);
			
			if (session == null)
				logger.info("web session filter else session is null");
			else
				logger.info("web session filter else session is not null");
			
			WebAppContext ctx = null;
			String timeoutUrl = getTimeoutUrl(req);
			String requestUri = req.getRequestURI();
			// Handle timeout condition
			if(session != null){
				
				logger.info("session is not null timout: " + session.getMaxInactiveInterval());
				ctx  	= WebAppContext.getWebAppContext(req);
				// Timeout has not occurred, do normal processing
				if (ctx != null) {
					if(requestUri.contains("landingready") && ctx.getMember() == null)
					{
						logger.info("WebSessionFilter -> session is not null, webapp context is not null but member object in context is null, so redirecting to logout.");
						resp.sendRedirect("logout.htm");
					}
					else
					{
						//Handle the case of SSO sign off from kp.org or mdo
						if(ctx.getKpOrgSignOnInfo() != null)
						{
							Cookie ssoCookie = WebUtil.getCookie(req, WebUtil.SSO_COOKIE_NAME);
							
							if(ssoCookie == null || (ssoCookie != null && ("loggedout".equalsIgnoreCase(ssoCookie.getValue()) || StringUtils.isBlank(ssoCookie.getValue()))))
							{
								if("localhost".equalsIgnoreCase(req.getServerName()) || "ttg-dev-app-01.har.ca.kp.org".equalsIgnoreCase(req.getServerName()))
								{
									logger.info("WebSessionFilter -> cookie validation not required for " + req.getServerName());
								}
								else
								{
									logger.info("WebSessionFilter -> Member signed on using SSO - session is not null, webapp context is not null but cookie in request is not valid due to SSO sign off either from KP.org or MDO, so redirecting to SSO login.");
									boolean isSSOSignedOff = MeetingCommand.performSSOSignOff(req, resp);
									logger.info("WebSessionFilter -> isSSOSignedOff=" + isSSOSignedOff);
									resp.sendRedirect("logout.htm");
								}
							}	
							
							if(ssoCookie != null && StringUtils.isNotBlank(ssoCookie.getValue()))
							{
								try
								{
									String ssoCookieVal = URLDecoder.decode(ssoCookie.getValue(), "UTF-8");
									logger.info("WebSessionFilter -> isAuthenticated in context: " + ctx.isAuthenticated());
									
									if(ctx.isAuthenticated())
									{
										logger.info("WebSessionFilter -> already authenticated. validation is not required.");
										ctx.setAuthenticated(false);
									}
									else
									{
										String responseCode = MeetingCommand.validateKpOrgSSOSession(req, resp, ssoCookieVal);
										if("200".equalsIgnoreCase(responseCode))
										{
											logger.info("WebSessionFilter -> sso session token from request cookie valid");
											//WebService.callKPKeepAliveUrl();
										}
										else
										{
											logger.info("WebSessionFilter -> invalid sso session token, navigating to SSO login page");
											boolean isSSOSignedOff = MeetingCommand.performSSOSignOff(req, resp);
											logger.info("WebSessionFilter -> isSSOSignedOff=" + isSSOSignedOff);
											resp.sendRedirect("logout.htm");
										}
									}
								}
								catch(Exception ex)
								{
									
								}
							}			
								
						}
						chain.doFilter(req, resp);
					}
				}
				else{
					/*
					 *  Based on mobile or web, redirect the user to the appropriate timeout URL
					 *   Member Web - login.htm
					 *   Member mobile- logout.htm
					 */					
					
					logger.info("requestUri: " +requestUri);
					
					if(requestUri.contains("mobileAppPatientMeetings")){
						resp.sendRedirect("mobileAppPatientLogin.htm");
					}
					else{
						logger.info("WebSessionInterceptor: doFilter: timeoutUrl: " + timeoutUrl);
						resp.sendRedirect(timeoutUrl);
					}
				}
			}
			else{
				// session is null
				logger.info("session is null");
				logger.info("requestUri: " +requestUri);
				
				if(requestUri.contains("mobileAppPatientMeetings")){
					resp.sendRedirect("mobileAppPatientLogin.htm");
				}
				else{
					logger.info("WebSessionInterceptor: doFilter: timeoutUrl: " + timeoutUrl);
					resp.sendRedirect(timeoutUrl);
				}
			}
			
		}


	}
	
	
	/**
	 * Returns true if the request URI matches any of the excluded URL in the list
	 * @param req
	 * @return	true if the request URL matches the URL in the list
	 */
	private boolean shouldExcludeUrl(HttpServletRequest req) {
		boolean shouldExcludeUrl = false;
		
		if (!excludeUrlList.isEmpty()) {
			for(String excludeUrl: excludeUrlList){
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
	 * @param request
	 * @return
	 */
	private String getTimeoutUrl(HttpServletRequest request){

		logger.info("Entering WebSessionFilter:getLoginUrl");
		boolean isWirelessDeviceOrTablet = DeviceDetectionService.isWirelessDeviceorTablet(request);

		String showFullSite= request.getParameter("showFullSite");
		logger.info("WebSessionFilter:getLoginUrl:showFullSite=" + showFullSite);
		
		String timeoutUrl = null;
		
		String mobileMemberTimeoutUrl = timeoutUrlMap.get("timeout-member-mobile");
		String webMemberLoginUrl = timeoutUrlMap.get("timeout-member-web");
		
		
		if(isWirelessDeviceOrTablet){
			
			if((showFullSite != null && "true".equals(showFullSite))){
				timeoutUrl = generateUrl(request, webMemberLoginUrl);
			}
			else{
				// Mobile Login url
				timeoutUrl = generateUrl(request, mobileMemberTimeoutUrl);
			}
		}
		else{
			//Web Application login Url
			timeoutUrl = generateUrl(request, webMemberLoginUrl);
		}
		
		
		logger.info("Exiting WebSessionFilter:getTimeoutUrl:timeoutUrl=" + timeoutUrl);
		return timeoutUrl;
		
	}

	private String generateUrl(HttpServletRequest request, String prependUrl){
		
		StringBuffer sbUrl = new StringBuffer();
		
		
		String scheme = request.getScheme();
		String serverName = request.getServerName();
		int serverPort = request.getServerPort();
		String contextPath = request.getContextPath();
		
		sbUrl.append(scheme).append("://")
		.append(serverName).append( ":").append(serverPort)
		.append(contextPath).append("/");
		
		sbUrl.append(prependUrl);
		
		
		return sbUrl.toString();
	}
	
	
	/**
	 * This will contain a list of URL;s that needs to be excluded from processing by the filter
	 * @return	List of excluded URL's
	 */
	public List<String> getExcludeUrlList() {
		return excludeUrlList;
	}

	/**
	 * Set a list of URLs to be excluded by this filter
	 * This is set in the action-servlet.xml file
	 * @param excludeUrlList
	 */
	public void setExcludeUrlList(List<String> urlList) {
		if(urlList == null){
			this.excludeUrlList= Collections.emptyList();
		}
		else{
			this.excludeUrlList = urlList;
		}
	}

	/**
	 *	Map containing timeout URLs for mobile and web for member and guest
	 *	This is set in the action-servlet.xml file
	 *	Member Web - login.htm
	 *	Member mobile- logout.htm
	 * 	@return	map of timeout URLS
	 * 	@author arunwagle
	 */
	public Map<String, String> getTimeoutUrlMap() {
		return timeoutUrlMap;
	}

	/**
	 * 	Map containing timeout URLs for mobile and web for member and guest
	 *	This is set in the action-servlet.xml file
	 * 	@param timeoutUrlMap
	 * 	@author arunwagle
	 */
	public void setTimeoutUrlMap(Map<String, String> timeoutUrlMap) {
		this.timeoutUrlMap = timeoutUrlMap;
	}

	/**
	 * Map containing the home page url's for member and guest
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
