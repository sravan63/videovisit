package org.kp.tpmg.ttg.webcare.videovisits.member.web.model;

import java.io.Serializable;
import java.util.List;

public class ActiveSurveysResponse implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 5846030610776462767L;
	
	public String code;
	public List<Survey> surveys;
	/**
	 * @return the code
	 */
	public String getCode() {
		return code;
	}
	/**
	 * @param code the code to set
	 */
	public void setCode(String code) {
		this.code = code;
	}
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
