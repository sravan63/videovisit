package org.kp.tpmg.ttg.webcare.videovisits.member.web.model;

import java.io.Serializable;

public class EmailDynamicContentOutput implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String name;
	private Status status;
	private EmailDynamicContentOutputEnvelope envelope;

	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public EmailDynamicContentOutputEnvelope getEnvelope() {
		return envelope;
	}

	public void setEnvelope(EmailDynamicContentOutputEnvelope envelope) {
		this.envelope = envelope;
	}

	@Override
	public String toString() {
		return "EmailDynamicContentOutput [name=" + name + ", status=" + status + ", envelope="
				+ envelope + "]";
	}

}
