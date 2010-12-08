package org.kp.tpmg.ttg.webcare.videovisits.member.web.context;


//mimic web service API wrapper for returning sytem error the front end
public class SystemError {
	boolean success = false;
	String errorMessage="Internal System Error. Please try again";
	
	public boolean getSuccess()
	{
		return success;
	}
	public void setSuccess(boolean success)
	{
		this.success = success;
	}

	public String getErrorMessage()
	{
		return errorMessage;
	}
	public void setErrorMessage(String errorMessage)
	{
		this.errorMessage = errorMessage;
	}

}
