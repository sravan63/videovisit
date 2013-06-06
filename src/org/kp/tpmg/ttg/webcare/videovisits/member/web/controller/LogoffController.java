package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.service.DeviceDetectionService;

import org.springframework.web.servlet.ModelAndView;

public class LogoffController extends SimplePageController {

	public static Logger logger = Logger.getLogger(LogoffController.class);
	private String mobileViewName;
	
	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request, HttpServletResponse response) {
				
		boolean isWirelessDeviceorTablet = DeviceDetectionService.isWirelessDeviceorTablet(request);
		logger.info("isWirelessDeviceorTablet = " + isWirelessDeviceorTablet);
		logger.info("invalidated session Id=" + request.getSession().getId());
		org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext ctx = org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext.getWebAppContext(request);
		if ( ctx != null)
		{
			if ( ctx.getMeetingId() > 0)
			{
				logger.info("logoffcontroller meeting id present " + ctx.getMeetingId());
				if ( ctx.getMember() != null)
				{
					try
					{
						logger.info("logoffcontroller updating end meeting");
						MeetingCommand.updateEndMeetingLogout(request, response);
					}
					catch(Exception e)
					{
						logger.error(e);
					}
				}
			}
		}
		request.getSession().invalidate();
		
		if ( request.getSession(false) == null)
			logger.info("LogoffController session is null");
		else
			logger.info("LogoffController session is not null");
		if(isWirelessDeviceorTablet){
			return new ModelAndView(mobileViewName);				
		}
		else{
			logger.info("view name = " + modelAndView.getViewName());
			return modelAndView;
		}
	}

	public String getMobileViewName() {
		return mobileViewName;
	}

	public void setMobileViewName(String mobileViewName) {
		this.mobileViewName = mobileViewName;
	}
	
	

}
