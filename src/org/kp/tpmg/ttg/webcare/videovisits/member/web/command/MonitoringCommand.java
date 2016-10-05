package org.kp.tpmg.ttg.webcare.videovisits.member.web.command;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.service.WebService;
import org.kp.tpmg.videovisit.model.ServiceCommonOutput;
import org.kp.tpmg.videovisit.model.ServiceCommonOutputJson;
import org.kp.tpmg.videovisit.webserviceobject.xsd.StringResponseWrapper;



public class MonitoringCommand {

	public static Logger logger = Logger.getLogger(MonitoringCommand.class);
	
	
	public static String testDbRoundTrip(HttpServletRequest request, HttpServletResponse response)
	{
		logger.info("MonitoringCommand.testDbRoundTrip entered");
		String toRet = null;
		try
		{
			// Init web service 	
			boolean success = WebService.initWebService(request);
			logger.info("MonitoringCommand.testDbRoundTrip -> WebService.initWebService: " + success);
			
			ServiceCommonOutputJson result = WebService.testDbRoundTrip();
			
			if(result != null && result.getService() != null 
					&& result.getService().getStatus() != null)
			{
				if("200".equals(result.getService().getStatus().getCode())){
					toRet = "OK";
				}else{
					toRet = result.getService().getStatus().getMessage();
				}
			}
			else{
				toRet = "Failure";
			} 
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
