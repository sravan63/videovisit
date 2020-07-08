package org.kp.tpmg.ttg.webcare.videovisits.member.web.model;

import java.io.Serializable;
import java.util.List;

public class ActiveSurveysResponse extends Response implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 5846030610776462767L;
	
	public List<Survey> surveys;

	/**
	 * @return the surveys
	 */
	public List<Survey> getSurveys() {
		return surveys;
	}
	/**
	 * @param surveys the surveys to set
	 */
	public void setSurveys(List<Survey> surveys) {
		this.surveys = surveys;
	}
	@Override
	public String toString() {
		return "ActiveSurveysResponse [code=" + code + ", surveys=" + surveys + "]";
	}

	

}
