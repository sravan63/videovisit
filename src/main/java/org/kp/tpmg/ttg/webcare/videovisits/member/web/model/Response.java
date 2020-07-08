package org.kp.tpmg.ttg.webcare.videovisits.member.web.model;

import java.io.Serializable;

public class Response implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 8986638367232925316L;

	public String code;

	/**
	 * @return the code
	 */
	public String getCode() {
		return code;
	}

	/**
	 * @param code the code to set
	 */
	public void setCode(String code) {
		this.code = code;
	}

	@Override
	public String toString() {
		return "Response [code=" + code + "]";
	}
	
	
}
