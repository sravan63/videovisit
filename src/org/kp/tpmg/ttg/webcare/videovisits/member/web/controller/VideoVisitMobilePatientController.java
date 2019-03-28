package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.AppProperties;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
import org.springframework.web.servlet.ModelAndView;

public class VideoVisitMobilePatientController extends CommonPatientController {

	@Override
	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.info(WebUtil.LOG_ENTERED);
		final String mobileBandwidth;
		final WebAppContext ctx = WebAppContext.getWebAppContext(request);
		if (ctx != null) {
			mobileBandwidth = AppProperties.getExtPropertiesValueByKey("MOBILE_BANDWIDTH");
			if (StringUtils.isNotBlank(mobileBandwidth)) {
				ctx.setBandwidth(mobileBandwidth);
			} else {
				ctx.setBandwidth(WebUtil.BANDWIDTH_512_KBPS);
			}
			logger.info("mobileBandwidth : " + mobileBandwidth);
		}
		final ModelAndView modelAndView = super.handleRequest(request, response);
		logger.info(WebUtil.LOG_EXITING);
		return modelAndView;
	}

}
