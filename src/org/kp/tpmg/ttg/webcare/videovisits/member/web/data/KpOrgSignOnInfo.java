package org.kp.tpmg.ttg.webcare.videovisits.member.web.data;

import java.io.Serializable;
import java.util.List;

public class KpOrgSignOnInfo implements Serializable {


	private static final long serialVersionUID = 404822168416110740L;
	
	private String systemError;
	private List<Object> interruptList;
	private boolean success;
	private String businessError;
	private UserInfo user;
	private FailureInfo failureInfo;
	private String ssoSession;

	/**
	 * @return the systemError
	 */
	public String getSystemError() {
		return systemError;
	}

	/**
	 * @param systemError
	 *            the systemError to set
	 */
	public void setSystemError(String systemError) {
		this.systemError = systemError;
	}

	/**
	 * @return the interruptList
	 */
	public List<Object> getInterruptList() {
		return interruptList;
	}

	/**
	 * @param interruptList
	 *            the interruptList to set
	 */
	public void setInterruptList(List<Object> interruptList) {
		this.interruptList = interruptList;
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
	 * @return the businessError
	 */
	public String getBusinessError() {
		return businessError;
	}

	/**
	 * @param businessError
	 *            the businessError to set
	 */
	public void setBusinessError(String businessError) {
		this.businessError = businessError;
	}

	/**
	 * @return the user
	 */
	public UserInfo getUser() {
		return user;
	}

	/**
	 * @param user
	 *            the user to set
	 */
	public void setUser(UserInfo user) {
		this.user = user;
	}

	/**
	 * @return the failureInfo
	 */
	public FailureInfo getFailureInfo() {
		return failureInfo;
	}

	/**
	 * @param failureInfo
	 *            the failureInfo to set
	 */
	public void setFailureInfo(FailureInfo failureInfo) {
		this.failureInfo = failureInfo;
	}

	/**
	 * @return the ssoSession
	 */
	public String getSsoSession() {
		return ssoSession;
	}

	/**
	 * @param ssoSession
	 *            the ssoSession to set
	 */
	public void setSsoSession(String ssoSession) {
		this.ssoSession = ssoSession;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "KpOrgSignOnInfo [systemError=" + systemError + ", interruptList=" + interruptList + ", success="
				+ success + ", businessError=" + businessError + ", user=" + user + ", failureInfo=" + failureInfo
				+ ", ssoSession=" + ssoSession + "]";
	}

}
