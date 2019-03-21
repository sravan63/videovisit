package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.AppProperties;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
import org.springframework.web.servlet.ModelAndView;

public class VideoVisitMobilePatientController extends CommonPatientController {

	public static final Logger LOGGER = Logger.getLogger(VideoVisitMobilePatientController.class);

	@Override
	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		LOGGER.info(WebUtil.LOG_ENTERED);
		final String mobileBandwidth;
		final WebAppContext ctx = WebAppContext.getWebAppContext(request);
		if (ctx != null) {
			mobileBandwidth = AppProperties.getExtPropertiesValueByKey("MOBILE_BANDWIDTH");
			if (StringUtils.isNotBlank(mobileBandwidth)) {
				ctx.setBandwidth(mobileBandwidth);
			} else {
				ctx.setBandwidth(WebUtil.BANDWIDTH_512_KBPS);
			}
			LOGGER.info("mobileBandwidth : " + mobileBandwidth);
		}
		final ModelAndView modelAndView = super.handleRequest(request, response);
		LOGGER.info(WebUtil.LOG_EXITING);
		return modelAndView;
	}

}
