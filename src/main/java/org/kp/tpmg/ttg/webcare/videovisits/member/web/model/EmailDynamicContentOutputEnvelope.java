package org.kp.tpmg.ttg.webcare.videovisits.member.web.model;

import java.io.Serializable;

public class EmailDynamicContentOutputEnvelope implements Serializable {

	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private EmailDynamicContent emailDynamicContent;
	
	public EmailDynamicContent getInstructionalEmail() {
		return emailDynamicContent;
	}

	public void setInstructionalEmail(EmailDynamicContent emailDynamicContent) {
		this.emailDynamicContent = emailDynamicContent;
	}

	@Override
	public String toString() {
		return "EmailDynamicContentOutputEnvelope [emailDynamicContent=" + emailDynamicContent + "]";
	}

}
