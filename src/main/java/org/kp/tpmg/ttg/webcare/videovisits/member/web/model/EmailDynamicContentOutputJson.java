package org.kp.tpmg.ttg.webcare.videovisits.member.web.model;

import java.io.Serializable;

public class EmailDynamicContentOutputJson  implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private EmailDynamicContentOutput service;

	public EmailDynamicContentOutput getService() {
		return service;
	}

	public void setService(EmailDynamicContentOutput service) {
		this.service = service;
	}

	@Override
	public String toString() {
		return "EmailDynamicContentOutputJson [service=" + service + "]";
	}
	
	
	
}
