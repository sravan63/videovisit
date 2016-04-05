package org.kp.tpmg.ttg.webcare.videovisits.member.web.data;

import java.io.Serializable;
import java.util.Arrays;

import org.kp.tpmg.videovisit.webserviceobject.xsd.CaregiverWSO;
import org.kp.tpmg.videovisit.webserviceobject.xsd.ProviderWSO;

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
	private String patientFirstName;	
	private String hostLastName;
	private String hostFirstName;
	private String hostTitle;
	private String guestName;
	private String isProvider;
	private String guestUrl;
	private String isMember;
	private String meetingDate;
	private String meetingTime;
	private ProviderWSO[] participants;
	private CaregiverWSO[] caregivers;
	private String vendorConfId;
	private String isProxyMeeting;
	
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

	/**
	 * @return the patientFirstName
	 */
	public String getPatientFirstName() {
		return patientFirstName;
	}
	/**
	 * @param patientFirstName the patientFirstName to set
	 */
	public void setPatientFirstName(String patientFirstName) {
		this.patientFirstName = patientFirstName;
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
	public String getGuestName() {
		return guestName;
	}
	public void setGuestName(String guestName) {
		this.guestName = guestName;
	}
	public String getIsProvider() {
		return isProvider;
	}
	public void setIsProvider(String isProvider) {
		this.isProvider = isProvider;
	}
	public String getGuestUrl() {
		return guestUrl;
	}
	public void setGuestUrl(String guestUrl) {
		this.guestUrl = guestUrl;
	}
	public String getIsMember() {
		return isMember;
	}
	public void setIsMember(String isMember) {
		this.isMember = isMember;
	}	
	/**
	 * @return the participants
	 */
	public ProviderWSO[] getParticipants() {
		return participants;
	}
	/**
	 * @param participants the participants to set
	 */
	public void setParticipants(ProviderWSO[] participants) {
		this.participants = participants;
	}
	/**
	 * @return the caregivers
	 */
	public CaregiverWSO[] getCaregivers() {
		return caregivers;
	}
	/**
	 * @param caregivers the caregivers to set
	 */
	public void setCaregivers(CaregiverWSO[] caregivers) {
		this.caregivers = caregivers;
	}
	/**
	 * @return the meetingTime
	 */
	public String getMeetingTime() {
		return meetingTime;
	}
	/**
	 * @param meetingTime the meetingTime to set
	 */
	public void setMeetingTime(String meetingTime) {
		this.meetingTime = meetingTime;
	}
	/**
	 * @return the meetingDate
	 */
	public String getMeetingDate() {
		return meetingDate;
	}
	/**
	 * @param meetingDate the meetingDate to set
	 */
	public void setMeetingDate(String meetingDate) {
		this.meetingDate = meetingDate;
	}
	/**
	 * @return the vendorConfId
	 */
	public String getVendorConfId() {
		return vendorConfId;
	}
	/**
	 * @param vendorConfId the vendorConfId to set
	 */
	public void setVendorConfId(String vendorConfId) {
		this.vendorConfId = vendorConfId;
	}
	/**
	 * @return the isProxyMeeting
	 */
	public String getIsProxyMeeting() {
		return isProxyMeeting;
	}
	/**
	 * @param isProxyMeeting the isProxyMeeting to set
	 */
	public void setIsProxyMeeting(String isProxyMeeting) {
		this.isProxyMeeting = isProxyMeeting;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "VideoVisitParamsDTO [vidyoUrl=" + vidyoUrl + ", meetingId=" + meetingId + ", userName=" + userName
				+ ", meetingCode=" + meetingCode + ", caregiverId=" + caregiverId + ", patientLastName="
				+ patientLastName + ", patientFirstName=" + patientFirstName + ", hostLastName=" + hostLastName
				+ ", hostFirstName=" + hostFirstName + ", hostTitle=" + hostTitle + ", guestName=" + guestName
				+ ", isProvider=" + isProvider + ", guestUrl=" + guestUrl + ", isMember=" + isMember + ", meetingDate="
				+ meetingDate + ", meetingTime=" + meetingTime + ", participants=" + Arrays.toString(participants)
				+ ", caregivers=" + Arrays.toString(caregivers) + ", vendorConfId=" + vendorConfId + ", isProxyMeeting="
				+ isProxyMeeting + "]";
	}
		
}