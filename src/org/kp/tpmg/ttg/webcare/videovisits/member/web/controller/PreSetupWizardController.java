package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
import org.springframework.web.servlet.ModelAndView;

public class PreSetupWizardController extends CommonController {

	public static final Logger logger = Logger.getLogger(PreSetupWizardController.class);

	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.info(LOG_ENTERED);
		initProperties();
		final ModelAndView modelAndView = new ModelAndView(getViewName());
		try {
			getEnvironmentCommand().loadDependencies(modelAndView, getNavigation(), getSubNavigation());
			modelAndView.addObject("webrtc", String.valueOf(WebUtil.isChromeOrFFBrowser(request)));
			modelAndView.addObject("webrtcSessionManager", getVidyoWebrtcSessionManager());
			if (StringUtils.isBlank(getBlockChrome())) {
				setBlockChrome("true");
			}
			if (StringUtils.isBlank(getBlockFF())) {
				setBlockFF("true");
			}
			if (StringUtils.isBlank(getBlockEdge())) {
				setBlockEdge("true");
			}
			if (StringUtils.isBlank(getBlockSafari())) {
				setBlockSafari("true");
			}
			if (StringUtils.isBlank(getBlockSafariVersion())) {
				setBlockSafariVersion("12");
			}
			modelAndView.addObject("blockChrome", getBlockChrome());
			modelAndView.addObject("blockFF", getBlockFF());
			modelAndView.addObject("blockEdge", getBlockEdge());
			modelAndView.addObject("blockSafari", getBlockSafari());
			modelAndView.addObject("blockSafariVersion", getBlockSafariVersion());
		} catch (Exception e) {
			logger.error("System Error" + e.getMessage(), e);
		}
		logger.info(LOG_EXITING);
		return modelAndView;
	}

}
