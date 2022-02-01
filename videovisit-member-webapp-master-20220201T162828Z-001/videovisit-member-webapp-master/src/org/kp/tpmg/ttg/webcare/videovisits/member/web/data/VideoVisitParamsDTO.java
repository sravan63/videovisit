package org.kp.tpmg.ttg.webcare.videovisits.member.web.data;

import java.io.Serializable;
import java.util.List;

import org.kp.tpmg.videovisit.model.VendorConfig;
import org.kp.tpmg.videovisit.model.meeting.SipParticipant;
import org.kp.tpmg.videovisit.model.user.Caregiver;
import org.kp.tpmg.videovisit.model.user.Provider;

public class VideoVisitParamsDTO implements Serializable {

	private static final long serialVersionUID = 3440770105989838012L;
	
	private String roomUrl;
	private String meetingId;
	private String userName;
	private String meetingCode;
	private String caregiverId;
	private String patientMiddleName;
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
	private List<Provider> participant;
	private List<Caregiver> caregiver;
	private String vendorConfId;
	private String isProxyMeeting;
	private String webrtc = "false";
	private String vendor;
	private String vendorHostPin;
	private String vendorGuestPin;
	private String vendorRole;
	private List<SipParticipant> sipParticipants;
	private VendorConfig vendorConfig;

	/**
	 * @return the roomUrl
	 */
	public String getRoomUrl() {
		return roomUrl;
	}

	/**
	 * @param roomUrl the roomUrl to set
	 */
	public void setRoomUrl(String roomUrl) {
		this.roomUrl = roomUrl;
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
	 * @param patientFirstName
	 *            the patientFirstName to set
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
	 * @return the meetingTime
	 */
	public String getMeetingTime() {
		return meetingTime;
	}

	/**
	 * @param meetingTime
	 *            the meetingTime to set
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
	 * @param meetingDate
	 *            the meetingDate to set
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
	 * @param vendorConfId
	 *            the vendorConfId to set
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
	 * @param isProxyMeeting
	 *            the isProxyMeeting to set
	 */
	public void setIsProxyMeeting(String isProxyMeeting) {
		this.isProxyMeeting = isProxyMeeting;
	}

	public void setParticipant(List<Provider> participant) {
		this.participant = participant;
	}

	public List<Provider> getParticipant() {
		return participant;
	}

	public void setCaregiver(List<Caregiver> caregiver) {
		this.caregiver = caregiver;
	}

	public List<Caregiver> getCaregiver() {
		return caregiver;
	}

	/**
	 * @return the patientMiddleName
	 */
	public String getPatientMiddleName() {
		return patientMiddleName;
	}

	/**
	 * @param patientMiddleName
	 *            the patientMiddleName to set
	 */
	public void setPatientMiddleName(String patientMiddleName) {
		this.patientMiddleName = patientMiddleName;
	}

	/**
	 * @return the webrtc
	 */
	public String getWebrtc() {
		return webrtc;
	}

	/**
	 * @param webrtc
	 *            the webrtc to set
	 */
	public void setWebrtc(String webrtc) {
		this.webrtc = webrtc;
	}

	/**
	 * @return the vendor
	 */
	public String getVendor() {
		return vendor;
	}

	/**
	 * @param vendor the vendor to set
	 */
	public void setVendor(String vendor) {
		this.vendor = vendor;
	}

	/**
	 * @return the vendorHostPin
	 */
	public String getVendorHostPin() {
		return vendorHostPin;
	}

	/**
	 * @param vendorHostPin the vendorHostPin to set
	 */
	public void setVendorHostPin(String vendorHostPin) {
		this.vendorHostPin = vendorHostPin;
	}

	/**
	 * @return the vendorGuestPin
	 */
	public String getVendorGuestPin() {
		return vendorGuestPin;
	}

	/**
	 * @param vendorGuestPin the vendorGuestPin to set
	 */
	public void setVendorGuestPin(String vendorGuestPin) {
		this.vendorGuestPin = vendorGuestPin;
	}

	/**
	 * @return the vendorRole
	 */
	public String getVendorRole() {
		return vendorRole;
	}

	/**
	 * @param vendorRole the vendorRole to set
	 */
	public void setVendorRole(String vendorRole) {
		this.vendorRole = vendorRole;
	}

	/**
	 * @return the sipParticipants
	 */
	public List<SipParticipant> getSipParticipants() {
		return sipParticipants;
	}

	/**
	 * @param sipParticipants the sipParticipants to set
	 */
	public void setSipParticipants(List<SipParticipant> sipParticipants) {
		this.sipParticipants = sipParticipants;
	}

	/**
	 * @return the vendorConfig
	 */
	public VendorConfig getVendorConfig() {
		return vendorConfig;
	}

	/**
	 * @param vendorConfig the vendorConfig to set
	 */
	public void setVendorConfig(VendorConfig vendorConfig) {
		this.vendorConfig = vendorConfig;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		final int maxLen = 10;
		return "VideoVisitParamsDTO [roomUrl=" + roomUrl + ", meetingId=" + meetingId + ", userName=" + userName
				+ ", meetingCode=" + meetingCode + ", caregiverId=" + caregiverId + ", patientMiddleName="
				+ patientMiddleName + ", patientLastName=" + patientLastName + ", patientFirstName=" + patientFirstName
				+ ", hostLastName=" + hostLastName + ", hostFirstName=" + hostFirstName + ", hostTitle=" + hostTitle
				+ ", guestName=" + guestName + ", isProvider=" + isProvider + ", guestUrl=" + guestUrl + ", isMember="
				+ isMember + ", meetingDate=" + meetingDate + ", meetingTime=" + meetingTime + ", participant="
				+ (participant != null ? participant.subList(0, Math.min(participant.size(), maxLen)) : null)
				+ ", caregiver=" + (caregiver != null ? caregiver.subList(0, Math.min(caregiver.size(), maxLen)) : null)
				+ ", vendorConfId=" + vendorConfId + ", isProxyMeeting=" + isProxyMeeting + ", webrtc=" + webrtc
				+ ", vendor=" + vendor + ", vendorHostPin=" + vendorHostPin + ", vendorGuestPin=" + vendorGuestPin
				+ ", vendorRole=" + vendorRole + ", sipParticipants="
				+ (sipParticipants != null ? sipParticipants.subList(0, Math.min(sipParticipants.size(), maxLen))
						: null)
				+ ", vendorConfig=" + vendorConfig + "]";
	}

	
	
}