package org.kp.tpmg.ttg.webcare.videovisits.member.web.model;

import java.io.Serializable;

public class VVResponse<T extends Serializable> implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 8525796355472485515L;
	private String name;
	private String statusCode;
	private String message;
	private T data;

	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	/**
	 * @return the code
	 */
	public String getCode() {
		return statusCode;
	}
	/**
	 * @param code the code to set
	 */
	public void setCode(String code) {
		this.statusCode = code;
	}
	/**
	 * @return the message
	 */
	public String getMessage() {
		return message;
	}
	/**
	 * @param message the message to set
	 */
	public void setMessage(String message) {
		this.message = message;
	}
	
	/**
	 * @return the data
	 */
	public T getData() {
		return data;
	}
	/**
	 * @param data the data to set
	 */
	public void setData(T data) {
		this.data = data;
	}

	@Override
	public String toString() {
		return "VVResponse [name=" + name + ", statusCode=" + statusCode + ", message=" + message + ", data=" + data
				+ "]";
	}

}
