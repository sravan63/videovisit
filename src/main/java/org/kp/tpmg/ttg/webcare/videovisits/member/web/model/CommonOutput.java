package org.kp.tpmg.ttg.webcare.videovisits.member.web.model;

import java.io.Serializable;

public class CommonOutput<T extends Serializable> implements Serializable {

	private static final long serialVersionUID = -2366122617297401527L;

	private String name;
	private VVResponse status;
	private T envelope;
	
	/**
	 * @return the name
	 */
	public String getName() {
		return name;
	}
	/**
	 * @param name the name to set
	 */
	public void setName(String name) {
		this.name = name;
	}
	/**
	 * @return the status
	 */
	public VVResponse getStatus() {
		return status;
	}
	/**
	 * @param status the status to set
	 */
	public void setStatus(VVResponse status) {
		this.status = status;
	}
	/**
	 * @return the envelope
	 */
	public T getEnvelope() {
		return envelope;
	}
	/**
	 * @param result the envelope to set
	 */
	public void setEnvelope(T result) {
		this.envelope = result;
	}
	@Override
	public String toString() {
		return "CommonOutput [name=" + name + ", status=" + status + ", envelope=" + envelope + "]";
	}
	
}
