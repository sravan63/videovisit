package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.springframework.web.servlet.ModelAndView;

public class SessionTimeoutController extends SimplePageController {

	public static final Logger logger = Logger.getLogger(SessionTimeoutController.class);
	private static final String JSONMAPPING = "jsonData";

	private int sessionTimeoutInSeconds = 0;

	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		logger.info(LOG_ENTERED);
		String data = "success";
		try {
			HttpSession session = request.getSession(false);
			if (session != null) {

				WebAppContext context = WebAppContext.getWebAppContext(request);
				if (context != null) {
					session.setMaxInactiveInterval(sessionTimeoutInSeconds);
				}
			}

		} catch (Exception e) {
			logger.error("System Error" + e.getMessage(), e);
		}
		modelAndView.setViewName(JSONMAPPING);
		modelAndView.addObject("data", data);
		logger.info(LOG_EXITING + "data=" + data);
		return modelAndView;

	}

	public int getSessionTimeoutInSeconds() {
		return sessionTimeoutInSeconds;
	}

	public void setSessionTimeoutInSeconds(int sessionTimeoutInSeconds) {
		this.sessionTimeoutInSeconds = sessionTimeoutInSeconds;
	}

}
