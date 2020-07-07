package org.kp.tpmg.ttg.webcare.videovisits.member.web.model;

import java.io.Serializable;
import java.util.List;

public class Question implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 8653102988691427582L;

	public int questionId;
	
	public String question;
	
	public int displayControlId;
	
	public String displayControlName;
	
	public int sequenceNr;
	
	public List<QuestionAnswer> questionAnswers;

	/**
	 * @return the questionId
	 */
	public int getQuestionId() {
		return questionId;
	}

	/**
	 * @param questionId the questionId to set
	 */
	public void setQuestionId(int questionId) {
		this.questionId = questionId;
	}

	/**
	 * @return the question
	 */
	public String getQuestion() {
		return question;
	}

	/**
	 * @param question the question to set
	 */
	public void setQuestion(String question) {
		this.question = question;
	}

	/**
	 * @return the displayControlId
	 */
	public int getDisplayControlId() {
		return displayControlId;
	}

	/**
	 * @param displayControlId the displayControlId to set
	 */
	public void setDisplayControlId(int displayControlId) {
		this.displayControlId = displayControlId;
	}

	/**
	 * @return the displayControlName
	 */
	public String getDisplayControlName() {
		return displayControlName;
	}

	/**
	 * @param displayControlName the displayControlName to set
	 */
	public void setDisplayControlName(String displayControlName) {
		this.displayControlName = displayControlName;
	}

	/**
	 * @return the sequenceNr
	 */
	public int getSequenceNr() {
		return sequenceNr;
	}

	/**
	 * @param sequenceNr the sequenceNr to set
	 */
	public void setSequenceNr(int sequenceNr) {
		this.sequenceNr = sequenceNr;
	}

	/**
	 * @return the questionAnswers
	 */
	public List<QuestionAnswer> getQuestionAnswers() {
		return questionAnswers;
	}

	/**
	 * @param questionAnswers the questionAnswers to set
	 */
	public void setQuestionAnswers(List<QuestionAnswer> questionAnswers) {
		this.questionAnswers = questionAnswers;
	}

	@Override
	public String toString() {
		return "Question [questionId=" + questionId + ", question=" + question + ", displayControlId="
				+ displayControlId + ", displayControlName=" + displayControlName + ", sequenceNr=" + sequenceNr
				+ ", questionAnswers=" + questionAnswers + "]";
	}
	
	
}
