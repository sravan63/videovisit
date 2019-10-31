package org.kp.tpmg.ttg.webcare.videovisits.member.web.model;

import java.io.Serializable;

public class CommonOutputJson implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1165756879695949353L;
	private CommonOutput<?> service;
	/**
	 * @return the service
	 */
	public CommonOutput<?> getService() {
		return service;
	}
	/**
	 * @param service the service to set
	 */
	public void setService(CommonOutput<?> service) {
		this.service = service;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "CommonOutputJson [service=" + service + "]";
	}
	
	
}
