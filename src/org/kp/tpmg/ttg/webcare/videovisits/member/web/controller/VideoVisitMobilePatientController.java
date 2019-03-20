package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.common.property.IApplicationProperties;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.AppProperties;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
import org.springframework.web.servlet.ModelAndView;

public class VideoVisitMobilePatientController extends CommonPatientController {
	
	public static final Logger LOGGER = Logger.getLogger(VideoVisitMobilePatientController.class);
	
	private String mobileBandwidth;
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		LOGGER.info(WebUtil.LOG_ENTERED);
		
		final WebAppContext ctx = WebAppContext.getWebAppContext(request);
		if (ctx != null) {
			try {
				final IApplicationProperties appProp = AppProperties.getInstance().getApplicationProperty();
				mobileBandwidth = appProp.getProperty("MOBILE_BANDWIDTH");
			} catch (Exception ex) {
				LOGGER.error("Error while reading external properties file - " + ex.getMessage(), ex);
			}
			if(StringUtils.isNotBlank(mobileBandwidth)) {
				ctx.setBandwidth(mobileBandwidth);
			} else {
				ctx.setBandwidth("512kbps");
			}
		}
		LOGGER.info("mobileBandwidth : " + mobileBandwidth);
		LOGGER.info(WebUtil.LOG_EXITING);
		return super.handleRequest(request, response);
	}

}
