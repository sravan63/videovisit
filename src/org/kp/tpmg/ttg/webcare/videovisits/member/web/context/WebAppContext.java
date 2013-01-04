package org.kp.tpmg.ttg.webcare.videovisits.member.web.context;

import java.io.Serializable;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.kp.tpmg.videovisit.webserviceobject.xsd.*;

import org.apache.log4j.Logger;


public class WebAppContext implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public static Logger logger = Logger.getLogger(WebAppContext.class);
	
	private String contextId;
	private MemberWSO	member = null;	 
	private MeetingWSO[]	meetings= null; 
	private int totalmeetings = 0;	
	private String megaMeetingURL = null;
	private String megaMeetingMobileURL = null;
	private String clinicianSingleSignOnURL = null;
	
	public static final String HTTP_SESSION_KEY = "WebAppContext";
	
	public static WebAppContext getWebAppContext(HttpServletRequest request) {
		return (WebAppContext) request.getSession().getAttribute(WebAppContext.HTTP_SESSION_KEY);
	}
	
	public static WebAppContext getWebAppContext(HttpSession session) {
		return (WebAppContext) session.getAttribute(WebAppContext.HTTP_SESSION_KEY);
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
	public MeetingWSO[] getMeetings() {
		return meetings;
	}

	public void setMeetings(MeetingWSO[] meetings) {
		this.meetings = meetings;
	}
	public String getContextId() {
		return contextId;
	}

	public void setContextId(String contextId) {
		this.contextId = contextId;
	}
	public void setTotalmeetings(int total) {
		this.totalmeetings = total;
	}
	public int getTotalmeetings () {
		return totalmeetings;
	}	

	public String getMegaMeetingURL() {
		return megaMeetingURL;
	}
	public void setMegaMeetingURL(String megaMeetingURL) {
		this.megaMeetingURL = megaMeetingURL;
	}
	
	public long getTimestamp() {
		return System.currentTimeMillis() / 1000;
	}

	public String getMegaMeetingMobileURL() {
		return megaMeetingMobileURL;
	}

	public void setMegaMeetingMobileURL(String megaMeetingMobileURL) {
		this.megaMeetingMobileURL = megaMeetingMobileURL;
	}

	public String getClinicianSingleSignOnURL() {
		return clinicianSingleSignOnURL;
	}

	public void setClinicianSingleSignOnURL(String clinicianSingleSignOnURL) {
		this.clinicianSingleSignOnURL = clinicianSingleSignOnURL;
	} 
	
	
}
