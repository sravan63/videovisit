package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.common.property.IApplicationProperties;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.AppProperties;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
import org.springframework.web.servlet.ModelAndView;

public class PreSetupWizardController extends SimplePageController {

	public static final Logger logger = Logger.getLogger(PreSetupWizardController.class);

	private String vidyoWebrtcSessionManager = null;
	private String blockChrome = null;
	private String blockFF = null;
	private String blockEdge = null;
	private String blockSafari = null;
	private String blockSafariVersion = null;

	public void initProperties() {
		try {
			final IApplicationProperties appProp = AppProperties.getInstance().getApplicationProperty();
			blockChrome = appProp.getProperty("BLOCK_CHROME_BROWSER");
			blockFF = appProp.getProperty("BLOCK_FIREFOX_BROWSER");
			blockEdge = appProp.getProperty("BLOCK_EDGE_BROWSER");
			blockSafari = appProp.getProperty("BLOCK_SAFARI_BROWSER");
			blockSafariVersion = appProp.getProperty("BLOCK_SAFARI_VERSION");
			vidyoWebrtcSessionManager = appProp.getProperty("VIDYO_WEBRTC_SESSION_MANAGER");
			if (StringUtils.isBlank(vidyoWebrtcSessionManager)) {
				vidyoWebrtcSessionManager = WebUtil.VIDYO_WEBRTC_SESSION_MANGER;
			}
		} catch (Exception ex) {
			logger.error("Error while reading external properties file - " + ex.getMessage(), ex);
		}
	}

	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		logger.info(LOG_ENTERED);
		initProperties();
		try {
			modelAndView.addObject("webrtc", String.valueOf(WebUtil.isChromeOrFFBrowser(request)));
			modelAndView.addObject("webrtcSessionManager", vidyoWebrtcSessionManager);
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
