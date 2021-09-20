package org.kp.tpmg.ttg.webcare.videovisits.member.web.model;

import java.io.Serializable;

public class EmailDynamicContent implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String meetingId;
	private String emailType;
	private String subject;
	private String mdoUrl;

	public String getMeetingId() {
		return meetingId;
	}

	public void setMeetingId(String meetingId) {
		this.meetingId = meetingId;
	}

	public String getEmailType() {
		return emailType;
	}

	public void setEmailType(String emailType) {
		this.emailType = emailType;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public String getMdoUrl() {
		return mdoUrl;
	}

	public void setMdoUrl(String mdoUrl) {
		this.mdoUrl = mdoUrl;
	}

	@Override
	public String toString() {
		return "EmailDynamicContent [meetingId=" + meetingId + ", emailType=" + emailType + ", subject=" + subject
				+ ", mdoUrl=" + mdoUrl + "]";
	}

}
