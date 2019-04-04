package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.AppProperties.getExtPropertiesValueByKey;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
import org.springframework.web.servlet.ModelAndView;

public class PreSetupWizardController extends CommonController {

	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.info(LOG_ENTERED);
		final ModelAndView modelAndView = new ModelAndView(getViewName());
		try {
			getEnvironmentCommand().loadDependencies(modelAndView, getNavigation(), getSubNavigation());
			modelAndView.addObject("webrtc", String.valueOf(WebUtil.isChromeOrFFBrowser(request)));
			modelAndView.addObject("webrtcSessionManager", getVidyoWebrtcSessionManager());
			String blockChrome = getExtPropertiesValueByKey("BLOCK_CHROME_BROWSER");
			String blockFF = getExtPropertiesValueByKey("BLOCK_FIREFOX_BROWSER");
			String blockEdge = getExtPropertiesValueByKey("BLOCK_EDGE_BROWSER");
			String blockSafari = getExtPropertiesValueByKey("BLOCK_SAFARI_BROWSER");
			String blockSafariVersion = getExtPropertiesValueByKey("BLOCK_SAFARI_VERSION");
			if (StringUtils.isBlank(blockChrome)) {
				blockChrome = "true";
			}
			if (StringUtils.isBlank(blockFF)) {
				blockFF = "true";
			}
			if (StringUtils.isBlank(blockEdge)) {
				blockEdge = "true";
			}
			if (StringUtils.isBlank(blockSafari)) {
				blockSafari = "true";
			}
			if (StringUtils.isBlank(blockSafariVersion)) {
				blockSafariVersion = "12";
			}
			modelAndView.addObject("blockChrome", blockChrome);
			modelAndView.addObject("blockFF", blockFF);
			modelAndView.addObject("blockEdge", blockEdge);
			modelAndView.addObject("blockSafari", blockSafari);
			modelAndView.addObject("blockSafariVersion", blockSafariVersion);
		} catch (Exception e) {
			logger.error("System Error" + e.getMessage(), e);
		}
		logger.info(LOG_EXITING);
		return modelAndView;
	}

}
