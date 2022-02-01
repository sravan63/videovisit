package org.kp.tpmg.ttg.webcare.videovisits.member.web.data;

import java.io.Serializable;

public class FailureInfo implements Serializable {


	private static final long serialVersionUID = -5638723208686948988L;
	
	private boolean authenticationfailed;
	private boolean accountlocked;
	private boolean unauthorized;
	private String errorCode;
	private String errorMsg;

	/**
	 * @return the authenticationfailed
	 */
	public boolean isAuthenticationfailed() {
		return authenticationfailed;
	}

	/**
	 * @param authenticationfailed
	 *            the authenticationfailed to set
	 */
	public void setAuthenticationfailed(boolean authenticationfailed) {
		this.authenticationfailed = authenticationfailed;
	}

	/**
	 * @return the accountlocked
	 */
	public boolean isAccountlocked() {
		return accountlocked;
	}

	/**
	 * @param accountlocked
	 *            the accountlocked to set
	 */
	public void setAccountlocked(boolean accountlocked) {
		this.accountlocked = accountlocked;
	}

	/**
	 * @return the unauthorized
	 */
	public boolean isUnauthorized() {
		return unauthorized;
	}

	/**
	 * @param unauthorized
	 *            the unauthorized to set
	 */
	public void setUnauthorized(boolean unauthorized) {
		this.unauthorized = unauthorized;
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
	 * @return the errorMsg
	 */
	public String getErrorMsg() {
		return errorMsg;
	}

	/**
	 * @param errorMsg
	 *            the errorMsg to set
	 */
	public void setErrorMsg(String errorMsg) {
		this.errorMsg = errorMsg;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "FailureInfo [authenticationfailed=" + authenticationfailed + ", accountlocked=" + accountlocked
				+ ", unauthorized=" + unauthorized + ", errorCode=" + errorCode + ", errorMsg=" + errorMsg + "]";
	}

}
