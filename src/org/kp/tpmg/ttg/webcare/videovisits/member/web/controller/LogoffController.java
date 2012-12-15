package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.service.DeviceDetectionService;
import org.springframework.web.servlet.ModelAndView;

public class LogoffController extends SimplePageController {

	public static Logger logger = Logger.getLogger(LogoutController.class);
	private String mobileViewName;

	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request, HttpServletResponse response) {
		logger.info("invalidated session Id=" + request.getSession().getId());

		request.getSession().invalidate();
		
		boolean isWirelessDeviceorTablet = DeviceDetectionService.isWirelessDeviceorTablet(request);
		
		if(isWirelessDeviceorTablet){
			return new ModelAndView(mobileViewName);				
		}
		else{
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
