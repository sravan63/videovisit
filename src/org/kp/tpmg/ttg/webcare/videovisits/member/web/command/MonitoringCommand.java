package org.kp.tpmg.ttg.webcare.videovisits.member.web.command;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.service.WebService;
import org.kp.tpmg.videovisit.webserviceobject.xsd.UpdateResponseWrapper;


public class MonitoringCommand {

	public static Logger logger = Logger.getLogger(MonitoringCommand.class);
	
	
	public static String testDbRoundTrip(HttpServletRequest request, HttpServletResponse response)
	{
		logger.info("testDbRoundTrip entered");
		String toRet = null;
		try
		{
			UpdateResponseWrapper result = WebService.testDbRoundTrip();
			if(result.getSuccess())
			{
				toRet = "OK";
			}
			else toRet = "errorID=" + result.getErrorIdentifier(); //+ " message=" + result.getErrorMessage();
		}
		catch(Throwable th)
		{
			toRet = "failed in calling testDbRoundTrip - EXCEPTION";// + th.getMessage();
			logger.error(toRet, th);
		}
		
		logger.info("testDbRoundTrip exited toRet=[" + toRet + "]" );
		return toRet;
	}
	
}
