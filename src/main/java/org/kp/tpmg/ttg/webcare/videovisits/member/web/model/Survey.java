package org.kp.tpmg.ttg.webcare.videovisits.member.web.model;

import java.io.Serializable;
import java.util.List;

public class Survey implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 7436210943658835102L;

	public int surveyId;
	
	public String surveyName;
	
	public String surveyText;
	
	public String clientName;
	
	public List<Question> questions;
	
	public boolean providerFl;
	
	public boolean memberFl;

	/**
	 * @return the surveyId
	 */
	public int getSurveyId() {
		return surveyId;
	}

	/**
	 * @param surveyId the surveyId to set
	 */
	public void setSurveyId(int surveyId) {
		this.surveyId = surveyId;
	}

	/**
	 * @return the surveyName
	 */
	public String getSurveyName() {
		return surveyName;
	}

	/**
	 * @param surveyName the surveyName to set
	 */
	public void setSurveyName(String surveyName) {
		this.surveyName = surveyName;
	}

	/**
	 * @return the surveyText
	 */
	public String getSurveyText() {
		return surveyText;
	}

	/**
	 * @param surveyText the surveyText to set
	 */
	public void setSurveyText(String surveyText) {
		this.surveyText = surveyText;
	}

	/**
	 * @return the clientName
	 */
	public String getClientName() {
		return clientName;
	}

	/**
	 * @param clientName the clientName to set
	 */
	public void setClientName(String clientName) {
		this.clientName = clientName;
	}

	/**
	 * @return the questions
	 */
	public List<Question> getQuestions() {
		return questions;
	}

	/**
	 * @param questions the questions to set
	 */
	public void setQuestions(List<Question> questions) {
		this.questions = questions;
	}

	/**
	 * @return the providerFl
	 */
	public boolean isProviderFl() {
		return providerFl;
	}

	/**
	 * @param providerFl the providerFl to set
	 */
	public void setProviderFl(boolean providerFl) {
		this.providerFl = providerFl;
	}

	/**
	 * @return the memberFl
	 */
	public boolean isMemberFl() {
		return memberFl;
	}

	/**
	 * @param memberFl the memberFl to set
	 */
	public void setMemberFl(boolean memberFl) {
		this.memberFl = memberFl;
	}

	@Override
	public String toString() {
		return "Survey [surveyId=" + surveyId + ", surveyName=" + surveyName + ", surveyText=" + surveyText
				+ ", clientName=" + clientName + ", questions=" + questions + ", providerFl=" + providerFl
				+ ", memberFl=" + memberFl + "]";
	}
	
	
}
