package org.kp.tpmg.ttg.webcare.videovisits.member.web.filter;

import java.io.IOException;

import java.util.Enumeration;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;

public class RequestLoggingFilter implements Filter {

	public static final Logger logger = Logger.getLogger(RequestLoggingFilter.class);

	public void init(FilterConfig config) throws ServletException {}
	
	public void destroy() {}
	
	public void doFilter(ServletRequest sreq, ServletResponse sresp, FilterChain chain) throws IOException, ServletException {
		HttpServletRequest request = (HttpServletRequest) sreq;
		final StringBuilder sb = new StringBuilder();
		sb.append("CLIENT SIDE REQUEST: ");
		sb.append(request.getRequestURL());
		logger.info(sb); 
		String queryString = request.getQueryString();
		if (queryString != null) {
			sb.append("?");
			sb.append(queryString);
		}
		sb.append(" [");
		for (Enumeration<?> e = sreq.getParameterNames(); e.hasMoreElements(); ) {
			String s = (String) e.nextElement();
			sb.append(s).append("=").append(sreq.getParameter(s)).append(", ");
		}
		sb.append("]");
		logger.debug(sb);
		chain.doFilter(sreq, sresp);
	}
}
