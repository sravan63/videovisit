package org.kp.tpmg.ttg.webcare.videovisits.member.web.model;

import java.io.Serializable;

import org.kp.tpmg.ttg.webcare.videovisits.member.web.data.KpOrgSignOnInfo;
import org.kp.ttg.sharedservice.domain.AuthorizeResponseVo;
import org.kp.ttg.sharedservice.domain.MemberInfo;

public class SSOSignOnInfo implements Serializable{

	private static final long serialVersionUID = 1434709043488380177L;

	private MemberInfo memberInfo;
	private KpOrgSignOnInfo kpOrgSignOnInfo;
	private String ssoSession;

	/**
	 * @return the memberInfo
	 */
	public MemberInfo getMemberInfo() {
		return memberInfo;
	}
	/**
	 * @param memberInfo the memberInfo to set
	 */
	public void setMemberInfo(MemberInfo memberInfo) {
		this.memberInfo = memberInfo;
	}
	/**
	 * @return the kpOrgSignOnInfo
	 */
	public KpOrgSignOnInfo getKpOrgSignOnInfo() {
		return kpOrgSignOnInfo;
	}
	/**
	 * @param kpOrgSignOnInfo the kpOrgSignOnInfo to set
	 */
	public void setKpOrgSignOnInfo(KpOrgSignOnInfo kpOrgSignOnInfo) {
		this.kpOrgSignOnInfo = kpOrgSignOnInfo;
	}
	/**
	 * @return the ssoSession
	 */
	public String getSsoSession() {
		return ssoSession;
	}
	/**
	 * @param ssoSession the ssoSession to set
	 */
	public void setSsoSession(String ssoSession) {
		this.ssoSession = ssoSession;
	}

}
