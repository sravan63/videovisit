package org.kp.tpmg.ttg.webcare.videovisits.member.web.model;

import java.io.Serializable;

public class Status implements Serializable {

	private static final long serialVersionUID = -5587074204635449114L;

	private String code;
	private String message;

	/**
	 * @return the code
	 */
	public String getCode() {
		return code;
	}

	/**
	 * @param code
	 *            the code to set
	 */
	public void setCode(String code) {
		this.code = code;
	}

	/**
	 * @return the message
	 */
	public String getMessage() {
		return message;
	}

	/**
	 * @param message
	 *            the message to set
	 */
	public void setMessage(String message) {
		this.message = message;
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "Status [code=" + code + ", message=" + message + "]";
	}

}
