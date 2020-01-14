package org.kp.tpmg.ttg.webcare.videovisits.member.web.data;

import java.io.Serializable;

public class MemberAuthResponseStatus implements Serializable {

	private static final long serialVersionUID = -4604000872943377783L;
	
	private String errorId;
	private String errorCode;
	private String errorMessage;
	private boolean success;
	private boolean systemFailure;

	/**
	 * @return the errorId
	 */
	public String getErrorId() {
		return errorId;
	}

	/**
	 * @param errorId
	 *            the errorId to set
	 */
	public void setErrorId(String errorId) {
		this.errorId = errorId;
	}

	/**
	 * @return the errorCode
	 */
	public String getErrorCode() {
		return errorCode;
	}

	/**
	 * @param errorCode
	 *            the errorCode to set
	 */
	public void setErrorCode(String errorCode) {
		this.errorCode = errorCode;
	}

	/**
	 * @return the errorMessage
	 */
	public String getErrorMessage() {
		return errorMessage;
	}

	/**
	 * @param errorMessage
	 *            the errorMessage to set
	 */
	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}

	/**
	 * @return the success
	 */
	public boolean isSuccess() {
		return success;
	}

	/**
	 * @param success
	 *            the success to set
	 */
	public void setSuccess(boolean success) {
		this.success = success;
	}

	/**
	 * @return the systemFailure
	 */
	public boolean isSystemFailure() {
		return systemFailure;
	}

	/**
	 * @param systemFailure
	 *            the systemFailure to set
	 */
	public void setSystemFailure(boolean systemFailure) {
		this.systemFailure = systemFailure;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "MemberAuthResponseStatus [errorId=" + errorId + ", errorCode=" + errorCode + ", errorMessage="
				+ errorMessage + ", success=" + success + ", systemFailure=" + systemFailure + "]";
	}

}
