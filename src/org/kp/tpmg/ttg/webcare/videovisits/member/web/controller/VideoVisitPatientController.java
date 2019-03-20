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

public class VideoVisitPatientController extends CommonPatientController {
	
	public static final Logger LOGGER = Logger.getLogger(VideoVisitPatientController.class);
	
	private String desktopBandwidth;
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		LOGGER.info(WebUtil.LOG_ENTERED);
		
		final WebAppContext ctx = WebAppContext.getWebAppContext(request);
		if (ctx != null) {
			try {
				final IApplicationProperties appProp = AppProperties.getInstance().getApplicationProperty();
				desktopBandwidth = appProp.getProperty("DESKTOP_BANDWIDTH");
			} catch (Exception ex) {
				LOGGER.error("Error while reading external properties file - " + ex.getMessage(), ex);
			}
			if(StringUtils.isNotBlank(desktopBandwidth)) {
				ctx.setBandwidth(desktopBandwidth);
			} else {
				ctx.setBandwidth("1024kbps");
			}
		}
		LOGGER.info("desktopBandwidth : " + desktopBandwidth);
		LOGGER.info(WebUtil.LOG_EXITING);
		return super.handleRequest(request, response);
	}

}
