package org.kp.tpmg.ttg.webcare.videovisits.member.web.model;

import java.io.Serializable;

public class UserAnswer implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -3823185438220666410L;

	private String answer;
	
	private int questionId;

	/**
	 * @return the answer
	 */
	public String getAnswer() {
		return answer;
	}

	/**
	 * @param answer the answer to set
	 */
	public void setAnswer(String answer) {
		this.answer = answer;
	}

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

	@Override
	public String toString() {
		return "UserAnswer [answer=" + answer + ", questionId=" + questionId + "]";
	}
	
}
