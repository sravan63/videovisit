package org.kp.tpmg.ttg.webcare.videovisits.member.web.model;

import java.io.Serializable;

public class EmailDynamicContent implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String meetingId;
	private String emailType;
	private String subject;
	private String mdoUrl;
	private String guestHelpUrl;
	private String meetingTime;
	private String meetingURL;
	private String memberLastName;
	private String memberFirstName;
	private String doctorLastName;
	private String doctorFirstName;
	private String doctorTitle;
	private String lastNameFirstCharMember;
	private String patientHelpUrl;
	private String patientJoinUrl;
	private String signInUrl;

	public String getMeetingId() {
		return meetingId;
	}

	public void setMeetingId(String meetingId) {
		this.meetingId = meetingId;
	}

	public String getEmailType() {
		return emailType;
	}

	public void setEmailType(String emailType) {
		this.emailType = emailType;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public String getMdoUrl() {
		return mdoUrl;
	}

	public void setMdoUrl(String mdoUrl) {
		this.mdoUrl = mdoUrl;
	}

	public String getGuestHelpUrl() {
		return guestHelpUrl;
	}

	public void setGuestHelpUrl(String guestHelpUrl) {
		this.guestHelpUrl = guestHelpUrl;
	}

	public String getMeetingTime() {
		return meetingTime;
	}

	public void setMeetingTime(String meetingTime) {
		this.meetingTime = meetingTime;
	}

	public String getMeetingURL() {
		return meetingURL;
	}

	public void setMeetingURL(String meetingURL) {
		this.meetingURL = meetingURL;
	}

	public String getMemberLastName() {
		return memberLastName;
	}

	public void setMemberLastName(String memberLastName) {
		this.memberLastName = memberLastName;
	}

	public String getMemberFirstName() {
		return memberFirstName;
	}

	public void setMemberFirstName(String memberFirstName) {
		this.memberFirstName = memberFirstName;
	}

	public String getDoctorLastName() {
		return doctorLastName;
	}

	public void setDoctorLastName(String doctorLastName) {
		this.doctorLastName = doctorLastName;
	}

	public String getDoctorFirstName() {
		return doctorFirstName;
	}

	public void setDoctorFirstName(String doctorFirstName) {
		this.doctorFirstName = doctorFirstName;
	}

	public String getDoctorTitle() {
		return doctorTitle;
	}

	public void setDoctorTitle(String doctorTitle) {
		this.doctorTitle = doctorTitle;
	}

	public String getLastNameFirstCharMember() {
		return lastNameFirstCharMember;
	}

	public void setLastNameFirstCharMember(String lastNameFirstCharMember) {
		this.lastNameFirstCharMember = lastNameFirstCharMember;
	}

	public String getPatientHelpUrl() {
		return patientHelpUrl;
	}

	public void setPatientHelpUrl(String patientHelpUrl) {
		this.patientHelpUrl = patientHelpUrl;
	}

	public String getPatientJoinUrl() {
		return patientJoinUrl;
	}

	public void setPatientJoinUrl(String patientJoinUrl) {
		this.patientJoinUrl = patientJoinUrl;
	}
	
	public String getSignInUrl() {
		return signInUrl;
	}

	public void setSignInUrl(String signInUrl) {
		this.signInUrl = signInUrl;
	}

    
}
