package org.kp.tpmg.ttg.webcare.videovisits.member.web.model;

import java.io.Serializable;

public class QuestionAnswer implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 130061543365212702L;

	public String displayAnswer;
	
	public boolean defaultSelected;

	/**
	 * @return the displayAnswer
	 */
	public String getDisplayAnswer() {
		return displayAnswer;
	}

	/**
	 * @param displayAnswer the displayAnswer to set
	 */
	public void setDisplayAnswer(String displayAnswer) {
		this.displayAnswer = displayAnswer;
	}

	/**
	 * @return the defaultSelected
	 */
	public boolean isDefaultSelected() {
		return defaultSelected;
	}

	/**
	 * @param defaultSelected the defaultSelected to set
	 */
	public void setDefaultSelected(boolean defaultSelected) {
		this.defaultSelected = defaultSelected;
	}

	@Override
	public String toString() {
		return "QuestionAnswer [displayAnswer=" + displayAnswer + ", defaultSelected=" + defaultSelected + "]";
	}
	
	

}
