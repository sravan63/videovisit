package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.springframework.web.servlet.ModelAndView;

import net.sf.json.JSONObject;

public class ValidateUserSession extends SimplePageController {

	public static final Logger logger = Logger.getLogger(ValidateUserSession.class);
	private static final String JSONMAPPING = "jsonData";

	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		logger.info(LOG_ENTERED);
		String data = "success";
		JSONObject result = new JSONObject();
		try {
			HttpSession session = request.getSession(false);

			String inAppBrowserFlag = request.getParameter("inAppBrowserFlag");
			logger.info("KPPC In-App Browser flow: inAppBrowserFlag=" + inAppBrowserFlag);

			result.put("isValidUserSession", false);
			result.put("success", false);

			if (session != null) {
				if ("true".equalsIgnoreCase(inAppBrowserFlag)) {
					// KPPC inAppBrowser call
					logger.info("KPPC In-App Browser flow");
					result.put("isValidUserSession", true);
					result.put("success", true);
				} else {
					WebAppContext context = WebAppContext.getWebAppContext(request);
					if (request.getParameter("source") != null
							&& request.getParameter("source").equalsIgnoreCase("member")) {
						logger.info("in validateUserSession member");
						if (context != null && context.getMember() != null) {

							String meetingStatus = null;//MeetingCommand.getMeetingStatus(request, response);
							result.put("meetingStatus", meetingStatus);
							result.put("isValidUserSession", true);
							result.put("success", true);
						}
					}

					if (request.getParameter("source") != null
							&& request.getParameter("source").equalsIgnoreCase("caregiver")) {
						if (context != null && context.getCareGiver() == true) {
							result.put("isValidUserSession", true);
							result.put("success", true);
						}
					}
				}
			}
		} catch (Exception e) {
			logger.error("System Error" + e.getMessage(), e);
		}
		data = JSONObject.fromObject(result).toString();
		modelAndView.setViewName(JSONMAPPING);
		modelAndView.addObject("data", data);
		logger.info(LOG_EXITING + "data=" + data);
		return (modelAndView);
	}

}