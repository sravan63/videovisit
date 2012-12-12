package org.kp.tpmg.ttg.webcare.videovisits.member.web.filter;

import java.io.IOException;
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

import net.sourceforge.wurfl.core.Device;
import net.sourceforge.wurfl.core.WURFLHolder;
import net.sourceforge.wurfl.core.WURFLManager;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;

public class WebSessionFilter implements Filter
{
	public static Logger logger = Logger
		.getLogger(WebSessionFilter.class);

	private FilterConfig config = null;
	private String[] excludeURLs = null;
	private String mobileLoginUrl = null;
	private String webLoginUrl = null;
	
	private static String DEVICE_TYPE_COOKIE_NAME =  "isWirelessDeviceOrTablet";
	

	public void init(FilterConfig config) throws ServletException
	{
		logger.info("Inside WebSessionFilter - init()->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
		this.config = config;
		//exclude the standalone calorie counter url
		String s = config.getInitParameter("excludeURL");
		excludeURLs = StringUtils.split(s, ",");
		
		mobileLoginUrl = config.getInitParameter("mobileLoginURL");
		webLoginUrl = config.getInitParameter("webLoginURL");
	}
	
	public void destroy()
	{
		config = null;
	}
	
	public void doFilter(ServletRequest sreq, ServletResponse sresp,
			FilterChain chain) throws IOException, ServletException
	{
		
		HttpServletRequest req;
		HttpServletResponse resp;
	
		req = (HttpServletRequest) sreq;
		resp = (HttpServletResponse) sresp;
		
		HttpSession ss = req.getSession(false);
		

		if (!isExclude(req)) {
			WebAppContext ctx = null;
			if (ss != null) {
				ctx  	= WebAppContext.getWebAppContext(req);
				setDeviceTypeCookie(req, resp);
				
			}
			
			if (ctx == null) {
				
					String loginUrl = getLoginUrl(req);
				
					//  login url					
					logger
						.info("Inside WebSessionInterceptor.doFilter Session  expired forwarding to>>>>>>>>>>>>>>>>>>>>"
							+ loginUrl);
	
					
					// redirect to login page if the user is logged out.
					resp.sendRedirect(loginUrl);
			} else {
				chain.doFilter(req, resp);
			}
		} else {
			chain.doFilter(req, resp);
		}
	}
	
	private boolean isExclude(HttpServletRequest req) {
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
	
	
	
	private boolean isWirelessDeviceOrTablet(HttpServletRequest request){
		
		boolean isWirelessDeviceOrTablet = false;
		HttpSession session = request.getSession(false);

		WURFLHolder wurfl = (WURFLHolder)session.getServletContext().getAttribute(WURFLHolder.class.getName());
		
		WURFLManager manager = wurfl.getWURFLManager();

		Device device = manager.getDeviceForRequest(request);
		
		Map<String, String > capabilities = device.getCapabilities();
		logger.info("WebSessionFilter:isWirelessDeviceOrTablet:capabilities=" + capabilities);
		
		if("true".equals(capabilities.get("is_wireless_device")) || "true".equals(capabilities.get("is_tablet"))){
			isWirelessDeviceOrTablet = true;
		}
		logger.info("WebSessionFilter:isWirelessDeviceOrTablet:isWirelessDeviceOrTablet value" + isWirelessDeviceOrTablet);
		return isWirelessDeviceOrTablet;
	}
	
	/**
	 * Get the login url based on the cookie set for the device type
	 * @param request
	 * @return
	 */
	private String getLoginUrl(HttpServletRequest request){

		Cookie cookie = getCookie(request, DEVICE_TYPE_COOKIE_NAME);
		
		String isWirelessDeviceOrTablet = cookie.getValue();
		
		
		String showFullSite= request.getParameter("showFullSite");
		logger.info("WebSessionFilter:getLoginUrl:showFullSite=" + showFullSite);
		
		StringBuffer sbLoginUrl = new StringBuffer();
		
		
		String scheme = request.getScheme();
		String serverName = request.getServerName();
		int serverPort = request.getServerPort();
		String contextPath = request.getContextPath();
		
		sbLoginUrl.append(scheme).append("://")
		.append(serverName).append( ":").append(serverPort)
		.append(contextPath).append("/");
		
		if("true".equals(isWirelessDeviceOrTablet)){
			
			if((showFullSite != null && "true".equals(showFullSite))){
				sbLoginUrl.append(webLoginUrl);
			}
			else{
				// Mobile Login url
				sbLoginUrl.append(mobileLoginUrl);
			}
		}
		else{
			//Web Application login Url
			sbLoginUrl.append(webLoginUrl);
		}
		
		return sbLoginUrl.toString();
		
	}
	
	/**
	 * Set the device type cookie
	 * @param request
	 * @param response
	 */
	private void setDeviceTypeCookie(HttpServletRequest request, HttpServletResponse response){
		if(isWirelessDeviceOrTablet(request)){
			createCookie(request, response, DEVICE_TYPE_COOKIE_NAME, "true");
			System.out.println("1...cookie created");
		}
		else{
			System.out.println("2...cookie created");
			createCookie(request, response, DEVICE_TYPE_COOKIE_NAME, "false");
		}
	}
	
	/**
	 * Create cookie
	 * @param request
	 * @param response
	 * @param cookieName
	 * @param cookieValue
	 */
	private void createCookie(HttpServletRequest request, HttpServletResponse response,
			String cookieName, String cookieValue){
		
		Cookie cookie = getCookie(request, cookieName);
		System.out.println("1...createCookie:cookie="+ cookie);
		
		if(cookie == null){
			cookie = new Cookie(cookieName, cookieValue);
			System.out.println("222.:createCookie:cookie="+ cookie);
			cookie.setMaxAge(-1);
			
			
			response.addCookie(cookie);
		}
	
	}
	
	/**
	 * Get cookie based on the cookie name
	 * @param httpRequest
	 * @param cookieName
	 * @return
	 */
	private Cookie getCookie(HttpServletRequest httpRequest, String cookieName) {
		
        for (Cookie cookie : httpRequest.getCookies()) {
        	System.out.println("cookie name===="+ cookie.getName());
            if (StringUtils.equalsIgnoreCase(cookie.getName(), cookieName)) {
                return cookie;
            }
        }
        return null;
    }
	
	
	
	
	
}
