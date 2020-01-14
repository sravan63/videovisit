package org.kp.tpmg.ttg.webcare.videovisits.member.web.data;

import java.io.Serializable;

public class KpOrgAuthMember implements Serializable {

	private static final long serialVersionUID = 6998979965466284418L;
	
	private MemberAuthResponseStatus memberAuthResponseStatus;
	private MemberInfo memberInfo;
	private String ssoSession;

	/**
	 * @return the memberAuthResponseStatus
	 */
	public MemberAuthResponseStatus getMemberAuthResponseStatus() {
		return memberAuthResponseStatus;
	}

	/**
	 * @param memberAuthResponseStatus
	 *            the memberAuthResponseStatus to set
	 */
	public void setMemberAuthResponseStatus(MemberAuthResponseStatus memberAuthResponseStatus) {
		this.memberAuthResponseStatus = memberAuthResponseStatus;
	}

	/**
	 * @return the memberInfo
	 */
	public MemberInfo getMemberInfo() {
		return memberInfo;
	}

	/**
	 * @param memberInfo
	 *            the memberInfo to set
	 */
	public void setMemberInfo(MemberInfo memberInfo) {
		this.memberInfo = memberInfo;
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

}