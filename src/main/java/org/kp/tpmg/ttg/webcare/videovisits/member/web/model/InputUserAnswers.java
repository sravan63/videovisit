package org.kp.tpmg.ttg.webcare.videovisits.member.web.model;

import java.io.Serializable;
import java.util.List;

public class InputUserAnswers implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -2695331375987420446L;

	private String userType;
	
	private String userValue;
	
	private int meetingId;
	
	private List<UserAnswer> userAnswers;
	
	private  String clientId;
	
	private String sessionId;

	/**
	 * @return the userType
	 */
	public String getUserType() {
		return userType;
	}

	/**
	 * @param userType the userType to set
	 */
	public void setUserType(String userType) {
		this.userType = userType;
	}

	/**
	 * @return the userValue
	 */
	public String getUserValue() {
		return userValue;
	}

	/**
	 * @param userValue the userValue to set
	 */
	public void setUserValue(String userValue) {
		this.userValue = userValue;
	}

	/**
	 * @return the meetingId
	 */
	public int getMeetingId() {
		return meetingId;
	}

	/**
	 * @param meetingId the meetingId to set
	 */
	public void setMeetingId(int meetingId) {
		this.meetingId = meetingId;
	}

	/**
	 * @return the userAnswers
	 */
	public List<UserAnswer> getUserAnswers() {
		return userAnswers;
	}

	/**
	 * @param userAnswers the userAnswers to set
	 */
	public void setUserAnswers(List<UserAnswer> userAnswers) {
		this.userAnswers = userAnswers;
	}

	/**
	 * @return the clientId
	 */
	public String getClientId() {
		return clientId;
	}

	/**
	 * @param clientId the clientId to set
	 */
	public void setClientId(String clientId) {
		this.clientId = clientId;
	}

	/**
	 * @return the sessionId
	 */
	public String getSessionId() {
		return sessionId;
	}

	/**
	 * @param sessionId the sessionId to set
	 */
	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}

	@Override
	public String toString() {
		return "InputUserAnswers [userType=" + userType + ", userValue=" + userValue + ", meetingId=" + meetingId
				+ ", userAnswers=" + userAnswers + ", clientId=" + clientId + ", sessionId=" + sessionId + "]";
	}

}
