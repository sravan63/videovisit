package org.kp.tpmg.ttg.webcare.videovisits.member.web.context;

import javax.servlet.http.HttpServletRequest;
import org.kp.tpmg.videovisit.member.serviceapi.webserviceobject.xsd.*;

import org.apache.log4j.Logger;


public class WebAppContext {

	public static Logger logger = Logger.getLogger(WebAppContext.class);
	
	//String contextId;
	public MemberWSO	member = null;	 
	public MeetingWSO	meeting= null; 
	
	public static final String HTTP_SESSION_KEY = "WebAppContext";
	
	public static WebAppContext getWebAppContext(HttpServletRequest request) {
		return (WebAppContext) request.getSession().getAttribute(WebAppContext.HTTP_SESSION_KEY);
	}

	public static void setWebAppContext(HttpServletRequest request, WebAppContext ctx) {
		request.getSession().setAttribute(WebAppContext.HTTP_SESSION_KEY, ctx);
	}

	public MemberWSO getMember() {
		return member;
	}

	public void setMember(MemberWSO member) {
		this.member = member;
	}
	public MeetingWSO getMeeting() {
		return meeting;
	}

	public void setMeeting(MeetingWSO meeting) {
		this.meeting = meeting;
	}


}
