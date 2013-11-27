package org.kp.tpmg.ttg.webcare.videovisits.member.web.data;

import java.io.Serializable;

public class VideoVisitParamsDTO implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 3440770105989838012L;
	private String vidyoUrl;
	private String meetingId;
	private String userName;
	private String meetingCode;
	private String caregiverId;
	private String patientLastName;
	private String hostLastName;
	private String hostFirstName;
	private String hostTitle;
	
	public String getVidyoUrl() {
		return vidyoUrl;
	}
	public void setVidyoUrl(String vidyoUrl) {
		this.vidyoUrl = vidyoUrl;
	}
	public String getMeetingId() {
		return meetingId;
	}
	public void setMeetingId(String meetingId) {
		this.meetingId = meetingId;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getMeetingCode() {
		return meetingCode;
	}
	public void setMeetingCode(String meetingCode) {
		this.meetingCode = meetingCode;
	}
	public String getCaregiverId() {
		return caregiverId;
	}
	public void setCaregiverId(String caregiverId) {
		this.caregiverId = caregiverId;
	}
	public String getPatientLastName() {
		return patientLastName;
	}
	public void setPatientLastName(String patientLastName) {
		this.patientLastName = patientLastName;
	}

	public String getHostLastName() {
		return hostLastName;
	}
	public void setHostLastName(String hostLastName) {
		this.hostLastName = hostLastName;
	}
	public String getHostFirstName() {
		return hostFirstName;
	}
	public void setHostFirstName(String hostFirstName) {
		this.hostFirstName = hostFirstName;
	}
	public String getHostTitle() {
		return hostTitle;
	}
	public void setHostTitle(String hostTitle) {
		this.hostTitle = hostTitle;
	}
	
	@Override
	public String toString() {
		return "VideoVisitParamsDTO [vidyoUrl=" + vidyoUrl + ", meetingId="
				+ meetingId + ", userName=" + userName + ", meetingCode="
				+ meetingCode + ", caregiverId=" + caregiverId
				+ ", patientLastName=" + patientLastName + ", hostLastName="
				+ hostLastName + ", hostFirstName=" + hostFirstName
				+ ", hostTitle=" + hostTitle + "]";
	}
}