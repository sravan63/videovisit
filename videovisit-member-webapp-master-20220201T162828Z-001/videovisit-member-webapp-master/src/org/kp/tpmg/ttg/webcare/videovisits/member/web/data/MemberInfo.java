package org.kp.tpmg.ttg.webcare.videovisits.member.web.data;

import java.io.Serializable;

public class MemberInfo implements Serializable {

	private static final long serialVersionUID = -4283469230181773877L;
	
	private String guid;
	private String mrn;
	private String uid;
	private String displayName;
	private String firstName;
	private String lastName;
	private String middleName;
	private String region;
	private String preferredFirstName;
	private String epicEmail;
	private String email;
	private String accountRole;
	private String accountRoleRegion;
	private String primaryRegion;

	/**
	 * @return the guid
	 */
	public String getGuid() {
		return guid;
	}

	/**
	 * @param guid
	 *            the guid to set
	 */
	public void setGuid(String guid) {
		this.guid = guid;
	}

	/**
	 * @return the mrn
	 */
	public String getMrn() {
		return mrn;
	}

	/**
	 * @param mrn
	 *            the mrn to set
	 */
	public void setMrn(String mrn) {
		this.mrn = mrn;
	}

	/**
	 * @return the uid
	 */
	public String getUid() {
		return uid;
	}

	/**
	 * @param uid
	 *            the uid to set
	 */
	public void setUid(String uid) {
		this.uid = uid;
	}

	/**
	 * @return the displayName
	 */
	public String getDisplayName() {
		return displayName;
	}

	/**
	 * @param displayName
	 *            the displayName to set
	 */
	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}

	/**
	 * @return the firstName
	 */
	public String getFirstName() {
		return firstName;
	}

	/**
	 * @param firstName
	 *            the firstName to set
	 */
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	/**
	 * @return the lastName
	 */
	public String getLastName() {
		return lastName;
	}

	/**
	 * @param lastName
	 *            the lastName to set
	 */
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	/**
	 * @return the middleName
	 */
	public String getMiddleName() {
		return middleName;
	}

	/**
	 * @param middleName
	 *            the middleName to set
	 */
	public void setMiddleName(String middleName) {
		this.middleName = middleName;
	}

	/**
	 * @return the region
	 */
	public String getRegion() {
		return region;
	}

	/**
	 * @param region
	 *            the region to set
	 */
	public void setRegion(String region) {
		this.region = region;
	}

	/**
	 * @return the preferredFirstName
	 */
	public String getPreferredFirstName() {
		return preferredFirstName;
	}

	/**
	 * @param preferredFirstName
	 *            the preferredFirstName to set
	 */
	public void setPreferredFirstName(String preferredFirstName) {
		this.preferredFirstName = preferredFirstName;
	}

	/**
	 * @return the epicEmail
	 */
	public String getEpicEmail() {
		return epicEmail;
	}

	/**
	 * @param epicEmail
	 *            the epicEmail to set
	 */
	public void setEpicEmail(String epicEmail) {
		this.epicEmail = epicEmail;
	}

	/**
	 * @return the email
	 */
	public String getEmail() {
		return email;
	}

	/**
	 * @param email
	 *            the email to set
	 */
	public void setEmail(String email) {
		this.email = email;
	}

	/**
	 * @return the accountRole
	 */
	public String getAccountRole() {
		return accountRole;
	}

	/**
	 * @param accountRole
	 *            the accountRole to set
	 */
	public void setAccountRole(String accountRole) {
		this.accountRole = accountRole;
	}

	/**
	 * @return the accountRoleRegion
	 */
	public String getAccountRoleRegion() {
		return accountRoleRegion;
	}

	/**
	 * @param accountRoleRegion
	 *            the accountRoleRegion to set
	 */
	public void setAccountRoleRegion(String accountRoleRegion) {
		this.accountRoleRegion = accountRoleRegion;
	}

	/**
	 * @return the primaryRegion
	 */
	public String getPrimaryRegion() {
		return primaryRegion;
	}

	/**
	 * @param primaryRegion
	 *            the primaryRegion to set
	 */
	public void setPrimaryRegion(String primaryRegion) {
		this.primaryRegion = primaryRegion;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "MemberInfo [guid=" + guid + ", mrn=" + mrn + ", uid=" + uid + ", displayName=" + displayName
				+ ", firstName=" + firstName + ", lastName=" + lastName + ", middleName=" + middleName + ", region="
				+ region + ", preferredFirstName=" + preferredFirstName + ", epicEmail=" + epicEmail + ", email="
				+ email + ", accountRole=" + accountRole + ", accountRoleRegion=" + accountRoleRegion
				+ ", primaryRegion=" + primaryRegion + "]";
	}

}
