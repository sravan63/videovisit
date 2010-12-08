package org.kp.tpmg.ttg.webcare.videovisits.member.web.filter;

import java.io.IOException;

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
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;

public class DataSessionFilter implements Filter
{
	public static Logger logger = Logger
		.getLogger(DataSessionFilter.class);

	private FilterConfig config = null;
	private String[] excludeURLs = null;

	public void init(FilterConfig config) throws ServletException
	{
		logger.info("Inside DataSessionFilter - init()->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
		this.config = config;
		//exclude the activity and USDA food search ajax urls
		String s = config.getInitParameter("excludeURL");
		excludeURLs = StringUtils.split(s, ",");
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
		
		if (!isExclude(req)) {  //if the url is not in excluded list
			if (ss == null) {
				//session expired, return expiration message
					logger.info("Inside DataSessionFilter.doFilter Session expired forwarding to>>>>>>>>>>>>>>>>>>>>"
							+ "/logout.htm");
					RequestDispatcher rd = req.getRequestDispatcher("/login.htm");
					rd.forward(req, resp);
			} else if (WebAppContext.getWebAppContext(req)== null) {

				//user was logged out, return empty response
				logger.info("Inside DataSessionFilter.doFilter user is logged out, returning empty response");
				RequestDispatcher rd = req.getRequestDispatcher("/error.htm");
				rd.forward(req, resp);
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
	
}
