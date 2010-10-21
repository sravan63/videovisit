package org.kp.tpmg.ttg.webcare.videovisits.member.web.context;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;


public class WebAppContext {

	public static Logger logger = Logger.getLogger(WebAppContext.class);
	
	String contextId;
	String firstName;
	String lastName;

	//TODO add additional properties that should be kept in the session here
	
	public static final String HTTP_SESSION_KEY = "WebAppContext";
	
	public static WebAppContext getWebAppContext(HttpServletRequest request) {
		return (WebAppContext) request.getSession().getAttribute(WebAppContext.HTTP_SESSION_KEY);
	}

	public static void setWebAppContext(HttpServletRequest request, WebAppContext ctx) {
		request.getSession().setAttribute(WebAppContext.HTTP_SESSION_KEY, ctx);
	}

	public String getContextId() {
		return contextId;
	}

	public void setContextId(String contextId) {
		this.contextId = contextId;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

}
