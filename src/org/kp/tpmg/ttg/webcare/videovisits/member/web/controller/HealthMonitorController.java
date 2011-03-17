package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MonitoringCommand;
import org.springframework.web.servlet.ModelAndView;


public class HealthMonitorController extends SimplePageController {
	public static Logger logger = Logger.getLogger(HealthMonitorController.class);
	
	private String simpleText;
	
	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request, HttpServletResponse response) {
		
		boolean txtMode = "".equals(request.getParameter("text"));
		
		String db = MonitoringCommand.testDbRoundTrip(request, response);
		
		boolean allOk = isOk(db);
		
		if(txtMode)
		{
			int statusCode = 0;
			if(!allOk)
			{
				statusCode = 1;// error
			}
			
			ModelAndView toRet = new ModelAndView("simpleText");
			toRet.addObject("simpleText", "" + statusCode);
			return toRet;
		}
		else
		{
			modelAndView.addObject("db", wrapReturn(db));
			modelAndView.addObject("allOk", allOk);
			return modelAndView;
		}
	}


	
	protected boolean isOk(String val)
	{
		return "OK".equalsIgnoreCase(val);
	}
	
	protected String wrapReturn(String value)
	{
		if (isOk(value))
		{
			return "<font color='green'>" + value + "</font>";
		}
		else return "<font color='red'>" + value + "</font>";
	}

	
	//---- HOUSE KEEPING ---------	
	public String getSimpleText() {
		return simpleText;
	}

	public void setSimpleText(String simpleText) {
		this.simpleText = simpleText;
	}
  
}
