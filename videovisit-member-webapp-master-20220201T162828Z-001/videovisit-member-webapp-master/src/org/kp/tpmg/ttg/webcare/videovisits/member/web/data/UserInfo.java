package org.kp.tpmg.ttg.webcare.videovisits.member.web.data;

import java.io.Serializable;
import java.util.List;

public class UserInfo implements Serializable {

	private static final long serialVersionUID = -7979788354969156371L;
	
	private String region;
	private String lastName;
	private String termsAndCondAccepted;
	private String activationStatusCode;
	private String preferredFirstName;
	private String guid;
	private String email;
	private List<Object> ebizAccountRoles;
	private String disabledReasonCode;
	private String firstName;
	private String epicEmail;
	private String serviceArea;
	private int age;

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
	 * @return the termsAndCondAccepted
	 */
	public String getTermsAndCondAccepted() {
		return termsAndCondAccepted;
	}

	/**
	 * @param termsAndCondAccepted
	 *            the termsAndCondAccepted to set
	 */
	public void setTermsAndCondAccepted(String termsAndCondAccepted) {
		this.termsAndCondAccepted = termsAndCondAccepted;
	}

	/**
	 * @return the activationStatusCode
	 */
	public String getActivationStatusCode() {
		return activationStatusCode;
	}

	/**
	 * @param activationStatusCode
	 *            the activationStatusCode to set
	 */
	public void setActivationStatusCode(String activationStatusCode) {
		this.activationStatusCode = activationStatusCode;
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
	 * @return the ebizAccountRoles
	 */
	public List<Object> getEbizAccountRoles() {
		return ebizAccountRoles;
	}

	/**
	 * @param ebizAccountRoles
	 *            the ebizAccountRoles to set
	 */
	public void setEbizAccountRoles(List<Object> ebizAccountRoles) {
		this.ebizAccountRoles = ebizAccountRoles;
	}

	/**
	 * @return the disabledReasonCode
	 */
	public String getDisabledReasonCode() {
		return disabledReasonCode;
	}

	/**
	 * @param disabledReasonCode
	 *            the disabledReasonCode to set
	 */
	public void setDisabledReasonCode(String disabledReasonCode) {
		this.disabledReasonCode = disabledReasonCode;
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
	 * @return the serviceArea
	 */
	public String getServiceArea() {
		return serviceArea;
	}

	/**
	 * @param serviceArea
	 *            the serviceArea to set
	 */
	public void setServiceArea(String serviceArea) {
		this.serviceArea = serviceArea;
	}

	/**
	 * @return the age
	 */
	public int getAge() {
		return age;
	}

	/**
	 * @param age
	 *            the age to set
	 */
	public void setAge(int age) {
		this.age = age;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "UserInfo [region=" + region + ", lastName=" + lastName + ", termsAndCondAccepted="
				+ termsAndCondAccepted + ", activationStatusCode=" + activationStatusCode + ", preferredFirstName="
				+ preferredFirstName + ", guid=" + guid + ", email=" + email + ", ebizAccountRoles=" + ebizAccountRoles
				+ ", disabledReasonCode=" + disabledReasonCode + ", firstName=" + firstName + ", epicEmail=" + epicEmail
				+ ", serviceArea=" + serviceArea + ", age=" + age + "]";
	}

}
