package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
import org.springframework.web.servlet.ModelAndView;

public class PreSetupWizardController extends SimplePageController {

	public static Logger logger = Logger.getLogger(PreSetupWizardController.class);

	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		try {
			modelAndView.addObject("webrtc", String.valueOf(WebUtil.isChromeOrFFBrowser(request)));
			modelAndView.addObject("webrtcSessionManager", WebUtil.getVidyoWebrtcSessionManager());
		} catch (Exception e) {
			logger.error("PreSetupWizardController - System Error" + e.getMessage(), e);
		}
		return (modelAndView);
	}

}
